import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Cretoria" },
      { name: "description", content: "Mentions légales de Cretoria." },
      { property: "og:title", content: "Mentions légales — Cretoria" },
      { property: "og:description", content: "Mentions légales de Cretoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell
      title="Mentions légales"
      intro="Les informations sur l'éditeur et l'hébergeur seront publiées avant le lancement."
    >
      <p className="text-muted-foreground">Éditeur : à compléter. Hébergement : à compléter.</p>
    </PageShell>
  ),
});
