import { describe, it, expect } from "vitest";
import {
  demoDate,
  buildTimeline,
  emptyFilters,
  filterJobs,
  inPeriod,
  initialApplications,
  jobs,
  safeUrl,
  statistics,
  type Application,
} from "@/lib/workspace-data";
describe("Filtres avancés des offres", () => {
  it("combine ville sans accent, contrat, salaire et télétravail", () => {
    expect(
      filterJobs(jobs, {
        ...emptyFilters,
        city: "lyon",
        contract: "CDI",
        salary: "45000",
        remote: "Télétravail",
      }).map((j) => j.id),
    ).toEqual(["2"]);
  });
  it("distingue prise de poste, durée du contrat et expérience débutant", () => {
    expect(
      filterJobs(jobs, {
        ...emptyFilters,
        startMonth: "2027-01",
        duration: "12",
        experience: "0",
      }).map((j) => j.id),
    ).toEqual(["4"]);
    expect(
      filterJobs(jobs, { ...emptyFilters, duration: "0" }).every((j) => j.contract === "CDI"),
    ).toBe(true);
  });
  it("combine compétences requises et entreprises exclues", () => {
    expect(
      filterJobs(jobs, { ...emptyFilters, skills: "react, typescript" }).map((j) => j.id),
    ).toEqual(["2"]);
    expect(filterJobs(jobs, { ...emptyFilters, skills: "react", exclude: "nova" })).toHaveLength(0);
  });
  it("applique les critères de date, accessibilité et compatibilité", () => {
    const list = filterJobs(jobs, {
      ...emptyFilters,
      published: "3",
      accessible: true,
      minScore: "90",
    });
    expect(list.map((j) => j.id)).toEqual(["1"]);
  });
  it("n’invente aucune opportunité pour une combinaison vide", () => {
    expect(filterJobs(jobs, { ...emptyFilters, contract: "Stage", sector: "Finance" })).toEqual([]);
  });
});
describe("Indicateurs et périodes du suivi", () => {
  it("inclut les bornes et exclut les dates futures", () => {
    expect(inPeriod(demoDate.toISOString(), "24h")).toBe(true);
    expect(inPeriod(new Date(demoDate.getTime() - 86400000).toISOString(), "24h")).toBe(true);
    expect(inPeriod(new Date(demoDate.getTime() - 86400001).toISOString(), "24h")).toBe(false);
    expect(inPeriod(new Date(demoDate.getTime() + 1).toISOString(), "365d")).toBe(false);
  });
  it("calcule les réponses et les secteurs depuis les mêmes candidatures que le suivi", () => {
    const stats = statistics(initialApplications, "30d");
    expect(stats.total).toBe(stats.selected.length);
    expect(stats.replies).toBe(stats.selected.filter((a) => a.responseAt !== null).length);
    expect(stats.sectors).toBe(new Set(stats.selected.map((a) => a.sector)).size);
    expect(stats.replyRate).toBe(Math.round((stats.replies / stats.total) * 100));
  });
  it("recalcule les chiffres après changement de statut", () => {
    const base: Application = { ...initialApplications[0]!, stage: "Envoyée", responseAt: null };
    const before = statistics([base], "24h");
    const after = statistics(
      [{ ...base, stage: "Entretien", responseAt: demoDate.toISOString() }],
      "24h",
    );
    expect(before.replyRate).toBe(0);
    expect(after.replyRate).toBe(100);
    expect(after.interviews).toBe(1);
  });
  it("gère une période vide sans pourcentage invalide", () => {
    const stats = statistics([], "365d");
    expect(stats.total).toBe(0);
    expect(stats.replyRate).toBe(0);
    expect(stats.sectors).toBe(0);
  });
  it("réduit les dossiers quand la période se resserre", () => {
    expect(statistics(initialApplications, "24h").total).toBeLessThan(
      statistics(initialApplications, "7d").total,
    );
    expect(statistics(initialApplications, "30d").total).toBeLessThan(
      statistics(initialApplications, "365d").total,
    );
  });
});
describe("Liens des annonces", () => {
  it("accepte les sources web et rejette les protocoles exécutables", () => {
    expect(safeUrl("https://example.com/jobs/123")).toBe(true);
    expect(safeUrl("javascript:alert(1)")).toBe(false);
    expect(safeUrl("data:text/html,test")).toBe(false);
    expect(safeUrl("une-url-invalide")).toBe(false);
  });
});

describe("Cohérence des graphiques", () => {
  it("compte chaque candidature et chaque réponse une seule fois sur toutes les périodes", () => {
    for (const period of ["24h", "7d", "30d", "365d"] as const) {
      const data = buildTimeline(initialApplications, period);
      const stats = statistics(initialApplications, period);
      expect(data.reduce((sum, row) => sum + row.Candidatures, 0)).toBe(stats.total);
      expect(data.reduce((sum, row) => sum + row.Réponses, 0)).toBe(stats.replies);
    }
  });
  it("ne double pas une candidature placée exactement à la frontière de deux tranches", () => {
    const record = {
      ...initialApplications[0]!,
      sentAt: new Date(demoDate.getTime() - 2 * 3600000).toISOString(),
    };
    expect(buildTimeline([record], "24h").reduce((sum, row) => sum + row.Candidatures, 0)).toBe(1);
  });
});
