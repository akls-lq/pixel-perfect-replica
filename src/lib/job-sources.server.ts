import {
  findMapCity,
  uniqueMapOffers,
  type MapFeed,
  type MapOffer,
  type JobSourceId,
} from "./map-data";

type Row = Record<string, unknown>;
type Query = { q: string; commune: string; offset?: number };
type FrancePage = {
  offers: MapOffer[];
  nextOffset: number | null;
  total: number | null;
  limitReached: boolean;
};
type Fetcher = typeof fetch;
const record = (v: unknown): Row => (v && typeof v === "object" ? (v as Row) : {});
const text = (v: unknown) => (typeof v === "string" ? v.slice(0, 1000) : "");
const rows = (v: unknown): Row[] => (Array.isArray(v) ? v.slice(0, 500).map(record) : []);
function coordinate(v: unknown) {
  if (typeof v !== "number" && typeof v !== "string") return NaN;
  if (typeof v === "string" && !v.trim()) return NaN;
  return Number(v);
}
function webURL(v: unknown) {
  try {
    const url = new URL(text(v));
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
function located(location: string) {
  const city = findMapCity(location);
  return { coordinates: city?.coordinates ?? null, approximate: !!city };
}
function offer(
  source: JobSourceId,
  row: Row,
  fields: Omit<MapOffer, "id" | "source">,
): MapOffer | null {
  const id = text(row["id"] ?? row["slug"]);
  return id && fields.title && fields.url ? { ...fields, id: `${source}:${id}`, source } : null;
}
async function responseJSON(fetcher: Fetcher, url: string, init?: RequestInit) {
  const response = await fetcher(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Job source unavailable");
  return { response, data: response.status === 204 ? {} : ((await response.json()) as unknown) };
}
async function json(fetcher: Fetcher, url: string, init?: RequestInit) {
  return (await responseJSON(fetcher, url, init)).data;
}
let token: { value: string; expires: number; clientId: string } | undefined;
async function franceTravail(query: Query, fetcher: Fetcher): Promise<FrancePage | null> {
  const clientId = process.env["FRANCE_TRAVAIL_CLIENT_ID"];
  const secret = process.env["FRANCE_TRAVAIL_CLIENT_SECRET"];
  if (!clientId || !secret) return null;
  if (!token || token.expires < Date.now() || token.clientId !== clientId) {
    const auth = record(
      await json(
        fetcher,
        "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire",
        {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: secret,
            scope: "api_offresdemploiv2 o2dsoffre",
          }),
        },
      ),
    );
    if (
      typeof auth["access_token"] !== "string" ||
      !auth["access_token"] ||
      auth["access_token"].length > 16384
    )
      throw new Error("Job source unavailable");
    token = {
      value: auth["access_token"],
      clientId,
      expires:
        Date.now() + Math.max(0, Math.min(Number(auth["expires_in"]) || 300, 3600) - 30) * 1000,
    };
  }
  const offset = query.offset ?? 0;
  const params = new URLSearchParams({ range: `${offset}-${offset + 149}`, sort: "1" });
  if (query.q) params.set("motsCles", query.q);
  if (query.commune) {
    params.set("commune", query.commune);
    params.set("distance", "30");
  }
  const { response, data: raw } = await responseJSON(
    fetcher,
    `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${params}`,
    { headers: { Authorization: `Bearer ${token.value}`, Accept: "application/json" } },
  );
  const data = record(raw);
  const results = rows(data["resultats"]).slice(0, 150);
  const range = response.headers.get("content-range")?.match(/(\d+)-(\d+)\/(\d+|\*)/);
  const total = range?.[3] && range[3] !== "*" ? Number(range[3]) : null;
  const more = total !== null ? offset + results.length < total : results.length === 150;
  const nextOffset = more && results.length > 0 && offset < 3000 ? offset + 150 : null;
  const offers = results
    .map((r) => {
      const place = record(r["lieuTravail"]);
      const latitude = coordinate(place["latitude"]);
      const longitude = coordinate(place["longitude"]);
      const coordinates: [number, number] | null =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180
          ? [longitude, latitude]
          : null;
      const origin = record(r["origineOffre"]);
      const partnerLinks = rows(origin["partenaires"])
        .map((p) => ({ name: text(p["nom"]), url: webURL(p["url"]) }))
        .filter((p) => p.name && p.url);
      return offer("france-travail", r, {
        title: text(r["intitule"]),
        company: text(record(r["entreprise"])["nom"]),
        location: text(place["libelle"]),
        coordinates,
        approximate: false,
        url:
          webURL(origin["urlOrigine"]) ||
          partnerLinks[0]?.url ||
          `https://candidat.francetravail.fr/offres/recherche/detail/${encodeURIComponent(text(r["id"]))}`,
        contract: text(r["typeContratLibelle"]) || text(r["typeContrat"]),
        salary: text(record(r["salaire"])["libelle"]),
        ...(partnerLinks.length ? { partnerLinks } : {}),
      });
    })
    .filter((r): r is MapOffer => r !== null);
  return { offers, nextOffset, total, limitReached: more && offset >= 3000 };
}

// These are licensed, owner-configured JSON feeds, not public search APIs.
// A standard LinkedIn OAuth app does not grant access to its full job catalogue.
async function partnerFeed(
  source: "linkedin" | "hellowork",
  fetcher: Fetcher,
): Promise<MapOffer[] | null> {
  const prefix = source === "linkedin" ? "LINKEDIN" : "HELLOWORK";
  const url = process.env[`${prefix}_JOBS_FEED_URL`];
  if (!url) return null;
  if (!webURL(url)) throw new Error("Job source unavailable");
  const bearer = process.env[`${prefix}_JOBS_FEED_TOKEN`];
  const data = record(
    await json(
      fetcher,
      url,
      bearer ? { headers: { Authorization: `Bearer ${bearer}` } } : undefined,
    ),
  );
  if (!Array.isArray(data["offers"])) throw new Error("Job source unavailable");
  const domain = source === "linkedin" ? "linkedin.com" : "hellowork.com";
  return rows(data["offers"])
    .map((r) => {
      const sourceUrl = webURL(r["url"]);
      if (!sourceUrl) return null;
      const host = new URL(sourceUrl).hostname;
      if (host !== domain && !host.endsWith(`.${domain}`)) return null;
      const latitude = coordinate(r["latitude"]);
      const longitude = coordinate(r["longitude"]);
      const exact =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180;
      const id =
        typeof r["id"] === "number" && Number.isFinite(r["id"]) ? String(r["id"]) : text(r["id"]);
      const location = text(r["location"]);
      return offer(
        source,
        { id },
        {
          title: text(r["title"]),
          company: text(r["company"]),
          location,
          ...(exact
            ? { coordinates: [longitude, latitude] as [number, number], approximate: false }
            : located(location)),
          url: sourceUrl,
          contract: text(r["contract"]),
          salary: text(r["salary"]),
        },
      );
    })
    .filter((r): r is MapOffer => r !== null);
}
async function arbeitnow(fetcher: Fetcher): Promise<MapOffer[]> {
  const data = record(await json(fetcher, "https://www.arbeitnow.com/api/job-board-api"));
  return rows(data["data"])
    .map((r) =>
      offer("arbeitnow", r, {
        title: text(r["title"]),
        company: text(r["company_name"]),
        location: text(r["location"]),
        ...located(text(r["location"])),
        url: webURL(r["url"]),
        contract: Array.isArray(r["job_types"])
          ? r["job_types"].map(text).filter(Boolean).join(" · ")
          : "",
        salary: "",
      }),
    )
    .filter((r): r is MapOffer => r !== null);
}
function boards(key: string) {
  return (process.env[key] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(s))
    .slice(0, 5);
}
async function greenhouse(fetcher: Fetcher): Promise<MapOffer[] | null> {
  const slugs = boards("GREENHOUSE_BOARDS");
  if (!slugs.length) return null;
  const lists = await Promise.all(
    slugs.map(async (slug) => {
      const data = record(
        await json(fetcher, `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`),
      );
      return rows(data["jobs"])
        .map((r) =>
          offer(
            "greenhouse",
            { ...r, id: `${slug}:${r["id"]}` },
            {
              title: text(r["title"]),
              company: text(data["name"]) || slug,
              location: text(record(r["location"])["name"]),
              ...located(text(record(r["location"])["name"])),
              url: webURL(r["absolute_url"]),
              contract: "",
              salary: "",
            },
          ),
        )
        .filter((r): r is MapOffer => r !== null);
    }),
  );
  return lists.flat();
}
async function lever(fetcher: Fetcher): Promise<MapOffer[] | null> {
  const slugs = boards("LEVER_BOARDS");
  if (!slugs.length) return null;
  const lists = await Promise.all(
    slugs.map(async (slug) => {
      const data = await json(fetcher, `https://api.lever.co/v0/postings/${slug}?mode=json`);
      return rows(data)
        .map((r) =>
          offer(
            "lever",
            { ...r, id: `${slug}:${r["id"]}` },
            {
              title: text(r["text"]),
              company: slug,
              location: text(record(r["categories"])["location"]),
              ...located(text(record(r["categories"])["location"])),
              url: webURL(r["hostedUrl"]),
              contract: text(record(r["categories"])["commitment"]),
              salary: "",
            },
          ),
        )
        .filter((r): r is MapOffer => r !== null);
    }),
  );
  return lists.flat();
}
export async function loadMapFeed(query: Query, fetcher: Fetcher = fetch): Promise<MapFeed> {
  const providers = [
    {
      id: "france-travail" as const,
      name: "France Travail",
      load: () => franceTravail(query, fetcher),
    },
    ...((query.offset ?? 0) > 0
      ? []
      : [
          {
            id: "linkedin" as const,
            name: "LinkedIn",
            load: () => partnerFeed("linkedin", fetcher),
          },
          {
            id: "hellowork" as const,
            name: "HelloWork",
            load: () => partnerFeed("hellowork", fetcher),
          },
          { id: "arbeitnow" as const, name: "Arbeitnow", load: () => arbeitnow(fetcher) },
          { id: "greenhouse" as const, name: "Greenhouse", load: () => greenhouse(fetcher) },
          { id: "lever" as const, name: "Lever", load: () => lever(fetcher) },
        ]),
  ];
  const results = await Promise.allSettled(providers.map((p) => p.load()));
  const offers: MapOffer[] = [];
  const first = results[0];
  const francePage =
    first?.status === "fulfilled" && first.value && !Array.isArray(first.value)
      ? first.value
      : null;
  const sources = results.map((result, i) => {
    const { id, name } = providers[i]!;
    if (result.status === "rejected")
      return { id, name, status: "unavailable" as const, loaded: 0 };
    if (result.value === null) return { id, name, status: "not-configured" as const, loaded: 0 };
    const sourceOffers = Array.isArray(result.value) ? result.value : result.value.offers;
    offers.push(...sourceOffers);
    return { id, name, status: "connected" as const, loaded: sourceOffers.length };
  });
  return {
    offers: uniqueMapOffers(offers),
    sources,
    fetchedAt: new Date().toISOString(),
    nextFranceTravailOffset: francePage?.nextOffset ?? null,
    franceTravailTotal: francePage?.total ?? null,
    franceTravailLimitReached: francePage?.limitReached ?? false,
  };
}
