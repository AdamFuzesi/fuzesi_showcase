import { useEffect, useRef } from "react";
import { skills } from "../../../content";
import s from "./Skills.module.css";

/** Seconds for one logo to travel the whole diagonal; with 13 skills one enters every ~2s. */
const TRAVEL_SECONDS = 26;
/** Logo size (px) at scale 1 — keep in sync with .logo in Skills.module.css. */
const LOGO = 124;
/**
 * Path endpoints as fractions of the stage: far (top-right) → near (bottom-left). Both ends sit well
 * past the stage edges, so logos enter and leave off-canvas (never tiny in a corner) and the long
 * path spaces them out enough that each one reads on its own.
 */
const FAR = { x: 1.22, y: -0.28, scale: 0.55 };
const NEAR = { x: -0.28, y: 1.42, scale: 1.35 };
/** >1 bunches distant logos together and spreads near ones out — a gentle perspective foreshortening. */
const PERSPECTIVE = 1.3;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Skills as a continuous stream of logos receding along a diagonal. Distance is sold by perspective
 * spacing, scale and a shadow that grows as each logo nears — every logo stays sharp. Hovering pops a logo
 * forward with its name — the stream never stops. Everything is written straight to the DOM per frame.
 */
export function Skills() {
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = skills.length;
    let size = { w: stage.clientWidth, h: stage.clientHeight };
    let progress = 0.5 / n; // start with every logo off the fade edges
    let last = performance.now();
    let hovered = -1;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!reduceMotion) progress = (progress + dt / TRAVEL_SECONDS) % 1;

      const pointer = pointerRef.current;
      let hit = -1;
      let hitDepth = -1;

      slotRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = (i / n + progress) % 1; // uniform in time…
        const d = Math.pow(t, PERSPECTIVE); // …foreshortened in space
        const x = (FAR.x + (NEAR.x - FAR.x) * d) * size.w;
        const y = (FAR.y + (NEAR.y - FAR.y) * d) * size.h;
        const scale = FAR.scale + (NEAR.scale - FAR.scale) * d;
        const opacity = smoothstep(0, 0.12, t) * (1 - smoothstep(0.94, 1, t));

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(d * 1000));
        el.style.setProperty("--depth", d.toFixed(3));
        el.style.setProperty("--inv", (1 / scale).toFixed(4)); // keeps the label a constant size

        // Hit-test against where the logo is *now*, so hover follows it down the line.
        if (pointer && opacity > 0.5) {
          const r = (LOGO * scale) / 2 + 4;
          if (Math.hypot(pointer.x - x, pointer.y - y) < r && d > hitDepth) {
            hit = i;
            hitDepth = d;
          }
        }
      });

      if (hit !== hovered) {
        if (hovered >= 0) delete slotRefs.current[hovered]?.dataset.hover;
        if (hit >= 0) slotRefs.current[hit]!.dataset.hover = "true";
        stage.dataset.pointing = String(hit >= 0);
        hovered = hit;
      }
      if (hovered >= 0) slotRefs.current[hovered]!.style.zIndex = "5000";

      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      size = { w: stage.clientWidth, h: stage.clientHeight };
    });
    ro.observe(stage);
    frame(last); // paint the first frame synchronously so logos never flash in
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Pointer in stage-local px (the OS screen is CSS-scaled, so divide the scale back out).
  const trackPointer = (e: React.PointerEvent) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const k = stage.clientWidth / rect.width;
    pointerRef.current = { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
  };

  return (
    <section
      ref={stageRef}
      className={s.stage}
      aria-labelledby="skills-title"
      onPointerMove={trackPointer}
      onPointerLeave={() => (pointerRef.current = null)}
    >
      <h3 id="skills-title" className={`${s.title} ${s.display}`}>
        Skills
      </h3>

      {/* The stream is decorative; the list below is what assistive tech reads. */}
      <div className={s.stream} aria-hidden="true">
        {skills.map((skill, i) => (
          <div key={skill.name} ref={(el) => (slotRefs.current[i] = el)} className={s.slot}>
            <img className={s.logo} src={skill.logo} alt="" decoding="async" draggable={false} />
            <div className={s.labelAnchor}>
              <span className={s.label}>{skill.name}</span>
            </div>
          </div>
        ))}
      </div>

      <ul className={s.srOnly}>
        {skills.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>
    </section>
  );
}
