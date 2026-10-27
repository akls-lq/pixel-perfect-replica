import { Bot, Flame, Home, KanbanSquare, Map, Sparkles } from "lucide-react";
import { useState } from "react";
import { demoJobs } from "@/components/site/demo-data";
import { DemoBadge, ScoreRing } from "./shared";

const tabs = [
  { k: "home", label: "Accueil", icon: Home },
  { k: "foryou", label: "Pour toi", icon: Sparkles },
  { k: "map", label: "Carte", icon: Map },
  { k: "apps", label: "Candidatures", icon: KanbanSquare },
] as const;

export function ProductPreview() {
  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("foryou");
  const top = [...demoJobs].sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-elegant">
      <div
        className="flex items-center gap-1 overflow-x-auto bg-ink px-2 py-2"
        role="group"
        aria-label="Aperçu de l'application"
      >
        {tabs.map((t) => (
          <button
            key={t.k}

            aria-pressed={tab === t.k}
            onClick={() => setTab(t.k)}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${tab === t.k ? "bg-ink-foreground/15 text-ink-foreground" : "text-ink-muted hover:text-ink-foreground"}`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
        <DemoBadge className="ml-auto shrink-0 text-ink-foreground" />
      </div>
      <div className="min-h-[340px] p-4">
        {tab === "home" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <p className="font-bold">Bonjour Camille 👋</p>
            <div className="rounded-xl border p-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">Profil complété</span>
                <span className="text-muted-foreground">70 %</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className="h-2 w-[70%] rounded-full bg-progress" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Prochaine mission : ajouter tes langues (+20 XP)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <Bot className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xs font-semibold">2 candidatures à relire</p>
              </div>
              <div className="rounded-xl border p-3">
                <Flame className="h-4 w-4 text-progress" />
                <p className="mt-2 text-xs font-semibold">Niveau 3 · Préparé</p>
              </div>
            </div>
          </div>
        )}
        {tab === "foryou" && (
          <ul className="space-y-2.5 animate-in fade-in duration-300">
            {top.map((j) => (
              <li key={j.id} className="flex items-center gap-3 rounded-xl border p-3">
                <ScoreRing score={j.score} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{j.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {j.company} · {j.city}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {j.present.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded bg-action/10 px-1.5 py-0.5 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                    {j.missing.slice(0, 1).map((s) => (
                      <span
                        key={s}
                        className="rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        À renforcer : {s}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
            <li className="pt-1 text-[11px] text-muted-foreground">
              Score = estimation de compatibilité, pas une garantie.
            </li>
          </ul>
        )}
        {tab === "map" && (
          <div
            className="relative h-[300px] overflow-hidden rounded-xl bg-secondary animate-in fade-in duration-300"
            aria-label="Carte illustrative"
          >
            <svg
              viewBox="0 0 300 200"
              className="absolute inset-0 h-full w-full text-border"
              aria-hidden
            >
              <path
                d="M60 30 L140 20 L180 60 L170 120 L120 170 L70 150 L40 90 Z"
                className="fill-card stroke-current"
              />
            </svg>
            {[
              ["48%", "30%", 3],
              ["60%", "55%", 2],
              ["35%", "60%", 1],
              ["42%", "75%", 1],
            ].map(([l, t, n], i) => (
              <span
                key={i}
                style={{ left: l as string, top: t as string }}
                className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft"
              >
                {n}
              </span>
            ))}
            <span className="absolute bottom-2 left-2 rounded-md bg-card px-2 py-1 text-[11px] text-muted-foreground">
              Remote : 2 offres hors carte
            </span>
          </div>
        )}
        {tab === "apps" && (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-300">
            {[
              ["Préparée", ["Product Designer"]],
              ["Envoyée", ["Front-end React"]],
              ["Entretien", ["Data Analyst"]],
            ].map(([col, items]) => (
              <div key={col as string} className="rounded-lg bg-secondary p-2">
                <p className="text-[11px] font-semibold text-muted-foreground">{col as string}</p>
                {(items as string[]).map((i) => (
                  <p
                    key={i}
                    className="mt-2 rounded-md bg-card p-2 text-[11px] font-medium shadow-soft"
                  >
                    {i}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
