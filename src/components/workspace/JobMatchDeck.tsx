import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, RotateCcw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { usePreferences } from "@/components/preferences/usePreferences";
import { useWorkspace } from "@/components/workspace/useWorkspace";
import {
  buildMatchDeck,
  formatSalary,
  type MatchJob,
} from "@/lib/matching-data";
import type { Application } from "@/lib/workspace-data";

const SWIPE_THRESHOLD = 110;

type ExitDir = "left" | "right" | null;

export function JobMatchDeck() {
  const { t, language } = usePreferences();
  const { addApplication, reviewJob, resume } = useWorkspace();
  const deck = useMemo(() => buildMatchDeck(), []);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<ExitDir>(null);
  const [matchFlash, setMatchFlash] = useState<MatchJob | null>(null);
  const [liked, setLiked] = useState(0);
  const [passed, setPassed] = useState(0);
  const pointerId = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const current = deck[index] ?? null;
  const remaining = Math.max(0, deck.length - index);
  const locale = language === "fr" ? "fr-FR" : "en-GB";

  const commit = useCallback(
    (dir: "left" | "right", job: MatchJob) => {
      setExit(dir);
      window.setTimeout(() => {
        reviewJob(job.id);
        if (dir === "right") {
          const application: Application = {
            id: `match-${job.id}-${Date.now()}`,
            jobId: job.id,
            title: job.title,
            company: job.company,
            sector: job.sector,
            sentAt: new Date().toISOString(),
            stage: "Envoyée",
            email: false,
            responseAt: null,
            sourceUrl: "",
            notes: t(
              "Candidature simplifiée depuis Matching (démo locale).",
              "Simplified application from Matching (local demo).",
            ),
            cvName: resume?.file.name ?? "CV-demo.txt",
            letterName: "Lettre-auto.txt",
          };
          addApplication(application);
          setLiked((n) => n + 1);
          setMatchFlash(job);
          toast.success(t("Candidature lancée", "Application started"), {
            description: t(
              `${job.title} chez ${job.company} · intention auto-apply enregistrée.`,
              `${job.title} at ${job.company} · auto-apply intent saved.`,
            ),
          });
          window.setTimeout(() => setMatchFlash(null), 900);
        } else {
          setPassed((n) => n + 1);
        }
        setIndex((i) => i + 1);
        setDrag({ x: 0, y: 0 });
        setExit(null);
      }, 280);
    },
    [addApplication, reviewJob, resume, t],
  );

  const decide = useCallback(
    (dir: "left" | "right") => {
      if (!current || exit) return;
      commit(dir, current);
    },
    [commit, current, exit],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        decide("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        decide("left");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (exit || !current) return;
    pointerId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || pointerId.current !== e.pointerId) return;
    setDrag({
      x: e.clientX - start.current.x,
      y: (e.clientY - start.current.y) * 0.35,
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    setDragging(false);
    if (drag.x > SWIPE_THRESHOLD) decide("right");
    else if (drag.x < -SWIPE_THRESHOLD) decide("left");
    else setDrag({ x: 0, y: 0 });
  };

  const reset = () => {
    setIndex(0);
    setLiked(0);
    setPassed(0);
    setDrag({ x: 0, y: 0 });
    setExit(null);
    setMatchFlash(null);
  };

  const rotation = drag.x / 28;
  const likeOpacity = Math.min(1, Math.max(0, drag.x / SWIPE_THRESHOLD));
  const passOpacity = Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD));
  const flyX =
    exit === "right" ? 520 : exit === "left" ? -520 : drag.x;
  const flyY = exit ? drag.y - 40 : drag.y;
  const flyRot = exit === "right" ? 18 : exit === "left" ? -18 : rotation;

  if (!current) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-[2rem] border border-white/50 bg-card/70 p-8 text-center shadow-elegant backdrop-blur-xl dark:border-border">
        <Sparkles className="text-accent" size={36} />
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {t("Pile terminée", "Deck finished")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              `Tu as liké ${liked} offre${liked > 1 ? "s" : ""} et passé ${passed}. Relance le deck ou ouvre le suivi.`,
              `You liked ${liked} and passed on ${passed}. Restart the deck or open tracking.`,
            )}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            <RotateCcw size={16} />
            {t("Relancer le matching", "Restart matching")}
          </button>
          <Link
            to="/app/applications"
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm font-bold transition hover:bg-secondary"
          >
            {t("Voir le suivi", "Open tracking")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          {t(`${remaining} offre${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`, `${remaining} left`)}
        </span>
        <span>
          {t("♥", "♥")} {liked} · {t("passés", "passed")} {passed}
        </span>
      </div>

      <div className="relative h-[520px] touch-none select-none sm:h-[560px]">
        {deck.slice(index + 1, index + 3).map((job, i) => (
          <div
            key={job.id}
            aria-hidden
            className="absolute inset-0 rounded-[2rem] border border-white/40 bg-card/80 shadow-soft backdrop-blur-md dark:border-border"
            style={{
              transform: `scale(${0.94 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
              zIndex: 1 - i,
            }}
          />
        ))}

        <article
          role="group"
          aria-roledescription="swipeable job card"
          aria-label={`${current.title} · ${current.company}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 z-10 flex cursor-grab flex-col overflow-hidden rounded-[2rem] border border-white/50 bg-card/90 shadow-elegant backdrop-blur-xl active:cursor-grabbing dark:border-border"
          style={{
            transform: `translate(${flyX}px, ${flyY}px) rotate(${flyRot}deg)`,
            transition: dragging && !exit ? "none" : "transform 280ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <div
            className="pointer-events-none absolute left-5 top-5 z-20 rounded-xl border-2 border-accent bg-accent/15 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-accent"
            style={{ opacity: likeOpacity }}
          >
            {t("Like", "Like")}
          </div>
          <div
            className="pointer-events-none absolute right-5 top-5 z-20 rounded-xl border-2 border-destructive bg-destructive/10 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-destructive"
            style={{ opacity: passOpacity }}
          >
            {t("Pass", "Pass")}
          </div>

          <div className="relative h-36 shrink-0 bg-ink-gradient px-6 py-5 text-ink-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0db89a55,transparent_45%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                <Sparkles size={12} />
                {current.matchPercent}% {t("match CV", "CV match")}
              </span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">{current.title}</h2>
                <p className="mt-1 text-sm text-ink-muted">{current.company}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border bg-background/60 px-2.5 py-1">
                <MapPin size={12} />
                {current.city} · {current.remote}
              </span>
              <span className="rounded-full border bg-background/60 px-2.5 py-1">
                {current.contract}
              </span>
              {formatSalary(current.salary, locale) && (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent-foreground">
                  {formatSalary(current.salary, locale)}
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{current.description}</p>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
                {t("Compétences", "Skills")}
              </p>
              <div className="flex flex-wrap gap-2">
                {current.skills.map((skill) => {
                  const hit = current.matchedSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        hit
                          ? "bg-accent/15 text-foreground ring-1 ring-accent/40"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="mt-auto text-[11px] text-muted-foreground md:hidden">
              {t("Swipe droite = like · gauche = passer", "Swipe right = like · left = pass")}
            </p>
            <p className="mt-auto hidden text-[11px] text-muted-foreground md:block">
              {t(
                "Flèches ← → ou boutons ci-dessous. Like = candidature simplifiée (démo).",
                "Arrow keys ← → or buttons below. Like = simplified apply (demo).",
              )}
            </p>
          </div>
        </article>

        {matchFlash && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center rounded-[2rem] bg-accent/20 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="rounded-2xl border border-accent/40 bg-card/95 px-6 py-4 text-center shadow-elegant">
              <p className="text-3xl">♥</p>
              <p className="mt-1 text-sm font-bold">
                {t("Match ! Candidature lancée", "Match! Application started")}
              </p>
              <p className="text-xs text-muted-foreground">{matchFlash.company}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => decide("left")}
          aria-label={t("Passer", "Pass")}
          className="grid h-16 w-16 place-items-center rounded-full border bg-card text-destructive shadow-soft transition hover:scale-105 hover:bg-destructive/10"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => decide("right")}
          aria-label={t("Liker et candidater", "Like and apply")}
          className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-accent text-accent-foreground shadow-elegant transition hover:scale-105"
        >
          <Heart size={30} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
