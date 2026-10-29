import { jobs, type Job } from "@/lib/workspace-data";

/** Demo CV skills used to score match % when no parsed resume exists. */
export const demoCvSkills = [
  "React",
  "TypeScript",
  "Figma",
  "Recherche utilisateur",
  "SEO",
  "Analytics",
  "SQL",
  "Excel",
  "Organisation",
  "Communication",
  "Rédaction",
] as const;

export type MatchJob = Job & {
  description: string;
  matchPercent: number;
  matchedSkills: string[];
};

const descriptions: Record<string, string> = {
  "1": "Tu concevras des parcours produit clairs, du wireframe au prototype haute fidélité, en binôme avec produit et eng.",
  "2": "Stack React/TypeScript, composants soignés, accessibilité et perf. Petites équipes, livraisons courtes.",
  "3": "Campagnes acquisition, contenu et mesure. Tu pilotes SEO + analytics pour faire grandir la marque.",
  "4": "Dashboards, requêtes SQL et storytelling data pour les équipes métier. Mentoring junior inclus.",
  "5": "Recrutement opérationnel, onboarding et vie d’équipe. Stage rythmé, vrai impact RH.",
  "6": "Missions finance courte durée : modelisation, reporting et accompagnement dirigeants.",
  "7": "Qualité process et audits terrain. Tu structures les plans d’action avec production.",
  "8": "Ligne éditoriale, articles et SEO. Tu poses le ton de la marque sur le web.",
};

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function scoreJobAgainstCv(job: Job, cvSkills: readonly string[] = demoCvSkills) {
  const cv = cvSkills.map(normalize);
  const matchedSkills = job.skills.filter((s) => cv.includes(normalize(s)));
  const skillRatio = job.skills.length ? matchedSkills.length / job.skills.length : 0;
  // Blend listed job score with skill overlap so the % feels tied to the CV.
  const matchPercent = Math.min(
    99,
    Math.max(42, Math.round(job.score * 0.55 + skillRatio * 45)),
  );
  return { matchPercent, matchedSkills };
}

export function buildMatchDeck(cvSkills: readonly string[] = demoCvSkills): MatchJob[] {
  return [...jobs]
    .map((job) => {
      const { matchPercent, matchedSkills } = scoreJobAgainstCv(job, cvSkills);
      return {
        ...job,
        description:
          descriptions[job.id] ??
          `Opportunité ${job.contract} chez ${job.company} · ${job.remote}.`,
        matchPercent,
        matchedSkills,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);
}

export function formatSalary(salary: number, locale = "fr-FR") {
  if (!salary) return null;
  return `${salary.toLocaleString(locale)} € brut/an`;
}
