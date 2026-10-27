import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  ArrowUpRight,
  Bot,
  Home,
  Sparkles,
  Map,
  KanbanSquare,
  MessageSquare,
  User,
  Settings,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/site/SiteLayout";
import { MissionProgress, ProgressBar } from "@/components/app/Progress";
import { OffersSection } from "@/components/landing/OffersSection";
import { HeroSearch, type SearchState } from "@/components/landing/HeroSearch";
import { AutopilotDemo, CvStudioDemo, KanbanDemo } from "@/components/landing/FeatureDemos";
import { demoJobs } from "@/components/site/demo-data";
import { ScoreRing } from "@/components/landing/shared";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Mon espace démo — Cretoria" }] }),
  component: Dashboard,
});
const tabs = [
  { label: "Accueil", icon: Home },
  { label: "Pour toi", icon: Sparkles },
  { label: "Carte", icon: Map },
  { label: "Candidatures", icon: KanbanSquare },
  { label: "Autopilot", icon: Bot },
  { label: "Messages", icon: MessageSquare },
  { label: "Profil", icon: User },
  { label: "Réglages", icon: Settings },
] as const;
type Tab = (typeof tabs)[number]["label"] | "CV Studio";
function Dashboard() {
  const [tab, setTab] = useState<Tab>("Accueil");
  const [done, setDone] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [profile, setProfile] = useState({ name: "", role: "", city: "" });
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState<SearchState>({ q: "", city: "", contract: "Tous" });
  const [review, setReview] = useState<string | null>(null);
  const complete = (id: string) => setDone((d) => (d.includes(id) ? d : [...d, id]));
  const go = (next: Tab) => {
    setTab(next);
    setMessage("");
  };
  const reset = () => {
    setDone([]);
    setSaved([]);
    setProfile({ name: "", role: "", city: "" });
    setReview(null);
    setMessage("La session de démonstration a été réinitialisée.");
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4">
          <Logo />
          <p className="hidden text-xs text-muted-foreground sm:block">
            Un espace pour construire la suite.
          </p>
          <button
            onClick={() => go("Profil")}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              {profile.name.slice(0, 1).toUpperCase() || "D"}
            </span>
            <span>{profile.name || "Visiteur démo"}</span>
          </button>
        </div>
        <nav aria-label="Navigation de l’application" className="bg-ink">
          <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 py-2">
            {tabs.map((t) => (
              <button
                key={t.label}
                onClick={() => go(t.label)}
                aria-current={tab === t.label ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${tab === t.label ? "bg-primary text-primary-foreground" : "text-ink-muted hover:bg-white/10 hover:text-white"}`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>
      <div className="border-b border-progress/30 bg-progress/10 px-5 py-2.5 text-center text-xs leading-relaxed">
        <strong>Mode démonstration</strong> · Offres et entreprises fictives. Aucune candidature
        envoyée. Tes actions restent dans cette session et disparaissent au rechargement.
      </div>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              TON ESPACE · {tab}
            </p>
            <h1 className="font-display text-3xl">
              {tab === "Accueil"
                ? `Bonjour${profile.name ? " " + profile.name : ""}, prêt·e pour la suite ?`
                : tab}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Une action à la fois. Une recherche qui te ressemble.
            </p>
          </div>
          <button onClick={() => go("Pour toi")} className="btn-primary">
            Explorer les offres <ArrowUpRight size={16} />
          </button>
        </div>
        {message && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm"
          >
            {message}
          </p>
        )}
        {tab === "Accueil" && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Offres à explorer",
                  value: demoJobs.length,
                  note: "Exemples fictifs",
                  icon: Sparkles,
                },
                {
                  label: "Offres sauvegardées",
                  value: saved.length,
                  note: "Dans cette session",
                  icon: Bookmark,
                },
                {
                  label: "Candidatures envoyées",
                  value: 0,
                  note: "Aucun envoi disponible",
                  icon: KanbanSquare,
                },
              ].map((s) => (
                <div key={s.label} className="panel flex items-center gap-4">
                  <s.icon className="text-primary" size={25} />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-2xl font-extrabold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <section className="panel">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-bold">Ton prochain poste commence par toi</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Un objectif clair pour une recherche plus précise.
                      </p>
                    </div>
                    <User className="shrink-0 text-primary" />
                  </div>
                  <div className="my-5">
                    <ProgressBar
                      value={done.includes("profile") ? 100 : 0}
                      label="Profil de démonstration"
                    />
                  </div>
                  <button onClick={() => go("Profil")} className="text-sm font-bold text-primary">
                    {done.includes("profile") ? "Modifier mon objectif" : "Compléter mon objectif"}{" "}
                    →
                  </button>
                </section>
                <section className="panel">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-bold">À découvrir pour toi</h2>
                    <span className="text-xs text-muted-foreground">Sélection illustrative</span>
                  </div>
                  <div className="space-y-3">
                    {demoJobs.slice(0, 3).map((j) => (
                      <article key={j.id} className="rounded-xl border p-4">
                        <div className="flex items-start gap-3">
                          <ScoreRing score={j.score} />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold">{j.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {j.company} · {j.city}
                            </p>
                            <p className="mt-2 text-xs font-medium">
                              {j.contract} · {j.remote} {j.salary && `· ${j.salary}`}
                            </p>
                          </div>
                          <button
                            aria-label={`${saved.includes(j.id) ? "Retirer" : "Sauvegarder"} ${j.title}`}
                            aria-pressed={saved.includes(j.id)}
                            onClick={() => {
                              setSaved((s) =>
                                s.includes(j.id) ? s.filter((x) => x !== j.id) : [...s, j.id],
                              );
                              complete("save");
                            }}
                            className="rounded-lg border p-2 text-primary hover:bg-secondary"
                          >
                            <Bookmark
                              size={17}
                              fill={saved.includes(j.id) ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setReview(review === j.id ? null : j.id);
                            complete("review");
                          }}
                          aria-expanded={review === j.id}
                          className="mt-3 text-xs font-bold text-primary"
                        >
                          Comprendre le matching →
                        </button>
                        {review === j.id && (
                          <div className="mt-3 rounded-lg bg-secondary p-3 text-xs leading-relaxed">
                            <p>
                              Exemple fictif, non calculé sur ton profil. Estimation, sans garantie
                              d'entretien.
                            </p>
                            <p className="mt-2">Points présents : {j.present.join(", ")}.</p>
                            <p>À renforcer : {j.missing.join(", ")}.</p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
                <section className="panel">
                  <h2 className="font-bold">Ton pipeline</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune candidature réelle. Découvre le tableau de suivi dans un bac à sable.
                  </p>
                  <button
                    onClick={() => go("Candidatures")}
                    className="mt-4 text-sm font-bold text-primary"
                  >
                    Explorer le suivi →
                  </button>
                </section>
              </div>
              <aside className="space-y-6">
                <MissionProgress done={done} />
                <section className="panel">
                  <Bot className="text-primary" />
                  <h2 className="mt-3 font-bold">Autopilot, sous ton contrôle</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Aucune activité automatique. Explore une file d’approbation fictive pour
                    comprendre le parcours.
                  </p>
                  <button
                    onClick={() => go("Autopilot")}
                    className="mt-4 text-sm font-bold text-primary"
                  >
                    Ouvrir la démonstration →
                  </button>
                </section>
                <section className="panel">
                  <h2 className="mb-3 font-bold">Tes raccourcis</h2>
                  {[
                    { t: "Mon objectif", tab: "Profil" as Tab },
                    { t: "CV Studio", tab: "CV Studio" as Tab },
                    { t: "Mes réglages", tab: "Réglages" as Tab },
                  ].map((x) => (
                    <button
                      key={x.t}
                      onClick={() => go(x.tab)}
                      className="flex w-full items-center justify-between border-t py-3 text-sm"
                    >
                      {x.t}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </section>
              </aside>
            </div>
          </>
        )}
        {tab === "Pour toi" && (
          <>
            <HeroSearch onSearch={setSearch} />
            <OffersSection
              search={search}
              onReset={() => setSearch({ q: "", city: "", contract: "Tous" })}
            />
          </>
        )}
        {tab === "Profil" && (
          <div className="grid items-start gap-6 md:grid-cols-2">
            <form
              className="panel"
              onSubmit={(e) => {
                e.preventDefault();
                const fields = [profile.name, profile.role, profile.city];
                if (fields.some((v) => v.trim().length < 2)) {
                  setMessage("Renseigne au moins deux caractères dans chaque champ.");
                  return;
                }
                complete("profile");
                setMessage(
                  "Objectif enregistré pour cette session. +30 XP à la première validation.",
                );
              }}
            >
              <h2 className="font-bold">Ton objectif professionnel</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Démo : utilise des informations d’exemple. Aucun document personnel nécessaire.
              </p>
              {[
                { key: "name" as const, label: "Prénom" },
                { key: "role" as const, label: "Métier recherché" },
                { key: "city" as const, label: "Ville souhaitée" },
              ].map((f) => (
                <label key={f.key} className="mt-5 block text-sm font-semibold">
                  {f.label}
                  <input
                    className="field"
                    required
                    minLength={2}
                    maxLength={80}
                    value={profile[f.key]}
                    onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                </label>
              ))}
              <button className="btn-primary mt-6" type="submit">
                Enregistrer mon objectif
              </button>
            </form>
            <MissionProgress done={done} />
          </div>
        )}
        {tab === "Autopilot" && <AutopilotDemo />}
        {tab === "CV Studio" && <CvStudioDemo />}
        {tab === "Candidatures" && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Tableau d’exemple : déplacer une carte modifie uniquement cette démonstration.
            </p>
            <KanbanDemo />
          </>
        )}
        {tab === "Carte" && (
          <section className="panel text-center">
            <Map className="mx-auto text-primary" size={38} />
            <h2 className="mt-4 font-bold">La carte des opportunités se prépare</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Aucune source géographique n’est connectée. Retrouve les villes dans la liste des
              offres fictives, avec un filtre de localisation.
            </p>
            <button onClick={() => go("Pour toi")} className="btn-primary mt-5">
              Explorer par ville
            </button>
          </section>
        )}
        {tab === "Messages" && (
          <section className="panel text-center">
            <MessageSquare className="mx-auto text-primary" size={38} />
            <h2 className="mt-4 font-bold">Une boîte de réception, bientôt</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Aucune messagerie connectée. Aucun message envoyé ni reçu dans cette démonstration.
            </p>
          </section>
        )}
        {tab === "Réglages" && (
          <section className="panel max-w-2xl">
            <Settings className="text-primary" />
            <h2 className="mt-4 font-bold">Ta session de démonstration</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Les informations et sauvegardes restent en mémoire dans cet onglet. Aucun compte n’est
              créé. Un rechargement les efface. L’authentification, les notifications et les exports
              de données seront disponibles dans une phase ultérieure.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-lg border px-4 py-3 text-sm font-bold hover:bg-secondary"
            >
              Réinitialiser la session démo
            </button>
          </section>
        )}
        <p className="mt-10 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
          <FileText size={14} /> Cretoria · Prototype V2 · La préparation avant la quantité.
        </p>
      </main>
    </div>
  );
}
