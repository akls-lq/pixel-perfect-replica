import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  X,
  Bookmark,
  ArrowUpRight,
  Bot,
} from "lucide-react";
import { usePreferences } from "@/components/preferences/usePreferences";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { FilterModal } from "@/components/workspace/FilterModal";
import {
  emptyCriteria,
  restoreCriteria,
  options,
  futureMonths,
  selectDemoJobs,
  type Group,
  type SearchCriteria,
} from "@/lib/autopilot-data";
import { PageTitle, EmptyState } from "@/components/workspace/Shared";
export const Route = createFileRoute("/app/offers")({ component: Autopilot });
function Autopilot() {
  const { t, language } = usePreferences();
  const { saved, toggleSaved, reviewJob } = useWorkspace();
  const [criteria, setCriteria] = useState<SearchCriteria>(emptyCriteria);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [modal, setModal] = useState(false);
  const [result, setResult] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  useEffect(() => {
    try {
      setCriteria(restoreCriteria(JSON.parse(localStorage.getItem("cretoria.criteria") || "{}")));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("cretoria.criteria", JSON.stringify(criteria));
      } catch {
        setStorageError(true);
      }
    setResult(false);
  }, [criteria, ready]);
  const set = (next: SearchCriteria) => {
    setCriteria(next);
    setResult(false);
  };
  const selected = selectDemoJobs(criteria);
  const active = selected.find((j) => j.id === focused) ?? selected[0];
  const months = futureMonths(new Date());
  const chips = (
    Object.keys(emptyCriteria).filter((k) => k !== "q" && k !== "city") as Group[]
  ).flatMap((group) =>
    criteria[group].map((value) => ({
      group,
      value,
      label:
        group === "start"
          ? value === "asap"
            ? t("Dès que possible", "As soon as possible")
            : months.find((m) => m.value === value)
              ? t(
                  months.find((m) => m.value === value)!.fr,
                  months.find((m) => m.value === value)!.en,
                )
              : value
          : t(
              options(group).find((o) => o.value === value)?.fr ?? value,
              options(group).find((o) => o.value === value)?.en ?? value,
            ),
    })),
  );
  return (
    <>
      <PageTitle
        eyebrow={t("UNE RECHERCHE À TON IMAGE", "SEARCH, YOUR WAY")}
        title={t("Configurons ta prochaine opportunité.", "Let’s find your next opportunity.")}
        description={t(
          "Les bons critères, une sélection à relire. L’Autopilote reste entièrement sous ton contrôle.",
          "The right criteria, a shortlist to review. You stay in control of Autopilot.",
        )}
      />
      <section className="panel !p-4 md:!p-6">
        <div className="grid items-center gap-1 rounded-2xl border bg-background/40 p-2 md:grid-cols-[1.3fr_.8fr_1fr] md:divide-x">
          <label className="flex items-center gap-3 px-3 py-3">
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              aria-label={t("Mots-clés ou entreprise", "Keywords or company")}
              value={criteria.q}
              onChange={(e) => set({ ...criteria, q: e.target.value })}
              className="w-full min-w-0 bg-transparent text-sm outline-none"
              placeholder={t("Offre, entreprise ou mot-clé…", "Job, company or keyword…")}
            />
          </label>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="flex items-center gap-3">
                  <BriefcaseBusiness size={18} />
                  {t("Contrat", "Contract")}
                  {criteria.contracts.length > 0 && ` (${criteria.contracts.length})`}
                </span>
                <ChevronDown size={15} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="start"
                sideOffset={15}
                className="z-40 max-h-80 w-72 overflow-y-auto rounded-2xl border bg-popover p-3 shadow-elegant"
                aria-label={t("Types de contrat", "Contract types")}
              >
                {options("contracts").map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer gap-3 rounded-lg p-3 text-sm hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={criteria.contracts.includes(o.value)}
                      onChange={() =>
                        set({
                          ...criteria,
                          contracts: criteria.contracts.includes(o.value)
                            ? criteria.contracts.filter((x) => x !== o.value)
                            : [...criteria.contracts, o.value],
                        })
                      }
                    />
                    {t(o.fr, o.en)}
                  </label>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <label className="flex items-center gap-3 px-4 py-3">
            <MapPin size={18} className="shrink-0" />
            <input
              aria-label={t("Ville, département ou région", "City, department or region")}
              value={criteria.city}
              onChange={(e) => set({ ...criteria, city: e.target.value })}
              className="w-full min-w-0 bg-transparent text-sm outline-none"
              placeholder={t("Ville, département, région…", "City, department, region…")}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 rounded-xl border bg-secondary/50 px-4 py-3 text-sm font-semibold"
          >
            <SlidersHorizontal size={17} />
            {t("Tous les filtres", "All filters")}
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary-text">
              {chips.length}
            </span>
          </button>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot size={16} />
            {t(
              "Configuration locale · Aucune candidature automatique",
              "Local configuration · No automated applications",
            )}
          </p>
        </div>
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c.group + c.value}
                onClick={() =>
                  set({ ...criteria, [c.group]: criteria[c.group].filter((v) => v !== c.value) })
                }
                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary-text"
                aria-label={`${t("Retirer", "Remove")} ${c.label}`}
              >
                {c.label}
                <X size={12} />
              </button>
            ))}
            <button
              onClick={() => set(emptyCriteria)}
              className="text-xs font-bold text-muted-foreground"
            >
              {t("Tout effacer", "Clear all")}
            </button>
          </div>
        )}
      </section>
      {modal && (
        <FilterModal
          open={modal}
          onClose={() => setModal(false)}
          value={criteria}
          onApply={(value) => {
            set(value);
            setModal(false);
          }}
        />
      )}
      <div className="my-6 flex flex-wrap items-center gap-4">
        <button disabled={!ready} onClick={() => setResult(true)} className="btn-primary">
          <Search size={17} />
          {t("Lancer la recherche", "Run search")}
        </button>
        {result && (
          <p role="status" className="text-sm font-semibold text-primary-text">
            {t("Mode démonstration : configuration prête", "Demo mode: configuration ready")}
          </p>
        )}
      </div>
      {storageError && (
        <p role="status" className="mb-4 text-xs text-muted-foreground">
          {t(
            "Stockage navigateur indisponible : les critères restent dans cette session.",
            "Browser storage unavailable: criteria stay in this session.",
          )}
        </p>
      )}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold">
          {selected.length} {t("offre(s) de démonstration", "demo listing(s)")}
        </h2>
        <span className="text-xs text-muted-foreground">
          {t("Exemples filtrés localement", "Examples filtered locally")}
        </span>
      </div>
      {selected.length === 0 ? (
        <EmptyState
          title={t("Aucun exemple avec ces critères.", "No examples match these criteria.")}
        >
          {t(
            "Élargis la sélection : le catalogue démo contient huit offres.",
            "Broaden your selection: the demo catalogue contains eight jobs.",
          )}
        </EmptyState>
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-[1fr_1fr]">
          <ul className="space-y-3">
            {selected.map((j) => (
              <li
                key={j.id}
                className={`panel !rounded-2xl !p-5 ${active?.id === j.id ? "!border-primary/60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      setFocused(j.id);
                      reviewJob(j.id);
                    }}
                    aria-pressed={active?.id === j.id}
                  >
                    <h3 className="font-bold">{j.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {j.company} · {j.city}
                    </p>
                  </button>
                  <button
                    onClick={() => toggleSaved(j.id)}
                    aria-label={`${saved.includes(j.id) ? t("Retirer", "Remove") : t("Sauvegarder", "Save")} ${j.title}`}
                    aria-pressed={saved.includes(j.id)}
                    className="rounded-lg border p-2 text-primary-text"
                  >
                    <Bookmark size={16} fill={saved.includes(j.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {[
                    j.contract,
                    j.remote,
                    `${j.salary.toLocaleString(language === "fr" ? "fr-FR" : "en-GB")} € / ${t("an", "year")}`,
                  ].map((s) => (
                    <span key={s} className="rounded-lg bg-secondary/60 px-2 py-1">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("Démonstration · Score illustratif", "Demo · Illustrative score")} : {j.score}{" "}
                  %
                </p>
              </li>
            ))}
          </ul>
          {active && (
            <article className="panel">
              <span className="text-xs font-bold text-primary-text">
                {t("APERÇU FICTIF", "FICTIONAL PREVIEW")}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold">{active.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {active.company} · {active.city}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Ce poste est un exemple pour tester tes critères. Aucun moteur de recherche externe ni envoi réel n’est connecté. Les scores ne sont pas calculés sur ton CV.",
                  "This listing is an example for testing your criteria. No external search engine or real submissions are connected. Scores are not based on your CV.",
                )}
              </p>
              <div className="mt-5 rounded-2xl bg-secondary/50 p-4 text-sm">
                <p className="font-bold">{t("Compétences de l’exemple", "Example skills")}</p>
                <p className="mt-2 text-muted-foreground">{active.skills.join(" · ")}</p>
                <p className="mt-4 font-bold">{t("À renforcer", "To develop")}</p>
                <p className="mt-2 text-muted-foreground">{active.excludedSkills.join(" · ")}</p>
              </div>
              <button
                onClick={() => reviewJob(active.id)}
                className="mt-5 text-sm font-semibold text-primary-text"
              >
                {t("J’ai étudié ce matching", "I reviewed this match")}
              </button>
              <Link
                to="/app/cv-studio"
                className="mt-6 flex items-center gap-2 border-t pt-4 text-sm font-bold text-primary-text"
              >
                {t("Préparer mes CV", "Prepare my CVs")}
                <ArrowUpRight size={16} />
              </Link>
            </article>
          )}
        </div>
      )}
    </>
  );
}
