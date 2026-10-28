import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { usePreferences } from "@/components/preferences/usePreferences";
import { PageTitle, PeriodFilter, StageBadge, EmptyState } from "@/components/workspace/Shared";
import { statistics, formatDate, jobs, type Period } from "@/lib/workspace-data";
export const Route = createFileRoute("/app/applications/")({ component: Applications });
function Applications() {
  const { t } = usePreferences();
  const { applications } = useWorkspace();
  const [period, setPeriod] = useState<Period>("30d");
  const [stage, setStage] = useState("all");
  const [company, setCompany] = useState("");
  const [q, setQ] = useState("");
  const [contract, setContract] = useState("");
  const [city, setCity] = useState("");
  const [emailOnly, setEmailOnly] = useState(false);
  const stats = useMemo(() => statistics(applications, period), [applications, period]);
  const list = stats.selected
    .filter((a) => {
      const job = jobs.find((j) => j.id === a.jobId);
      return (
        (stage === "all" ||
          stage === "submitted" ||
          ((stage === "pending" || stage === "no-response") && !a.responseAt) ||
          (stage === "ongoing" && ["Réponse reçue", "Entretien"].includes(a.stage)) ||
          (stage === "interview" && a.stage === "Entretien") ||
          (stage === "rejected" && a.stage === "Refusée") ||
          (stage === "offer" && a.stage === "Offre reçue")) &&
        (!company || a.company === company) &&
        (!q || a.title.toLowerCase().includes(q.toLowerCase())) &&
        (!contract || job?.contract === contract) &&
        (!city || job?.city === city) &&
        (!emailOnly || a.email)
      );
    })
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  const choices = [
    { value: "all", fr: "Toutes", en: "All" },
    { value: "submitted", fr: "Envoyées", en: "Submitted" },
    { value: "pending", fr: "En attente", en: "Awaiting reply" },
    { value: "no-response", fr: "Sans réponse", en: "No response" },
    {
      value: "processing",
      fr: "En traitement (non disponible)",
      en: "Processing (unavailable)",
      disabled: true,
    },
    { value: "ongoing", fr: "Processus en cours", en: "Process in progress" },
    { value: "interview", fr: "Entretien", en: "Interview" },
    {
      value: "accepted",
      fr: "Acceptées (non disponible)",
      en: "Accepted (unavailable)",
      disabled: true,
    },
    { value: "offer", fr: "Offre reçue", en: "Offer received" },
    { value: "rejected", fr: "Refusées", en: "Rejected" },
  ];
  return (
    <>
      <PageTitle
        eyebrow={t("CHAQUE DOSSIER GARDE SON HISTOIRE", "EVERY APPLICATION HAS A STORY")}
        title={t("Ton suivi, en toute clarté.", "Your applications, clearly organised.")}
        description={t(
          "Conserve une vue d’ensemble des réponses, des documents et des prochaines étapes. Données fictives, sans connexion email.",
          "Keep track of responses, documents and next steps. Fictional data, with no email connection.",
        )}
      >
        <PeriodFilter value={period} onChange={setPeriod} />
      </PageTitle>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          {
            fr: "Candidatures sur la période",
            en: "Applications in this period",
            value: stats.total,
          },
          {
            fr: "Réponses reçues",
            en: "Replies received",
            value: `${stats.replies} · ${stats.replyRate} %`,
          },
          { fr: "Emails signalés", en: "Reported emails", value: stats.emails },
        ].map((c) => (
          <div key={c.fr} className="panel">
            <h2 className="text-xs text-muted-foreground">{t(c.fr, c.en)}</h2>
            <p className="mt-3 text-3xl font-medium">{c.value}</p>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="text-xs font-semibold">
            {t("Poste recherché", "Job title")}
            <input
              className="field"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Rechercher un poste…", "Search job titles…")}
            />
          </label>
          <label className="text-xs font-semibold">
            {t("Statut", "Status")}
            <select
              className="field"
              aria-label={t("Statut", "Status")}
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              {choices.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {t(o.fr, o.en)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            {t("Entreprise", "Company")}
            <select
              className="field"
              aria-label={t("Entreprise", "Company")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="">{t("Toutes les entreprises", "All companies")}</option>
              {[...new Set(applications.map((a) => a.company))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            {t("Contrat", "Contract")}
            <select
              className="field"
              aria-label={t("Contrat", "Contract")}
              value={contract}
              onChange={(e) => setContract(e.target.value)}
            >
              <option value="">{t("Tous les contrats", "All contracts")}</option>
              {[...new Set(jobs.map((j) => j.contract))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            {t("Localisation", "Location")}
            <select
              className="field"
              aria-label={t("Localisation", "Location")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">{t("Toutes les villes", "All cities")}</option>
              {[...new Set(jobs.map((j) => j.city))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            {t("Type de candidature", "Application type")}
            <select disabled className="field opacity-60">
              <option>
                {t("Non renseigné dans les données", "Not available in existing data")}
              </option>
            </select>
          </label>
        </div>
        <div className="my-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailOnly}
              onChange={(e) => setEmailOnly(e.target.checked)}
            />
            {t("Avec email reçu", "With reported email")}
          </label>
          <button
            onClick={() => {
              setQ("");
              setStage("all");
              setCompany("");
              setContract("");
              setCity("");
              setEmailOnly(false);
            }}
            className="font-semibold text-primary-text"
          >
            {t("Réinitialiser", "Reset filters")}
          </button>
        </div>
        <p aria-live="polite" className="mb-4 border-t pt-4 text-xs text-muted-foreground">
          {list.length}{" "}
          {t("dossier(s) · Référence : 27 octobre 2026", "record(s) · Reference: 27 October 2026")}
        </p>
        {!list.length ? (
          <EmptyState
            title={t("Aucun dossier pour cette sélection.", "No records match this selection.")}
          >
            {t(
              "Élargis la période ou modifie les filtres.",
              "Broaden the period or adjust your filters.",
            )}
          </EmptyState>
        ) : (
          <ul className="divide-y">
            {list.map((a) => (
              <li key={a.id}>
                <Link
                  to="/app/applications/$id"
                  params={{ id: a.id }}
                  className="flex flex-wrap items-center gap-3 py-5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs text-primary-text">
                    {a.company.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold">{a.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.company} · {formatDate(a.sentAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <StageBadge stage={a.stage} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail size={14} />
                      {a.email ? t("Email reçu", "Email reported") : t("Sans email", "No email")}
                    </span>
                    <ArrowUpRight size={16} className="text-primary-text" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
