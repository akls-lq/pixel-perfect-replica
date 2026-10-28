import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ExternalLink,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import { usePreferences } from "@/components/preferences/usePreferences";
import { PageTitle } from "@/components/workspace/Shared";
import { JobGlobe, type MapFocus } from "@/components/workspace/JobGlobe";
import {
  findMapCity,
  inMapBounds,
  mapCities,
  normalizePlace,
  type MapBounds,
  type MapFeed,
} from "@/lib/map-data";

export const Route = createFileRoute("/app/map")({
  head: () => ({ meta: [{ title: "Carte des offres — Crétoria" }] }),
  component: JobMap,
});
function JobMap() {
  const { t } = usePreferences();
  const [feed, setFeed] = useState<MapFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [onlyVisible, setOnlyVisible] = useState(true);
  const [selected, setSelected] = useState("");
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const controller = useRef<AbortController | null>(null);
  const center = useRef<[number, number]>([6, 28]);
  const list = useRef<HTMLDivElement>(null);
  const load = useCallback(async (q: string, commune = "") => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError("");
    setAppliedKeyword(q);
    try {
      const response = await fetch(`/api/job-map?${new URLSearchParams({ q, commune })}`, {
        signal: request.signal,
      });
      if (!response.ok) throw Error("unavailable");
      const data = (await response.json()) as MapFeed;
      if (!request.signal.aborted) setFeed(data);
    } catch {
      if (!request.signal.aborted) setError("unavailable");
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load("");
    return () => controller.current?.abort();
  }, [load]);
  const offers = useMemo(
    () =>
      (feed?.offers ?? []).filter(
        (offer) =>
          !appliedKeyword ||
          normalizePlace(`${offer.title} ${offer.company}`).includes(
            normalizePlace(appliedKeyword),
          ),
      ),
    [feed, appliedKeyword],
  );
  const visible = useMemo(
    () =>
      offers.filter((offer) => !onlyVisible || !bounds || inMapBounds(offer.coordinates, bounds)),
    [offers, onlyVisible, bounds],
  );
  const onViewport = useCallback((next: MapBounds, nextCenter: [number, number]) => {
    setBounds(next);
    center.current = nextCenter;
  }, []);
  useEffect(() => {
    if (selected)
      list.current
        ?.querySelector<HTMLElement>(`[data-offer-id="${CSS.escape(selected)}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [selected]);
  function search() {
    const match = city.trim() ? findMapCity(city) : undefined;
    if (city.trim() && !match) {
      setError("city");
      return;
    }
    if (match)
      setFocus((old) => ({
        coordinates: match.coordinates,
        zoom: 9,
        revision: (old?.revision ?? 0) + 1,
      }));
    setSelected("");
    void load(keyword, match?.commune);
  }
  function searchArea() {
    const [lng, lat] = center.current;
    const near = mapCities.find(
      (c) =>
        c.commune &&
        Math.abs(c.coordinates[0] - lng) < 0.3 &&
        Math.abs(c.coordinates[1] - lat) < 0.3,
    );
    setOnlyVisible(true);
    void load(keyword, near?.commune);
  }
  return (
    <>
      <PageTitle
        eyebrow={t("LE MONDE DES POSSIBLES", "A WORLD OF POSSIBILITIES")}
        title={t("Ton prochain job, quelque part ici.", "Your next job is out there.")}
        description={t(
          "Du globe à ta ville : explore les opportunités et ouvre les offres qui t’intéressent.",
          "From the globe to your city: explore opportunities and open the jobs that interest you.",
        )}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
        className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4"
      >
        <label className="w-full min-w-0 text-xs font-semibold sm:w-auto sm:min-w-48 sm:flex-1">
          {t("Poste ou entreprise", "Job title or company")}
          <span className="relative mt-2 block">
            <Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              className="w-full rounded-xl border bg-background py-3 pl-9 pr-3 text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              maxLength={100}
              placeholder={t("Poste, entreprise…", "Job title, company…")}
            />
          </span>
        </label>
        <label className="w-full min-w-0 text-xs font-semibold sm:w-auto sm:min-w-48 sm:flex-1">
          {t("Explorer une ville", "Explore a city")}
          <span className="relative mt-2 block">
            <MapPin size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              list="job-map-cities"
              className="w-full rounded-xl border bg-background py-3 pl-9 pr-3 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris, Lyon, Berlin…"
            />
            <datalist id="job-map-cities">
              {mapCities.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </span>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? <LoaderCircle className="animate-spin" size={17} /> : <Search size={17} />}
          {t("Explorer", "Explore")}
        </button>
      </form>
      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {error === "city"
            ? t(
                "Choisis une ville dans la liste proposée. Tu peux aussi déplacer librement la carte.",
                "Choose a city from the suggestions, or move the map freely.",
              )
            : t(
                "Impossible d’actualiser les sources. Réessaie dans un instant.",
                "Unable to refresh job sources. Please try again shortly.",
              )}
        </p>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <JobGlobe offers={offers} focus={focus} onSelect={setSelected} onViewport={onViewport} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              {offers.filter((o) => o.coordinates).length}{" "}
              {t("offres géolocalisées", "geolocated jobs")} · {offers.length}{" "}
              {t("offres chargées", "loaded jobs")}
            </p>
            <button
              type="button"
              onClick={searchArea}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 font-semibold text-primary-text disabled:opacity-50"
            >
              <RefreshCw size={13} />
              {t("Rechercher dans cette zone", "Search this area")}
            </button>
          </div>
        </div>
        <section
          className="panel !p-4"
          aria-label={t("Offres d’emploi de la carte", "Map job listings")}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">{t("Les opportunités", "Opportunities")}</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary-text">
              {visible.length}
            </span>
          </div>
          <label className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={onlyVisible}
              onChange={(e) => setOnlyVisible(e.target.checked)}
            />
            {t("Uniquement dans la zone visible", "Only in the visible area")}
          </label>
          <div
            ref={list}
            className="max-h-[520px] space-y-3 overflow-y-auto pr-1"
            aria-busy={loading}
          >
            {loading && (
              <p role="status" className="py-12 text-center text-sm text-muted-foreground">
                {t("Recherche auprès des sources…", "Checking job sources…")}
              </p>
            )}
            {!loading && visible.length === 0 && (
              <div className="rounded-2xl border border-dashed px-4 py-10 text-center">
                <BriefcaseBusiness size={26} className="mx-auto mb-3 text-primary-text" />
                <p className="text-sm font-semibold">
                  {t("Aucune offre chargée dans cette zone.", "No loaded jobs in this area.")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(
                    "Explore une autre zone ou consulte l’état des sources ci-dessous.",
                    "Explore another area or check the source status below.",
                  )}
                </p>
              </div>
            )}
            {!loading &&
              visible.map((offer) => (
                <article
                  key={offer.id}
                  data-offer-id={offer.id}
                  className={`rounded-2xl border p-4 ${selected === offer.id ? "border-primary bg-primary/5" : "bg-background/40"}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-text">
                    {feed?.sources.find((s) => s.id === offer.source)?.name}
                  </p>
                  <h3 className="mt-2 text-sm font-bold">
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => {
                        setSelected(offer.id);
                        if (offer.coordinates)
                          setFocus((old) => ({
                            coordinates: offer.coordinates!,
                            zoom: 10,
                            revision: (old?.revision ?? 0) + 1,
                          }));
                      }}
                    >
                      {offer.title}
                    </button>
                  </h3>
                  {offer.company && (
                    <p className="mt-1 text-xs text-muted-foreground">{offer.company}</p>
                  )}
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    {offer.location || t("Localisation non précisée", "Location not specified")}
                  </p>
                  {offer.approximate && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {t("Position au centre de la ville", "Positioned at the city centre")}
                    </p>
                  )}
                  {offer.contract && <p className="mt-2 text-xs">{offer.contract}</p>}
                  {offer.salary && <p className="mt-2 text-xs font-semibold">{offer.salary}</p>}
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary-text"
                  >
                    {t("Voir l’offre", "View job")}
                    <ExternalLink size={13} />
                  </a>
                </article>
              ))}
          </div>
          <p className="mt-4 border-t pt-3 text-[10px] leading-relaxed text-muted-foreground">
            {t(
              "Les chiffres concernent les offres chargées, pas l’ensemble du marché. Certaines offres ne disposent pas de coordonnées.",
              "Counts refer to loaded jobs, not the entire job market. Some listings have no coordinates.",
            )}
          </p>
        </section>
      </div>
      <details className="mt-5 rounded-2xl border bg-card p-4" open={!loading && !offers.length}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
          {t("Sources d’offres", "Job sources")}
          <ChevronDown size={16} />
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {feed?.sources.map((source) => (
            <div key={source.id} className="rounded-xl border p-3">
              <p className="text-sm font-semibold">{source.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {source.status === "connected"
                  ? `${source.loaded} ${t("offres chargées", "loaded jobs")}`
                  : source.status === "not-configured"
                    ? t("Connexion à configurer", "Connection required")
                    : t("Source momentanément indisponible", "Source temporarily unavailable")}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {t(
            "France Travail nécessite un accès API. Greenhouse et Lever utilisent les sites carrières configurés. LinkedIn, Indeed, HelloWork et Glassdoor nécessitent leurs propres autorisations : ils ne sont pas encore connectés.",
            "France Travail requires API access. Greenhouse and Lever use configured career boards. LinkedIn, Indeed, HelloWork and Glassdoor require their own permissions and are not connected yet.",
          )}
        </p>
      </details>
    </>
  );
}
