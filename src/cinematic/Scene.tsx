

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import Avatar from "./Avatar";
import { makePose, type Pose } from "./lib/pose";
import * as L from "./lib/layout";

export type Stage = "wait" | "door" | "walk" | "turn" | "bag" | "sit" | "swivel" | "seated";

export interface SceneProps {
  /** Begin the intro (set true once the page has fully loaded). */
  start: boolean;
  /** Jump straight to the seated state. */
  skip: boolean;
  /** Avatar turns to face the visitor and waves. */
  attention: boolean;
  /** Mouth moves while true. */
  talking: boolean;
  onReady: () => void;
  onStage: (s: Stage) => void;
  onAvatarClick: () => void;
  onAvatarHover: (hovering: boolean) => void;
}

const Y = new THREE.Vector3(0, 1, 0);
const damp = THREE.MathUtils.damp;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => {
  t = clamp01(t);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

const PATH = [
  new THREE.Vector3(L.DOOR_X, 0, L.WALL_Z - 0.5),
  new THREE.Vector3(L.DOOR_X + 0.2, 0, -0.6),
  L.STAND_POINT.clone(),
];
const WALK_SPEED = 1.3;
const DOOR_OPEN = 1.75;

/* ------------------------------------------------------------------ */
/* tiny helpers                                                         */
/* ------------------------------------------------------------------ */

type V3 = [number, number, number];

function Box({
  p = [0, 0, 0],
  s = [1, 1, 1],
  c = "#888",
  e,
  ei = 1,
  r = 0.7,
  m = 0,
  rot,
  noShadow,
}: {
  p?: V3;
  s?: V3;
  c?: string;
  e?: string;
  ei?: number;
  r?: number;
  m?: number;
  rot?: V3;
  noShadow?: boolean;
}) {
  const geometry = useMemo(() => {
    const [w, h, depth] = s;
    const radius = Math.min(w, h, depth, 0.12) * 0.22;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + radius, -h / 2);
    shape.lineTo(w / 2 - radius, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
    shape.lineTo(w / 2, h / 2 - radius);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
    shape.lineTo(-w / 2 + radius, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
    shape.lineTo(-w / 2, -h / 2 + radius);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
    const result = new THREE.ExtrudeGeometry(shape, { depth: depth - radius, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: radius / 2, bevelThickness: radius / 2, curveSegments: 5 });
    result.translate(0, 0, -(depth - radius) / 2);
    return result;
  }, [s[0], s[1], s[2]]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={p} rotation={rot} userData={noShadow ? { noShadow: true } : undefined}>
      <meshStandardMaterial
        color={c}
        roughness={r}
        metalness={m}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? ei : 0}
      />
    </mesh>
  );
}

function codeTexture() {
  const cv = document.createElement("canvas");
  cv.width = 640;
  cv.height = 360;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#0d1117";
  g.fillRect(0, 0, 640, 360);
  g.fillStyle = "#161b22";
  g.fillRect(0, 0, 640, 26);
  g.fillRect(0, 26, 110, 334);
  const palette = ["#ff7b72", "#79c0ff", "#7ee787", "#ffa657", "#d2a8ff", "#e6edf3"];
  let seed = 5;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let row = 0; row < 18; row++) {
    let x = 130 + Math.floor(rnd() * 3) * 22;
    const y = 44 + row * 17;
    const n = 2 + Math.floor(rnd() * 4);
    for (let k = 0; k < n; k++) {
      const w = 20 + Math.floor(rnd() * 70);
      g.fillStyle = palette[Math.floor(rnd() * palette.length)];
      g.fillRect(x, y, w, 7);
      x += w + 8;
    }
  }
  for (let row = 0; row < 14; row++) {
    g.fillStyle = "#30363d";
    g.fillRect(14, 40 + row * 18, 30 + Math.floor(rnd() * 50), 6);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function mugTexture() {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 128;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#111";
  g.fillRect(0, 0, 256, 128);
  g.fillStyle = "#fff";
  g.font = "bold 44px system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("dmn.dev", 128, 66);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Keys() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const d = new THREE.Object3D();
    let i = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        d.position.set(-0.233 + c * 0.0425, 0.017, -0.06 + r * 0.04);
        d.updateMatrix();
        mesh.setMatrixAt(i++, d.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 48]}>
      <boxGeometry args={[0.035, 0.012, 0.032]} />
      <meshStandardMaterial color="#2a2d34" roughness={0.6} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* room + props                                                         */
/* ------------------------------------------------------------------ */

function Room({ doorRef }: { doorRef: React.RefObject<THREE.Group | null> }) {
  const wallC = "#1d1c23";
  const hx = L.DOOR_HINGE_X;
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial color="#2a2018" roughness={0.55} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <Box key={i} p={[-6 + i * 1.1, 0.002, 0]} s={[0.012, 0.002, 16]} c="#120d09" noShadow />
      ))}

      {/* back wall with a door opening */}
      <Box p={[hx - 5, 2.25, L.WALL_Z]} s={[10, 4.5, 0.2]} c={wallC} />
      <Box p={[-2.9 + 6, 2.25, L.WALL_Z]} s={[12, 4.5, 0.2]} c={wallC} />
      <Box p={[(hx + -2.9) / 2, 3.3, L.WALL_Z]} s={[1.1, 2.4, 0.2]} c={wallC} />
      {/* corridor behind the door */}
      <Box p={[L.DOOR_X, 1, L.WALL_Z - 1.2]} s={[1.6, 2.2, 0.05]} c="#ffcf9a" e="#ff9b3d" ei={0.9} noShadow />
      {/* door frame */}
      <Box p={[hx - 0.04, 1.05, L.WALL_Z + 0.02]} s={[0.08, 2.1, 0.26]} c="#0f0f12" />
      <Box p={[-2.9 + 0.04, 1.05, L.WALL_Z + 0.02]} s={[0.08, 2.1, 0.26]} c="#0f0f12" />
      <Box p={[L.DOOR_X, 2.14, L.WALL_Z + 0.02]} s={[1.1, 0.08, 0.26]} c="#0f0f12" />
      {/* swinging door panel */}
      <group ref={doorRef} position={[hx, 0, L.WALL_Z + 0.05]}>
        <Box p={[0.5, 1.05, 0]} s={[1.0, 2.1, 0.07]} c="#6b4426" r={0.5} />
        <Box p={[0.5, 1.2, 0.04]} s={[0.7, 1.4, 0.02]} c="#5a3820" r={0.5} />
        <Box p={[0.88, 1.0, 0.07]} s={[0.04, 0.04, 0.08]} c="#c9ccd1" m={0.9} r={0.25} />
      </group>
      <Box p={[0, 0.07, L.WALL_Z + 0.12]} s={[24, 0.14, 0.04]} c="#121116" />

      {/* neon </> sign */}
      <group position={[1.7, 3.0, L.WALL_Z + 0.14]}>
        <Box p={[-0.55, 0.12, 0]} s={[0.42, 0.06, 0.05]} rot={[0, 0, 0.75]} c="#ffb067" e="#ff7a1a" ei={2.2} noShadow />
        <Box p={[-0.55, -0.12, 0]} s={[0.42, 0.06, 0.05]} rot={[0, 0, -0.75]} c="#ffb067" e="#ff7a1a" ei={2.2} noShadow />
        <Box p={[0, 0, 0]} s={[0.06, 0.8, 0.05]} rot={[0, 0, -0.28]} c="#ffb067" e="#ff7a1a" ei={2.2} noShadow />
        <Box p={[0.55, 0.12, 0]} s={[0.42, 0.06, 0.05]} rot={[0, 0, -0.75]} c="#ffb067" e="#ff7a1a" ei={2.2} noShadow />
        <Box p={[0.55, -0.12, 0]} s={[0.42, 0.06, 0.05]} rot={[0, 0, 0.75]} c="#ffb067" e="#ff7a1a" ei={2.2} noShadow />
        <pointLight color="#ff8a2a" intensity={3} distance={4} decay={2} position={[0, 0, 0.5]} />
      </group>

      {/* wall art */}
      <Box p={[-0.9, 2.5, L.WALL_Z + 0.12]} s={[1.5, 0.9, 0.04]} c="#121218" />
      <Box p={[-0.9, 2.5, L.WALL_Z + 0.15]} s={[1.3, 0.06, 0.02]} c="#ff7a1a" e="#ff7a1a" ei={0.6} noShadow />
      <Box p={[-1.1, 2.7, L.WALL_Z + 0.15]} s={[0.9, 0.04, 0.02]} c="#3b4350" noShadow />
      <Box p={[-1.1, 2.3, L.WALL_Z + 0.15]} s={[0.6, 0.04, 0.02]} c="#3b4350" noShadow />
    </group>
  );
}


function woodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#825335'; ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 420; i++) {
    ctx.strokeStyle = `rgba(${i % 2 ? '39,19,10' : '225,167,101'},${0.035 + (i % 7) * 0.012})`;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = i * 0.63 + Math.sin(x * 0.018 + i * 0.7) * (1 + i % 4);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function StudioDetails() {
  return <group>
    {/* Cool evening window balances the warm practical lighting. */}
    <Box p={[-1.8, 1.95, L.WALL_Z + 0.13]} s={[1.5, 2.7, 0.08]} c="#10151e" />
    <Box p={[-1.8, 1.95, L.WALL_Z + 0.18]} s={[1.35, 2.55, 0.02]} c="#284c76" e="#5796cc" ei={0.65} />
    <Box p={[-1.8, 1.95, L.WALL_Z + 0.22]} s={[0.055, 2.6, 0.05]} c="#10151e" />
    <Box p={[-1.8, 1.8, L.WALL_Z + 0.22]} s={[1.4, 0.055, 0.05]} c="#10151e" />
    <pointLight position={[-1.6, 2, -1.9]} color="#83baff" intensity={4} distance={6} />
    {[0.7, 1.65, 2.6].map((height, row) => <group key={height} position={[-0.35, height, -2.16]}>
      <Box s={[1.25, 0.065, 0.5]} c="#69472f" />
      <Box p={[0, -0.045, 0.18]} s={[1.1, 0.014, 0.025]} c="#ffb259" e="#ff8c32" ei={2} noShadow />
      {Array.from({length: 5}, (_, i) => <Box key={i} p={[-0.4 + i * 0.13, 0.19 + (i % 2) * 0.025, -0.04]} s={[0.09, 0.3 + (i % 2) * 0.05, 0.22]} c={['#ad593d','#253b4f','#ceaa75','#35313f','#66564b'][(i + row) % 5]} rot={[0, 0, i === 4 ? -0.16 : 0]} />)}
    </group>)}
    <Plant position={[0.1, 2.64, -2.12]} />
    <Plant position={[4.1, 1.95, -2.1]} />
    {/* Acoustic guitar with a shaped body, sound hole and six strings. */}
    <group position={[-1.25, 0.43, -1.45]} rotation={[0, -0.18, -0.12]}>
      {[0, 0.22].map((y, i) => <mesh key={y} position={[0, y, 0]} scale={[i ? 0.8 : 1, 1, 0.26]}><sphereGeometry args={[0.24, 32, 24]} /><meshStandardMaterial color="#b97837" roughness={0.4} /></mesh>)}
      <mesh position={[0, 0.19, 0.066]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.012, 32]} /><meshStandardMaterial color="#1e100b" /></mesh>
      <Box p={[0, 0.63, 0]} s={[0.07, 0.75, 0.055]} c="#432919" />
      <Box p={[0, 1.02, 0]} s={[0.11, 0.18, 0.06]} c="#b97837" />
      <Box p={[0, -0.05, 0.069]} s={[0.15, 0.035, 0.025]} c="#302018" />
      {Array.from({length: 6}, (_, i) => <Box key={i} p={[-0.025 + i * 0.01, 0.46, 0.08]} s={[0.0015, 1.03, 0.0015]} c="#d4c0a0" m={0.75} />)}
    </group>
  </group>;
}

