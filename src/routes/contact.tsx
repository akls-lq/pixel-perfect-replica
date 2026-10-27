import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cretoria" },
      { name: "description", content: "Contacter l'équipe Cretoria." },
      { property: "og:title", content: "Contact — Cretoria" },
      { property: "og:description", content: "Contacter l'équipe Cretoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell title="Contact" intro="Une question, une suggestion ou un partenariat ?">
      <p className="rounded-2xl border bg-card p-6 text-muted-foreground">
        L'adresse de contact officielle sera publiée prochainement.
      </p>
    </PageShell>
  ),
});
