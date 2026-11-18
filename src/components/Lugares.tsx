import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutGrid, LocateFixed, Map as MapaIcono, X } from 'lucide-react';
import { LUGARES, type CategoriaLugar } from '../data/guia';
import { useUbicacion } from '../lib/estado';
import { distanciaKm } from '../lib/geo';
import { Afiche } from './Afiche';
import './lugares.css';

const Mapa = lazy(() => import('./Mapa'));

const CATEGORIAS: ('Todos' | CategoriaLugar)[] = ['Todos', 'Playa', 'Naturaleza', 'Cultura', 'Ciudad'];

export function Lugares({ onAbrir }: { onAbrir: (id: string) => void }) {
  const [categoria, setCategoria] = useState<(typeof CATEGORIAS)[number]>('Todos');
  const [vista, setVista] = useState<'afiches' | 'mapa'>('afiches');
  const { ubicacion, pedir, limpiar } = useUbicacion();

  const lista = useMemo(() => {
    const base = LUGARES.filter((l) => categoria === 'Todos' || l.categoria === categoria).map((l) => ({
      lugar: l,
      distancia: ubicacion.estado === 'lista' ? distanciaKm(ubicacion.lat, ubicacion.lng, l.lat, l.lng) : undefined,
    }));
    if (ubicacion.estado === 'lista') base.sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
    return base;
  }, [categoria, ubicacion]);

  const conteo = (c: (typeof CATEGORIAS)[number]) => (c === 'Todos' ? LUGARES.length : LUGARES.filter((l) => l.categoria === c).length);

  return (
    <section id="lugares" className="seccion campo-papel lugares" aria-labelledby="titulo-lugares">
      <div className="contenedor">
        <div className="lugares-cabeza">
          <h2 id="titulo-lugares" className="titulo-seccion">
            Lugares que valen el viaje
          </h2>
          <p className="entrada">
            Playas de Bahía Málaga, selva y ríos, la cultura del puerto. Guarda los que te gusten: quedan sellados en tu lista y el planificador los tiene en cuenta.
          </p>
        </div>

        <div className="lugares-controles">
          <div className="filtros" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((c) => (
              <button key={c} className="chip" aria-pressed={categoria === c} onClick={() => setCategoria(c)}>
                {c} <span className="num conteo">{conteo(c)}</span>
              </button>
            ))}
          </div>

          <div className="controles-derecha">
            {ubicacion.estado === 'lista' ? (
              <button className="chip chip-ubicacion" aria-pressed="true" onClick={limpiar}>
                <LocateFixed size={16} strokeWidth={2.4} /> Ordenado por cercanía <X size={16} strokeWidth={2.4} />
              </button>
            ) : (
              <button className="chip chip-ubicacion" onClick={pedir} disabled={ubicacion.estado === 'buscando'}>
                <LocateFixed size={16} strokeWidth={2.4} />
                {ubicacion.estado === 'buscando' ? 'Buscando tu ubicación…' : 'Cerca de mí'}
              </button>
            )}
            <div className="vista" role="group" aria-label="Tipo de vista">
              <button aria-pressed={vista === 'afiches'} onClick={() => setVista('afiches')}>
                <LayoutGrid size={16} strokeWidth={2.4} /> Afiches
              </button>
              <button aria-pressed={vista === 'mapa'} onClick={() => setVista('mapa')}>
                <MapaIcono size={16} strokeWidth={2.4} /> Mapa
              </button>
            </div>
          </div>
        </div>
        {ubicacion.estado === 'error' && (
          <p className="aviso-ubicacion" role="status">
            {ubicacion.mensaje}
          </p>
        )}

        {vista === 'afiches' ? (
          <motion.div className="rejilla-afiches" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {lista.map(({ lugar, distancia }, i) => (
                <motion.div
                  key={lugar.id}
                  className={`celda-afiche${i % 5 === 0 ? ' destacada' : ''}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: Math.min(i, 6) * 0.045 }}
                >
                  <Afiche lugar={lugar} grande={i % 5 === 0} distancia={distancia} onAbrir={onAbrir} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Suspense fallback={<div className="mapa-cargando">Cargando mapa…</div>}>
            <Mapa lugares={lista.map((x) => x.lugar)} ubicacion={ubicacion.estado === 'lista' ? ubicacion : null} onAbrir={onAbrir} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
