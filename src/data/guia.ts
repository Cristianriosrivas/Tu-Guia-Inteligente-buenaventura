import type { FotoId } from './fotos';

/*
 * Datos de referencia de la guía.
 * Las coordenadas son aproximadas y los precios son rangos orientativos:
 * confirma siempre horarios, tarifas y estado del mar con operadores locales.
 * Los negocios marcados con `ejemplo: true` son fichas de demostración, no negocios verificados.
 */

export type Zona = 'ciudad' | 'bahia-malaga' | 'bocana' | 'selva';
export type Interes = 'playa' | 'ballenas' | 'naturaleza' | 'cultura' | 'gastronomia' | 'descanso' | 'aventura';
export type Presupuesto = 'economico' | 'medio' | 'alto';

export const ZONAS: Record<Zona, { nombre: string; acceso: string }> = {
  ciudad: { nombre: 'Centro de Buenaventura', acceso: 'A pie o en taxi desde cualquier punto del centro.' },
  'bahia-malaga': { nombre: 'Juanchaco, Ladrilleros y Bahía Málaga', acceso: 'Lancha desde el Muelle Turístico, alrededor de 1 hora según el estado del mar.' },
  bocana: { nombre: 'La Bocana y Piangüita', acceso: 'Lancha corta desde el Muelle Turístico, entre 30 y 45 minutos.' },
  selva: { nombre: 'San Cipriano', acceso: 'Por carretera hasta Córdoba y luego en brujita sobre los rieles del tren.' },
};

export const INTERESES: Record<Interes, string> = {
  playa: 'Playa',
  ballenas: 'Ballenas',
  naturaleza: 'Selva y ríos',
  cultura: 'Cultura',
  gastronomia: 'Comida del Pacífico',
  descanso: 'Descanso',
  aventura: 'Aventura',
};

export const PRESUPUESTOS: Record<Presupuesto, { nombre: string; diaPorPersona: [number, number] }> = {
  economico: { nombre: 'Económico', diaPorPersona: [120_000, 200_000] },
  medio: { nombre: 'Medio', diaPorPersona: [200_000, 380_000] },
  alto: { nombre: 'Alto', diaPorPersona: [380_000, 700_000] },
};

export type CategoriaLugar = 'Playa' | 'Naturaleza' | 'Cultura' | 'Ciudad';

export interface Lugar {
  id: string;
  nombre: string;
  categoria: CategoriaLugar;
  zona: Zona;
  foto: FotoId;
  resumen: string;
  descripcion: string;
  comoLlegar: string;
  mejorEpoca: string;
  costo: 1 | 2 | 3;
  duracionHoras: number;
  intereses: Interes[];
  lat: number;
  lng: number;
  consejo?: string;
  /** Momento del día en que tiene sentido visitarlo (por defecto, cualquiera). */
  momento?: 'noche' | 'tarde';
}

