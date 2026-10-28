import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/offers", label: "Offres" },
  { to: "/app/cv-studio", label: "CV Studio" },
  { to: "/app/applications", label: "Suivi" },
  { to: "/app/accounts", label: "Comptes employeurs" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/presentation"
      className={`flex items-center gap-2 text-lg font-extrabold tracking-tight ${light ? "text-ink-foreground" : "text-foreground"}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
        C
      </span>
      Cretoria
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
  const links = (
    <>
      {nav.map((n) => (
        <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={linkCls}>
          {n.label}
        </Link>
      ))}
      <Link to="/tarifs" onClick={() => setOpen(false)} className={linkCls}>
        Tarifs
      </Link>
      <Link to="/faq" onClick={() => setOpen(false)} className={linkCls}>
        FAQ
      </Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {links}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/app/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Explorer la démo
          </Link>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg hover:bg-secondary lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav
          aria-label="Navigation mobile"
          className="flex flex-col gap-1 border-t bg-card px-3 py-3 lg:hidden"
        >
          {links}
          <Link
            to="/app/dashboard"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Explorer la démo
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-sm text-sm text-ink-muted">
            La recherche d'emploi, organisée. Tu gardes la main à chaque étape.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          <Link to="/tarifs" className="hover:text-ink-foreground">
            Tarifs
          </Link>
          <Link to="/faq" className="hover:text-ink-foreground">
            FAQ
          </Link>
          <Link to="/contact" className="hover:text-ink-foreground">
            Contact
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          <Link to="/confidentialite" className="hover:text-ink-foreground">
            Confidentialité
          </Link>
          <Link to="/conditions" className="hover:text-ink-foreground">
            Conditions d'utilisation
          </Link>
          <Link to="/mentions-legales" className="hover:text-ink-foreground">
            Mentions légales
          </Link>
        </div>
      </div>
      <p className="border-t border-ink-muted/20 py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Cretoria
      </p>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        <div className="mt-10 space-y-6 leading-relaxed">{children}</div>
      </section>
    </SiteLayout>
  );
}
