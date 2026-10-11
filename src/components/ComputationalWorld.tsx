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

function addStructuralMember(
  THREE: Three,
  beams: Beam[],
  start: [number, number, number],
  end: [number, number, number],
  thickness: number,
  color: number,
) {
  const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const orientation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(1, 0, 0),
    direction.clone().normalize(),
  );
  const rotation = new THREE.Euler().setFromQuaternion(orientation);

  beams.push({
    x: (start[0] + end[0]) * 0.5,
    y: (start[1] + end[1]) * 0.5,
    z: (start[2] + end[2]) * 0.5,
    width: direction.length(),
    height: thickness,
    depth: thickness,
    color,
    rotation: [rotation.x, rotation.y, rotation.z],
  });
}

function createWorld(THREE: Three, container: HTMLDivElement, motion: MotionState) {
  const scene = new THREE.Scene();
  const voidColor = new THREE.Color(0x080a09);
  scene.background = voidColor;
  scene.fog = new THREE.FogExp2(voidColor, 0.016);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 125);
  const cameraPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.8, 7, 22),
      new THREE.Vector3(2.2, 7.2, 8),
      new THREE.Vector3(7, 6.8, -7),
      new THREE.Vector3(9.5, 7.5, -21),
      new THREE.Vector3(5.5, 7.1, -35),
      new THREE.Vector3(-6, 7.8, -49),
      new THREE.Vector3(-9, 7.3, -63),
      new THREE.Vector3(-2, 7.6, -78),
    ],
    false,
    "centripetal",
    0.18,
  );
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
  renderer.toneMappingExposure = 1.28;
  renderer.domElement.className = "world-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xc1cdd0, 0x111719, 1.62));
  const sun = new THREE.DirectionalLight(0xd8e0e1, 2.75);
  sun.position.set(-9, 19, 13);
  scene.add(sun);

  const signalLight = new THREE.PointLight(0x84c5d0, 30, 42, 2);
  signalLight.position.set(3.5, 2.5, -17);
  scene.add(signalLight);
  const foundryLight = new THREE.PointLight(0xb98560, 19, 30, 2);
  foundryLight.position.set(-10, 2.8, -34);
  scene.add(foundryLight);
  const cityRim = new THREE.DirectionalLight(0x8caab0, 0.9);
  cityRim.position.set(30, 13, -31);
  scene.add(cityRim);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x13191b,
    emissiveIntensity: 0.31,
    metalness: 0.54,
    roughness: 0.42,
  });
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x151c1e,
    emissiveIntensity: 0.22,
    metalness: 0.68,
    roughness: 0.34,
  });
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x11191d,
    emissiveIntensity: 0.4,
    metalness: 0.5,
    roughness: 0.5,
  });
  const facadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x101619,
    emissiveIntensity: 0.24,
    metalness: 0.62,
    roughness: 0.42,
  });
  const createGlazingMaterial = () => new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x26383e,
    emissiveIntensity: 0.34,
    metalness: 0.24,
    roughness: 0.24,
  });

  const pillars: Beam[] = [];
  const spans: Beam[] = [];
  const braces: Beam[] = [];
  const machinery: Beam[] = [];
  const weighingStructures: Beam[] = [];
  const indicators: Beam[] = [];
  const roofRibs: Array<{ z: number; color: number }> = [];
  const cityMasses: Beam[] = [];
  const cityFacadeBands = Array.from({ length: 4 }, () => [] as Beam[]);
  const cityWindowBands = Array.from({ length: 4 }, () => [] as Beam[]);
  const streetFurniture: Beam[] = [];
  const skyways: Beam[] = [];
  const baySpacing = 12.2;
  const bayCount = 10;
  const outerLine = 14.2;

  // Repeated structural bays share the load like a real long-span facility.
  // The open center remains a navigable corridor; service work happens on
  // the side walkways and in the machinery bays.
  for (let bay = 0; bay < bayCount; bay += 1) {
    const z = 25 - bay * baySpacing;
    const centerZ = z - baySpacing * 0.5;
    const lateField = bay >= 6;
    const steel = bay % 3 === 1 ? 0x424a4d : 0x343d40;
    const highlight = lateField ? 0x526368 : bay % 2 === 0 ? 0x596165 : 0x465054;
    const roofHeight = 9.1 + Math.sin(bay * 0.7) * 0.35;

    for (const side of [-1, 1]) {
      const x = side * outerLine;
      const legHeight = roofHeight + 2.2;

      pillars.push({
        x,
        y: -2.32 + legHeight * 0.5,
        z,
        width: 0.92,
        height: legHeight,
        depth: 1.05,
        color: steel,
      });
      pillars.push({
        x: x + side * 0.7,
        y: -2.11,
        z,
        width: 1.9,
        height: 0.38,
        depth: 1.7,
        color: 0x3b4447,
      });

      // Deep cross-bracing ties each upright to the next bay.
      addStructuralMember(
        THREE,
        braces,
        [x, -1.65, z + 0.2],
        [x, roofHeight - 0.3, z - baySpacing + 0.2],
        0.16,
        highlight,
      );
      addStructuralMember(
        THREE,
        braces,
        [x, roofHeight - 0.3, z + 0.2],
        [x, -1.65, z - baySpacing + 0.2],
        0.12,
        0x30393c,
      );

      // Two connected service levels create a readable near-ground rhythm.
      spans.push(
        {
          x: side * 8.8,
          y: -0.72,
          z: centerZ,
          width: 3.1,
          height: 0.2,
          depth: baySpacing,
          color: 0x424b4e,
        },
        {
          x: side * 8.8,
          y: -0.12,
          z: centerZ,
          width: 0.14,
          height: 0.14,
          depth: baySpacing,
          color: 0x586266,
        },
        {
          x: side * 10.25,
          y: -0.12,
          z: centerZ,
          width: 0.12,
          height: 0.12,
          depth: baySpacing,
          color: 0x596367,
        },
      );

      for (let post = 0; post <= 5; post += 1) {
        const postZ = z - 0.7 - post * 2.15;
        pillars.push({
          x: side * 7.25,
          y: -1.47,
          z: postZ,
          width: 0.1,
          height: 1.35,
          depth: 0.1,
          color: 0x465054,
        });
        pillars.push({
          x: side * 7.25,
          y: -0.11,
          z: postZ,
          width: 0.1,
          height: 1.02,
          depth: 0.1,
          color: 0x536064,
        });
        pillars.push({
          x: side * 10.25,
          y: 0.24,
          z: postZ,
          width: 0.1,
          height: 0.78,
          depth: 0.1,
          color: 0x536064,
        });
      }

      spans.push(
        {
          x: side * 10.25,
          y: 0.57,
          z: centerZ,
          width: 0.12,
          height: 0.12,
          depth: baySpacing,
          color: 0x657074,
        },
        {
          x: side * 10.25,
          y: 0.16,
          z: centerZ,
          width: 0.09,
          height: 0.09,
          depth: baySpacing,
          color: 0x515c60,
        },
      );

      addStructuralMember(
        THREE,
        spans,
        [side * 7.25, -1.85, z - 1.1],
        [side * 8.1, -0.78, z - 1.1],
        0.12,
        0x4a5558,
      );
      addStructuralMember(
        THREE,
        spans,
        [side * 8.1, -0.78, z - 1.1],
        [side * 9.3, -1.85, z - 1.1],
        0.12,
        0x4a5558,
      );

      // Enclosures and their small status lamps sit inside the service edge,
      // not as floating props in the central corridor.
      if (bay % 2 === 0) {
        const cabinetX = side * 11.7;
        machinery.push({
          x: cabinetX,
          y: -0.53,
          z: centerZ,
          width: 1.65,
          height: 2.25,
          depth: 1.55,
          color: bay >= 6 ? 0x39464a : 0x3e4749,
        });
        machinery.push({
          x: cabinetX - side * 0.06,
          y: -0.32,
          z: centerZ + 0.79,
          width: 1.1,
          height: 1.48,
          depth: 0.035,
          color: 0x566064,
        });
        indicators.push({
          x: cabinetX - side * 0.44,
          y: 0.47,
          z: centerZ + 0.82,
          width: 0.09,
          height: 0.09,
          depth: 0.055,
          color: bay % 4 === 0 ? 0xb88d69 : 0x83b8c2,
        });
      }
    }

    // A continuous roof truss and a second service girder make the overhead
    // scale legible even when the camera is close to the structure.
    spans.push(
      {
        x: 0,
        y: roofHeight,
        z,
        width: outerLine * 2 + 2.2,
        height: 1.05,
        depth: 1.2,
        color: steel,
      },
      {
        x: 0,
        y: roofHeight - 1.75,
        z,
        width: outerLine * 1.73,
        height: 0.22,
        depth: 0.25,
        color: 0x4e585c,
      },
      {
        x: 0,
        y: roofHeight + 1.05,
        z: centerZ,
        width: 0.32,
        height: 0.28,
        depth: baySpacing,
        color: 0x475155,
      },
    );

    for (const roofX of [-13.1, -7, 7, 13.1]) {
      spans.push({
        x: roofX,
        y: roofHeight + 0.78,
        z: centerZ,
        width: 0.19,
        height: 0.2,
        depth: baySpacing,
        color: 0x424c50,
      });
    }

    // Triangular roof braces turn the repeated portal into one continuous
    // load-bearing truss rather than a row of disconnected arches.
    for (const side of [-1, 1]) {
      addStructuralMember(
        THREE,
        braces,
        [side * 13.9, roofHeight + 0.45, z],
        [side * 8.3, roofHeight + 1.8, z],
        0.14,
        highlight,
      );
      addStructuralMember(
        THREE,
        braces,
        [side * 8.3, roofHeight + 1.8, z],
        [side * 2.8, roofHeight + 0.45, z],
        0.12,
        0x434d50,
      );
    }

    // The roof starts to soften into a measured, ribbed canopy near the
    // learning horizon while its original supports remain visible beneath.
    if (bay >= 6) {
      roofRibs.push({ z, color: bay >= 8 ? 0x71888c : 0x505d60 });
    }
  }

  // Two in-road weighing installations make the city's physical operations
  // legible through their form: recessed decks, load points, sensor portals,
  // and a connected instrument cabinet.
  for (const station of [
    { x: -1.2, z: -18 },
    { x: 1.5, z: -53 },
  ]) {
    weighingStructures.push(
      {
        x: station.x,
        y: -2.18,
        z: station.z,
        width: 9.4,
        height: 0.2,
        depth: 6.5,
        color: 0x465256,
      },
      {
        x: station.x,
        y: -2.04,
        z: station.z - 3.2,
        width: 9.65,
        height: 0.075,
        depth: 0.09,
        color: 0x80b9c0,
      },
      {
        x: station.x,
        y: -2.04,
        z: station.z + 3.2,
        width: 9.65,
        height: 0.075,
        depth: 0.09,
        color: 0x80b9c0,
      },
      {
        x: station.x - 4.72,
        y: -2.04,
        z: station.z,
        width: 0.09,
        height: 0.075,
        depth: 6.4,
        color: 0x64777b,
      },
      {
        x: station.x + 4.72,
        y: -2.04,
        z: station.z,
        width: 0.09,
        height: 0.075,
        depth: 6.4,
        color: 0x64777b,
      },
      {
        x: station.x + 6.1,
        y: -0.64,
        z: station.z - 0.4,
        width: 0.82,
        height: 2.35,
        depth: 0.68,
        color: 0x3b464a,
      },
      {
        x: station.x + 6.1,
        y: -0.58,
        z: station.z + 0.02,
        width: 0.54,
        height: 0.68,
        depth: 0.06,
        color: 0x50666c,
      },
    );

    for (const side of [-1, 1]) {
      for (const along of [-1, 1]) {
        weighingStructures.push({
          x: station.x + side * 4.25,
          y: -1.82,
          z: station.z + along * 2.7,
          width: 0.32,
          height: 0.42,
          depth: 0.32,
          color: 0x68777a,
        });
      }

      weighingStructures.push({
        x: station.x + side * 5.45,
        y: -0.4,
        z: station.z,
        width: 0.18,
        height: 3.25,
        depth: 0.2,
        color: 0x4a5559,
      });
      indicators.push({
        x: station.x + side * 5.45,
        y: 1.25,
        z: station.z + 0.12,
        width: 0.1,
        height: 0.1,
        depth: 0.06,
        color: side < 0 ? 0xb98560 : 0x8ecbd3,
      });
    }

    weighingStructures.push({
      x: station.x,
      y: 1.18,
      z: station.z,
      width: 10.9,
      height: 0.22,
      depth: 0.32,
      color: 0x4b575a,
    });
  }

  // A residential and technology skyline grows along both edges of the
  // infrastructure boulevard. Three repeatable building families give each
  // district a different silhouette without scattering unrelated props.
  const buildingLanes = [16.8, 29.6, 42.4] as const;
  const buildingColors = [0x465054, 0x566164, 0x38474b, 0x5d686b];
  const glassColors = {
    dark: 0x27363b,
    ice: 0x7faeb7,
    amber: 0xb58a6a,
  };

  for (let row = 0; row < 8; row += 1) {
    const streetZ = 13 - row * 15.8;
    const detailBand = Math.floor(row / 2);

    for (const side of [-1, 1]) {
      for (let lane = 0; lane < buildingLanes.length; lane += 1) {
        const variation = seeded((row + 1) * 211 + lane * 47 + (side + 2) * 89);
        const x = side * (buildingLanes[lane] + (variation - 0.5) * 1.35);
        const width = (lane === 0 ? 9.8 : lane === 1 ? 8.2 : 7.1) + variation * 1.15;
        const depth = (lane === 0 ? 10.5 : lane === 1 ? 9.2 : 8.4) + variation * 1.4;
        const floors = (lane === 0 ? 5 : lane === 1 ? 7 : 11)
          + Math.floor(row * 0.78)
          + Math.floor(seeded(row * 67 + lane * 13 + side * 23) * 2);
        const floorHeight = 1.52;
        const podiumHeight = lane === 0 ? 3.2 : 2.6;
        const towerHeight = floors * floorHeight;
        const baseY = -2.36;
        const frontZ = streetZ + depth * 0.5;
        const exterior = buildingColors[(row + lane * 2 + (side < 0 ? 1 : 0)) % buildingColors.length];
        const trim = row > 4 ? 0x59676b : 0x505c60;

        cityMasses.push({
          x,
          y: baseY + podiumHeight * 0.5,
          z: streetZ,
          width: width + 1.4,
          height: podiumHeight,
          depth: depth + 1.5,
          color: 0x3a4549,
        });
        cityMasses.push({
          x,
          y: baseY + podiumHeight + towerHeight * 0.5,
          z: streetZ,
          width,
          height: towerHeight,
          depth,
          color: exterior,
        });

        // A recessed rooftop volume and a thin coping make the roofline vary
        // between stepped mid-rises and slender high-rise blocks.
        if (lane !== 1 || variation > 0.42) {
          const penthouseWidth = width * (lane === 2 ? 0.58 : 0.72);
          const penthouseHeight = 1.25 + variation * 0.8;
          cityMasses.push({
            x: x - side * (width - penthouseWidth) * 0.18,
            y: baseY + podiumHeight + towerHeight + penthouseHeight * 0.5,
            z: streetZ - depth * 0.08,
            width: penthouseWidth,
            height: penthouseHeight,
            depth: depth * 0.66,
            color: 0x343f43,
          });
        }

        cityMasses.push({
          x,
          y: baseY + podiumHeight + towerHeight + 0.08,
          z: streetZ,
          width: width + 0.28,
          height: 0.16,
          depth: depth + 0.3,
          color: trim,
        });

        const windowColumns = Math.max(3, Math.floor((width - 0.8) / 1.42));
        const windowSpacing = (width - 0.7) / windowColumns;
        const paneWidth = Math.min(0.9, windowSpacing * 0.66);
        const firstWindowX = x - width * 0.5 + 0.35 + windowSpacing * 0.5;

        for (let column = 0; column <= windowColumns; column += 1) {
          const mullionX = x - width * 0.5 + column * windowSpacing;
          cityFacadeBands[detailBand].push({
            x: mullionX,
            y: baseY + podiumHeight + towerHeight * 0.5,
            z: frontZ + 0.075,
            width: 0.075,
            height: towerHeight - 0.24,
            depth: 0.12,
            color: trim,
          });
        }

        for (let floor = 0; floor < floors; floor += 1) {
          const windowY = baseY + podiumHeight + floor * floorHeight + 0.79;
          const frontFace = frontZ + 0.045;

          for (let column = 0; column < windowColumns; column += 1) {
            const paneX = firstWindowX + column * windowSpacing;
            const lightSample = seeded(row * 419 + lane * 151 + floor * 31 + column * 7 + (side + 1) * 11);
            const color = lightSample > 0.984
              ? glassColors.amber
              : lightSample > 0.885
                ? glassColors.ice
                : glassColors.dark;

            cityWindowBands[detailBand].push({
              x: paneX,
              y: windowY,
              z: frontFace,
              width: paneWidth,
              height: 0.82,
              depth: 0.045,
              color,
            });
          }

          // The boulevard-facing return keeps the facades dimensional as the
          // camera rounds the gentle bends in the street.
          for (const returnWindow of [-1, 1]) {
            const inwardFaceX = x - side * (width * 0.5 + 0.035);
            const paneZ = streetZ + returnWindow * depth * 0.22;
            const sideSample = seeded(row * 313 + lane * 71 + floor * 19 + returnWindow * 3 + side * 7);
            cityWindowBands[detailBand].push({
              x: inwardFaceX,
              y: windowY,
              z: paneZ,
              width: 0.76,
              height: 0.8,
              depth: 0.045,
              color: sideSample > 0.92 ? glassColors.ice : glassColors.dark,
              rotation: [0, Math.PI * 0.5, 0],
            });
          }

          if (floor > 0 && floor % (lane === 0 ? 2 : 4) === 0) {
            cityFacadeBands[detailBand].push({
              x,
              y: windowY - 0.7,
              z: frontZ + 0.22,
              width: width + 0.24,
              height: 0.1,
              depth: 0.42,
              color: trim,
            });
            cityFacadeBands[detailBand].push({
              x,
              y: windowY - 0.31,
              z: frontZ + 0.43,
              width: width * 0.88,
              height: 0.055,
              depth: 0.055,
              color: 0x687579,
            });
          }
        }

        // Mechanical crowns and small roof beacons punctuate the skyline.
        if (lane > 0 && row % 2 === 0) {
          indicators.push({
            x: x + side * width * 0.28,
            y: baseY + podiumHeight + towerHeight + 1.42,
            z: streetZ - depth * 0.08,
            width: 0.11,
            height: 0.11,
            depth: 0.11,
            color: row % 4 === 0 ? glassColors.amber : glassColors.ice,
          });
        }
      }

      // Two-level street luminaires provide restrained points of warmth at
      // human scale between the larger structural bays.
      const lampZ = streetZ - 7.4;
      const lampX = side * 16.4;
      streetFurniture.push(
        {
          x: lampX,
          y: 0.05,
          z: lampZ,
          width: 0.13,
          height: 4.8,
          depth: 0.13,
          color: 0x505b5f,
        },
        {
          x: lampX - side * 0.7,
          y: 2.32,
          z: lampZ,
          width: 1.5,
          height: 0.12,
          depth: 0.12,
          color: 0x596469,
        },
      );
      indicators.push({
        x: lampX - side * 1.3,
        y: 2.2,
        z: lampZ,
        width: 0.48,
        height: 0.08,
        depth: 0.28,
        color: row % 3 === 0 ? glassColors.amber : glassColors.ice,
      });
    }

    // Elevated links meet the building edges and bridge neighboring blocks
    // rather than floating as disconnected decorations.
    if (row % 2 === 1) {
      const bridgeY = 4.6 + (row % 4) * 0.42;
      for (const side of [-1, 1]) {
        skyways.push(
          {
            x: side * 27,
            y: bridgeY,
            z: streetZ,
            width: 12.8,
            height: 0.42,
            depth: 1.65,
            color: 0x424d51,
          },
          {
            x: side * 27,
            y: bridgeY + 0.55,
            z: streetZ - 0.72,
            width: 12.8,
            height: 0.12,
            depth: 0.11,
            color: 0x647175,
          },
          {
            x: side * 27,
            y: bridgeY + 0.55,
            z: streetZ + 0.72,
            width: 12.8,
            height: 0.12,
            depth: 0.11,
            color: 0x647175,
          },
        );
      }
    }
  }

  // Segmented foundations, transfer platforms, and conveyor rollers anchor
  // the abstract network in the physical operations it represents.
  const floorPanels: Beam[] = [];
  const rollerCount = 6 * 2 * 5;
  const rollerGeometry = new THREE.CylinderGeometry(0.16, 0.16, 2.9, 12);
  const rollerMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b9699,
    metalness: 0.78,
    roughness: 0.29,
  });
  const rollers = new THREE.InstancedMesh(rollerGeometry, rollerMaterial, rollerCount);
  const rollerPosition = new THREE.Vector3();
  const rollerScale = new THREE.Vector3(1, 1, 1);
  const rollerRotation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, 0, Math.PI * 0.5),
  );
  const rollerLocations: InstanceType<Three["Vector3"]>[] = [];
  const rollerPhases: number[] = [];
  const rollerMatrix = new THREE.Matrix4();
  const rollerSpinAxis = new THREE.Vector3(0, 1, 0);
  const rollerSpin = new THREE.Quaternion();
  const animatedRollerRotation = new THREE.Quaternion();
  rollers.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  let rollerIndex = 0;

  for (let bay = 0; bay < 6; bay += 1) {
    const z = 25 - bay * baySpacing - baySpacing * 0.5;
    floorPanels.push({
      x: 0,
      y: -2.3,
      z,
      width: 27.8,
      height: 0.14,
      depth: baySpacing - 0.12,
      color: bay % 2 === 0 ? 0x20282b : 0x252d30,
    });

    for (const side of [-1, 1]) {
      spans.push({
        x: side * 6.5,
        y: -1.72,
        z,
        width: 3.5,
        height: 0.16,
        depth: 5.3,
        color: 0x414b4f,
      });

      for (let roller = 0; roller < 5; roller += 1) {
        rollerPosition.set(side * 6.5, -1.52, z + 1.95 - roller * 0.88);
        rollerLocations.push(rollerPosition.clone());
        rollerPhases.push(rollerIndex * 0.19);
        rollerMatrix.compose(rollerPosition, rollerRotation, rollerScale);
        rollers.setMatrixAt(rollerIndex, rollerMatrix);
        rollers.setColorAt(
          rollerIndex,
          new THREE.Color(roller % 4 === 0 ? 0x7e888b : 0x596367),
        );
        rollerIndex += 1;
      }
    }
  }
  rollers.instanceMatrix.needsUpdate = true;
  if (rollers.instanceColor) rollers.instanceColor.needsUpdate = true;
  scene.add(rollers);

  makeInstancedBeams(THREE, scene, box, stoneMaterial, pillars);
  makeInstancedBeams(THREE, scene, box, deckMaterial, spans);
  makeInstancedBeams(THREE, scene, box, stoneMaterial, braces);
  makeInstancedBeams(THREE, scene, box, stoneMaterial, machinery);
  makeInstancedBeams(THREE, scene, box, stoneMaterial, weighingStructures);
  makeInstancedBeams(THREE, scene, box, deckMaterial, floorPanels);
  makeInstancedBeams(THREE, scene, box, deckMaterial, indicators);
  makeInstancedBeams(THREE, scene, box, buildingMaterial, cityMasses);
  makeInstancedBeams(THREE, scene, box, facadeMaterial, streetFurniture);
  makeInstancedBeams(THREE, scene, box, deckMaterial, skyways);

  const cityFacadeMeshes = cityFacadeBands.map((band) =>
    makeInstancedBeams(THREE, scene, box, facadeMaterial, band),
  );
  const cityWindowMaterials = cityWindowBands.map(() => createGlazingMaterial());
  const cityWindowMeshes = cityWindowBands.map((band, index) =>
    makeInstancedBeams(THREE, scene, box, cityWindowMaterials[index], band),
  );
  const cityBandCenters = cityFacadeBands.map((_, band) =>
    13 - (band * 2 + 0.5) * 15.8,
  );

  for (const rib of roofRibs) {
    const points = [
      new THREE.Vector3(-14.2, 8.6, rib.z),
      new THREE.Vector3(-10, 10.3, rib.z),
      new THREE.Vector3(-5, 11.25, rib.z),
      new THREE.Vector3(0, 11.55, rib.z),
      new THREE.Vector3(5, 11.25, rib.z),
      new THREE.Vector3(10, 10.3, rib.z),
      new THREE.Vector3(14.2, 8.6, rib.z),
    ];
    const arch = new THREE.CatmullRomCurve3(points);
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(arch, 96, 0.11, 6, false),
        new THREE.MeshStandardMaterial({
          color: rib.color,
          emissive: rib.z < -70 ? 0x3e6870 : 0x121a1c,
          emissiveIntensity: rib.z < -70 ? 0.58 : 0.12,
          metalness: 0.62,
          roughness: 0.36,
        }),
      ),
    );
  }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 122),
    new THREE.MeshStandardMaterial({
      color: 0x111518,
      metalness: 0.36,
      roughness: 0.72,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -2.48, -26);
  scene.add(ground);

  const gridPositions: number[] = [];
  for (let x = -28; x <= 28; x += 3.5) {
    gridPositions.push(x, -2.39, 34, x, -2.39, -87);
  }
  for (let z = -86; z <= 32; z += 2.6) {
    gridPositions.push(-29, -2.389, z, 29, -2.389, z);
  }
  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(gridPositions, 3),
  );
  const grid = new THREE.LineSegments(
    gridGeometry,
    new THREE.LineBasicMaterial({
      color: 0x596469,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
    }),
  );
  scene.add(grid);

  const routeMaterials = [
    new THREE.MeshBasicMaterial({
      color: 0x9dd5de,
      transparent: true,
      opacity: 0.64,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x71868b,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x82aeb6,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  ];

  for (let route = 0; route < 3; route += 1) {
    const points: InstanceType<Three["Vector3"]>[] = [];
    for (let point = 0; point <= 64; point += 1) {
      const progress = point / 64;
      const z = 32 - progress * 114;
      const emergence = clamp((progress - 0.58) / 0.42, 0, 1);
      const wave = Math.sin(progress * Math.PI * 2.4 + route * 0.8);
      const side = route === 1 ? -1 : 1;
      const x = route === 0
        ? 0.35 + wave * (0.42 + emergence * 1.2)
        : side * (0.4 + clamp(progress * 5, 0, 1) * 4.6 + wave * 0.28);
      const y = -2.13 + emergence * (2.25 + Math.sin(progress * Math.PI * 2) * 0.8);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const signalPath = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 220, route === 0 ? 0.025 : 0.016, 5, false),
      routeMaterials[route],
    );
    scene.add(signalPath);
  }

  const signalPacketCount = 9;
  const signalPacketGeometry = new THREE.IcosahedronGeometry(0.11, 0);
  const signalPacketMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });
  const signalPackets = new THREE.InstancedMesh(
    signalPacketGeometry,
    signalPacketMaterial,
    signalPacketCount,
  );
  const signalPacketPhases = Array.from({ length: signalPacketCount }, (_, index) =>
    (index % 3) / 3 + seeded(index + 1041) * 0.08,
  );
  const signalPacketPosition = new THREE.Vector3();
  const signalPacketScale = new THREE.Vector3();
  const signalPacketRotation = new THREE.Quaternion();
  const signalPacketMatrix = new THREE.Matrix4();
  signalPacketMaterial.transparent = true;
  signalPacketMaterial.opacity = 0.92;
  signalPackets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let packet = 0; packet < signalPacketCount; packet += 1) {
    signalPackets.setColorAt(
      packet,
      new THREE.Color(packet % 5 === 0 ? 0xc19170 : 0xa6dbe1),
    );
  }
  if (signalPackets.instanceColor) signalPackets.instanceColor.needsUpdate = true;
  scene.add(signalPackets);

  // Further down the route, rigid lanes begin to braid into a large,
  // measured field of curves: a visual cue for exploration, not a claim of
  // finished AI products.
  for (let strand = 0; strand < 6; strand += 1) {
    const points: InstanceType<Three["Vector3"]>[] = [];
    const phase = strand * (Math.PI * 2 / 6);
    for (let point = 0; point <= 72; point += 1) {
      const progress = point / 72;
      const z = -40 - progress * 41;
      const envelope = 1.8 + progress * 6.4;
      const x = Math.sin(progress * Math.PI * 2.2 + phase) * envelope;
      const y = 3.4 + Math.cos(progress * Math.PI * 1.6 + phase) * (0.8 + progress * 2.5);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const strandMaterial = new THREE.LineBasicMaterial({
      color: strand % 3 === 0 ? 0x789ba2 : strand % 3 === 1 ? 0x657276 : 0x435054,
      transparent: true,
      opacity: strand % 3 === 0 ? 0.34 : 0.19,
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
  const particleCount = mobileQuery.matches ? 280 : lowCoreCount ? 420 : 760;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleSpeeds = new Float32Array(particleCount);
  const particlePhases = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);
  const steelDust = new THREE.Color(0x77858a);
  const iceLight = new THREE.Color(0x9ed7df);
  const amberLight = new THREE.Color(0xb98560);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    const xSeed = seeded(index + 13);
    const ySeed = seeded(index + 201);
    const zSeed = seeded(index + 431);
    const accent = seeded(index + 811);
    const tint = accent > 0.96
      ? amberLight
      : accent > 0.83
        ? iceLight
        : steelDust.clone().lerp(iceLight, accent * 0.12);
    particlePositions[offset] = (xSeed * 2 - 1) * (7 + ySeed * 12);
    particlePositions[offset + 1] = -1.6 + ySeed * 11.5;
    particlePositions[offset + 2] = 32 - zSeed * 114;
    particleSizes[index] = 0.7 + seeded(index + 37) * 1.35;
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
        float travel = mod(uTime * aSpeed + aPhase * 114.0, 114.0);
        point.z = 32.0 - travel;
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
  const scroll = { target: 0, current: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let lastCameraTime = 0;
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

  const updateCityLevelOfDetail = () => {
    const cameraZ = camera.position.z;
    cityBandCenters.forEach((centerZ, index) => {
      const distance = Math.abs(cameraZ - centerZ);
      cityFacadeMeshes[index].visible = distance < 58;
      cityWindowMeshes[index].visible = distance < 48;
    });
  };

  const updateCamera = (time: number, snap = false) => {
    const progress = reducedMotion.value ? 0 : scroll.target;
    const elapsedFrame = lastCameraTime === 0 ? 1 / 30 : clamp((time - lastCameraTime) * 0.001, 0.001, 0.1);
    lastCameraTime = time;
    const ease = snap || motion.paused || reducedMotion.value
      ? 1
      : 1 - Math.exp(-elapsedFrame / 0.34);

    scroll.current += (progress - scroll.current) * ease;
    const position = cameraPath.getPointAt(scroll.current);
    position.x += pointer.x * 0.48;
    position.y += pointer.y * 0.26;
    camera.position.lerp(position, ease);

    const direction = cameraPath.getTangentAt(scroll.current);
    const lookAhead = position.clone().addScaledVector(direction, 22);
    lookAhead.x += pointer.x * 0.24;
    lookAhead.y += pointer.y * 0.12 - 2.8;
    camera.lookAt(lookAhead);
  };

  const render = (time: number, snap = false) => {
    if (disposed || !contextAvailable || !shadersReady || !width || !height) return;
    if (!motion.paused && !reducedMotion.value) {
      elapsed = time * 0.001;
      particleMaterial.uniforms.uTime.value = elapsed;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      cityWindowMaterials.forEach((material, band) => {
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 0.34 - band * 1.42);
        material.emissiveIntensity = 0.2 + pulse * 0.46;
      });

      const rollerSpeed = elapsed * 0.92;
      rollerLocations.forEach((position, index) => {
        rollerSpin.setFromAxisAngle(rollerSpinAxis, rollerSpeed + rollerPhases[index]);
        animatedRollerRotation.copy(rollerRotation).multiply(rollerSpin);
        rollerMatrix.compose(position, animatedRollerRotation, rollerScale);
        rollers.setMatrixAt(index, rollerMatrix);
      });
      rollers.instanceMatrix.needsUpdate = true;

      for (let packet = 0; packet < signalPacketCount; packet += 1) {
        const progress = (elapsed * 0.022 + signalPacketPhases[packet]) % 1;
        const emergence = clamp((progress - 0.58) / 0.42, 0, 1);
        const track = packet % 3;
        const sway = Math.sin(progress * Math.PI * 2.4 + track * 0.8);
        const side = track === 1 ? -1 : 1;
        const x = track === 0
          ? 0.35 + sway * (0.42 + emergence * 1.2)
          : side * (0.4 + clamp(progress * 5, 0, 1) * 4.6 + sway * 0.28);
        const y = -1.85 + emergence * (2.25 + Math.sin(progress * Math.PI * 2) * 0.8);
        const z = 32 - progress * 114;
        const pulse = 0.88 + Math.sin(elapsed * 1.8 + signalPacketPhases[packet] * Math.PI * 2) * 0.12;
        signalPacketPosition.set(x, y, z);
        signalPacketScale.setScalar(pulse);
        signalPacketMatrix.compose(signalPacketPosition, signalPacketRotation, signalPacketScale);
        signalPackets.setMatrixAt(packet, signalPacketMatrix);
      }
      signalPackets.instanceMatrix.needsUpdate = true;
    }
    updateCamera(time, snap);
    updateCityLevelOfDetail();
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
              <stop offset="0" stopColor="#172024" stopOpacity="0" />
              <stop offset="0.4" stopColor="#11171a" stopOpacity=".84" />
              <stop offset="1" stopColor="#080a09" />
            </linearGradient>
            <radialGradient id="world-signal">
              <stop stopColor="#84c5d0" stopOpacity=".23" />
              <stop offset="1" stopColor="#84c5d0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="900" fill="#080a09" />
          <ellipse cx="930" cy="475" rx="680" ry="400" fill="url(#world-signal)" />
          <path d="M0 900 450 485h540L1440 900Z" fill="url(#world-floor)" />
          <g fill="#1c262a" stroke="#465256" strokeOpacity=".72">
            <path d="M0 234 92 198h202v448L0 691z" />
            <path d="m280 285 83-42h151v334l-234 44z" />
            <path d="m1016 286 104-56h134v472l-238-45z" />
            <path d="m1220 192 76-58h144v605l-220-42z" />
            <path d="M594 371 669 337h108v186l-183 15z" fill="#202b2f" />
            <path d="M279 408 510 367M1009 403l245 44M91 388l202-43M1120 366l222 42" fill="none" stroke="#66777c" strokeOpacity=".38" strokeWidth="3" />
            <path d="M202 648 202 315M1192 700 1192 327M347 611 347 300M1294 719 1294 184" fill="none" stroke="#76878b" strokeOpacity=".44" strokeWidth="5" />
          </g>
          <g fill="#8dbac2" fillOpacity=".38">
            <path d="M30 280h15v31H30zM65 267h15v31H65zM30 342h15v31H30zM65 329h15v31H65zM30 404h15v31H30zM65 391h15v31H65zM108 255h17v37h-17zM151 255h17v37h-17zM108 327h17v37h-17zM151 327h17v37h-17z" />
            <path d="M318 322h16v29h-16zM356 315h16v29h-16zM394 308h16v29h-16zM318 380h16v29h-16zM356 373h16v29h-16zM394 366h16v29h-16z" />
            <path d="M1055 327h16v34h-16zM1094 318h16v34h-16zM1133 309h16v34h-16zM1055 397h16v34h-16zM1094 388h16v34h-16zM1133 379h16v34h-16z" />
            <path d="M1262 240h18v40h-18zM1307 229h18v40h-18zM1352 218h18v40h-18zM1262 317h18v40h-18zM1307 306h18v40h-18zM1352 295h18v40h-18zM1262 394h18v40h-18zM1307 383h18v40h-18zM1352 372h18v40h-18z" />
          </g>
          <g fill="none" stroke="#687b80" strokeOpacity=".58" strokeWidth="2">
            <path d="M112 490h222l68-53h120M1080 505h183l-76-55h-113M293 574h207M1070 588h206" />
            <path d="M0 690 720 454M1440 737 720 454" strokeOpacity=".24" />
          </g>
          <g fill="none" stroke="#69777b" strokeOpacity=".2" strokeWidth="1">
            <path d="M720 456 80 900M720 456 250 900M720 456 420 900M720 456 580 900M720 456 850 900M720 456 1030 900M720 456 1210 900M720 456 1400 900" />
            <path d="M605 500h230M530 548h380M454 602h530M365 664h710M260 734h920M140 814h1160" />
          </g>
          <g fill="#222a2d" stroke="#536064" strokeOpacity=".76">
            <path d="M90 202h24v431H90zM1320 202h28v431h-28zM356 271h18v294h-18zM1066 271h20v294h-20z" />
            <path d="M78 201h1276v18H78zM328 270h784v16H328zM214 352h1020v15H214zM61 608h1315v24H61z" />
            <path d="m94 220 258 132-7 11L89 234zM1340 220 1082 352l7 11 256-129zM368 286 230 352l7 9 145-66zM1078 286l139 66-7 9-145-66z" />
            <path d="M118 637h33v15h-33zM1285 637h43v15h-43zM374 567h26v13h-26zM1046 567h37v13h-37z" fill="#394448" />
          </g>
          <g fill="none" stroke="#8dc8d1" strokeOpacity=".6" strokeWidth="2">
            <path d="M0 555h472l78 43h224l90-64h231l88 54h257" />
            <path d="M0 579h383l91 49h191l80-51h281" stroke="#7f969b" strokeOpacity=".44" />
          </g>
          <g fill="#c0906c">
            <circle cx="748" cy="535" r="3" /><circle cx="1213" cy="548" r="3" />
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
