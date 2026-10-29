import { createFileRoute, Link } from "@tanstack/react-router";
import { usePreferences } from "@/components/preferences/usePreferences";
import { PageTitle } from "@/components/workspace/Shared";
import { JobMatchDeck } from "@/components/workspace/JobMatchDeck";
import { useWorkspace } from "@/components/workspace/useWorkspace";

export const Route = createFileRoute("/app/matching")({
  head: () => ({ meta: [{ title: "Matching — Crétoria" }] }),
  component: MatchingPage,
});

function MatchingPage() {
  const { t } = usePreferences();
  const { resume } = useWorkspace();

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        eyebrow={t("Matching CV", "CV matching")}
        title={t("Swipe & postule", "Swipe & apply")}
        description={t(
          "Comme Tinder, mais pour ton job : swipe à droite ou ♥ pour postuler automatiquement aux offres qui collent à ton CV. Swipe à gauche ou ✕ pour passer.",
          "Like Tinder, but for jobs: swipe right or ♥ to auto-apply to offers that match your CV. Swipe left or ✕ to skip.",
        )}
      />

      {!resume && (
        <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          {t(
            "Astuce : ajoute ton CV dans CV Studio pour un matching encore plus pertinent.",
            "Tip: upload your CV in CV Studio for smarter matching.",
          )}{" "}
          <Link
            to="/app/cv-studio"
            className="font-semibold text-primary-text underline-offset-2 hover:underline"
          >
            CV Studio
          </Link>
        </div>
      )}

      <JobMatchDeck />
    </div>
  );
}
