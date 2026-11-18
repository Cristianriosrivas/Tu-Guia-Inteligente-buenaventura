import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TINTAS, crearOla, crearTinta } from './tinta';

/* ------------------------------------------------------------------
   Ballena jorobada construida por código: torno para el cuerpo,
   aletas pectorales largas (blancas, como las reales) y caudal extruida.
   ------------------------------------------------------------------ */

const LARGO = 3.8;
const PERIODO = 11; // segundos por salto

function geometriaCuerpo() {
  const perfil = [
    [0.0, 0.0],
    [0.24, 0.04],
    [0.4, 0.18],
    [0.53, 0.5],
    [0.62, 0.95],
    [0.65, 1.35],
    [0.62, 1.8],
    [0.52, 2.3],
    [0.38, 2.75],
    [0.22, 3.15],
    [0.12, 3.5],
    [0.08, 3.72],
    [0.0, LARGO],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(perfil, 40);
  // El torno crece en Y: lo acostamos sobre X (cabeza en 0, cola en +LARGO).
  g.rotateZ(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    // Vientre más plano y cabeza aplanada como la de la jorobada.
    if (y < 0) y *= 0.82;
    const cabeza = THREE.MathUtils.smoothstep(1.2, 0, x);
    y *= 1 - cabeza * 0.28;
    z *= 0.9 + cabeza * 0.1;
    pos.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  return g;
}

function geometriaAleta() {
  const g = new THREE.SphereGeometry(1, 24, 12);
  g.scale(1.15, 0.05, 0.17);
  g.translate(1.0, 0, 0);
  return g;
}

function geometriaCaudal() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.3, 0.28, 0.62, 0.95);
  s.quadraticCurveTo(0.6, 0.55, 0.78, 0.18);
  s.lineTo(0.66, 0);
  s.lineTo(0.78, -0.18);
  s.quadraticCurveTo(0.6, -0.55, 0.62, -0.95);
  s.quadraticCurveTo(0.3, -0.28, 0, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 18 });
  g.translate(0, 0, -0.025);
  g.rotateX(Math.PI / 2); // aletas horizontales
  g.computeVertexNormals();
  return g;
}

/* ---------- Salpicadura ---------- */

const N_GOTAS = 160;

const gotaVertex = /* glsl */ `
  attribute float aVida;
  uniform float uPixel;
  varying float vVida;
  void main() {
    vVida = aVida;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (9.0 + 10.0 * aVida) * uPixel * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const gotaFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vVida;
  void main() {
    if (vVida <= 0.0) discard;
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    gl_FragColor = vec4(uColor, 1.0);
    #include <colorspace_fragment>
  }
`;

function Salpicadura({ disparo }: { disparo: React.RefObject<{ x: number; y: number; fuerza: number } | null> }) {
  const pixel = useThree((s) => s.viewport.dpr);
  const datos = useMemo(() => {
    const posiciones = new Float32Array(N_GOTAS * 3);
    const vidas = new Float32Array(N_GOTAS);
    const vel = new Float32Array(N_GOTAS * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    g.setAttribute('aVida', new THREE.BufferAttribute(vidas, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: gotaVertex,
      fragmentShader: gotaFragment,
      uniforms: { uColor: { value: TINTAS.papel }, uPixel: { value: pixel } },
    });
    return { g, m, posiciones, vidas, vel };
  }, [pixel]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const { posiciones, vidas, vel, g } = datos;
    const nuevo = disparo.current;
    if (nuevo) {
      disparo.current = null;
      let lanzadas = 0;
      for (let i = 0; i < N_GOTAS && lanzadas < N_GOTAS * nuevo.fuerza; i++) {
        if (vidas[i] > 0) continue;
        lanzadas++;
        const a = Math.random() * Math.PI * 2;
        const r = Math.random();
        posiciones[i * 3] = nuevo.x + Math.cos(a) * r * 0.9;
        posiciones[i * 3 + 1] = nuevo.y;
        posiciones[i * 3 + 2] = Math.sin(a) * r * 0.5;
        vel[i * 3] = Math.cos(a) * (0.6 + Math.random() * 2.2);
        vel[i * 3 + 1] = 2.2 + Math.random() * 4.6 * nuevo.fuerza;
        vel[i * 3 + 2] = Math.sin(a) * 0.8;
        vidas[i] = 1;
      }
    }
    for (let i = 0; i < N_GOTAS; i++) {
      if (vidas[i] <= 0) continue;
      vel[i * 3 + 1] -= 9.5 * d;
      posiciones[i * 3] += vel[i * 3] * d;
      posiciones[i * 3 + 1] += vel[i * 3 + 1] * d;
      posiciones[i * 3 + 2] += vel[i * 3 + 2] * d;
      vidas[i] -= d * 0.75;
    }
    g.attributes.position.needsUpdate = true;
    g.attributes.aVida.needsUpdate = true;
  });

  return <points geometry={datos.g} material={datos.m} frustumCulled={false} renderOrder={3} />;
}

