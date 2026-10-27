import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Mail, Search, FileText, MessageSquare, CalendarDays } from "lucide-react";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import { PageTitle, PeriodFilter, StageBadge, EmptyState } from "@/components/workspace/Shared";
import { statistics, formatDate, stages, type Period } from "@/lib/workspace-data";
export const Route = createFileRoute("/app/applications/")({
  head: () => ({ meta: [{ title: "Suivi des candidatures — Crétoria" }] }),
  component: Applications,
});
function Applications() {
  const { applications } = useWorkspace();
  const [period, setPeriod] = useState<Period>("30d");
  const [stage, setStage] = useState("");
  const [q, setQ] = useState("");
  const [emailOnly, setEmailOnly] = useState(false);
  const stats = useMemo(() => statistics(applications, period), [applications, period]);
  const list = stats.selected
    .filter(
      (a) =>
        (!stage || a.stage === stage) &&
        (!emailOnly || a.email) &&
        `${a.title} ${a.company}`.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  return (
    <>
      <PageTitle
        eyebrow="CHAQUE DOSSIER GARDE SON HISTOIRE"
        title="Tout ton suivi. Rien de perdu."
        description="Retrouve chaque candidature, son étape, les réponses signalées et les documents associés. Les données ci-dessous sont fictives ; aucune boîte mail n’est connectée."
      >
        <PeriodFilter value={period} onChange={setPeriod} />
      </PageTitle>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { title: "Candidatures sur la période", value: stats.total, icon: FileText },
          {
            title: "Réponses reçues",
            value: `${stats.replies} · ${stats.replyRate} %`,
            icon: MessageSquare,
          },
          { title: "Emails signalés", value: stats.emails, icon: Mail },
        ].map((x) => (
          <div key={x.title} className="panel flex items-center gap-4">
            <span className="rounded-xl bg-primary/10 p-3 text-primary-text">
              <x.icon size={22} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{x.title}</p>
              <p className="mt-1 text-2xl font-extrabold">{x.value}</p>
            </div>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="mb-5 grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-bold">
            <span className="flex gap-2">
              <Search size={14} /> Retrouver un dossier
            </span>
            <input
              className="field"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Métier, entreprise…"
            />
          </label>
          <label className="text-xs font-bold">
            Étape du processus
            <select className="field" value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">Toutes les étapes</option>
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 py-3 text-xs font-semibold">
            <input
              type="checkbox"
              checked={emailOnly}
              onChange={(e) => setEmailOnly(e.target.checked)}
            />{" "}
            Avec email reçu
          </label>
        </div>
        <p className="mb-4 text-xs text-muted-foreground" aria-live="polite">
          {list.length} dossier{list.length > 1 ? "s" : ""} affiché{list.length > 1 ? "s" : ""} ·
          Période calculée depuis le 27 octobre 2026
        </p>
        {list.length === 0 ? (
          <EmptyState title="Aucun dossier pour cette sélection.">
            Modifie la période, le statut ou tes mots-clés.
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {list.map((a) => (
              <li key={a.id}>
                <Link
                  to="/app/applications/$id"
                  params={{ id: a.id }}
                  className="flex flex-wrap items-center gap-4 rounded-xl border p-4 transition hover:border-primary/40 hover:bg-background"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold text-primary-text">
                    {a.company.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-[160px] flex-1">
                    <h2 className="text-sm font-bold">{a.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.company} · {a.sector} · Fictif
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays size={14} />
                      {formatDate(a.sentAt)}
                    </span>
                    <StageBadge stage={a.stage} />
                    <span
                      className={`flex items-center gap-1 ${a.email ? "text-teal-800" : "text-muted-foreground"}`}
                    >
                      <Mail size={15} />
                      {a.email ? "Email reçu" : "Pas d’email"}
                    </span>
                    <ArrowUpRight size={18} className="text-primary-text" />
                  </div>
                  <p className="w-full border-t pt-3 text-xs text-muted-foreground">
                    CV et lettre d’exemple joints · Ouvrir le dossier pour consulter les documents
                    et renseigner le lien de l’offre
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
