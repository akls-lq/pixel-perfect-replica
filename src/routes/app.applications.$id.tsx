import { usePreferences } from "@/components/preferences/usePreferences";
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
  const { t } = usePreferences();
  const { applications, updateApplication, resume, documentFiles, attachFile } = useWorkspace();
  const a = applications.find((x) => x.id === id);
  const [url, setUrl] = useState(a?.sourceUrl ?? "");
  const [notes, setNotes] = useState(a?.notes ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  if (!a)
    return (
      <EmptyState title={t("Ce dossier n’existe pas.", "This application does not exist.")}>
        <Link to="/app/applications" className="text-primary-text">
          {t("Revenir au suivi", "Back to applications")}
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
      setError(
        t(
          "La lettre doit être un PDF ou un TXT non vide, de 10 Mo maximum.",
          "The letter must be a non-empty PDF or TXT file, up to 10 MB.",
        ),
      );
      return;
    }
    try {
      if (file.name.toLowerCase().endsWith(".pdf") && (await file.slice(0, 5).text()) !== "%PDF-") {
        setError(
          t("Le fichier choisi n’est pas un PDF valide.", "The selected file is not a valid PDF."),
        );
        return;
      }
      attachFile(id, "letter", file);
      updateApplication(id, { letterName: file.name });
      setMessage(
        t(
          "Lettre rattachée localement à ce dossier, sans envoi.",
          "Letter attached locally to this record, without sending.",
        ),
      );
    } catch {
      setError(
        t(
          "Impossible de lire ce fichier. Réessaie avec un fichier local accessible.",
          "Unable to read this file. Try an accessible local file.",
        ),
      );
    }
  }
  return (
    <>
      <Link
        to="/app/applications"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary-text"
      >
        <ArrowLeft size={16} />
        {t("Tous mes dossiers", "All my applications")}
      </Link>
      <PageTitle
        eyebrow={`${t("DOSSIER", "RECORD")} ${id.toUpperCase()} · ${t("EXEMPLE FICTIF", "FICTIONAL EXAMPLE")}`}
        title={a.title}
        description={`${a.company} · ${a.sector} · ${t("Candidature d’exemple du", "Example application dated")} ${formatDate(a.sentAt)}`}
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
              <Link2 size={19} className="text-primary-text" />
              {t("Le lien de l’offre", "Job listing link")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t(
                "Aucune annonce réelle n’est associée à ce dossier fictif. Ajoute une URL pour tester l’ouverture de l’offre d’origine.",
                "No real listing is associated with this fictional record. Add a URL to test opening the original listing.",
              )}
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("");
                setError("");
                if (url && !safeUrl(url)) {
                  setError(
                    t(
                      "Saisis une URL complète commençant par https:// ou http://.",
                      "Enter a full URL starting with https:// or http://.",
                    ),
                  );
                  return;
                }
                updateApplication(id, { sourceUrl: url.trim() });
                setMessage(t("Lien enregistré dans cette session.", "Link saved in this session."));
              }}
            >
              <label className="text-xs font-bold">
                {t("URL de l’offre", "Job listing URL")}
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
                {t("Enregistrer le lien", "Save link")}
              </button>
            </form>
            {safeUrl(a.sourceUrl) && (
              <a
                href={a.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                {t("Ouvrir l’offre d’origine", "Open original listing")}
                <ExternalLink size={15} />
              </a>
            )}
            <Link to="/app/offers" className="mt-4 block text-xs font-bold text-primary-text">
              {t("Retrouver le catalogue de démonstration →", "Browse the demo catalogue →")}
            </Link>
          </section>
          <section className="panel">
            <h2 className="font-bold">
              {t("Les documents de ce dossier", "Documents for this application")}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t(
                "Les pièces initiales sont des exemples TXT téléchargeables. Un fichier ajouté manuellement reste local : il n’est pas présenté comme un document déjà envoyé.",
                "Initial attachments are downloadable TXT examples. Files added manually remain local and are not presented as already sent.",
              )}
            </p>
            <div className="mt-5 space-y-3">
              {(["cv", "letter"] as const).map((kind) => (
                <div key={kind} className="rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="shrink-0 text-primary-text" size={23} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold">
                        {kind === "cv"
                          ? t("CV rattaché", "Attached CV")
                          : t("Lettre de motivation", "Cover letter")}
                      </h3>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {kind === "cv" ? a.cvName : a.letterName}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-1 text-[10px] font-bold">
                        {files?.[kind]
                          ? t("Ajouté localement · Non envoyé", "Added locally · Not sent")
                          : t("Document fictif · Jamais envoyé", "Fictional document · Never sent")}
                      </span>
                    </div>
                    <button
                      onClick={() => download(kind)}
                      aria-label={
                        kind === "cv"
                          ? t("Télécharger le CV rattaché", "Download attached CV")
                          : t("Télécharger la lettre rattachée", "Download attached letter")
                      }
                      className="rounded-lg border p-2 text-primary-text"
                    >
                      <Download size={17} />
                    </button>
                  </div>
                  <DocumentPreview
                    file={files?.[kind]}
                    label={
                      kind === "cv"
                        ? t("le CV rattaché", "the attached CV")
                        : t("la lettre rattachée", "the attached letter")
                    }
                    example={exampleText(kind)}
                  />
                  {kind === "cv" ? (
                    <div className="mt-4 border-t pt-3">
                      {resume ? (
                        <button
                          onClick={() => {
                            attachFile(id, "cv", resume.file);
                            updateApplication(id, { cvName: resume.file.name });
                            setMessage(
                              t(
                                "CV rattaché localement à ce dossier, sans envoi.",
                                "CV attached locally to this record, without sending.",
                              ),
                            );
                          }}
                          className="text-xs font-bold text-primary-text"
                        >
                          {t("Rattacher mon CV de la session :", "Attach my session CV:")}
                          {resume.file.name}
                        </button>
                      ) : (
                        <Link to="/app/cv-studio" className="text-xs font-bold text-primary-text">
                          {t("Ajouter mon CV dans CV Studio →", "Add my CV in the CV library →")}
                        </Link>
                      )}
                    </div>
                  ) : (
                    <label className="mt-4 block border-t pt-3 text-xs font-bold text-primary-text">
                      {t(
                        "Ajouter / remplacer la lettre (PDF ou TXT)",
                        "Add / replace letter (PDF or TXT)",
                      )}
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
              setMessage(
                t("Notes enregistrées dans cette session.", "Notes saved in this session."),
              );
            }}
          >
            <label className="font-bold">
              {t("Mes notes", "My notes")}
              <textarea
                className="field min-h-32 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={4000}
              />
            </label>
            <button className="btn-primary mt-3" type="submit">
              {t("Enregistrer mes notes", "Save my notes")}
            </button>
          </form>
        </div>
        <aside className="space-y-5">
          <section className="panel">
            <h2 className="font-bold">{t("L’avancement du processus", "Application progress")}</h2>
            <label className="mt-5 block text-xs font-bold">
              {t("Statut actuel", "Current status")}
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
                    t(
                      "Statut mis à jour localement. Les graphiques de l’accueil reflètent ce changement.",
                      "Status updated locally. Dashboard charts reflect this change.",
                    ),
                  );
                }}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {t(
                      s,
                      {
                        Envoyée: "Submitted",
                        "Réponse reçue": "Reply received",
                        Entretien: "Interview",
                        "Offre reçue": "Offer received",
                        Refusée: "Rejected",
                      }[s],
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={a.email}
                onChange={(e) => updateApplication(id, { email: e.target.checked })}
              />
              <Mail size={16} />
              {t("Un email a été reçu", "An email was received")}
            </label>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t(
                "Indication manuelle dans la démo. Aucun accès Gmail, Outlook ou autre messagerie.",
                "Manually reported in this demo. No access to Gmail, Outlook or other email services.",
              )}
            </p>
            <div className="mt-6 space-y-4 border-t pt-5">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <h3 className="text-xs font-bold">
                    {t("Envoi d’exemple", "Example submission")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(a.sentAt)}
                    {t("· Simulation", "· Simulation")}
                  </p>
                </div>
              </div>
              {a.responseAt && (
                <div className="flex gap-3">
                  <Check size={14} className="text-teal-700" />
                  <div>
                    <h3 className="text-xs font-bold">
                      {t("Réponse renseignée", "Reply reported")}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(a.responseAt)} · {a.stage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="rounded-2xl bg-ink p-5 text-white">
            <h2 className="text-sm font-bold">
              {t("Le détail fait la différence.", "Details make a difference.")}
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              {t(
                "Garde une trace du poste, du lien source et des pièces utilisées. Ici, tout est un bac à sable ; les documents initiaux n’ont jamais été envoyés.",
                "Keep a record of the job, source link and attachments. This is a sandbox; the initial documents were never sent.",
              )}
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