function DeskSetup() {
  const wood = useMemo(woodTexture, []);
  useEffect(() => () => wood.dispose(), [wood]);
  const screenTex = useMemo(codeTexture, []);
  const mugTex = useMemo(mugTexture, []);
  const D = L.DESK_TOP / 1.305;
  return (
    <group position={L.DESK_POS} rotation={[0, L.DESK_YAW, 0]} scale={1.305}>
      {/* desk */}
      <mesh position={[0, D - 0.025, 0]}><boxGeometry args={[1.8, 0.05, 0.8]} /><meshStandardMaterial map={wood} roughness={0.48} /></mesh>
      {[-0.85, 0.85].map((x) =>
        [-0.35, 0.35].map((z) => (
          <Box key={`${x}${z}`} p={[x, (D - 0.05) / 2, z]} s={[0.04, D - 0.05, 0.04]} c="#15161a" m={0.8} r={0.35} />
        )),
      )}
      <Box p={[0, 0.2, -0.36]} s={[1.7, 0.03, 0.04]} c="#15161a" m={0.8} />

      {/* monitor */}
      <group position={[-0.2, D, -0.22]}>
        <Box p={[0, 0.01, 0]} s={[0.24, 0.02, 0.16]} c="#15161a" m={0.6} />
        <Box p={[0, 0.14, -0.02]} s={[0.04, 0.26, 0.03]} c="#15161a" m={0.6} />
        <Box p={[0, 0.4, 0]} s={[0.72, 0.42, 0.03]} c="#0b0b0e" r={0.4} />
        <mesh position={[0, 0.4, 0.017]}>
          <planeGeometry args={[0.68, 0.38]} />
          <meshStandardMaterial map={screenTex} emissiveMap={screenTex} emissive="#ffffff" emissiveIntensity={0.9} />
        </mesh>
        <pointLight color="#5aa2ff" intensity={0.8} distance={2.5} decay={2} position={[0, 0.4, 0.4]} />
      </group>

      {/* keyboard + mouse */}
      <group position={[-0.2, D, 0.17]}>
        <Box p={[0, 0.008, 0]} s={[0.52, 0.016, 0.19]} c="#1b1d22" r={0.5} />
        <Keys />
      </group>
      <Box p={[0.2, D + 0.015, 0.19]} s={[0.05, 0.028, 0.08]} c="#17181c" r={0.4} />

      {/* laptop */}
      <group position={[0.52, D, -0.02]} rotation={[0, 0.25, 0]}>
        <Box p={[0, 0.008, 0]} s={[0.34, 0.016, 0.23]} c="#c4c7cc" m={0.8} r={0.3} />
        <group position={[0, 0.016, -0.11]} rotation={[-0.32, 0, 0]}>
          <Box p={[0, 0.11, 0]} s={[0.34, 0.22, 0.012]} c="#c4c7cc" m={0.8} r={0.3} />
          <Box p={[0, 0.11, 0.008]} s={[0.31, 0.195, 0.004]} c="#1a1220" e="#ff7a1a" ei={0.55} noShadow />
        </group>
      </group>

      {/* mug */}
      <group position={[0.3, D, -0.27]}>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.042, 0.04, 0.09, 20]} />
          <meshStandardMaterial color="#111114" roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0.045, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.02, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#111114" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.0905, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
          <circleGeometry args={[0.036, 20]} />
          <meshStandardMaterial color="#3a2012" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.045, 0.0425]} userData={{ noShadow: true }}>
          <planeGeometry args={[0.07, 0.035]} />
          <meshBasicMaterial map={mugTex} transparent />
        </mesh>
      </group>

      {/* books + pen */}
      <Box p={[-0.68, D + 0.02, -0.26]} s={[0.2, 0.04, 0.15]} c="#8b2d2d" />
      <Box p={[-0.68, D + 0.06, -0.26]} s={[0.19, 0.04, 0.14]} c="#e8710a" />
      <Box p={[-0.68, D + 0.1, -0.26]} s={[0.18, 0.04, 0.14]} c="#2b3a55" />
      <mesh position={[-0.55, D + 0.006, 0.12]} rotation={[0, 0.6, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />
        <meshStandardMaterial color="#ff7a1a" />
      </mesh>

      {/* desk lamp (mirrored so it leans over the desk) */}
      <group position={[0.8, D, -0.3]} scale={[-1, 1, 1]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.02, 20]} />
          <meshStandardMaterial color="#0e0e11" metalness={0.6} roughness={0.35} />
        </mesh>
        <Box p={[0.09, 0.18, 0]} s={[0.02, 0.38, 0.02]} rot={[0, 0, -0.5]} c="#0e0e11" m={0.6} />
        <Box p={[0.34, 0.4, 0]} s={[0.02, 0.36, 0.02]} rot={[0, 0, -1.2]} c="#0e0e11" m={0.6} />
        <mesh position={[0.5, 0.42, 0]}>
          <coneGeometry args={[0.1, 0.13, 20, 1, true]} />
          <meshStandardMaterial color="#0e0e11" side={THREE.DoubleSide} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.38, 0]} userData={{ noShadow: true }}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#ffd9a0" emissive="#ffa63d" emissiveIntensity={3} />
        </mesh>
        <pointLight color="#ff9a3c" intensity={2.2} distance={4} decay={2} position={[0.5, 0.3, 0.05]} />
      </group>

      {/* CPU tower beside the desk */}
      <group position={[-1.1, 0, -0.1]}>
        <Box p={[0, 0.23, 0]} s={[0.22, 0.46, 0.42]} c="#14151a" r={0.4} />
        <mesh position={[0.112, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} userData={{ noShadow: true }}>
          <torusGeometry args={[0.07, 0.01, 8, 28]} />
          <meshStandardMaterial color="#ffb067" emissive="#ff7a1a" emissiveIntensity={2.4} />
        </mesh>
        <Box p={[0.112, 0.3, 0]} s={[0.01, 0.05, 0.05]} c="#ffb067" e="#ff7a1a" ei={2} noShadow />
      </group>
    </group>
  );
}

