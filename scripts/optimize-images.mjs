#!/usr/bin/env node
/**
 * Builds the small images AdamOS actually loads, and only those (macOS `sips`, no npm deps).
 *
 * Source originals live in assets/images/ — outside public/, so they never ship to Netlify.
 * This reads src/content_option.js and writes, for every project and involvement image:
 *   public/images/os/thumb/<name>.jpg    240px  — light-table strip thumbnails
 *   public/images/os/hero/<name>.jpg     960px  — detail windows, involvement panel
 *   public/images/os/display/<name>.jpg 1600px  — screenshots on the 3D laptop display
 * and for every skill PNG:
 *   public/images/os/logo/<name>.png     512px  — the Skills stream (PNG keeps transparency)
 *
 * Run `npm run images` after adding or replacing an image referenced in content_option.js.
 * The four output folders are rebuilt from scratch each run, so stale images never linger.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as content from "../src/content_option.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "assets/images");
const OUT = join(ROOT, "public/images/os");

const name = (path) => basename(path, extname(path));
const RASTER = /\.(png|jpe?g)$/i;

const media = new Set(
  [...content.services, ...content.extracurricular].map((x) => x.image).filter((p) => RASTER.test(p)).map((p) => basename(p)),
);
const logos = new Set(content.skills.map((x) => x.image).filter((p) => /\.png$/i.test(p)).map((p) => basename(p)));

const sips = (args) => execFileSync("sips", args, { stdio: "ignore" });
const jobs = {
  thumb: { files: media, args: ["-Z", "240", "-s", "format", "jpeg", "-s", "formatOptions", "72"], ext: "jpg" },
  hero: { files: media, args: ["-Z", "960", "-s", "format", "jpeg", "-s", "formatOptions", "78"], ext: "jpg" },
  display: { files: media, args: ["-Z", "1600", "-s", "format", "jpeg", "-s", "formatOptions", "82"], ext: "jpg" },
  logo: { files: logos, args: ["-Z", "512"], ext: "png" },
};

let missing = 0;
for (const [dir, job] of Object.entries(jobs)) {
  const out = join(OUT, dir);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const file of job.files) {
    const src = join(SRC, file);
    if (!existsSync(src)) {
      console.warn(`missing source: assets/images/${file}`);
      missing++;
      continue;
    }
    sips([...job.args, src, "--out", join(out, `${name(file)}.${job.ext}`)]);
  }
  console.log(`${dir.padEnd(8)} ${job.files.size} images`);
}
if (missing) process.exitCode = 1;
