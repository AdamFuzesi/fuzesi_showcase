import { memo } from "react";
import { ICONS, PALETTE, type IconName } from "./sprites";

interface PixelIconProps {
  name: IconName;
  /** Rendered size in CSS px. Use multiples of 16 so every sprite pixel maps to whole screen pixels. */
  size?: 16 | 32 | 48 | 64;
  className?: string;
}

/**
 * Original 16×16 pixel-art sprites rendered as SVG rects — crisp at any integer scale,
 * a few hundred bytes each, and trivially re-colourable via PALETTE.
 */
export const PixelIcon = memo(function PixelIcon({ name, size = 32, className }: PixelIconProps) {
  const rows = ICONS[name];
  const rects: JSX.Element[] = [];
  rows.forEach((row, y) => {
    // Merge horizontal runs of the same colour to keep the DOM small.
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (row[x + run] === ch) run++;
      const fill = PALETTE[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />);
      x += run;
    }
  });
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {rects}
    </svg>
  );
});
