import { lazy, Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { projects, type Project } from "../../../content";
import { useScreen } from "../../Screen";
import type { DeviceKind } from "../../three/DeviceStage";
import { useOS } from "../../store";
import { Button, LinkButton, StatusBar } from "../../ui";
import s from "./LightTable.module.css";

// three.js only loads once the light table is open.
const DeviceStage = lazy(() => import("../../three/DeviceStage"));

const frameNo = (i: number) => String(i + 1).padStart(2, "0");

/** Size tier for the outlined display title, so "Yorigo" and "Sequestration Model…" both fit the sheet. */
const titleLength = (name: string) => (name.length <= 8 ? "s" : name.length <= 12 ? "m" : name.length <= 20 ? "l" : "xl");

/** "https://www.loom.com/share/…" → "loom.com" — enough to tell a live site from a demo video. */
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Projects as a light table: a strip of frames along the bottom, the selected project shown on a
 * spinning 3D device (phone or laptop) in a white studio, and a typeset spec sheet beside it. The pick
 * is circled in blue pencil, the way you'd mark selects on a contact sheet.
 */
export function LightTable() {
  const open = useOS((st) => st.open);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);

  // Frame numbers stay tied to the full roll, so filtering never renumbers a project.
  const roll = useMemo(() => projects.map((p, i) => ({ project: p, frame: frameNo(i) })), []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roll;
    return roll.filter(({ project }) => [project.name, ...project.stack].some((t) => t.toLowerCase().includes(q)));
  }, [roll, query]);

  const current = visible.find((f) => f.project.id === selectedId) ?? visible[0];
  const index = current ? visible.indexOf(current) : -1;

  const step = (delta: number) => {
    if (!visible.length) return;
    const next = visible[(index + delta + visible.length) % visible.length];
    setSelectedId(next.project.id);
  };

  // Keep the selected frame in view without scrollIntoView (which would also nudge the scaled screen).
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-id="${current?.project.id}"]`);
    if (!strip || !el) return;
    const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [current?.project.id]);

  const onStripKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const edge = e.key === "Home" ? visible[0] : visible[visible.length - 1];
      if (edge) setSelectedId(edge.project.id);
    } else if (e.key === "Enter" && current) {
      open("detail", current.project.id);
    }
  };

  return (
    <div className={s.root}>
      <div className={s.toolbar}>
        <Button compact aria-label="Previous frame" onClick={() => step(-1)} disabled={visible.length < 2}>
          ◀
        </Button>
        <Button compact aria-label="Next frame" onClick={() => step(1)} disabled={visible.length < 2}>
          ▶
        </Button>
        <span className={s.counter} aria-live="polite">
          {current ? `Frame ${current.frame} of ${frameNo(projects.length - 1)}` : "No frames"}
        </span>
        <label className={s.filter}>
          <span>Filter:</span>
          <input
            type="search"
            value={query}
            placeholder="name or stack — e.g. Swift"
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </label>
        {query && (
          <Button compact onClick={() => setQuery("")}>
            Clear
          </Button>
        )}
      </div>

      <div className={s.stage}>
        {current ? <Viewer project={current.project} /> : <div className={s.empty}>No frames match “{query}”.</div>}
        {current && <SpecSheet project={current.project} onOpen={() => open("detail", current.project.id)} />}
      </div>

      <div
        ref={stripRef}
        className={s.strip}
        role="listbox"
        aria-label="Projects film strip"
        aria-orientation="horizontal"
        aria-activedescendant={current ? `frame-${current.project.id}` : undefined}
        tabIndex={0}
        onKeyDown={onStripKey}
      >
        {visible.map(({ project, frame }) => {
          const selected = project.id === current?.project.id;
          return (
            <div
              key={project.id}
              id={`frame-${project.id}`}
              data-id={project.id}
              role="option"
              aria-selected={selected}
              aria-label={`${frame}: ${project.name}`}
              className={s.frame}
              onClick={() => setSelectedId(project.id)}
              onDoubleClick={() => open("detail", project.id)}
            >
              <img src={project.thumb} alt="" loading="lazy" decoding="async" draggable={false} />
              <span className={s.frameNo}>{frame}</span>
              {selected && <PencilMark />}
            </div>
          );
        })}
      </div>

      <StatusBar
        fields={[
          `${visible.length} of ${projects.length} frames`,
          current ? `${current.project.name} — double-click or press Enter for details` : "Clear the filter to see every frame",
        ]}
      />
    </div>
  );
}

function Viewer({ project }: { project: Project }) {
  const { scale } = useScreen();
  // Mobile apps spin on a 3D phone (portrait screenshot); everything else on a 3D laptop.
  const device: DeviceKind = project.screen ? "phone" : "laptop";
  const screen = project.screen ?? project.display;
  return (
    <figure className={s.viewer}>
      {/* Keyed by device: switching projects on the same device just swaps the screen texture. */}
      <Suspense fallback={null}>
        <DeviceStage key={device} device={device} screen={screen} scale={scale} alt={project.name} />
      </Suspense>
    </figure>
  );
}

function SpecSheet({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article className={s.sheet} aria-labelledby={`sheet-${project.id}`}>
      <div className={s.sheetHead}>
        <h3 id={`sheet-${project.id}`} className={s.title} data-length={titleLength(project.name)}>
          {project.name}
        </h3>
      </div>

      <dl className={s.meta}>
        {project.role && (
          <>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </>
        )}
        {project.stack.length > 0 && (
          <>
            <dt>Stack</dt>
            <dd>
              <ul className={s.chips}>
                {project.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </>
        )}
        {project.link && (
          <>
            <dt>Link</dt>
            <dd>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {hostOf(project.link)}
              </a>
            </dd>
          </>
        )}
      </dl>

      <div className={s.copy}>
        <p>{project.description}</p>
      </div>

      <div className={s.actions}>
        {project.link && <LinkButton href={project.link}>Visit ↗</LinkButton>}
        <Button onClick={onOpen}>Details…</Button>
      </div>
    </article>
  );
}

/** Hand-drawn select mark: a wobbly blue rectangle that overshoots its start, like a real pencil. */
function PencilMark() {
  return (
    <svg className={s.pencil} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M6 9 C 30 4, 68 6, 95 7 C 97 34, 96 66, 94 93 C 66 96, 34 95, 5 94 C 3 66, 4 36, 7 4 L 16 6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
