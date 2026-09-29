import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SCREEN_H, SCREEN_W } from "./store";
import s from "./Screen.module.css";

interface ScreenApi {
  scale: number;
  /** Convert a pointer event's client coords into internal screen coords. */
  toLocal: (clientX: number, clientY: number) => { x: number; y: number };
}

const ScreenContext = createContext<ScreenApi>({ scale: 1, toLocal: (x, y) => ({ x, y }) });
export const useScreen = () => useContext(ScreenContext);

/**
 * Renders the OS at a fixed 1024×640 (16:10) internal resolution and scales it to fill the
 * iframe, letterboxing if the host isn't exactly 16:10. The page itself never scrolls.
 */
export function Screen({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => setScale(Math.min(host.clientWidth / SCREEN_W, host.clientHeight / SCREEN_H));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const api: ScreenApi = {
    scale,
    toLocal: (clientX, clientY) => {
      const rect = screenRef.current?.getBoundingClientRect();
      if (!rect) return { x: clientX, y: clientY };
      return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
    },
  };

  return (
    <div ref={hostRef} className={s.host}>
      <div
        ref={screenRef}
        data-screen
        className={s.screen}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ScreenContext.Provider value={api}>{children}</ScreenContext.Provider>
      </div>
    </div>
  );
}
