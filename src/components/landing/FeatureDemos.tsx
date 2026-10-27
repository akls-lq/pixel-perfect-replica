import { Award, Check, FileText, PartyPopper, ShieldCheck, Target, X } from "lucide-react";
import { useState } from "react";
import { DemoBadge, SectionHead } from "./shared";

type QItem = { id: number; title: string; company: string; status: "À relire" | "Approuvée" | "Refusée" };

export function AutopilotDemo() {
  const [items, setItems] = useState<QItem[]>([
    { id: 1, title: "Product Designer", company: "Studio Halo (fictif)", status: "À relire" },
    { id: 2, title: "Développeur·se Front-end React", company: "Atelier Nova (fictif)", status: "À relire" },
    { id: 3, title: "Assistant·e chef de projet", company: "Cèdre Conseil (fictif)", status: "À relire" },
  ]);
  const set = (id: number, status: QItem["status"]) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));
  return (
    <section className="bg-card py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2">
        <SectionHead id="autopilot" kicker="Cretoria Autopilot" title="Il prépare. Tu décides." text="L'Autopilot filtre selon tes règles, écarte les doublons et prépare CV et lettre. Chaque candidature attend ton approbation — rien ne part sans toi.">
          <ul className="mt-6 space-y-2 text-sm">
            {["Score minimum et limite quotidienne réglables", "Entreprises et mots-clés exclus", "Journal complet de chaque action"].map((t) => (
              <li key={t} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-action" />{t}</li>
            ))}
          </ul>
        </SectionHead>
        <div className="rounded-2xl border bg-background p-4">
          <div className="flex items-center justify-between px-1 pb-3">
            <p className="text-sm font-semibold">File d'approbation</p>
            <DemoBadge />
          </div>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{it.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{it.company} · CV ciblé + lettre prêts</p>
                </div>
                {it.status === "À relire" ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => set(it.id, "Refusée")} aria-label={`Refuser ${it.title}`} className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-secondary"><X className="h-4 w-4" /></button>
                    <button onClick={() => set(it.id, "Approuvée")} className="rounded-lg bg-action px-3 text-sm font-semibold text-action-foreground hover:brightness-105">Approuver</button>
                  </div>
                ) : (
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold animate-in zoom-in-95 ${it.status === "Approuvée" ? "bg-action/10" : "bg-secondary text-muted-foreground"}`}>{it.status}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 px-1 text-xs text-muted-foreground">Une candidature approuvée n'est comptée comme envoyée qu'après confirmation d'envoi.</p>
        </div>
      </div>
    </section>
  );
}

export function CvStudioDemo() {
  const [after, setAfter] = useState(true);
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2">
      <div className="order-2 rounded-2xl border bg-card p-5 shadow-soft lg:order-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-lg bg-secondary p-1 text-sm" role="group" aria-label="Version du CV">
            {[["Original", false], ["Ciblé", true]].map(([l, v]) => (
              <button key={l as string} aria-pressed={after === v} onClick={() => setAfter(v as boolean)} className={`rounded-md px-3 py-1.5 font-medium ${after === v ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{l as string}</button>
            ))}
          </div>
          <DemoBadge />
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <p className="font-bold">Camille Martin — Développeuse front-end</p>
          <p className="text-xs font-semibold text-muted-foreground">Expérience · Agence Pixel (fictif), 2022–2025</p>
          <p className={after ? "rounded-md bg-action/10 p-2" : "p-2"}>
            {after ? "Développé des interfaces React/TypeScript accessibles (RGAA) pour 4 clients e-commerce." : "Travail sur des sites web pour différents clients."}
          </p>
          <p className={after ? "rounded-md bg-action/10 p-2" : "p-2"}>
            {after ? "Mis en place une bibliothèque de composants réutilisés sur l'ensemble des projets." : "Création de composants."}
          </p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Surligné : reformulé à partir de ton profil réel. Aucune expérience ajoutée.</p>
      </div>
      <div className="order-1 lg:order-2">
        <SectionHead id="cv-studio" kicker="CV Studio" title="Un CV ciblé pour chaque offre." text="Format ATS une colonne, comparaison avant/après et historique des versions. L'IA reformule, elle n'invente jamais." />
      </div>
    </section>
  );
}

const columns = ["À préparer", "Préparée", "Envoyée", "Entretien"] as const;

