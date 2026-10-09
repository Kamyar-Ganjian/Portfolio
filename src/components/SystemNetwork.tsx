"use client";

import { useEffect, useRef } from "react";
import type { Mesh } from "three";

const NODE_COUNT = 62;
const CONNECTION_RADIUS = 0.51;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const nodes = Array.from({ length: NODE_COUNT }, (_, index) => {
  const y = 1 - (index / (NODE_COUNT - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = GOLDEN_ANGLE * index;

  return {
    x: Math.cos(angle) * radius,
    y,
    z: Math.sin(angle) * radius,
    accent: index % 9 === 2,
  };
});

const edges: Array<[number, number]> = [];

for (let from = 0; from < nodes.length; from += 1) {
  for (let to = from + 1; to < nodes.length; to += 1) {
    const dx = nodes[from].x - nodes[to].x;
    const dy = nodes[from].y - nodes[to].y;
    const dz = nodes[from].z - nodes[to].z;
    if (dx * dx + dy * dy + dz * dz < CONNECTION_RADIUS * CONNECTION_RADIUS) {
      edges.push([from, to]);
    }
  }
}

const staticNodes = nodes.map((node) => {
  const cosY = Math.cos(0.46);
  const sinY = Math.sin(0.46);
  const cosX = Math.cos(0.19);
  const sinX = Math.sin(0.19);
  const x = node.x * cosY - node.z * sinY;
  const z = node.x * sinY + node.z * cosY;
  const y = node.y * cosX - z * sinX;
  const depth = node.y * sinX + z * cosX;
  const perspective = 1 / (1.8 - depth * 0.48);

  return {
    x: 306 + x * 252 * perspective,
    y: 294 + y * 252 * perspective,
    depth,
    accent: node.accent,
  };
});

type Three = typeof import("three");

function createNetworkScene(THREE: Three, container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 0, 7.6);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "three-canvas";
  container.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);
  scene.add(new THREE.AmbientLight(0x9cac90, 1.2));

  const keyLight = new THREE.PointLight(0xceff3d, 18, 16, 1.7);
  keyLight.position.set(-3, 3.6, 4.2);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xe4ece0, 11, 14, 1.8);
  fillLight.position.set(3.5, -1.4, 3.5);
  scene.add(fillLight);

  const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 10);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x17220d,
    emissiveIntensity: 0.48,
    metalness: 0.12,
    roughness: 0.34,
    vertexColors: true,
    toneMapped: false,
  });
  const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, NODE_COUNT);
  nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  nodeMesh.frustumCulled = false;

  const unitScale = new THREE.Vector3(1, 1, 1);
  const identity = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();

  nodes.forEach((node, index) => {
    nodeMesh.setColorAt(index, new THREE.Color(node.accent ? 0xceff3d : 0xc4d0c3));
    matrix.makeTranslation(node.x * 2.2, node.y * 2.2, node.z * 2.2);
    nodeMesh.setMatrixAt(index, matrix);
  });
  if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;
  root.add(nodeMesh);

  const linePositions = new Float32Array(edges.length * 6);
  const lineGeometry = new THREE.BufferGeometry();
  const lineAttribute = new THREE.BufferAttribute(linePositions, 3);
  lineAttribute.setUsage(THREE.DynamicDrawUsage);
  lineGeometry.setAttribute("position", lineAttribute);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xbad8b5,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    toneMapped: false,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  lines.frustumCulled = false;
  root.add(lines);

  const packetEdges = edges.filter((_, index) => index % 5 === 0);
  const packetPositions = new Float32Array(packetEdges.length * 3);
  const packetGeometry = new THREE.BufferGeometry();
  const packetAttribute = new THREE.BufferAttribute(packetPositions, 3);
  packetAttribute.setUsage(THREE.DynamicDrawUsage);
  packetGeometry.setAttribute("position", packetAttribute);
  const packetMaterial = new THREE.PointsMaterial({
    color: 0xceff3d,
    size: 0.07,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const packets = new THREE.Points(packetGeometry, packetMaterial);
  packets.frustumCulled = false;
  root.add(packets);

  const orbitGroup = new THREE.Group();
  const orbitMaterial = new THREE.LineDashedMaterial({
    color: 0xceff3d,
    transparent: true,
    opacity: 0.2,
    dashSize: 0.035,
    gapSize: 0.105,
    depthWrite: false,
    toneMapped: false,
  });
  const orbitMaterialSecondary = new THREE.LineDashedMaterial({
    color: 0xd7e0d4,
    transparent: true,
    opacity: 0.13,
    dashSize: 0.025,
    gapSize: 0.13,
    depthWrite: false,
    toneMapped: false,
  });

  const createOrbit = (xRadius: number, yRadius: number, material: InstanceType<Three["LineDashedMaterial"]>) => {
    const curve = new THREE.EllipseCurve(0, 0, xRadius, yRadius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(144).map((point) => new THREE.Vector3(point.x, point.y, -0.08));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbit = new THREE.LineLoop(geometry, material);
    orbit.computeLineDistances();
    return orbit;
  };

  orbitGroup.add(createOrbit(2.75, 1.05, orbitMaterial));
  const innerOrbit = createOrbit(2.5, 0.76, orbitMaterialSecondary);
  innerOrbit.rotation.z = 1.1;
  orbitGroup.add(innerOrbit);
  orbitGroup.rotation.z = -0.29;
  root.add(orbitGroup);

  const hubGeometry = new THREE.RingGeometry(0.038, 0.05, 40);
  const hubMaterial = new THREE.MeshBasicMaterial({
    color: 0xceff3d,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    toneMapped: false,
  });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  hub.position.z = 0.16;
  root.add(hub);

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
  const rotation = new THREE.Euler(0, 0, 0, "XYZ");
  const localNodes = nodes.map(() => new THREE.Vector3());
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
    const elapsed = reducedMotion.value ? 0.46 : 0.46 + (time - startTime) * 0.000085;
    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    rotation.set(0.19 + pointer.y * 0.14, elapsed + pointer.x * (pointer.active ? 0.19 : 0), 0);
    root.rotation.copy(rotation);
    root.scale.setScalar(1 - morph * 0.08);
    orbitGroup.rotation.z = -0.29 * (1 - morph) + pointer.x * 0.07;

    for (let index = 0; index < nodes.length; index += 1) {
      const base = nodes[index];
      const point = localNodes[index].set(base.x, base.y, base.z);
      const layer = ((index % 5) - 2) * 0.16;
      point.x *= 2.2 * (1 - morph * 0.12);
      point.y = (point.y * (1 - morph * 0.62) + layer * morph) * 2.2;
      point.z *= 2.2 * (1 - morph * 0.82);
      matrix.compose(point, identity, unitScale);
      nodeMesh.setMatrixAt(index, matrix);
    }
    nodeMesh.instanceMatrix.needsUpdate = true;

    edges.forEach(([from, to], index) => {
      const offset = index * 6;
      const a = localNodes[from];
      const b = localNodes[to];
      linePositions[offset] = a.x;
      linePositions[offset + 1] = a.y;
      linePositions[offset + 2] = a.z;
      linePositions[offset + 3] = b.x;
      linePositions[offset + 4] = b.y;
      linePositions[offset + 5] = b.z;
    });
    lineAttribute.needsUpdate = true;

    if (!reducedMotion.value) {
      packetEdges.forEach(([from, to], index) => {
        const amount = (time * 0.00011 + index * 0.173) % 1;
        const a = localNodes[from];
        const b = localNodes[to];
        const offset = index * 3;
        packetPositions[offset] = a.x + (b.x - a.x) * amount;
        packetPositions[offset + 1] = a.y + (b.y - a.y) * amount;
        packetPositions[offset + 2] = a.z + (b.z - a.z) * amount;
      });
      packetAttribute.needsUpdate = true;
    }

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
    scene.traverse((object) => {
      const renderable = object as Mesh;
      if (renderable.geometry) renderable.geometry.dispose();
      if (Array.isArray(renderable.material)) renderable.material.forEach((material) => material.dispose());
      else renderable.material?.dispose();
    });
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
        disposeScene = createNetworkScene(THREE, container);
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
      aria-label="An interactive three-dimensional network of connected software system nodes, with data moving between them"
    >
      <svg className="network-fallback" viewBox="0 0 600 600" aria-hidden="true">
        <g className="network-fallback-orbits" transform="translate(306 294)">
          <ellipse cx="0" cy="0" rx="292" ry="108" transform="rotate(-16.6)" />
          <ellipse cx="0" cy="0" rx="272" ry="86" transform="rotate(46.4)" />
        </g>
        <g className="network-fallback-edges">
          {edges.map(([from, to]) => {
            const a = staticNodes[from];
            const b = staticNodes[to];
            const depth = (a.depth + b.depth) * 0.5;
            return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={0.09 + (depth + 1) * 0.075} />;
          })}
        </g>
        <g className="network-fallback-nodes">
          {staticNodes.map((node, index) => <circle className={node.accent ? "network-fallback-node--accent" : undefined} key={index} cx={node.x} cy={node.y} r={node.accent ? 2.7 : 1.6} opacity={node.accent ? 1 : 0.35 + ((node.depth + 1) / 2) * 0.5} />)}
        </g>
      </svg>
      <span className="network-hub" aria-hidden="true"><i /></span>
    </div>
  );
}