export const LUGARES: Lugar[] = [
  {
    id: 'juanchaco',
    nombre: 'Juanchaco',
    categoria: 'Playa',
    zona: 'bahia-malaga',
    foto: 'juanchaco',
    resumen: 'Pueblo de pescadores y puerta de entrada al avistamiento de ballenas.',
    descripcion:
      'Playa amplia de arena oscura y aguas tranquilas en la boca de Bahía Málaga. Desde aquí salen las lanchas que buscan ballenas jorobadas entre julio y octubre, y se camina o se toma motocarro hacia Ladrilleros.',
    comoLlegar: 'Lancha desde el Muelle Turístico de Buenaventura (≈1 h).',
    mejorEpoca: 'Julio a octubre para ballenas; todo el año para playa.',
    costo: 2,
    duracionHoras: 5,
    intereses: ['playa', 'ballenas', 'descanso'],
    lat: 3.9186,
    lng: -77.3592,
    consejo: 'Revisa la marea antes de salir: con marea baja la playa se extiende cientos de metros.',
  },
  {
    id: 'ladrilleros',
    nombre: 'Ladrilleros',
    categoria: 'Playa',
    zona: 'bahia-malaga',
    foto: 'ladrilleros',
    resumen: 'Acantilados, oleaje para surf y los mejores atardeceres de la costa.',
    descripcion:
      'Playa frente a mar abierto, enmarcada por acantilados cubiertos de selva. Tiene oleaje constante para surf y es el punto favorito para ver caer el sol sobre el Pacífico.',
    comoLlegar: 'Desde Juanchaco, 20 minutos a pie o en motocarro.',
    mejorEpoca: 'Todo el año; el oleaje es mayor entre abril y octubre.',
    costo: 2,
    duracionHoras: 4,
    intereses: ['playa', 'aventura', 'descanso'],
    lat: 3.942,
    lng: -77.364,
    consejo: 'Báñate solo en zonas señaladas: las corrientes de mar abierto son fuertes.',
  },
  {
    id: 'la-barra',
    nombre: 'La Barra',
    categoria: 'Playa',
    zona: 'bahia-malaga',
    foto: 'laBarra',
    resumen: 'Caserío afro tranquilo, playa extensa y esteros de manglar.',
    descripcion:
      'Comunidad pequeña rodeada de esteros, con una playa larga y casi solitaria. Ideal para desconectarse, recorrer el manglar en canoa y comer pescado recién sacado del mar.',
    comoLlegar: 'Caminata de ≈1 h desde Ladrilleros o lancha corta según la marea.',
    mejorEpoca: 'Todo el año.',
    costo: 1,
    duracionHoras: 5,
    intereses: ['playa', 'descanso', 'naturaleza'],
    lat: 3.968,
    lng: -77.377,
  },
  {
    id: 'bahia-malaga',
    nombre: 'Parque Uramba Bahía Málaga',
    categoria: 'Naturaleza',
    zona: 'bahia-malaga',
    foto: 'bahiaMalaga',
    resumen: 'Parque nacional donde las ballenas jorobadas llegan a tener sus crías.',
    descripcion:
      'Área protegida de islas, manglares y cascadas que caen al mar. Cada año las ballenas jorobadas viajan miles de kilómetros desde la Antártida para aparearse y dar a luz en estas aguas cálidas.',
    comoLlegar: 'Tour en lancha desde Juanchaco o desde el Muelle Turístico.',
    mejorEpoca: 'Julio a octubre (temporada de ballenas).',
    costo: 3,
    duracionHoras: 4,
    intereses: ['ballenas', 'naturaleza', 'aventura'],
    lat: 4.0,
    lng: -77.3,
    consejo: 'Elige operadores con Registro Nacional de Turismo que respeten la distancia a las ballenas.',
  },
  {
    id: 'cascadas',
    nombre: 'Cascadas de Bahía Málaga',
    categoria: 'Naturaleza',
    zona: 'bahia-malaga',
    foto: 'cascadas',
    resumen: 'Saltos de agua dulce que caen entre la selva, accesibles en lancha.',
    descripcion:
      'En el interior de la bahía, varias quebradas bajan de la selva en cascadas y pozos donde se puede nadar. Suelen combinarse con el recorrido de ballenas o de manglares.',
    comoLlegar: 'Lancha desde Juanchaco y caminata corta.',
    mejorEpoca: 'Todo el año; con más caudal en temporada de lluvias.',
    costo: 2,
    duracionHoras: 3,
    intereses: ['naturaleza', 'aventura'],
    lat: 4.03,
    lng: -77.26,
  },
  {
    id: 'manglares',
    nombre: 'Esteros y manglares',
    categoria: 'Naturaleza',
    zona: 'bahia-malaga',
    foto: 'manglares',
    resumen: 'Canales de agua salobre entre raíces, recorridos en canoa o lancha.',
    descripcion:
      'Los manglares son la sala cuna del Pacífico: aquí crecen peces, cangrejos y la piangua. Un recorrido guiado con marea alta permite entrar por los esteros en silencio.',
    comoLlegar: 'Salidas desde La Barra, Juanchaco o Ladrilleros con guías locales.',
    mejorEpoca: 'Todo el año, siempre con marea alta.',
    costo: 1,
    duracionHoras: 2,
    intereses: ['naturaleza', 'descanso'],
    lat: 3.955,
    lng: -77.35,
  },
  {
    id: 'san-cipriano',
    nombre: 'Reserva San Cipriano',
    categoria: 'Naturaleza',
    zona: 'selva',
    foto: 'sanCipriano',
    resumen: 'Río cristalino en plena selva al que se llega en brujita.',
    descripcion:
      'Reserva de bosque húmedo con un río de aguas transparentes, charcos para bañarse y tubing río abajo. El viaje en brujita, una moto adaptada sobre los rieles del antiguo ferrocarril, es parte de la aventura.',
    comoLlegar: 'Carretera hasta Córdoba (≈40 min desde Buenaventura) y brujita hasta la reserva.',
    mejorEpoca: 'Todo el año; evita el día después de lluvias fuertes por la crecida.',
    costo: 1,
    duracionHoras: 6,
    intereses: ['naturaleza', 'aventura'],
    lat: 3.837,
    lng: -76.893,
  },
  {
    id: 'la-bocana',
    nombre: 'La Bocana',
    categoria: 'Playa',
    zona: 'bocana',
    foto: 'laBocana',
    resumen: 'Playa en la entrada de la bahía, cerca de la ciudad.',
    descripcion:
      'Corregimiento en la boca de la bahía de Buenaventura, con playa, cabañas y cocinas tradicionales. Es la escapada de playa más cercana a la ciudad.',
    comoLlegar: 'Lancha desde el Muelle Turístico (30–45 min).',
    mejorEpoca: 'Todo el año.',
    costo: 1,
    duracionHoras: 5,
    intereses: ['playa', 'gastronomia', 'descanso'],
    lat: 3.839,
    lng: -77.209,
  },
  {
    id: 'pianguita',
    nombre: 'Piangüita',
    categoria: 'Playa',
    zona: 'bocana',
    foto: 'pianguita',
    resumen: 'Playa de atardeceres y cocina de mar junto a La Bocana.',
    descripcion:
      'Pequeña playa vecina de La Bocana, conocida por sus cocinas familiares donde se sirven pescado frito, arroz con coco y preparaciones con piangua.',
    comoLlegar: 'Lancha desde el Muelle Turístico o caminata desde La Bocana.',
    mejorEpoca: 'Todo el año.',
    costo: 1,
    duracionHoras: 4,
    intereses: ['playa', 'gastronomia'],
    lat: 3.848,
    lng: -77.182,
  },
  {
    id: 'malecon',
    nombre: 'Malecón Bahía de la Cruz',
    categoria: 'Ciudad',
    zona: 'ciudad',
    foto: 'malecon',
    resumen: 'El paseo frente al mar del centro, con música y brisa al atardecer.',
    descripcion:
      'Paseo peatonal sobre la bahía con el monumento a las ballenas, la media torta donde se presentan grupos de música del Pacífico y vista al movimiento del puerto.',
    comoLlegar: 'En el centro, a pocas cuadras del Muelle Turístico.',
    mejorEpoca: 'Todo el año; ideal a la caída del sol.',
    costo: 1,
    duracionHoras: 2,
    intereses: ['cultura', 'descanso'],
    lat: 3.889,
    lng: -77.0795,
  },
  {
    id: 'estacion-tren',
    nombre: 'Antigua Estación del Ferrocarril',
    categoria: 'Cultura',
    zona: 'ciudad',
    foto: 'estacionTren',
    resumen: 'Edificio histórico de la llegada del tren del Pacífico.',
    descripcion:
      'La estación recuerda la época en que el Ferrocarril del Pacífico unía el puerto con Cali y el interior del país. Su arquitectura es parte de la memoria del Buenaventura moderno.',
    comoLlegar: 'En el centro, cerca del malecón.',
    mejorEpoca: 'Todo el año.',
    costo: 1,
    duracionHoras: 1,
    intereses: ['cultura'],
    lat: 3.8875,
    lng: -77.0768,
  },
  {
    id: 'musica-pacifico',
    nombre: 'Marimba y currulao',
    categoria: 'Cultura',
    zona: 'ciudad',
    foto: 'musicaMalecon',
    resumen: 'La música del Pacífico, patrimonio cultural inmaterial de la humanidad.',
    descripcion:
      'La marimba de chonta, los cununos y el guasá marcan el ritmo del currulao. En el malecón y en las casas culturales de la ciudad hay presentaciones y talleres, sobre todo en temporada de festivales.',
    comoLlegar: 'Media torta del malecón y casas culturales del centro.',
    mejorEpoca: 'Julio, mes del Festival Folclórico del Pacífico.',
    costo: 1,
    duracionHoras: 2,
    intereses: ['cultura'],
    lat: 3.8893,
    lng: -77.0788,
    momento: 'noche',
  },
  {
    id: 'faro',
    nombre: 'Faro de Buenaventura',
    categoria: 'Ciudad',
    zona: 'ciudad',
    foto: 'faro',
    resumen: 'Referencia del paisaje de la bahía y de la entrada de los barcos.',
    descripcion:
      'El faro marca la entrada a la bahía y acompaña la vista del puerto. Se aprecia mejor desde una lancha o desde el borde del agua al final de la tarde.',
    comoLlegar: 'Visible desde los recorridos en lancha por la bahía.',
    mejorEpoca: 'Todo el año.',
    costo: 1,
    duracionHoras: 1,
    intereses: ['cultura'],
    lat: 3.8935,
    lng: -77.087,
    momento: 'tarde',
  },
];

