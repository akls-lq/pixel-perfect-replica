// All records are fictional. The fixed reference date keeps SSR and browser metrics identical.
export const demoDate = new Date("2026-10-27T18:00:00Z");
export const periods = [
  { value: "24h", label: "24 heures", days: 1 },
  { value: "7d", label: "7 jours", days: 7 },
  { value: "30d", label: "1 mois", days: 30 },
  { value: "365d", label: "1 an", days: 365 },
] as const;
export type Period = (typeof periods)[number]["value"];
export const stages = ["Envoyée", "Réponse reçue", "Entretien", "Offre reçue", "Refusée"] as const;
export type Stage = (typeof stages)[number];
export type Application = {
  id: string;
  jobId: string;
  title: string;
  company: string;
  sector: string;
  sentAt: string;
  stage: Stage;
  email: boolean;
  responseAt: string | null;
  sourceUrl: string;
  notes: string;
  cvName: string;
  letterName: string;
};
export type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  sector: string;
  contract: string;
  remote: string;
  salary: number;
  experience: number;
  duration: number;
  hours: string;
  education: string;
  language: string;
  startMonth: string;
  asap: boolean;
  publishedDays: number;
  score: number;
  skills: string[];
  excludedSkills: string[];
  accessible: boolean;
};
const baseJobs = [
  {
    title: "Product Designer",
    company: "Studio Halo",
    city: "Paris",
    sector: "Design",
    contract: "CDI",
    remote: "Hybride",
    salary: 52000,
    experience: 3,
    duration: 0,
    hours: "Temps plein",
    education: "Bac +3",
    language: "Anglais",
    startMonth: "2027-01",
    asap: true,
    publishedDays: 1,
    score: 92,
    skills: ["Figma", "Recherche utilisateur"],
    excludedSkills: ["Design system"],
    accessible: true,
  },
  {
    title: "Développeur·se React",
    company: "Atelier Nova",
    city: "Lyon",
    sector: "Technologie",
    contract: "CDI",
    remote: "Télétravail",
    salary: 48000,
    experience: 2,
    duration: 0,
    hours: "Temps plein",
    education: "Bac +3",
    language: "Français",
    startMonth: "2027-03",
    asap: false,
    publishedDays: 3,
    score: 87,
    skills: ["React", "TypeScript"],
    excludedSkills: ["GraphQL"],
    accessible: true,
  },
  {
    title: "Chargé·e de marketing",
    company: "Maison Brume",
    city: "Nantes",
    sector: "Marketing",
    contract: "CDD",
    remote: "Sur site",
    salary: 36000,
    experience: 1,
    duration: 6,
    hours: "Temps plein",
    education: "Bac +3",
    language: "Français",
    startMonth: "2027-04",
    asap: false,
    publishedDays: 5,
    score: 81,
    skills: ["SEO", "Analytics"],
    excludedSkills: ["CRM"],
    accessible: false,
  },
  {
    title: "Data Analyst junior",
    company: "Lumen Data",
    city: "Bordeaux",
    sector: "Technologie",
    contract: "Alternance",
    remote: "Hybride",
    salary: 22000,
    experience: 0,
    duration: 12,
    hours: "Temps plein",
    education: "Bac +5",
    language: "Anglais",
    startMonth: "2027-01",
    asap: false,
    publishedDays: 2,
    score: 78,
    skills: ["SQL", "Excel"],
    excludedSkills: ["Python"],
    accessible: true,
  },
  {
    title: "Assistant·e RH",
    company: "Cèdre Conseil",
    city: "Lille",
    sector: "Ressources humaines",
    contract: "Stage",
    remote: "Sur site",
    salary: 12000,
    experience: 0,
    duration: 6,
    hours: "Temps plein",
    education: "Bac +3",
    language: "Français",
    startMonth: "2027-03",
    asap: true,
    publishedDays: 8,
    score: 74,
    skills: ["Organisation", "Communication"],
    excludedSkills: ["SIRH"],
    accessible: true,
  },
  {
    title: "Consultant·e finance",
    company: "Orbe Finance",
    city: "Paris",
    sector: "Finance",
    contract: "Freelance",
    remote: "Télétravail",
    salary: 65000,
    experience: 5,
    duration: 3,
    hours: "Temps partiel",
    education: "Bac +5",
    language: "Anglais",
    startMonth: "2027-04",
    asap: false,
    publishedDays: 12,
    score: 69,
    skills: ["Finance", "Excel"],
    excludedSkills: ["SAP"],
    accessible: false,
  },
  {
    title: "Ingénieur·e qualité",
    company: "Nord Fabrique",
    city: "Lyon",
    sector: "Industrie",
    contract: "Intérim",
    remote: "Sur site",
    salary: 42000,
    experience: 2,
    duration: 9,
    hours: "Temps plein",
    education: "Bac +5",
    language: "Français",
    startMonth: "2027-01",
    asap: true,
    publishedDays: 4,
    score: 83,
    skills: ["Qualité", "Audit"],
    excludedSkills: ["ISO 13485"],
    accessible: true,
  },
  {
    title: "Responsable de contenu",
    company: "Collectif Sillage",
    city: "Nantes",
    sector: "Marketing",
    contract: "CDI",
    remote: "Télétravail",
    salary: 44000,
    experience: 3,
    duration: 0,
    hours: "Temps partiel",
    education: "Sans exigence",
    language: "Français",
    startMonth: "2027-03",
    asap: true,
    publishedDays: 1,
    score: 89,
    skills: ["Rédaction", "SEO"],
    excludedSkills: ["Vidéo"],
    accessible: true,
  },
];
export const jobs: Job[] = baseJobs.map((j, i) => ({ ...j, id: String(i + 1) }));
export const initialApplications: Application[] = Array.from({ length: 42 }, (_, i) => {
  const job = jobs[i % jobs.length]!;
  const hours = [
    2, 5, 10, 20, 30, 48, 72, 96, 120, 140, 180, 240, 320, 480, 600, 800, 1000, 1200, 1700, 2100,
    2600, 3000, 3600, 4200, 5000, 6000, 7000, 8000,
  ];
  const ago = hours[i % hours.length]! + (i >= hours.length ? 12 : 0);
  const sent = new Date(demoDate.getTime() - ago * 3600000);
  const stage = stages[i % stages.length]!;
  return {
    id: `c${i + 1}`,
    jobId: job.id,
    title: job.title,
    company: job.company,
    sector: job.sector,
    sentAt: sent.toISOString(),
    stage,
    email: stage !== "Envoyée",
    responseAt:
      stage === "Envoyée"
        ? null
        : new Date(sent.getTime() + Math.min(ago / 2, 24) * 3600000).toISOString(),
    sourceUrl: "",
    notes: "Exemple fictif pour explorer le suivi. Aucun email ni document réel connecté.",
    cvName: `CV-exemple-${i + 1}.txt`,
    letterName: `Lettre-exemple-${i + 1}.txt`,
  };
});
export function inPeriod(value: string, period: Period) {
  const days = periods.find((p) => p.value === period)!.days;
  const time = new Date(value).getTime();
  return time <= demoDate.getTime() && time >= demoDate.getTime() - days * 86400000;
}
export function statistics(applications: Application[], period: Period) {
  const selected = applications.filter((a) => inPeriod(a.sentAt, period));
  const replies = selected.filter((a) => a.responseAt !== null).length;
  const interviews = selected.filter((a) => a.stage === "Entretien").length;
  const sectors = [...new Set(selected.map((a) => a.sector))];
  return {
    selected,
    total: selected.length,
    replies,
    interviews,
    sectors: sectors.length,
    emails: selected.filter((a) => a.email).length,
    rejections: selected.filter((a) => a.stage === "Refusée").length,
    replyRate: selected.length ? Math.round((replies / selected.length) * 100) : 0,
  };
}
export type JobFilters = {
  q: string;
  city: string;
  contract: string;
  sector: string;
  remote: string;
  salary: string;
  experience: string;
  duration: string;
  hours: string;
  education: string;
  language: string;
  startMonth: string;
  asap: boolean;
  published: string;
  minScore: string;
  skills: string;
  exclude: string;
  accessible: boolean;
  autopilot: boolean;
};
export const emptyFilters: JobFilters = {
  q: "",
  city: "",
  contract: "",
  sector: "",
  remote: "",
  salary: "",
  experience: "",
  duration: "",
  hours: "",
  education: "",
  language: "",
  startMonth: "",
  asap: false,
  published: "",
  minScore: "",
  skills: "",
  exclude: "",
  accessible: false,
  autopilot: false,
};
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
export function filterJobs(source: Job[], f: JobFilters) {
  return source.filter((j) => {
    const text = normalize(`${j.title} ${j.company} ${j.skills.join(" ")}`);
    return (
      (!f.q || text.includes(normalize(f.q))) &&
      (!f.city || normalize(j.city).includes(normalize(f.city))) &&
      (!f.contract || j.contract === f.contract) &&
      (!f.sector || j.sector === f.sector) &&
      (!f.remote || j.remote === f.remote) &&
      (!f.salary || j.salary >= Number(f.salary)) &&
      (!f.experience || j.experience <= Number(f.experience)) &&
      (!f.duration || j.duration === Number(f.duration)) &&
      (!f.hours || j.hours === f.hours) &&
      (!f.education || j.education === f.education) &&
      (!f.language || j.language === f.language) &&
      (!f.startMonth || j.startMonth === f.startMonth) &&
      (!f.asap || j.asap) &&
      (!f.published || j.publishedDays <= Number(f.published)) &&
      (!f.minScore || j.score >= Number(f.minScore)) &&
      (!f.skills ||
        f.skills
          .split(",")
          .filter((s) => s.trim())
          .every((s) => normalize(j.skills.join(" ")).includes(normalize(s)))) &&
      (!f.exclude ||
        !f.exclude
          .split(",")
          .filter((s) => s.trim())
          .some((s) => text.includes(normalize(s)))) &&
      (!f.accessible || j.accessible)
    );
  });
}
export const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
export function safeUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildTimeline(applications: Application[], period: Period) {
  const selected = applications.filter((a) => inPeriod(a.sentAt, period));
  const days = periods.find((p) => p.value === period)!.days;
  const count = period === "24h" ? 12 : period === "7d" ? 7 : period === "30d" ? 10 : 12;
  const size = (days * 86400000) / count;
  return Array.from({ length: count }, (_, i) => {
    const start = demoDate.getTime() - days * 86400000 + i * size;
    const end = start + size;
    // Half-open buckets avoid counting an event twice at a chart boundary.
    const contains = (value: string) => {
      const t = new Date(value).getTime();
      return t >= start && (t < end || (i === count - 1 && t <= end));
    };
    const date = new Date(start);
    return {
      name:
        period === "24h"
          ? `${date.getUTCHours()}h`
          : date.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              timeZone: "Europe/Paris",
            }),
      Candidatures: selected.filter((a) => contains(a.sentAt)).length,
      Réponses: selected.filter((a) => a.responseAt && contains(a.responseAt)).length,
    };
  });
}
