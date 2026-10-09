"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Group, Material, Mesh, Vector3 } from "three";

const LAYER_NAMES = ["Interface", "Routing", "APIs", "Data", "Intelligence"] as const;
const LAYER_COUNT = LAYER_NAMES.length;
const NODE_COLUMNS = 7;
const NODE_ROWS = 3;
const LAYER_GAP = 0.84;
const DECK_WIDTH = 3.72;
const DECK_DEPTH = 1.26;
const DECK_THICKNESS = 0.035;
const FIELD_PARTICLE_COUNT = 1400;

const layerX = [0.02, -0.07, 0.09, -0.06, 0.03];
const layerZ = [0.02, -0.05, 0.06, -0.035, 0.015];

type StackNode = {
  layer: number;
  column: number;
  row: number;
  x: number;
  z: number;
  signal: boolean;
};

type RouteAnchor = { layer: number; x: number; z: number };

const nodes: StackNode[] = [];
const nodeIndex = new Map<string, number>();

for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
  for (let row = 0; row < NODE_ROWS; row += 1) {
    for (let column = 0; column < NODE_COLUMNS; column += 1) {
      const key = `${layer}:${row}:${column}`;
      nodeIndex.set(key, nodes.length);
      nodes.push({
        layer,
        row,
        column,
        x: -1.5 + column * 0.5,
        z: -0.41 + row * 0.41,
        signal: (column + row * 2 + layer) % 8 === 0 || (column === 3 && row === 1),
      });
    }
  }
}

const edges: Array<[number, number]> = [];

for (const node of nodes) {
  const from = nodeIndex.get(`${node.layer}:${node.row}:${node.column}`)!;
  if (node.column < NODE_COLUMNS - 1) {
    edges.push([from, nodeIndex.get(`${node.layer}:${node.row}:${node.column + 1}`)!]);
  }
  if (node.row < NODE_ROWS - 1 && node.column % 2 === 0) {
    edges.push([from, nodeIndex.get(`${node.layer}:${node.row + 1}:${node.column}`)!]);
  }
  if (node.layer < LAYER_COUNT - 1 && node.row === 1 && (node.column === 1 || node.column === 5)) {
    edges.push([from, nodeIndex.get(`${node.layer + 1}:${node.row}:${node.column}`)!]);
  }
}

const routeAnchors: RouteAnchor[] = [{ layer: 0, x: -1.59, z: DECK_DEPTH * 0.39 }];

for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
  const endX = layer % 2 === 0 ? 1.59 : -1.59;
  routeAnchors.push({ layer, x: endX, z: DECK_DEPTH * 0.39 });
  if (layer < LAYER_COUNT - 1) {
    routeAnchors.push({ layer: layer + 1, x: endX, z: DECK_DEPTH * 0.39 });
  }
}

const seededValue = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

function createFallbackDecks() {
  return LAYER_NAMES.map((name, layer) => {
    const top = 48 + layer * 105;
    const offset = layer % 2 === 0 ? -5 : 9;
    const cells = Array.from({ length: 15 }, (_, index) => {
      const column = index % 5;
      const row = Math.floor(index / 5);
      const signal = (index + layer * 2) % 6 === 0;
      return {
        x: 208 + column * 47,
        y: top + 14 + row * 12,
        signal,
      };
    });

    return { name, top, offset, cells };
  });
}

const fallbackDecks = createFallbackDecks();

type Three = typeof import("three");

