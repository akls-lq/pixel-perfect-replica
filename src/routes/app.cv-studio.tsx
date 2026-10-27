import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent } from "react";
import { Upload, FileText, Trash2, ExternalLink, ShieldCheck, LoaderCircle } from "lucide-react";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { PageTitle } from "@/components/workspace/Shared";
export const Route = createFileRoute("/app/cv-studio")({
  head: () => ({ meta: [{ title: "Ajouter mon CV — Crétoria" }] }),
  component: CvStudio,
});
function CvStudio() {
  const { resume, setResume } = useWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choisis un fichier PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024 || file.size === 0) {
      setError("Le PDF doit être non vide et ne pas dépasser 10 Mo.");
      return;
    }
    setLoading(true);
    try {
      const signature = await file.slice(0, 5).text();
      if (signature !== "%PDF-") {
        setError("Ce fichier ne semble pas être un PDF valide.");
        return;
      }
      setResume({ file, url: URL.createObjectURL(file) });
    } catch {
      setError("Impossible de lire ce fichier. Réessaie avec un PDF accessible sur cet appareil.");
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void upload(e.dataTransfer.files[0]);
  }
  return (
    <>
      <PageTitle
        eyebrow="CV STUDIO"
        title="Ton CV. Simplement."
        description="Ajoute ton CV pour le retrouver dans ton espace. Rien d’autre à remplir, aucun texte généré."
      />
      <section className="mx-auto max-w-3xl">
        <div className="panel">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={drop}
            className={`rounded-2xl border-2 border-dashed p-7 text-center transition md:p-12 ${dragging ? "border-primary bg-primary/5" : "border-input bg-background"}`}
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary-text">
              {loading ? <LoaderCircle className="animate-spin" size={28} /> : <Upload size={28} />}
            </span>
            <h2 className="mt-5 text-xl font-bold">Dépose ton CV ici</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ou sélectionne un fichier sur ton appareil
            </p>
            <button
              disabled={loading}
              onClick={() => input.current?.click()}
              className="btn-primary mt-6"
            >
              {loading ? "Vérification du PDF…" : resume ? "Remplacer mon CV" : "Choisir mon CV"}
            </button>
            <input
              ref={input}
              type="file"
              accept=".pdf,application/pdf"
              aria-label="Ajouter un CV au format PDF"
              className="sr-only"
              onChange={(e) => void upload(e.target.files?.[0])}
            />
            <p className="mt-4 text-xs text-muted-foreground">PDF uniquement · 10 Mo maximum</p>
          </div>
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {resume && (
            <div className="mt-5 rounded-xl border bg-background p-4">
              <p role="status" className="mb-3 text-xs font-bold text-teal-800">
                CV ajouté à cette session
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <FileText className="text-primary-text" />
                <div className="min-w-0 flex-1">
                  <h3 className="break-all text-sm font-bold">{resume.file.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.ceil(resume.file.size / 1024)} Ko · PDF
                  </p>
                </div>
                <a
                  href={resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold"
                >
                  Ouvrir <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => setResume(null)}
                  aria-label="Supprimer mon CV de cette session"
                  className="rounded-lg border p-2 text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="shrink-0" size={17} />
            Le fichier reste dans la mémoire de cet onglet. Il n’est ni téléversé vers un serveur,
            ni analysé par une IA. Il disparaît au rechargement. Tu peux le rattacher manuellement à
            un dossier dans le suivi.
          </p>
        </div>
      </section>
    </>
  );
}
