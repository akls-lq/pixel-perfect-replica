import { periods, type Period } from "@/lib/workspace-data";
import type { ReactNode } from "react";
export function PeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      Période
      <select
        aria-label="Période"
        value={value}
        onChange={(e) => onChange(e.target.value as Period)}
        className="rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground"
      >
        {periods.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
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
        <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary-text">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
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
    <div className="rounded-xl border border-dashed bg-card p-8 text-center">
      <p className="font-bold">{title}</p>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
export function StageBadge({ stage }: { stage: string }) {
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
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      {stage}
    </span>
  );
}
