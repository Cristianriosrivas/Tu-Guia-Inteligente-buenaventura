import {
  HOTELES,
  LUGARES,
  PRESUPUESTOS,
  RESTAURANTES,
  TEMPORADA_BALLENAS,
  ZONAS,
  type Hotel,
  type Interes,
  type Lugar,
  type Presupuesto,
  type Zona,
} from '../data/guia';

export interface Preferencias {
  dias: number;
  presupuesto: Presupuesto;
  intereses: Interes[];
  /** Mes del viaje (1-12). Define si es temporada de ballenas. */
  mes: number;
}

export interface Actividad {
  hora: string;
  titulo: string;
  detalle: string;
  lugarId?: string;
  tipo: 'traslado' | 'visita' | 'comida' | 'descanso' | 'noche';
}

export interface DiaPlan {
  numero: number;
  titulo: string;
  zona: Zona;
  actividades: Actividad[];
}

export interface Plan {
  titulo: string;
  dias: DiaPlan[];
  hospedaje: Hotel[];
  costo: [number, number];
  consejos: string[];
  fuente: 'local' | 'ia';
}

export const esTemporadaBallenas = (mes: number) => mes >= TEMPORADA_BALLENAS.inicio && mes <= TEMPORADA_BALLENAS.fin;

/** Generador pseudoaleatorio con semilla para que "otra versión" sea reproducible. */
function aleatorio(semilla: number) {
  let s = semilla >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10_000) / 10_000;
  };
}

function puntuar(lugar: Lugar, pref: Preferencias): number {
  let p = 0;
  for (const i of lugar.intereses) if (pref.intereses.includes(i)) p += 3;
  if (lugar.intereses.includes('ballenas')) p += esTemporadaBallenas(pref.mes) ? 3 : -4;
  if (pref.presupuesto === 'economico') p -= (lugar.costo - 1) * 1.5;
  return p;
}

function puntuarZona(zona: Zona, pref: Preferencias): number {
  const lugares = LUGARES.filter((l) => l.zona === zona);
  const mejores = lugares.map((l) => puntuar(l, pref)).sort((a, b) => b - a).slice(0, 3);
  return mejores.reduce((a, b) => a + Math.max(b, 0), 0);
}

const comidaEn = (zona: Zona, pref: Preferencias, rnd: () => number) => {
  const tope = pref.presupuesto === 'economico' ? 1 : pref.presupuesto === 'medio' ? 2 : 3;
  const opciones = RESTAURANTES.filter((r) => r.zona === zona && r.precio <= tope);
  const lista = opciones.length ? opciones : RESTAURANTES.filter((r) => r.zona === zona);
  return lista.length ? lista[Math.floor(rnd() * lista.length)] : undefined;
};

/** Asigna una zona a cada día, priorizando lo que más encaja con los intereses. */
function repartirZonas(pref: Preferencias): Zona[] {
  const ranking = (['bahia-malaga', 'bocana', 'selva'] as Zona[])
    .map((z) => ({ z, p: puntuarZona(z, pref) }))
    .sort((a, b) => b.p - a.p);

  const dias: Zona[] = [];
  const quiereBahia = ranking.find((r) => r.z === 'bahia-malaga')!.p > 3;

  if (pref.dias === 1) {
    const top = ranking[0];
    // Un solo día: Bahía Málaga exige lancha larga, mejor la ciudad o una escapada corta.
    dias.push(top.z === 'bahia-malaga' ? 'bocana' : top.p > 4 ? top.z : 'ciudad');
    return dias;
  }

  dias.push('ciudad');
  const restantes = pref.dias - 1;
  if (quiereBahia) {
    const enBahia = Math.min(restantes, pref.dias >= 4 ? 2 : restantes >= 2 ? 2 : 1);
    for (let i = 0; i < enBahia; i++) dias.push('bahia-malaga');
  }
  for (const r of ranking) {
    if (dias.length >= pref.dias) break;
    if (r.z === 'bahia-malaga') continue;
    if (r.p > 0 || dias.length < pref.dias) dias.push(r.z);
  }
  while (dias.length < pref.dias) dias.push(quiereBahia ? 'bahia-malaga' : 'ciudad');
  return dias.slice(0, pref.dias);
}

