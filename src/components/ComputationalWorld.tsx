"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Material, Mesh, Object3D } from "three";

type Three = typeof import("three");
type MotionState = { paused: boolean };
type Controls = { setPaused: (paused: boolean) => void };

type Beam = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  rotation?: [number, number, number];
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function makeInstancedBeams(
  THREE: Three,
  scene: InstanceType<Three["Scene"]>,
  geometry: InstanceType<Three["BoxGeometry"]>,
  material: InstanceType<Three["MeshStandardMaterial"]>,
  beams: Beam[],
) {
  const mesh = new THREE.InstancedMesh(geometry, material, beams.length);
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();

  beams.forEach((beam, index) => {
    position.set(beam.x, beam.y, beam.z);
    scale.set(beam.width, beam.height, beam.depth);
    quaternion.setFromEuler(
      new THREE.Euler(...(beam.rotation ?? [0, 0, 0])),
    );
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
    mesh.setColorAt(index, new THREE.Color(beam.color));
  });

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  scene.add(mesh);
  return mesh;
}

function createWorld(THREE: Three, container: HTMLDivElement, motion: MotionState) {
  const scene = new THREE.Scene();
  const voidColor = new THREE.Color(0x080a09);
  scene.background = voidColor;
  scene.fog = new THREE.FogExp2(voidColor, 0.0135);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 125);
  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: window.devicePixelRatio < 2,
    powerPreference: "low-power",
    stencil: false,
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(voidColor, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.className = "world-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xb7c7ae, 0x141812, 1.4));
  const sun = new THREE.DirectionalLight(0xe0e8d8, 2.35);
  sun.position.set(-8, 17, 12);
  scene.add(sun);

  const signalLight = new THREE.PointLight(0xc8ed78, 44, 47, 2);
  signalLight.position.set(1.5, 2.2, -13);
  scene.add(signalLight);
  const foundryLight = new THREE.PointLight(0xd88e61, 31, 34, 2);
  foundryLight.position.set(-10, 2.8, -30);
  scene.add(foundryLight);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x11180f,
    emissiveIntensity: 0.34,
    metalness: 0.48,
    roughness: 0.48,
  });
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x11180f,
    emissiveIntensity: 0.24,
    metalness: 0.62,
    roughness: 0.36,
  });

  const pillars: Beam[] = [];
  const spans: Beam[] = [];
  const monoliths: Beam[] = [];
  const nodes: Beam[] = [];

  // A dense, irregular scaffold gives the landscape the scale of a system,
  // rather than the silhouette of a single object.
  for (let row = 0; row < 31; row += 1) {
    const z = 27 - row * 3.05;
    const sway = Math.sin(row * 0.43) * 0.38;

    for (let lane = -5; lane <= 5; lane += 1) {
      const sample = seeded(row * 31 + lane + 170);
      if (sample < 0.12) continue;

      const x = lane * 2.72 + sway + (seeded(row * 19 + lane + 89) - 0.5) * 0.62;
      const height = 2.6 + seeded(row * 71 + lane + 301) * 5.6;
      const width = 0.12 + seeded(row * 53 + lane + 411) * 0.2;
      const warm = seeded(row * 67 + lane + 523) > 0.89;
      const color = warm ? 0x604a3a : sample > 0.72 ? 0x4c6049 : 0x303b32;

      pillars.push({
        x,
        y: -2.15 + height / 2,
        z,
        width,
        height,
        depth: width * 0.92,
        color,
      });

      if ((row + lane + 15) % 3 === 0) {
        const deckY = -0.3 + seeded(row * 29 + lane + 171) * 2.6;
        spans.push({
          x,
          y: deckY,
          z,
          width: 2.72,
          height: 0.1 + sample * 0.055,
          depth: 0.16,
          color: warm ? 0x73513b : 0x4b5847,
        });
      }

      if ((row * 5 + lane + 28) % 7 === 0) {
        nodes.push({
          x,
          y: -1.9 + height,
          z,
          width: 0.12,
          height: 0.12,
          depth: 0.12,
          color: seeded(row * 13 + lane + 701) > 0.5 ? 0xc9f078 : 0xd38a5e,
        });
      }
    }

    if (row % 2 === 0) {
      const height = 1.5 + seeded(row + 992) * 1.7;
      for (let segment = -4; segment <= 4; segment += 1) {
        if (Math.abs(segment) === 1 && row % 4 !== 0) continue;
        spans.push({
          x: segment * 3.85,
          y: height,
          z: z - 0.5,
          width: segment === 0 ? 2.95 : 3.8,
          height: 0.12,
          depth: 0.2,
          color: row % 6 === 0 ? 0x58674e : 0x354037,
        });
      }
    }
  }

  // Monumental portal beams slip past the frame as the camera moves through
  // the field. Their changing widths make the scale read immediately.
  for (let gate = 0; gate < 9; gate += 1) {
    const z = 22 - gate * 10.4;
    const width = 19 + Math.sin(gate * 0.9) * 4;
    const height = 8.6 + Math.cos(gate * 0.7) * 1.1;
    const tint = gate % 3 === 1 ? 0x4b5547 : 0x333d35;

    for (const side of [-1, 1]) {
      monoliths.push({
        x: side * width * 0.47,
        y: 1.75,
        z,
        width: 0.62,
        height: height + 4.6,
        depth: 0.86,
        color: tint,
        rotation: [0, 0, side * -0.035],
      });
      monoliths.push({
        x: side * (width * 0.47 - 1.1),
        y: 1.25,
        z: z + 0.2,
        width: 0.13,
        height: height + 3.5,
        depth: 0.16,
        color: gate % 2 === 0 ? 0x6c805a : 0x77533b,
      });
    }

    monoliths.push({
      x: 0,
      y: height + 3.95,
      z,
      width,
      height: 0.75,
      depth: 1.15,
      color: tint,
    });
    monoliths.push({
      x: 0,
      y: height + 3.49,
      z: z - 0.12,
      width: width * 0.72,
      height: 0.075,
      depth: 0.08,
      color: gate % 2 === 0 ? 0x9bae74 : 0xb77b54,
    });
  }

  // A few broken, close-to-camera structures frame the view like fragments
  // of a much larger machine hall.
  monoliths.push(
    {
      x: -17,
      y: 4.1,
      z: 5,
      width: 16,
      height: 1.15,
      depth: 3.4,
      color: 0x242d26,
      rotation: [0, 0, -0.12],
    },
    {
      x: 17,
      y: 8.2,
      z: -8,
      width: 12,
      height: 0.8,
      depth: 2.7,
      color: 0x283129,
      rotation: [0, 0, 0.08],
    },
    {
      x: -15.5,
      y: -0.3,
      z: 12,
      width: 0.85,
      height: 8.2,
      depth: 2.3,
      color: 0x2b342c,
      rotation: [0, 0, -0.045],
    },
  );

  makeInstancedBeams(THREE, scene, box, stoneMaterial, pillars);
  makeInstancedBeams(THREE, scene, box, deckMaterial, spans);
  makeInstancedBeams(THREE, scene, box, stoneMaterial, monoliths);
  makeInstancedBeams(THREE, scene, box, deckMaterial, nodes);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(82, 122),
    new THREE.MeshStandardMaterial({
      color: 0x111511,
      metalness: 0.36,
      roughness: 0.72,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -2.22, -19);
  scene.add(ground);

  const gridPositions: number[] = [];
  for (let x = -34; x <= 34; x += 1.7) {
    gridPositions.push(x, -2.195, 37, x, -2.195, -79);
  }
  for (let z = -78; z <= 36; z += 1.8) {
    gridPositions.push(-37, -2.194, z, 37, -2.194, z);
  }
  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(gridPositions, 3),
  );
  const grid = new THREE.LineSegments(
    gridGeometry,
    new THREE.LineBasicMaterial({
      color: 0x65765e,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
  );
  scene.add(grid);

  const routeMaterials = [
    new THREE.MeshBasicMaterial({
      color: 0xc7ef7b,
      transparent: true,
      opacity: 0.73,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xc27b52,
      transparent: true,
      opacity: 0.54,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x9dad93,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  ];

  for (let route = 0; route < 3; route += 1) {
    const points: InstanceType<Three["Vector3"]>[] = [];
    for (let point = 0; point <= 64; point += 1) {
      const progress = point / 64;
      const z = 33 - progress * 103;
      const wave = Math.sin(progress * Math.PI * 7 + route * 1.55);
      const x = (route - 1) * 1.05 + wave * (0.7 + progress * 1.4);
      const y = -1.86 + Math.sin(progress * Math.PI * 4 + route) * 0.18;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const signalPath = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 240, route === 0 ? 0.024 : 0.014, 4, false),
      routeMaterials[route],
    );
    scene.add(signalPath);
  }

  // Further down the route, rigid lanes begin to braid into a large,
  // measured field of curves: a visual cue for exploration, not a claim of
  // finished AI products.
  for (let strand = 0; strand < 9; strand += 1) {
    const points: InstanceType<Three["Vector3"]>[] = [];
    const phase = strand * (Math.PI * 2 / 9);
    for (let point = 0; point <= 92; point += 1) {
      const progress = point / 92;
      const z = -28 - progress * 45;
      const envelope = 1.5 + progress * 6.5;
      const x = Math.sin(progress * Math.PI * 3.1 + phase) * envelope;
      const y = 1.3 + Math.cos(progress * Math.PI * 2.3 + phase) * (1.1 + progress * 2.6);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const strandMaterial = new THREE.LineBasicMaterial({
      color: strand % 4 === 0 ? 0xbccf87 : strand % 4 === 1 ? 0x9a6748 : 0x536450,
      transparent: true,
      opacity: strand % 4 === 0 ? 0.44 : 0.23,
      depthWrite: false,
    });
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(240)),
        strandMaterial,
      ),
    );
  }

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const lowCoreCount = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const particleCount = mobileQuery.matches ? 480 : lowCoreCount ? 780 : 1450;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleSpeeds = new Float32Array(particleCount);
  const particlePhases = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);
  const verdigris = new THREE.Color(0x84957c);
  const lime = new THREE.Color(0xd0f17e);
  const copper = new THREE.Color(0xb47b57);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    const xSeed = seeded(index + 13);
    const ySeed = seeded(index + 201);
    const zSeed = seeded(index + 431);
    const accent = seeded(index + 811);
    const tint = accent > 0.91 ? copper : verdigris.clone().lerp(lime, accent * 0.34);
    particlePositions[offset] = (xSeed * 2 - 1) * (8 + ySeed * 13);
    particlePositions[offset + 1] = -1.2 + ySeed * 12.2;
    particlePositions[offset + 2] = 33 - zSeed * 104;
    particleSizes[index] = 0.8 + seeded(index + 37) * 1.8;
    particleSpeeds[index] = 0.35 + seeded(index + 119) * 1.1;
    particlePhases[index] = seeded(index + 673);
    particleColors[offset] = tint.r;
    particleColors[offset + 1] = tint.g;
    particleColors[offset + 2] = tint.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(particleSizes, 1));
  particleGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(particleSpeeds, 1));
  particleGeometry.setAttribute("aPhase", new THREE.BufferAttribute(particlePhases, 1));
  particleGeometry.setAttribute("aTint", new THREE.BufferAttribute(particleColors, 3));
  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aSize;
      attribute float aSpeed;
      attribute float aPhase;
      attribute vec3 aTint;
      uniform float uTime;
      varying vec3 vTint;
      varying float vAlpha;

      void main() {
        vec3 point = position;
        float travel = mod(uTime * aSpeed + aPhase * 104.0, 104.0);
        point.z = 33.0 - travel;
        point.x += sin(uTime * 0.16 + aPhase * 7.0) * 0.11;
        point.y += sin(uTime * 0.2 + aPhase * 10.0) * 0.08;
        vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
        gl_Position = projectionMatrix * viewPoint;
        gl_PointSize = aSize * (105.0 / max(1.0, -viewPoint.z));
        vTint = aTint;
        vAlpha = 0.2 + 0.3 * sin(aPhase * 6.2831853 + uTime * 0.7);
      }
    `,
    fragmentShader: `
      varying vec3 vTint;
      varying float vAlpha;

      void main() {
        float radius = length(gl_PointCoord - 0.5);
        float halo = 1.0 - smoothstep(0.08, 0.5, radius);
        float center = 1.0 - smoothstep(0.0, 0.14, radius);
        gl_FragColor = vec4(vTint, (halo * 0.13 + center * 0.48) * vAlpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.frustumCulled = false;
  scene.add(particles);

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedMotion = { value: motionPreference.matches };
  const scroll = { target: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let disposed = false;
  let contextAvailable = true;
  let shadersReady = false;

  const resize = () => {
    const bounds = container.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;

    const pixelRatio = mobileQuery.matches ? 0.82 : lowCoreCount ? 1 : 1.28;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobileQuery.matches ? 51 : 46;
    camera.updateProjectionMatrix();
    render(performance.now(), true);
  };

  const updateCamera = (snap = false) => {
    const progress = reducedMotion.value ? 0 : scroll.target;
    const targetZ = 20 - progress * 67;
    const targetX = pointer.x * 0.78;
    const targetY = 6.9 + pointer.y * 0.44;
    const ease = snap || motion.paused || reducedMotion.value ? 1 : 0.038;

    camera.position.x += (targetX - camera.position.x) * ease;
    camera.position.y += (targetY - camera.position.y) * ease;
    camera.position.z += (targetZ - camera.position.z) * ease;
    camera.lookAt(pointer.x * 0.18, 0.5 + pointer.y * 0.1, camera.position.z - 29);
  };

  const render = (time: number, snap = false) => {
    if (disposed || !contextAvailable || !shadersReady || !width || !height) return;
    if (!motion.paused && !reducedMotion.value) {
      elapsed = time * 0.001;
      particleMaterial.uniforms.uTime.value = elapsed;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
    }
    updateCamera(snap);
    renderer.render(scene, camera);
    container.dataset.ready = "true";
  };

  const animate = (time: number) => {
    if (disposed || !contextAvailable) return;
    if (time - lastFrame >= 1000 / 30) {
      lastFrame = time;
      render(time);
    }
    if (!motion.paused && !reducedMotion.value && !document.hidden) {
      frame = window.requestAnimationFrame(animate);
    }
  };

  const start = () => {
    window.cancelAnimationFrame(frame);
    if (disposed || !contextAvailable || document.hidden) return;
    if (motion.paused || reducedMotion.value) {
      render(performance.now(), true);
      return;
    }
    frame = window.requestAnimationFrame(animate);
  };

  const readScroll = () => {
    if (reducedMotion.value) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    scroll.target = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    if (motion.paused) render(performance.now(), true);
  };

  const readPointer = (event: PointerEvent) => {
    if (reducedMotion.value || motion.paused || event.pointerType !== "mouse") return;
    pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const clearPointer = () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  };

  const handleMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion.value = event.matches;
    if (event.matches) {
      pointer.targetX = 0;
      pointer.targetY = 0;
    }
    start();
  };

  const handleVisibility = () => start();
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    contextAvailable = false;
    window.cancelAnimationFrame(frame);
    container.dataset.ready = "false";
  };
  const handleContextRestored = () => {
    contextAvailable = true;
    start();
  };

  renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("pointermove", readPointer, { passive: true });
  window.addEventListener("blur", clearPointer);
  motionPreference.addEventListener("change", handleMotionChange);
  document.addEventListener("visibilitychange", handleVisibility);
  readScroll();
  resize();
  void renderer
    .compileAsync(scene, camera)
    .then(() => {
      if (disposed) return;
      shadersReady = true;
      render(performance.now(), true);
      start();
    })
    .catch(() => {
      // Keep the pre-rendered field illustration if shader compilation fails.
      contextAvailable = false;
      container.dataset.ready = "false";
    });

  const controls: Controls = {
    setPaused(paused) {
      motion.paused = paused;
      start();
    },
  };

  return {
    controls,
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", readPointer);
      window.removeEventListener("blur", clearPointer);
      motionPreference.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);

      const geometries = new Set<BufferGeometry>();
      const materials = new Set<Material>();
      scene.traverse((object: Object3D) => {
        const renderable = object as Mesh;
        if (renderable.geometry) geometries.add(renderable.geometry);
        if (Array.isArray(renderable.material)) {
          renderable.material.forEach((material) => materials.add(material));
        } else if (renderable.material) {
          materials.add(renderable.material);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      container.removeAttribute("data-ready");
    },
  };
}

export default function ComputationalWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const motionRef = useRef<MotionState>({ paused: false });
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = (event?: MediaQueryListEvent) => {
      setReducedMotion(event?.matches ?? preference.matches);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    void import("three")
      .then((THREE) => {
        if (cancelled) return;
        const world = createWorld(THREE, container, motionRef.current);
        controlsRef.current = world.controls;
        dispose = world.dispose;
      })
      .catch(() => {
        // The bundled SVG fallback remains visible if WebGL cannot start.
      });

    return () => {
      cancelled = true;
      controlsRef.current = null;
      dispose?.();
    };
  }, []);

  const toggleMotion = () => {
    setPaused((current) => {
      const next = !current;
      motionRef.current.paused = next;
      controlsRef.current?.setPaused(next);
      return next;
    });
  };

  return (
    <>
      <div className="computational-world" ref={containerRef}>
        <svg className="world-fallback" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="world-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#172019" stopOpacity="0" />
              <stop offset="0.4" stopColor="#111811" stopOpacity=".84" />
              <stop offset="1" stopColor="#080a09" />
            </linearGradient>
            <radialGradient id="world-signal">
              <stop stopColor="#c8ed78" stopOpacity=".26" />
              <stop offset="1" stopColor="#c8ed78" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="900" fill="#080a09" />
          <ellipse cx="930" cy="475" rx="680" ry="400" fill="url(#world-signal)" />
          <path d="M0 900 450 485h540L1440 900Z" fill="url(#world-floor)" />
          <g fill="none" stroke="#65765e" strokeOpacity=".24" strokeWidth="1">
            <path d="M720 456 30 900M720 456 190 900M720 456 350 900M720 456 520 900M720 456 720 900M720 456 900 900M720 456 1090 900M720 456 1260 900M720 456 1440 900" />
            <path d="M605 500h230M530 548h380M454 602h530M365 664h710M260 734h920M140 814h1160" />
          </g>
          <g fill="#273329" stroke="#607057" strokeOpacity=".7">
            <path d="M55 345h45v308H55zM310 260h30v296h-30zM1090 224h52v404h-52zM1318 310h38v332h-38z" />
            <path d="M65 345h1010v24H65zM322 260h1030v22H322zM85 632h1050v18H85z" />
            <path d="M402 372h420v24H402zM667 284h24v337h-24z" fill="#344236" />
          </g>
          <g fill="none" stroke="#c8ed78" strokeOpacity=".58" strokeWidth="2">
            <path d="M0 543h490l82 45h212l100-72h230l110 61h216" />
            <path d="M0 566h388l91 49h203l89-58h253" stroke="#bb7951" strokeOpacity=".5" />
          </g>
          <g fill="#d0f17e">
            <circle cx="488" cy="543" r="3" /><circle cx="783" cy="588" r="3" />
            <circle cx="1037" cy="516" r="3" /><circle cx="1172" cy="577" r="3" />
          </g>
        </svg>
      </div>
      <button
        className="world-motion-control"
        type="button"
        aria-label={paused ? "Resume ambient scene motion" : "Pause ambient scene motion"}
        aria-pressed={!paused && !reducedMotion}
        onClick={toggleMotion}
      >
        <span className={paused ? "world-motion-indicator is-paused" : "world-motion-indicator"} aria-hidden="true" />
        Scene motion <span>{paused ? "paused" : reducedMotion ? "reduced" : "live"}</span>
      </button>
    </>
  );
}
