// Proxy gratuito entre la guía (GitHub Pages) y la API de Gemini.
// La clave GEMINI_API_KEY vive como secreto de Supabase y nunca llega al navegador.
//
// Secretos / variables:
//   GEMINI_API_KEY   (obligatorio) clave gratuita de Google AI Studio
//   GEMINI_MODEL     (opcional)    por defecto gemini-3.5-flash-lite
//   ALLOWED_ORIGINS  (opcional)    orígenes permitidos separados por coma

const MODELO = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.5-flash-lite';
const ORIGENES = (Deno.env.get('ALLOWED_ORIGINS') ??
  'https://cristianriosrivas.github.io,http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const MAX_MENSAJES = 12;
const MAX_CARACTERES = 900;
const MAX_CONTEXTO = 14_000;

// Límite simple por IP dentro de cada instancia (frena abusos básicos de la cuota gratuita).
const uso = new Map<string, { n: number; desde: number }>();
function permitido(ip: string) {
  const ahora = Date.now();
  const u = uso.get(ip);
  if (!u || ahora - u.desde > 60_000) {
    uso.set(ip, { n: 1, desde: ahora });
    return true;
  }
  u.n++;
  return u.n <= 12;
}

const SISTEMA_CHAT = `Eres el Guía Virtual de "Tu Guía Inteligente", una guía turística de Buenaventura (Valle del Cauca, Colombia).
Responde siempre en español de Colombia, cálido y concreto, en máximo 5 líneas, sin markdown.
Usa la información de la guía y las condiciones en vivo que te doy. No inventes negocios, precios, teléfonos ni datos.
Las fichas marcadas como "de ejemplo" son de demostración: si alguien quiere reservar, recomiéndale confirmar con operadores locales.
Si te preguntan algo ajeno a Buenaventura o al turismo, di amablemente que tu especialidad es esta guía.
Si piden un itinerario completo, sugiere el planificador de la página.`;

const SISTEMA_PLAN = `Eres un planificador de viajes experto en Buenaventura, Colombia.
Recibes un plan base y las preferencias del viajero. Mejóralo: ajusta horarios, títulos y detalles para que sea más útil y humano,
manteniendo EXACTAMENTE el mismo número de días y la misma zona de cada día. Usa solo lugares de la guía (cita su id en "lugarId").
No inventes negocios ni precios. Responde ÚNICAMENTE con JSON válido, sin texto adicional, con esta forma:
{"dias":[{"titulo":"...","actividades":[{"hora":"08:00","titulo":"...","detalle":"una línea","lugarId":"id-opcional","tipo":"traslado|visita|comida|descanso|noche"}]}],"consejos":["..."]}`;

function cors(origen: string | null) {
  const permitido = origen && ORIGENES.includes(origen) ? origen : ORIGENES[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    Vary: 'Origin',
  };
}

Deno.serve(async (req) => {
  const origen = req.headers.get('origin');
  const cabeceras = { ...cors(origen), 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') return new Response(null, { headers: cors(origen) });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: cabeceras });
  if (!origen || !ORIGENES.includes(origen)) return new Response(JSON.stringify({ error: 'Origen no permitido' }), { status: 403, headers: cabeceras });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
  if (!permitido(ip)) return new Response(JSON.stringify({ error: 'Demasiadas solicitudes' }), { status: 429, headers: cabeceras });

  const clave = Deno.env.get('GEMINI_API_KEY');
  if (!clave) return new Response(JSON.stringify({ error: 'IA no configurada' }), { status: 503, headers: cabeceras });

  let cuerpo: { modo?: string; mensajes?: { role: string; content: string }[]; contexto?: string };
  try {
    cuerpo = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: cabeceras });
  }

  const modo = cuerpo.modo === 'plan' ? 'plan' : 'chat';
  const mensajes = (Array.isArray(cuerpo.mensajes) ? cuerpo.mensajes : [])
    .slice(-MAX_MENSAJES)
    .filter((m) => typeof m?.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, MAX_CARACTERES * (modo === 'plan' ? 6 : 1)) }] }));

  if (!mensajes.length || mensajes[mensajes.length - 1].role !== 'user') {
    return new Response(JSON.stringify({ error: 'Falta la pregunta' }), { status: 400, headers: cabeceras });
  }

  const contexto = String(cuerpo.contexto ?? '').slice(0, MAX_CONTEXTO);
  const sistema = `${modo === 'plan' ? SISTEMA_PLAN : SISTEMA_CHAT}\n\nINFORMACIÓN DE LA GUÍA:\n${contexto}`;

  const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': clave },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sistema }] },
      contents: mensajes,
      generationConfig: {
        temperature: modo === 'plan' ? 0.5 : 0.7,
        maxOutputTokens: modo === 'plan' ? 2048 : 600,
        ...(modo === 'plan' ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  });

  if (!respuesta.ok) {
    const estado = respuesta.status === 429 ? 429 : 502;
    return new Response(JSON.stringify({ error: 'La IA no respondió' }), { status: estado, headers: cabeceras });
  }

  const datos = await respuesta.json();
  const texto = (datos?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('')
    .trim();

  return new Response(JSON.stringify({ texto }), { headers: cabeceras });
});
