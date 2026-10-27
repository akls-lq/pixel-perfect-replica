import { Building2, Check, CircleHelp, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { demoJobs } from "@/components/site/demo-data";
import type { SearchState } from "./HeroSearch";
import { DemoBadge, ScoreRing } from "./shared";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export function OffersSection({ search, onReset }: { search: SearchState; onReset: () => void }) {
  const results = useMemo(
    () =>
      demoJobs
        .filter(
          (j) =>
            !search.q ||
            norm(`${j.title} ${j.present.join(" ")} ${j.missing.join(" ")}`).includes(
              norm(search.q),
            ),
        )
        .filter((j) => !search.city || norm(j.city).includes(norm(search.city)))
        .filter((j) => search.contract === "Tous" || j.contract === search.contract)
        .sort((a, b) => b.score - a.score),
    [search],
  );
  const [sel, setSel] = useState<string | null>(null);
  const active = results.find((j) => j.id === sel) ?? results[0];
  const filtered = search.q || search.city || search.contract !== "Tous";

  return (
    <section id="offres" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">
            Des offres classées par compatibilité
          </h2>
          <p className="mt-2 text-muted-foreground">
            Exemples fictifs pour illustrer le matching. Les vraies sources arriveront avec les
            comptes.
          </p>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length} offre{results.length > 1 ? "s" : ""} démo
          {filtered && (
            <button onClick={onReset} className="ml-2 font-semibold text-primary hover:underline">
              Effacer la recherche
            </button>
          )}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="font-semibold">Aucune offre démo ne correspond.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essaie « React », « Lyon » ou un autre contrat.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ul className="space-y-2.5">
            {results.map((j) => (
              <li key={j.id}>
                <button
                  onClick={() => setSel(j.id)}
                  aria-pressed={active?.id === j.id}
                  className={`flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-primary/50 ${active?.id === j.id ? "border-primary ring-1 ring-primary" : ""}`}
                >
                  <ScoreRing score={j.score} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{j.title}</p>
                      <DemoBadge className="shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground">{j.company}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">
                        {j.contract}
                      </span>
                      <span className="rounded-md bg-secondary px-2 py-0.5">{j.remote}</span>
                      <span className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5">
                        <MapPin className="h-3 w-3" />
                        {j.city}
                      </span>
                      {j.salary && (
                        <span className="rounded-md bg-action/10 px-2 py-0.5 font-medium">
                          {j.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {active && (
            <article
              key={active.id}
              className="h-fit rounded-xl border bg-card p-6 shadow-soft animate-in fade-in duration-300 lg:sticky lg:top-24"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">{active.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {active.company} · {active.city} · {active.contract} · {active.remote}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 rounded-lg bg-secondary p-4">
                <ScoreRing score={active.score} size={56} />
                <div>
                  <p className="font-semibold">Compatibilité estimée</p>
                  <p className="text-xs text-muted-foreground">
                    Calculée sur tes compétences, le lieu et le contrat. Une estimation, pas une
                    garantie.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold">Compétences présentes</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {active.present.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-action" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">À renforcer</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {active.missing.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <CircleHelp className="h-4 w-4 text-progress" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
                Offre fictive. Sauvegarde et préparation de candidature disponibles à l'ouverture
                des comptes.
              </p>
            </article>
          )}
        </div>
      )}
    </section>
  );
}