export function KanbanDemo() {
  const [cards, setCards] = useState([
    { id: 1, t: "Data Analyst junior", col: 0 },
    { id: 2, t: "Product Designer", col: 1 },
    { id: 3, t: "Front-end React", col: 2 },
  ]);
  const move = (id: number) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, col: Math.min(c.col + 1, columns.length - 1) } : c)));
  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHead id="suivi" kicker="Suivi des candidatures" title="Chaque candidature, à sa place." text="Kanban, tableau ou calendrier. Le CV et la lettre exacts restent attachés à chaque candidature, avec un historique horodaté." />
        <div className="mt-8 grid gap-3 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, ci) => (
            <div key={col} className="min-h-40 rounded-xl bg-background p-3">
              <p className="flex justify-between text-xs font-semibold text-muted-foreground">{col}<span>{cards.filter((c) => c.col === ci).length}</span></p>
              <div className="mt-3 space-y-2">
                {cards.filter((c) => c.col === ci).map((c) => (
                  <div key={c.id} className="rounded-lg border bg-card p-3 shadow-soft animate-in fade-in slide-in-from-left-2">
                    <p className="text-sm font-semibold">{c.t}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <DemoBadge />
                      {ci < columns.length - 1 && (
                        <button onClick={() => move(c.id)} className="text-xs font-semibold text-primary hover:underline">Étape suivante</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const missions = [
  { id: "cv", t: "Importer ton CV", xp: 30 },
  { id: "skills", t: "Valider 5 compétences", xp: 20 },
  { id: "prefs", t: "Préciser tes préférences de poste", xp: 20 },
  { id: "letter", t: "Relire une lettre avant envoi", xp: 15 },
  { id: "follow", t: "Planifier une relance personnalisée", xp: 15 },
];
const levels = ["Débutant", "Organisé", "Préparé", "Prêt"];

export function ProgressionDemo() {
  const [done, setDone] = useState<string[]>(["cv"]);
  const xp = missions.filter((m) => done.includes(m.id)).reduce((a, m) => a + m.xp, 0);
  const level = Math.min(Math.floor(xp / 30), levels.length - 1);
  const complete = done.length === missions.length;
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2">
      <SectionHead id="progression" kicker="Progression" title="Progresse sur ce qui compte vraiment." text="Des missions pour préparer une recherche de qualité : profil complet, candidatures relues, relances réfléchies. Aucun point pour l'envoi en masse — et un niveau ne garantit pas un recrutement." />
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-progress/15"><Award className="h-5 w-5 text-progress" /></span>
            <div>
              <p className="text-sm font-bold">Niveau {level + 1} · {levels[level]}</p>
              <p className="text-xs text-muted-foreground" aria-live="polite">{xp} / 100 XP</p>
            </div>
          </div>
          <DemoBadge />
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-secondary" role="progressbar" aria-valuenow={xp} aria-valuemin={0} aria-valuemax={100} aria-label="Progression XP">
          <div className="h-2.5 rounded-full bg-progress transition-all duration-500" style={{ width: `${xp}%` }} />
        </div>
        <ul className="mt-5 space-y-2">
          {missions.map((m) => {
            const ok = done.includes(m.id);
            return (
              <li key={m.id}>
                <button onClick={() => setDone((d) => (ok ? d.filter((x) => x !== m.id) : [...d, m.id]))} aria-pressed={ok}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${ok ? "border-action/40 bg-action/5" : "hover:bg-secondary"}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${ok ? "border-action bg-action text-action-foreground animate-in zoom-in-50" : "border-input"}`}>
                    {ok && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={`flex-1 ${ok ? "text-muted-foreground line-through" : "font-medium"}`}>{m.t}</span>
                  <span className="text-xs font-bold text-progress">+{m.xp} XP</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ i: ShieldCheck, t: "Profil vérifié", on: done.includes("cv") && done.includes("skills") }, { i: Target, t: "Ciblage précis", on: done.includes("prefs") }, { i: PartyPopper, t: "Prêt·e à postuler", on: complete }].map((b) => (
            <span key={b.t} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${b.on ? "bg-progress/15 text-foreground animate-in zoom-in-90" : "bg-secondary text-muted-foreground opacity-60"}`}>
              <b.i className="h-3.5 w-3.5" />{b.t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
