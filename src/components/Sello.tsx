import { useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Sello sobreimpreso que marca lo guardado: queda como una marca de tinta permanente. */
export function Sello({ visible, texto = 'Guardado' }: { visible: boolean; texto?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <AnimatePresence>
      {visible && (
        <motion.svg
          className="sello"
          viewBox="0 0 120 120"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.35, rotate: -26 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.14 } }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
        >
          <defs>
            <path id={`arco-${id}`} d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text fontFamily="Anybody, sans-serif" fontWeight="900" fontSize="13.5" letterSpacing="2.6" fill="currentColor" style={{ fontStretch: '90%' }}>
            <textPath href={`#arco-${id}`}>{`${texto.toUpperCase()} · TU GUÍA · ${texto.toUpperCase()} ·`}</textPath>
          </text>
          <path d="M47 60 l9 9 l18 -20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}
