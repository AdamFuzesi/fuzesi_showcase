import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { buildSvgModel } from "./svgModel";

/**
 * Loads a showcase model — a .glb, or an .svg logo that gets extruded into 3D — and returns it
 * centred on the origin and scaled so its largest side is `fitSize` units.
 */
export async function loadModel(url: string, fitSize: number): Promise<THREE.Object3D> {
  let root: THREE.Object3D;
  if (/\.svg($|\?)/i.test(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    root = buildSvgModel(await res.text());
  } else {
    root = (await new GLTFLoader().loadAsync(url)).scene;
  }

  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const wrapper = new THREE.Group();
  root.position.sub(centre);
  wrapper.add(root);
  wrapper.scale.setScalar(fitSize / Math.max(size.x, size.y, size.z));
  wrapper.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return wrapper;
}

export function disposeModel(model: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  model.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => materials.add(m));
    }
  });
  materials.forEach((m) => m.dispose());
}
