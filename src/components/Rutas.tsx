import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CalendarDays } from 'lucide-react';
import { FOTOS } from '../data/fotos';
import { RUTAS } from '../data/guia';
import { useFavoritos } from '../lib/estado';
import { Sello } from './Sello';
import './rutas.css';

const CAMPOS = ['campo-sol', 'campo-papel', 'campo-achiote', 'campo-papel', 'campo-manglar'];

export function Rutas({ onAbrirLugar }: { onAbrirLugar: (id: string) => void }) {
  const tira = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{ x: number; scroll: number; movio: boolean } | null>(null);
  const { es, alternar } = useFavoritos();

  const desplazar = (dir: number) => {
    const el = tira.current;
    if (!el) return;
    const tarjeta = el.querySelector<HTMLElement>('.ruta');
    el.scrollBy({ left: dir * ((tarjeta?.offsetWidth ?? 360) + 24), behavior: 'smooth' });
  };

  // Arrastrar con el ratón como si fuera una tira de carteles (en táctil se usa el scroll nativo).
  const bajar = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !tira.current) return;
    arrastre.current = { x: e.clientX, scroll: tira.current.scrollLeft, movio: false };
  };
  const mover = (e: React.PointerEvent) => {
    const a = arrastre.current;
    if (!a || !tira.current) return;
    const dx = e.clientX - a.x;
    if (Math.abs(dx) > 4 && !a.movio) {
      a.movio = true;
      tira.current.setPointerCapture(e.pointerId);
      tira.current.classList.add('arrastrando');
    }
    if (a.movio) tira.current.scrollLeft = a.scroll - dx;
  };
  const soltar = () => {
    tira.current?.classList.remove('arrastrando');
    setTimeout(() => (arrastre.current = null), 0);
  };
  const clicSiNoArrastra = (fn: () => void) => () => {
    if (!arrastre.current?.movio) fn();
  };

  return (
    <section id="rutas" className="seccion campo-mar rutas" aria-labelledby="titulo-rutas">
      <div className="contenedor rutas-cabeza">
        <h2 id="titulo-rutas" className="titulo-seccion">
          Rutas armadas
        </h2>
        <div className="rutas-lado">
          <p className="entrada">Cinco recorridos probados, de un día o un fin de semana. Arrastra la tira para verlos y toca una parada para abrir el lugar.</p>
          <div className="rutas-flechas">
            <button className="boton boton-linea" onClick={() => desplazar(-1)} aria-label="Ruta anterior">
              <ArrowLeft size={20} strokeWidth={2.6} />
            </button>
            <button className="boton boton-linea" onClick={() => desplazar(1)} aria-label="Ruta siguiente">
              <ArrowRight size={20} strokeWidth={2.6} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="tira"
        ref={tira}
        onPointerDown={bajar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        role="list"
        aria-label="Rutas turísticas"
      >
        {RUTAS.map((r, i) => {
          const foto = FOTOS[r.foto];
          const guardada = es(`ruta-${r.id}`);
          return (
            <motion.article
              key={r.id}
              role="listitem"
              className={`ruta ${CAMPOS[i % CAMPOS.length]}`}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.2 : -1.2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: i * 0.06 }}
            >
              {foto && (
                <div className="ruta-foto">
                  <img src={foto.src} alt={foto.alt} loading="lazy" draggable={false} />
                </div>
              )}
              <div className="ruta-cuerpo">
                <h3>{r.nombre}</h3>
                <div className="ruta-meta">
                  <span className="num">
                    <CalendarDays size={15} strokeWidth={2.4} /> {r.dias} {r.dias === 1 ? 'día' : 'días'}
                  </span>
                  <span>{r.dificultad}</span>
                  {r.temporada && <span className="ruta-temporada">{r.temporada}</span>}
                </div>
                <p className="ruta-resumen">{r.resumen}</p>
                <ol className="paradas">
                  {r.paradas.map((p, j) => (
                    <li key={j}>
                      <span className="parada-num num" aria-hidden="true">
                        {j + 1}
                      </span>
                      <div>
                        {p.lugarId ? (
                          <button className="parada-titulo enlace" onClick={clicSiNoArrastra(() => onAbrirLugar(p.lugarId!))}>
                            {p.titulo}
                          </button>
                        ) : (
                          <span className="parada-titulo">{p.titulo}</span>
                        )}
                        <span className="parada-detalle">{p.detalle}</span>
                      </div>
                    </li>
                  ))}
                </ol>
                <button
                  className="ruta-guardar chip"
                  aria-pressed={guardada}
                  onClick={clicSiNoArrastra(() => alternar({ id: `ruta-${r.id}`, nombre: r.nombre, tipo: 'Ruta' }))}
                >
                  {guardada ? <BookmarkCheck size={16} strokeWidth={2.4} /> : <Bookmark size={16} strokeWidth={2.4} />}
                  {guardada ? 'Ruta guardada' : 'Guardar ruta'}
                </button>
              </div>
              <Sello visible={guardada} />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
