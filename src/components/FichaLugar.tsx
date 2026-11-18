import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'motion/react';
import { Bookmark, BookmarkCheck, Clock, ExternalLink, MessageCircle, Navigation, X } from 'lucide-react';
import { FOTOS } from '../data/fotos';
import { lugarPorId, ZONAS } from '../data/guia';
import { useFavoritos } from '../lib/estado';
import { Sello } from './Sello';
import './ficha.css';

interface Props {
  id: string | null;
  onCerrar: () => void;
  onPreguntar: (pregunta?: string) => void;
}

export function FichaLugar({ id, onCerrar, onPreguntar }: Props) {
  const lugar = id ? lugarPorId(id) : undefined;
  const { es, alternar } = useFavoritos();
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const arrastre = useDragControls();
  const previo = useRef<HTMLElement | null>(null);
  const movil = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

  useEffect(() => {
    if (!lugar) return;
    previo.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => cerrarRef.current?.focus(), 60);
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', tecla);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = '';
      previo.current?.focus?.();
    };
  }, [lugar, onCerrar]);

  const soltar = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 140 || info.velocity.y > 600) onCerrar();
  };

  const foto = lugar ? FOTOS[lugar.foto] : null;
  const guardado = lugar ? es(lugar.id) : false;

  return (
    <AnimatePresence>
      {lugar && foto && (
        <>
          <motion.div
            className="velo"
            onClick={onCerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.aside
            key={lugar.id}
            className="ficha campo-papel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ficha-titulo"
            initial={movil ? { y: '100%' } : { x: '100%' }}
            animate={movil ? { y: 0 } : { x: 0 }}
            exit={movil ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            drag={movil ? 'y' : false}
            dragControls={arrastre}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={soltar}
          >
            {movil && <span className="ficha-asa" aria-hidden="true" />}
            <button ref={cerrarRef} className="ficha-cerrar" onClick={onCerrar} aria-label="Cerrar ficha">
              <X size={22} strokeWidth={2.6} />
            </button>

            <figure className="ficha-foto" onPointerDown={(e) => movil && arrastre.start(e)} style={movil ? { touchAction: 'none' } : undefined}>
              <img src={foto.src} alt={foto.alt} style={{ objectPosition: (foto as { foco?: string }).foco }} />
              <figcaption>
                Foto: {foto.autor} ·{' '}
                <a href={foto.fuente} target="_blank" rel="noreferrer">
                  {foto.licencia}
                </a>
              </figcaption>
            </figure>

            <div className="ficha-cuerpo">
              <h2 id="ficha-titulo">{lugar.nombre}</h2>
              <span className="ficha-categoria">
                {lugar.categoria} · {ZONAS[lugar.zona].nombre}
              </span>
              <p className="ficha-descripcion">{lugar.descripcion}</p>

              <dl className="ficha-datos">
                <div>
                  <dt>
                    <Navigation size={16} strokeWidth={2.4} /> Cómo llegar
                  </dt>
                  <dd>{lugar.comoLlegar}</dd>
                </div>
                <div>
                  <dt>
                    <Clock size={16} strokeWidth={2.4} /> Mejor época
                  </dt>
                  <dd>{lugar.mejorEpoca}</dd>
                </div>
                <div>
                  <dt>Tiempo sugerido</dt>
                  <dd className="num">
                    {lugar.duracionHoras} {lugar.duracionHoras === 1 ? 'hora' : 'horas'}
                  </dd>
                </div>
                <div>
                  <dt>Costo</dt>
                  <dd>{['Bajo', 'Medio', 'Alto'][lugar.costo - 1]}</dd>
                </div>
              </dl>

              {lugar.consejo && (
                <p className="ficha-consejo">
                  <strong>Consejo local.</strong> {lugar.consejo}
                </p>
              )}

              <div className="ficha-acciones">
                <button
                  className={`boton ${guardado ? 'boton-achiote' : 'boton-mar'}`}
                  aria-pressed={guardado}
                  onClick={() => alternar({ id: lugar.id, nombre: lugar.nombre, tipo: 'Lugar' })}
                >
                  {guardado ? <BookmarkCheck size={20} strokeWidth={2.4} /> : <Bookmark size={20} strokeWidth={2.4} />}
                  {guardado ? 'En mi lista' : 'Guardar'}
                </button>
                <button
                  className="boton boton-linea"
                  onClick={() => {
                    onCerrar();
                    onPreguntar(`¿Qué me recomiendas para visitar ${lugar.nombre}?`);
                  }}
                >
                  <MessageCircle size={20} strokeWidth={2.4} /> Preguntar
                </button>
                <a
                  className="boton boton-linea"
                  href={`https://www.openstreetmap.org/?mlat=${lugar.lat}&mlon=${lugar.lng}#map=13/${lugar.lat}/${lugar.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={18} strokeWidth={2.4} /> Mapa
                </a>
              </div>
            </div>
            <Sello visible={guardado} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
