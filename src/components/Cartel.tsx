import { lazy, Suspense, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Cenefa } from './Cenefa';
import { useCondiciones, useMovimientoReducido } from '../lib/estado';
import { textoClima } from '../lib/mar';
import { esTemporadaBallenas } from '../lib/planificador';
import { TEMPORADA_BALLENAS, type Interes } from '../data/guia';
import './cartel.css';

const Escena = lazy(() => import('./ballena/Escena'));

const OPCIONES_DIAS = [1, 2, 3, 5];
const OPCIONES_INTERES: { id: Interes; nombre: string }[] = [
  { id: 'ballenas', nombre: 'Ballenas' },
  { id: 'playa', nombre: 'Playa' },
  { id: 'naturaleza', nombre: 'Selva' },
  { id: 'cultura', nombre: 'Cultura' },
  { id: 'gastronomia', nombre: 'Comida' },
];

function webglDisponible() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function diasParaBallenas(hoy = new Date()) {
  const mes = hoy.getMonth() + 1;
  if (esTemporadaBallenas(mes)) return 0;
  const anio = mes > TEMPORADA_BALLENAS.fin ? hoy.getFullYear() + 1 : hoy.getFullYear();
  const inicio = new Date(anio, TEMPORADA_BALLENAS.inicio - 1, 1);
  return Math.ceil((inicio.getTime() - hoy.getTime()) / 86_400_000);
}

export function Cartel({ onArmarPlan }: { onArmarPlan: (dias: number, intereses: Interes[]) => void }) {
  const reducido = useMovimientoReducido();
  const [con3D] = useState(webglDisponible);
  const [dias, setDias] = useState(2);
  const [intereses, setIntereses] = useState<Interes[]>(['ballenas', 'playa']);
  const { datos, cargando } = useCondiciones();
  const faltan = diasParaBallenas();

  const alternar = (i: Interes) => setIntereses((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));

  const registro = reducido
    ? {}
    : {
        initial: { x: -14, y: 8 },
        animate: { x: 0, y: 0 },
        transition: { duration: 1.1, ease: [0.23, 1, 0.32, 1] as const, delay: 0.15 },
      };

  return (
    <section id="inicio" className="cartel campo-mar" aria-labelledby="titulo-cartel">
      <div className="lamina">
        <div className="sol" aria-hidden="true" />
        <h1 id="titulo-cartel" className="titular" aria-label="Buenaventura: guía turística inteligente del Pacífico colombiano">
          <span className="linea linea-buena" data-texto="Buena">
            <motion.span className="registro" aria-hidden="true" {...registro}>
              Buena
            </motion.span>
            <span className="tinta">Buena</span>
          </span>
          <span className="linea linea-ventura" data-texto="ventura">
            <motion.span className="registro" aria-hidden="true" {...registro}>
              ventura
            </motion.span>
            <span className="tinta">ventura</span>
          </span>
        </h1>

        {con3D && (
          <Suspense fallback={null}>
            <Escena quieta={reducido} />
          </Suspense>
        )}

        <p className="bajada">
          Ballenas jorobadas, manglares, playas de arena oscura y la marimba del Pacífico colombiano. Mira el mar de hoy y arma tu viaje en
          un minuto.
        </p>
      </div>

      <Cenefa />

      <div className="banda campo-papel">
        <div className="celda-dato">
          <span className="dato-etiqueta">Ahora en la bahía</span>
          <strong className="dato-valor num" aria-live="polite">
            {cargando ? '—' : `${datos.temperatura}°`}
          </strong>
          <span className="dato-nota">{cargando ? 'Cargando clima…' : datos.enVivo ? textoClima(datos.codigo) : 'Promedio: cálido y húmedo'}</span>
        </div>
        <div className="celda-dato">
          <span className="dato-etiqueta">Oleaje</span>
          <strong className="dato-valor num">{datos.oleaje != null ? `${datos.oleaje.toFixed(1).replace('.', ',')} m` : cargando ? '—' : 's/d'}</strong>
          <span className="dato-nota">{datos.temperaturaMar != null ? `Agua a ${datos.temperaturaMar} °C` : 'Modelo Open-Meteo'}</span>
        </div>
        <div className="celda-dato">
          <span className="dato-etiqueta">Atardecer</span>
          <strong className="dato-valor num">{datos.atardecer}</strong>
          <span className="dato-nota">Amanece {datos.amanecer}</span>
        </div>
        <div className="celda-dato">
          <span className="dato-etiqueta">Ballenas</span>
          <strong className="dato-valor">{faltan === 0 ? 'YA LLEGARON' : 'JUL–OCT'}</strong>
          <span className="dato-nota num">{faltan === 0 ? 'Temporada abierta' : `Faltan ${faltan} días`}</span>
        </div>

        <form
          className="celda-plan campo-manglar"
          onSubmit={(e) => {
            e.preventDefault();
            onArmarPlan(dias, intereses.length ? intereses : ['playa']);
          }}
        >
          <h2 className="plan-titulo">Arma tu viaje</h2>
          <fieldset className="plan-fila">
            <legend className="solo-lectores">Días de viaje</legend>
            {OPCIONES_DIAS.map((d) => (
              <button key={d} type="button" className="chip" aria-pressed={dias === d} onClick={() => setDias(d)}>
                <span className="num">{d}</span> {d === 1 ? 'día' : 'días'}
              </button>
            ))}
          </fieldset>
          <fieldset className="plan-fila">
            <legend className="solo-lectores">Qué te gusta</legend>
            {OPCIONES_INTERES.map((o) => (
              <button key={o.id} type="button" className="chip" aria-pressed={intereses.includes(o.id)} onClick={() => alternar(o.id)}>
                {o.nombre}
              </button>
            ))}
          </fieldset>
          <button type="submit" className="boton boton-achiote plan-boton">
            Armar mi plan <ArrowRight size={20} strokeWidth={2.6} />
          </button>
        </form>
      </div>
    </section>
  );
}
