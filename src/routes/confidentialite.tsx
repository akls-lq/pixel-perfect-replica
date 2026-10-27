import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité — Cretoria" },
      { name: "description", content: "Politique de confidentialité de Cretoria." },
      { property: "og:title", content: "Confidentialité — Cretoria" },
      { property: "og:description", content: "Comment Cretoria protège tes données." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell title="Confidentialité" intro="Document en cours de rédaction.">
      <p>
        Cretoria applique un traitement minimal des données personnelles. Tes documents privés ne
        sont accessibles qu'à toi.
      </p>
      <p>
        Aucun mot de passe de plateforme tierce n'est collecté. Tu peux exporter ou supprimer tes
        données à tout moment depuis tes paramètres.
      </p>
    </PageShell>
  ),
});
