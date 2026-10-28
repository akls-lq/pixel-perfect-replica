import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  X,
  Bot,
} from "lucide-react";
import { usePreferences } from "@/components/preferences/usePreferences";
import { FilterModal } from "@/components/workspace/FilterModal";
import {
  emptyCriteria,
  restoreCriteria,
  options,
  futureMonths,
  type Group,
  type SearchCriteria,
} from "@/lib/autopilot-data";
import { PageTitle, EmptyState } from "@/components/workspace/Shared";
export const Route = createFileRoute("/app/offers")({ component: Autopilot });
function Autopilot() {
  const { t } = usePreferences();
  const [criteria, setCriteria] = useState<SearchCriteria>(emptyCriteria);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [modal, setModal] = useState(false);
  const [result, setResult] = useState(false);
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
          "Définis tes critères de recherche. L’Autopilote reste entièrement sous ton contrôle.",
          "Define your search criteria. You stay in control of Autopilot.",
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
      <EmptyState title={t("Aucune source d’offres connectée.", "No job source connected.")}>
        {t(
          "Configure tes critères ci-dessus. Les offres apparaîtront lorsque la recherche sera connectée à des sources réelles. Aucune candidature n’est envoyée depuis cette page.",
          "Set your criteria above. Listings will appear once search is connected to real sources. No applications are sent from this page.",
        )}
      </EmptyState>
    </>
  );
}
