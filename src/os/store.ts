import { create } from "zustand";
import { APPS, type AppId } from "./apps/manifest";

export const SCREEN_W = 1024;
export const SCREEN_H = 640;
export const TASKBAR_H = 30;
export const MIN_W = 220;
export const MIN_H = 140;
/** How much of a window's title bar must stay on screen when dragged. */
const GRAB_MARGIN = 64;

export interface WinState {
  id: string;
  app: AppId;
  /** App-specific argument, e.g. which project a detail window shows. */
  param?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface OSState {
  windows: Record<string, WinState>;
  /** Open order, used for the taskbar and for cascading. */
  order: string[];
  activeId: string | null;
  zTop: number;
  wallpaper: string;
  startOpen: boolean;

  open: (app: AppId, param?: string) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  /** Taskbar click: minimise if it's the active window, otherwise restore + focus. */
  toggleFromTaskbar: (id: string) => void;
  setRect: (id: string, rect: Partial<Rect>) => void;
  setWallpaper: (id: string) => void;
  setStartOpen: (open: boolean) => void;
}

const workH = SCREEN_H - TASKBAR_H;


export function clampRect({ x, y, w, h }: Rect): Rect {
  const cw = Math.max(MIN_W, Math.min(w, SCREEN_W));
  const ch = Math.max(MIN_H, Math.min(h, workH));
  return {
    w: cw,
    h: ch,
    x: Math.min(Math.max(x, GRAB_MARGIN - cw), SCREEN_W - GRAB_MARGIN),
    y: Math.min(Math.max(y, 0), workH - 20),
  };
}

export const winKey = (app: AppId, param?: string) => (param ? `${app}:${param}` : app);

const topmostVisible = (windows: Record<string, WinState>, except?: string) =>
  Object.values(windows)
    .filter((w) => !w.minimized && w.id !== except)
    .sort((a, b) => b.z - a.z)[0]?.id ?? null;

export const useOS = create<OSState>((set, get) => ({
  windows: {},
  order: [],
  activeId: null,
  zTop: 10,
  wallpaper: "strand",
  startOpen: false,

  open: (app, param) => {
    const id = winKey(app, param);
    const { windows, zTop, order } = get();
    const existing = windows[id];
    if (existing) {
      set({
        windows: { ...windows, [id]: { ...existing, minimized: false, z: zTop + 1 } },
        zTop: zTop + 1,
        activeId: id,
        startOpen: false,
      });
      return;
    }
    const def = APPS[app];
    // Cascade: each new window steps 24px down-right, wrapping before it runs off-screen.
    const step = order.length % 8;
    const rect = clampRect({
      x: 104 + step * 24,
      y: 24 + step * 24,
      w: def.size.w,
      h: def.size.h,
    });
    if (rect.x + rect.w > SCREEN_W) rect.x = Math.max(0, SCREEN_W - rect.w - 8);
    if (rect.y + rect.h > workH) rect.y = Math.max(0, workH - rect.h - 8);
    set({
      windows: {
        ...windows,
        [id]: { id, app, param, ...rect, z: zTop + 1, minimized: false, maximized: false },
      },
      order: [...order, id],
      zTop: zTop + 1,
      activeId: id,
      startOpen: false,
    });
  },

  close: (id) => {
    const { windows, order, activeId } = get();
    const { [id]: _removed, ...rest } = windows;
    set({
      windows: rest,
      order: order.filter((o) => o !== id),
      activeId: activeId === id ? topmostVisible(rest) : activeId,
    });
  },

  closeAll: () => set({ windows: {}, order: [], activeId: null }),

  focus: (id) => {
    const { windows, zTop, activeId } = get();
    const win = windows[id];
    if (!win || (activeId === id && win.z === zTop)) return;
    set({
      windows: { ...windows, [id]: { ...win, z: zTop + 1, minimized: false } },
      zTop: zTop + 1,
      activeId: id,
    });
  },

  minimize: (id) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    const next = { ...windows, [id]: { ...win, minimized: true } };
    set({ windows: next, activeId: topmostVisible(next, id) });
  },

  toggleMaximize: (id) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({ windows: { ...windows, [id]: { ...win, maximized: !win.maximized } } });
    get().focus(id);
  },

  toggleFromTaskbar: (id) => {
    const { windows, activeId } = get();
    const win = windows[id];
    if (!win) return;
    if (activeId === id && !win.minimized) get().minimize(id);
    else get().focus(id);
  },

  setRect: (id, rect) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({ windows: { ...windows, [id]: { ...win, ...clampRect({ ...win, ...rect }) } } });
  },

  setWallpaper: (wallpaper) => set({ wallpaper }),
  setStartOpen: (startOpen) => set({ startOpen }),
}));
