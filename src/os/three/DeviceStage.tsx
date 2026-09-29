import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { DeviceRig } from "./deviceKit";
import { buildLaptop } from "./laptopModel";
import { buildPhone } from "./phoneModel";
import s from "./Stage.module.css";

const AUTO_SPIN = 0.42; // rad/s — one turn every ~15s
const FRONT_ANGLE = -0.5; // resting three-quarter view when a new screen loads

export type DeviceKind = "phone" | "laptop";
const BUILDERS: Record<DeviceKind, () => DeviceRig> = { phone: buildPhone, laptop: buildLaptop };

interface DeviceStageProps {
  device: DeviceKind;
  /** Screenshot to bind to the display (portrait for phones, landscape for laptops). */
  screen: string;
  /** The OS screen's CSS scale, so the canvas renders at true device resolution. */
  scale: number;
  alt: string;
}

/**
 * A device on a white studio sweep: slowly spinning (drag to turn it), leaned like a product shot,
 * with a soft floor shadow. One WebGL context per mount — switching projects on the same device only
 * swaps the screen texture. Mount it keyed by `device` so a phone↔laptop change rebuilds the scene.
 */
export default function DeviceStage({ device, screen, scale, alt }: DeviceStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<DeviceRig | null>(null);
  const spinRef = useRef({ angle: FRONT_ANGLE, velocity: AUTO_SPIN, dragging: false, lastX: 0 });
  const scaleRef = useRef(scale);
  /** Draws one frame on demand (e.g. when a texture lands while the loop is paused). */
  const redrawRef = useRef<(() => void) | null>(null);
  /** Re-measures and redraws; also called when the OS screen's scale changes. */
  const syncRef = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);
  scaleRef.current = scale;

  // Scene, renderer and loop — created once per device.
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
    renderer.shadowMap.type = THREE.VSMShadowMap; // VSM gives the soft, blurred studio shadow
    renderer.domElement.className = s.canvas;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const rig = BUILDERS[device]();
    rigRef.current = rig;
    const { framing } = rig;

    // Overhead key light doubles as the shadow caster; a cool fill keeps the white-sweep look neutral.
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(0.5, 5, 1.3); // near-overhead so the shadow pools under the device
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 24;
    key.shadow.blurSamples = 24;
    key.shadow.bias = -0.0005;
    // The floor must sit entirely inside the shadow camera, or its frustum edge shows as a line.
    Object.assign(key.shadow.camera, { left: -2.4, right: 2.4, top: 2.4, bottom: -2.4, near: 0.5, far: 10 });
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6);
    fill.position.set(-3, 1, 2);
    scene.add(key, fill);

    // Invisible floor that only shows the shadow.
    const floorGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = framing.floorY;
    floor.receiveShadow = true;
    scene.add(floor);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);

    rig.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
    const tilt = new THREE.Group();
    tilt.rotation.set(framing.tilt.x, 0, framing.tilt.z);
    tilt.add(rig.group);
    scene.add(tilt);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spin = spinRef.current;
    const timer = new THREE.Timer();

    // Only touch the drawing buffer when something actually changed: resizing a canvas clears it,
    // and setPixelRatio() reallocates it even when the value is the same.
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
      // Frame the device plus its shadow; the camera sits a little high, looking down onto the floor.
      const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(framing.fitH / (2 * halfFov), framing.fitW / (2 * halfFov * camera.aspect));
      camera.position.set(0, dist * framing.cameraRise, dist);
      camera.lookAt(0, framing.lookY, 0);
      camera.updateProjectionMatrix();
      return true;
    };

    const tick = (timestamp?: number) => {
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      if (!spin.dragging) {
        // Ease any flick back toward the gentle auto-spin.
        const target = reduceMotion ? 0 : AUTO_SPIN;
        spin.velocity += (target - spin.velocity) * Math.min(dt * 1.5, 1);
        spin.angle += spin.velocity * dt;
      }
      rig.group.rotation.y = spin.angle;
      rig.group.rotation.x = reduceMotion ? 0 : Math.sin(t * 0.5) * 0.03;
      rig.group.position.y = reduceMotion ? 0 : Math.sin(t * 0.8) * 0.02;
      renderer.render(scene, camera);
    };

    // Always keep the canvas sized with a current frame; only the loop pauses while the tab is
    // hidden or the window is minimised (0×0), so nothing burns GPU off-screen.
    let running = false;
    const sync = () => {
      const sized = resize();
      // Redraw right away, even mid-loop: ResizeObserver fires after this frame's animation callback,
      // so a resized (= cleared) canvas would otherwise be painted blank for a frame — the flicker.
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
    redrawRef.current = () => {
      rig.group.rotation.y = spin.angle;
      renderer.render(scene, camera);
    };
    syncRef.current = sync;
    const ro = new ResizeObserver(sync);
    ro.observe(host);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      renderer.setAnimationLoop(null);
      rig.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      rigRef.current = null;
      redrawRef.current = null;
      syncRef.current = null;
    };
  }, [device]);

  // The OS screen is CSS-scaled; when the iframe resizes, the canvas's layout size is unchanged but
  // its on-screen size isn't — re-render at the new pixel ratio so the device stays crisp.
  useEffect(() => {
    syncRef.current?.();
  }, [scale]);

  // Swap the screenshot and turn the device to face the viewer.
  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(screen, (tex) => {
      if (cancelled || !rigRef.current) return tex.dispose();
      rigRef.current.setScreen(tex);
      spinRef.current.angle = FRONT_ANGLE;
      spinRef.current.velocity = AUTO_SPIN;
      redrawRef.current?.();
    });
    return () => {
      cancelled = true;
    };
  }, [screen, device]);

  // Drag to spin, with a little inertia on release.
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    Object.assign(spinRef.current, { dragging: true, lastX: e.clientX, velocity: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const spin = spinRef.current;
    if (!spin.dragging) return;
    const dx = (e.clientX - spin.lastX) / scaleRef.current;
    spin.lastX = e.clientX;
    spin.angle += dx * 0.012;
    spin.velocity = dx * 0.6;
  };
  const endDrag = () => {
    spinRef.current.dragging = false;
  };

  if (failed) return <img className={s.fallback} src={screen} alt={alt} />;

  return (
    <div
      ref={hostRef}
      className={s.stage}
      role="img"
      aria-label={`${alt} — 3D ${device} showing the project. Drag to rotate.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    />
  );
}
