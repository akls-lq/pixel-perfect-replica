import { jobs } from "./workspace-data";
export type Option = { value: string; fr: string; en: string };
export const filterGroups = {
  contracts: [
    ["Stage", "Stage", "Internship"],
    ["Alternance", "Alternance", "Work-study"],
    ["CDD", "CDD", "Fixed-term"],
    ["CDI", "CDI", "Permanent"],
    ["Graduate Program", "Graduate Program", "Graduate programme"],
    ["VIE/VIA", "VIE/VIA", "VIE/VIA"],
    ["Job étudiant", "Job étudiant", "Student job"],
    ["Recherche/Thèse", "Recherche/Thèse", "Research / PhD"],
    ["Apprentissage", "Apprentissage", "Apprenticeship"],
  ],
  durations: [
    ["1-3", "1–3 mois", "1–3 months"],
    ["4-6", "4–6 mois", "4–6 months"],
    ["7-9", "7–9 mois", "7–9 months"],
    ["10-12", "10–12 mois", "10–12 months"],
    ["13-18", "13–18 mois", "13–18 months"],
    ["19-24", "19–24 mois", "19–24 months"],
    ["25-36", "25–36 mois", "25–36 months"],
  ],
  functions: [
    ["finance", "Finance", "Finance"],
    ["marketing", "Marketing", "Marketing"],
    ["conseil", "Conseil", "Consulting"],
    ["tech", "Informatique / Data", "IT / Data"],
    ["rh", "Ressources humaines", "Human resources"],
    ["commerce", "Commerce", "Sales"],
    ["communication", "Communication", "Communications"],
    ["ingenierie", "Ingénierie", "Engineering"],
    ["juridique", "Juridique", "Legal"],
    ["projet", "Gestion de projet", "Project management"],
  ],
  experience: [
    ["junior", "Étudiant / jeune diplômé", "Student / recent graduate"],
    ["3-5", "3 à 5 ans", "3 to 5 years"],
    ["6-10", "6 à 10 ans", "6 to 10 years"],
    ["10+", "Plus de 10 ans", "More than 10 years"],
  ],
  languages: [
    ["fr", "Français", "French"],
    ["en", "Anglais", "English"],
    ["es", "Espagnol", "Spanish"],
    ["de", "Allemand", "German"],
    ["da", "Danois", "Danish"],
    ["sv", "Suédois", "Swedish"],
    ["ca", "Catalan", "Catalan"],
    ["cs", "Tchèque", "Czech"],
    ["fi", "Finnois", "Finnish"],
    ["gl", "Galicien", "Galician"],
    ["it", "Italien", "Italian"],
    ["no", "Norvégien", "Norwegian"],
    ["nl", "Néerlandais", "Dutch"],
    ["pl", "Polonais", "Polish"],
  ],
  education: [
    ["none", "Aucun prérequis", "No requirement"],
    ["bachelor", "Bac+3 / Bachelor", "Bachelor’s degree"],
    ["master", "Master / MSc / Grande École", "Master / MSc / Grande École"],
    ["phd", "Doctorat", "PhD"],
  ],
  sectors: [
    ["banque", "Banque / Finance", "Banking / Finance"],
    ["conseil", "Conseil", "Consulting"],
    ["tech", "Technologie", "Technology"],
    ["industrie", "Industrie", "Industry"],
    ["sante", "Santé", "Healthcare"],
    ["luxe", "Luxe", "Luxury"],
    ["distribution", "Distribution", "Retail"],
    ["energie", "Énergie", "Energy"],
    ["transport", "Transport", "Transport"],
    ["immobilier", "Immobilier", "Real estate"],
  ],
  application: [["simple", "Candidature simplifiée", "Easy apply"]],
  remote: [
    ["hybrid", "Télétravail ponctuel autorisé", "Occasional remote work"],
    ["full", "Télétravail à temps plein", "Fully remote"],
  ],
  companies: [
    ["large", "Grande entreprise", "Large company"],
    ["startup", "Start-up", "Start-up"],
    ["sme", "PME", "SME"],
    [
      "public",
      "Association / institution publique / laboratoire",
      "Non-profit / public institution / laboratory",
    ],
    ["collective", "Collectif", "Collective"],
  ],
} satisfies Record<string, string[][]>;
export type Group = keyof typeof filterGroups | "start";
export const criteriaGroups = [...Object.keys(filterGroups), "start"] as Group[];
export type SearchCriteria = {
  q: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
} & Record<Group, string[]>;
export const emptyCriteria: SearchCriteria = {
  q: "",
  city: "",
  salaryMin: "",
  salaryMax: "",
  contracts: [],
  durations: [],
  functions: [],
  experience: [],
  languages: [],
  education: [],
  sectors: [],
  application: [],
  remote: [],
  companies: [],
  start: [],
};
export function options(group: keyof typeof filterGroups): Option[] {
  return filterGroups[group].map(([value, fr, en]) => ({ value: value!, fr: fr!, en: en! }));
}
export function restoreCriteria(value: unknown): SearchCriteria {
  const result = { ...emptyCriteria };
  if (!value || typeof value !== "object") return result;
  const v = value as Record<string, unknown>;
  for (const k of ["q", "city"] as const)
    if (typeof v[k] === "string") result[k] = (v[k] as string).slice(0, 200);
  for (const k of ["salaryMin", "salaryMax"] as const)
    if (typeof v[k] === "string" && /^\d{1,8}$/.test(v[k] as string)) result[k] = v[k] as string;
  if (result.salaryMin && result.salaryMax && Number(result.salaryMin) > Number(result.salaryMax)) {
    result.salaryMin = "";
    result.salaryMax = "";
  }
  for (const k of criteriaGroups) {
    if (Array.isArray(v[k]))
      result[k] = (v[k] as unknown[]).filter(
        (x): x is string =>
          typeof x === "string" &&
          (k === "start"
            ? x === "asap" || /^\d{4}-(0[1-9]|1[0-2])$/.test(x)
            : options(k).some((o) => o.value === x)),
      );
  }
  return result;
}
export function futureMonths(now: Date, count = 18) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1, 12);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      fr: date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      en: date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    };
  });
}
// Extra search attributes are explicitly mock metadata, not inferred employer facts.
export const searchDemoJobs = jobs.map((job, i) => ({
  ...job,
  functionGroup: [
    "projet",
    "tech",
    "marketing",
    "tech",
    "rh",
    "finance",
    "ingenierie",
    "communication",
  ][i]!,
  industry: ["conseil", "tech", "luxe", "tech", "conseil", "banque", "industrie", "distribution"][
    i
  ]!,
  companyType: ["startup", "sme", "large", "startup", "public", "large", "sme", "collective"][i]!,
  simple: i % 2 === 0,
  region:
    job.city === "Paris"
      ? "Île-de-France"
      : job.city === "Lyon"
        ? "Auvergne-Rhône-Alpes"
        : job.city === "Lille"
          ? "Hauts-de-France"
          : job.city === "Nantes"
            ? "Pays de la Loire"
            : "Nouvelle-Aquitaine",
}));
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
export function selectDemoJobs(f: SearchCriteria) {
  return searchDemoJobs.filter((j) => {
    const has = (key: Group, test: (v: string) => boolean) => !f[key].length || f[key].some(test);
    return (
      (!f.q || norm(`${j.title} ${j.company} ${j.skills.join(" ")}`).includes(norm(f.q))) &&
      (!f.salaryMin || j.salary >= Number(f.salaryMin)) &&
      (!f.salaryMax || j.salary <= Number(f.salaryMax)) &&
      (!f.city ||
        norm(
          `${j.city} ${j.region} ${{ Paris: "75", Lyon: "69 Rhône", Nantes: "44 Loire-Atlantique", Bordeaux: "33 Gironde", Lille: "59 Nord" }[j.city] ?? ""}`,
        ).includes(norm(f.city))) &&
      has("contracts", (v) => v === j.contract) &&
      has("durations", (v) => {
        const [min, max] = v.split("-").map(Number);
        return j.duration > 0 && j.duration >= min! && j.duration <= max!;
      }) &&
      has("functions", (v) => v === j.functionGroup) &&
      has("experience", (v) =>
        v === "junior"
          ? j.experience < 3
          : v === "3-5"
            ? j.experience >= 3 && j.experience <= 5
            : v === "6-10"
              ? j.experience >= 6 && j.experience <= 10
              : j.experience > 10,
      ) &&
      has("languages", (v) => v === (j.language === "Anglais" ? "en" : "fr")) &&
      has(
        "education",
        (v) =>
          v ===
          (j.education === "Bac +3" ? "bachelor" : j.education === "Bac +5" ? "master" : "none"),
      ) &&
      has("sectors", (v) => v === j.industry) &&
      has("application", () => j.simple) &&
      has("remote", (v) => (v === "full" ? j.remote === "Télétravail" : j.remote === "Hybride")) &&
      has("companies", (v) => v === j.companyType) &&
      has("start", (v) => (v === "asap" ? j.asap : v === j.startMonth))
    );
  });
}
