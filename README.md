# Tu Guía Inteligente · Buenaventura

Guía turística interactiva de Buenaventura, Colombia, diseñada como un **cartel serigrafiado vivo** del Pacífico: una ballena jorobada en 3D salta entre las letras, el mar y el clima se leen en vivo y el planificador arma tu viaje en un minuto.

Todo es **gratis**: librerías de código abierto, datos abiertos y la capa gratuita de la IA de Gemini.

## Qué tiene

| Sección | Qué hace |
| --- | --- |
| **Cartel de inicio** | Ballena jorobada 3D hecha por código (Three.js) con sombreado de tintas planas y trama de medio tono. Datos en vivo (temperatura, oleaje, atardecer, temporada de ballenas) y planificador rápido. |
| **El mar de hoy** | Curva de marea de las próximas 24 h, oleaje, temperatura del agua y pronóstico de 5 días (Open-Meteo, sin clave). |
| **Lugares** | 13 lugares reales con fotos libres de Wikimedia Commons en duotono, filtros, orden por cercanía con tu ubicación y vista de mapa (OpenStreetMap). Ficha detallada con cómo llegar, mejor época y consejo local. |
| **Rutas** | 5 recorridos en una tira de carteles que se arrastra; cada parada abre su lugar. |
| **Dormir y comer** | Hospedaje y restaurantes por zona, y los platos típicos del Pacífico. |
| **Negocios locales** | Directorio de emprendimientos y botón para registrar un negocio (abre un issue en este repositorio). |
| **Planificador** | Reparte tus días por zonas, cuida los traslados en lancha, sugiere hospedaje y estima costos. Si la IA está activa, Gemini lo afina. Se descarga como imagen, se agrega al calendario (.ics) o se comparte por enlace. |
| **Guía virtual** | Asistente en un panel que se arrastra por la pantalla. Responde con Gemini cuando está configurado y, si no, con un motor local que usa los datos de la guía y el clima en vivo. |
| **Mi lista** | Favoritos sellados que se guardan en tu dispositivo. |

> Los lugares son reales; las coordenadas son aproximadas y los precios, de referencia. Las fichas de hoteles, restaurantes y negocios marcadas como **Ejemplo** son de demostración.

## Cómo correrlo

Necesitas [Node.js](https://nodejs.org/) 20.19 o superior.

```bash
git clone https://github.com/Cristianriosrivas/Tu-Guia-Inteligente-buenaventura.git
cd Tu-Guia-Inteligente-buenaventura
npm install
npm run dev
```

Abre <http://localhost:5173>. Para generar la versión de producción: `npm run build`.

## Publicación gratis en GitHub Pages

El flujo `.github/workflows/pages.yml` construye y publica el sitio en cada `push` a `main`.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz `push` a `main`. El sitio queda en `https://cristianriosrivas.github.io/Tu-Guia-Inteligente-buenaventura/`.

## IA gratis con Gemini (opcional)

La clave de Gemini **nunca** va en el código público. Vive como secreto en una función gratuita de Supabase (`supabase/functions/guia-ia`) que hace de puente. Sin ella, la guía funciona igual con el motor local.

1. Crea una clave gratuita en [Google AI Studio](https://aistudio.google.com/apikey).
2. En tu proyecto de [Supabase](https://supabase.com/) (plan gratuito), despliega la función `guia-ia` y agrega el secreto `GEMINI_API_KEY` en **Edge Functions → Secrets**. Opcionales: `GEMINI_MODEL` (por defecto `gemini-3.5-flash-lite`) y `ALLOWED_ORIGINS`.
3. En GitHub: **Settings → Secrets and variables → Actions → Variables** crea `IA_ENDPOINT` con la URL de la función, por ejemplo `https://<tu-proyecto>.supabase.co/functions/v1/guia-ia`.
4. Para probar en local, crea `.env.local` con `VITE_IA_ENDPOINT=<la misma URL>`.

La función limita el tamaño de las preguntas, acepta solo los orígenes permitidos y frena abusos básicos por IP.

## Tecnología

React 19 · Vite · TypeScript · Three.js con React Three Fiber · Motion · Leaflet · Lucide · Open-Meteo · OpenStreetMap · Wikimedia Commons · Gemini API · Supabase Edge Functions.

## Créditos

- Fotografías: autores de Wikimedia Commons, con licencias Creative Commons (detalle en el pie de la página y en `src/data/fotos.ts`).
- Clima y mar: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0).
- Mapa: © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright).
- La versión original de un solo archivo está en `legacy/tu-guia-original.html`.

## Autor

**Cristian Rios Rivas**, estudiante en Buenaventura, Colombia.

## Licencia

Código bajo licencia MIT. Las fotografías conservan la licencia de cada autor.
