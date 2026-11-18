// Clima y condiciones del mar en vivo con Open-Meteo (gratis, sin clave).
// Los valores del mar vienen de un modelo oceánico: sirven para planear, no para navegar.

const LAT = 3.89;
const LNG = -77.1;

export interface Pronostico {
  fecha: string;
  max: number;
  min: number;
  lluviaProb: number;
  codigo: number;
}

export interface Condiciones {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  codigo: number;
  lluviaHoy: number;
  amanecer: string;
  atardecer: string;
  dias: Pronostico[];
  oleaje: number | null;
  periodoOla: number | null;
  temperaturaMar: number | null;
  /** Nivel del mar por hora (m sobre el nivel medio) para las próximas 24 h. */
  marea: { hora: string; nivel: number }[];
  actualizado: Date;
  enVivo: boolean;
}

export const CONDICIONES_RESPALDO: Condiciones = {
  temperatura: 27,
  sensacion: 31,
  humedad: 86,
  viento: 8,
  codigo: 3,
  lluviaHoy: 70,
  amanecer: '05:55',
  atardecer: '18:05',
  dias: [],
  oleaje: null,
  periodoOla: null,
  temperaturaMar: null,
  marea: [],
  actualizado: new Date(),
  enVivo: false,
};

export function textoClima(codigo: number): string {
  if (codigo === 0) return 'Despejado';
  if (codigo <= 2) return 'Parcialmente nublado';
  if (codigo === 3) return 'Nublado';
  if (codigo === 45 || codigo === 48) return 'Neblina';
  if (codigo >= 51 && codigo <= 57) return 'Llovizna';
  if (codigo >= 61 && codigo <= 67) return 'Lluvia';
  if (codigo >= 80 && codigo <= 82) return 'Aguaceros';
  if (codigo >= 95) return 'Tormenta eléctrica';
  return 'Cálido y húmedo';
}

const hhmm = (iso: string) => iso.slice(11, 16);

export async function cargarCondiciones(signal?: AbortSignal): Promise<Condiciones> {
  const clima = new URL('https://api.open-meteo.com/v1/forecast');
  clima.search = new URLSearchParams({
    latitude: String(LAT),
    longitude: String(LNG),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'America/Bogota',
    forecast_days: '5',
  }).toString();

  const mar = new URL('https://marine-api.open-meteo.com/v1/marine');
  mar.search = new URLSearchParams({
    latitude: '3.88',
    longitude: '-77.3',
    current: 'wave_height,wave_period,sea_surface_temperature',
    hourly: 'sea_level_height_msl',
    timezone: 'America/Bogota',
    forecast_days: '2',
  }).toString();

  const [rc, rm] = await Promise.allSettled([
    fetch(clima, { signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(mar, { signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
  ]);

  if (rc.status !== 'fulfilled') throw new Error('Sin datos de clima');
  const c = rc.value;
  const d = c.daily;

  const resultado: Condiciones = {
    temperatura: Math.round(c.current.temperature_2m),
    sensacion: Math.round(c.current.apparent_temperature),
    humedad: Math.round(c.current.relative_humidity_2m),
    viento: Math.round(c.current.wind_speed_10m),
    codigo: c.current.weather_code,
    lluviaHoy: d.precipitation_probability_max?.[0] ?? 0,
    amanecer: hhmm(d.sunrise[0]),
    atardecer: hhmm(d.sunset[0]),
    dias: d.time.map((fecha: string, i: number) => ({
      fecha,
      max: Math.round(d.temperature_2m_max[i]),
      min: Math.round(d.temperature_2m_min[i]),
      lluviaProb: d.precipitation_probability_max?.[i] ?? 0,
      codigo: d.weather_code[i],
    })),
    oleaje: null,
    periodoOla: null,
    temperaturaMar: null,
    marea: [],
    actualizado: new Date(),
    enVivo: true,
  };

  if (rm.status === 'fulfilled') {
    const m = rm.value;
    resultado.oleaje = m.current?.wave_height ?? null;
    resultado.periodoOla = m.current?.wave_period ?? null;
    resultado.temperaturaMar = m.current?.sea_surface_temperature != null ? Math.round(m.current.sea_surface_temperature) : null;
    const ahora = Date.now();
    const horas: string[] = m.hourly?.time ?? [];
    const niveles: (number | null)[] = m.hourly?.sea_level_height_msl ?? [];
    const inicio = Math.max(0, horas.findIndex((h) => new Date(h + ':00-05:00').getTime() >= ahora - 3600_000));
    resultado.marea = horas
      .slice(inicio, inicio + 25)
      .map((hora, i) => ({ hora, nivel: niveles[inicio + i] ?? NaN }))
      .filter((p) => Number.isFinite(p.nivel));
  }

  return resultado;
}

/** Tendencia de la marea en la hora actual: sube, baja o estable. */
export function tendenciaMarea(marea: Condiciones['marea']): 'sube' | 'baja' | 'estable' | null {
  if (marea.length < 2) return null;
  const delta = marea[1].nivel - marea[0].nivel;
  if (Math.abs(delta) < 0.03) return 'estable';
  return delta > 0 ? 'sube' : 'baja';
}

/** Próxima pleamar (máximo local) en la serie. */
export function proximaPleamar(marea: Condiciones['marea']) {
  for (let i = 1; i < marea.length - 1; i++) {
    if (marea[i].nivel >= marea[i - 1].nivel && marea[i].nivel > marea[i + 1].nivel) return marea[i];
  }
  return null;
}
