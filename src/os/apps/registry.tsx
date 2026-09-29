import type { ComponentType } from "react";
import type { WinState } from "../store";
import { AboutApp } from "./About";
import { ContactApp } from "./Contact";
import { DetailApp } from "./Detail";
import { ExperienceApp } from "./Experience";
import type { AppId } from "./manifest";
import { LightTable } from "./projects/LightTable";

export type AppComponent = ComponentType<{ win: WinState }>;

/** AppId → window contents. Metadata (title, icon, size) lives in ./manifest.ts. */
export const APP_COMPONENTS: Record<AppId, AppComponent> = {
  about: AboutApp,
  experience: ExperienceApp,
  projects: LightTable,
  contact: ContactApp,
  detail: DetailApp,
};
