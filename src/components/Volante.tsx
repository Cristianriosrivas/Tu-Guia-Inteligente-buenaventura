import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react';
import { GripHorizontal, X } from 'lucide-react';
import './volante.css';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  titulo: ReactNode;
  subtitulo?: ReactNode;
  etiqueta: string;
  lado?: 'derecha' | 'izquierda';
  campo?: string;
  children: ReactNode;
  pie?: ReactNode;
}

function useEsMovil() {
  const [movil, setMovil] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 620px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 620px)');
    const f = () => setMovil(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return movil;
}

/**
 * Volante: panel flotante que se arrastra por la pantalla como un papel.
 * Se inclina según la velocidad del arrastre y conserva la inercia al soltarlo.
 */
export function Volante({ abierto, onCerrar, titulo, subtitulo, etiqueta, lado = 'derecha', campo = 'campo-papel', children, pie }: Props) {
  const limites = useRef<HTMLDivElement>(null);
  const controles = useDragControls();
  const movil = useEsMovil();
  const x = useMotionValue(0);
  const vx = useVelocity(x);
  const inclinacion = useSpring(useTransform(vx, [-1600, 0, 1600], [-7, 0, 7], { clamp: true }), { stiffness: 260, damping: 22 });

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [abierto, onCerrar]);

  return (
    <>
      <div ref={limites} className="volante-limites" aria-hidden="true" />
      <AnimatePresence>
        {abierto && (
          <motion.section
            className={`volante volante-${lado} ${campo}`}
            role="dialog"
            aria-label={etiqueta}
            style={movil ? undefined : { x, rotate: inclinacion }}
            drag={!movil}
            dragControls={controles}
            dragListener={false}
            dragConstraints={limites}
            dragElastic={0.12}
            dragTransition={{ power: 0.25, timeConstant: 220 }}
            initial={movil ? { y: '100%' } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={movil ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={movil ? { y: '100%', transition: { duration: 0.25 } } : { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.16 } }}
            transition={{ duration: movil ? 0.42 : 0.28, ease: movil ? [0.32, 0.72, 0, 1] : [0.23, 1, 0.32, 1] }}
          >
            <header className="volante-cabeza" onPointerDown={(e) => !movil && controles.start(e)}>
              {!movil && <GripHorizontal className="volante-agarre" size={18} strokeWidth={2.4} aria-hidden="true" />}
              <div className="volante-titulos">
                <h2>{titulo}</h2>
                {subtitulo && <span>{subtitulo}</span>}
              </div>
              <button className="volante-cerrar" onClick={onCerrar} onPointerDown={(e) => e.stopPropagation()} aria-label={`Cerrar ${etiqueta.toLowerCase()}`}>
                <X size={20} strokeWidth={2.6} />
              </button>
            </header>
            <div className="volante-cuerpo">{children}</div>
            {pie && <div className="volante-pie">{pie}</div>}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
