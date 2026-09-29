// Typed view over src/content_option.js — that file stays the single source of truth for copy.
// Everything here is either a type or a pure derivation of it; no new facts live in this file.
import * as raw from "../content_option.js";

export interface Profile {
  name: string;
  shortName: string;
  headline: string;
  portrait: string;
  facts: { label: string; value: string }[];
  wallpaper: string;
}

/** Original image plus the optimised copies from scripts/optimize-images.sh. */
export interface Media {
  image: string;
  thumb: string;
  hero: string;
  /** 1600px copy for the 3D laptop display. */
  display: string;
}

export interface Project extends Media {
  id: string;
  name: string;
  stack: string[];
  /** The role played, for work where a tech stack doesn't apply (design, brand, contracting). */
  role?: string;
  description: string;
  link?: string;
  /** Portrait app screenshot; mobile projects get a 3D phone instead of a flat image. */
  screen?: string;
}

export interface Involvement extends Media {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Job {
  id: string;
  title: string;
  /** Company without the parenthetical, e.g. "Locus". */
  company: string;
  /** The parenthetical, e.g. "YC F25" or "via Accenture". */
  badge?: string;
  dates: string;
  /** Derived from `dates`, e.g. "1 yr 2 mos". */
  duration?: string;
  /** Only when the title says so: "Internship" / "Part-time". */
  kind?: string;
  /** Paragraphs describing the role. */
  description: string[];
  /** The product or program worked on, e.g. "Lumi platform". */
  project?: string;
  location?: string;
  /** One or more showcase marks (.glb, or .svg extruded into 3D). */
  model?: string | string[];
}

interface RawJob {
  jobtitle: string;
  where: string;
  date: string;
  description?: string | string[];
  project?: string;
  location?: string;
  model?: string | string[];
}

/** "05/2024 - 09/2024" → "5 mos"; "03/2026 - Present" counts to today. Inclusive of both months. */
function durationOf(dates: string): string | undefined {
  const m = dates.match(/(\d{1,2})\/(\d{4})\s*-\s*(?:(\d{1,2})\/(\d{4})|present)/i);
  if (!m) return undefined;
  const now = new Date();
  const [y1, m1] = [+m[2], +m[1]];
  const [y2, m2] = m[3] ? [+m[4], +m[3]] : [now.getFullYear(), now.getMonth() + 1];
  const months = (y2 - y1) * 12 + (m2 - m1) + 1;
  if (months < 1) return undefined;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  return [yrs && `${yrs} yr${yrs > 1 ? "s" : ""}`, mos && `${mos} mo${mos > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

export interface Skill {
  name: string;
  /** Transparent logo: the 512px PNG from scripts/optimize-images.sh, or the original SVG. */
  logo: string;
}

/** content_option.js mixes "images/x.png" and "/images/x.png"; normalise to root-absolute. */
const asset = (path: string) => (path.startsWith("/") || path.startsWith("http") ? path : `/${path}`);

/** Map "images/foo.png" to its generated 240px / 960px JPEGs; SVGs and remote URLs are used as-is. */
const media = (path: string): Media => {
  const image = asset(path);
  const file = image.match(/^\/images\/([^/]+)\.(png|jpe?g)$/i)?.[1];
  if (!file) return { image, thumb: image, hero: image, display: image };
  return {
    image,
    thumb: `/images/os/thumb/${file}.jpg`,
    hero: `/images/os/hero/${file}.jpg`,
    display: `/images/os/display/${file}.jpg`,
  };
};

export const profile: Profile = raw.profile;
export const meta: { title: string; description: string } = raw.meta;
export const intro: { title: string; animated: Record<string, string>; description: string } = raw.introdata;
export const aboutMe: string = raw.dataabout.aboutme;
export const contact = raw.contactConfig as {
  MY_EMAIL: string;
  MY_ALTEMAIL: string;
  description: string;
  YOUR_SERVICE_ID: string;
  YOUR_TEMPLATE_ID: string;
  YOUR_USER_ID: string;
};

/** Only the socials that point at a real profile (facebook/twitter are bare-domain placeholders). */
export const socials: { label: string; href: string }[] = [
  { label: "GitHub", href: raw.socialprofils.github },
  { label: "LinkedIn", href: raw.socialprofils.linkedin },
];

export const jobs: Job[] = raw.worktimeline.map((j: RawJob, i: number) => {
  const [, company = j.where, paren] = j.where.match(/^(.*?)\s*\((.*)\)\s*$/) ?? [];
  const badge = paren && /^(accenture)$/i.test(paren) ? `via ${paren}` : paren;
  const kind = /intern/i.test(j.jobtitle) ? "Internship" : /part-time/i.test(j.jobtitle) ? "Part-time" : undefined;
  return {
    id: `job-${i}`,
    title: j.jobtitle.replace(/^part-time\s+/i, ""),
    company: company.trim(),
    badge,
    dates: j.date,
    duration: durationOf(j.date),
    kind,
    description: j.description === undefined ? [] : Array.isArray(j.description) ? j.description : [j.description],
    project: j.project,
    location: j.location,
    model: j.model,
  };
});

export const skills: Skill[] = raw.skills.map((s: { name: string; image: string }) => {
  const image = asset(s.image);
  const png = image.match(/^\/images\/([^/]+)\.png$/i)?.[1];
  return { name: s.name, logo: png ? `/images/os/logo/${png}.png` : image };
});

export const projects: Project[] = raw.services.map(
  (s: { title: string; role?: string; description: string; image: string; link?: string; screen?: string }, i: number) => {
    const [name, stack = ""] = s.title.split("|");
    return {
      id: `project-${i}`,
      name: name.trim(),
      stack: stack.split(",").map((t) => t.trim()).filter(Boolean),
      description: s.description,
      ...media(s.image),
      link: s.link,
      screen: s.screen ? asset(s.screen) : undefined,
      role: s.role,
    };
  },
);

export const involvement: Involvement[] = raw.extracurricular.map(
  (e: { title: string; description: string; image: string; link?: string }, i: number) => ({
    id: `involvement-${i}`,
    title: e.title,
    description: e.description,
    ...media(e.image),
    link: e.link,
  }),
);

export const findProject = (id?: string) => projects.find((p) => p.id === id);
