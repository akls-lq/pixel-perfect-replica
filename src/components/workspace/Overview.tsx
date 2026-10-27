import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  Send,
  Mail,
  Target,
  BriefcaseBusiness,
  MessageSquare,
  CircleX,
  Check,
  ArrowRight,
} from "lucide-react";
import { useWorkspace } from "./useWorkspace";
import { PageTitle, PeriodFilter, StageBadge } from "./Shared";
import { Mascot } from "./Mascot";
import {
  buildTimeline,
  formatDate,
  periods,
  statistics,
  stages,
  type Period,
} from "@/lib/workspace-data";
const palette = ["#4F5CF1", "#0DB89A", "#F59E42", "#8B5CF6", "#2D7DD2", "#94A3B8"];
export function Overview() {
  const [period, setPeriod] = useState<Period>("30d");
  const { applications, resume, saved, reviewed } = useWorkspace();
  const stats = useMemo(() => statistics(applications, period), [applications, period]);
  const timeline = useMemo(() => buildTimeline(applications, period), [applications, period]);
  const sectors = Object.entries(
    stats.selected.reduce<Record<string, number>>(
      (acc, a) => ({ ...acc, [a.sector]: (acc[a.sector] || 0) + 1 }),
      {},
    ),
  ).map(([name, value]) => ({ name, value }));
  const funnel = stages.map((stage) => ({
    name: stage,
    total: stats.selected.filter((a) => a.stage === stage).length,
  }));
  const cards = [
    {
      label: "Candidatures envoyées",
      value: stats.total,
      note: "Dossiers de la période",
      icon: Send,
      tone: "bg-primary/10 text-primary-text",
    },
    {
      label: "Réponses reçues",
      value: stats.replies,
      note: `${stats.replyRate} % de taux de réponse`,
      icon: MessageSquare,
      tone: "bg-teal-50 text-teal-800",
    },
    {
      label: "Entretiens en cours",
      value: stats.interviews,
      note: "Statut actuel des dossiers",
      icon: BriefcaseBusiness,
      tone: "bg-orange-50 text-orange-800",
    },
    {
      label: "Secteurs explorés",
      value: stats.sectors,
      note: "Domaines distincts visés",
      icon: Target,
      tone: "bg-violet-50 text-violet-800",
    },
    {
      label: "Emails reçus",
      value: stats.emails,
      note: "Signalés dans le jeu démo",
      icon: Mail,
      tone: "bg-sky-50 text-sky-800",
    },
    {
      label: "Refus reçus",
      value: stats.rejections,
      note: `${stats.total ? Math.round((stats.rejections / stats.total) * 100) : 0} % des candidatures`,
      icon: CircleX,
      tone: "bg-red-50 text-red-800",
    },
  ];
  const progress = [
    { title: "Ajouter mon CV", done: !!resume, to: "/app/cv-studio" },
    { title: "Sauvegarder une offre", done: saved.length > 0, to: "/app/offers" },
    { title: "Étudier un matching", done: reviewed.length > 0, to: "/app/offers" },
  ] as const;
  const completion = Math.round((progress.filter((p) => p.done).length / 3) * 100);
  return (
    <>
      <PageTitle
        eyebrow="UNE VUE CLAIRE POUR AVANCER"
        title="Ta recherche, en perspective."
        description="Candidatures, réponses et opportunités : retrouve les indicateurs qui comptent, au même endroit."
      >
        <PeriodFilter value={period} onChange={setPeriod} />
      </PageTitle>
      <section className="mb-7 flex items-center justify-between gap-5 overflow-hidden rounded-2xl bg-ink px-6 py-5 text-white md:px-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#82E3D1]">
            Un pas après l’autre
          </p>
          <h2 className="text-xl font-bold md:text-2xl">
            Tu prépares la suite. Créto t’accompagne.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Voici une vue d’ensemble fictive pour explorer ton futur espace. Les données sont
            arrêtées au 27 octobre 2026.
          </p>
          <Link
            to="/app/offers"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white"
          >
            Trouver ma prochaine opportunité <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hidden shrink-0 sm:block">
          <Mascot size={132} />
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-live="polite">
        {cards.map((c) => (
          <section key={c.label} className="panel !p-4">
            <span className={`inline-flex rounded-lg p-2 ${c.tone}`}>
              <c.icon size={18} />
            </span>
            <h2 className="mt-4 text-xs font-medium text-muted-foreground">{c.label}</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">{c.value}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{c.note}</p>
          </section>
        ))}
      </div>
      <p className="my-4 text-xs text-muted-foreground">
        Les indicateurs portent sur les candidatures déposées pendant la période sélectionnée et
        leur statut actuel. Les réponses et emails sont renseignés dans les exemples, sans connexion
        à une boîte mail.
      </p>
      <div className="grid items-start gap-5 lg:grid-cols-[1.7fr_1fr]">
        <section className="panel">
          <div className="mb-5 flex flex-wrap justify-between gap-3">
            <div>
              <h2 className="font-bold">Le rythme de ta recherche</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Envois et réponses dans le temps · Données fictives
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="text-primary-text">● Candidatures</span>
              <span className="text-teal-700">● Réponses</span>
            </div>
          </div>
          <div
            className="h-64 w-full min-w-0"
            role="img"
            aria-label={`${stats.total} candidatures et ${stats.replies} réponses sur la période`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ left: -25, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="application-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F5CF1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4F5CF1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#E3E7F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, borderColor: "#E3E7F0", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="Candidatures"
                  stroke="#4F5CF1"
                  strokeWidth={3}
                  fill="url(#application-fill)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="Réponses"
                  stroke="#0DB89A"
                  strokeWidth={2}
                  fill="transparent"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              Voir les valeurs du graphique
            </summary>
            <table className="mt-3 w-full text-left">
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Envois</th>
                  <th>Réponses</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((v, i) => (
                  <tr key={i}>
                    <td>{v.name}</td>
                    <td>{v.Candidatures}</td>
                    <td>{v.Réponses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
        <section className="panel">
          <h2 className="font-bold">Les secteurs que tu explores</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Répartition des candidatures de la période
          </p>
          <div aria-hidden="true" className="relative mx-auto h-44 max-w-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  rootTabIndex={-1}
                  data={sectors}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={4}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {sectors.map((s, i) => (
                    <Cell key={s.name} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <strong className="text-2xl">{stats.sectors}</strong>
              <span className="text-xs text-muted-foreground">secteurs</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {sectors.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: palette[i % palette.length] }}
                />
                <span className="flex-1">{s.name}</span>
                <strong>{s.value}</strong>
                <span className="w-9 text-right text-muted-foreground">
                  {Math.round((s.value / stats.total) * 100)} %
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <div className="mb-5 flex justify-between">
            <div>
              <h2 className="font-bold">Où en sont tes candidatures ?</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Chaque dossier appartient à une seule étape
              </p>
            </div>
            <Link to="/app/applications" aria-label="Ouvrir le suivi" className="text-primary-text">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <div
            className="h-52 min-w-0"
            role="img"
            aria-label={funnel.map((f) => `${f.name} : ${f.total}`).join(", ")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 0, right: 25 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 5" />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={105}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "#EEF1F8" }} />
                <Bar
                  dataKey="total"
                  name="Dossiers"
                  radius={[0, 5, 5, 0]}
                  barSize={21}
                  label={{ position: "right", fontSize: 11 }}
                  isAnimationActive={false}
                >
                  {funnel.map((f, i) => (
                    <Cell key={f.name} fill={palette[i % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              Voir les valeurs par étape
            </summary>
            <ul className="mt-2 space-y-1">
              {funnel.map((f) => (
                <li key={f.name}>
                  {f.name} : {f.total}
                </li>
              ))}
            </ul>
          </details>
        </section>
        <section className="panel">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-text">
            Ta progression personnelle
          </p>
          <h2 className="mt-2 text-xl font-bold">Bien préparé·e, dès le départ.</h2>
          <div className="mt-5 flex items-center gap-3">
            <div
              className="h-2 flex-1 rounded-full bg-secondary"
              role="progressbar"
              aria-label="Préparation de la recherche"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <strong className="text-sm">{completion} %</strong>
          </div>
          <ul className="mt-4 divide-y">
            {progress.map((p) => (
              <li key={p.title}>
                <Link to={p.to} className="flex items-center gap-3 py-3 text-sm">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full ${p.done ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}
                  >
                    {p.done ? <Check size={14} /> : <ArrowRight size={13} />}
                  </span>
                  <span className="flex-1">{p.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.done ? "Fait" : "À faire"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Cette progression correspond à tes actions dans la session. Aucun point pour l’envoi
            massif.
          </p>
        </section>
      </div>
      <section className="panel mt-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-bold">Tes derniers dossiers</h2>
          <Link to="/app/applications" className="text-xs font-bold text-primary-text">
            Tout le suivi →
          </Link>
        </div>
        <div className="space-y-2">
          {[...stats.selected]
            .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
            .slice(0, 4)
            .map((a) => (
              <Link
                to="/app/applications/$id"
                params={{ id: a.id }}
                key={a.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border p-3 hover:border-primary/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-sm font-bold text-primary-text">
                  {a.company.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.company} · {formatDate(a.sentAt)}
                  </p>
                </div>
                <StageBadge stage={a.stage} />
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