function Plant({ position }: { position: V3 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return { a, tilt: 0.5 + (i % 3) * 0.2, h: 0.35 + (i % 4) * 0.07 };
      }),
    [],
  );
  const foliage = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (foliage.current) {
      foliage.current.rotation.z = Math.sin(clock.elapsedTime * 0.65 + position[0]) * 0.018;
      foliage.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.012;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.17, 0.12, 0.34, 18]} />
        <meshStandardMaterial color="#d9d2c5" roughness={0.8} />
      </mesh>
      <group ref={foliage}>
      {leaves.map((l, i) => (
        <mesh
          key={i}
          position={[Math.sin(l.a) * 0.12, 0.34 + l.h * 0.5, Math.cos(l.a) * 0.12]}
          rotation={[Math.cos(l.a) * l.tilt, 0, -Math.sin(l.a) * l.tilt]}
          scale={[0.55, 1, 0.18]}
        >
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color={i % 2 ? "#3f7a34" : "#5b9a3f"} roughness={0.6} />
        </mesh>
      ))}
      </group>
    </group>
  );
}

const Chair = ({ chairRef }: { chairRef: React.RefObject<THREE.Group | null> }) => (
  <group ref={chairRef} position={[L.CHAIR_POS.x, 0, L.CHAIR_POS.z]} scale={1.305}>
    {/* star base + wheels */}
    {[0, 1, 2, 3, 4].map((i) => (
      <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
        <Box p={[0.14, 0.06, 0]} s={[0.3, 0.025, 0.04]} c="#0e0e11" m={0.6} />
        <Box p={[0.29, 0.03, 0]} s={[0.04, 0.05, 0.04]} c="#1a1a1e" />
      </group>
    ))}
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.28, 10]} />
      <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
    </mesh>
    {/* seat (top = SEAT_TOP) */}
    <Box p={[0, L.SEAT_TOP / 1.305 - 0.04, 0]} s={[0.52, 0.08, 0.5]} c="#141418" r={0.55} />
    <Box p={[0, L.SEAT_TOP / 1.305 - 0.04, 0.255]} s={[0.46, 0.02, 0.01]} c="#ff7a1a" e="#ff7a1a" ei={0.4} noShadow />
    {/* back */}
    <Box p={[0, 0.72, -0.27]} s={[0.5, 0.7, 0.09]} c="#141418" r={0.55} rot={[-0.08, 0, 0]} />
    <Box p={[0, 0.72, -0.22]} s={[0.1, 0.52, 0.02]} c="#ff7a1a" e="#ff7a1a" ei={0.35} noShadow rot={[-0.08, 0, 0]} />
    <Box p={[0, 1.15, -0.29]} s={[0.3, 0.16, 0.08]} c="#141418" r={0.55} />
    {/* arm rests */}
    {[-0.3, 0.3].map((x) => (
      <group key={x}>
        <Box p={[x, 0.45, -0.02]} s={[0.04, 0.2, 0.04]} c="#0e0e11" />
        <Box p={[x, 0.56, 0.02]} s={[0.07, 0.04, 0.3]} c="#141418" r={0.5} />
      </group>
    ))}
  </group>
);

