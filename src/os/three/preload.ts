import { lazy } from "react";
import { jobs, projects } from "../../content";

/**
 * The 3D stages are code-split (three.js is ~140 kB over the wire), so they'd otherwise start
 * downloading only when Projects or Experience is double-clicked — a visible wait. These loaders are
 * memoised and shared: the views render through the lazy components below, and the OS shell warms
 * the same promises during idle time after the desktop paints, or as soon as the pointer heads for
 * a window that needs them. Whichever happens first does the download; the other gets it for free.
 */
let deviceStage: Promise<typeof import("./DeviceStage")> | null = null;
let modelStage: Promise<typeof import("./ModelStage")> | null = null;

const loadDeviceStage = () => (deviceStage ??= import("./DeviceStage"));
const loadModelStage = () => (modelStage ??= import("./ModelStage"));

export const DeviceStage = lazy(loadDeviceStage);
export const ModelStage = lazy(loadModelStage);

let warmed = false;

/** Fetch the 3D code plus the first thing each 3D window shows, at low priority. Safe to call often. */
export function preloadStages() {
  if (warmed) return;
  warmed = true;
  void loadDeviceStage().catch(() => (deviceStage = null));
  void loadModelStage().catch(() => (modelStage = null));

  // The first frame each window opens on, so it's in the HTTP cache before anyone clicks.
  const firstProject = projects[0];
  const firstJob = jobs[0];
  const urls = [
    firstProject && (firstProject.screen ?? firstProject.display),
    ...[firstJob?.model ?? []].flat(),
  ].filter(Boolean) as string[];
  for (const url of urls) {
    void fetch(url, { priority: "low" } as RequestInit).catch(() => {});
  }
}

/**
 * Runs `task` once the page has finished loading and the main thread is idle — so the prefetch never
 * competes with the desktop's first paint (or the 3D portfolio around the iframe, which is booting at
 * the same moment). Returns a cancel function.
 */
export function whenIdle(task: () => void, timeout = 3000): () => void {
  let idleId: number | undefined;
  let timerId: number | undefined;
  const schedule = () => {
    // Safari has no requestIdleCallback; a short timeout after `load` is a fine stand-in.
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(task, { timeout });
    else timerId = window.setTimeout(task, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
}
