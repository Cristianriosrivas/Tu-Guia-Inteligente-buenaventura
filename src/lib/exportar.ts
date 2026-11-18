import type { Plan, Preferencias } from './planificador';

const pad = (n: number) => String(n).padStart(2, '0');
const fechaICS = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const escapar = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Crea un archivo de calendario (.ics) con un evento de día completo por cada día del plan. */
export function planAICS(plan: Plan, llegada: Date): string {
  const lineas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tu Guia Inteligente//Buenaventura//ES', 'CALSCALE:GREGORIAN'];
  const sello = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  plan.dias.forEach((dia, i) => {
    const inicio = new Date(llegada);
    inicio.setDate(inicio.getDate() + i);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 1);
    const detalle = dia.actividades.map((a) => `${a.hora} ${a.titulo}: ${a.detalle}`).join('\n');
    lineas.push(
      'BEGIN:VEVENT',
      `UID:tuguia-${fechaICS(inicio)}-${i}@buenaventura`,
      `DTSTAMP:${sello}`,
      `DTSTART;VALUE=DATE:${fechaICS(inicio)}`,
      `DTEND;VALUE=DATE:${fechaICS(fin)}`,
      `SUMMARY:${escapar(`Día ${dia.numero} en Buenaventura: ${dia.titulo}`)}`,
      `DESCRIPTION:${escapar(detalle)}`,
      'LOCATION:Buenaventura\\, Valle del Cauca\\, Colombia',
      'END:VEVENT',
    );
  });
  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n');
}

export function descargar(nombre: string, contenido: Blob | string, tipo = 'text/calendar') {
  const blob = typeof contenido === 'string' ? new Blob([contenido], { type: tipo }) : contenido;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---------- Enlace compartible del plan ---------- */

export function enlacePlan(pref: Preferencias, llegada: string, version: number): string {
  const url = new URL(window.location.href);
  url.hash = 'planifica';
  url.search = new URLSearchParams({
    d: String(pref.dias),
    p: pref.presupuesto,
    i: pref.intereses.join(','),
    f: llegada,
    v: String(version),
  }).toString();
  return url.toString();
}

export function leerEnlacePlan(): { pref: Partial<Preferencias>; llegada?: string; version?: number } | null {
  const q = new URLSearchParams(window.location.search);
  if (!q.has('d')) return null;
  const dias = Math.min(5, Math.max(1, Number(q.get('d')) || 2));
  const p = q.get('p');
  const presupuesto = p === 'economico' || p === 'medio' || p === 'alto' ? p : undefined;
  const validos = ['playa', 'ballenas', 'naturaleza', 'cultura', 'gastronomia', 'descanso', 'aventura'];
  const intereses = (q.get('i') ?? '').split(',').filter((x) => validos.includes(x)) as Preferencias['intereses'];
  const f = q.get('f') ?? undefined;
  return {
    pref: { dias, presupuesto, intereses: intereses.length ? intereses : undefined },
    llegada: f && /^\d{4}-\d{2}-\d{2}$/.test(f) ? f : undefined,
    version: Number(q.get('v')) || 1,
  };
}
