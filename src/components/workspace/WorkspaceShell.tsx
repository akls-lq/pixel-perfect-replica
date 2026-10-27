import { Link } from "@tanstack/react-router";
import { Home, Search, FileText, KanbanSquare, KeyRound, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Mascot } from "./Mascot";
const navigation = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/app/offers", label: "Offres", icon: Search },
  { to: "/app/cv-studio", label: "CV Studio", icon: FileText },
  { to: "/app/applications", label: "Suivi", icon: KanbanSquare },
  { to: "/app/accounts", label: "Comptes employeurs", icon: KeyRound },
] as const;
export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#workspace-main"
        className="sr-only focus:not-sr-only focus:block focus:bg-card focus:p-3"
      >
        Aller au contenu
      </a>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <Mascot size={42} />
            <span>
              Crétoria<span className="text-primary-text">.</span>
            </span>
          </Link>
          <span className="hidden text-xs text-muted-foreground md:block">
            Le prochain chapitre de ta vie professionnelle.
          </span>
          <Link
            to="/presentation"
            className="flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-bold hover:bg-secondary"
          >
            Le projet <ArrowUpRight size={14} />
          </Link>
        </div>
        <nav aria-label="Navigation principale" className="bg-ink">
          <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 py-2">
            {navigation.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-primary text-white", "aria-current": "page" }}
                inactiveProps={{ className: "text-ink-muted hover:bg-white/10 hover:text-white" }}
                className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition"
              >
                <n.icon size={17} />
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <div className="border-b border-progress/20 bg-progress/10 px-5 py-2 text-center text-xs leading-relaxed">
        <strong>Espace de démonstration</strong> · Chiffres, comptes et candidatures fictifs ·
        Aucune connexion email ni envoi réel · Modifications locales jusqu’au rechargement
      </div>
      <main id="workspace-main" className="mx-auto max-w-7xl px-5 py-8 md:py-10">
        {children}
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t px-5 py-6 text-xs text-muted-foreground">
        <span>Crétoria · Préparer mieux. Avancer ensemble.</span>
        <div className="flex gap-4">
          <Link to="/tarifs">Tarifs</Link>
          <Link to="/confidentialite">Confidentialité</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
