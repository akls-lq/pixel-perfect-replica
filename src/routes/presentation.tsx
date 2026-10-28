import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { usePreferences } from "@/components/preferences/usePreferences";
export const Route = createFileRoute("/presentation")({
  head: () => ({ meta: [{ title: "Crétoria — Ton prochain chapitre professionnel" }] }),
  component: Presentation,
});
function Presentation() {
  const { t } = usePreferences();
  return (
    <WorkspaceShell>
      <section className="mx-auto max-w-3xl pb-4 pt-10 text-center md:pt-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-primary-text">
          Crétoria
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {t("Prépare ton prochain chapitre professionnel.", "Prepare your next career chapter.")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t(
            "Un espace pour organiser ta recherche d’emploi, préparer tes documents et suivre tes candidatures. Tu gardes la main à chaque étape.",
            "A workspace to organise your job search, prepare your documents and track applications. You stay in control at every step.",
          )}
        </p>
        <Link to="/app/dashboard" className="btn-primary mt-7">
          {t("Ouvrir le dashboard", "Open dashboard")}
          <ArrowRight size={16} />
        </Link>
      </section>
      <CompanyLogos />
    </WorkspaceShell>
  );
}
