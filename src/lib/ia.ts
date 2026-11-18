// Cliente de IA: habla con el proxy gratuito (Supabase Edge Function) que guarda la clave de Gemini.
// Si el proxy no está configurado o falla, devuelve null y la app usa el motor local.

const ENDPOINT = (import.meta.env.VITE_IA_ENDPOINT as string | undefined)?.trim() || '';

export const iaDisponible = () => ENDPOINT.length > 0;

export interface MensajeIA {
  role: 'user' | 'assistant';
  content: string;
}

interface Peticion {
  modo: 'chat' | 'plan';
  mensajes: MensajeIA[];
  contexto: string;
}

export async function pedirIA(peticion: Peticion, signal?: AbortSignal): Promise<string | null> {
  if (!ENDPOINT) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    signal?.addEventListener('abort', () => controller.abort());
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(peticion),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = (await res.json()) as { texto?: string };
    return typeof data.texto === 'string' && data.texto.trim() ? data.texto.trim() : null;
  } catch {
    return null;
  }
}

/** Extrae el primer objeto JSON de un texto (la IA a veces lo envuelve en ```json). */
export function extraerJSON(texto: string): unknown {
  const limpio = texto.replace(/```json|```/g, '').trim();
  const inicio = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (inicio < 0 || fin <= inicio) return null;
  try {
    return JSON.parse(limpio.slice(inicio, fin + 1));
  } catch {
    return null;
  }
}
