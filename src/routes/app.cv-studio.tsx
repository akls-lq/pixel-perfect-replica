import { createFileRoute } from "@tanstack/react-router";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { usePreferences } from "@/components/preferences/usePreferences";
import { PageTitle } from "@/components/workspace/Shared";
import { DocumentLibrary } from "@/components/workspace/DocumentLibrary";
export const Route = createFileRoute("/app/cv-studio")({ component: CvStudio });
function CvStudio() {
  const { t } = usePreferences();
  const {
    resumes,
    setResumes,
    englishResumes,
    setEnglishResumes,
    coverLetters,
    setCoverLetters,
    additionalDocuments,
    setAdditionalDocuments,
  } = useWorkspace();
  return (
    <>
      <PageTitle
        eyebrow={t("TES DOCUMENTS DE RÉFÉRENCE", "YOUR REFERENCE DOCUMENTS")}
        title={t("Tes CV et lettres de motivation.", "Your CVs and cover letters.")}
        description={t(
          "Trois CV français, trois CV anglais, trois lettres de motivation et autant de documents supplémentaires que tu le souhaites.",
          "Three French CVs, three English CVs, three cover letters and as many supporting documents as you need.",
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
        <DocumentLibrary
          title={t("Documents supplémentaires", "Additional documents")}
          description={t(
            "Calendrier d’alternance, justificatifs de situation de handicap et autres pièces utiles à tes candidatures. Aucun nombre maximum de fichiers.",
            "Work-study calendars, disability-related documents and other useful application files. No limit on the number of files.",
          )}
          inputLabel={t("Ajouter des documents supplémentaires", "Add additional documents")}
          files={additionalDocuments}
          setFiles={setAdditionalDocuments}
          maxFiles={null}
          formats="supporting"
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
