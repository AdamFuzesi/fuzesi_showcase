import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { disposeModel, loadModel } from "./loadModel";
import s from "./Stage.module.css";

const SPIN = 0.5; // rad/s — one turn every ~12.5s
/** Fixed product-shot lean, matching the phones in Projects. */
const TILT = { x: -0.14, z: -0.12 };
/** Every model is normalised so its largest dimension is this many units. */
const FIT_SIZE = 1.4;
const FLOOR_Y = -1.05;
const START_ANGLE = -0.5; // three-quarter view

interface ModelStageProps {
  /**
   * One model, or several to take turns: a .glb, or an .svg logo extruded into 3D. With several,
   * the stage swaps to the next each time the current one turns edge-on, so the change is unseen.
   * Omit it to show an empty sweep while keeping the stage (and its WebGL context) alive.
   */
  src?: string | string[];
  /** The OS screen's CSS scale, so the canvas renders at true device resolution. */
  scale: number;
  alt: string;
}

/**
 * A white studio sweep for flat 3D marks: centred, normalised, slowly spinning with a soft floor
 * shadow. One WebGL context per mount; changing `src` replaces the models in place.
 */
export default function ModelStage({ src, scale, alt }: ModelStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(scale);
  const syncRef = useRef<(() => void) | null>(null);
  const setModelsRef = useRef<((urls: string[]) => void) | null>(null);
  const [failed, setFailed] = useState(false);
  scaleRef.current = scale;
  const urlsKey = (src === undefined ? [] : Array.isArray(src) ? src : [src]).join("|");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.domElement.className = s.canvas;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture; // metallic / enamel finishes need something to reflect

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(0.5, 5, 1.4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 24;
    key.shadow.blurSamples = 24;
    key.shadow.bias = -0.0005;
    Object.assign(key.shadow.camera, { left: -2.4, right: 2.4, top: 2.4, bottom: -2.4, near: 0.5, far: 10 });
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6);
    fill.position.set(-3, 1, 2);
    scene.add(key, fill);

    const floorGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    scene.add(floor);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);

    // tilt (fixed lean) → spin (y rotation) → models (centred + normalised, one visible at a time)
    const tilt = new THREE.Group();
    tilt.rotation.set(TILT.x, 0, TILT.z);
    const spin = new THREE.Group();
    tilt.add(spin);
    scene.add(tilt);

    let models: THREE.Object3D[] = [];
    let current = 0;
    let lastEdge = 0; // which edge-on "half turn" the spin is in; changes when the mark is side-on

    const clearModels = () => {
      models.forEach((m) => {
        spin.remove(m);
        disposeModel(m);
      });
      models = [];
    };

    /** 0→1 ease-in progress of the current mark; a new mark grows in from slightly smaller. */
    let appear = 1;

    let loadToken = 0;
    setModelsRef.current = (list: string[]) => {
      const token = ++loadToken;
      // Clear straight away so the previous role's mark never lingers while the next one loads.
      // An empty list is valid: the stage stays mounted (no WebGL teardown) and simply shows nothing.
      clearModels();
      syncRef.current?.();
      if (!list.length) return;
      Promise.all(list.map((u) => loadModel(u, FIT_SIZE)))
        .then((loaded) => {
          if (token !== loadToken) return loaded.forEach(disposeModel);
          models = loaded;
          models.forEach((m, i) => {
            m.visible = i === 0;
            spin.add(m);
          });
          current = 0;
          spin.rotation.y = START_ANGLE;
          lastEdge = edgeIndex(START_ANGLE);
          appear = reduceMotion || !running ? 1 : 0;
          spin.scale.setScalar(appear === 1 ? 1 : 0.88);
          syncRef.current?.();
        })
        .catch(() => token === loadToken && setFailed(true));
    };

    /** Flat marks are edge-on at ±90°; this counts how many of those the spin has passed. */
    const edgeIndex = (angle: number) => Math.floor((angle - Math.PI / 2) / Math.PI);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = new THREE.Timer();

    let size = { w: 0, h: 0, dpr: 0 };
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return false;
      const dpr = Math.min(window.devicePixelRatio * scaleRef.current, 2.5);
      if (w === size.w && h === size.h && dpr === size.dpr) return true;
      size = { w, h, dpr };
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const fit = FIT_SIZE * 1.55;
      const dist = Math.max(fit / (2 * halfFov), fit / (2 * halfFov * camera.aspect));
      camera.position.set(0, dist * 0.16, dist);
      camera.lookAt(0, -0.1, 0);
      camera.updateProjectionMatrix();
      return true;
    };

    const tick = (timestamp?: number) => {
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      if (appear < 1) {
        appear = Math.min(1, appear + dt / 0.55);
        spin.scale.setScalar(0.88 + 0.12 * (1 - (1 - appear) ** 3)); // ease-out cubic
      }
      if (!reduceMotion) {
        spin.rotation.y += SPIN * dt;
        spin.position.y = Math.sin(t * 0.8) * 0.025;
        // Swap marks at the instant the current one is side-on (and thinnest).
        const edge = edgeIndex(spin.rotation.y);
        if (edge !== lastEdge && models.length > 1) {
          models[current].visible = false;
          current = (current + 1) % models.length;
          models[current].visible = true;
        }
        lastEdge = edge;
      }
      renderer.render(scene, camera);
    };

    // Same flicker-free contract as DeviceStage: redraw synchronously after any resize.
    let running = false;
    const sync = () => {
      const sized = resize();
      if (sized) renderer.render(scene, camera);
      const shouldRun = sized && !document.hidden;
      if (shouldRun && !running) {
        timer.reset();
        renderer.setAnimationLoop(tick);
      } else if (!shouldRun && running) {
        renderer.setAnimationLoop(null);
      }
      running = shouldRun;
    };
    syncRef.current = sync;
    const ro = new ResizeObserver(sync);
    ro.observe(host);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      loadToken++;
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      renderer.setAnimationLoop(null);
      clearModels();
      floorGeo.dispose();
      floorMat.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      syncRef.current = null;
      setModelsRef.current = null;
    };
  }, []);

  useEffect(() => {
    setModelsRef.current?.(urlsKey ? urlsKey.split("|") : []);
  }, [urlsKey]);

  useEffect(() => {
    syncRef.current?.();
  }, [scale]);

  if (failed) return null;
  return <div ref={hostRef} className={`${s.stage} ${s.still}`} role="img" aria-label={`${alt} — 3D model`} />;
}
