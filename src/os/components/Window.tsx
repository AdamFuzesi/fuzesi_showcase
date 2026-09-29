import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { PixelIcon } from "../icons/PixelIcon";
import type { IconName } from "../icons/sprites";
import { useScreen } from "../Screen";
import { MIN_H, MIN_W, SCREEN_W, TASKBAR_H, SCREEN_H, useOS, type Rect, type WinState } from "../store";
import s from "./Window.module.css";

type Edge = "nw" | "ne" | "sw" | "se";

interface WindowProps {
  win: WinState;
  title: string;
  icon: IconName;
  resizable?: boolean;
  children: ReactNode;
}

export function Window({ win, title, icon, resizable = true, children }: WindowProps) {
  const { toLocal } = useScreen();
  const active = useOS((st) => st.activeId === win.id);
  const { focus, minimize, toggleMaximize, close, setRect } = useOS.getState();
  const drag = useRef<{ start: { x: number; y: number }; rect: Rect; edge?: Edge } | null>(null);
  const titleId = `win-title-${win.id}`;

  const beginDrag = (e: ReactPointerEvent, edge?: Edge) => {
    if (e.button !== 0 || win.maximized) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { start: toLocal(e.clientX, e.clientY), rect: { x: win.x, y: win.y, w: win.w, h: win.h }, edge };
  };

  const onDrag = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = toLocal(e.clientX, e.clientY);
    const dx = Math.round(p.x - d.start.x);
    const dy = Math.round(p.y - d.start.y);
    const r = d.rect;
    if (!d.edge) return setRect(win.id, { x: r.x + dx, y: r.y + dy });

    const next = { ...r };
    if (d.edge.includes("e")) next.w = r.w + dx;
    if (d.edge.includes("s")) next.h = r.h + dy;
    if (d.edge.includes("w")) {
      next.w = Math.max(MIN_W, r.w - dx);
      next.x = r.x + r.w - next.w;
    }
    if (d.edge.includes("n")) {
      next.h = Math.max(MIN_H, r.h - dy);
      next.y = r.y + r.h - next.h;
    }
    setRect(win.id, next);
  };

  const endDrag = () => {
    drag.current = null;
  };

  const frame = win.maximized
    ? { left: 0, top: 0, width: SCREEN_W, height: SCREEN_H - TASKBAR_H }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <section
      role="dialog"
      aria-labelledby={titleId}
      className={s.window}
      data-active={active}
      data-maximized={win.maximized}
      hidden={win.minimized}
      style={{ ...frame, zIndex: win.z }}
      onPointerDownCapture={() => focus(win.id)}
      onFocusCapture={() => focus(win.id)}
    >
      <header
        className={s.titleBar}
        onPointerDown={(e) => beginDrag(e)}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => resizable && toggleMaximize(win.id)}
      >
        <PixelIcon name={icon} size={16} className={s.titleIcon} />
        <h2 id={titleId} className={s.titleText}>
          {title}
        </h2>
        <div className={s.controls} onPointerDown={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
          <button className={s.control} aria-label="Minimize" onClick={() => minimize(win.id)}>
            <Glyph rows={GLYPHS.minimize} />
          </button>
          {resizable && (
            <button className={s.control} aria-label={win.maximized ? "Restore" : "Maximize"} onClick={() => toggleMaximize(win.id)}>
              <Glyph rows={win.maximized ? GLYPHS.restore : GLYPHS.maximize} />
            </button>
          )}
          <button className={`${s.control} ${s.close}`} aria-label="Close" onClick={() => close(win.id)}>
            <Glyph rows={GLYPHS.close} />
          </button>
        </div>
      </header>

      <div className={s.body}>{children}</div>

      {resizable && !win.maximized &&
        (["nw", "ne", "sw", "se"] as Edge[]).map((edge) => (
          <div
            key={edge}
            className={s.handle}
            data-edge={edge}
            onPointerDown={(e) => beginDrag(e, edge)}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        ))}
    </section>
  );
}

const GLYPHS = {
  minimize: ["......", "......", "......", "......", "......", "......", "######", "######"],
  maximize: ["#########", "#########", "#.......#", "#.......#", "#.......#", "#.......#", "#.......#", "#.......#", "#########"],
  restore: ["..######", "..######", "..#....#", "######.#", "######.#", "#....###", "#....#..", "#....#..", "######.."],
  close: ["##....##", ".##..##.", "..####..", "...##...", "..####..", ".##..##.", "##....##"],
};

/** Title-bar button glyph drawn from pixel rows ("#" = ink). */
function Glyph({ rows }: { rows: string[] }) {
  const w = rows[0].length;
  return (
    <svg width={w} height={rows.length} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null)),
      )}
    </svg>
  );
}
