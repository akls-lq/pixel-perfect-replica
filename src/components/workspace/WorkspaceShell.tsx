import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Bot,
  FileText,
  KanbanSquare,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Mascot } from "./Mascot";
import { usePreferences } from "@/components/preferences/usePreferences";
const navigation = [
  { to: "/", fr: "Dashboard", en: "Dashboard", icon: LayoutDashboard },
  { to: "/app/offers", fr: "Autopilote", en: "Autopilot", icon: Bot },
  { to: "/app/cv-studio", fr: "CV", en: "CVs", icon: FileText },
  { to: "/app/applications", fr: "Suivi", en: "Applications", icon: KanbanSquare },
  { to: "/app/accounts", fr: "Compte fournisseur", en: "Provider accounts", icon: KeyRound },
] as const;
function Navigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = usePreferences();
  return (
    <>
      <div
        className={`flex items-center gap-2 border-b px-5 py-5 ${collapsed ? "justify-center" : ""}`}
      >
        <Link to="/" onClick={onNavigate} aria-label="Crétoria">
          <Mascot size={38} />
        </Link>
        {!collapsed && (
          <Link to="/" onClick={onNavigate} className="text-xl font-extrabold tracking-tight">
            Crétoria<span className="text-primary-text">.</span>
          </Link>
        )}
      </div>
      <div className="flex-1 px-3 py-5">
        {!collapsed && (
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">
            {t("MON ESPACE", "MY WORKSPACE")}
          </p>
        )}
        <nav aria-label={t("Navigation principale", "Main navigation")} className="space-y-1.5">
          {navigation.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={onNavigate}
              title={collapsed ? t(n.fr, n.en) : undefined}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{
                className: "bg-card text-foreground shadow-soft border-border",
                "aria-current": "page",
              }}
              inactiveProps={{
                className: "text-muted-foreground border-transparent hover:bg-card/60",
              }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition ${collapsed ? "justify-center !px-2" : ""}`}
            >
              <n.icon size={19} className="shrink-0" />
              {!collapsed && <span>{t(n.fr, n.en)}</span>}
            </Link>
          ))}
        </nav>
        {!collapsed && (
          <div className="mt-9 rounded-2xl border bg-primary/5 p-4">
            <p className="text-xs font-bold text-primary-text">
              {t("Un pas à la fois.", "One step at a time.")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t(
                "Prépare ta prochaine opportunité avec confiance.",
                "Prepare your next opportunity with confidence.",
              )}
            </p>
          </div>
        )}
      </div>
      <Link
        to="/app/profile"
        onClick={onNavigate}
        className="m-3 flex items-center gap-3 rounded-2xl border bg-card/60 p-3"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-text">
          D
        </span>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold">{t("Visiteur", "Visitor")}</p>
            <p className="text-xs text-muted-foreground">{t("Mode démonstration", "Demo mode")}</p>
          </div>
        )}
      </Link>
    </>
  );
}
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { t, theme, changeTheme, language, setLanguage } = usePreferences();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = navigation.find((n) =>
    n.to === "/" ? pathname === "/" : pathname.startsWith(n.to),
  );
  const title = current
    ? t(current.fr, current.en)
    : pathname.includes("settings")
      ? t("Paramètres", "Settings")
      : t("Mon compte", "My account");
  return (
    <div className="workspace-bg min-h-screen p-2 md:p-3">
      <a
        href="#workspace-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-card focus:p-3"
      >
        {t("Aller au contenu", "Skip to content")}
      </a>
      <aside
        className={`fixed bottom-3 left-3 top-3 z-40 hidden flex-col rounded-[2rem] border border-white/40 bg-card/50 shadow-elegant backdrop-blur-xl dark:border-border lg:flex ${collapsed ? "w-[80px]" : "w-[244px]"}`}
      >
        <Navigation collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-9 rounded-full border bg-card p-1.5 text-muted-foreground"
          aria-label={
            collapsed
              ? t("Déplier la navigation", "Expand sidebar")
              : t("Réduire la navigation", "Collapse sidebar")
          }
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </aside>
      <Dialog.Root open={mobile} onOpenChange={setMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed bottom-2 left-2 top-2 z-50 flex w-[280px] max-w-[90vw] flex-col rounded-[2rem] border bg-card shadow-elegant">
            <Dialog.Title className="sr-only">
              {t("Menu de navigation", "Navigation menu")}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {t("Choisis une page de ton espace.", "Choose a workspace page.")}
            </Dialog.Description>
            <Navigation onNavigate={() => setMobile(false)} />
            <Dialog.Close
              aria-label={t("Fermer le menu", "Close menu")}
              className="absolute right-3 top-3 rounded-full p-2"
            >
              <X size={16} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div
        className={`transition-[margin] duration-200 ${collapsed ? "lg:ml-[96px]" : "lg:ml-[260px]"}`}
      >
        <header className="sticky top-2 z-30 flex min-h-[68px] items-center justify-between gap-3 rounded-[1.75rem] border border-white/50 bg-card/80 px-4 shadow-soft backdrop-blur-xl dark:border-border md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobile(true)}
              aria-label={t("Ouvrir le menu", "Open menu")}
              className="rounded-lg p-2 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <p className="text-sm font-bold">{title}</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                aria-label={t("Rechercher une page", "Find a page")}
                placeholder={t("Rechercher dans mon espace…", "Find a page in my workspace…")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 rounded-xl border bg-background/50 py-2.5 pl-9 pr-3 text-xs xl:w-72"
              />
              {search && (
                <div className="absolute right-0 top-full mt-2 w-full rounded-xl border bg-popover p-2 shadow-elegant">
                  {navigation
                    .filter((n) => t(n.fr, n.en).toLowerCase().includes(search.toLowerCase()))
                    .map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setSearch("")}
                        className="block rounded-lg p-2 text-xs hover:bg-secondary"
                      >
                        {t(n.fr, n.en)}
                      </Link>
                    ))}
                  {!navigation.some((n) =>
                    t(n.fr, n.en).toLowerCase().includes(search.toLowerCase()),
                  ) && (
                    <p className="p-2 text-xs text-muted-foreground">
                      {t("Aucune page trouvée.", "No matching pages.")}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div
              className="flex rounded-full bg-secondary p-1"
              aria-label={t("Langue de l’interface", "Interface language")}
            >
              {(["fr", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  aria-pressed={language === l}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold ${language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                changeTheme(theme === "light" ? "dark" : "light", {
                  x: r.x + r.width / 2,
                  y: r.y + r.height / 2,
                });
              }}
              data-theme-toggle
              aria-label={
                theme === "light"
                  ? t("Passer au thème sombre", "Switch to dark theme")
                  : t("Passer au thème clair", "Switch to light theme")
              }
              className="rounded-full border p-2.5 text-primary-text"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button
                  aria-label={t("Menu utilisateur", "User menu")}
                  className="flex items-center gap-1 rounded-full"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary-text">
                    D
                  </span>
                  <ChevronDown size={12} />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Portal>
                <Dropdown.Content
                  align="end"
                  sideOffset={12}
                  className="z-50 min-w-60 rounded-2xl border bg-popover p-2 text-sm shadow-elegant"
                >
                  <div className="border-b px-3 py-3">
                    <p className="font-bold">{t("Visiteur", "Visitor")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("Aucune session authentifiée", "No authenticated session")}
                    </p>
                  </div>
                  <Dropdown.Item asChild>
                    <Link
                      to="/app/profile"
                      className="flex items-center gap-2 rounded-lg p-3 outline-none focus:bg-secondary"
                    >
                      <UserRound size={16} />
                      {t("Mon compte", "My account")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item asChild>
                    <Link
                      to="/app/settings"
                      className="flex items-center gap-2 rounded-lg p-3 outline-none focus:bg-secondary"
                    >
                      <Settings size={16} />
                      {t("Paramètres", "Settings")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled
                    className="flex items-center gap-2 rounded-lg p-3 text-muted-foreground opacity-60"
                  >
                    <LogOut size={16} />
                    {t("Se déconnecter (indisponible)", "Sign out (unavailable)")}
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          </div>
        </header>
        <main id="workspace-main" className="mx-auto max-w-[1500px] px-2 py-7 md:px-5">
          <div className="mb-5 inline-flex rounded-full border bg-card/60 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
            {t(
              "Démonstration · Données fictives · Aucun envoi réel",
              "Demo · Fictional data · No real applications sent",
            )}
          </div>
          {children}
        </main>
        <footer className="flex flex-wrap justify-between gap-3 px-5 pb-4 pt-2 text-[11px] text-muted-foreground">
          <span>
            Crétoria · {t("Construis ton prochain chapitre.", "Build your next chapter.")}
          </span>
          <div className="flex gap-4">
            <Link to="/presentation">{t("Le projet", "About")}</Link>
            <Link to="/confidentialite">{t("Confidentialité", "Privacy")}</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
