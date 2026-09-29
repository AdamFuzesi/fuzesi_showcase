import { useRef, useState, type KeyboardEvent } from "react";
import type { AppId } from "../apps/manifest";
import { PixelIcon } from "../icons/PixelIcon";
import type { IconName } from "../icons/sprites";
import { useOS } from "../store";
import { getWallpaper } from "../wallpapers";
import s from "./Desktop.module.css";

interface Shortcut {
  app: AppId;
  label: string;
  icon: IconName;
}

export const SHORTCUTS: Shortcut[] = [
  { app: "about", label: "About Me", icon: "computer" },
  { app: "experience", label: "Experience & Background", icon: "briefcase" },
  { app: "projects", label: "Projects", icon: "folder" },
  { app: "contact", label: "Contact", icon: "mail" },
];

const CELL_H = 78;

export function Desktop() {
  const wallpaper = useOS((st) => st.wallpaper);
  const open = useOS((st) => st.open);
  const [selected, setSelected] = useState<AppId | null>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onIconKey = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = SHORTCUTS[Math.min(Math.max(index + (e.key === "ArrowDown" ? 1 : -1), 0), SHORTCUTS.length - 1)];
      setSelected(next.app);
      iconRefs.current[next.app]?.focus();
    } else if (e.key === "Enter") {
      open(SHORTCUTS[index].app);
    }
  };

  const { Component: WallpaperView, tone } = getWallpaper(wallpaper);

  return (
    <div className={s.desktop} data-tone={tone} onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
      <div className={s.wallpaper} aria-hidden="true">
        <WallpaperView />
      </div>

      <div
        className={s.icons}
        role="listbox"
        aria-label="Desktop"
        aria-orientation="vertical"
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        {SHORTCUTS.map((sc, i) => (
          <button
            key={sc.app}
            ref={(el) => (iconRefs.current[sc.app] = el)}
            role="option"
            aria-selected={selected === sc.app}
            className={s.icon}
            style={{ left: 8, top: 8 + i * CELL_H }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelected(sc.app);
            }}
            onDoubleClick={() => open(sc.app)}
            onKeyDown={(e) => onIconKey(e, i)}
            onFocus={() => setSelected(sc.app)}
          >
            <span className={s.glyph}>
              <PixelIcon name={sc.icon} size={32} />
            </span>
            <span className={s.label}>{sc.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
