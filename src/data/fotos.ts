// Fotografías de Wikimedia Commons con licencias libres (Creative Commons).
// Cada una conserva autor, licencia y enlace al archivo original para cumplir la atribución.

export interface Foto {
  src: string;
  alt: string;
  autor: string;
  licencia: string;
  fuente: string;
  /** Punto focal para object-position (CSS), útil en recortes verticales. */
  foco?: string;
}

const base = import.meta.env.BASE_URL + 'fotos/';
const commons = (archivo: string) => `https://commons.wikimedia.org/wiki/File:${archivo}`;

export const FOTOS = {
  juanchaco: {
    src: base + 'juanchaco.webp',
    alt: 'Playa de Juanchaco con lanchas en la orilla y selva al fondo',
    autor: 'Ricardo Hincapié Trujillo',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Playa_de_Juanchaco.jpg'),
  },
  ladrilleros: {
    src: base + 'ladrilleros.webp',
    alt: 'Playa de Ladrilleros frente a los acantilados del Parque Uramba',
    autor: 'Jbenavid',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Ladrilleros_Beach._Uramba_National_Park.jpg'),
  },
  laBarra: {
    src: base + 'la-barra.webp',
    alt: 'Playa de La Barra con el cielo reflejado en la arena mojada',
    autor: 'Tatiana Fernández',
    licencia: 'CC BY-SA 3.0',
    fuente: commons('Labarra.jpg'),
    foco: '50% 8%',
  },
  bahiaMalaga: {
    src: base + 'bahia-malaga.webp',
    alt: 'Atardecer sobre el Parque Nacional Natural Uramba Bahía Málaga',
    autor: 'Jerome0209',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Atardecer_en_el_PNN_Uramba_Bahía_Málaga.jpg'),
  },
  ballenas: {
    src: base + 'ballenas.webp',
    alt: 'Ballena jorobada y su cría nadando en Bahía Málaga',
    autor: 'Jardín Botánico La Manigua',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Ballena_jorobada_y_ballenato_en_Bahía_Málaga.JPG'),
    foco: '40% 75%',
  },
  cascadas: {
    src: base + 'cascadas.webp',
    alt: 'Cascada que cae entre la selva de Bahía Málaga',
    autor: 'OLMO1976',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Cascadas_Bahia_Malaga.jpg'),
    foco: '50% 40%',
  },
  manglares: {
    src: base + 'manglares.webp',
    alt: 'Raíces de manglar en los esteros de Bahía Málaga',
    autor: 'Juandareina',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Manglares_de_Bahía_Málaga.jpg'),
  },
  sanCipriano: {
    src: base + 'san-cipriano.webp',
    alt: 'Río de aguas cristalinas en la reserva de San Cipriano',
    autor: 'Remux',
    licencia: 'CC BY-SA 3.0',
    fuente: commons('Río_San_Cipriano.JPG'),
  },
  brujita: {
    src: base + 'brujita.webp',
    alt: 'Brujita: moto adaptada sobre los rieles del ferrocarril hacia San Cipriano',
    autor: 'Mario Carvajal',
    licencia: 'CC BY 2.0',
    fuente: commons('Brujita_San_Cipriano_3.jpg'),
  },
  laBocana: {
    src: base + 'la-bocana.webp',
    alt: 'Embarcadero de La Bocana',
    autor: 'Jeremy',
    licencia: 'CC BY 2.0',
    fuente: commons('La_Bocana_Port.jpg'),
  },
  pianguita: {
    src: base + 'pianguita.webp',
    alt: 'Atardecer en la playa de Piangüita',
    autor: 'Jhoanna1206',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Pianguita_atardecer.jpg'),
  },
  platoPianguita: {
    src: base + 'plato-pianguita.webp',
    alt: 'Plato típico de pescado frito con patacón en Piangüita',
    autor: 'Jhoanna1206',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Plato_tipico_Pianguita.jpg'),
  },
  malecon: {
    src: base + 'malecon.webp',
    alt: 'Malecón Bahía de la Cruz en el centro de Buenaventura',
    autor: 'JJAV14',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Malecón_Bahía_de_la_Cruz_Buenaventura.jpg'),
  },
  monumentoBallenas: {
    src: base + 'monumento-ballenas.webp',
    alt: 'Monumento a las ballenas en el malecón de Buenaventura',
    autor: 'JulianCandelo',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Monumento_a_las_ballenas_en_el_malecon.jpg'),
  },
  musicaMalecon: {
    src: base + 'musica-malecon.webp',
    alt: 'Grupo de música folclórica del Pacífico en la media torta del malecón',
    autor: 'Ngo Toure',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Grupo_de_Música_Folclórica_del_pacifico_Media_torta_del_Malecón_bahía_de_la_cruz_Buenaventura_valle_del_cauca.jpg'),
  },
  estacionTren: {
    src: base + 'estacion-tren.webp',
    alt: 'Edificio de la antigua estación del ferrocarril de Buenaventura',
    autor: 'Hernán Ordóñez Valverde',
    licencia: 'CC BY-SA 3.0',
    fuente: commons('Estación_de_Tren_de_Buenaventura_(Valle_del_Cauca)_Colombia_-Sur_América-.JPG'),
  },
  faro: {
    src: base + 'faro.webp',
    alt: 'Faro de Buenaventura frente a la bahía',
    autor: 'Autor no indicado en Commons',
    licencia: 'CC BY-SA 2.5',
    fuente: commons('Faro_Buenaventura_Colombia.jpg'),
  },
  moluscos: {
    src: base + 'moluscos.webp',
    alt: 'Venta de piangua y otros moluscos en Buenaventura',
    autor: 'Diaz.darly',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Venta_de_moluscos_Buenaventura_Colombia.jpg'),
  },
  cocinando: {
    src: base + 'cocinando-ladrilleros.webp',
    alt: 'Cocinero preparando comida típica en Ladrilleros',
    autor: 'Ricardo Hincapié Trujillo',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Hombre_cocinando,_Ladrilleros,_Buenaventura.jpg'),
  },
  pesca: {
    src: base + 'pesca-juanchaco.webp',
    alt: 'Pescadores artesanales en Juanchaco',
    autor: 'Ricardo Hincapié Trujillo',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Pesca_en_Juanchaco,_Buenaventura.jpg'),
  },
  botes: {
    src: base + 'botes-juanchaco.webp',
    alt: 'Pescador y botes de madera en Juanchaco',
    autor: 'Ricardo Hincapié Trujillo',
    licencia: 'CC BY-SA 4.0',
    fuente: commons('Pescador_y_botes,_Juanchaco.jpg'),
  },
  muelle: {
    src: base + 'muelle.webp',
    alt: 'Muelle de Buenaventura con embarcaciones',
    autor: 'leonc27',
    licencia: 'CC BY-SA 2.0',
    fuente: commons('Muelle_Buenaventura.jpg'),
  },
} satisfies Record<string, Foto>;

export type FotoId = keyof typeof FOTOS;