function Backpack({ bagRef }: { bagRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={bagRef} position={[L.BAG_REST.x, L.BAG_REST.y, L.BAG_REST.z]} visible={false}>
      <Box s={[0.34, 0.46, 0.2]} c="#bd642e" r={0.95} />
      <Box p={[0, -0.085, -0.115]} s={[0.27, 0.22, 0.055]} c="#a45125" r={0.95} />
      <Box p={[0, 0.025, -0.146]} s={[0.24, 0.009, 0.007]} c="#d9bda1" m={0.65} />
      <Box p={[0.09, 0.008, -0.154]} s={[0.012, 0.035, 0.009]} c="#303139" m={0.6} />
      {/* Straps face the wearer's back; the pocket faces outward. */}
      {[-0.105, 0.105].map(x => <mesh key={x} position={[x, 0.01, 0.155]} scale={[0.8, 1.75, 1]}>
        <torusGeometry args={[0.082, 0.013, 8, 24]} />
        <meshStandardMaterial color="#29282a" roughness={0.95} />
      </mesh>)}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.045, 0.012, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#25252b" roughness={0.85} />
      </mesh>

    </group>
  );
}

/* ------------------------------------------------------------------ */
/* camera                                                               */
/* ------------------------------------------------------------------ */

function CameraRig({ pose }: { pose: React.MutableRefObject<Pose> }) {
  const baseZ = useRef(7.5);
  const look = useMemo(() => new THREE.Vector3(), []);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // make sure the whole room (door to desk, ~8.8m) fits horizontally
    const z = Math.max(7.5, 4.5 / (tanHalf * aspect) - 1.0);
    baseZ.current = z;
    camera.position.set(0, 2.0, z);
    camera.lookAt(0.1, 0.95, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  useFrame((_, dt) => {
    const seated = pose.current.sit;
    const wide = size.width / size.height > 1.2;
    const focus = seated * (wide ? 1 : 0.35);
    camera.position.x = damp(camera.position.x, focus * 1.65, 1.1, dt);
    camera.position.y = damp(camera.position.y, 2 - focus * 0.5, 1.1, dt);
    camera.position.z = damp(camera.position.z, baseZ.current - focus * 3.3, 1.1, dt);
    look.set(0.1 + focus * 1.65, 0.95 + focus * 0.08, -focus * 0.7);
    camera.lookAt(look);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* world + animation controller                                         */
/* ------------------------------------------------------------------ */

function World(props: SceneProps) {
  const P = useRef(props);
  P.current = props;

  const pose = useRef<Pose>(makePose());
  const doorRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const chairRef = useRef<THREE.Group>(null);
  const bagRef = useRef<THREE.Group>(null);
  const bagTarget = useRef(new THREE.Vector3());
  const rootRef = useRef<THREE.Group>(null);

  const st = useRef({
    stage: "wait" as Stage,
    t: 0,
    seg: 0,
    yaw: 0,
    yawStart: 0,
    seatYaw: L.CHAIR_INIT_YAW,
    att: 0,
    prevAtt: false,
    waveT: 99,
    pos: PATH[0].clone(),
    bagFrom: new THREE.Vector3(),
    bagYawFrom: 0,
  });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // cast/receive shadows on everything except glow planes
  useEffect(() => {
    rootRef.current?.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && !mesh.userData.noShadow) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, []);

  const goto = (s: Stage) => {
    const S = st.current;
    S.stage = s;
    S.t = 0;
    if (s === "turn") S.yawStart = S.yaw;
    P.current.onStage(s);
  };

  const carryPos = (out: THREE.Vector3, pos: THREE.Vector3, yaw: number) =>
    out.set(0, 1.26, -0.2).applyAxisAngle(Y, yaw).add(pos);

  const finishInstantly = () => {
    const S = st.current;
    S.seatYaw = L.WORK_YAW;
    S.pos.copy(L.CHAIR_POS);
    pose.current.walk = 0;
    pose.current.sit = 1;
    pose.current.type = 1;
    if (doorRef.current) doorRef.current.rotation.y = -DOOR_OPEN;
    if (bagRef.current) {
      bagRef.current.position.copy(L.BAG_REST);
      bagRef.current.rotation.y = 0.6;
      bagRef.current.visible = true;
    }
    if (avatarRef.current) avatarRef.current.visible = true;
    S.stage = "seated";
    P.current.onStage("seated");
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const S = st.current;
    const p = pose.current;
    const av = avatarRef.current;
    const chair = chairRef.current;
    const bag = bagRef.current;
    const door = doorRef.current;
    if (!av || !chair || !bag || !door) return;

    S.t += dt;
    p.time += dt;

    if (P.current.skip && S.stage !== "seated") finishInstantly();

    let walkTarget = 0;

    switch (S.stage) {
      case "wait":
        av.visible = false;
        if (P.current.start) goto("door");
        break;

      case "door":
        door.rotation.y = -DOOR_OPEN * ease(S.t / 1.6);
        if (S.t > 0.9) av.visible = true;
        S.pos.copy(PATH[0]);
        bag.visible = true;
        if (S.t > 1.8) goto("walk");
        break;

      case "walk": {
        const remaining = S.pos.distanceTo(L.STAND_POINT);
        walkTarget = S.seg === PATH.length - 2 ? THREE.MathUtils.clamp(remaining / 0.55, 0.15, 1) : 1;
        const target = PATH[S.seg + 1];
        tmp.copy(target).sub(S.pos);
        tmp.y = 0;
        const dist = tmp.length();
        const step = WALK_SPEED * walkTarget * dt;
        if (dist <= step) {
          S.pos.copy(target);
          S.seg++;
          if (S.seg >= PATH.length - 1) {
            walkTarget = 0;
            goto("turn");
            break;
          }
        } else {
          tmp.normalize();
          S.pos.addScaledVector(tmp, step);
          const heading = Math.atan2(tmp.x, tmp.z);
          // shortest-angle damp
          let d = heading - S.yaw;
          d = Math.atan2(Math.sin(d), Math.cos(d));
          S.yaw += d * Math.min(1, dt * 8);
        }
        break;
      }

      case "turn": {
        // turn round (via the camera) so his back faces the chair, drop the bag
        const d = ((((S.yawStart + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        S.yaw = S.yawStart - d * ease(S.t / 0.8);
        if (S.t > 1.15 && p.walk < 0.01) {
          p.walk = 0;
          goto("bag");
        }
        break;
      }

      case "bag": {
        // Reach for the handle, remove the bag, lower it, release, then rise.
        p.bagReach = ease(S.t / 0.55) * (1 - ease((S.t - 2.65) / 0.45));
        p.bagBend = ease((S.t - 1.2) / 1.25) * (1 - ease((S.t - 2.8) / 0.55));
        if (S.t > 3.4) {
          p.bagReach = 0;
          p.bagBend = 0;
          goto("sit");
        }
        break;
      }

      case "sit": {
        const e = ease(S.t / 1.4);
        S.yaw = -Math.PI / 2;
        S.pos.lerpVectors(L.STAND_POINT, L.CHAIR_POS, e);
        p.sit = e;
        if (S.t > 1.65) goto("swivel");
        break;
      }

      case "swivel": {
        const e = ease(S.t / 1.2);
        S.seatYaw = THREE.MathUtils.lerp(L.CHAIR_INIT_YAW, L.WORK_YAW - Math.PI * 2, e);
        S.yaw = S.seatYaw;
        p.type = 0;
        if (S.t > 1.2) {
          S.seatYaw = L.WORK_YAW;
          S.yaw = S.seatYaw;
          goto("seated");
        }
        break;
      }

      case "seated": {
        const target = P.current.attention ? 1 : 0;
        S.att = damp(S.att, target, 3, dt);
        if (P.current.attention && !S.prevAtt) S.waveT = 0;
        S.prevAtt = P.current.attention;
        S.waveT += dt;
        const wv = S.att > 0.6 ? clamp01(Math.min(S.waveT, 2.4 - S.waveT) / 0.35) : 0;
        p.wave = damp(p.wave, wv, 14, dt);
        p.attention = S.att;
        p.type = damp(p.type, clamp01(1 - S.att * 1.6), 4, dt);
        S.seatYaw = THREE.MathUtils.lerp(L.WORK_YAW, L.CAM_YAW, S.att);
        S.yaw = S.seatYaw;
        S.pos.copy(L.CHAIR_POS);
        break;
      }
    }

    // continuous values
    p.walk = S.stage === "sit" || S.stage === "swivel" || S.stage === "seated"
      ? 0 : damp(p.walk, walkTarget, 10, dt);
    p.walkPhase += dt * 7.5 * p.walk;
    p.talk = damp(p.talk, P.current.talking ? 1 : 0, 10, dt);
    if (S.stage === "wait") p.type = 0;

    // avatar + chair transforms
    av.position.copy(S.pos);
    av.rotation.y = S.yaw;
    chair.rotation.y =
      S.stage === "swivel" || S.stage === "seated" ? S.seatYaw : L.CHAIR_INIT_YAW;

    // Keep the bag on the back until the hand reaches its handle.
    if (S.stage === "door" || S.stage === "walk" || S.stage === "turn") {
      carryPos(bag.position, S.pos, S.yaw);
      bag.position.y += Math.sin(p.walkPhase * 2) * 0.012 * p.walk;
      bag.rotation.set(0, S.yaw, Math.sin(p.walkPhase) * 0.025 * p.walk);
      S.bagFrom.copy(bag.position);
      S.bagYawFrom = S.yaw;
    } else if (S.stage === "bag") {
      // First bring it around the shoulder, then lower it without throwing it.
      tmp.set(-0.38, 1.15, 0.12).applyAxisAngle(Y, S.yaw).add(S.pos);
      const remove = ease((S.t - 0.55) / 0.65);
      const lower = ease((S.t - 1.2) / 1.35);
      bag.position.lerpVectors(S.bagFrom, tmp, remove).lerp(L.BAG_REST, lower);
      bag.rotation.set(Math.sin(Math.PI * lower) * 0.12,
        THREE.MathUtils.lerp(S.bagYawFrom, 0.6, lower),
        -Math.sin(Math.PI * remove) * 0.14 * (1 - lower));
    }
    bagTarget.current.set(0, 0.285, 0).applyEuler(bag.rotation).add(bag.position);

  });

  return (
    <group ref={rootRef}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0d0c11"]} />
      <fog attach="fog" args={["#090b10", 14, 30]} />

      <ambientLight intensity={0.5} color="#b2a6a0" />
      <hemisphereLight args={["#a9a4d8", "#2a1d12", 0.35]} />
      <directionalLight
        position={[-4, 6, 6]}
        intensity={1.6}
        color="#ffd9b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[2, 3, -3]} color="#ff994f" intensity={2.4} />
      <pointLight position={[4.5, 2.4, -2]} color="#4a7bff" intensity={4} distance={9} decay={2} />

      <Room doorRef={doorRef} />
      <DeskSetup />
      <StudioDetails />
      <Plant position={[4.1, 0, -2.0]} />
      <Chair chairRef={chairRef} />
      <Backpack bagRef={bagRef} />

      <group ref={avatarRef} visible={false}>
        <Avatar pose={pose} bagTarget={bagTarget} />
      </group>

      {/* invisible hit-box so the seated avatar can be hovered / clicked */}
      <mesh
        position={[L.CHAIR_POS.x, 0.9, L.CHAIR_POS.z]}
        userData={{ noShadow: true }}
        onClick={(e) => {
          if (st.current.stage !== "seated") return;
          e.stopPropagation();
          P.current.onAvatarClick();
        }}
        onPointerOver={(e) => {
          if (st.current.stage !== "seated") return;
          e.stopPropagation();
          P.current.onAvatarHover(true);
        }}
        onPointerOut={() => P.current.onAvatarHover(false)}
      >
        <boxGeometry args={[1.2, 1.9, 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 32, position: [0, 2, 7.5], near: 0.1, far: 80 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      onCreated={() => props.onReady()}
    >
      <World {...props} />
    </Canvas>
  );
}
