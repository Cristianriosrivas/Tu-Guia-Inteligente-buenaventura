import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bookmark, Menu, MessageCircle, X } from 'lucide-react';
import { useFavoritos } from '../lib/estado';
import './programa.css';

const SECCIONES = [
  { id: 'condiciones', nombre: 'Hoy' },
  { id: 'lugares', nombre: 'Lugares' },
  { id: 'rutas', nombre: 'Rutas' },
  { id: 'dormir', nombre: 'Dormir y comer' },
  { id: 'negocios', nombre: 'Negocios' },
  { id: 'planifica', nombre: 'Planifica' },
];

interface Props {
  onAbrirLista: () => void;
  onPreguntar: () => void;
}

export function Programa({ onAbrirLista, onPreguntar }: Props) {
  const [activa, setActiva] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const { lista } = useFavoritos();

  useEffect(() => {
    const visibles = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) visibles.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let mejor: string | null = null;
        let max = 0;
        visibles.forEach((r, id) => {
          if (r > max) {
            max = r;
            mejor = id;
          }
        });
        setActiva(max > 0 ? mejor : null);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.2, 0.5, 1] },
    );
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!menu) return;
    const cerrar = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('keydown', cerrar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', cerrar);
      document.body.style.overflow = '';
    };
  }, [menu]);

  return (
    <header className="programa">
      <a href="#inicio" className="programa-marca" aria-label="Tu Guía Inteligente, volver al inicio">
        <span className="marca-tu">Tu guía</span>
        <span className="marca-lugar">Buenaventura</span>
      </a>

      <nav className="programa-celdas" aria-label="Secciones">
        {SECCIONES.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="celda" aria-current={activa === s.id ? 'true' : undefined}>
            {s.nombre}
          </a>
        ))}
      </nav>

      <div className="programa-acciones">
        <button className="accion-lista" onClick={onAbrirLista} aria-label={`Mi lista, ${lista.length} guardados`}>
          <Bookmark size={18} strokeWidth={2.4} />
          <span className="solo-escritorio">Mi lista</span>
          {lista.length > 0 && <span className="contador num">{lista.length}</span>}
        </button>
        <button className="accion-preguntar" onClick={onPreguntar}>
          <MessageCircle size={18} strokeWidth={2.4} />
          <span className="solo-escritorio">Pregúntale al guía</span>
        </button>
        <button className="accion-menu" onClick={() => setMenu(true)} aria-label="Abrir menú" aria-expanded={menu}>
          <Menu size={22} strokeWidth={2.4} />
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="menu-movil campo-sol"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
          >
            <button className="menu-cerrar" onClick={() => setMenu(false)} aria-label="Cerrar menú" autoFocus>
              <X size={28} strokeWidth={2.4} />
            </button>
            <nav aria-label="Secciones">
              {SECCIONES.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setMenu(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.04, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {s.nombre}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
