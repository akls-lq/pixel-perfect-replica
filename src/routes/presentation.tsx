import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { faqs, plans } from "@/components/site/content";
import { HeroSearch, type SearchState } from "@/components/landing/HeroSearch";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { OffersSection } from "@/components/landing/OffersSection";
import { AutopilotDemo, CvStudioDemo, KanbanDemo } from "@/components/landing/FeatureDemos";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Cretoria — Le bon emploi, avec un coup d’avance" },
      {
        name: "description",
        content:
          "Découvre Cretoria : recherche d’emploi, matching expliqué et candidatures organisées. Explore notre démonstration interactive.",
      },
    ],
  }),
  component: Index,
});
const initialSearch: SearchState = { q: "", city: "", contract: "Tous" };
function Index() {
  const [search, setSearch] = useState(initialSearch);
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b bg-[radial-gradient(ellipse_at_top_right,_#e5e8ff,_transparent_65%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles size={14} /> Ton prochain chapitre commence ici
            </p>
            <h1 className="max-w-xl font-display text-4xl leading-[1.14] md:text-5xl">
              Trouve le bon emploi.
              <br />
              <span className="text-primary">Laisse l'IA simplifier le reste.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Moins d'onglets. Plus de clarté. Découvre les offres qui te correspondent et prépare
              chaque candidature avec confiance.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link to="/" className="btn-primary">
                Explorer la démo <ArrowRight size={16} />
              </Link>
              <a href="#offres" className="text-sm font-semibold">
                Découvrir les offres ↓
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={15} /> Tu gardes le contrôle. Aucun envoi automatique.
            </p>
          </div>
          <div className="relative lg:py-5">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>UN APERÇU DE TON FUTUR ESPACE</span>
              <span>Interactif · Démo</span>
            </div>
            <ProductPreview />
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-action" /> Change d'onglet pour explorer.
              Toutes les données sont fictives.
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-10">
          <HeroSearch onSearch={setSearch} />
          <p className="mt-3 text-xs text-muted-foreground">
            Recherche dans les offres de démonstration · Aucune offre réelle pour le moment
          </p>
        </div>
      </section>
      <OffersSection search={search} onReset={() => setSearch(initialSearch)} />
      <section id="fonctionnalites" className="border-y bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Un matching qui s'explique",
              text: "Compétences présentes, manquantes et points à vérifier : comprends chaque estimation.",
            },
            {
              icon: ShieldCheck,
              title: "Ton parcours, tes décisions",
              text: "L’IA assiste la préparation. Tu relis et tu décides de la suite.",
            },
            {
              icon: Sparkles,
              title: "Tout au même endroit",
              text: "Offres, documents et suivi : un espace pensé pour retrouver de la sérénité.",
            },
          ].map((x) => (
            <div key={x.title}>
              <x.icon className="mb-3 text-progress" size={22} />
              <h2 className="font-bold">{x.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{x.text}</p>
            </div>
          ))}
        </div>
      </section>
      <AutopilotDemo />
      <CvStudioDemo />
      <KanbanDemo />
      <section
        id="progression"
        className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 md:grid-cols-2"
      >
        <div>
          <p className="text-sm font-semibold text-primary">Chaque bonne étape compte</p>
          <h2 className="mt-2 font-display text-3xl">
            Une recherche qui avance.
            <br />À ton rythme.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Complète ton profil, précise ton objectif, étudie une offre. Les missions valorisent la
            préparation et l'organisation, jamais le volume d'envois.
          </p>
          <Link to="/" className="btn-primary mt-6">
            Essayer les missions <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rounded-2xl border bg-card p-7 shadow-soft">
          <Trophy className="text-progress" size={32} />
          <h3 className="mt-4 font-bold">De petits pas, une direction claire</h3>
          <ul className="mt-5 space-y-4">
            {[
              "Des XP pour les actions réellement effectuées",
              "Des badges de progression, sans promesse d’embauche",
              "Un espace démo à tester sans créer de compte",
            ].map((t) => (
              <li className="flex gap-3 text-sm" key={t}>
                <Check size={18} className="shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-y bg-secondary/50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <p className="text-sm font-semibold text-primary">Simple et transparent</p>
          <h2 className="mt-2 font-display text-3xl">Un accompagnement à ta mesure</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Projet de tarification · Aucun abonnement commercialisé à ce jour
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {plans.map((p, i) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-7 ${i ? "bg-ink text-ink-foreground" : "bg-card"}`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="mt-3 text-3xl font-extrabold">{p.price}</p>
                <p className={`mt-2 text-sm ${i ? "text-ink-muted" : "text-muted-foreground"}`}>
                  {p.desc}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.items.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check size={16} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-display text-3xl">On répond à tes questions</h2>
        <div className="mt-7 divide-y border-y">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.q} className="py-5">
              <summary className="cursor-pointer text-sm font-bold">{f.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <Link to="/faq" className="mt-5 inline-block text-sm font-semibold text-primary">
          Consulter toute la FAQ →
        </Link>
      </section>
    </SiteLayout>
  );
}
