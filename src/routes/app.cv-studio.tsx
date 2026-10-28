import { createFileRoute } from "@tanstack/react-router";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { usePreferences } from "@/components/preferences/usePreferences";
import { PageTitle } from "@/components/workspace/Shared";
import { DocumentLibrary } from "@/components/workspace/DocumentLibrary";
export const Route = createFileRoute("/app/cv-studio")({ component: CvStudio });
function CvStudio() {
  const { t } = usePreferences();
  const { resumes, setResumes, englishResumes, setEnglishResumes, coverLetters, setCoverLetters } =
    useWorkspace();
  return (
    <>
      <PageTitle
        eyebrow={t("TES DOCUMENTS DE RÉFÉRENCE", "YOUR REFERENCE DOCUMENTS")}
        title={t("Tes CV et lettres de motivation.", "Your CVs and cover letters.")}
        description={t(
          "Trois CV français, trois CV anglais et trois modèles de lettres de motivation. Chaque catégorie a son propre espace.",
          "Three French CVs, three English CVs and three cover letter templates. Each category has its own space.",
        )}
      />
      <div className="mx-auto max-w-4xl space-y-6">
        <DocumentLibrary
          title={t("CV français", "French CVs")}
          inputLabel={t("Ajouter des CV français", "Add French CVs")}
          files={resumes}
          setFiles={setResumes}
        />
        <DocumentLibrary
          title={t("CV anglais", "English CVs")}
          inputLabel={t("Ajouter des CV anglais", "Add English CVs")}
          files={englishResumes}
          setFiles={setEnglishResumes}
        />
        <DocumentLibrary
          title={t("Lettres de motivation", "Cover letters")}
          inputLabel={t("Ajouter des lettres de motivation", "Add cover letters")}
          files={coverLetters}
          setFiles={setCoverLetters}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t(
            "Les documents restent uniquement en mémoire dans cet onglet et disparaissent au rechargement. Aucun transfert serveur ni analyse IA. La langue est choisie par le rangement dans une catégorie, elle n’est pas détectée automatiquement.",
            "Documents only stay in this tab’s memory and disappear on reload. No server transfer or AI analysis. Language is determined by the category you choose, not automatically detected.",
          )}
        </p>
      </div>
    </>
  );
}