function createSystemScene(THREE: Three, container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0, 8.1);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "three-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const sceneRoot = new THREE.Group();
  scene.add(sceneRoot);
  scene.add(new THREE.AmbientLight(0x9cad8f, 1.05));

  const keyLight = new THREE.PointLight(0xceff3d, 20, 15, 1.8);
  keyLight.position.set(-3.5, 3.4, 4.6);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xe0e9dc, 12, 14, 1.8);
  fillLight.position.set(3.2, -1.2, 3.4);
  scene.add(fillLight);

  const deckGeometry = new THREE.BoxGeometry(DECK_WIDTH, DECK_THICKNESS, DECK_DEPTH);
  const deckEdgesGeometry = new THREE.EdgesGeometry(deckGeometry);
  const nodeGeometry = new THREE.BoxGeometry(0.052, 0.032, 0.052);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x17220d,
    emissiveIntensity: 0.45,
    metalness: 0.14,
    roughness: 0.32,
    vertexColors: true,
    toneMapped: false,
  });
  const signalMaterial = new THREE.MeshBasicMaterial({
    color: 0xceff3d,
    toneMapped: false,
  });
  const deckGroups: Group[] = [];
  const disposableGeometries = new Set<BufferGeometry>([deckGeometry, deckEdgesGeometry, nodeGeometry]);
  const disposableMaterials = new Set<Material>([nodeMaterial, signalMaterial]);
  const identity = new THREE.Quaternion();
  const instanceMatrix = new THREE.Matrix4();
  const instanceScale = new THREE.Vector3(1, 1, 1);

  const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodes.length);
  nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  nodeMesh.frustumCulled = false;
  nodes.forEach((node, index) => {
    nodeMesh.setColorAt(index, new THREE.Color(node.signal ? 0xceff3d : 0xb9c8b6));
    instanceMatrix.makeTranslation(
      node.x + layerX[node.layer],
      (2 - node.layer) * LAYER_GAP + DECK_THICKNESS * 0.5 + 0.035,
      node.z + layerZ[node.layer],
    );
    instanceScale.setScalar(node.signal ? 1.45 : 1);
    nodeMesh.setMatrixAt(index, instanceMatrix);
  });
  if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;
  sceneRoot.add(nodeMesh);

  const worldNodePositions = nodes.map(() => new THREE.Vector3());

  for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
    const layerGroup = new THREE.Group();
    const y = (2 - layer) * LAYER_GAP;
    layerGroup.position.set(layerX[layer], y, layerZ[layer]);
    sceneRoot.add(layerGroup);
    deckGroups.push(layerGroup);

    const deckMaterial = new THREE.MeshStandardMaterial({
      color: layer === 2 ? 0x18231a : 0x111713,
      emissive: layer === 2 ? 0x101d0c : 0x071008,
      emissiveIntensity: 0.38,
      metalness: 0.64,
      roughness: 0.31,
      toneMapped: false,
    });
    const deckSurface = new THREE.Mesh(deckGeometry, deckMaterial);
    deckSurface.receiveShadow = true;
    deckSurface.position.y = -0.005;
    layerGroup.add(deckSurface);
    disposableMaterials.add(deckMaterial);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: layer === 2 ? 0xceff3d : 0x81927b,
      transparent: true,
      opacity: layer === 2 ? 0.72 : 0.38,
      toneMapped: false,
    });
    const edgeMesh = new THREE.LineSegments(deckEdgesGeometry, edgeMaterial);
    edgeMesh.position.y = -0.005;
    layerGroup.add(edgeMesh);
    disposableMaterials.add(edgeMaterial);

    const gridPoints: Vector3[] = [];
    const topY = DECK_THICKNESS * 0.5 + 0.003;
    for (let column = 1; column < NODE_COLUMNS; column += 1) {
      const x = -DECK_WIDTH * 0.5 + (DECK_WIDTH / NODE_COLUMNS) * column;
      gridPoints.push(new THREE.Vector3(x, topY, -DECK_DEPTH * 0.5 + 0.07));
      gridPoints.push(new THREE.Vector3(x, topY, DECK_DEPTH * 0.5 - 0.07));
    }
    for (let row = 1; row < NODE_ROWS + 1; row += 1) {
      const z = -DECK_DEPTH * 0.5 + (DECK_DEPTH / (NODE_ROWS + 1)) * row;
      gridPoints.push(new THREE.Vector3(-DECK_WIDTH * 0.5 + 0.08, topY, z));
      gridPoints.push(new THREE.Vector3(DECK_WIDTH * 0.5 - 0.08, topY, z));
    }
    const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x52664b,
      transparent: true,
      opacity: 0.34,
      toneMapped: false,
    });
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    layerGroup.add(grid);
    disposableMaterials.add(gridMaterial);
  }

  const connectionPositions = new Float32Array(edges.length * 6);
  const connectionGeometry = new THREE.BufferGeometry();
  const connectionAttribute = new THREE.BufferAttribute(connectionPositions, 3);
  connectionAttribute.setUsage(THREE.DynamicDrawUsage);
  connectionGeometry.setAttribute("position", connectionAttribute);
  const connectionMaterial = new THREE.LineBasicMaterial({
    color: 0xb5c9aa,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    toneMapped: false,
  });
  const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
  connections.frustumCulled = false;
  sceneRoot.add(connections);
  disposableGeometries.add(connectionGeometry);
  disposableMaterials.add(connectionMaterial);

  const routePositions = new Float32Array(routeAnchors.length * 3);
  const routeGeometry = new THREE.BufferGeometry();
  const routeAttribute = new THREE.BufferAttribute(routePositions, 3);
  routeAttribute.setUsage(THREE.DynamicDrawUsage);
  routeGeometry.setAttribute("position", routeAttribute);
  const routeMaterial = new THREE.LineBasicMaterial({
    color: 0xceff3d,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    toneMapped: false,
  });
  const route = new THREE.Line(routeGeometry, routeMaterial);
  route.frustumCulled = false;
  sceneRoot.add(route);
  disposableGeometries.add(routeGeometry);
  disposableMaterials.add(routeMaterial);

  const signalGeometry = new THREE.BoxGeometry(0.082, 0.082, 0.082);
  const signalMesh = new THREE.InstancedMesh(signalGeometry, signalMaterial, 7);
  signalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  signalMesh.frustumCulled = false;
  sceneRoot.add(signalMesh);
  disposableGeometries.add(signalGeometry);

  const coreGeometry = new THREE.BoxGeometry(0.14, 0.14, 0.14);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xd8ff77,
    wireframe: true,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.set(0, 0, DECK_DEPTH * 0.5 + 0.12);
  sceneRoot.add(core);
  disposableGeometries.add(coreGeometry);
  disposableMaterials.add(coreMaterial);

  const fieldPositions = new Float32Array(FIELD_PARTICLE_COUNT * 3);
  const fieldSizes = new Float32Array(FIELD_PARTICLE_COUNT);
  const fieldPhases = new Float32Array(FIELD_PARTICLE_COUNT);
  const fieldLayers = new Float32Array(FIELD_PARTICLE_COUNT);
  const fieldTints = new Float32Array(FIELD_PARTICLE_COUNT * 3);
  const hazeTint = new THREE.Color(0x829a84);
  const signalTint = new THREE.Color(0xceff3d);

  for (let index = 0; index < FIELD_PARTICLE_COUNT; index += 1) {
    const layer = index % LAYER_COUNT;
    const localX = seededValue(index + 3) * (DECK_WIDTH - 0.12) - (DECK_WIDTH - 0.12) * 0.5;
    const localZ = seededValue(index + 71) * (DECK_DEPTH - 0.1) - (DECK_DEPTH - 0.1) * 0.5;
    const yJitter = (seededValue(index + 131) - 0.5) * 0.14;
    const phase = seededValue(index + 211);
    const accent = seededValue(index + 307) > 0.87;
    const tint = hazeTint.clone().lerp(signalTint, accent ? 0.84 + phase * 0.16 : phase * 0.1);
    const offset = index * 3;

    fieldPositions[offset] = localX + layerX[layer];
    fieldPositions[offset + 1] = (2 - layer) * LAYER_GAP + yJitter;
    fieldPositions[offset + 2] = localZ + layerZ[layer];
    fieldSizes[index] = 0.22 + seededValue(index + 419) * 0.54;
    fieldPhases[index] = phase;
    fieldLayers[index] = layer;
    fieldTints[offset] = tint.r;
    fieldTints[offset + 1] = tint.g;
    fieldTints[offset + 2] = tint.b;
  }

  const fieldGeometry = new THREE.BufferGeometry();
  fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
  fieldGeometry.setAttribute("aSize", new THREE.BufferAttribute(fieldSizes, 1));
  fieldGeometry.setAttribute("aPhase", new THREE.BufferAttribute(fieldPhases, 1));
  fieldGeometry.setAttribute("aLayer", new THREE.BufferAttribute(fieldLayers, 1));
  fieldGeometry.setAttribute("aTint", new THREE.BufferAttribute(fieldTints, 3));
  const fieldMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0.46 },
      uMorph: { value: 0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      attribute float aLayer;
      attribute vec3 aTint;
      uniform float uTime;
      uniform float uMorph;
      varying vec3 vTint;
      varying float vAlpha;

      void main() {
        vec3 point = position;
        float angle = point.x * 1.8 + aPhase * 5.5 + uTime * (0.13 + aPhase * 0.1);
        point.x += sin(angle) * 0.022;
        point.z += cos(angle * 1.2) * 0.018;
        point.y += sin(angle * 0.8 + aPhase * 4.0) * 0.018;

        float level = (2.0 - aLayer) * 0.84;
        float separation = ((mod(aLayer, 2.0) < 1.0) ? -1.0 : 1.0) * 0.11;
        point.y += level * uMorph * 0.42;
        point.x += separation * uMorph;

        vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
        gl_Position = projectionMatrix * viewPoint;
        gl_PointSize = aSize * (68.0 / max(1.0, -viewPoint.z));
        vTint = aTint;
        vAlpha = mix(0.12, 0.36, aPhase);
      }
    `,
    fragmentShader: `
      varying vec3 vTint;
      varying float vAlpha;

      void main() {
        vec2 centered = gl_PointCoord - vec2(0.5);
        float distanceFromCenter = length(centered);
        float halo = 1.0 - smoothstep(0.05, 0.5, distanceFromCenter);
        float core = 1.0 - smoothstep(0.0, 0.16, distanceFromCenter);
        float alpha = (halo * 0.18 + core * 0.62) * vAlpha;
        gl_FragColor = vec4(vTint, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const field = new THREE.Points(fieldGeometry, fieldMaterial);
  field.frustumCulled = false;
  field.renderOrder = 1;
  sceneRoot.add(field);
  disposableGeometries.add(fieldGeometry);
  disposableMaterials.add(fieldMaterial);

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
  const routePoints = routeAnchors.map(() => new THREE.Vector3());
  const reducedMotion = { value: motionPreference.matches };
  let width = 0;
  let height = 0;
  let scrollProgress = 0;
  let visible = true;
  let disposed = false;
  let frame = 0;
  let startTime = performance.now();

  const render = (time: number) => {
    if (disposed || !width || !height) return;

    const morph = reducedMotion.value
      ? 0
      : scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
    container.style.setProperty("--network-morph", morph.toFixed(3));
    const elapsed = reducedMotion.value ? 0.1 : (time - startTime) * 0.001;
    fieldMaterial.uniforms.uTime.value = reducedMotion.value ? 0.46 : elapsed;
    fieldMaterial.uniforms.uMorph.value = morph;
    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    sceneRoot.rotation.set(0.045 + pointer.y * 0.075, -0.18 + elapsed * 0.055 + pointer.x * (pointer.active ? 0.12 : 0), -0.018);

    for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
      const spread = 1 + morph * 0.36;
      const offset = ((layer % 2) * 2 - 1) * morph * 0.1;
      const y = (2 - layer) * LAYER_GAP * spread;
      deckGroups[layer].position.set(layerX[layer] + offset, y, layerZ[layer]);
    }

    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      const y = (2 - node.layer) * LAYER_GAP * (1 + morph * 0.36);
      const offset = ((node.layer % 2) * 2 - 1) * morph * 0.1;
      const point = worldNodePositions[index].set(
        node.x + layerX[node.layer] + offset,
        y + DECK_THICKNESS * 0.5 + 0.035,
        node.z + layerZ[node.layer],
      );
      const scale = node.signal ? 1.45 : 1;
      instanceScale.set(scale, scale, scale);
      instanceMatrix.compose(point, identity, instanceScale);
      nodeMesh.setMatrixAt(index, instanceMatrix);
    }
    nodeMesh.instanceMatrix.needsUpdate = true;

    edges.forEach(([from, to], index) => {
      const offset = index * 6;
      const a = worldNodePositions[from];
      const b = worldNodePositions[to];
      connectionPositions[offset] = a.x;
      connectionPositions[offset + 1] = a.y;
      connectionPositions[offset + 2] = a.z;
      connectionPositions[offset + 3] = b.x;
      connectionPositions[offset + 4] = b.y;
      connectionPositions[offset + 5] = b.z;
    });
    connectionAttribute.needsUpdate = true;

    let totalRouteLength = 0;
    const routeDistances = [0];
    routeAnchors.forEach((anchor, index) => {
      const layerY = (2 - anchor.layer) * LAYER_GAP * (1 + morph * 0.36);
      const layerOffset = ((anchor.layer % 2) * 2 - 1) * morph * 0.1;
      routePoints[index].set(
        anchor.x + layerX[anchor.layer] + layerOffset,
        layerY + DECK_THICKNESS * 0.5 + 0.035,
        anchor.z + layerZ[anchor.layer],
      );
      routePositions[index * 3] = routePoints[index].x;
      routePositions[index * 3 + 1] = routePoints[index].y;
      routePositions[index * 3 + 2] = routePoints[index].z;
      if (index > 0) {
        totalRouteLength += routePoints[index - 1].distanceTo(routePoints[index]);
        routeDistances.push(totalRouteLength);
      }
    });
    routeAttribute.needsUpdate = true;

    const packetCount = signalMesh.count;
    for (let packet = 0; packet < packetCount; packet += 1) {
      const progress = reducedMotion.value ? (packet + 1) / (packetCount + 1) : (elapsed * 0.16 + packet / packetCount) % 1;
      const distance = progress * totalRouteLength;
      let segment = 1;
      while (segment < routeDistances.length - 1 && routeDistances[segment] < distance) segment += 1;
      const segmentStart = routeDistances[segment - 1];
      const segmentLength = routeDistances[segment] - segmentStart;
      const segmentProgress = segmentLength > 0 ? (distance - segmentStart) / segmentLength : 0;
      const position = routePoints[segment - 1].clone().lerp(routePoints[segment], segmentProgress);
      instanceMatrix.makeTranslation(position.x, position.y + Math.sin(elapsed * 2 + packet) * 0.025, position.z + 0.012);
      signalMesh.setMatrixAt(packet, instanceMatrix);
    }
    signalMesh.instanceMatrix.needsUpdate = true;

    core.rotation.set(elapsed * 0.2, elapsed * 0.3, elapsed * 0.12);
    core.scale.setScalar(reducedMotion.value ? 1 : 1 + Math.sin(time * 0.0013) * 0.08);
    renderer.render(scene, camera);
    container.dataset.ready = "true";
  };

  const animate = (time: number) => {
    render(time);
    if (!reducedMotion.value && visible && !document.hidden && !disposed) {
      frame = window.requestAnimationFrame(animate);
    }
  };

  const start = () => {
    window.cancelAnimationFrame(frame);
    if (disposed || !visible || document.hidden) return;
    if (reducedMotion.value) {
      render(performance.now());
      return;
    }
    frame = window.requestAnimationFrame(animate);
  };

  const resize = () => {
    const bounds = container.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reducedMotion.value && visible && !document.hidden) render(performance.now());
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (reducedMotion.value || event.pointerType !== "mouse") return;
    const bounds = container.getBoundingClientRect();
    pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    pointer.active = true;
  };

  const handlePointerLeave = () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    pointer.active = false;
  };

  const handleScroll = () => {
    if (!reducedMotion.value) {
      scrollProgress = Math.max(0, Math.min(window.scrollY / (window.innerHeight * 0.68), 1));
    }
  };

  const handleMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion.value = event.matches;
    if (reducedMotion.value) {
      scrollProgress = 0;
      pointer.targetX = 0;
      pointer.targetY = 0;
    } else {
      startTime = performance.now();
    }
    start();
  };

  const handleVisibility = () => start();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  });
  visibilityObserver.observe(container);
  container.addEventListener("pointermove", handlePointerMove, { passive: true });
  container.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", resize);
  motionPreference.addEventListener("change", handleMotionChange);
  document.addEventListener("visibilitychange", handleVisibility);
  handleScroll();
  resize();
  start();

  return () => {
    disposed = true;
    window.cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    container.removeEventListener("pointermove", handlePointerMove);
    container.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", resize);
    motionPreference.removeEventListener("change", handleMotionChange);
    document.removeEventListener("visibilitychange", handleVisibility);
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    scene.traverse((object) => {
      const renderable = object as Mesh;
      if (renderable.geometry) geometries.add(renderable.geometry);
      if (Array.isArray(renderable.material)) renderable.material.forEach((material) => materials.add(material));
      else if (renderable.material) materials.add(renderable.material);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
    container.removeAttribute("data-ready");
  };
}

export default function SystemNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let disposeScene: (() => void) | undefined;

    void import("three")
      .then((THREE) => {
        if (disposed) return;
        disposeScene = createSystemScene(THREE, container);
      })
      .catch(() => {
        // The server-rendered SVG remains visible if WebGL is unavailable.
      });

    return () => {
      disposed = true;
      disposeScene?.();
    };
  }, []);

  return (
    <div
      className="network-scene"
      ref={containerRef}
      role="img"
      aria-label="A three-dimensional stack of connected interface, routing, API, data and intelligence layers, with a signal moving through the system"
    >
      <svg className="network-fallback" viewBox="0 0 600 600" aria-hidden="true">
        {fallbackDecks.map((deck) => (
          <g key={deck.name} transform={`translate(${deck.offset} 0)`}>
            <path className="network-fallback-deck" d={`M68 ${deck.top} H522 L500 ${deck.top + 62} H46 Z`} />
            <path className="network-fallback-face" d={`M46 ${deck.top + 62} H500 V${deck.top + 70} H46 Z`} />
            <path className="network-fallback-grid" d={`M138 ${deck.top} L116 ${deck.top + 62} M208 ${deck.top} L186 ${deck.top + 62} M278 ${deck.top} L256 ${deck.top + 62} M348 ${deck.top} L326 ${deck.top + 62} M418 ${deck.top} L396 ${deck.top + 62} M68 ${deck.top + 20} H515 M60 ${deck.top + 42} H507`} />
            {deck.cells.map((cell, index) => (
              <rect className={cell.signal ? "network-fallback-cell network-fallback-cell--signal" : "network-fallback-cell"} key={index} x={cell.x + deck.offset} y={cell.y} width={cell.signal ? 7 : 5} height={cell.signal ? 7 : 5} />
            ))}
          </g>
        ))}
        <path className="network-fallback-flow" d="M220 88 H470 V193 H220 V298 H470 V403 H220 V508 H470" />
        {["M220 88", "M470 193", "M220 298", "M470 403", "M220 508"].map((point) => {
          const [x, y] = point.slice(1).split(" ").map(Number);
          return <rect className="network-fallback-packet" key={point} x={x - 4} y={y - 4} width="8" height="8" />;
        })}
      </svg>
    </div>
  );
}
