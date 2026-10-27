import { Award, Check, Trophy } from "lucide-react";
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <strong>{value} %</strong>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
const missions = [
  { id: "profile", title: "Définir ton objectif professionnel", xp: 30 },
  { id: "save", title: "Sauvegarder une offre à étudier", xp: 20 },
  { id: "review", title: "Lire les points de compatibilité", xp: 20 },
] as const;
export function MissionProgress({ done }: { done: string[] }) {
  const xp = missions.filter((m) => done.includes(m.id)).reduce((s, m) => s + m.xp, 0);
  return (
    <section className="panel">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-progress/15 p-3">
          <Trophy className="text-foreground" size={22} />
        </span>
        <div>
          <h2 className="font-bold">Tes missions du jour</h2>
          <p className="text-xs text-muted-foreground">Préparer mieux, avancer sereinement</p>
        </div>
      </div>
      <div className="my-5 flex justify-between text-sm" aria-live="polite">
        <strong>
          Niveau {xp >= 50 ? 2 : 1} · {xp >= 50 ? "Organisé" : "Explorateur"}
        </strong>
        <span className="font-bold">{xp} / 70 XP</span>
      </div>
      <ProgressBar value={Math.round((xp / 70) * 100)} label="Progression des missions" />
      <ul className="mt-5 divide-y">
        {missions.map((m) => (
          <li key={m.id} className="flex items-center gap-3 py-3 text-sm">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${done.includes(m.id) ? "bg-primary text-primary-foreground animate-in zoom-in" : "bg-secondary"}`}
            >
              {done.includes(m.id) && <Check size={14} />}
            </span>
            <span className="flex-1">{m.title}</span>
            <span className="text-xs font-bold">+{m.xp} XP</span>
          </li>
        ))}
      </ul>
      {xp >= 50 && (
        <p
          role="status"
          className="mt-3 flex items-center gap-2 rounded-lg bg-progress/15 p-3 text-sm font-semibold animate-in zoom-in"
        >
          <Award size={18} /> Badge « Recherche organisée » débloqué
        </p>
      )}
    </section>
  );
}
