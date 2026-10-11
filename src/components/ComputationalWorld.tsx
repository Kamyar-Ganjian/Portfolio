"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BufferAttribute,
  BufferGeometry,
  InstancedMesh,
  Material,
  Mesh,
  Object3D,
  Texture,
} from "three";

/*
  DEVELOPER LOVE: a calm, muted flight through a living codebase.

  Scroll down and you pass:
    - Floating editor windows with real code: Next.js, React, JavaScript, C# / .NET,
      C++, PyTorch training + attention, SQL, and a little love letter in TypeScript
    - A live `tail -f` terminal that keeps streaming build / deploy / training logs
    - A 3D git graph with branches (feat/nextjs-app-router, feat/dotnet-api, ml/train-pipeline ...)
      and commit messages, with a deploy pulse travelling down main
    - CI/CD gates that softly light up as the pulse passes
    - A dependency constellation (react, next.js, .net, c++, cuda, pytorch ...)
    - The final tag: v1.0.0, built with love

  Everything is deliberately low-contrast and desaturated so page text stays easy to read.
  Two knobs control how dark the background reads:
    VEIL_CENTER  darkness behind the middle of the screen (where your text usually is)
    VEIL_EDGE    darkness across the rest of the screen
  Raise them for even calmer, lower them for more visible scenery.
*/

const VEIL_CENTER = 0.6;
const VEIL_EDGE = 0.3;

type Three = typeof import("three");
type MotionState = { paused: boolean };
type Controls = { setPaused: (paused: boolean) => void };
type Vec3 = [number, number, number];
type Part = { p: Vec3; s: Vec3; c: number; r?: Vec3 };

const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const hexToRgb = (hex: number) => [
  (hex >> 16) & 255,
  (hex >> 8) & 255,
  hex & 255,
];

// ---------------------------------------------------------------------------
// Code content
// ---------------------------------------------------------------------------
type Snippet = { file: string; tag: string; comment: string; lines: string[] };

const SNIPPETS: Snippet[] = [
  {
    file: "page.tsx",
    tag: "next.js",
    comment: "//",
    lines: [
      'import { db } from "@/lib/db";',
      'import { Suspense } from "react";',
      "",
      "export default async function Page() {",
      "  const posts = await db.post.findMany({ take: 10 });",
      "",
      "  return (",
      '    <main className="mx-auto max-w-2xl">',
      "      <h1>Latest posts</h1>",
      "      <Suspense fallback={<Skeleton />}>",
      "        <PostList posts={posts} />",
      "      </Suspense>",
      "    </main>",
      "  );",
      "}",
    ],
  },
  {
    file: "Counter.jsx",
    tag: "react",
    comment: "//",
    lines: [
      'import { useState, useEffect } from "react";',
      "",
      "export function Counter({ initial = 0 }) {",
      "  const [count, setCount] = useState(initial);",
      "",
      "  useEffect(() => {",
      "    document.title = `Clicked ${count} times`;",
      "  }, [count]);",
      "",
      "  return (",
      "    <button onClick={() => setCount((c) => c + 1)}>",
      "      Clicked {count} times",
      "    </button>",
      "  );",
      "}",
    ],
  },
  {
    file: "debounce.js",
    tag: "javascript",
    comment: "//",
    lines: [
      "export function debounce(fn, wait = 200) {",
      "  let timer;",
      "",
      "  return (...args) => {",
      "    clearTimeout(timer);",
      "    timer = setTimeout(() => fn(...args), wait);",
      "  };",
      "}",
      "",
      "const onSearch = debounce(async (query) => {",
      "  const res = await fetch(`/api/search?q=${query}`);",
      "  render(await res.json());",
      "}, 300);",
    ],
  },
  {
    file: "Program.cs",
    tag: "c# / .net",
    comment: "//",
    lines: [
      "var builder = WebApplication.CreateBuilder(args);",
      "builder.Services.AddDbContext<AppDb>();",
      "var app = builder.Build();",
      "",
      'app.MapGet("/orders/{id}", async (int id, AppDb db) =>',
      "    await db.Orders.FindAsync(id) is Order o",
      "        ? Results.Ok(o)",
      "        : Results.NotFound());",
      "",
      'app.MapPost("/orders", async (Order o, AppDb db) => {',
      "    db.Orders.Add(o);",
      "    await db.SaveChangesAsync();",
      '    return Results.Created($"/orders/{o.Id}", o);',
      "});",
      "app.Run();",
    ],
  },
  {
    file: "kernel.cpp",
    tag: "c++20",
    comment: "//",
    lines: [
      "#include <vector>",
      "#include <numeric>",
      "",
      "template <typename T>",
      "T dot(const std::vector<T>& a, const std::vector<T>& b) {",
      "  return std::inner_product(",
      "      a.begin(), a.end(), b.begin(), T{});",
      "}",
      "",
      "int main() {",
      "  std::vector<float> x(1 << 20, 1.0f);",
      "  auto y = x;",
      "  float s = dot(x, y);",
      "  return s > 0 ? 0 : 1;",
      "}",
    ],
  },
  {
    file: "train.py",
    tag: "pytorch",
    comment: "#",
    lines: [
      "import torch",
      "import torch.nn as nn",
      "",
      "model = Transformer(d_model=512, n_heads=8).cuda()",
      "opt = torch.optim.AdamW(model.parameters(), lr=3e-4)",
      "",
      "for epoch in range(10):",
      "    for x, y in loader:",
      "        logits = model(x.cuda())",
      "        loss = nn.functional.cross_entropy(logits, y.cuda())",
      "        loss.backward()",
      "        opt.step()",
      "        opt.zero_grad()",
      '    print(f"epoch {epoch}  loss {loss.item():.4f}")',
    ],
  },
  {
    file: "attention.py",
    tag: "machine learning",
    comment: "#",
    lines: [
      "import math",
      "import torch.nn.functional as F",
      "",
      "# softmax(QK^T / sqrt(d)) V",
      "def attention(q, k, v, mask=None):",
      "    d = q.size(-1)",
      "    scores = q @ k.transpose(-2, -1) / math.sqrt(d)",
      "    if mask is not None:",
      "        scores = scores.masked_fill(mask == 0, -1e9)",
      "    weights = F.softmax(scores, dim=-1)",
      "    return weights @ v",
    ],
  },
  {
    file: "schema.sql",
    tag: "postgres",
    comment: "--",
    lines: [
      "CREATE EXTENSION IF NOT EXISTS vector;",
      "",
      "CREATE TABLE documents (",
      "  id         BIGSERIAL PRIMARY KEY,",
      "  body       TEXT NOT NULL,",
      "  embedding  vector(1536),",
      "  created_at TIMESTAMPTZ DEFAULT now()",
      ");",
      "",
      "CREATE INDEX ON documents",
      "  USING hnsw (embedding vector_cosine_ops);",
      "",
      "-- nearest neighbours in ~2ms",
      "SELECT id, body FROM documents",
      "ORDER BY embedding <=> $1 LIMIT 5;",
    ],
  },
  {
    file: "developer.ts",
    tag: "typescript",
    comment: "//",
    lines: [
      "// what I do for fun",
      "class Developer {",
      '  passion = "software engineering";',
      "  coffee = Infinity;",
      "",
      "  async build(idea: Idea): Promise<Product> {",
      "    const design = await this.think(idea);",
      "    const code = this.write(design);",
      "    await this.test(code);",
      "    return this.ship(code); // best feeling ever",
      "  }",
      "}",
      "",
      "const me = new Developer();",
      "await me.build(everything);",
    ],
  },
];
const TERMINAL_ID = SNIPPETS.length;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "async",
  "await",
  "if",
  "else",
  "for",
  "while",
  "type",
  "interface",
  "class",
  "new",
  "def",
  "yield",
  "in",
  "None",
  "True",
  "False",
  "with",
  "as",
  "package",
  "func",
  "range",
  "continue",
  "is",
  "not",
  "this",
  "using",
  "namespace",
  "public",
  "private",
  "static",
  "void",
  "int",
  "float",
  "double",
  "bool",
  "string",
  "template",
  "typename",
  "auto",
  "include",
  "null",
  "true",
  "false",
  "throw",
  "try",
  "catch",
  "record",
  "override",
  "struct",
  "enum",
  "inline",
  "nullptr",
  "constexpr",
  "SELECT",
  "FROM",
  "WHERE",
  "CREATE",
  "TABLE",
  "INDEX",
  "ON",
  "USING",
  "ORDER",
  "BY",
  "LIMIT",
  "NOT",
  "NULL",
  "PRIMARY",
  "KEY",
  "DEFAULT",
  "EXTENSION",
  "IF",
  "EXISTS",
]);

