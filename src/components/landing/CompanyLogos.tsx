import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { usePreferences } from "@/components/preferences/usePreferences";
import { companyLogos } from "./company-logos";
import styles from "./CompanyLogos.module.css";
export function CompanyLogos() {
  const { t } = usePreferences();
  const section = useRef<HTMLElement>(null);
  const [columns, setColumns] = useState(5);
  const [cycle, setCycle] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const layout = matchMedia("(min-width:640px)"),
      motion = matchMedia("(prefers-reduced-motion: reduce)");
    const size = () => {
      setColumns(layout.matches ? 5 : 3);
      setCycle(0);
      setTransitioning(false);
    };
    const preference = () => {
      setReduced(motion.matches);
      setTransitioning(false);
    };
    const visibility = () => {
      setTabVisible(!document.hidden);
      setTransitioning(false);
    };
    size();
    preference();
    visibility();
    layout.addEventListener("change", size);
    motion.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined" && section.current) {
      observer = new IntersectionObserver(([entry]) => {
        setInView(!!entry?.isIntersecting);
        if (!entry?.isIntersecting) setTransitioning(false);
      });
      observer.observe(section.current);
    } else setInView(true);
    return () => {
      layout.removeEventListener("change", size);
      motion.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    if (reduced || paused || hovered || !inView || !tabVisible) return;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setCycle((c) => c + 1);
      setTransitioning(true);
      settle = setTimeout(() => setTransitioning(false), 1000);
    }, 3200);
    return () => {
      clearInterval(interval);
      if (settle) clearTimeout(settle);
    };
  }, [columns, reduced, paused, hovered, inView, tabVisible]);
  const logoAt = (group: number, column: number) =>
    companyLogos[(group * columns + column) % companyLogos.length]!;
  return (
    <section
      ref={section}
      className={styles["section"]}
      aria-labelledby="company-logos-heading"
      onMouseEnter={() => {
        setHovered(true);
        setTransitioning(false);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles["inner"]}>
        <h2 id="company-logos-heading" className={styles["heading"]}>
          {t("Ton prochain chapitre pourrait commencer chez…", "Your next chapter could start at…")}
        </h2>
        <ul
          className="sr-only"
          aria-label={t("Exemples d’entreprises à explorer", "Examples of employers to explore")}
        >
          {companyLogos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>
        <div className={styles["row"]} aria-hidden="true">
          {Array.from({ length: columns }, (_, column) => {
            const current = logoAt(cycle, column),
              previous = logoAt(Math.max(0, cycle - 1), column);
            const animated = transitioning && !reduced && !paused;
            return (
              <div
                className={styles["slot"]}
                key={`${cycle}-${column}`}
                style={{ "--logo-delay": `${column * 90}ms` } as CSSProperties}
              >
                {animated && (
                  <img
                    src={previous.src}
                    alt=""
                    width={previous.width}
                    height={44}
                    className={`${styles["logo"]} ${styles["exit"]}`}
                    style={{ "--logo-width": `${previous.width}px` } as CSSProperties}
                  />
                )}
                <img
                  src={current.src}
                  alt=""
                  width={current.width}
                  height={44}
                  className={`${styles["logo"]} ${animated ? styles["enter"] : ""}`}
                  style={{ "--logo-width": `${current.width}px` } as CSSProperties}
                />
              </div>
            );
          })}
        </div>
        {!reduced && (
          <button
            type="button"
            className={styles["control"]}
            onClick={() => {
              setPaused((v) => !v);
              setTransitioning(false);
            }}
            aria-pressed={paused}
            aria-label={
              paused
                ? t("Reprendre l’animation des logos", "Resume logo animation")
                : t("Mettre l’animation des logos en pause", "Pause logo animation")
            }
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        )}
      </div>
    </section>
  );
}
