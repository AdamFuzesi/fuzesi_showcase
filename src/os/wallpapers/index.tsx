import type { ComponentType } from "react";
import { profile } from "../../content";
import { UnicornScene } from "./UnicornScene";
import s from "./wallpapers.module.css";

/**
 * A wallpaper is just a component that fills the desktop behind the icons.
 * To add a live/three.js wallpaper, create e.g. `./ThreeScene.tsx` (a react-three-fiber <Canvas> or a
 * raw WebGL canvas sized 100%×100%), lazy-import it here, and add an entry — the Display Properties
 * picker and the desktop pick it up automatically.
 */
export interface Wallpaper {
  id: string;
  name: string;
  Component: ComponentType;
  /** Light wallpapers get dark desktop-icon labels so they stay legible. */
  tone: "light" | "dark";
}

const Solid = () => <div className={`${s.fill} ${s.solid}`} />;

const Photo = () => (
  <div className={`${s.fill} ${s.solid}`}>
    <img className={s.centered} src={profile.wallpaper} alt="" decoding="async" />
  </div>
);

/** "Strand" — a Unicorn Studio scene (gradient → aurora → glyph dither), exported as JSON. */
const Strand = () => <UnicornScene src="/wallpapers/strand.json" fallback="#eeeeee" />;

const Dither = () => <div className={`${s.fill} ${s.dither}`} />;
const Blueprint = () => <div className={`${s.fill} ${s.blueprint}`} />;
const Dusk = () => <div className={`${s.fill} ${s.dusk}`} />;

export const WALLPAPERS: Wallpaper[] = [
  { id: "strand", name: "Strand (live)", Component: Strand, tone: "light" },
  { id: "hike", name: "Summit (photo)", Component: Photo, tone: "dark" },
  { id: "teal", name: "(None)", Component: Solid, tone: "dark" },
  { id: "dither", name: "Checkerboard", Component: Dither, tone: "dark" },
  { id: "blueprint", name: "Blueprint", Component: Blueprint, tone: "dark" },
  { id: "dusk", name: "Harbour Dusk", Component: Dusk, tone: "dark" },
];

export const getWallpaper = (id: string) => WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
