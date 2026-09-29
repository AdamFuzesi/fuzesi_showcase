// Window metadata for every app, kept free of components so the store can import it without cycles.
// Components are wired up in ./registry.tsx.
import { findProject } from "../../content";
import type { IconName } from "../icons/sprites";

export type AppId = "about" | "experience" | "projects" | "contact" | "detail";

export interface AppMeta {
  title: (param?: string) => string;
  icon: IconName;
  size: { w: number; h: number };
  resizable?: boolean;
}

export const APPS: Record<AppId, AppMeta> = {
  about: { title: () => "About Me — System Properties", icon: "computer", size: { w: 700, h: 530 }, resizable: false },
  experience: { title: () => "Experience & Background", icon: "briefcase", size: { w: 800, h: 540 } },
  projects: { title: () => "Projects — Light Table", icon: "folder", size: { w: 800, h: 540 } },
  contact: { title: () => "Contact — New Message", icon: "mail", size: { w: 460, h: 440 } },
  /** A single project, opened from the Light Table or the Start menu. */
  detail: { title: (id) => findProject(id)?.name ?? "Project", icon: "folder", size: { w: 480, h: 460 } },
};

export const appTitle = (app: AppId, param?: string) => APPS[app].title(param);
export const appIcon = (app: AppId): IconName => APPS[app].icon;
