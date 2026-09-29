import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { PixelIcon } from "../icons/PixelIcon";
import type { IconName } from "../icons/sprites";
import { SCREEN_W, TASKBAR_H } from "../store";
import s from "./Menu.module.css";

export type MenuEntry =
  | { separator: true }
  | {
      separator?: false;
      label: string;
      icon?: IconName;
      disabled?: boolean;
      checked?: boolean;
      onSelect?: () => void;
      children?: MenuEntry[];
    };

interface MenuProps {
  items: MenuEntry[];
  /** "large" = 32px icons, used by the Start menu's top level. */
  size?: "small" | "large";
  /** Close the whole menu tree (after an item fires). */
  onDismiss: () => void;
  /** Called on ArrowLeft inside a submenu to hand focus back to the parent. */
  onBack?: () => void;
  autoFocus?: boolean;
  className?: string;
  banner?: ReactNode;
  label?: string;
}

export function Menu({ items, size = "small", onDismiss, onBack, autoFocus, className, banner, label }: MenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [focusSub, setFocusSub] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [nudge, setNudge] = useState({ y: 0, flip: false });
  const hoverTimer = useRef<number>();

  const buttons = () => Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>(":scope > li > button") ?? []);

  useEffect(() => {
    if (autoFocus) buttons()[0]?.focus();
  }, [autoFocus]);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Submenus stay on screen: shift up above the taskbar, flip left at the right edge.
  useLayoutEffect(() => {
    if (!onBack) return;
    const el = rootRef.current;
    const screen = el?.closest("[data-screen]");
    if (!el || !screen) return;
    const r = el.getBoundingClientRect();
    const sr = screen.getBoundingClientRect();
    const scale = sr.width / SCREEN_W;
    const overflowY = (r.bottom - (sr.bottom - TASKBAR_H * scale)) / scale;
    setNudge({ y: overflowY > 0 ? -Math.ceil(overflowY) : 0, flip: r.right > sr.right });
  }, [onBack]);

  const activate = (i: number, viaKeyboard: boolean) => {
    const item = items[i];
    if (item.separator || item.disabled) return;
    if (item.children) {
      setOpenIndex(openIndex === i && !viaKeyboard ? null : i);
      setFocusSub(viaKeyboard);
      return;
    }
    item.onSelect?.();
    onDismiss();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const all = buttons();
    const pos = all.indexOf(e.currentTarget);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (pos + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length;
      all[next]?.focus();
    } else if (e.key === "ArrowRight") {
      const item = items[i];
      if (!item.separator && item.children) {
        e.preventDefault();
        activate(i, true);
      }
    } else if (e.key === "ArrowLeft" && onBack) {
      e.preventDefault();
      onBack();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${s.menu} ${className ?? ""}`}
      data-size={size}
      data-flip={nudge.flip}
      style={nudge.y ? { transform: `translateY(${nudge.y}px)` } : undefined}
    >
      {banner}
      <ul ref={listRef} role="menu" aria-label={label} className={s.list}>
        {items.map((item, i) =>
          item.separator ? (
            <li key={`sep-${i}`} role="separator" className={s.separator} />
          ) : (
            <li key={item.label} role="none" className={s.item}>
              <button
                role="menuitem"
                aria-haspopup={item.children ? "menu" : undefined}
                aria-expanded={item.children ? openIndex === i : undefined}
                aria-disabled={item.disabled}
                className={s.entry}
                data-open={openIndex === i}
                onClick={() => activate(i, false)}
                onKeyDown={(e) => onKeyDown(e, i)}
                onPointerEnter={() => {
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => {
                    setOpenIndex(item.children ? i : null);
                    setFocusSub(false);
                  }, 120);
                }}
              >
                <span className={s.iconSlot}>
                  {item.icon ? <PixelIcon name={item.icon} size={size === "large" ? 32 : 16} /> : item.checked ? "✓" : null}
                </span>
                <span className={s.label}>{item.label}</span>
                {item.children && <span className={s.arrow} aria-hidden="true" />}
              </button>
              {item.children && openIndex === i && (
                <Menu
                  items={item.children}
                  className={s.submenu}
                  onDismiss={onDismiss}
                  autoFocus={focusSub}
                  label={item.label}
                  onBack={() => {
                    setOpenIndex(null);
                    buttons()[buttons().findIndex((b) => b.getAttribute("aria-expanded") === "true")]?.focus();
                  }}
                />
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
