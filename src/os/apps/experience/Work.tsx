import { lazy, Suspense, useRef, useState, type KeyboardEvent } from "react";
import { jobs, type Job } from "../../../content";
import { useScreen } from "../../Screen";
import s from "./Work.module.css";

// three.js only loads once the Work tab is open.
const ModelStage = lazy(() => import("../../three/ModelStage"));

/** "05/2024 - 09/2024" → "2024"; "05/2025 - 01/2026" → "2025–26"; "03/2026 - Present" → "2026–Now". */
const yearsOf = (dates: string) => {
  const [from, to] = dates.replace(/\d{1,2}\//g, "").split(/\s*-\s*/);
  if (!to || to === from) return from;
  return `${from}–${/present/i.test(to) ? "Now" : to.slice(2)}`;
};

/**
 * Work history in three fixed zones that never change size:
 *   a timeline rail of every role across the top (click, or ← / →),
 *   the selected role's mark spinning on a white studio sweep, and
 *   its write-up as plain text, with the title block reserving the same height for every role so
 *   the description always starts in the same place. Changing role cross-fades; nothing reflows.
 */
export function Work() {
  const [selected, setSelected] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const job = jobs[selected];

  const select = (i: number, focus = false) => {
    const next = (i + jobs.length) % jobs.length;
    setSelected(next);
    if (focus) railRef.current?.querySelectorAll<HTMLElement>("[role=tab]")[next]?.focus();
  };

  const onRailKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: selected + 1, ArrowLeft: selected - 1, Home: 0, End: jobs.length - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key], true);
  };

  return (
    <div className={s.root}>
      <div ref={railRef} className={s.rail} role="tablist" aria-label="Roles" onKeyDown={onRailKey}>
        {jobs.map((j, i) => (
          <button
            key={j.id}
            role="tab"
            id={`role-tab-${j.id}`}
            aria-selected={i === selected}
            aria-controls="role-panel"
            tabIndex={i === selected ? 0 : -1}
            className={s.stop}
            onClick={() => select(i)}
          >
            <span className={s.marker} aria-hidden="true" />
            <span className={s.stopCompany}>{j.company}</span>
            <span className={s.stopYears}>{yearsOf(j.dates)}</span>
          </button>
        ))}
      </div>

      <div className={s.stage}>
        <Showcase job={job} />
        <article id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${job.id}`} className={s.detail}>
          {/* Keyed so each role fades in fresh; the panel itself never resizes. */}
          <div key={job.id} className={s.fade}>
            <header className={s.head}>
              <p className={s.kicker}>
                {job.dates}
                {job.duration && <span> · {job.duration}</span>}
              </p>
              <div className={s.titleBox}>
                <h3 className={s.title}>{job.title}</h3>
              </div>
              <p className={s.company}>{[job.company, job.badge].filter(Boolean).join("  ·  ")}</p>
              <p className={s.context}>{[job.kind, job.project, job.location].filter(Boolean).join("  ·  ") || " "}</p>
            </header>
            <div className={s.body}>
              {job.description.length ? (
                job.description.map((para) => <p key={para}>{para}</p>)
              ) : (
                <p className={s.pending}>Write-up coming soon.</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function Showcase({ job }: { job: Job }) {
  const { scale } = useScreen();
  return (
    <figure className={s.showcase} aria-label={job.company}>
      {/* Mounted for every role so switching never tears down WebGL; roles without a mark pass nothing. */}
      <Suspense fallback={null}>
        <ModelStage src={job.model} scale={scale} alt={`${job.company} logo`} />
      </Suspense>
      {!job.model && <Monogram key={job.id} company={job.company} />}
      <figcaption className={s.caption}>{job.company}</figcaption>
    </figure>
  );
}

/** Outlined initial with a soft, offset solid copy behind it — for roles without a 3D mark. */
function Monogram({ company }: { company: string }) {
  const letter = company.trim().charAt(0).toUpperCase();
  return (
    <div className={s.monogram} aria-hidden="true">
      <span className={s.monoShadow}>{letter}</span>
      <span className={s.monoInk}>{letter}</span>
    </div>
  );
}
