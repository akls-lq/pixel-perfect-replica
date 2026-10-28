// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { findMapCity, inMapBounds } from "@/lib/map-data";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
function noCredentials() {
  for (const key of [
    "FRANCE_TRAVAIL_CLIENT_ID",
    "FRANCE_TRAVAIL_CLIENT_SECRET",
    "GREENHOUSE_BOARDS",
    "LEVER_BOARDS",
  ])
    vi.stubEnv(key, "");
}
const arbeitnowJob = {
  slug: "source-test-job",
  title: "Software Engineer",
  company_name: "Test company",
  location: "Berlin, Germany",
  url: "https://www.arbeitnow.com/jobs/test-job",
  job_types: ["Full-time"],
};
describe("Sources réelles de la carte", () => {
  it("ne contacte pas les fournisseurs non configurés et localise une ville connue", async () => {
    noCredentials();
    const fetcher = vi.fn<typeof fetch>(async () => Response.json({ data: [arbeitnowJob] }));
    const { loadMapFeed } = await import("@/lib/job-sources.server");
    const feed = await loadMapFeed({ q: "", commune: "" }, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(feed.sources.map((s) => s.status)).toEqual([
      "not-configured",
      "connected",
      "not-configured",
      "not-configured",
    ]);
    expect(feed.offers[0]?.coordinates).toEqual([13.405, 52.52]);
    expect(feed.offers[0]?.approximate).toBe(true);
  });
  it("authentifie France Travail côté serveur et préserve les longs jetons", async () => {
    noCredentials();
    vi.stubEnv("FRANCE_TRAVAIL_CLIENT_ID", "test-client");
    vi.stubEnv("FRANCE_TRAVAIL_CLIENT_SECRET", "test-secret");
    const accessToken = "x".repeat(2000);
    const fetcher = vi.fn<typeof fetch>(async (input, init) => {
      const url = String(input);
      if (url.includes("access_token")) {
        expect(String(init?.body)).toContain("client_secret=test-secret");
        return Response.json({ access_token: accessToken, expires_in: 300 });
      }
      if (url.includes("francetravail.io")) {
        expect(new URL(url).searchParams.get("commune")).toBe("75056");
        expect(new URL(url).searchParams.get("motsCles")).toBe("ingénieur");
        expect(recordHeader(init, "Authorization")).toBe(`Bearer ${accessToken}`);
        return Response.json({
          resultats: [
            {
              id: "test-id",
              intitule: "Ingénieur",
              entreprise: { nom: "Employeur test" },
              lieuTravail: { libelle: "Paris", latitude: "48.86", longitude: "2.35" },
              origineOffre: { urlOrigine: "javascript:alert(1)" },
              typeContrat: "CDI",
              salaire: { libelle: "40 000 EUR/an" },
            },
          ],
        });
      }
      return Response.json({ data: [] });
    });
    const { loadMapFeed } = await import("@/lib/job-sources.server");
    const feed = await loadMapFeed({ q: "ingénieur", commune: "75056" }, fetcher);
    expect(feed.offers[0]).toMatchObject({
      coordinates: [2.35, 48.86],
      approximate: false,
      salary: "40 000 EUR/an",
      url: "https://candidat.francetravail.fr/offres/recherche/detail/test-id",
    });
    expect(JSON.stringify(feed)).not.toContain("test-secret");
    expect(JSON.stringify(feed)).not.toContain(accessToken);
  });
  it("isole une panne, refuse les URL exécutables et garde les lieux inconnus hors carte", async () => {
    noCredentials();
    vi.stubEnv("FRANCE_TRAVAIL_CLIENT_ID", "failed-client");
    vi.stubEnv("FRANCE_TRAVAIL_CLIENT_SECRET", "test-secret");
    const fetcher = vi.fn<typeof fetch>(async (input) =>
      String(input).includes("access_token")
        ? new Response("upstream error", { status: 503 })
        : Response.json({
            data: [
              arbeitnowJob,
              {
                ...arbeitnowJob,
                slug: "unknown",
                location: "Remote",
                url: "https://www.arbeitnow.com/jobs/remote",
              },
              { ...arbeitnowJob, slug: "unsafe", url: "javascript:alert(1)" },
            ],
          }),
    );
    const { loadMapFeed } = await import("@/lib/job-sources.server");
    const feed = await loadMapFeed({ q: "", commune: "" }, fetcher);
    expect(feed.sources[0]?.status).toBe("unavailable");
    expect(feed.sources[1]?.status).toBe("connected");
    expect(feed.offers).toHaveLength(2);
    expect(feed.offers[1]?.coordinates).toBeNull();
  });
  it("charge les sites carrières configurés sans autoriser d’hôtes arbitraires", async () => {
    noCredentials();
    vi.stubEnv("GREENHOUSE_BOARDS", "test-board,https://bad.example");
    vi.stubEnv("LEVER_BOARDS", "test-team");
    const fetcher = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.includes("greenhouse.io"))
        return Response.json({
          jobs: [
            {
              id: 12,
              title: "Analyst",
              location: { name: "Paris, France" },
              absolute_url: "https://jobs.example.org/one",
            },
          ],
        });
      if (url.includes("lever.co"))
        return Response.json([
          {
            id: "lever-job",
            text: "Designer",
            categories: { location: "London", commitment: "Full-time" },
            hostedUrl: "https://jobs.example.org/two",
          },
        ]);
      return Response.json({ data: [] });
    });
    const { loadMapFeed } = await import("@/lib/job-sources.server");
    const feed = await loadMapFeed({ q: "", commune: "" }, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(feed.offers.map((o) => o.source)).toEqual(["greenhouse", "lever"]);
    expect(feed.offers.every((o) => o.coordinates !== null)).toBe(true);
    expect(fetcher.mock.calls.every(([input]) => !String(input).includes("bad.example"))).toBe(
      true,
    );
  });
});
function recordHeader(init: RequestInit | undefined, key: string) {
  return new Headers(init?.headers).get(key);
}
describe("Emprise de la carte", () => {
  it("gère le passage de l’antiméridien et les mondes décalés", () => {
    const pacific = { west: 170, east: 195, south: -80, north: 80 };
    expect(inMapBounds([-175, 25], pacific)).toBe(true);
    expect(inMapBounds([175, 25], pacific)).toBe(true);
    expect(inMapBounds([0, 25], pacific)).toBe(false);
    expect(inMapBounds([2, 48], { west: -220, east: 220, south: -80, north: 80 })).toBe(true);
    expect(inMapBounds(null, pacific)).toBe(false);
  });
  it("reconnaît les alias sans inventer les coordonnées des villes inconnues", () => {
    expect(findMapCity("München, Germany")?.name).toBe("Munich");
    expect(findMapCity("Londres")?.name).toBe("London");
    expect(findMapCity("Ville inconnue")).toBeUndefined();
  });
});
