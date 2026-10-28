import { createFileRoute } from "@tanstack/react-router";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { PresentationHero } from "@/components/landing/PresentationHero";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
export const Route = createFileRoute("/presentation")({
  head: () => ({ meta: [{ title: "Crétoria — Ton prochain chapitre professionnel" }] }),
  component: Presentation,
});
function Presentation() {
  return (
    <WorkspaceShell>
      <PresentationHero />
      <CompanyLogos />
    </WorkspaceShell>
  );
}
