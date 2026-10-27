import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OffersSection } from "@/components/landing/OffersSection";
import { AutopilotDemo } from "@/components/landing/FeatureDemos";
import { MissionProgress } from "@/components/app/Progress";

afterEach(cleanup);
describe("Parcours de démonstration", () => {
  it("combine métier, localisation et contrat sans distinguer accents ou casse", () => {
    const { rerender } = render(
      <OffersSection
        search={{ q: "developpeur", city: "LYON", contract: "CDI" }}
        onReset={() => {}}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Développeur·se Front-end React" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Orbe Logistique (fictif)")).not.toBeInTheDocument();
    rerender(
      <OffersSection
        search={{ q: "developpeur", city: "LYON", contract: "CDD" }}
        onReset={() => {}}
      />,
    );
    expect(screen.getByText("Aucune offre démo ne correspond.")).toBeInTheDocument();
  });
  it("approuve uniquement dans la file fictive sans déclarer un envoi", () => {
    render(<AutopilotDemo />);
    fireEvent.click(screen.getAllByRole("button", { name: "Approuver" })[0]!);
    expect(screen.getByText("Approuvée")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Approuver" })).toHaveLength(2);
    expect(screen.getByText(/approuver ne déclenche aucun envoi/)).toBeInTheDocument();
  });
  it("ne récompense ni les missions absentes ni les identifiants dupliqués", () => {
    const { rerender } = render(<MissionProgress done={[]} />);
    expect(screen.getByText("0 / 70 XP")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    rerender(<MissionProgress done={["profile", "profile", "save", "review"]} />);
    expect(screen.getByText("70 / 70 XP")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Recherche organisée");
  });
});
