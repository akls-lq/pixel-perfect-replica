// Données fictives de démonstration — affichées avec le badge « Démo ».
export type DemoJob = {
  id: string;
  title: string;
  company: string;
  city: string;
  contract: "CDI" | "CDD" | "Alternance" | "Stage" | "Freelance";
  remote: "Sur site" | "Hybride" | "Télétravail";
  salary?: string;
  score: number;
  present: string[];
  missing: string[];
};

export const demoJobs: DemoJob[] = [
  {
    id: "1",
    title: "Développeur·se Front-end React",
    company: "Atelier Nova (fictif)",
    city: "Lyon",
    contract: "CDI",
    remote: "Hybride",
    salary: "42–50 k€",
    score: 86,
    present: ["React", "TypeScript", "Accessibilité"],
    missing: ["GraphQL"],
  },
  {
    id: "2",
    title: "Chargé·e de marketing digital",
    company: "Maison Brume (fictif)",
    city: "Nantes",
    contract: "CDD",
    remote: "Sur site",
    score: 72,
    present: ["SEO", "Analytics"],
    missing: ["Google Ads", "CRM"],
  },
  {
    id: "3",
    title: "Product Designer",
    company: "Studio Halo (fictif)",
    city: "Paris",
    contract: "CDI",
    remote: "Télétravail",
    salary: "48–55 k€",
    score: 79,
    present: ["Figma", "Recherche utilisateur"],
    missing: ["Design system"],
  },
  {
    id: "4",
    title: "Data Analyst junior",
    company: "Lumen Data (fictif)",
    city: "Bordeaux",
    contract: "Alternance",
    remote: "Hybride",
    score: 64,
    present: ["SQL", "Excel"],
    missing: ["Python", "Power BI"],
  },
  {
    id: "5",
    title: "Développeur·se Back-end Node.js",
    company: "Orbe Logistique (fictif)",
    city: "Lille",
    contract: "CDI",
    remote: "Télétravail",
    salary: "45–52 k€",
    score: 58,
    present: ["Node.js"],
    missing: ["PostgreSQL", "Docker"],
  },
  {
    id: "6",
    title: "Assistant·e chef de projet",
    company: "Cèdre Conseil (fictif)",
    city: "Lyon",
    contract: "Stage",
    remote: "Sur site",
    score: 69,
    present: ["Organisation", "Anglais"],
    missing: ["MS Project"],
  },
];

export const contracts = ["Tous", "CDI", "CDD", "Alternance", "Stage", "Freelance"] as const;
