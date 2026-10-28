import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent } from "react";
import { Upload, FileText, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { usePreferences } from "@/components/preferences/usePreferences";
import { RunningLoader } from "@/components/workspace/RunningLoader";
import { PageTitle } from "@/components/workspace/Shared";
export const Route = createFileRoute("/app/cv-studio")({ component: CvStudio });
function CvStudio() {
  const { t } = usePreferences();
  const { resumes, setResumes } = useWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);
  const busy = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  async function upload(files: File[]) {
    if (!files.length || busy.current) return;
    setError("");
    setMessage("");
    if (replacing.current === null && resumes.length + files.length > 3) {
      setError(
        t(
          "Tu peux ajouter trois CV maximum. Supprime ou remplace un fichier.",
          "You can add up to three CVs. Remove or replace a file.",
        ),
      );
      if (input.current) input.current.value = "";
      return;
    }
    busy.current = true;
    setLoading(true);
    const replace = replacing.current;
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["pdf", "doc", "docx"].includes(ext ?? ""))
          throw Error(
            t("Formats autorisés : PDF, DOC et DOCX.", "Allowed formats: PDF, DOC and DOCX."),
          );
        if (file.size === 0 || file.size > 10 * 1024 * 1024)
          throw Error(
            t(
              "Chaque CV doit être non vide et ne pas dépasser 10 Mo.",
              "Each CV must be non-empty and no larger than 10 MB.",
            ),
          );
        const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
        const valid =
          ext === "pdf"
            ? new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-"
            : ext === "doc"
              ? bytes.length >= 8 &&
                bytes.slice(0, 8).every((b, i) => b === [208, 207, 17, 224, 161, 177, 26, 225][i])
              : bytes[0] === 80 && bytes[1] === 75 && bytes[2] === 3 && bytes[3] === 4;
        if (!valid)
          throw Error(
            t(
              "Le contenu du fichier ne correspond pas au format annoncé.",
              "The file content does not match its declared format.",
            ),
          );
      }
      const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
      setResumes((xs) =>
        replace === null ? [...xs, ...next] : xs.map((r, i) => (i === replace ? next[0]! : r)),
      );
      setMessage(
        t(
          "CV ajouté(s) dans cet onglet. Aucun upload serveur.",
          "CV(s) added to this tab. No server upload.",
        ),
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : t(
              "Lecture impossible. Réessaie avec un fichier local.",
              "Unable to read the file. Try a local file.",
            ),
      );
    } finally {
      replacing.current = null;
      busy.current = false;
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    replacing.current = null;
    void upload(Array.from(e.dataTransfer.files));
  }
  return (
    <>
      <PageTitle
        eyebrow={t("TES DOCUMENTS DE RÉFÉRENCE", "YOUR REFERENCE DOCUMENTS")}
        title={t("Tes CV, prêts pour la suite.", "Your CVs, ready for what’s next.")}
        description={t(
          "Ajoute jusqu’à trois CV. Ils serviront plus tard de modèles à l’Autopilote. Aucun document n’est analysé ni envoyé.",
          "Add up to three CVs. They can later serve as Autopilot templates. No document is analysed or sent.",
        )}
      />
      <section className="panel mx-auto max-w-4xl">
        <div className="mb-5 flex justify-between">
          <h2 className="font-semibold">{t("Ma bibliothèque", "My library")}</h2>
          <span
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary-text"
            aria-live="polite"
          >
            {resumes.length}/3 CV
          </span>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
          className={`rounded-[1.5rem] border-2 border-dashed px-5 py-12 text-center ${dragging ? "border-primary bg-primary/10" : "border-input bg-background/40"}`}
        >
          <Upload className="mx-auto text-primary-text" size={34} />
          <h3 className="mt-5 text-lg font-semibold">
            {t("Glisse tes CV ici", "Drop your CVs here")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            PDF · DOC · DOCX · {t("10 Mo par fichier", "10 MB per file")}
          </p>
          <button
            disabled={loading || resumes.length === 3}
            onClick={() => {
              replacing.current = null;
              if (input.current) input.current.multiple = true;
              input.current?.click();
            }}
            className="btn-primary mt-6"
          >
            {t("Sélectionner mes CV", "Choose my CVs")}
          </button>
          <input
            ref={input}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            aria-label={t("Ajouter des CV", "Add CVs")}
            className="sr-only"
            onChange={(e) => void upload(Array.from(e.target.files ?? []))}
          />
        </div>
        {loading && <RunningLoader />}
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-4 text-sm text-primary-text">
            {message}
          </p>
        )}
        <ul className="mt-5 space-y-3">
          {resumes.map((r, i) => (
            <li key={r.url} className="flex flex-wrap items-center gap-3 rounded-2xl border p-4">
              <span className="rounded-xl bg-primary/10 p-3 text-primary-text">
                <FileText size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="break-all text-sm font-semibold">{r.file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.ceil(r.file.size / 1024)} {t("Ko", "KB")} ·{" "}
                  {r.file.name.split(".").pop()?.toUpperCase()}
                </p>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("Ouvrir", "Open")} ${r.file.name}`}
                className="rounded-lg border p-2 text-primary-text"
              >
                <ExternalLink size={16} />
              </a>
              <button
                disabled={loading}
                onClick={() => {
                  replacing.current = i;
                  if (input.current) input.current.multiple = false;
                  input.current?.click();
                }}
                aria-label={`${t("Remplacer", "Replace")} ${r.file.name}`}
                className="rounded-lg border p-2"
              >
                <RefreshCw size={16} />
              </button>
              <button
                disabled={loading}
                onClick={() => setResumes((xs) => xs.filter((_, index) => index !== i))}
                aria-label={`${t("Supprimer", "Delete")} ${r.file.name}`}
                className="rounded-lg border p-2 text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {t(
            "Les fichiers restent uniquement en mémoire dans cet onglet. Ils disparaissent au rechargement. Aucun stockage permanent, traitement IA ou transfert serveur.",
            "Files only stay in this tab’s memory and disappear on reload. No permanent storage, AI processing or server transfer.",
          )}
        </p>
      </section>
    </>
  );
}
