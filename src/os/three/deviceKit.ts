import * as THREE from "three";

/** Shared building blocks for the 3D devices (phone, laptop) shown in the Projects light table. */

/** How a device wants to be staged: its lean, where the floor sits, and how much to frame. */
export interface DeviceFraming {
  /** Fixed product-shot lean, applied around the spin. */
  tilt: { x: number; z: number };
  /** World-space height of the shadow-catching floor. */
  floorY: number;
  /** Width/height (world units) the camera must fit, including breathing room and shadow. */
  fitW: number;
  fitH: number;
  /** Where the camera aims, and how high it sits as a fraction of its distance. */
  lookY: number;
  cameraRise: number;
}

export interface DeviceRig {
  group: THREE.Group;
  /** Swap the screenshot shown on the display. */
  setScreen: (texture: THREE.Texture) => void;
  dispose: () => void;
  framing: DeviceFraming;
}

/** Collects geometries/materials as they're created so a rig can dispose everything in one go. */
export function createTracker() {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const track = <T extends THREE.BufferGeometry | THREE.Material>(x: T) => {
    if (x instanceof THREE.Material) materials.push(x);
    else geometries.push(x);
    return x;
  };
  const disposeAll = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };
  return { track, disposeAll };
}

export function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const x = -w / 2;
  const y = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Flat rounded-rect with UVs normalised to 0..1 across its bounds (ShapeGeometry uses raw coords). */
export function roundedPlane(w: number, h: number, r: number): THREE.ShapeGeometry {
  const geo = new THREE.ShapeGeometry(roundedRect(w, h, r), 24);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

/** Rounded-rect slab centred on z = 0, with softened edges. */
export function roundedSlab(w: number, h: number, r: number, depth: number, bevel: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, Math.max(r - bevel, 0.001)), {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 24,
  });
  geo.translate(0, 0, -(depth - bevel * 2) / 2);
  return geo;
}

/**
 * Cover-fits a screenshot onto a display of the given size, anchored to the top so the page's header
 * (or a phone's status bar) always shows and any overflow is cropped from the bottom.
 */
export function coverScreen(texture: THREE.Texture, screenW: number, screenH: number) {
  const img = texture.image as { width: number; height: number };
  const imgAspect = img.width / img.height;
  const screenAspect = screenW / screenH;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  if (imgAspect > screenAspect) {
    texture.repeat.set(screenAspect / imgAspect, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0);
  } else {
    texture.repeat.set(1, imgAspect / screenAspect);
    texture.offset.set(0, 1 - texture.repeat.y);
  }
  texture.needsUpdate = true;
}

/** An unlit display surface, so screenshots keep their true colours under the studio lights. */
export function createDisplay(track: ReturnType<typeof createTracker>["track"], w: number, h: number, r: number) {
  const material = track(new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
  const mesh = new THREE.Mesh(track(roundedPlane(w, h, r)), material);
  const setScreen = (texture: THREE.Texture) => {
    coverScreen(texture, w, h);
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
  };
  return { mesh, setScreen, disposeMap: () => material.map?.dispose() };
}
