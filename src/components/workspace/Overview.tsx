import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Flame,
  ArrowUpRight,
  Send,
  Clock3,
  BriefcaseBusiness,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useWorkspace } from "./useWorkspace";
import { usePreferences } from "@/components/preferences/usePreferences";
import { statistics, stages, formatDate } from "@/lib/workspace-data";
import {
  mockActivations,
  usageChart,
  usageSummary,
  usageReference,
  type UsagePeriod,
} from "@/lib/autopilot-usage";
export function Overview() {
  const { t, language } = usePreferences();
  const { applications } = useWorkspace();
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [period, setPeriod] = useState<UsagePeriod>("day");
  const [zone, setZone] = useState("Europe/Paris");
  useEffect(() => setZone(Intl.DateTimeFormat().resolvedOptions().timeZone), []);
  const summary = useMemo(() => usageSummary(mockActivations, usageReference, zone), [zone]);
  const chart = useMemo(
    () => usageChart(mockActivations, period, usageReference, zone),
    [period, zone],
  );
  const stats = statistics(applications, "365d");
  const pending = applications.filter((a) => a.stage === "Envoyée").length;
  const locale = language === "fr" ? "fr-FR" : "en-GB";
  const label = (key: string) =>
    new Date(key.length === 7 ? key + "-01T12:00:00Z" : key + "T12:00:00Z").toLocaleDateString(
      locale,
      { day: period === "month" ? undefined : "numeric", month: "short", timeZone: "UTC" },
    );
  const calendar = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(summary.today + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 34 + i);
    const key = d.toISOString().slice(0, 10);
    return { key, hours: summary.daily[key] ?? 0 };
  });
  const cards = [
    {
      title: t("Candidatures au total", "Total applications"),
      value: stats.total,
      icon: Send,
      note: t("Toutes les étapes", "All stages"),
    },
    {
      title: t("Envoyées", "Submitted"),
      value: stats.total,
      icon: Send,
      note: t("Dossiers fictifs déposés", "Fictional submitted records"),
    },
    {
      title: t("En attente de réponse", "Awaiting a reply"),
      value: pending,
      icon: Clock3,
      note: t("Statut « Envoyée »", "“Submitted” status"),
    },
    {
      title: t("Entretiens", "Interviews"),
      value: stats.interviews,
      icon: BriefcaseBusiness,
      note: t("Processus en cours", "In progress"),
    },
    {
      title: t("Taux de réponse", "Response rate"),
      value: `${stats.replyRate} %`,
      icon: MessageSquare,
      note: t("Réponses / candidatures", "Replies / applications"),
    },
  ];
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("Bonjour, bienvenue.", "Hello, welcome.")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "Un espace clair pour préparer ta prochaine étape professionnelle.",
            "A clear workspace to prepare your next career move.",
          )}
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <section className="panel">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">
                {t("Utilisation de l’Autopilote", "Autopilot usage")}
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {t(
                  "Durées d’activation fictives · au 28 octobre 2026",
                  "Fictional activation durations · as of 28 October 2026",
                )}
              </p>
            </div>
            <div
              className="flex rounded-full bg-secondary p-1"
              aria-label={t("Agrégation du graphique", "Chart grouping")}
            >
              {(
                [
                  { key: "day", fr: "Jour", en: "Day" },
                  { key: "week", fr: "Semaine", en: "Week" },
                  { key: "month", fr: "Mois", en: "Month" },
                ] as const
              ).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  aria-pressed={period === p.key}
                  className={`rounded-full px-3 py-1.5 text-xs ${period === p.key ? "bg-card font-bold shadow-soft" : "text-muted-foreground"}`}
                >
                  {t(p.fr, p.en)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <strong className="text-3xl font-medium text-primary-text">
              {chart
                .reduce((s, v) => s + v.hours, 0)
                .toLocaleString(locale, { maximumFractionDigits: 1 })}
            </strong>
            <span className="text-sm text-muted-foreground">
              {t("heures sur la période", "hours in this period")}
            </span>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary-text">
              {t("Démonstration", "Demo")}
            </span>
          </div>
          <div className="h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ left: -25, right: 15, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="usage-purple" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                <XAxis
                  dataKey="key"
                  tickFormatter={label}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  labelFormatter={(key) => label(String(key))}
                  formatter={(value) => [
                    `${Number(value).toLocaleString(locale, { maximumFractionDigits: 2 })} h`,
                    t("Durée activée", "Active duration"),
                  ]}
                  contentStyle={{
                    background: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: 15,
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#usage-purple)"
                  dot={{ r: 4, stroke: "var(--card)", strokeWidth: 2 }}
                  isAnimationActive={!reducedMotion}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <details className="mt-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer">
              {t("Voir les durées détaillées", "View detailed durations")}
            </summary>
            <table className="mt-3 w-full text-left">
              <thead>
                <tr>
                  <th>{t("Période", "Period")}</th>
                  <th>{t("Heures activées", "Active hours")}</th>
                </tr>
              </thead>
              <tbody>
                {chart.map((row) => (
                  <tr key={row.key}>
                    <td>{label(row.key)}</td>
                    <td>{row.hours.toLocaleString(locale, { maximumFractionDigits: 2 })} h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>
        <section className="panel">
          <div className="flex justify-between gap-2">
            <h2 className="text-base font-semibold">
              {t("Ta série d’utilisation", "Your activity streak")}
            </h2>
            <Flame size={20} className="text-primary-text" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("Meilleure série", "Best streak")}{" "}
            <strong className="text-foreground">
              {summary.best} {t("jours", "days")}
            </strong>
          </p>
          <div className="my-6 flex items-center justify-between gap-5">
            <div>
              <strong className="text-5xl font-light text-primary-text">{summary.current}</strong>
              <span className="ml-2 text-sm text-muted-foreground">{t("jours", "days")}</span>
            </div>
            <div
              className="grid grid-flow-col grid-rows-7 gap-1.5"
              aria-label={t("Calendrier d’activation fictif", "Fictional activation calendar")}
            >
              {calendar.map((d) => (
                <span
                  key={d.key}
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.key}: ${d.hours.toFixed(1)} h`}
                  title={`${d.key}: ${d.hours.toFixed(1)} h`}
                  className={`h-4 w-4 rounded-[4px] border ${d.hours ? "border-primary/20 bg-primary/70" : "border-border bg-secondary/30"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t(
              "Une activation suffit pour compter un jour. La journée en cours peut encore être complétée.",
              "One activation counts as an active day. Today can still be completed.",
            )}
          </p>
          <div className="mt-5 flex items-center gap-2 border-t pt-4 text-[10px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {zone} · {t("Données de démonstration", "Demo data")}
          </div>
        </section>
      </div>
      <div className="my-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <section key={c.title} className="panel !p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <h2 className="text-xs">{c.title}</h2>
              <c.icon size={15} />
            </div>
            <p className="mt-4 text-3xl font-medium">{c.value}</p>
            <p className="mt-2 text-[10px] text-muted-foreground">{c.note}</p>
          </section>
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section className="panel">
          <div className="mb-4 flex justify-between">
            <h2 className="font-semibold">{t("Activité récente", "Recent activity")}</h2>
            <Link
              to="/app/applications"
              className="flex items-center gap-1 text-xs text-primary-text"
            >
              {t("Tout voir", "View all")}
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <ul className="divide-y">
            {[...applications]
              .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
              .slice(0, 5)
              .map((a) => (
                <li key={a.id}>
                  <Link
                    to="/app/applications/$id"
                    params={{ id: a.id }}
                    className="flex items-center gap-3 py-4"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs text-primary-text">
                      {a.company.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.company} · {formatDate(a.sentAt)}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </Link>
                </li>
              ))}
          </ul>
        </section>
        <section className="panel">
          <h2 className="mb-6 font-semibold">
            {t("Répartition des candidatures", "Application status breakdown")}
          </h2>
          <div className="space-y-5">
            {stages.map((stage) => {
              const count = applications.filter((a) => a.stage === stage).length;
              return (
                <div key={stage}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span>
                      {t(
                        stage,
                        {
                          Envoyée: "Submitted",
                          "Réponse reçue": "Reply received",
                          Entretien: "Interview",
                          "Offre reçue": "Offer received",
                          Refusée: "Rejected",
                        }[stage],
                      )}
                    </span>
                    <strong>{count}</strong>
                  </div>
                  <div
                    className="h-2 rounded-full bg-secondary"
                    role="progressbar"
                    aria-label={stage}
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={applications.length}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary"
                      style={{ width: `${(count / applications.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground">
            {t(
              "Une seule étape par dossier · Données fictives",
              "One stage per record · Fictional data",
            )}
          </p>
        </section>
      </div>
    </>
  );
}
