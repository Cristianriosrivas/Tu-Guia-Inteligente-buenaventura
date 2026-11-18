import { useId } from 'react';

/**
 * Cenefa textil inspirada en los estampados de los turbantes del Pacífico:
 * triángulos y rombos en las cuatro tintas, repetidos como una franja impresa.
 */
export function Cenefa({ alto = 26, className }: { alto?: number; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} width="100%" height={alto} aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <defs>
        <pattern id={`turbante-${id}`} width="52" height="26" patternUnits="userSpaceOnUse">
          <rect width="52" height="26" fill="#bf3519" />
          <path d="M0 26 L13 4 L26 26 Z" fill="#f2b51d" />
          <path d="M26 26 L39 4 L52 26 Z" fill="#14663f" />
          <path d="M13 26 L19.5 15 L26 26 Z" fill="#0f2f57" />
          <path d="M39 26 L45.5 15 L52 26 Z" fill="#f4ecdc" />
          <path d="M26 0 L30 6 L26 12 L22 6 Z" fill="#f4ecdc" />
          <path d="M0 0 L4 6 L0 12 Z M52 0 L48 6 L52 12 Z" fill="#f2b51d" />
        </pattern>
      </defs>
      <rect width="100%" height={alto} fill={`url(#turbante-${id})`} />
    </svg>
  );
}