/* ---------- Ballena y mar ---------- */

const suave = (t: number) => t * t * (3 - 2 * t);
const salida = (t: number) => 1 - Math.pow(1 - t, 3);

interface Props {
  quieta: boolean;
  puntero: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
}

function Mundo({ quieta, puntero, scroll }: Props) {
  const { viewport, size } = useThree();
  const pixel = viewport.dpr;
  const ancho = viewport.width;
  const alto = viewport.height;
  const movil = size.width < 760;

  const exterior = useRef<THREE.Group>(null);
  const cabeceo = useRef<THREE.Group>(null);
  const giro = useRef<THREE.Group>(null);
  const caudal = useRef<THREE.Group>(null);
  const disparo = useRef<{ x: number; y: number; fuerza: number } | null>(null);
  const estado = useRef({ fase: quieta ? 0.4 : 0.05, yaw: 0, salpico: false, salio: false, tiempo: 0 });

  const geos = useMemo(() => ({ cuerpo: geometriaCuerpo(), aleta: geometriaAleta(), caudal: geometriaCaudal() }), []);
  const mats = useMemo(
    () => ({
      cuerpo: crearTinta({ vientre: true, pixel }),
      aleta: crearTinta({ aclarar: 0.42, pixel }),
      caudal: crearTinta({ aclarar: 0.05, pixel }),
    }),
    [pixel],
  );

  const nivelAgua = -alto / 2 + (movil ? 2.05 : 0.72);
  const escala = movil ? 0.5 : Math.min(1.05, ancho / 12);
  const xBase = movil ? ancho * 0.0 : ancho * 0.16;

  const olas = useMemo(
    () => [
      { mat: crearOla(TINTAS.ola, TINTAS.ola, 0.0, 0.14, 0.0), z: 0.4, y: 0.06, fase: 0 },
      { mat: crearOla(TINTAS.hondo, TINTAS.papel, 1.7, 0.2, 0.016), z: 1.1, y: -0.18, fase: 1.7 },
    ],
    [],
  );

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const e = estado.current;
    e.tiempo += d;
    olas.forEach((o) => (o.mat.uniforms.uTiempo.value = quieta ? 0.6 : e.tiempo));
    if (!exterior.current || !cabeceo.current || !giro.current || !caudal.current) return;

    if (!quieta) e.fase = (e.fase + d / PERIODO) % 1;
    const u = e.fase;
    const pico = nivelAgua + (movil ? 2.45 : 3.4);
    const hundido = nivelAgua - 2.6;

    let y = hundido;
    let cab = -1.2;
    let rol = 0;
    let dx = 0.6;
    if (u < 0.16) {
      y = hundido;
      cab = -1.2;
      e.salpico = false;
      e.salio = false;
    } else if (u < 0.5) {
      const s = (u - 0.16) / 0.34;
      y = THREE.MathUtils.lerp(hundido, pico, salida(s));
      cab = THREE.MathUtils.lerp(-1.38, -0.42, suave(s));
      rol = THREE.MathUtils.lerp(0, 2.4, suave(s));
      dx = THREE.MathUtils.lerp(0.6, -0.1, s);
      if (!e.salio && y > nivelAgua - 0.6) {
        e.salio = true;
        if (!quieta) disparo.current = { x: xBase + dx * escala, y: nivelAgua, fuerza: 0.45 };
      }
    } else if (u < 0.72) {
      const s = (u - 0.5) / 0.22;
      y = pico - (pico - (hundido - 0.4)) * s * s;
      cab = THREE.MathUtils.lerp(-0.42, 0.75, s);
      rol = THREE.MathUtils.lerp(2.4, 3.3, s);
      dx = THREE.MathUtils.lerp(-0.1, -0.85, s);
      if (!e.salpico && y < nivelAgua + 0.2) {
        e.salpico = true;
        if (!quieta) disparo.current = { x: xBase + dx * escala, y: nivelAgua, fuerza: 1 };
      }
    } else {
      y = hundido - 0.4;
      cab = 0.75;
      rol = 3.3;
      dx = -0.85;
    }

    const p = puntero.current ?? { x: 0, y: 0 };
    const objetivo = quieta ? 0.35 : 0.25 + p.x * 0.45;
    e.yaw += (objetivo - e.yaw) * (1 - Math.exp(-d * 3));
    const bajada = (scroll.current ?? 0) * 2.2;

    exterior.current.position.set(xBase + dx * escala, y - bajada, 0);
    exterior.current.rotation.y = e.yaw;
    exterior.current.scale.setScalar(escala);
    cabeceo.current.rotation.z = cab;
    giro.current.rotation.x = rol;
    caudal.current.rotation.z = Math.sin(e.tiempo * 3.2) * (quieta ? 0 : 0.18);
  });

  return (
    <>
      <group ref={exterior}>
        <group ref={cabeceo}>
          <group ref={giro} position={[-LARGO * 0.45, 0, 0]}>
            <mesh geometry={geos.cuerpo} material={mats.cuerpo} />
            {/* Aletas pectorales: largas y blancas */}
            <mesh geometry={geos.aleta} material={mats.aleta} position={[1.0, -0.32, 0.48]} rotation={[0.55, -0.62, -0.75]} />
            <mesh geometry={geos.aleta} material={mats.aleta} position={[1.0, -0.32, -0.48]} rotation={[-0.55, 0.62, -0.75]} />
            {/* Aleta dorsal pequeña */}
            <mesh material={mats.caudal} position={[2.55, 0.33, 0]} rotation={[0, 0, -0.5]}>
              <coneGeometry args={[0.1, 0.32, 10]} />
            </mesh>
            <group ref={caudal} position={[LARGO - 0.04, 0, 0]}>
              <mesh geometry={geos.caudal} material={mats.caudal} />
            </group>
          </group>
        </group>
      </group>

      <Salpicadura disparo={disparo} />

      {olas.map((o, i) => (
        <mesh key={i} material={o.mat} position={[0, nivelAgua + o.y - 3, o.z]} renderOrder={i + 1}>
          <planeGeometry args={[ancho * 1.6, 6, 220, 1]} />
        </mesh>
      ))}
    </>
  );
}

export default function Escena({ quieta }: { quieta: boolean }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const puntero = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mover = (e: PointerEvent) => {
      puntero.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    const desplazar = () => {
      const h = contenedor.current?.parentElement?.offsetHeight || window.innerHeight;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('scroll', desplazar, { passive: true });
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (contenedor.current) obs.observe(contenedor.current);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('scroll', desplazar);
      obs.disconnect();
    };
  }, []);

  return (
    <div ref={contenedor} className="escena" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 12], fov: 30 }}
        frameloop={visible ? (quieta ? 'demand' : 'always') : 'never'}
      >
        <Mundo quieta={quieta} puntero={puntero} scroll={scroll} />
      </Canvas>
    </div>
  );
}
