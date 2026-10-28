import { findMapCity, type MapFeed, type MapOffer, type JobSourceId } from "./map-data";

type Row = Record<string, unknown>;
type Query = { q: string; commune: string };
type Fetcher = typeof fetch;
const record = (v: unknown): Row => (v && typeof v === "object" ? (v as Row) : {});
const text = (v: unknown) => (typeof v === "string" ? v.slice(0, 1000) : "");
const rows = (v: unknown): Row[] => (Array.isArray(v) ? v.slice(0, 500).map(record) : []);
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
async function json(fetcher: Fetcher, url: string, init?: RequestInit) {
  const response = await fetcher(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Job source unavailable");
  return response.status === 204 ? {} : ((await response.json()) as unknown);
}
let token: { value: string; expires: number; clientId: string } | undefined;
async function franceTravail(query: Query, fetcher: Fetcher): Promise<MapOffer[] | null> {
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
  const params = new URLSearchParams({ range: "0-149", sort: "1" });
  if (query.q) params.set("motsCles", query.q);
  if (query.commune) {
    params.set("commune", query.commune);
    params.set("distance", "30");
  }
  const data = record(
    await json(
      fetcher,
      `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${params}`,
      { headers: { Authorization: `Bearer ${token.value}`, Accept: "application/json" } },
    ),
  );
  return rows(data["resultats"])
    .map((r) => {
      const place = record(r["lieuTravail"]);
      const latitude =
        place["latitude"] === undefined || place["latitude"] === null || place["latitude"] === ""
          ? NaN
          : Number(place["latitude"]);
      const longitude =
        place["longitude"] === undefined || place["longitude"] === null || place["longitude"] === ""
          ? NaN
          : Number(place["longitude"]);
      const coordinates: [number, number] | null =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180
          ? [longitude, latitude]
          : null;
      return offer("france-travail", r, {
        title: text(r["intitule"]),
        company: text(record(r["entreprise"])["nom"]),
        location: text(place["libelle"]),
        coordinates,
        approximate: false,
        url:
          webURL(record(r["origineOffre"])["urlOrigine"]) ||
          `https://candidat.francetravail.fr/offres/recherche/detail/${encodeURIComponent(text(r["id"]))}`,
        contract: text(r["typeContratLibelle"]) || text(r["typeContrat"]),
        salary: text(record(r["salaire"])["libelle"]),
      });
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
    { id: "arbeitnow" as const, name: "Arbeitnow", load: () => arbeitnow(fetcher) },
    { id: "greenhouse" as const, name: "Greenhouse", load: () => greenhouse(fetcher) },
    { id: "lever" as const, name: "Lever", load: () => lever(fetcher) },
  ];
  const results = await Promise.allSettled(providers.map((p) => p.load()));
  const offers: MapOffer[] = [];
  const sources = results.map((result, i) => {
    const { id, name } = providers[i]!;
    if (result.status === "rejected")
      return { id, name, status: "unavailable" as const, loaded: 0 };
    if (result.value === null) return { id, name, status: "not-configured" as const, loaded: 0 };
    offers.push(...result.value);
    return { id, name, status: "connected" as const, loaded: result.value.length };
  });
  const seen = new Set<string>();
  return {
    offers: offers.filter((o) => {
      // Identical source URLs are the only cross-provider duplicate signal we can trust.
      if (seen.has(o.url)) return false;
      seen.add(o.url);
      return true;
    }),
    sources,
    fetchedAt: new Date().toISOString(),
  };
}