export interface Ruta {
  id: string;
  nombre: string;
  foto: FotoId;
  resumen: string;
  dias: number;
  dificultad: 'Fácil' | 'Moderada';
  temporada?: string;
  intereses: Interes[];
  paradas: { lugarId?: string; titulo: string; detalle: string }[];
}

export const RUTAS: Ruta[] = [
  {
    id: 'playas',
    nombre: 'Ruta de las Playas',
    foto: 'ladrilleros',
    resumen: 'Tres playas de la costa de Bahía Málaga en un fin de semana.',
    dias: 2,
    dificultad: 'Fácil',
    intereses: ['playa', 'descanso'],
    paradas: [
      { titulo: 'Muelle Turístico', detalle: 'Salida en lancha temprano, cuando el mar está más calmado.' },
      { lugarId: 'juanchaco', titulo: 'Juanchaco', detalle: 'Llegada, almuerzo de pescado y tarde de playa.' },
      { lugarId: 'ladrilleros', titulo: 'Ladrilleros', detalle: 'Atardecer frente a los acantilados.' },
      { lugarId: 'la-barra', titulo: 'La Barra', detalle: 'Día siguiente: caminata y playa casi solitaria.' },
    ],
  },
  {
    id: 'ballenas',
    nombre: 'Ruta de las Ballenas',
    foto: 'ballenas',
    resumen: 'Avistamiento de ballenas jorobadas, manglar y cascadas.',
    dias: 2,
    dificultad: 'Fácil',
    temporada: 'Julio a octubre',
    intereses: ['ballenas', 'naturaleza'],
    paradas: [
      { lugarId: 'juanchaco', titulo: 'Juanchaco', detalle: 'Base para dormir cerca de la bahía.' },
      { lugarId: 'bahia-malaga', titulo: 'Bahía Málaga', detalle: 'Salida de avistamiento de ballenas por la mañana.' },
      { lugarId: 'cascadas', titulo: 'Cascadas', detalle: 'Baño de agua dulce de regreso.' },
      { lugarId: 'manglares', titulo: 'Esteros', detalle: 'Recorrido en marea alta por el manglar.' },
    ],
  },
  {
    id: 'cultural',
    nombre: 'Ruta Cultural del Puerto',
    foto: 'musicaMalecon',
    resumen: 'Historia del tren, el malecón y la música del Pacífico.',
    dias: 1,
    dificultad: 'Fácil',
    intereses: ['cultura'],
    paradas: [
      { lugarId: 'estacion-tren', titulo: 'Estación del Ferrocarril', detalle: 'La historia del puerto y del tren del Pacífico.' },
      { lugarId: 'malecon', titulo: 'Malecón Bahía de la Cruz', detalle: 'Monumento a las ballenas y vista de la bahía.' },
      { lugarId: 'faro', titulo: 'Faro', detalle: 'Paseo corto en lancha por la bahía.' },
      { lugarId: 'musica-pacifico', titulo: 'Marimba y currulao', detalle: 'Música en vivo al caer la tarde.' },
    ],
  },
  {
    id: 'sabores',
    nombre: 'Ruta de los Sabores',
    foto: 'platoPianguita',
    resumen: 'Piangua, pescado y coco: un día para comer como en el Pacífico.',
    dias: 1,
    dificultad: 'Fácil',
    intereses: ['gastronomia', 'playa'],
    paradas: [
      { titulo: 'Galería de mariscos', detalle: 'Piangua, camarón y pescado fresco en el centro.' },
      { lugarId: 'la-bocana', titulo: 'La Bocana', detalle: 'Lancha corta y almuerzo en cocina tradicional.' },
      { lugarId: 'pianguita', titulo: 'Piangüita', detalle: 'Encocado y arroz con coco frente al mar.' },
      { lugarId: 'malecon', titulo: 'Malecón', detalle: 'Cocadas y jugo de borojó al regresar.' },
    ],
  },
  {
    id: 'selva',
    nombre: 'Ruta Selva y Río',
    foto: 'brujita',
    resumen: 'Brujita, río cristalino y tubing en San Cipriano.',
    dias: 1,
    dificultad: 'Moderada',
    intereses: ['naturaleza', 'aventura'],
    paradas: [
      { titulo: 'Córdoba', detalle: 'Llegada por carretera y salida en brujita.' },
      { lugarId: 'san-cipriano', titulo: 'San Cipriano', detalle: 'Caminata por la reserva y charcos.' },
      { lugarId: 'san-cipriano', titulo: 'Tubing', detalle: 'Bajada por el río en neumático con guía.' },
      { titulo: 'Regreso', detalle: 'Vuelta a Buenaventura antes del anochecer.' },
    ],
  },
];