const SYN = {
  text: "#8f99a8",
  punct: "#66707f",
  kw: "#9d90b8",
  str: "#86ab94",
  num: "#b89a76",
  cmt: "#4d5663",
  fn: "#7a9ab8",
  type: "#b0a479",
  dim: "#3d4551",
};

const TOKEN_RE =
  /(\s+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\d[\d_.,]*)|([A-Za-z_$][\w$]*)|([\s\S])/g;

function tokenize(line: string, comment: string): Array<[string, string]> {
  let code = line;
  let note = "";
  const at = line.indexOf(comment);
  if (at >= 0) {
    code = line.slice(0, at);
    note = line.slice(at);
  }
  const out: Array<[string, string]> = [];
  for (const match of code.matchAll(TOKEN_RE)) {
    const text = match[0];
    let color = SYN.punct;
    if (match[1]) color = SYN.text;
    else if (match[2]) color = SYN.str;
    else if (match[3]) color = SYN.num;
    else if (match[4]) {
      const next = code[(match.index ?? 0) + text.length];
      if (KEYWORDS.has(text)) color = SYN.kw;
      else if (next === "(" || next === ":") color = SYN.fn;
      else if (/^[A-Z]/.test(text)) color = SYN.type;
      else color = SYN.text;
    }
    out.push([text, color]);
  }
  if (note) out.push([note, SYN.cmt]);
  return out;
}

type LogLine = { time: string; level: string; msg: string };
const LOG_POOL: Array<[string, string]> = [
  ["INFO ", "GET  /api/orders 200 9ms  [.NET]"],
  ["INFO ", "POST /v1/chat 200 142ms"],
  ["INFO ", "next build compiled in 4.2s"],
  ["INFO ", "dotnet test 312 passed"],
  ["INFO ", "cmake build 100% [kernel.cpp]"],
  ["INFO ", "epoch 7  loss 0.0421"],
  ["WARN ", "cache miss key=session:9f2c"],
  ["INFO ", "inference batch=32 latency=41ms"],
  ["DEBUG", "pg pool 8/20 connections idle"],
  ["INFO ", "git push origin main ok"],
  ["INFO ", "vercel deploy ready"],
  ["ERROR", "timeout upstream=embed-svc retry 1/3"],
  ["INFO ", "embedding upsert 512 vectors"],
  ["INFO ", "hot reload: Counter.jsx"],
];
const LEVEL_COLOR: Record<string, string> = {
  "INFO ": "#7a9ab8",
  "WARN ": "#b89a76",
  DEBUG: "#475162",
  ERROR: "#b27a7a",
};
const MONO =
  'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

function paintFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: number,
  title: string,
  tag: string,
) {
  ctx.clearRect(0, 0, w, h);
  roundRect(ctx, 2, 2, w - 4, h - 4, 18 * s);
  ctx.fillStyle = "rgba(12, 14, 18, 0.94)";
  ctx.fill();
  ctx.lineWidth = 2 * s;
  ctx.strokeStyle = "rgba(190, 200, 215, 0.12)";
  ctx.stroke();

  ctx.save();
  roundRect(ctx, 2, 2, w - 4, h - 4, 18 * s);
  ctx.clip();
  ctx.fillStyle = "rgba(255, 255, 255, 0.045)";
  ctx.fillRect(0, 0, w, 56 * s);
  ctx.restore();

  ["#d8776f", "#d9b36a", "#7fbf8f"].forEach((color, i) => {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(34 * s + i * 26 * s, 28 * s, 7 * s, 0, TAU);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.textBaseline = "middle";
  ctx.font = `${22 * s}px ${MONO}`;
  ctx.textAlign = "left";
  ctx.fillStyle = "#737d8c";
  ctx.fillText(title, 130 * s, 29 * s);
  ctx.textAlign = "right";
  ctx.fillStyle = "#555f6d";
  ctx.fillText(tag, w - 30 * s, 29 * s);
}

const rowY = (row: number, s: number) => (56 + 18) * s + row * 36 * s + 18 * s;

function paintCode(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  snippet: Snippet,
) {
  const s = w / 1024;
  paintFrame(ctx, w, h, s, snippet.file, snippet.tag);
  ctx.font = `${24 * s}px ${MONO}`;
  ctx.textBaseline = "middle";
  const charW = ctx.measureText("M").width;
  snippet.lines.forEach((line, row) => {
    const y = rowY(row, s);
    ctx.textAlign = "right";
    ctx.fillStyle = SYN.dim;
    ctx.fillText(String(row + 1), 54 * s, y);
    ctx.textAlign = "left";
    let col = 0;
    for (const [text, color] of tokenize(line, snippet.comment)) {
      ctx.fillStyle = color;
      ctx.fillText(text, 78 * s + col * charW, y);
      col += text.length;
    }
  });
}

function paintTerminal(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lines: LogLine[],
) {
  const s = w / 1024;
  paintFrame(ctx, w, h, s, "zsh  ~/app", "tail -f");
  ctx.font = `${24 * s}px ${MONO}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const charW = ctx.measureText("M").width;
  ctx.fillStyle = "#6b9a7a";
  ctx.fillText("$", 30 * s, rowY(0, s));
  ctx.fillStyle = SYN.text;
  ctx.fillText("tail -f api.log", 30 * s + charW * 2, rowY(0, s));
  lines.forEach((line, i) => {
    const y = rowY(i + 1, s);
    let x = 30 * s;
    ctx.fillStyle = SYN.dim;
    ctx.fillText(line.time, x, y);
    x += charW * (line.time.length + 1);
    ctx.fillStyle = LEVEL_COLOR[line.level] ?? SYN.text;
    ctx.fillText(line.level, x, y);
    x += charW * (line.level.length + 1);
    ctx.fillStyle = "#98a2b0";
    ctx.fillText(line.msg, x, y);
  });
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
function createWorld(
  THREE: Three,
  container: HTMLDivElement,
  motion: MotionState,
) {
  type Col = InstanceType<Three["Color"]>;
  type V3 = InstanceType<Three["Vector3"]>;
  type Curve = InstanceType<Three["CatmullRomCurve3"]>;

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const lowCoreCount =
    navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;

  // Atmosphere: near-constant graphite, accent drifts from steel to warm sand.
  const toColors = (hexes: number[]) =>
    hexes.map((hex) => new THREE.Color(hex));
  const bgStops = toColors([0x090a0c, 0x0a0b0e, 0x0b0b0e, 0x0a0a0c]);
  const accentStops = toColors([0x9fb0c6, 0xb0b6c2, 0xc2b8a6]);
  const sampleStops = (stops: Col[], t: number, out: Col) => {
    const f = clamp(t, 0, 1) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(f));
    return out.copy(stops[i]).lerp(stops[i + 1], f - i);
  };

  const scene = new THREE.Scene();
  const background = bgStops[0].clone();
  const accent = accentStops[0].clone();
  scene.background = background;
  const fog = new THREE.FogExp2(bgStops[0].getHex(), 0.016);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 240);
  const cameraPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 2.4, 28),
      new THREE.Vector3(1.0, 2.5, 10),
      new THREE.Vector3(-0.8, 2.3, -8),
      new THREE.Vector3(0, 2.2, -26),
      new THREE.Vector3(0.8, 2.4, -44),
      new THREE.Vector3(-0.6, 2.5, -62),
      new THREE.Vector3(0.6, 2.3, -80),
      new THREE.Vector3(0, 2.2, -98),
      new THREE.Vector3(-0.6, 2.4, -116),
      new THREE.Vector3(0.4, 2.6, -134),
      new THREE.Vector3(0, 2.8, -152),
    ],
    false,
    "centripetal",
    0.2,
  );
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: window.devicePixelRatio < 2,
    powerPreference: "low-power",
    stencil: false,
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(background, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.className = "world-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);
  const maxAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  // Shared helpers --------------------------------------------------------
  const box = new THREE.BoxGeometry(1, 1, 1);
  const tmpM = new THREE.Matrix4();
  const tmpP = new THREE.Vector3();
  const tmpS = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpE = new THREE.Euler();
  const tmpC = new THREE.Color();
  const identityQ = new THREE.Quaternion();
  const MINT = 0x7fae95;

  const buildInstanced = (
    geometry: BufferGeometry,
    material: Material,
    parts: Part[],
    parent: Object3D,
  ) => {
    const mesh = new THREE.InstancedMesh(geometry, material, parts.length);
    parts.forEach((part, index) => {
      tmpP.set(...part.p);
      tmpS.set(...part.s);
      tmpQ.setFromEuler(tmpE.set(...(part.r ?? [0, 0, 0])));
      tmpM.compose(tmpP, tmpQ, tmpS);
      mesh.setMatrixAt(index, tmpM);
      mesh.setColorAt(index, tmpC.set(part.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    parent.add(mesh);
    return mesh;
  };

  const textures: Texture[] = [];

  // Small monospace pills used for commit messages, package names, CI results
  const makeLabel = (
    text: string,
    color: string,
    fontPx: number,
    unitsPerPx: number,
  ) => {
    const font = `600 ${fontPx}px ${MONO}`;
    const measure = document.createElement("canvas").getContext("2d")!;
    measure.font = font;
    const padX = fontPx * 0.85;
    const padY = fontPx * 0.6;
    const w = Math.ceil(measure.measureText(text).width + padX * 2);
    const h = Math.ceil(fontPx + padY * 2);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    roundRect(ctx, 1.5, 1.5, w - 3, h - 3, h / 2 - 2);
    ctx.fillStyle = "rgba(8, 9, 12, 0.7)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#a3acb9";
    ctx.fillText(text, padX, h / 2 + 1);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    sprite.scale.set(w * unitsPerPx, h * unitsPerPx, 1);
    return sprite;
  };

  const makeGlow = (hex: number, size: number, opacity = 0.9) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const [r, g, b] = hexToRgb(hex);
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    gradient.addColorStop(0.3, `rgba(${r},${g},${b},0.32)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
        toneMapped: false,
      }),
    );
    sprite.scale.set(size, size, 1);
    return sprite;
  };

  // Soft glowing points (halos, dust)
  const pointMaterials: InstanceType<Three["ShaderMaterial"]>[] = [];
  const makePoints = (
    positions: Float32Array,
    colors: Float32Array,
    phases: Float32Array,
    size: number,
  ) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aTint", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: size } },
      vertexShader: `
        attribute float aPhase;
        attribute vec3 aTint;
        uniform float uTime;
        uniform float uSize;
        varying vec3 vTint;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 0.75 + 0.25 * sin(uTime * 1.1 + aPhase * 6.2831853);
          gl_PointSize = clamp(uSize * 70.0 / max(1.0, -mv.z) * twinkle, 1.5, 28.0);
          vTint = aTint;
          vAlpha = clamp(1.0 - (-mv.z) / 120.0, 0.0, 1.0) * (0.5 + 0.5 * twinkle);
        }
      `,
      fragmentShader: `
        varying vec3 vTint;
        varying float vAlpha;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float halo = 1.0 - smoothstep(0.0, 0.5, r);
          float core = 1.0 - smoothstep(0.0, 0.14, r);
          gl_FragColor = vec4(vTint, (halo * halo * 0.28 + core * 0.38) * vAlpha);
        }
      `,
    });
    pointMaterials.push(material);
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    return points;
  };

  // ------------------------------------------------------------------------
  // Floor: blueprint grid. A band of light travels with the deploy pulse.
  // ------------------------------------------------------------------------
  const floorMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uAccent: { value: accent.clone() },
      uCam: { value: new THREE.Vector3() },
      uDeployZ: { value: 30 },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      varying vec3 vWorld;
      uniform vec3 uAccent;
      uniform vec3 uCam;
      uniform float uDeployZ;
      float gridLine(vec2 coord) {
        vec2 d = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), vec2(0.0001));
        return 1.0 - min(min(d.x, d.y), 1.0);
      }
      void main() {
        float minor = gridLine(vWorld.xz / 2.5);
        float major = gridLine(vWorld.xz / 10.0);
        float dist = distance(vWorld.xz, uCam.xz);
        float fade = 1.0 - smoothstep(20.0, 85.0, dist);
        float dz = (vWorld.z - uDeployZ) / 7.0;
        float band = exp(-dz * dz);
        vec3 color = mix(uAccent, vec3(0.45, 0.62, 0.52), band);
        float a = (minor * 0.06 + major * 0.14) * fade * (1.0 + band * 1.5);
        a += band * fade * 0.03;
        gl_FragColor = vec4(color, a);
      }
    `,
  });
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 250),
    floorMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3, -75);
  floor.renderOrder = -1;
  scene.add(floor);

  // ------------------------------------------------------------------------
  // Editor windows with real code + a live terminal
  // ------------------------------------------------------------------------
  const PANEL_W = 7.2;
  const PANEL_H = 4.5;
  const texW = mobileQuery.matches ? 768 : 1024;
  const texH = texW * 0.625;
  const texScale = texW / 1024;
  const rowUnits = (36 * texScale * PANEL_W) / texW;

  const makePanelTexture = (paint: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = texW;
    canvas.height = texH;
    const ctx = canvas.getContext("2d")!;
    paint(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.55,
      toneMapped: false,
      depthWrite: false,
    });
    return {
      ctx,
      texture,
      material,
      redraw: () => {
        paint(ctx);
        texture.needsUpdate = true;
      },
    };
  };

  // live terminal buffer
  const logLines: LogLine[] = [];
  let logClock = 14 * 3600 + 2 * 60 + 7;
  const fmtClock = (secs: number) => {
    const h = Math.floor(secs / 3600) % 24;
    const m = Math.floor(secs / 60) % 60;
    const s = Math.floor(secs) % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  };
  let logSeed = 0;
  const pushLog = () => {
    const [level, msg] =
      LOG_POOL[Math.floor(seeded(logSeed + 6000) * LOG_POOL.length)];
    logSeed += 1;
    logClock += 1;
    logLines.push({ time: fmtClock(logClock), level, msg });
    while (logLines.length > 14) logLines.shift();
  };
  for (let i = 0; i < 14; i += 1) pushLog();

  const codePanels = SNIPPETS.map((snippet) =>
    makePanelTexture((ctx) => paintCode(ctx, texW, texH, snippet)),
  );
  const terminalPanel = makePanelTexture((ctx) =>
    paintTerminal(ctx, texW, texH, logLines),
  );

  const panelOrder = [0, 3, 9, 1, 4, 6, 9, 2, 5, 7, 9, 8, 1, 4];
  const panelGeometry = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
  const unitPlane = new THREE.PlaneGeometry(1, 1);
  const unitDot = new THREE.CircleGeometry(0.5, 16);
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const breakpointMaterial = new THREE.MeshBasicMaterial({
    color: MINT,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    toneMapped: false,
  });

  type PanelState = {
    group: InstanceType<Three["Group"]>;
    baseY: number;
    phase: number;
    rows: number;
    highlight: InstanceType<Three["Mesh"]> | null;
    dot: InstanceType<Three["Mesh"]> | null;
  };
  const panels: PanelState[] = [];
  panelOrder.forEach((which, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const isTerminal = which === TERMINAL_ID;
    const source = isTerminal ? terminalPanel : codePanels[which];
    const group = new THREE.Group();
    group.add(new THREE.Mesh(panelGeometry, source.material));

    let highlight: PanelState["highlight"] = null;
    let dot: PanelState["dot"] = null;
    if (!isTerminal) {
      highlight = new THREE.Mesh(unitPlane, highlightMaterial);
      highlight.scale.set(PANEL_W * 0.94, rowUnits, 1);
      highlight.position.z = 0.01;
      dot = new THREE.Mesh(unitDot, breakpointMaterial);
      dot.scale.set(0.13, 0.13, 1);
      dot.position.set(-PANEL_W / 2 + 0.3, 0, 0.012);
      group.add(highlight, dot);
    }

    const baseY = 0.6 + seeded(index + 15) * 5.2;
    group.scale.setScalar(0.88 + seeded(index + 3) * 0.4);
    group.position.set(
      side * (7.6 + seeded(index + 9) * 4.2),
      baseY,
      21 - index * 12.2,
    );
    group.rotation.y = -side * (0.36 + seeded(index + 21) * 0.28);
    scene.add(group);
    panels.push({
      group,
      baseY,
      phase: seeded(index + 99) * TAU,
      rows: isTerminal ? 0 : SNIPPETS[which].lines.length,
      highlight,
      dot,
    });
  });

  // ------------------------------------------------------------------------
  // Git graph: trunk, branches, commits, hashes, deploy pulses
  // ------------------------------------------------------------------------
  const trunkPoints: V3[] = [];
  for (let z = 34; z >= -170; z -= 6) {
    trunkPoints.push(
      new THREE.Vector3(
        Math.sin(z * 0.045) * 1.2,
        -1.2 + Math.sin(z * 0.07 + 1) * 0.25,
        z,
      ),
    );
  }
  const trunk = new THREE.CatmullRomCurve3(trunkPoints);
  scene.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(trunk, 420, 0.035, 6, false),
      new THREE.MeshBasicMaterial({
        color: 0xa9b2c0,
        transparent: true,
        opacity: 0.5,
        toneMapped: false,
      }),
    ),
  );

  const branchDefs = [
    {
      u0: 0.04,
      len: 0.13,
      side: -1,
      theta: 18,
      amp: 4.8,
      name: "feat/nextjs-app-router",
    },
    {
      u0: 0.16,
      len: 0.15,
      side: 1,
      theta: 32,
      amp: 6.2,
      name: "fix/hydration-bug",
    },
    {
      u0: 0.29,
      len: 0.13,
      side: -1,
      theta: 24,
      amp: 5.4,
      name: "perf/cpp-kernels",
    },
    {
      u0: 0.4,
      len: 0.16,
      side: 1,
      theta: 38,
      amp: 6.8,
      name: "feat/dotnet-api",
    },
    {
      u0: 0.54,
      len: 0.13,
      side: -1,
      theta: 14,
      amp: 4.4,
      name: "feat/react-dashboard",
    },
    {
      u0: 0.66,
      len: 0.15,
      side: 1,
      theta: 28,
      amp: 6.0,
      name: "ml/train-pipeline",
    },
    { u0: 0.78, len: 0.14, side: -1, theta: 22, amp: 5.2, name: "hotfix/prod" },
  ];
  const branchMaterial = new THREE.LineBasicMaterial({
    color: accent,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
  });
  const branches: Curve[] = branchDefs.map((def) => {
    const points: V3[] = [];
    const steps = 48;
    for (let s = 0; s <= steps; s += 1) {
      const f = s / steps;
      const base = trunk.getPointAt(def.u0 + def.len * f);
      const off = def.amp * Math.pow(Math.sin(Math.PI * f), 0.75);
      const theta = (def.theta * Math.PI) / 180;
      points.push(
        new THREE.Vector3(
          base.x + def.side * Math.cos(theta) * off,
          base.y + Math.sin(theta) * off,
          base.z,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(points);
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(160)),
        branchMaterial,
      ),
    );
    return curve;
  });

  type Commit = { p: V3; r: number; c: number };
  const commits: Commit[] = [];
  const trunkCommitStart = 0;
  const addCommits = (
    curve: Curve,
    spacing: number,
    radius: number,
    color: number,
  ) => {
    const n = Math.max(2, Math.floor(curve.getLength() / spacing));
    for (let k = 0; k <= n; k += 1) {
      commits.push({
        p: curve.getPointAt(k / n),
        r: k === 0 || k === n ? radius * 1.6 : radius,
        c: color,
      });
    }
    return n;
  };
  const trunkCommitCount = addCommits(trunk, 4, 0.11, 0xa9b2c0) + 1;
  branches.forEach((curve) => addCommits(curve, 3.4, 0.085, 0x7b8595));
  buildInstanced(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    commits.map((commit) => ({
      p: [commit.p.x, commit.p.y, commit.p.z] as Vec3,
      s: [commit.r, commit.r, commit.r] as Vec3,
      c: commit.c,
    })),
    scene,
  );

  const commitMessages = [
    "a3f9c2e feat: streaming responses",
    "7be41d0 fix: race in worker pool",
    "c91a8f3 perf: faster matrix kernel (c++)",
    "2d07e6b refactor: move to app router",
    "f58b3a1 feat: .net minimal api",
    "e40c9d2 feat: train transformer v2",
    "19ab7c4 test: react testing library",
    "8c6f0e5 ci: cache docker layers",
    "b2d93f7 fix: null ref in handler",
    "4e1a6c8 docs: why I love this job",
  ];
  commitMessages.forEach((message, i) => {
    const commit =
      commits[
        trunkCommitStart +
          3 +
          i * Math.floor((trunkCommitCount - 6) / commitMessages.length)
      ];
    const label = makeLabel(message, "#7b8696", 26, 0.0095);
    const side = i % 2 === 0 ? 1 : -1;
    label.position.set(
      commit.p.x + side * (2.5 + label.scale.x * 0.5),
      commit.p.y - 0.35,
      commit.p.z,
    );
    scene.add(label);
  });
  branchDefs.forEach((def, i) => {
    const mid = branches[i].getPointAt(0.5);
    const label = makeLabel(def.name, "#9fb0c6", 28, 0.0098);
    label.position.set(mid.x, mid.y + 0.6, mid.z);
    scene.add(label);
  });

  // deploy / commit pulses travelling along the graph
  type PulseDef = {
    curve: Curve;
    speed: number;
    phase: number;
    size: number;
    color: number;
    main: boolean;
  };
  const pulseDefs: PulseDef[] = [
    {
      curve: trunk,
      speed: 0,
      phase: 0,
      size: 0.2,
      color: 0xa7cdb6,
      main: true,
    },
    ...[0, 1, 2].map((i) => ({
      curve: trunk,
      speed: 0.012 + i * 0.006,
      phase: i * 0.33,
      size: 0.1,
      color: 0xb4bcc8,
      main: false,
    })),
    ...branches.map((curve, i) => ({
      curve,
      speed: 0.05 + seeded(i + 70) * 0.04,
      phase: seeded(i + 80),
      size: 0.09,
      color: i % 3 === 0 ? 0xb89a76 : 0xb4bcc8,
      main: false,
    })),
  ];
  const pulseMesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    pulseDefs.length,
  );
  pulseMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pulseMesh.frustumCulled = false;
  const pulsePositions = new Float32Array(pulseDefs.length * 3);
  const pulseColors = new Float32Array(pulseDefs.length * 3);
  const pulsePhases = new Float32Array(pulseDefs.length);
  pulseDefs.forEach((def, index) => {
    const c = tmpC.set(def.color);
    pulseMesh.setColorAt(index, c);
    pulseColors.set([c.r, c.g, c.b], index * 3);
    pulsePhases[index] = seeded(index + 123);
  });
  scene.add(pulseMesh);
  const pulseHalo = makePoints(pulsePositions, pulseColors, pulsePhases, 5);
  scene.add(pulseHalo);

  // the end of the route: git tag
  const finale = trunk.getPointAt(1);
  const finaleNode = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 2),
    new THREE.MeshBasicMaterial({ color: 0xb9c2ce, toneMapped: false }),
  );
  finaleNode.position.copy(finale);
  const finaleGlow = makeGlow(0xaeb8c6, 12, 0.3);
  finaleGlow.position.copy(finale);
  const finaleLabel = makeLabel(
    "git tag v1.0.0  built with love",
    MINT.toString(16).padStart(6, "0").replace(/^/, "#"),
    34,
    0.0105,
  );
  finaleLabel.position.set(finale.x, finale.y + 2.2, finale.z);
  scene.add(finaleNode, finaleGlow, finaleLabel);

  // ------------------------------------------------------------------------
  // CI/CD gates
  // ------------------------------------------------------------------------
  const GW = 12.4;
  const GH = 7.6;
  const GY = 2.1;
  const GT = 0.06;
  const gateDefs = [
    { z: -9.5, text: "next build compiled" },
    { z: -34, text: "eslint  0 errors" },
    { z: -58.5, text: "dotnet test 312 passed" },
    { z: -83, text: "pytest 1,284 passed" },
    { z: -107.5, text: "docker push sha-a3f9c2e" },
    { z: -132, text: "deploy prod ok" },
  ];
  const frameParts: Part[] = [];
  const bracketParts: Part[] = [];
  const gatePlaneMaterials: InstanceType<Three["MeshBasicMaterial"]>[] = [];
  gateDefs.forEach((gate) => {
    frameParts.push(
      { p: [0, GY + GH / 2, gate.z], s: [GW, GT, GT], c: 0xffffff },
      { p: [0, GY - GH / 2, gate.z], s: [GW, GT, GT], c: 0xffffff },
      { p: [-GW / 2, GY, gate.z], s: [GT, GH, GT], c: 0xffffff },
      { p: [GW / 2, GY, gate.z], s: [GT, GH, GT], c: 0xffffff },
    );
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        bracketParts.push(
          {
            p: [sx * (GW / 2 - 0.45), GY + (sy * GH) / 2, gate.z],
            s: [0.9, 0.12, 0.12],
            c: 0x8d97a6,
          },
          {
            p: [(sx * GW) / 2, GY + sy * (GH / 2 - 0.45), gate.z],
            s: [0.12, 0.9, 0.12],
            c: 0x8d97a6,
          },
        );
      }
    }
    const material = new THREE.MeshBasicMaterial({
      color: MINT,
      transparent: true,
      opacity: 0.01,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    gatePlaneMaterials.push(material);
    const plane = new THREE.Mesh(unitPlane, material);
    plane.scale.set(GW, GH, 1);
    plane.position.set(0, GY, gate.z);
    scene.add(plane);

    const label = makeLabel(gate.text, "#7fae95", 30, 0.0105);
    label.position.set(0, GY + GH / 2 + 0.95, gate.z);
    scene.add(label);
  });
  const basicMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });
  const gateFrame = buildInstanced(box, basicMaterial, frameParts, scene);
  buildInstanced(box, basicMaterial, bracketParts, scene);
  const gateDim = new THREE.Color(0x4d5563);
  const gateLit = new THREE.Color(MINT);

  // ------------------------------------------------------------------------
  // Dependency constellation
  // ------------------------------------------------------------------------
  const depCount = mobileQuery.matches ? 70 : 130;
  const depNodes: Array<{ pos: V3; r: number }> = [];
  for (let i = 0; i < depCount; i += 1) {
    const angle = seeded(i + 20) * TAU;
    const radius = 9 + seeded(i + 30) * 14;
    depNodes.push({
      pos: new THREE.Vector3(
        Math.cos(angle) * radius * 1.25,
        Math.max(-2.3, 2 + Math.sin(angle) * radius * 0.55),
        34 - seeded(i + 10) * 200,
      ),
      r: 0.12 + seeded(i + 40) * 0.16,
    });
  }
  const degree = new Array(depCount).fill(0) as number[];
  const edges: Array<[V3, V3]> = [];
  const edgePositions: number[] = [];
  for (let i = 0; i < depCount; i += 1) {
    for (let j = i + 1; j < depCount; j += 1) {
      if (degree[i] >= 3 || degree[j] >= 3) continue;
      if (depNodes[i].pos.distanceTo(depNodes[j].pos) > 11) continue;
      degree[i] += 1;
      degree[j] += 1;
      const a = depNodes[i].pos;
      const b = depNodes[j].pos;
      edges.push([a, b]);
      edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(edgePositions, 3),
  );
  scene.add(
    new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({
        color: 0x606a7a,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    ),
  );
  buildInstanced(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    depNodes.map((node, i) => ({
      p: [node.pos.x, node.pos.y, node.pos.z] as Vec3,
      s: [node.r, node.r, node.r] as Vec3,
      c: i % 7 === 0 ? 0x98a2b2 : 0x636d7c,
    })),
    scene,
  );
  const depHaloPositions = new Float32Array(depCount * 3);
  const depHaloColors = new Float32Array(depCount * 3);
  const depHaloPhases = new Float32Array(depCount);
  depNodes.forEach((node, i) => {
    depHaloPositions.set([node.pos.x, node.pos.y, node.pos.z], i * 3);
    depHaloColors.set([0.3, 0.34, 0.4], i * 3);
    depHaloPhases[i] = seeded(i + 55);
  });
  scene.add(makePoints(depHaloPositions, depHaloColors, depHaloPhases, 5));

  const packages = [
    "react",
    "next.js",
    "typescript",
    "node.js",
    ".net",
    "c#",
    "c++",
    "cmake",
    "pytorch",
    "numpy",
    "cuda",
    "postgres",
    "redis",
    "docker",
    "kubernetes",
    "webassembly",
    "tailwind",
    "graphql",
  ];
  packages.forEach((name, i) => {
    const node = depNodes[Math.floor((i * depCount) / packages.length)];
    const label = makeLabel(name, "#7b8696", 26, 0.0092);
    label.position.set(node.pos.x, node.pos.y + 0.6, node.pos.z);
    scene.add(label);
  });

  const PACKET_COUNT = 48;
  const packetMesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    PACKET_COUNT,
  );
  packetMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  packetMesh.frustumCulled = false;
  const packets = Array.from({ length: PACKET_COUNT }, (_, i) => ({
    edge: edges[Math.floor(seeded(i + 8000) * edges.length)],
    speed: 0.15 + seeded(i + 8100) * 0.35,
    phase: seeded(i + 8200),
  }));
  packets.forEach((_, i) =>
    packetMesh.setColorAt(i, tmpC.set(i % 6 === 0 ? MINT : 0xb4bcc8)),
  );
  if (packetMesh.instanceColor) packetMesh.instanceColor.needsUpdate = true;
  scene.add(packetMesh);

  // ------------------------------------------------------------------------
  // Dust
  // ------------------------------------------------------------------------
  const dustCount = mobileQuery.matches ? 260 : lowCoreCount ? 380 : 600;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  const dustPhases = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (seeded(i + 3) * 2 - 1) * (4 + seeded(i + 9) * 18);
    dustPositions[i * 3 + 1] = -2.4 + seeded(i + 21) * 12;
    dustPositions[i * 3 + 2] = 30 - seeded(i + 55) * 195;
    const tone = 0.24 + seeded(i + 77) * 0.16;
    dustColors.set([tone, tone * 1.04, tone * 1.1], i * 3);
    dustPhases[i] = seeded(i + 133);
  }
  scene.add(makePoints(dustPositions, dustColors, dustPhases, 0.8));

  // ------------------------------------------------------------------------
  // Veil: a soft dark patch in the middle of the view keeps page text legible
  // ------------------------------------------------------------------------
  const veilCanvas = document.createElement("canvas");
  veilCanvas.width = 256;
  veilCanvas.height = 256;
  const veilCtx = veilCanvas.getContext("2d")!;
  const veilGradient = veilCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
  veilGradient.addColorStop(0, `rgba(9, 10, 12, ${VEIL_CENTER})`);
  veilGradient.addColorStop(
    0.6,
    `rgba(9, 10, 12, ${(VEIL_CENTER + VEIL_EDGE) / 2})`,
  );
  veilGradient.addColorStop(1, `rgba(9, 10, 12, ${VEIL_EDGE})`);
  veilCtx.fillStyle = veilGradient;
  veilCtx.fillRect(0, 0, 256, 256);
  const veilTexture = new THREE.CanvasTexture(veilCanvas);
  veilTexture.colorSpace = THREE.SRGBColorSpace;
  textures.push(veilTexture);
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: veilTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }),
  );
  veil.renderOrder = 999;
  veil.position.set(0, 0, -1);
  veil.visible = VEIL_CENTER > 0 || VEIL_EDGE > 0;
  camera.add(veil);

  // ------------------------------------------------------------------------
  // Runtime state
  // ------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const reducedMotion = { value: motionPreference.matches };
  const scroll = { target: 0, current: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let lastCameraTime = 0;
  let lastLogTime = -10;
  let disposed = false;
  let contextAvailable = true;
  let shadersReady = false;

  const updateDynamic = (t: number) => {
    // floating windows + debugger stepping
    panels.forEach((panel) => {
      panel.group.position.y =
        panel.baseY + Math.sin(t * 0.5 + panel.phase) * 0.18;
      panel.group.rotation.z = Math.sin(t * 0.3 + panel.phase) * 0.012;
      if (panel.highlight && panel.dot) {
        const row = Math.floor(t * 0.7 + panel.phase * 2.2) % panel.rows;
        const y = PANEL_H / 2 - (rowY(row, texScale) * PANEL_W) / texW;
        panel.highlight.position.y = y;
        panel.dot.position.y = y;
      }
    });

    // live logs
    if (t - lastLogTime > 0.85) {
      lastLogTime = t;
      pushLog();
      terminalPanel.redraw();
    }

    // pulses along the git graph
    let deployZ = 30;
    pulseDefs.forEach((def, index) => {
      const u = def.main ? (t * 0.035) % 1 : (t * def.speed + def.phase) % 1;
      def.curve.getPointAt(u, tmpP);
      if (def.main) deployZ = tmpP.z;
      pulsePositions.set([tmpP.x, tmpP.y, tmpP.z], index * 3);
      tmpS.setScalar(def.size * (def.main ? 1 + Math.sin(t * 4) * 0.12 : 1));
      tmpM.compose(tmpP, identityQ, tmpS);
      pulseMesh.setMatrixAt(index, tmpM);
    });
    pulseMesh.instanceMatrix.needsUpdate = true;
    (
      pulseHalo.geometry.getAttribute("position") as BufferAttribute
    ).needsUpdate = true;
    floorMaterial.uniforms.uDeployZ.value = deployZ;

    // CI gates light up as the deploy pulse passes through
    gateDefs.forEach((gate, i) => {
      const d = gate.z - deployZ;
      const f = Math.exp(-(d * d) / 50);
      tmpC
        .copy(gateDim)
        .lerp(gateLit, f)
        .multiplyScalar(0.7 + f * 0.6);
      for (let k = 0; k < 4; k += 1) gateFrame.setColorAt(i * 4 + k, tmpC);
      gatePlaneMaterials[i].opacity = 0.006 + f * 0.035;
    });
    if (gateFrame.instanceColor) gateFrame.instanceColor.needsUpdate = true;

    // data packets in the dependency graph
    packets.forEach((packet, index) => {
      const u = (t * packet.speed + packet.phase) % 1;
      tmpP.lerpVectors(packet.edge[0], packet.edge[1], u);
      tmpS.setScalar(0.07 * (0.6 + Math.sin(u * Math.PI) * 0.7));
      tmpM.compose(tmpP, identityQ, tmpS);
      packetMesh.setMatrixAt(index, tmpM);
    });
    packetMesh.instanceMatrix.needsUpdate = true;

    const beat = 1 + Math.sin(t * 1.3) * 0.06;
    finaleNode.scale.setScalar(beat);
    finaleGlow.scale.setScalar(12 * beat);

    pointMaterials.forEach((material) => {
      material.uniforms.uTime.value = t;
    });
  };
  updateDynamic(0);

  const updateCamera = (time: number, snap = false) => {
    const progress = reducedMotion.value ? 0 : scroll.target;
    const elapsedFrame =
      lastCameraTime === 0
        ? 1 / 30
        : clamp((time - lastCameraTime) * 0.001, 0.001, 0.1);
    lastCameraTime = time;
    const ease =
      snap || motion.paused || reducedMotion.value
        ? 1
        : 1 - Math.exp(-elapsedFrame / 0.34);

    scroll.current += (progress - scroll.current) * ease;
    const position = cameraPath.getPointAt(scroll.current);
    const idle = motion.paused || reducedMotion.value ? 0 : 1;
    position.x += pointer.x * 0.48 + Math.sin(elapsed * 0.23) * 0.18 * idle;
    position.y += pointer.y * 0.26 + Math.sin(elapsed * 0.31) * 0.08 * idle;
    camera.position.lerp(position, ease);

    const direction = cameraPath.getTangentAt(scroll.current);
    const lookAhead = position.clone().addScaledVector(direction, 22);
    lookAhead.x += pointer.x * 0.24;
    lookAhead.y += pointer.y * 0.12 - 2.8;
    camera.lookAt(lookAhead);
  };

  const updateAtmosphere = () => {
    const t = scroll.current;
    sampleStops(bgStops, t, background);
    fog.color.copy(background);
    sampleStops(accentStops, t, accent);
    branchMaterial.color.copy(accent);
    floorMaterial.uniforms.uAccent.value.copy(accent);
    floorMaterial.uniforms.uCam.value.copy(camera.position);
  };

  const render = (time: number, snap = false) => {
    if (disposed || !contextAvailable || !shadersReady || !width || !height)
      return;
    if (!motion.paused && !reducedMotion.value) {
      elapsed = time * 0.001;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
      updateDynamic(elapsed);
    }
    updateCamera(time, snap);
    updateAtmosphere();
    renderer.render(scene, camera);
    container.dataset.ready = "true";
  };

  const resize = () => {
    const bounds = container.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;

    const pixelRatio = mobileQuery.matches ? 0.9 : lowCoreCount ? 1 : 1.35;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobileQuery.matches ? 51 : 46;
    camera.updateProjectionMatrix();
    const planeHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    veil.scale.set(planeHeight * camera.aspect * 1.1, planeHeight * 1.1, 1);
    render(performance.now(), true);
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
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    scroll.target =
      scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    if (motion.paused) render(performance.now(), true);
  };

  const readPointer = (event: PointerEvent) => {
    if (reducedMotion.value || motion.paused || event.pointerType !== "mouse")
      return;
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
  renderer.domElement.addEventListener(
    "webglcontextrestored",
    handleContextRestored,
  );
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
      // Keep the pre-rendered SVG illustration if shader compilation fails.
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
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
      );

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
        if ((object as InstancedMesh).isInstancedMesh) {
          (object as InstancedMesh).dispose();
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
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
        <svg
          className="world-fallback"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="world-glow" cx="50%" cy="46%" r="60%">
              <stop stopColor="#9fb0c6" stopOpacity=".12" />
              <stop offset="1" stopColor="#9fb0c6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="world-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9fb0c6" stopOpacity="0" />
              <stop offset="1" stopColor="#9fb0c6" stopOpacity=".1" />
            </linearGradient>
          </defs>
          <rect width="1440" height="900" fill="#090a0c" />
          <rect width="1440" height="900" fill="url(#world-glow)" />
          <path d="M0 900 560 500h320L1440 900Z" fill="url(#world-floor)" />
          <g fill="none" stroke="#9fb0c6" strokeOpacity=".14">
            <path d="M720 500 60 900M720 500 280 900M720 500 500 900M720 500 660 900M720 500 780 900M720 500 940 900M720 500 1160 900M720 500 1380 900" />
            <path d="M610 540h220M540 590h360M450 650h540M340 725h760M200 820h1040" />
          </g>
          <path
            d="M720 900C720 760 700 640 720 500"
            fill="none"
            stroke="#cfd6e2"
            strokeOpacity=".4"
            strokeWidth="2"
          />
          <path
            d="M720 760C560 720 500 640 540 540M720 640C880 600 960 520 920 430"
            fill="none"
            stroke="#9fb0c6"
            strokeOpacity=".5"
          />
          <g fill="#cfd6e2" fillOpacity=".8">
            <circle cx="720" cy="760" r="5" />
            <circle cx="720" cy="640" r="5" />
            <circle cx="720" cy="520" r="4" />
            <circle cx="620" cy="715" r="3" />
            <circle cx="548" cy="590" r="3" />
            <circle cx="860" cy="610" r="3" />
          </g>
          <g
            fill="#0c0e12"
            stroke="#c0cad8"
            strokeOpacity=".22"
            strokeWidth="1.5"
          >
            <rect x="70" y="170" width="300" height="190" rx="10" />
            <rect x="1080" y="140" width="290" height="190" rx="10" />
            <rect x="120" y="470" width="260" height="170" rx="10" />
            <rect x="1050" y="460" width="280" height="170" rx="10" />
          </g>
          <g fill="#8fb7de" fillOpacity=".45">
            <rect x="100" y="225" width="90" height="7" rx="3" />
            <rect x="120" y="248" width="150" height="7" rx="3" />
            <rect x="120" y="271" width="110" height="7" rx="3" />
            <rect x="100" y="294" width="170" height="7" rx="3" />
          </g>
          <g fill="#b9a7d9" fillOpacity=".4">
            <rect x="1110" y="225" width="80" height="7" rx="3" />
            <rect x="1130" y="248" width="170" height="7" rx="3" />
            <rect x="1130" y="271" width="120" height="7" rx="3" />
            <rect x="1110" y="294" width="150" height="7" rx="3" />
          </g>
          <g fill="none" stroke="#7fae95" strokeOpacity=".2" strokeWidth="2">
            <path d="M560 250h320v270H560z" />
          </g>
        </svg>
      </div>
      <button
        className="world-motion-control"
        type="button"
        aria-label={
          paused ? "Resume ambient scene motion" : "Pause ambient scene motion"
        }
        aria-pressed={!paused && !reducedMotion}
        onClick={toggleMotion}
      >
        <span
          className={
            paused
              ? "world-motion-indicator is-paused"
              : "world-motion-indicator"
          }
          aria-hidden="true"
        />
        Scene motion{" "}
        <span>{paused ? "paused" : reducedMotion ? "reduced" : "live"}</span>
      </button>
    </>
  );
}
