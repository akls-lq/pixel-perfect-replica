import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Bot,
  Bookmark,
  ArrowUpRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import { jobs, filterJobs, emptyFilters, type JobFilters } from "@/lib/workspace-data";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { PageTitle, EmptyState } from "@/components/workspace/Shared";
export const Route = createFileRoute("/app/offers")({
  head: () => ({ meta: [{ title: "Offres et Autopilot — Crétoria" }] }),
  component: Offers,
});
function Offers() {
  const [filters, setFilters] = useState<JobFilters>(emptyFilters);
  const [sort, setSort] = useState("match");
  const [savedOnly, setSavedOnly] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [simulation, setSimulation] = useState(false);
  const { saved, toggleSaved, reviewJob } = useWorkspace();
  const set = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setSimulation(false);
  };
  const results = useMemo(
    () =>
      filterJobs(jobs, filters)
        .filter((j) => !savedOnly || saved.includes(j.id))
        .sort((a, b) =>
          sort === "recent"
            ? a.publishedDays - b.publishedDays
            : sort === "salary"
              ? b.salary - a.salary
              : b.score - a.score,
        ),
    [filters, savedOnly, saved, sort],
  );
  const active = results.find((j) => j.id === focused) ?? results[0];
  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== "autopilot" && v !== "" && v !== false,
  ).length;
  const selects: { key: keyof JobFilters; label: string; options: string[]; values?: string[] }[] =
    [
      {
        key: "sector",
        label: "Secteur d’activité",
        options: [...new Set(jobs.map((j) => j.sector))],
      },
      { key: "remote", label: "Mode de travail", options: ["Sur site", "Hybride", "Télétravail"] },
      {
        key: "salary",
        label: "Salaire annuel brut minimum",
        options: ["20 000 €", "35 000 €", "45 000 €", "60 000 €"],
        values: ["20000", "35000", "45000", "60000"],
      },
      {
        key: "experience",
        label: "Expérience requise au maximum",
        options: ["Débutant · 0 an", "1 an", "2 ans", "3 ans", "5 ans"],
        values: ["0", "1", "2", "3", "5"],
      },
      {
        key: "duration",
        label: "Durée du contrat",
        options: ["Sans terme · CDI", "3 mois", "6 mois", "9 mois", "12 mois"],
        values: ["0", "3", "6", "9", "12"],
      },
      { key: "hours", label: "Temps de travail", options: ["Temps plein", "Temps partiel"] },
      {
        key: "education",
        label: "Diplôme demandé",
        options: ["Sans exigence", "Bac +3", "Bac +5"],
      },
      { key: "language", label: "Langue demandée", options: ["Français", "Anglais"] },
      {
        key: "published",
        label: "Offres publiées depuis",
        options: ["24 heures", "3 jours", "7 jours", "30 jours"],
        values: ["1", "3", "7", "30"],
      },
      {
        key: "minScore",
        label: "Compatibilité illustrative minimum",
        options: ["60 %", "75 %", "85 %", "90 %"],
        values: ["60", "75", "85", "90"],
      },
    ];
  return (
    <>
      <PageTitle
        eyebrow="DES OPPORTUNITÉS QUI TE RESSEMBLENT"
        title="La bonne offre. Les bons critères."
        description="Affine ta recherche et découvre pourquoi une opportunité pourrait te correspondre. Toutes les offres et leurs scores sont fictifs."
      />
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            document
              .getElementById("job-results")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <div className="grid items-end gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="text-xs font-bold">
              <span className="flex gap-1.5">
                <Search size={14} /> Métier ou compétence
              </span>
              <input
                className="field"
                value={filters.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Designer, React, marketing…"
              />
            </label>
            <label className="text-xs font-bold">
              <span className="flex gap-1.5">
                <MapPin size={14} /> Lieu de résidence / ville visée
              </span>
              <input
                className="field"
                value={filters.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Paris, Lyon…"
              />
            </label>
            <label className="text-xs font-bold">
              Type de contrat
              <select
                className="field"
                value={filters.contract}
                onChange={(e) => set("contract", e.target.value)}
              >
                <option value="">Tous les contrats</option>
                {["CDI", "CDD", "Stage", "Alternance", "Freelance", "Intérim"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn-primary h-[50px]">
              <Search size={16} /> Rechercher
            </button>
          </div>
        </form>
        <details className="group mt-5 border-t pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-primary-text" /> Filtres avancés &
              Autopilot{" "}
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                {activeCount} actif{activeCount > 1 ? "s" : ""}
              </span>
            </span>
            <ChevronDown size={18} className="transition group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-xs text-muted-foreground">
            Tous les critères se combinent. Les options non renseignées restent ouvertes.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selects.map((s) => (
              <label key={s.key} className="text-xs font-bold">
                {s.label}
                <select
                  value={String(filters[s.key])}
                  onChange={(e) => set(s.key, e.target.value as never)}
                  className="field"
                >
                  <option value="">Indifférent</option>
                  {s.options.map((o, i) => (
                    <option key={o} value={s.values?.[i] ?? o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="text-xs font-bold">
              Mois de prise de poste
              <input
                aria-label="Mois de prise de poste"
                className="field"
                type="month"
                value={filters.startMonth}
                onChange={(e) => set("startMonth", e.target.value)}
              />
              <span className="mt-1 block font-normal text-muted-foreground">
                Exemples disponibles : janvier, mars et avril 2027.
              </span>
            </label>
            <label className="text-xs font-bold">
              Compétences indispensables
              <input
                className="field"
                value={filters.skills}
                onChange={(e) => set("skills", e.target.value)}
                placeholder="React, TypeScript"
              />
              <span className="mt-1 block font-normal text-muted-foreground">
                Séparer les compétences par des virgules.
              </span>
            </label>
            <label className="text-xs font-bold">
              Exclure des mots-clés ou entreprises
              <input
                className="field"
                value={filters.exclude}
                onChange={(e) => set("exclude", e.target.value)}
                placeholder="Finance, Studio Halo…"
              />
            </label>
          </div>
          <div className="my-5 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.asap}
                onChange={(e) => set("asap", e.target.checked)}
              />{" "}
              Prise de poste dès que possible
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.accessible}
                onChange={(e) => set("accessible", e.target.checked)}
              />{" "}
              Accessibilité du poste renseignée
            </label>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <Bot className="shrink-0 text-primary-text" />
              <div>
                <h2 className="text-sm font-bold">Autopilot · Préparer une sélection</h2>
                <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                  L’Autopilot utilise les critères ci-dessus pour te proposer une liste à relire.
                  Cette simulation ne lance aucune recherche externe, ne génère aucun document et
                  n’envoie aucune candidature.
                </p>
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.autopilot}
                onChange={(e) => set("autopilot", e.target.checked)}
              />{" "}
              Utiliser ces critères pour ma simulation Autopilot
            </label>
            <button
              disabled={!filters.autopilot}
              onClick={() => setSimulation(true)}
              className="btn-primary mt-4"
            >
              <Bot size={16} /> Simuler ma sélection
            </button>
            {simulation && (
              <p role="status" className="mt-3 flex items-center gap-2 text-sm">
                <Check size={16} /> {results.length} offre{results.length > 1 ? "s" : ""} fictive
                {results.length > 1 ? "s" : ""} sélectionnée{results.length > 1 ? "s" : ""}. Aucun
                envoi effectué.
              </p>
            )}
          </div>
        </details>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
            />{" "}
            Mes offres sauvegardées ({saved.length})
          </label>
          <button
            onClick={() => {
              setFilters(emptyFilters);
              setSavedOnly(false);
              setSimulation(false);
            }}
            className="text-xs font-bold text-primary-text"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </section>
      <section id="job-results" className="scroll-mt-44 pt-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 aria-live="polite" className="font-bold">
            {results.length} opportunité{results.length > 1 ? "s" : ""}{" "}
            <span className="text-sm font-normal text-muted-foreground">· Démonstration</span>
          </h2>
          <label className="text-xs">
            Trier par{" "}
            <select
              className="ml-2 rounded-lg border bg-card p-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="match">Compatibilité</option>
              <option value="recent">Plus récentes</option>
              <option value="salary">Salaire</option>
            </select>
          </label>
        </div>
        {results.length === 0 ? (
          <EmptyState title="Aucune offre avec ces critères.">
            Élargis la localisation ou retire un filtre. Le catalogue de démonstration contient huit
            offres.
          </EmptyState>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.1fr]">
            <ul className="space-y-3">
              {results.map((j) => (
                <li
                  key={j.id}
                  className={`rounded-xl border bg-card p-4 transition ${active?.id === j.id ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 font-bold text-primary-text">
                      {j.company.slice(0, 2).toUpperCase()}
                    </span>
                    <button
                      onClick={() => {
                        setFocused(j.id);
                        reviewJob(j.id);
                        if (window.innerWidth < 1024)
                          requestAnimationFrame(() => {
                            const detail = document.getElementById("offer-detail");
                            detail?.focus({ preventScroll: true });
                            detail?.scrollIntoView({ behavior: "smooth", block: "start" });
                          });
                      }}
                      className="min-w-0 flex-1 text-left"
                      aria-pressed={active?.id === j.id}
                    >
                      <h3 className="font-bold">{j.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {j.company} · {j.city} · Fictif
                      </p>
                    </button>
                    <button
                      onClick={() => toggleSaved(j.id)}
                      aria-label={`${saved.includes(j.id) ? "Retirer" : "Sauvegarder"} ${j.title}`}
                      aria-pressed={saved.includes(j.id)}
                      className="rounded-lg border p-2 text-primary-text"
                    >
                      <Bookmark size={17} fill={saved.includes(j.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {[
                      j.contract,
                      j.remote,
                      `${(j.salary / 1000).toLocaleString("fr-FR")} k€ / an`,
                    ].map((t) => (
                      <span key={t} className="rounded-md bg-secondary px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between border-t pt-3 text-xs">
                    <span className="font-bold text-teal-800">{j.score} % · Matching fictif</span>
                    <span className="text-muted-foreground">Il y a {j.publishedDays} j</span>
                  </div>
                </li>
              ))}
            </ul>
            {active && (
              <article
                id="offer-detail"
                tabIndex={-1}
                className="panel scroll-mt-44 lg:sticky lg:top-40"
              >
                <div className="flex justify-between gap-3">
                  <span className="rounded-full bg-progress/15 px-3 py-1 text-xs font-bold">
                    Offre fictive
                  </span>
                  <span className="text-xs text-muted-foreground">{active.sector}</span>
                </div>
                <h2 className="mt-5 text-2xl font-extrabold">{active.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {active.company} · {active.city}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-secondary p-4 text-xs">
                  <p>
                    <strong className="block">Contrat</strong>
                    {active.contract}
                    {active.duration ? ` · ${active.duration} mois` : " · Sans terme"}
                  </p>
                  <p>
                    <strong className="block">Rémunération fictive</strong>
                    {active.salary.toLocaleString("fr-FR")} € brut / an
                  </p>
                  <p>
                    <strong className="block">Organisation</strong>
                    {active.remote} · {active.hours}
                  </p>
                  <p>
                    <strong className="block">Début souhaité</strong>
                    {active.asap
                      ? "Dès que possible"
                      : new Date(active.startMonth + "-01T12:00:00Z").toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                          timeZone: "Europe/Paris",
                        })}
                  </p>
                </div>
                <h3 className="mt-6 font-bold">Une mission pour faire la différence</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Rejoins une équipe pluridisciplinaire autour de projets de{" "}
                  {active.sector.toLowerCase()}. Tu contribueras à la conception, à l’amélioration
                  continue et au partage des bonnes pratiques. Description illustrative, sans poste
                  ouvert réel.
                </p>
                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <h3 className="text-sm font-bold">Pourquoi ce matching ?</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Score prédéfini de {active.score} %, non calculé sur ton CV. Une estimation
                    illustrative, jamais une garantie.
                  </p>
                  <p className="mt-3 text-xs">
                    <strong>Points présents dans l’exemple :</strong> {active.skills.join(", ")}.
                  </p>
                  <p className="mt-2 text-xs">
                    <strong>À renforcer :</strong> {active.excludedSkills.join(", ")}.
                  </p>
                  <button
                    onClick={() => reviewJob(active.id)}
                    className="mt-3 text-xs font-bold text-primary-text"
                  >
                    J’ai étudié cette compatibilité
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => toggleSaved(active.id)} className="btn-primary">
                    <Bookmark size={16} />
                    {saved.includes(active.id)
                      ? "Retirer de ma sélection"
                      : "Sauvegarder cette offre"}
                  </button>
                  <Link
                    to="/app/cv-studio"
                    className="flex items-center gap-1 text-sm font-bold text-primary-text"
                  >
                    Ajouter mon CV <ArrowUpRight size={16} />
                  </Link>
                </div>
                <p className="mt-5 flex items-start gap-2 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck size={16} className="shrink-0" />
                  Source externe non connectée. Aucune candidature ni création de compte employeur
                  depuis cette page.
                </p>
              </article>
            )}
          </div>
        )}
      </section>
    </>
  );
}
