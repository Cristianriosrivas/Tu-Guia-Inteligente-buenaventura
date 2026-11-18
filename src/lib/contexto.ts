import { HOTELES, LUGARES, NEGOCIOS, PLATOS, RESTAURANTES, RUTAS, ZONAS } from '../data/guia';

/** Resume los datos de la guía en texto para darle contexto a la IA. */
export function contextoGuia(): string {
  const lugares = LUGARES.map((l) => `- [${l.id}] ${l.nombre} (${l.categoria}, ${ZONAS[l.zona].nombre}): ${l.resumen} Cómo llegar: ${l.comoLlegar} Mejor época: ${l.mejorEpoca}`).join('\n');
  const rutas = RUTAS.map((r) => `- ${r.nombre} (${r.dias} día${r.dias > 1 ? 's' : ''}, ${r.dificultad}${r.temporada ? ', ' + r.temporada : ''}): ${r.resumen}`).join('\n');
  const hoteles = HOTELES.map((h) => `- ${h.nombre} (${h.tipo}, ${ZONAS[h.zona].nombre}, ${h.precio}${h.ejemplo ? ', ficha de ejemplo' : ''}): ${h.descripcion}`).join('\n');
  const restaurantes = RESTAURANTES.map((r) => `- ${r.nombre} (${r.cocina}, ${ZONAS[r.zona].nombre}${r.ejemplo ? ', ficha de ejemplo' : ''}): ${r.descripcion} Plato: ${r.plato}`).join('\n');
  const platos = PLATOS.map((p) => `- ${p.nombre}: ${p.descripcion}`).join('\n');
  const negocios = NEGOCIOS.map((n) => `- ${n.nombre} (${n.categoria}, ficha de ejemplo): ${n.descripcion}`).join('\n');
  return `LUGARES:\n${lugares}\n\nRUTAS:\n${rutas}\n\nHOSPEDAJE:\n${hoteles}\n\nRESTAURANTES:\n${restaurantes}\n\nPLATOS TÍPICOS:\n${platos}\n\nNEGOCIOS LOCALES:\n${negocios}\n\nDATOS GENERALES: Buenaventura está a unas 3 horas por carretera de Cali. Clima cálido y húmedo (26–28 °C) con lluvias frecuentes todo el año. Temporada de ballenas jorobadas: julio a octubre. Festival Folclórico del Pacífico: julio.`;
}
