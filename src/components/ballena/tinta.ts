import * as THREE from 'three';

// Material "tinta": sombreado posterizado en tres tintas planas con trama de medio tono,
// para que la geometría 3D se vea impresa en serigrafía.

export const TINTAS = {
  hondo: new THREE.Color('#0a2140'),
  mar: new THREE.Color('#0f2f57'),
  ola: new THREE.Color('#2a6fa8'),
  papel: new THREE.Color('#f4ecdc'),
  sol: new THREE.Color('#f2b51d'),
  achiote: new THREE.Color('#bf3519'),
};

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vObjN;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObjN = normal;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uOscuro;
  uniform vec3 uMedio;
  uniform vec3 uClaro;
  uniform vec3 uLuz;
  uniform float uVientre;
  uniform float uAclarar;
  uniform float uPixel;
  varying vec3 vNormal;
  varying vec3 vObjN;
  varying vec3 vPos;

  float trama(vec2 p, float cobertura) {
    float celda = 6.5 * uPixel;
    mat2 r = mat2(0.7071, -0.7071, 0.7071, 0.7071);
    vec2 q = r * p / celda;
    vec2 c = fract(q) - 0.5;
    return step(length(c), sqrt(clamp(cobertura, 0.0, 1.0)) * 0.64);
  }

  void main() {
    vec3 n = normalize(vNormal);
    float t = dot(n, normalize(uLuz)) * 0.5 + 0.5;
    // Vientre claro: la ballena jorobada tiene la garganta y el vientre blancos.
    float vientre = uVientre * smoothstep(-0.15, -0.55, vObjN.y) * smoothstep(3.0, 2.2, vPos.x);
    t = t + vientre * 0.42 + uAclarar;
    vec3 col;
    if (t > 0.86) col = uClaro;
    else if (t > 0.58) col = mix(uMedio, uClaro, trama(gl_FragCoord.xy, (t - 0.58) / 0.28));
    else if (t > 0.34) col = uMedio;
    else if (t > 0.2) col = mix(uOscuro, uMedio, trama(gl_FragCoord.xy, (t - 0.2) / 0.14));
    else col = uOscuro;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crearTinta(opciones: { vientre?: boolean; aclarar?: number; pixel: number }) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uOscuro: { value: TINTAS.hondo },
      uMedio: { value: TINTAS.ola },
      uClaro: { value: TINTAS.papel },
      uLuz: { value: new THREE.Vector3(-0.35, 0.9, 0.55) },
      uVientre: { value: opciones.vientre ? 1 : 0 },
      uAclarar: { value: opciones.aclarar ?? 0 },
      uPixel: { value: opciones.pixel },
    },
  });
}

/* ---------- Olas impresas: cintas con borde de espuma ---------- */

const olaVertex = /* glsl */ `
  uniform float uTiempo;
  uniform float uFase;
  uniform float uAmplitud;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float borde = smoothstep(0.0, 1.0, uv.y);
    p.y += borde * (sin(p.x * 0.9 + uTiempo * 0.9 + uFase) * uAmplitud
                  + sin(p.x * 2.1 - uTiempo * 1.3 + uFase * 2.0) * uAmplitud * 0.35);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const olaFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEspuma;
  uniform float uGrosor;
  varying vec2 vUv;
  void main() {
    vec3 c = vUv.y > 1.0 - uGrosor ? uEspuma : uColor;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

export function crearOla(color: THREE.Color, espuma: THREE.Color, fase: number, amplitud: number, grosor: number) {
  return new THREE.ShaderMaterial({
    vertexShader: olaVertex,
    fragmentShader: olaFragment,
    uniforms: {
      uTiempo: { value: 0 },
      uFase: { value: fase },
      uAmplitud: { value: amplitud },
      uColor: { value: color },
      uEspuma: { value: espuma },
      uGrosor: { value: grosor },
    },
  });
}
