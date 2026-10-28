import { useContext } from "react";
import { PreferencesContext } from "@/components/preferences/usePreferences";
export function RunningLoader() {
  const p = useContext(PreferencesContext);
  const t = (fr: string, en: string) => (p?.language === "en" ? en : fr);
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center gap-5"
      aria-live="polite"
    >
      <div className="creto-runner" aria-hidden="true">
        <span className="runner-dust" />
        <svg viewBox="0 0 120 110" width="100" height="92">
          <g className="runner-leg rear">
            <path
              d="m55 72-15 22 19 1"
              fill="none"
              stroke="#101936"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <g className="runner-leg">
            <path
              d="m64 72 18 17 12-3"
              fill="none"
              stroke="#f59e42"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
          <g className="runner-body">
            <path d="M83 26a30 30 0 1 0 0 42L68 56a12 12 0 1 1 0-17Z" fill="#4f5cf1" />
            <path d="m60 17 13-14 4 22Z" fill="#0db89a" />
            <ellipse cx="77" cy="39" rx="12" ry="15" fill="white" />
            <circle cx="83" cy="36" r="3" fill="#101936" />
            <path
              d="m58 53 18 12 18-8"
              fill="none"
              stroke="#4f5cf1"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      <span className="text-sm text-muted-foreground">
        {t("Créto prépare ton espace…", "Créto is getting your workspace ready…")}
      </span>
    </div>
  );
}
