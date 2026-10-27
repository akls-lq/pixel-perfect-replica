import { DocumentPreview } from "@/components/workspace/DocumentPreview";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, FileText, Download, Mail, Check, Link2 } from "lucide-react";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { PageTitle, StageBadge, EmptyState } from "@/components/workspace/Shared";
import { demoDate, formatDate, stages, safeUrl, type Stage } from "@/lib/workspace-data";
export const Route = createFileRoute("/app/applications/$id")({
  head: () => ({ meta: [{ title: "Dossier de candidature — Crétoria" }] }),
  component: ApplicationPage,
});
function ApplicationPage() {
  const { id } = Route.useParams();
  return <ApplicationDetail key={id} id={id} />;
}
function ApplicationDetail({ id }: { id: string }) {
  const { applications, updateApplication, resume, documentFiles, attachFile } = useWorkspace();
  const a = applications.find((x) => x.id === id);
  const [url, setUrl] = useState(a?.sourceUrl ?? "");
  const [notes, setNotes] = useState(a?.notes ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  if (!a)
    return (
      <EmptyState title="Ce dossier n’existe pas.">
        <Link to="/app/applications" className="text-primary-text">
          Revenir au suivi
        </Link>
      </EmptyState>
    );
  const files = documentFiles[id];
  const exampleText = (kind: "cv" | "letter") =>
    kind === "cv"
      ? `CV FICTIF — EXEMPLE CRÉTORIA\nCandidat de démonstration\nPoste visé : ${a.title}\nCompétences : organisation, communication.\nCe document n’a jamais été envoyé.`
      : `LETTRE FICTIVE — EXEMPLE CRÉTORIA\nObjet : ${a.title} chez ${a.company}\nTexte illustratif pour montrer un document rattaché à un dossier.\nAucune candidature réelle ni génération IA.`;
  function download(kind: "cv" | "letter") {
    if (!a) return;
    const file = files?.[kind];
    const text = exampleText(kind);
    const blob = file ?? new Blob([text], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = file?.name ?? (kind === "cv" ? a.cvName : a.letterName);
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 30000);
  }
  async function letter(file: File | undefined) {
    setError("");
    if (!file) return;
    if (
      file.size === 0 ||
      file.size > 10 * 1024 * 1024 ||
      !file.name.toLowerCase().match(/\.(pdf|txt)$/)
    ) {
      setError("La lettre doit être un PDF ou un TXT non vide, de 10 Mo maximum.");
      return;
    }
    try {
      if (file.name.toLowerCase().endsWith(".pdf") && (await file.slice(0, 5).text()) !== "%PDF-") {
        setError("Le fichier choisi n’est pas un PDF valide.");
        return;
      }
      attachFile(id, "letter", file);
      updateApplication(id, { letterName: file.name });
      setMessage("Lettre rattachée localement à ce dossier, sans envoi.");
    } catch {
      setError("Impossible de lire ce fichier. Réessaie avec un fichier local accessible.");
    }
  }
  return (
    <>
      <Link
        to="/app/applications"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary-text"
      >
        <ArrowLeft size={16} /> Tous mes dossiers
      </Link>
      <PageTitle
        eyebrow={`DOSSIER ${id.toUpperCase()} · EXEMPLE FICTIF`}
        title={a.title}
        description={`${a.company} · ${a.sector} · Candidature d’exemple du ${formatDate(a.sentAt)}`}
      >
        <StageBadge stage={a.stage} />
      </PageTitle>
      {message && (
        <p role="status" className="mb-5 rounded-xl bg-teal-50 p-4 text-sm text-teal-800">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <section className="panel">
            <h2 className="flex items-center gap-2 font-bold">
              <Link2 size={19} className="text-primary-text" /> Le lien de l’offre
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Aucune annonce réelle n’est associée à ce dossier fictif. Ajoute une URL pour tester
              l’ouverture de l’offre d’origine.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("");
                setError("");
                if (url && !safeUrl(url)) {
                  setError("Saisis une URL complète commençant par https:// ou http://.");
                  return;
                }
                updateApplication(id, { sourceUrl: url.trim() });
                setMessage("Lien enregistré dans cette session.");
              }}
            >
              <label className="text-xs font-bold">
                URL de l’offre
                <input
                  className="field"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://entreprise.fr/carrieres/offre"
                  maxLength={2000}
                />
              </label>
              <button
                type="submit"
                className="mt-3 rounded-lg border px-4 py-2 text-sm font-bold hover:bg-secondary"
              >
                Enregistrer le lien
              </button>
            </form>
            {safeUrl(a.sourceUrl) && (
              <a
                href={a.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                Ouvrir l’offre d’origine <ExternalLink size={15} />
              </a>
            )}
            <Link to="/app/offers" className="mt-4 block text-xs font-bold text-primary-text">
              Retrouver le catalogue de démonstration →
            </Link>
          </section>
          <section className="panel">
            <h2 className="font-bold">Les documents de ce dossier</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Les pièces initiales sont des exemples TXT téléchargeables. Un fichier ajouté
              manuellement reste local : il n’est pas présenté comme un document déjà envoyé.
            </p>
            <div className="mt-5 space-y-3">
              {(["cv", "letter"] as const).map((kind) => (
                <div key={kind} className="rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="shrink-0 text-primary-text" size={23} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold">
                        {kind === "cv" ? "CV rattaché" : "Lettre de motivation"}
                      </h3>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {kind === "cv" ? a.cvName : a.letterName}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-1 text-[10px] font-bold">
                        {files?.[kind]
                          ? "Ajouté localement · Non envoyé"
                          : "Document fictif · Jamais envoyé"}
                      </span>
                    </div>
                    <button
                      onClick={() => download(kind)}
                      aria-label={
                        kind === "cv"
                          ? "Télécharger le CV rattaché"
                          : "Télécharger la lettre rattachée"
                      }
                      className="rounded-lg border p-2 text-primary-text"
                    >
                      <Download size={17} />
                    </button>
                  </div>
                  <DocumentPreview
                    file={files?.[kind]}
                    label={kind === "cv" ? "le CV rattaché" : "la lettre rattachée"}
                    example={exampleText(kind)}
                  />
                  {kind === "cv" ? (
                    <div className="mt-4 border-t pt-3">
                      {resume ? (
                        <button
                          onClick={() => {
                            attachFile(id, "cv", resume.file);
                            updateApplication(id, { cvName: resume.file.name });
                            setMessage("CV rattaché localement à ce dossier, sans envoi.");
                          }}
                          className="text-xs font-bold text-primary-text"
                        >
                          Rattacher mon CV de la session : {resume.file.name}
                        </button>
                      ) : (
                        <Link to="/app/cv-studio" className="text-xs font-bold text-primary-text">
                          Ajouter mon CV dans CV Studio →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <label className="mt-4 block border-t pt-3 text-xs font-bold text-primary-text">
                      Ajouter / remplacer la lettre (PDF ou TXT)
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        className="mt-2 block w-full text-xs font-normal text-muted-foreground"
                        onChange={(e) => {
                          void letter(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
          <form
            className="panel"
            onSubmit={(e) => {
              e.preventDefault();
              updateApplication(id, { notes });
              setMessage("Notes enregistrées dans cette session.");
            }}
          >
            <label className="font-bold">
              Mes notes
              <textarea
                className="field min-h-32 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={4000}
              />
            </label>
            <button className="btn-primary mt-3" type="submit">
              Enregistrer mes notes
            </button>
          </form>
        </div>
        <aside className="space-y-5">
          <section className="panel">
            <h2 className="font-bold">L’avancement du processus</h2>
            <label className="mt-5 block text-xs font-bold">
              Statut actuel
              <select
                className="field"
                value={a.stage}
                onChange={(e) => {
                  const stage = e.target.value as Stage;
                  updateApplication(id, {
                    stage,
                    responseAt:
                      stage === "Envoyée" ? null : (a.responseAt ?? demoDate.toISOString()),
                  });
                  setMessage(
                    "Statut mis à jour localement. Les graphiques de l’accueil reflètent ce changement.",
                  );
                }}
              >
                {stages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="mt-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={a.email}
                onChange={(e) => updateApplication(id, { email: e.target.checked })}
              />
              <Mail size={16} /> Un email a été reçu
            </label>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Indication manuelle dans la démo. Aucun accès Gmail, Outlook ou autre messagerie.
            </p>
            <div className="mt-6 space-y-4 border-t pt-5">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <h3 className="text-xs font-bold">Envoi d’exemple</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(a.sentAt)} · Simulation
                  </p>
                </div>
              </div>
              {a.responseAt && (
                <div className="flex gap-3">
                  <Check size={14} className="text-teal-700" />
                  <div>
                    <h3 className="text-xs font-bold">Réponse renseignée</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(a.responseAt)} · {a.stage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="rounded-2xl bg-ink p-5 text-white">
            <h2 className="text-sm font-bold">Le détail fait la différence.</h2>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Garde une trace du poste, du lien source et des pièces utilisées. Ici, tout est un bac
              à sable ; les documents initiaux n’ont jamais été envoyés.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