function hospedajePara(zona: Zona, pref: Preferencias): Hotel | undefined {
  const enZona = HOTELES.filter((h) => h.zona === zona);
  return enZona.find((h) => h.rango === pref.presupuesto) ?? enZona[0];
}

export function generarPlan(pref: Preferencias, semilla = 1): Plan {
  const rnd = aleatorio(semilla * 7919 + pref.dias * 31 + pref.intereses.length);
  const zonas = repartirZonas(pref);
  const usados = new Set<string>();
  const temporada = esTemporadaBallenas(pref.mes);

  const dias: DiaPlan[] = zonas.map((zona, idx) => {
    const numero = idx + 1;
    const anterior = zonas[idx - 1];
    const candidatos = LUGARES.filter((l) => l.zona === zona && !usados.has(l.id) && l.momento !== 'noche')
      .map((l) => ({ l, p: puntuar(l, pref) + rnd() * 1.5 }))
      .sort((a, b) => b.p - a.p)
      .map((c) => c.l);

    const actividades: Actividad[] = [];
    const llegaEnLancha = (zona === 'bahia-malaga' || zona === 'bocana') && anterior !== zona;

    if (numero === 1 && zona === 'ciudad') {
      actividades.push({ hora: '10:00', titulo: 'Llegada a Buenaventura', detalle: 'Por carretera desde Cali (≈3 h) o en vuelo regional. Deja el equipaje y sal a caminar.', tipo: 'traslado' });
    }
    if (llegaEnLancha) {
      actividades.push({ hora: '07:30', titulo: 'Lancha desde el Muelle Turístico', detalle: ZONAS[zona].acceso + ' Sal temprano: el mar suele estar más calmado.', tipo: 'traslado' });
    }
    if (zona === 'selva') {
      actividades.push({ hora: '08:00', titulo: 'Carretera a Córdoba y brujita', detalle: ZONAS.selva.acceso, tipo: 'traslado' });
    }

    const manana = candidatos.find((l) => l.momento !== 'tarde');
    if (manana) candidatos.splice(candidatos.indexOf(manana), 1);
    const llegaDia1 = numero === 1 && zona === 'ciudad';
    if (manana) {
      usados.add(manana.id);
      const esBallenas = manana.intereses.includes('ballenas') && temporada;
      actividades.push({
        hora: llegaDia1 ? '11:00' : llegaEnLancha || zona === 'selva' ? '09:30' : '08:30',
        titulo: esBallenas ? `${manana.nombre}: avistamiento de ballenas` : manana.nombre,
        detalle: manana.resumen,
        lugarId: manana.id,
        tipo: 'visita',
      });
    }

    const almuerzo = comidaEn(zona, pref, rnd);
    actividades.push({
      hora: '13:00',
      titulo: almuerzo ? `Almuerzo en ${almuerzo.nombre}` : 'Almuerzo de cocina local',
      detalle: almuerzo ? `Pide ${almuerzo.plato.toLowerCase()}.` : 'Pregunta por el pescado del día y el arroz con coco.',
      tipo: 'comida',
    });

    const tarde = candidatos.find((l) => pref.dias > 1 || l.duracionHoras <= 3) ?? candidatos[0];
    if (tarde) {
      usados.add(tarde.id);
      actividades.push({ hora: '15:00', titulo: tarde.nombre, detalle: tarde.resumen, lugarId: tarde.id, tipo: 'visita' });
    } else if (zona !== 'selva') {
      actividades.push({ hora: '15:00', titulo: 'Tarde libre frente al mar', detalle: 'Hamaca, lectura y un jugo de borojó.', tipo: 'descanso' });
    }

    if (zona === 'selva') {
      actividades.push({ hora: '16:30', titulo: 'Regreso a Buenaventura', detalle: 'La brujita no circula de noche: vuelve con luz.', tipo: 'traslado' });
    } else {
      const atardecer = zona === 'bahia-malaga' ? 'Atardecer en Ladrilleros' : zona === 'ciudad' ? 'Atardecer en el malecón' : 'Atardecer en la playa';
      actividades.push({ hora: '17:45', titulo: atardecer, detalle: 'El sol cae sobre el Pacífico pasadas las 6 de la tarde.', tipo: 'descanso' });
    }

    if (zona === 'ciudad' && pref.intereses.includes('cultura')) {
      actividades.push({ hora: '19:30', titulo: 'Música del Pacífico', detalle: 'Busca presentaciones de marimba y currulao en el centro.', lugarId: 'musica-pacifico', tipo: 'noche' });
    }

    const titulos: Record<Zona, string> = {
      ciudad: 'El puerto y su malecón',
      'bahia-malaga': temporada ? 'Ballenas y playas de Bahía Málaga' : 'Playas de Bahía Málaga',
      bocana: 'La Bocana y Piangüita',
      selva: 'Selva y río en San Cipriano',
    };

    return { numero, titulo: titulos[zona], zona, actividades };
  });

  const noches = new Map<Zona, Hotel>();
  zonas.forEach((z, i) => {
    const duermeEn = z === 'selva' ? 'ciudad' : z;
    if (i < zonas.length - 1 || pref.dias === 1) {
      const h = hospedajePara(duermeEn, pref);
      if (h) noches.set(duermeEn, h);
    }
  });

  const rango = PRESUPUESTOS[pref.presupuesto].diaPorPersona;
  const consejos = [
    'Lleva impermeable liviano: llueve con frecuencia todo el año.',
    'Pregunta la hora de la marea antes de cada salida en lancha.',
    'Contrata operadores con Registro Nacional de Turismo (RNT) y usa chaleco salvavidas.',
  ];
  if (pref.intereses.includes('ballenas') && !temporada) {
    consejos.unshift('Las ballenas jorobadas llegan de julio a octubre; en otras fechas el plan se enfoca en playas y selva.');
  }
  if (temporada) consejos.unshift('Estás en temporada de ballenas: reserva el avistamiento con anticipación.');

  return {
    titulo: `${pref.dias} ${pref.dias === 1 ? 'día' : 'días'} en el Pacífico`,
    dias,
    hospedaje: [...noches.values()],
    costo: [rango[0] * pref.dias, rango[1] * pref.dias],
    consejos: consejos.slice(0, 4),
    fuente: 'local',
  };
}

