// Motor local del asistente: entiende preguntas frecuentes sobre Buenaventura usando
// los datos de la guía y las condiciones en vivo. Funciona sin internet ni claves.

import { HOTELES, LUGARES, PLATOS, RESTAURANTES, RUTAS, TEMPORADA_BALLENAS, type Lugar } from '../data/guia';
import { normalizar } from './geo';
import { textoClima, tendenciaMarea, type Condiciones } from './mar';
import { esTemporadaBallenas } from './planificador';

export interface Accion {
  etiqueta: string;
  seccion?: string;
  pregunta?: string;
}

export interface Respuesta {
  texto: string;
  lugares?: string[];
  acciones?: Accion[];
}

interface Intencion {
  id: string;
  claves: string[];
  responder: (ctx: Contexto) => Respuesta;
}

interface Contexto {
  pregunta: string;
  condiciones: Condiciones | null;
  mes: number;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const SUGERENCIAS: Accion[] = [
  { etiqueta: '¿Cuándo hay ballenas?', pregunta: '¿Cuándo hay ballenas?' },
  { etiqueta: '¿Cómo llego?', pregunta: '¿Cómo llego a Buenaventura?' },
  { etiqueta: 'Qué comer', pregunta: '¿Qué debo comer?' },
  { etiqueta: '¿Llueve hoy?', pregunta: '¿Cómo está el clima hoy?' },
];

const nombresLugares = (ids: string[]) => ids.map((id) => LUGARES.find((l) => l.id === id)?.nombre).filter(Boolean).join(', ');

const INTENCIONES: Intencion[] = [
  {
    id: 'saludo',
    claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'hey', 'que tal'],
    responder: () => ({
      texto: '¡Hola! Soy tu guía de Buenaventura. Puedo contarte sobre playas, ballenas, cómo llegar, dónde dormir y qué comer, o armarte un plan.',
      acciones: SUGERENCIAS,
    }),
  },
  {
    id: 'ballenas',
    claves: ['ballena', 'ballenas', 'jorobada', 'avistamiento', 'yubarta'],
    responder: ({ mes }) => {
      const ahora = esTemporadaBallenas(mes);
      const faltan = ((TEMPORADA_BALLENAS.inicio - mes + 12) % 12) || 12;
      return {
        texto: ahora
          ? `¡Estás en temporada! Las ballenas jorobadas están en Bahía Málaga de julio a octubre, con su mejor momento en agosto y septiembre. Sal desde Juanchaco temprano y elige operadores con RNT que respeten la distancia.`
          : `Las ballenas jorobadas llegan a Bahía Málaga de julio a octubre para tener sus crías. Estamos en ${MESES[mes - 1]}: faltan unos ${faltan} ${faltan === 1 ? 'mes' : 'meses'} para la próxima temporada. Mientras tanto, las playas y la selva te esperan.`,
        lugares: ['bahia-malaga', 'juanchaco'],
        acciones: [{ etiqueta: 'Ver la Ruta de las Ballenas', seccion: 'rutas' }],
      };
    },
  },
  {
    id: 'clima',
    claves: ['clima', 'llueve', 'lluvia', 'llover', 'temperatura', 'calor', 'tiempo hoy', 'sol', 'pronostico'],
    responder: ({ condiciones }) => {
      if (!condiciones?.enVivo) {
        return { texto: 'Buenaventura es cálida y húmeda todo el año, entre 26 y 28 °C, y llueve con frecuencia: lleva impermeable liviano y bloqueador. No pude cargar el pronóstico en vivo ahora mismo.' };
      }
      const c = condiciones;
      const manana = c.dias[1];
      return {
        texto: `Ahora hay ${c.temperatura} °C (sensación de ${c.sensacion} °C), ${textoClima(c.codigo).toLowerCase()} y ${c.humedad}% de humedad. Probabilidad de lluvia hoy: ${c.lluviaHoy}%. ${manana ? `Mañana: entre ${manana.min} y ${manana.max} °C con ${manana.lluviaProb}% de lluvia.` : ''} El sol se pone a las ${c.atardecer}.`,
      };
    },
  },
  {
    id: 'mar',
    claves: ['marea', 'olas', 'oleaje', 'mar', 'lancha', 'navegar', 'mareo'],
    responder: ({ condiciones }) => {
      const c = condiciones;
      const t = c ? tendenciaMarea(c.marea) : null;
      const partes = [
        c?.oleaje != null ? `El oleaje frente a la bahía es de ${c.oleaje.toFixed(1).replace('.', ',')} m` : null,
        c?.temperaturaMar != null ? `el agua está a ${c.temperaturaMar} °C` : null,
        t ? `la marea ${t === 'estable' ? 'está estable' : t}` : null,
      ].filter(Boolean);
      return {
        texto:
          (partes.length ? partes.join(', ') + '. ' : '') +
          'Las lanchas a Juanchaco salen del Muelle Turístico y tardan alrededor de 1 hora. Sal temprano, usa chaleco y pregunta por la marea: con marea baja algunas playas y esteros cambian mucho. Estos datos vienen de un modelo, no sirven para navegar.',
        acciones: [{ etiqueta: 'Ver condiciones del mar', seccion: 'condiciones' }],
      };
    },
  },
  {
    id: 'llegar',
    claves: ['llegar', 'llego', 'como voy', 'bus', 'carretera', 'avion', 'vuelo', 'desde cali', 'transporte', 'aeropuerto'],
    responder: () => ({
      texto: 'Desde Cali son unas 3 horas por carretera, en bus o carro. También hay vuelos regionales a Buenaventura, con poca frecuencia: confírmalos con las aerolíneas. Para Juanchaco, Ladrilleros o La Bocana se toma lancha en el Muelle Turístico; a San Cipriano se va por carretera hasta Córdoba y luego en brujita.',
      lugares: ['juanchaco', 'san-cipriano'],
    }),
  },
  {
    id: 'hospedaje',
    claves: ['dormir', 'hotel', 'hoteles', 'hospedaje', 'alojamiento', 'cabana', 'posada', 'quedarme'],
    responder: () => ({
      texto: `Tienes tres bases: el centro (${HOTELES.filter((h) => h.zona === 'ciudad').map((h) => h.nombre).join(', ')}), Juanchaco y Ladrilleros para playa y ballenas, y La Bocana para algo sencillo frente al mar. Las tarifas son de referencia: confírmalas antes de viajar.`,
      acciones: [{ etiqueta: 'Ver hospedaje', seccion: 'dormir' }],
    }),
  },
  {
    id: 'comida',
    claves: ['comer', 'comida', 'restaurante', 'plato', 'gastronomia', 'piangua', 'almuerzo', 'cena', 'pescado', 'mariscos', 'viche'],
    responder: () => ({
      texto: `No te vayas sin probar ${PLATOS.slice(0, 3).map((p) => p.nombre.toLowerCase()).join(', ')} y un jugo de borojó. Para comer frente al mar, las cocinas de Piangüita y La Bocana; en el centro, ${RESTAURANTES.filter((r) => r.zona === 'ciudad').map((r) => r.nombre).join(' o ')}.`,
      lugares: ['pianguita'],
      acciones: [{ etiqueta: 'Ver la Ruta de los Sabores', seccion: 'rutas' }],
    }),
  },
  {
    id: 'playas',
    claves: ['playa', 'playas', 'banarse', 'nadar', 'arena', 'surf'],
    responder: () => {
      const ids = LUGARES.filter((l) => l.categoria === 'Playa').map((l) => l.id);
      return {
        texto: `Las playas más buscadas son ${nombresLugares(ids)}. Juanchaco es tranquila, Ladrilleros tiene acantilados y olas para surf, La Barra es casi solitaria y La Bocana es la más cercana a la ciudad.`,
        lugares: ids.slice(0, 3),
      };
    },
  },
  {
    id: 'cultura',
    claves: ['cultura', 'marimba', 'currulao', 'musica', 'festival', 'baile', 'historia', 'afro', 'tradicion'],
    responder: () => ({
      texto: 'La música de marimba de chonta, cununos y guasá es el corazón del Pacífico y patrimonio inmaterial de la humanidad. En julio se celebra el Festival Folclórico del Pacífico. En el malecón hay presentaciones, y la antigua estación del tren cuenta la historia del puerto.',
      lugares: ['musica-pacifico', 'malecon', 'estacion-tren'],
    }),
  },
  {
    id: 'naturaleza',
    claves: ['selva', 'rio', 'cascada', 'cascadas', 'manglar', 'manglares', 'naturaleza', 'caminata', 'aventura', 'tubing', 'brujita'],
    responder: () => ({
      texto: 'Para naturaleza: San Cipriano (río cristalino y brujita), las cascadas de Bahía Málaga y los esteros de manglar en canoa. San Cipriano se hace en un día desde la ciudad; las cascadas y el manglar se combinan con Juanchaco.',
      lugares: ['san-cipriano', 'cascadas', 'manglares'],
    }),
  },
  {
    id: 'epoca',
    claves: ['cuando ir', 'mejor epoca', 'mejor mes', 'temporada', 'que mes', 'cuando viajar'],
    responder: () => ({
      texto: 'Se puede ir todo el año. De julio a octubre llegan las ballenas jorobadas y en julio es el Festival Folclórico del Pacífico. Llueve en cualquier mes, así que planea con margen y salidas en lancha temprano.',
    }),
  },
  {
    id: 'seguridad',
    claves: ['seguro', 'seguridad', 'peligro', 'peligroso', 'riesgo'],
    responder: () => ({
      texto: 'Consulta antes de viajar las recomendaciones oficiales vigentes, muévete con operadores turísticos registrados (RNT), prefiere desplazamientos de día y pide consejos a tu hospedaje sobre las zonas a visitar. En el mar, usa siempre chaleco salvavidas.',
    }),
  },
  {
    id: 'presupuesto',
    claves: ['presupuesto', 'cuanto cuesta', 'precio', 'precios', 'costo', 'barato', 'caro', 'plata', 'dinero'],
    responder: () => ({
      texto: 'Como referencia por persona y por día: económico entre $120.000 y $200.000, medio entre $200.000 y $380.000, y alto desde $380.000 COP, incluyendo hospedaje, comida y traslados. Las lanchas a Bahía Málaga son el gasto más grande. El planificador te da una estimación según tus días.',
      acciones: [{ etiqueta: 'Abrir el planificador', seccion: 'planifica' }],
    }),
  },
  {
    id: 'plan',
    claves: ['plan', 'itinerario', 'planear', 'planificar', 'que hago', 'que hacer', 'recomienda', 'dias'],
    responder: () => ({
      texto: 'Con gusto. El planificador arma tu viaje día por día con los lugares de esta guía, según tus días, presupuesto e intereses. ¿Lo abrimos?',
      acciones: [{ etiqueta: 'Armar mi plan', seccion: 'planifica' }],
    }),
  },
  {
    id: 'gracias',
    claves: ['gracias', 'muchas gracias', 'chevere', 'genial', 'perfecto', 'listo'],
    responder: () => ({ texto: '¡Con gusto! Que disfrutes el Pacífico. Si quieres, sigo ayudándote con tu plan.', acciones: SUGERENCIAS.slice(0, 2) }),
  },
];

