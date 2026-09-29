import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * Turns a flat vector logo into a solid, glossy 3D mark — the same treatment as the Locus GLB:
 * every filled shape is extruded with a small bevel in its exact brand colour, and shapes that sit on
 * top of other shapes are stepped forward so layered logos (e.g. lettering on a box) stand proud.
 * Proportions are relative to the logo's size, so any SVG comes out looking the same.
 */
const DEPTH = 0.06; // extrusion depth, as a fraction of the logo's largest side
const LAYER_STEP = 0.014; // how far each overlapping layer steps forward
const BEVEL = 0.0035;

interface Part {
  shapes: THREE.Shape[];
  color: string;
  opacity: number;
  box: THREE.Box2;
}

function enamel(color: string, opacity: number) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setStyle(color),
    // Low metalness + damped reflections keep brand colours true on the white sweep; the clearcoat
    // still gives the glossy highlight as the mark turns.
    metalness: 0.1,
    roughness: 0.32,
    clearcoat: 0.45,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.35,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide, // the model is mirrored in Y (SVG is y-down), which flips winding
  });
}

export function buildSvgModel(svgText: string): THREE.Group {
  const data = new SVGLoader().parse(svgText);

  // Collect filled parts (strokes-only and fill="none" paths are skipped).
  const parts: Part[] = [];
  for (const path of data.paths) {
    const style: { fill?: string; fillOpacity?: number; opacity?: number } = path.userData?.style ?? {};
    const fill: string | undefined = style.fill;
    if (!fill || fill === "none" || fill.startsWith("url(")) continue;
    const shapes = SVGLoader.createShapes(path);
    if (!shapes.length) continue;
    const box = new THREE.Box2();
    for (const shape of shapes) for (const p of shape.getPoints(8)) box.expandByPoint(p);
    parts.push({ shapes, color: fill, opacity: (style.fillOpacity ?? 1) * (style.opacity ?? 1), box });
  }

  const overall = new THREE.Box2();
  parts.forEach((p) => overall.union(p.box));
  const size = overall.getSize(new THREE.Vector2());
  const span = Math.max(size.x, size.y) || 1;
  const depth = DEPTH * span;
  const step = LAYER_STEP * span;
  const bevel = BEVEL * span;

  const group = new THREE.Group();
  const materials = new Map<string, THREE.Material>();

  parts.forEach((part, i) => {
    // A part's layer = how many earlier parts it overlaps (document order is paint order).
    let layer = 0;
    for (let j = 0; j < i; j++) if (parts[j].box.intersectsBox(part.box)) layer++;

    const key = `${part.color}|${part.opacity}`;
    if (!materials.has(key)) materials.set(key, enamel(part.color, part.opacity));
    const geometry = new THREE.ExtrudeGeometry(part.shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 2,
      curveSegments: 18,
    });
    const mesh = new THREE.Mesh(geometry, materials.get(key));
    mesh.position.z = layer * step;
    group.add(mesh);
  });

  group.scale.y = -1; // SVG space is y-down
  return group;
}
