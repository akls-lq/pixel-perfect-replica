import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell } from "@/components/site/SiteLayout";
import { plans } from "@/components/site/content";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — Cretoria" },
      { name: "description", content: "Projet de tarification Cretoria : plans Free et Pro." },
      { property: "og:title", content: "Tarifs — Cretoria" },
      { property: "og:description", content: "Projet de tarification Cretoria : plans Free et Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell title="Tarifs" intro="Projet de tarification — ces offres ne sont pas encore commercialisées.">
      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.name} className="rounded-2xl border bg-card p-8">
            <p className="font-semibold">{p.name}</p>
            <p className="mt-2 font-display text-5xl">{p.price}</p>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.items.map((it) => <li key={it} className="flex gap-2"><Check className="h-4 w-4 text-action" />{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  ),
});