function buscarLugar(pregunta: string): Lugar | undefined {
  const q = ` ${normalizar(pregunta)} `;
  return LUGARES.find((l) => {
    const n = normalizar(l.nombre);
    const corto = normalizar(l.id.replace(/-/g, ' '));
    return q.includes(` ${n} `) || q.includes(` ${corto} `) || (n.split(' ').length > 1 && n.split(' ').some((p) => p.length > 5 && q.includes(` ${p} `)));
  });
}

export function responderLocal(pregunta: string, condiciones: Condiciones | null, mes = new Date().getMonth() + 1): Respuesta {
  const ctx: Contexto = { pregunta, condiciones, mes };
  const q = ` ${normalizar(pregunta)} `;

  const lugar = buscarLugar(pregunta);
  const puntajes = INTENCIONES.map((i) => ({
    i,
    p: i.claves.reduce((acc, k) => acc + (q.includes(` ${k} `) || q.includes(` ${k}`) ? k.split(' ').length : 0), 0),
  })).sort((a, b) => b.p - a.p);

  if (lugar && puntajes[0].p > 0 && ['llegar', 'epoca', 'presupuesto'].includes(puntajes[0].i.id)) {
    const id = puntajes[0].i.id;
    const texto =
      id === 'llegar'
        ? `Para llegar a ${lugar.nombre}: ${lugar.comoLlegar} ${lugar.consejo ?? ''}`
        : id === 'epoca'
          ? `${lugar.nombre}: ${lugar.mejorEpoca}`
          : `${lugar.nombre} tiene un costo ${['bajo', 'medio', 'alto'][lugar.costo - 1]} y se disfruta en unas ${lugar.duracionHoras} horas. ${lugar.comoLlegar}`;
    return { texto: texto.trim(), lugares: [lugar.id] };
  }

  if (lugar && (puntajes[0].p === 0 || ['playas', 'naturaleza', 'cultura'].includes(puntajes[0].i.id))) {
    return {
      texto: `${lugar.nombre}: ${lugar.descripcion} Cómo llegar: ${lugar.comoLlegar} Mejor época: ${lugar.mejorEpoca.toLowerCase()}`,
      lugares: [lugar.id],
    };
  }

  const ruta = RUTAS.find((r) => q.includes(normalizar(r.nombre)));
  if (ruta) {
    return {
      texto: `${ruta.nombre} (${ruta.dias} ${ruta.dias === 1 ? 'día' : 'días'}): ${ruta.resumen} Paradas: ${ruta.paradas.map((p) => p.titulo).join(' → ')}.`,
      acciones: [{ etiqueta: 'Ver rutas', seccion: 'rutas' }],
    };
  }

  if (puntajes[0].p > 0) return puntajes[0].i.responder(ctx);

  return {
    texto: 'No estoy seguro de haber entendido. Puedo ayudarte con playas, ballenas, clima y mar, cómo llegar, hospedaje, comida, cultura o armar un plan.',
    acciones: SUGERENCIAS,
  };
}

export const SUGERENCIAS_INICIALES = SUGERENCIAS;