export interface Hotel {
  id: string;
  nombre: string;
  zona: Zona;
  tipo: string;
  descripcion: string;
  rango: Presupuesto;
  precio: string;
  ejemplo: boolean;
}

export const HOTELES: Hotel[] = [
  {
    id: 'hotel-estacion',
    nombre: 'Hotel Estación',
    zona: 'ciudad',
    tipo: 'Hotel histórico',
    descripcion: 'Edificio republicano frente a la bahía, a pasos del malecón y del Muelle Turístico.',
    rango: 'alto',
    precio: 'Consulta tarifas vigentes',
    ejemplo: false,
  },
  {
    id: 'hotel-tequendama',
    nombre: 'Hotel Tequendama',
    zona: 'ciudad',
    tipo: 'Hotel urbano',
    descripcion: 'Hotel con vista al mar y servicios completos en el centro.',
    rango: 'alto',
    precio: '$150.000 – $250.000 COP',
    ejemplo: true,
  },
  {
    id: 'posada-del-mar',
    nombre: 'Posada del Mar',
    zona: 'bahia-malaga',
    tipo: 'Posada familiar',
    descripcion: 'Hotel familiar cerca de la playa de Juanchaco.',
    rango: 'medio',
    precio: '$80.000 – $120.000 COP',
    ejemplo: true,
  },
  {
    id: 'cabanas-la-barra',
    nombre: 'Cabañas comunitarias de La Barra',
    zona: 'bahia-malaga',
    tipo: 'Turismo comunitario',
    descripcion: 'Cabañas sencillas administradas por familias del caserío, con comida casera.',
    rango: 'economico',
    precio: '$50.000 – $90.000 COP',
    ejemplo: true,
  },
  {
    id: 'ecohotel-acantilados',
    nombre: 'Ecohotel Los Acantilados',
    zona: 'bahia-malaga',
    tipo: 'Ecohotel',
    descripcion: 'Cabañas de madera sobre el acantilado de Ladrilleros con vista al atardecer.',
    rango: 'medio',
    precio: '$120.000 – $200.000 COP',
    ejemplo: true,
  },
  {
    id: 'cabanas-bocana',
    nombre: 'Cabañas La Bocana',
    zona: 'bocana',
    tipo: 'Cabañas de playa',
    descripcion: 'Hospedaje sencillo a pocos pasos del mar, cerca de las cocinas de Piangüita.',
    rango: 'economico',
    precio: '$60.000 – $100.000 COP',
    ejemplo: true,
  },
];

