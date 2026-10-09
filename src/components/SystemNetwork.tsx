"use client";

import { useEffect, useRef } from "react";

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

for (let i = 0; i < nodes.length; i += 1) {
  for (let j = i + 1; j < nodes.length; j += 1) {
    const source = nodes[i];
    const target = nodes[j];
    const dx = source.x - target.x;
    const dy = source.y - target.y;
    const dz = source.z - target.z;
    if (dx * dx + dy * dy + dz * dz < CONNECTION_RADIUS * CONNECTION_RADIUS) {
      edges.push([i, j]);
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

export default function SystemNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    const scene = canvas?.parentElement;
    if (!canvas || !context || !scene) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const point = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let visible = true;
    let reducedMotion = motionPreference.matches;
    let scrollProgress = 0;
    const motionStartedAt = performance.now();

    const resize = () => {
      const bounds = scene.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(performance.now());
    };

    const draw = (time: number) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.51;
      const centerY = height * 0.49;
      const morph = reducedMotion ? 0 : scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
      scene.style.setProperty("--network-morph", morph.toFixed(3));
      const radius = Math.min(width, height) * 0.42 * (1 - morph * 0.08);
      const elapsed = reducedMotion ? 0.46 : 0.46 + (time - motionStartedAt) * 0.000085;
      const pointerTurn = point.active ? 0.19 : 0;
      const turnY = elapsed + point.x * pointerTurn;
      const turnX = 0.19 + (point.active ? point.y * 0.14 : 0);
      const cosY = Math.cos(turnY);
      const sinY = Math.sin(turnY);
      const cosX = Math.cos(turnX);
      const sinX = Math.sin(turnX);
      const projected = nodes.map((node, index) => {
        const x = node.x * cosY - node.z * sinY;
        const z = node.x * sinY + node.z * cosY;
        const y = node.y * cosX - z * sinX;
        const depth = node.y * sinX + z * cosX;
        const layer = ((index % 5) - 2) * 0.16;
        const composedY = y * (1 - morph * 0.62) + layer * morph;
        const composedDepth = depth * (1 - morph * 0.82);
        const perspective = 1 / (1.8 - composedDepth * 0.48);
        return {
          x: centerX + x * radius * (1 - morph * 0.08) * perspective,
          y: centerY + composedY * radius * perspective,
          z: composedDepth,
          accent: node.accent,
        };
      });

      // Quiet orbit guides provide a sense of depth without dominating the network.
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.29 * (1 - morph) + point.x * 0.07);
      context.setLineDash([2, 9]);
      context.strokeStyle = "rgba(206, 255, 61, 0.18)";
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.16, radius * (0.43 - morph * 0.15), 0, 0, Math.PI * 2);
      context.stroke();
      context.rotate(1.1);
      context.strokeStyle = "rgba(215, 224, 212, 0.12)";
      context.beginPath();
      context.ellipse(0, 0, radius * 1.08, radius * (0.34 + morph * 0.08), 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      for (const [from, to] of edges) {
        const a = projected[from];
        const b = projected[to];
        const depth = (a.z + b.z) * 0.5;
        context.strokeStyle = `rgba(190, 220, 183, ${0.09 + (depth + 1) * 0.075})`;
        context.lineWidth = depth > 0.45 ? 1.05 : 0.7;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }

      if (!reducedMotion) {
        edges.forEach(([from, to], index) => {
          if (index % 5 !== 0) return;
          const progress = (time * 0.00011 + index * 0.173) % 1;
          const a = projected[from];
          const b = projected[to];
          const x = a.x + (b.x - a.x) * progress;
          const y = a.y + (b.y - a.y) * progress;
          context.fillStyle = "rgba(206, 255, 61, 0.86)";
          context.shadowColor = "rgba(206, 255, 61, 0.56)";
          context.shadowBlur = 8;
          context.beginPath();
          context.arc(x, y, 1.55, 0, Math.PI * 2);
          context.fill();
          context.shadowBlur = 0;
        });
      }

      for (const node of projected) {
        const depth = (node.z + 1) / 2;
        const pointerX = centerX + point.x * width * 0.5;
        const pointerY = centerY + point.y * height * 0.5;
        const pointerDistance = point.active ? Math.hypot(node.x - pointerX, node.y - pointerY) : Infinity;
        const highlighted = node.accent || pointerDistance < 48;
        const nodeRadius = highlighted ? 2.7 : 1.2 + depth * 0.9;

        if (highlighted) {
          context.fillStyle = "rgba(206, 255, 61, 0.11)";
          context.beginPath();
          context.arc(node.x, node.y, nodeRadius * 4.3, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = highlighted
          ? "rgba(215, 255, 117, 0.98)"
          : `rgba(221, 231, 220, ${0.35 + depth * 0.5})`;
        context.beginPath();
        context.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        context.fill();
      }

    };

    const animate = (time: number) => {
      draw(time);
      if (!reducedMotion && visible && !document.hidden) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      window.cancelAnimationFrame(frame);
      if (reducedMotion || !visible || document.hidden) {
        draw(performance.now());
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      point.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      point.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      point.active = true;
    };

    const handlePointerLeave = () => {
      point.active = false;
      point.x = 0;
      point.y = 0;
    };

    const handleScroll = () => {
      scrollProgress = Math.max(0, Math.min(window.scrollY / (window.innerHeight * 0.68), 1));
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      startAnimation();
    };

    const handleVisibility = () => {
      startAnimation();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(scene);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      startAnimation();
    });
    visibilityObserver.observe(scene);
    canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    motionPreference.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibility);
    handleScroll();
    resize();
    startAnimation();
    scene.dataset.ready = "true";

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      motionPreference.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="network-scene" role="img" aria-label="An interactive three-dimensional network of connected software system nodes, with data moving between them">
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
      <canvas className="network-canvas" ref={canvasRef} aria-hidden="true" />
      <span className="network-hub" aria-hidden="true"><i /></span>
    </div>
  );
}
