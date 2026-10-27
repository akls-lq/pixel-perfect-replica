import { Briefcase, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { contracts } from "@/components/site/demo-data";

export type SearchState = { q: string; city: string; contract: string };

export function HeroSearch({ onSearch }: { onSearch: (s: SearchState) => void }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [contract, setContract] = useState("Tous");
  const field = "flex min-w-0 items-center gap-2 px-3 py-3";
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch({ q, city, contract });
        document.getElementById("offres")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="grid gap-1 rounded-xl border bg-card p-1.5 shadow-elegant md:grid-cols-[1.4fr_1fr_0.8fr_auto] md:divide-x"
    >
      <label className={field}>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Métier ou mot-clé</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Métier, compétence…"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </label>
      <label className={field}>
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Localisation</span>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </label>
      <label className={field}>
        <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="sr-only">Type de contrat</span>
        <select
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="w-full min-w-0 bg-transparent text-base outline-none md:text-sm"
        >
          {contracts.map((c) => (
            <option key={c} value={c}>
              {c === "Tous" ? "Tous contrats" : c}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Rechercher
      </button>
    </form>
  );
}