export interface Restaurante {
  id: string;
  nombre: string;
  zona: Zona;
  cocina: string;
  descripcion: string;
  precio: 1 | 2 | 3;
  plato: string;
  ejemplo: boolean;
}

export const RESTAURANTES: Restaurante[] = [
  {
    id: 'el-pacifico',
    nombre: 'El Pacífico',
    zona: 'ciudad',
    cocina: 'Mariscos',
    descripcion: 'Mariscos frescos y cocina del Pacífico en el centro.',
    precio: 2,
    plato: 'Cazuela de mariscos',
    ejemplo: true,
  },
  {
    id: 'sabor-costeno',
    nombre: 'Sabor Costeño',
    zona: 'ciudad',
    cocina: 'Colombiana',
    descripcion: 'Comida tradicional con un toque moderno, junto al malecón.',
    precio: 1,
    plato: 'Pescado frito con patacón',
    ejemplo: true,
  },
  {
    id: 'cocinas-pianguita',
    nombre: 'Cocinas de Piangüita',
    zona: 'bocana',
    cocina: 'Tradicional',
    descripcion: 'Cocinas familiares frente al mar con encocados y arroz con coco.',
    precio: 1,
    plato: 'Encocado de piangua',
    ejemplo: true,
  },
  {
    id: 'fogon-ladrilleros',
    nombre: 'Fogón de Ladrilleros',
    zona: 'bahia-malaga',
    cocina: 'Pescados',
    descripcion: 'Pescado del día preparado a la leña, a pasos de la playa.',
    precio: 2,
    plato: 'Tapao de pescado',
    ejemplo: true,
  },
];

