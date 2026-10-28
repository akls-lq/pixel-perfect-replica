import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { PreferencesContext, type Language, type Theme } from "./usePreferences";
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);
  const changing = useRef(false);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("cretoria.preferences") || "{}");
      if (raw.language === "fr" || raw.language === "en") setLanguage(raw.language);
      if (raw.theme === "light" || raw.theme === "dark") setTheme(raw.theme);
    } catch {
      /* Browser storage is optional. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = language;
    if (ready) document.documentElement.dataset["uiReady"] = "true";
    if (ready)
      try {
        localStorage.setItem("cretoria.preferences", JSON.stringify({ language, theme }));
      } catch {
        /* Continue without persistence when storage is unavailable. */
      }
  }, [language, theme, ready]);
  function changeTheme(next: Theme, origin?: { x: number; y: number }) {
    if (changing.current || next === theme) return;
    const update = () => {
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }
    changing.current = true;
    const rect = document.querySelector("[data-theme-toggle]")?.getBoundingClientRect();
    const x = origin?.x ?? (rect ? rect.x + rect.width / 2 : innerWidth - 40),
      y = origin?.y ?? (rect ? rect.y + rect.height / 2 : 40);
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(update));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 600,
            easing: "cubic-bezier(.2,.65,.3,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => {
      changing.current = false;
    });
  }
  const translate = useCallback(
    (fr: string, en: string) => (language === "fr" ? fr : en),
    [language],
  );
  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        changeTheme,
        t: translate,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
