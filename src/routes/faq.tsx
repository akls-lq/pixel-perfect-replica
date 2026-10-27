import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/SiteLayout";
import { faqs } from "@/components/site/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Cretoria" },
      { name: "description", content: "Réponses aux questions fréquentes sur Cretoria : Autopilot, IA, données et confidentialité." },
      { property: "og:title", content: "FAQ — Cretoria" },
      { property: "og:description", content: "Tout savoir sur le fonctionnement de Cretoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell title="Questions fréquentes">
      <div className="divide-y border-y">
        {faqs.map((f) => (
          <details key={f.q} className="py-5" open>
            <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
            <p className="mt-3 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  ),
});
