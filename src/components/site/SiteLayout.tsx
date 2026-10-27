import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", hash: "produit", label: "Produit" },
  { to: "/", hash: "fonctionnalites", label: "Fonctionnalités" },
  { to: "/", hash: "etapes", label: "Comment ça marche" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-2xl">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-sans text-sm font-bold">C</span>
      Cretoria
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = (
    <>
      {nav.map((n) => (
        <Link key={n.label} to={n.to} hash={n.hash} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
          {n.label}
        </Link>
      ))}
      <Link to="/tarifs" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Tarifs</Link>
      <Link to="/faq" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">{links}</nav>
        <div className="hidden md:block">
          <Link to="/" hash="etapes" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Commencer gratuitement
          </Link>
        </div>
        <button className="md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && <nav className="flex flex-col gap-4 border-t px-5 py-5 md:hidden">{links}</nav>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">Cretoria</p>
          <p className="mt-3 max-w-sm text-sm text-ink-muted">La recherche d'emploi, organisée. Tu gardes la main à chaque étape.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          <Link to="/tarifs" className="hover:text-ink-foreground">Tarifs</Link>
          <Link to="/faq" className="hover:text-ink-foreground">FAQ</Link>
          <Link to="/contact" className="hover:text-ink-foreground">Contact</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          <Link to="/confidentialite" className="hover:text-ink-foreground">Confidentialité</Link>
          <Link to="/conditions" className="hover:text-ink-foreground">Conditions d'utilisation</Link>
          <Link to="/mentions-legales" className="hover:text-ink-foreground">Mentions légales</Link>
        </div>
      </div>
      <p className="border-t border-ink-muted/20 py-5 text-center text-xs text-ink-muted">© {new Date().getFullYear()} Cretoria</p>
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

export function PageShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="font-display text-5xl md:text-6xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        <div className="mt-10 space-y-6 leading-relaxed">{children}</div>
      </section>
    </SiteLayout>
  );
}
