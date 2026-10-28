import { describe, it, expect } from "vitest";
import { usageSummary, usageChart, type Activation } from "@/lib/autopilot-usage";
import { emptyCriteria, restoreCriteria, futureMonths, selectDemoJobs } from "@/lib/autopilot-data";
describe("Durées et séries de l’Autopilote", () => {
  it("fusionne les activations qui se chevauchent sans doubler les heures", () => {
    const data = [
      { start: "2026-10-28T08:00:00Z", end: "2026-10-28T10:00:00Z" },
      { start: "2026-10-28T09:00:00Z", end: "2026-10-28T11:00:00Z" },
    ];
    expect(usageSummary(data, new Date("2026-10-28T12:00Z"), "Europe/Paris").totalHours).toBe(3);
  });
  it("borne les sessions actives au présent et ignore le futur", () => {
    const now = new Date("2026-10-28T10:00Z");
    const data: Activation[] = [
      { start: "2026-10-28T08:00Z", end: null },
      { start: "2026-10-29T08:00Z", end: null },
    ];
    expect(usageSummary(data, now, "UTC").totalHours).toBe(2);
  });
  it("préserve la série si le jour courant est encore inactif", () => {
    const data = [
      { start: "2026-10-26T08:00Z", end: "2026-10-26T09:00Z" },
      { start: "2026-10-27T08:00Z", end: "2026-10-27T09:00Z" },
    ];
    const stats = usageSummary(data, new Date("2026-10-28T12:00Z"), "Europe/Paris");
    expect(stats.current).toBe(2);
    expect(stats.best).toBe(2);
    expect(usageSummary(data, new Date("2026-10-29T12:00Z"), "Europe/Paris").current).toBe(0);
  });
  it("répartit une session entre les jours locaux y compris un fuseau à 45 minutes", () => {
    const data = [{ start: "2026-10-27T18:00Z", end: "2026-10-27T19:00Z" }];
    const stats = usageSummary(data, new Date("2026-10-28T12:00Z"), "Asia/Kathmandu");
    expect(stats.daily["2026-10-27"]).toBe(0.25);
    expect(stats.daily["2026-10-28"]).toBe(0.75);
  });
  it("compte les heures réelles pendant le changement d’heure", () => {
    const data = [{ start: "2026-10-25T00:00Z", end: "2026-10-25T03:00Z" }];
    expect(usageSummary(data, new Date("2026-10-26T00:00Z"), "Europe/Paris").totalHours).toBe(3);
  });
  it("agrège par jour, semaine et mois en gardant la même durée", () => {
    const data = [{ start: "2026-10-27T08:00Z", end: "2026-10-27T10:30Z" }];
    for (const period of ["day", "week", "month"] as const)
      expect(
        usageChart(data, period, new Date("2026-10-28T12:00Z"), "Europe/Paris").reduce(
          (sum, r) => sum + r.hours,
          0,
        ),
      ).toBe(2.5);
  });
});
describe("Critères persistants et multisélection", () => {
  it("combine OU dans une catégorie et ET entre les catégories", () => {
    const results = selectDemoJobs({
      ...emptyCriteria,
      contracts: ["CDI", "Stage"],
      remote: ["full"],
      functions: ["tech"],
    });
    expect(results.map((j) => j.id)).toEqual(["2"]);
  });
  it("valide les valeurs restaurées et rejette les dates impossibles", () => {
    const value = restoreCriteria({
      contracts: ["CDI", "INCONNU", 42],
      start: ["2027-13", "2027-03"],
      languages: ["fr", "xxx"],
    });
    expect(value.contracts).toEqual(["CDI"]);
    expect(value.start).toEqual(["2027-03"]);
    expect(value.languages).toEqual(["fr"]);
  });
  it("génère les prochains mois au passage d’année", () => {
    expect(futureMonths(new Date(2026, 11, 31), 3).map((m) => m.value)).toEqual([
      "2026-12",
      "2027-01",
      "2027-02",
    ]);
  });
  it("filtre par département et renvoie un état vide sans données inventées", () => {
    expect(
      selectDemoJobs({ ...emptyCriteria, city: "69", contracts: ["CDI"] }).map((j) => j.id),
    ).toEqual(["2"]);
    expect(selectDemoJobs({ ...emptyCriteria, contracts: ["Graduate Program"] })).toEqual([]);
  });
});
