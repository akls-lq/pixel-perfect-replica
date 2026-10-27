import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — Cretoria" },
      { name: "description", content: "Conditions d'utilisation de Cretoria." },
      { property: "og:title", content: "Conditions d'utilisation — Cretoria" },
      { property: "og:description", content: "Conditions d'utilisation de Cretoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell title="Conditions d'utilisation" intro="Document en cours de rédaction.">
      <p>Cretoria est actuellement un prototype. Aucune candidature n'est envoyée sans ton autorisation explicite.</p>
    </PageShell>
  ),
});
