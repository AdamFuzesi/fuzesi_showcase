import { useEffect, useId } from "react";
import s from "./wallpapers.module.css";

// The official Unicorn Studio runtime, pinned to the version the scene was exported with.
// It's loaded from Unicorn's CDN on first use (not bundled), so it costs nothing until a live
// wallpaper is actually on screen.
const SDK_URL = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.3.0/dist/unicornStudio.umd.js";

interface UnicornSceneHandle {
  destroy: () => void;
  paused: boolean;
}

interface UnicornStudioSDK {
  addScene: (opts: {
    elementId: string;
    filePath: string;
    fps?: number;
    scale?: number;
    dpi?: number;
    lazyLoad?: boolean;
    altText?: string;
    ariaLabel?: string;
    interactivity?: { mouse?: { disabled?: boolean; disableMobile?: boolean } };
  }) => Promise<UnicornSceneHandle>;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioSDK;
  }
}

let sdkPromise: Promise<UnicornStudioSDK> | null = null;

function loadSdk(): Promise<UnicornStudioSDK> {
  if (window.UnicornStudio) return Promise.resolve(window.UnicornStudio);
  sdkPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => (window.UnicornStudio ? resolve(window.UnicornStudio) : reject(new Error("UnicornStudio missing")));
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Failed to load Unicorn Studio SDK"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

interface UnicornSceneProps {
  /** Self-hosted scene JSON exported from Unicorn Studio (served from /public). */
  src: string;
  /** Colour shown while the SDK and scene load, and if WebGL is unavailable. */
  fallback: string;
  fps?: number;
  dpi?: number;
}

export function UnicornScene({ src, fallback, fps = 60, dpi = 1.5 }: UnicornSceneProps) {
  const elementId = `us-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let scene: UnicornSceneHandle | null = null;
    let cancelled = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadSdk()
      .then((sdk) =>
        sdk.addScene({
          elementId,
          filePath: src,
          fps,
          dpi,
          scale: 1,
          lazyLoad: false,
          ariaLabel: "Animated desktop wallpaper",
          interactivity: { mouse: { disabled: true } },
        }),
      )
      .then((s) => {
        if (cancelled) return s.destroy();
        scene = s;
        // Respect reduced motion: render the first frame, then hold still.
        if (reduceMotion) s.paused = true;
      })
      .catch((err) => console.warn("[AdamOS] live wallpaper unavailable:", err));

    return () => {
      cancelled = true;
      scene?.destroy();
    };
  }, [elementId, src, fps, dpi]);

  return <div id={elementId} className={s.fill} style={{ background: fallback }} aria-hidden="true" />;
}