export interface Plato {
  nombre: string;
  descripcion: string;
}

export const PLATOS: Plato[] = [
  { nombre: 'Encocado de piangua', descripcion: 'La piangua, molusco que crece entre las raíces del manglar, guisada en leche de coco y hierbas de azotea.' },
  { nombre: 'Tapao de pescado', descripcion: 'Pescado cocido al vapor, tapado con hojas, junto a plátano verde y hierbas.' },
  { nombre: 'Sancocho de pescado', descripcion: 'Caldo espeso de pescado con plátano, yuca y coco.' },
  { nombre: 'Arroz con coco', descripcion: 'Arroz cocido en leche de coco, el acompañante de casi todo en la costa.' },
  { nombre: 'Viche', descripcion: 'Destilado ancestral de caña, reconocido por ley como patrimonio de las comunidades negras del Pacífico.' },
  { nombre: 'Jugo de borojó', descripcion: 'Fruta de la selva del Pacífico, espesa y energética.' },
];

export interface Negocio {
  id: string;
  nombre: string;
  categoria: string;
  zona: Zona;
  descripcion: string;
  ejemplo: boolean;
}

export const NEGOCIOS: Negocio[] = [
  { id: 'tours-pacifico', nombre: 'Tours Pacífico', categoria: 'Tours', zona: 'ciudad', descripcion: 'Operador de excursiones en lancha por la bahía y avistamiento de ballenas.', ejemplo: true },
  { id: 'artesanias-mar', nombre: 'Artesanías del Mar', categoria: 'Artesanías', zona: 'ciudad', descripcion: 'Productos hechos a mano por comunidades locales: tejidos, tallas y bisutería.', ejemplo: true },
  { id: 'escuela-marimba', nombre: 'Escuela de Marimba', categoria: 'Cultura', zona: 'ciudad', descripcion: 'Talleres de marimba de chonta, cununo y canto tradicional para visitantes.', ejemplo: true },
  { id: 'surf-ladrilleros', nombre: 'Surf Ladrilleros', categoria: 'Deporte', zona: 'bahia-malaga', descripcion: 'Clases de surf y alquiler de tablas frente a los acantilados.', ejemplo: true },
  { id: 'viche-tradicion', nombre: 'Viche & Tradición', categoria: 'Bebidas', zona: 'ciudad', descripcion: 'Viche, arrechón y tomaseca de productores del Pacífico.', ejemplo: true },
  { id: 'canoas-esteros', nombre: 'Canoas de los Esteros', categoria: 'Tours', zona: 'bahia-malaga', descripcion: 'Recorridos guiados en canoa por el manglar de La Barra.', ejemplo: true },
];

export const CENTRO = { lat: 3.8801, lng: -77.0313 };
export const TEMPORADA_BALLENAS = { inicio: 7, fin: 10 }; // meses (1-12), julio a octubre

export const lugarPorId = (id: string) => LUGARES.find((l) => l.id === id);
