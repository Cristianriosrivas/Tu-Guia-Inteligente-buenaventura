import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { CONDICIONES_RESPALDO, cargarCondiciones, type Condiciones } from './mar';

/* ---------- Almacenamiento local seguro ---------- */

function leer<T>(clave: string, defecto: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : defecto;
  } catch {
    return defecto;
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* modo privado o almacenamiento bloqueado: seguimos sin persistir */
  }
}

/* ---------- Favoritos (compartidos entre componentes) ---------- */

export interface Favorito {
  id: string;
  nombre: string;
  tipo: 'Lugar' | 'Hotel' | 'Restaurante' | 'Negocio' | 'Ruta';
}

const CLAVE_FAV = 'tuguia:favoritos';
let favoritos: Favorito[] = leer<Favorito[]>(CLAVE_FAV, []);
const oyentes = new Set<() => void>();

function emitir() {
  guardar(CLAVE_FAV, favoritos);
  oyentes.forEach((o) => o());
}

export const favoritosStore = {
  suscribir(o: () => void) {
    oyentes.add(o);
    return () => oyentes.delete(o);
  },
  obtener: () => favoritos,
  alternar(f: Favorito) {
    favoritos = favoritos.some((x) => x.id === f.id) ? favoritos.filter((x) => x.id !== f.id) : [...favoritos, f];
    emitir();
  },
  quitar(id: string) {
    favoritos = favoritos.filter((x) => x.id !== id);
    emitir();
  },
};

export function useFavoritos() {
  const lista = useSyncExternalStore(
    (o) => {
      const quitar = favoritosStore.suscribir(o);
      return () => {
        quitar();
      };
    },
    favoritosStore.obtener,
    favoritosStore.obtener,
  );
  const es = useCallback((id: string) => lista.some((f) => f.id === id), [lista]);
  return { lista, es, alternar: favoritosStore.alternar, quitar: favoritosStore.quitar };
}

/* ---------- Condiciones en vivo (una sola carga para toda la app) ---------- */

type EstadoCondiciones = { datos: Condiciones; cargando: boolean; error: boolean };
let estadoCond: EstadoCondiciones = { datos: CONDICIONES_RESPALDO, cargando: true, error: false };
const oyentesCond = new Set<() => void>();
let pedido = false;

function cargar() {
  if (pedido) return;
  pedido = true;
  cargarCondiciones()
    .then((datos) => (estadoCond = { datos, cargando: false, error: false }))
    .catch(() => (estadoCond = { datos: CONDICIONES_RESPALDO, cargando: false, error: true }))
    .finally(() => oyentesCond.forEach((o) => o()));
}

export function useCondiciones(): EstadoCondiciones {
  useEffect(cargar, []);
  return useSyncExternalStore(
    (o) => {
      oyentesCond.add(o);
      return () => {
        oyentesCond.delete(o);
      };
    },
    () => estadoCond,
    () => estadoCond,
  );
}

/* ---------- Ubicación del visitante ---------- */

export type EstadoUbicacion =
  | { estado: 'inactiva' }
  | { estado: 'buscando' }
  | { estado: 'lista'; lat: number; lng: number }
  | { estado: 'error'; mensaje: string };

export function useUbicacion() {
  const [ubicacion, setUbicacion] = useState<EstadoUbicacion>({ estado: 'inactiva' });
  const pedir = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setUbicacion({ estado: 'error', mensaje: 'Tu navegador no permite compartir la ubicación.' });
      return;
    }
    setUbicacion({ estado: 'buscando' });
    navigator.geolocation.getCurrentPosition(
      (p) => setUbicacion({ estado: 'lista', lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) =>
        setUbicacion({
          estado: 'error',
          mensaje: e.code === e.PERMISSION_DENIED ? 'Permiso de ubicación denegado. Actívalo en tu navegador para ordenar por cercanía.' : 'No pudimos obtener tu ubicación. Intenta de nuevo.',
        }),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }, []);
  const limpiar = useCallback(() => setUbicacion({ estado: 'inactiva' }), []);
  return { ubicacion, pedir, limpiar };
}

/* ---------- Preferencia de movimiento reducido ---------- */

export function useMovimientoReducido() {
  return useSyncExternalStore(
    (o) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', o);
      return () => mq.removeEventListener('change', o);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
