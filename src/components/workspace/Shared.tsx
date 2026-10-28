import { periods, type Period } from "@/lib/workspace-data";
import { usePreferences } from "@/components/preferences/usePreferences";
import type { ReactNode } from "react";
export function PeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const { t } = usePreferences();
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      {t("Période", "Period")}
      <select
        aria-label={t("Période", "Period")}
        value={value}
        onChange={(e) => onChange(e.target.value as Period)}
        className="rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground"
      >
        {periods.map((p) => (
          <option key={p.value} value={p.value}>
            {t(
              p.label,
              { "24h": "24 hours", "7d": "7 days", "30d": "1 month", "365d": "1 year" }[p.value],
            )}
          </option>
        ))}
      </select>
    </label>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-primary-text">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
      <p className="font-semibold">{title}</p>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
export function StageBadge({ stage }: { stage: string }) {
  const { t } = usePreferences();
  const en: Record<string, string> = {
    Envoyée: "Submitted",
    "Réponse reçue": "Reply received",
    Entretien: "Interview",
    "Offre reçue": "Offer received",
    Refusée: "Rejected",
  };
  const tone =
    stage === "Refusée"
      ? "bg-red-50 text-red-800"
      : stage === "Entretien"
        ? "bg-primary/10 text-primary-text"
        : stage === "Offre reçue"
          ? "bg-teal-50 text-teal-800"
          : "bg-secondary text-foreground";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {t(stage, en[stage] ?? stage)}
    </span>
  );
}
