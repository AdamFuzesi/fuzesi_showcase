import * as THREE from "three";
import { createDisplay, createTracker, roundedPlane, roundedSlab, type DeviceRig } from "./deviceKit";

/**
 * A generic modern smartphone built from primitives (no external model, no branding).
 * Proportions follow a ~6.1" phone: 71.5 × 147 × 8.3 mm, scaled so 1 unit ≈ 100 mm.
 * All art direction lives in PHONE — tweak here, not in the builder.
 */
export const PHONE = {
  width: 0.715,
  height: 1.47,
  depth: 0.083,
  cornerRadius: 0.112,
  edgeBevel: 0.014,
  bezel: 0.022,
  frameColor: "#3b3b40", // brushed titanium
  backColor: "#26262b", // frosted glass
  frontColor: "#050505", // black glass around the display
} as const;

const SCREEN_W = PHONE.width - PHONE.bezel * 2;
const SCREEN_H = PHONE.height - PHONE.bezel * 2;

export function buildPhone(): DeviceRig {
  const group = new THREE.Group();
  const { track, disposeAll } = createTracker();
  const halfD = PHONE.depth / 2;

  // Titanium frame / body.
  const frameMat = track(new THREE.MeshStandardMaterial({ color: PHONE.frameColor, metalness: 1, roughness: 0.32 }));
  group.add(new THREE.Mesh(track(roundedSlab(PHONE.width, PHONE.height, PHONE.cornerRadius, PHONE.depth, PHONE.edgeBevel)), frameMat));

  // Front black glass (the bezel), sitting just proud of the frame.
  const frontGeo = track(roundedPlane(PHONE.width - 0.008, PHONE.height - 0.008, PHONE.cornerRadius - 0.004));
  const front = new THREE.Mesh(
    frontGeo,
    track(new THREE.MeshPhysicalMaterial({ color: PHONE.frontColor, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 })),
  );
  front.position.z = halfD + 0.0008;
  group.add(front);

  const display = createDisplay(track, SCREEN_W, SCREEN_H, PHONE.cornerRadius - PHONE.bezel);
  display.mesh.position.z = halfD + 0.0016;
  group.add(display.mesh);

  // A whisper of glass on top of the display so the environment glints across it as it turns.
  const glass = new THREE.Mesh(
    frontGeo,
    track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0.02, metalness: 0, clearcoat: 1 })),
  );
  glass.position.z = halfD + 0.0024;
  group.add(glass);

  // Camera cut-out pill at the top of the display.
  const pill = new THREE.Mesh(track(roundedPlane(0.19, 0.056, 0.028)), track(new THREE.MeshBasicMaterial({ color: 0x000000 })));
  pill.position.set(0, SCREEN_H / 2 - 0.058, halfD + 0.0022);
  group.add(pill);

  // Frosted glass back.
  const back = new THREE.Mesh(
    frontGeo,
    track(new THREE.MeshPhysicalMaterial({ color: PHONE.backColor, roughness: 0.45, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.4 })),
  );
  back.position.z = -halfD - 0.0008;
  back.rotation.y = Math.PI;
  group.add(back);

  // Camera island on the back (top corner as seen from behind).
  const islandSize = 0.26;
  const island = new THREE.Mesh(track(roundedSlab(islandSize, islandSize, 0.07, 0.022, 0.006)), frameMat);
  const islandX = PHONE.width / 2 - 0.04 - islandSize / 2;
  const islandY = PHONE.height / 2 - 0.04 - islandSize / 2;
  island.position.set(islandX, islandY, -halfD - 0.011);
  group.add(island);

  const lensRing = track(new THREE.CylinderGeometry(0.052, 0.052, 0.018, 40));
  const lensGlass = track(new THREE.CylinderGeometry(0.036, 0.036, 0.02, 40));
  const ringMat = track(new THREE.MeshStandardMaterial({ color: "#1b1b1f", metalness: 1, roughness: 0.2 }));
  const glassMat = track(new THREE.MeshPhysicalMaterial({ color: "#05070c", roughness: 0.05, metalness: 0.2, clearcoat: 1 }));
  for (const [dx, dy] of [
    [-0.058, 0.058],
    [-0.058, -0.058],
  ]) {
    const ring = new THREE.Mesh(lensRing, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(islandX - dx, islandY + dy, -halfD - 0.028);
    const lens = new THREE.Mesh(lensGlass, glassMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(islandX - dx, islandY + dy, -halfD - 0.03);
    group.add(ring, lens);
  }
  const flash = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 24)),
    track(new THREE.MeshStandardMaterial({ color: "#e9e2cf", roughness: 0.6, emissive: "#3a3527" })),
  );
  flash.rotation.x = Math.PI / 2;
  flash.position.set(islandX - 0.058, islandY - 0.004, -halfD - 0.026);
  group.add(flash);

  // Side buttons.
  const addButton = (x: number, y: number, h: number) => {
    const b = new THREE.Mesh(track(new THREE.BoxGeometry(0.012, h, 0.03)), frameMat);
    b.position.set(x, y, 0);
    group.add(b);
  };
  addButton(PHONE.width / 2 + 0.004, 0.28, 0.2); // power
  addButton(-PHONE.width / 2 - 0.004, 0.34, 0.13); // volume up
  addButton(-PHONE.width / 2 - 0.004, 0.17, 0.13); // volume down
  addButton(-PHONE.width / 2 - 0.004, 0.52, 0.06); // action

  return {
    group,
    setScreen: display.setScreen,
    dispose: () => {
      display.disposeMap();
      disposeAll();
    },
    framing: {
      tilt: { x: -0.12, z: -0.16 }, // leaned back a touch and canted clockwise
      floorY: -0.98,
      fitW: PHONE.width * 2.4,
      fitH: PHONE.height * 1.3,
      lookY: -0.12,
      cameraRise: 0.14,
    },
  };
}
