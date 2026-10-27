import type { ReactNode } from "react";

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-progress/40 bg-progress/10 px-1.5 py-0.5 text-[11px] font-semibold text-foreground ${className}`}
    >
      Démo
    </span>
  );
}

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const tone = score >= 75 ? "text-action" : score >= 60 ? "text-primary" : "text-progress";
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label={`Compatibilité estimée ${score} %`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="4"
          className="fill-none stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          className={`fill-none stroke-current ${tone} transition-[stroke-dashoffset] duration-700`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold">{score}</span>
    </div>
  );
}

export function SectionHead({
  id,
  kicker,
  title,
  text,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="text-sm font-semibold text-primary">{kicker}</p>
      <h2 className="mt-2 max-w-xl font-display text-3xl md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-xl text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}
