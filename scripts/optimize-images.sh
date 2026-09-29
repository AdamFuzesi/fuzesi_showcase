#!/usr/bin/env bash
# Builds the small JPEG copies AdamOS actually loads (macOS `sips`, no npm deps):
#   public/images/os/thumb/<name>.jpg  240px — folder thumbnails
#   public/images/os/hero/<name>.jpg   960px — detail windows
#   public/images/os/display/<name>.jpg 1600px — screenshots on the 3D laptop display
#   public/images/os/logo/<name>.png   512px — skill logos (PNG, so transparency survives)
# Re-run after adding or replacing an image referenced in src/content_option.js.
set -euo pipefail
cd "$(dirname "$0")/../public/images"
mkdir -p os/thumb os/hero os/display os/logo
for src in *.png *.jpg *.JPG *.jpeg; do
  [ -f "$src" ] || continue
  name="${src%.*}"
  sips -Z 240 -s format jpeg -s formatOptions 72 "$src" --out "os/thumb/$name.jpg" >/dev/null
  sips -Z 960 -s format jpeg -s formatOptions 78 "$src" --out "os/hero/$name.jpg" >/dev/null
  sips -Z 1600 -s format jpeg -s formatOptions 82 "$src" --out "os/display/$name.jpg" >/dev/null
  case "$src" in *.png) sips -Z 512 "$src" --out "os/logo/$name.png" >/dev/null ;; esac
done
du -sh os/thumb os/hero os/display os/logo
