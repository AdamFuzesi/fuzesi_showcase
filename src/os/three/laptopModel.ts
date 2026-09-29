import * as THREE from "three";
import { createDisplay, createTracker, roundedPlane, roundedSlab, type DeviceRig } from "./deviceKit";

/**
 * A generic 14" laptop built from primitives (no external model, no branding): aluminium base with a
 * keyboard well and trackpad, a hinge, and a lid opened to ~105° carrying a 16:10 display.
 * 1 unit ≈ 200 mm. All art direction lives in LAPTOP — tweak here, not in the builder.
 */
export const LAPTOP = {
  width: 1.56,
  depth: 1.1, // front-to-back of the base
  baseThickness: 0.055,
  lidHeight: 1.04,
  lidThickness: 0.032,
  corner: 0.07,
  openAngle: 105, // degrees between base and lid
  bezelSide: 0.05,
  bezelTop: 0.05,
  bezelBottom: 0.075,
  bodyColor: "#74777d", // space-grey aluminium
  deckColor: "#6c6f75",
  keyWellColor: "#1a1b1e",
  bezelColor: "#050505",
} as const;

/** Draws the key grid once into a small texture instead of modelling ~80 keys. */
function keyboardTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 360;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = LAPTOP.keyWellColor;
  ctx.fillRect(0, 0, w, h);
  const rows = [14, 14, 13, 12, 11];
  const pad = 14;
  const gap = 9;
  const rowH = (h - pad * 2 - gap * (rows.length + 0.4)) / (rows.length + 0.6);
  ctx.fillStyle = "#2c2d32";
  rows.forEach((count, r) => {
    const keyW = (w - pad * 2 - gap * (count - 1)) / count;
    for (let c = 0; c < count; c++) {
      const x = pad + c * (keyW + gap);
      const y = pad + r * (rowH + gap);
      ctx.beginPath();
      ctx.roundRect(x, y, keyW, rowH, 7);
      ctx.fill();
    }
  });
  // Space bar row.
  const y = pad + rows.length * (rowH + gap);
  const small = (w - pad * 2) / 14;
  ctx.beginPath();
  ctx.roundRect(pad, y, small * 3 - gap, rowH * 0.9, 7);
  ctx.roundRect(pad + small * 3, y, small * 6 - gap, rowH * 0.9, 7);
  ctx.roundRect(pad + small * 9, y, small * 5, rowH * 0.9, 7);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function buildLaptop(): DeviceRig {
  const root = new THREE.Group();
  const laptop = new THREE.Group(); // offset inside root so the whole machine is centred on the origin
  root.add(laptop);
  const { track, disposeAll } = createTracker();
  const t = LAPTOP.baseThickness;

  const body = track(new THREE.MeshStandardMaterial({ color: LAPTOP.bodyColor, metalness: 1, roughness: 0.38 }));

  // ---- Base: a slab lying flat, top face at y = t/2 ----
  const base = new THREE.Mesh(track(roundedSlab(LAPTOP.width, LAPTOP.depth, LAPTOP.corner, t, 0.012)), body);
  base.rotation.x = -Math.PI / 2;
  laptop.add(base);

  const flat = (geo: THREE.BufferGeometry, material: THREE.Material, z: number, lift = 0.0012) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, t / 2 + lift, z);
    laptop.add(mesh);
    return mesh;
  };

  const keys = keyboardTexture(); // disposed in dispose() below
  flat(
    track(roundedPlane(LAPTOP.width * 0.84, 0.44, 0.02)),
    track(new THREE.MeshStandardMaterial({ map: keys, roughness: 0.7, metalness: 0.1 })),
    -0.13,
  );
  flat(
    track(roundedPlane(0.5, 0.3, 0.03)),
    track(new THREE.MeshStandardMaterial({ color: LAPTOP.deckColor, metalness: 0.9, roughness: 0.28 })),
    0.3,
  );

  // ---- Hinge ----
  const hinge = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.022, 0.022, LAPTOP.width * 0.82, 24)),
    track(new THREE.MeshStandardMaterial({ color: "#2a2b2f", metalness: 0.8, roughness: 0.4 })),
  );
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, t / 2 + 0.012, -LAPTOP.depth / 2 + 0.03);
  laptop.add(hinge);

  // ---- Lid: built upright with its display facing +z, then pivoted back from the hinge ----
  const pivot = new THREE.Group();
  pivot.position.set(0, t / 2, -LAPTOP.depth / 2 + 0.03);
  pivot.rotation.x = -THREE.MathUtils.degToRad(LAPTOP.openAngle - 90);
  laptop.add(pivot);

  const lid = new THREE.Group();
  lid.position.y = LAPTOP.lidHeight / 2;
  pivot.add(lid);
  lid.add(new THREE.Mesh(track(roundedSlab(LAPTOP.width, LAPTOP.lidHeight, LAPTOP.corner, LAPTOP.lidThickness, 0.01)), body));

  const halfLid = LAPTOP.lidThickness / 2;
  const bezel = new THREE.Mesh(
    track(roundedPlane(LAPTOP.width - 0.012, LAPTOP.lidHeight - 0.012, LAPTOP.corner - 0.006)),
    track(new THREE.MeshPhysicalMaterial({ color: LAPTOP.bezelColor, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06 })),
  );
  bezel.position.z = halfLid + 0.0008;
  lid.add(bezel);

  const screenW = LAPTOP.width - LAPTOP.bezelSide * 2;
  const screenH = LAPTOP.lidHeight - LAPTOP.bezelTop - LAPTOP.bezelBottom;
  const display = createDisplay(track, screenW, screenH, 0.012);
  display.mesh.position.set(0, (LAPTOP.bezelBottom - LAPTOP.bezelTop) / 2, halfLid + 0.0016);
  lid.add(display.mesh);

  const webcam = new THREE.Mesh(track(new THREE.CircleGeometry(0.008, 20)), track(new THREE.MeshBasicMaterial({ color: "#1d2230" })));
  webcam.position.set(0, LAPTOP.lidHeight / 2 - LAPTOP.bezelTop / 2, halfLid + 0.0016);
  lid.add(webcam);

  // Centre the assembled machine on the origin so it spins about its own middle.
  const box = new THREE.Box3().setFromObject(laptop);
  laptop.position.sub(box.getCenter(new THREE.Vector3()));

  return {
    group: root,
    setScreen: display.setScreen,
    dispose: () => {
      display.disposeMap();
      keys.dispose();
      disposeAll();
    },
    framing: {
      tilt: { x: 0.12, z: -0.08 }, // tipped toward the camera to show the keyboard, canted like the phone
      floorY: -0.82,
      fitW: 2.65,
      fitH: 1.95,
      lookY: -0.08,
      cameraRise: 0.26,
    },
  };
}
