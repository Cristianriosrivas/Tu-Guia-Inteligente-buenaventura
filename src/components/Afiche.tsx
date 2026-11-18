import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react';
import { FOTOS } from '../data/fotos';
import { ZONAS, type Lugar } from '../data/guia';
import { useFavoritos } from '../lib/estado';
import { formatoDistancia } from '../lib/geo';
import { Sello } from './Sello';

const TINTAS_CATEGORIA: Record<Lugar['categoria'], { oscura: string; clara: string }> = {
  Playa: { oscura: 'var(--mar)', clara: 'var(--sol)' },
  Naturaleza: { oscura: 'var(--manglar)', clara: 'var(--papel)' },
  Cultura: { oscura: 'var(--achiote)', clara: 'var(--sol)' },
  Ciudad: { oscura: 'var(--mar)', clara: 'var(--papel)' },
};

interface Props {
  lugar: Lugar;
  grande?: boolean;
  distancia?: number;
  onAbrir: (id: string) => void;
}

export function Afiche({ lugar, grande, distancia, onAbrir }: Props) {
  const { es, alternar } = useFavoritos();
  const guardado = es(lugar.id);
  const foto = FOTOS[lugar.foto];
  const tintas = TINTAS_CATEGORIA[lugar.categoria];
  const ref = useRef<HTMLElement>(null);

  // Inclinación 3D que sigue al puntero, suavizada con resorte.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 160, damping: 18 });

  const mover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const salir = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      ref={ref}
      className={`afiche${grande ? ' afiche-grande' : ''}`}
      style={{ rotateX: rx, rotateY: ry, ['--oscura' as string]: tintas.oscura, ['--clara' as string]: tintas.clara }}
      onPointerMove={mover}
      onPointerLeave={salir}
    >
      <div className="afiche-foto">
        <img className="foto-duotono" src={foto.src} alt="" loading="lazy" decoding="async" style={{ objectPosition: (foto as { foco?: string }).foco }} />
        <img className="foto-color" src={foto.src} alt={foto.alt} loading="lazy" decoding="async" style={{ objectPosition: (foto as { foco?: string }).foco }} />
        <span className="afiche-categoria">{lugar.categoria}</span>
        {distancia != null && (
          <span className="afiche-distancia num">
            <MapPin size={14} strokeWidth={2.6} /> a {formatoDistancia(distancia)}
          </span>
        )}
      </div>

      <div className="afiche-texto">
        <h3>
          <button className="afiche-abrir" onClick={() => onAbrir(lugar.id)}>
            {lugar.nombre}
          </button>
        </h3>
        <p className="afiche-resumen">{lugar.resumen}</p>
        <dl className="afiche-banda">
          <div>
            <dt>Zona</dt>
            <dd>{ZONAS[lugar.zona].nombre.split(',')[0]}</dd>
          </div>
          <div>
            <dt>Época</dt>
            <dd>{lugar.mejorEpoca.split(/[;.]/)[0]}</dd>
          </div>
          <div>
            <dt>Costo</dt>
            <dd className="signos" aria-label={['Bajo', 'Medio', 'Alto'][lugar.costo - 1]}>
              {'$$$'.split('').map((s, i) => (
                <span key={i} className={i < lugar.costo ? '' : 'apagado'}>
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <Sello visible={guardado} />

      <button
        className="afiche-guardar"
        aria-pressed={guardado}
        aria-label={guardado ? `Quitar ${lugar.nombre} de mi lista` : `Guardar ${lugar.nombre} en mi lista`}
        onClick={() => alternar({ id: lugar.id, nombre: lugar.nombre, tipo: 'Lugar' })}
      >
        {guardado ? <BookmarkCheck size={20} strokeWidth={2.4} /> : <Bookmark size={20} strokeWidth={2.4} />}
      </button>
    </motion.article>
  );
}
