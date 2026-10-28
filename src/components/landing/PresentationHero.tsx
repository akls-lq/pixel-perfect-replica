import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Mail,
  MapPin,
  CalendarDays,
  ChartNoAxesCombined,
  KeyRound,
  Bot,
  Search,
  Send,
  CheckCheck,
  GraduationCap,
  Globe2,
  Sparkles,
  FolderOpen,
  Pause,
  Play,
} from "lucide-react";
import { Mascot } from "@/components/workspace/Mascot";
import { usePreferences } from "@/components/preferences/usePreferences";
import styles from "./PresentationHero.module.css";

const icons = [
  BriefcaseBusiness,
  FileText,
  Mail,
  MapPin,
  CalendarDays,
  ChartNoAxesCombined,
  KeyRound,
  Bot,
  Search,
  Send,
  CheckCheck,
  GraduationCap,
  Globe2,
  Sparkles,
  FolderOpen,
];

export function PresentationHero() {
  const { t } = usePreferences();
  const [paused, setPaused] = useState(false);
  return (
    <section className={styles["hero"]} aria-labelledby="presentation-heading">
      <div className={styles["art"]} data-paused={paused}>
        <div className={styles["grid"]} aria-hidden="true">
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className={styles["track"]}>
              {[0, 1].map((copy) => (
                <div key={copy} className={styles["sequence"]}>
                  {icons.map((_, column) => {
                    const Icon = icons[(column + row * 4) % icons.length]!;
                    return (
                      <span key={column} className={styles["tile"]}>
                        <Icon size={23} strokeWidth={1.5} />
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles["logo"]}>
          <Mascot size={96} />
        </div>
        <button
          type="button"
          className={styles["pause"]}
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused
              ? t("Reprendre l’animation d’accueil", "Resume welcome animation")
              : t("Mettre l’animation d’accueil en pause", "Pause welcome animation")
          }
          aria-pressed={paused}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <div className={styles["copy"]}>
        <h1 id="presentation-heading" className={styles["title"]}>
          {t("Le copilote de ta", "Your copilot for")}
          <br />
          {t("recherche d’emploi.", "your next career move.")}
        </h1>
        <p className={styles["description"]}>
          {t(
            "Explore les offres, prépare tes documents et suis tes candidatures.",
            "Explore jobs, prepare your documents and track your applications.",
          )}
          <br className="hidden sm:block" />{" "}
          {t(
            "Tout ton prochain chapitre, dans un seul espace.",
            "Your next chapter, all in one workspace.",
          )}
        </p>
        <Link to="/app/dashboard" className="btn-primary mt-7">
          {t("Ouvrir le dashboard", "Open dashboard")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