/** Valida y normaliza un plan devuelto por la IA. Devuelve null si no es utilizable. */
export function validarPlanIA(dato: unknown, base: Plan): Plan | null {
  if (!dato || typeof dato !== 'object') return null;
  const d = dato as { dias?: unknown; consejos?: unknown };
  if (!Array.isArray(d.dias) || d.dias.length !== base.dias.length) return null;
  const idsValidos = new Set(LUGARES.map((l) => l.id));
  const dias: DiaPlan[] = [];
  for (let i = 0; i < d.dias.length; i++) {
    const dia = d.dias[i] as { titulo?: unknown; actividades?: unknown };
    if (!Array.isArray(dia.actividades) || dia.actividades.length < 2) return null;
    const actividades: Actividad[] = [];
    for (const a of dia.actividades.slice(0, 7) as Record<string, unknown>[]) {
      if (typeof a.titulo !== 'string' || typeof a.hora !== 'string') return null;
      const lugarId = typeof a.lugarId === 'string' && idsValidos.has(a.lugarId) ? a.lugarId : undefined;
      const tipos = ['traslado', 'visita', 'comida', 'descanso', 'noche'] as const;
      const tipo = tipos.includes(a.tipo as (typeof tipos)[number]) ? (a.tipo as Actividad['tipo']) : 'visita';
      actividades.push({ hora: a.hora.slice(0, 5), titulo: a.titulo.slice(0, 80), detalle: String(a.detalle ?? '').slice(0, 220), lugarId, tipo });
    }
    dias.push({ numero: i + 1, titulo: typeof dia.titulo === 'string' ? dia.titulo.slice(0, 60) : base.dias[i].titulo, zona: base.dias[i].zona, actividades });
  }
  const consejos = Array.isArray(d.consejos) ? d.consejos.filter((c): c is string => typeof c === 'string').slice(0, 4) : base.consejos;
  return { ...base, dias, consejos: consejos.length ? consejos : base.consejos, fuente: 'ia' };
}
