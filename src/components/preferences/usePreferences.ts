import { createContext, useContext } from "react";
export type Language = "fr" | "en";
export type Theme = "light" | "dark";
export const PreferencesContext = createContext<{
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  changeTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
  t: (fr: string, en: string) => string;
} | null>(null);
export function usePreferences() {
  const v = useContext(PreferencesContext);
  if (!v) throw Error("PreferencesProvider required");
  return v;
}
