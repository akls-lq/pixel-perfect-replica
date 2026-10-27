import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Bot, Check, Chrome, FileText, Globe2, KanbanSquare, Layers, Search, Sparkles, X,
} from "lucide-react";
import hero from "@/assets/hero-dashboard.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { faqs, plans } from "@/components/site/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cretoria — La recherche d'emploi intelligente" },
      { name: "description", content: "Cretoria découvre les offres qui te correspondent, prépare des candidatures personnalisées et suit chaque étape de ta recherche d'emploi." },
      { property: "og:title", content: "Cretoria — La recherche d'emploi intelligente" },
      { property: "og:description", content: "Matching IA explicable, CV ciblés, Autopilot avec validation et suivi complet des candidatures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const problems = [
  { t: "Recherches dispersées", d: "Dix onglets, cinq plateformes, aucune vue d'ensemble." },
  { t: "Candidatures répétitives", d: "Les mêmes formulaires, encore et encore." },
  { t: "CV non adaptés", d: "Un seul CV envoyé à des postes très différents." },
  { t: "Aucun suivi", d: "Qui a répondu ? Quand relancer ? Personne ne sait." },
];

const features = [
  { icon: Sparkles, t: "Matching IA explicable", d: "Un score de compatibilité détaillé : compétences présentes, manquantes et points incertains. Une estimation, jamais une promesse." },
  { icon: Bot, t: "Cretoria Autopilot", d: "Il cherche, filtre, dédoublonne et prépare tes candidatures. Rien ne part sans ta validation explicite." },
  { icon: Globe2, t: "Carte mondiale des offres", d: "Explore les opportunités sur une carte interactive. Les offres remote et sans localisation fiable sont traitées à part." },
  { icon: FileText, t: "CV Studio", d: "Une version ciblée par offre, avec comparaison avant/après. L'IA reformule, elle n'invente jamais." },
  { icon: KanbanSquare, t: "Suivi des candidatures", d: "Kanban, tableau et calendrier. Chaque candidature garde le CV et la lettre exacts envoyés." },
  { icon: Chrome, t: "Extension Chrome", d: "Enregistre une offre et prépare le préremplissage d'un formulaire, avec aperçu avant envoi. En préparation." },
];

const compare = [
  ["Recherche sur chaque site séparément", "Offres centralisées et dédoublonnées"],
  ["Un CV unique pour tous les postes", "Une version ciblée par offre"],
  ["Lettres réécrites à la main", "Brouillons personnalisés et révisables"],
  ["Suivi dans un tableur oublié", "CRM complet avec historique horodaté"],
  ["Relances au hasard", "Rappels et prévention des doubles relances"],
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section id="produit" className="bg-ink-gradient text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-20 md:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-muted/30 px-3 py-1 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-action" /> Prototype en développement
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] md:text-7xl">
            Ton prochain job ne devrait pas être <em className="text-action">un travail à plein temps.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            Cretoria découvre les opportunités qui te correspondent, prépare des candidatures personnalisées et t'aide à suivre chaque étape de ta recherche d'emploi.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/" hash="fonctionnalites" className="inline-flex items-center gap-2 rounded-full bg-action px-6 py-3.5 font-semibold text-action-foreground transition hover:brightness-110">
              Découvrir mes offres <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" hash="etapes" className="rounded-full border border-ink-muted/40 px-6 py-3.5 font-semibold hover:bg-ink-foreground/10">
              Voir comment ça marche
            </Link>
          </div>
          <img src={hero} alt="Aperçu du tableau de bord Cretoria" width={1600} height={1008} className="mt-16 w-full rounded-2xl shadow-elegant animate-in fade-in slide-in-from-bottom-6 duration-700" />
          <p className="mt-3 text-center text-xs text-ink-muted">Visuel illustratif — données fictives.</p>
        </div>
      </section>

      {/* Problème */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="max-w-2xl font-display text-4xl md:text-5xl">Chercher un emploi ne devrait pas ressembler à ça.</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
          {problems.map((p) => (
            <div key={p.t} className="bg-card p-7">
              <X className="h-5 w-5 text-destructive" />
              <h3 className="mt-4 font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Fonctionnalités</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">Un copilote complet, du premier clic à la réponse.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.t} className="rounded-2xl border bg-card p-7 transition hover:-translate-y-1 hover:shadow-elegant">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent"><f.icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section id="etapes" className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="font-display text-4xl md:text-5xl">Trois étapes, c'est tout.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { i: Layers, t: "Crée ton profil", d: "Importe ton CV, vérifie les informations extraites et précise tes préférences." },
            { i: Search, t: "Découvre les offres", d: "Des offres classées par compatibilité, avec une explication claire pour chacune." },
            { i: KanbanSquare, t: "Gère tes candidatures", d: "Prépare, valide et suis chaque candidature jusqu'à la réponse." },
          ].map((s, n) => (
            <div key={s.t} className="border-t-2 border-foreground pt-6">
              <span className="font-display text-6xl text-accent">0{n + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparatif */}
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-2 bg-primary text-sm font-semibold text-primary-foreground">
            <p className="p-5">Candidature traditionnelle</p>
            <p className="p-5">Avec Cretoria</p>
          </div>
          {compare.map(([a, b]) => (
            <div key={a} className="grid grid-cols-2 border-t text-sm">
              <p className="flex gap-2 p-5 text-muted-foreground"><X className="h-4 w-4 shrink-0 text-destructive" />{a}</p>
              <p className="flex gap-2 p-5"><Check className="h-4 w-4 shrink-0 text-action" />{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-display text-4xl md:text-5xl">Tarifs</h2>
          <p className="mt-3 text-sm text-muted-foreground">Projet de tarification — non commercialisé à ce jour.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {plans.map((p, i) => (
              <div key={p.name} className={i ? "rounded-2xl bg-ink p-8 text-ink-foreground" : "rounded-2xl border bg-card p-8"}>
                <p className="font-semibold">{p.name}</p>
                <p className="mt-2 font-display text-5xl">{p.price}</p>
                <p className={i ? "mt-2 text-sm text-ink-muted" : "mt-2 text-sm text-muted-foreground"}>{p.desc}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.items.map((it) => <li key={it} className="flex gap-2"><Check className="h-4 w-4 text-action" />{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-24">
        <h2 className="font-display text-4xl md:text-5xl">Questions fréquentes</h2>
        <div className="mt-10 divide-y border-y">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent">Toutes les questions <ArrowRight className="h-4 w-4" /></Link>
      </section>

      {/* CTA final */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-ink-gradient px-8 py-20 text-center text-ink-foreground">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-6xl">Reprends le contrôle de ta recherche.</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">Les comptes ouvrent prochainement. Une question en attendant ?</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-action px-6 py-3.5 font-semibold text-action-foreground hover:brightness-110">
            Nous contacter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
