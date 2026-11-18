# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + Three.js (React Three Fiber), publicado gratis en GitHub Pages desde el repositorio del autor. Todo debe ser gratuito: librerías open source, APIs sin costo (Open-Meteo para clima y mar, teselas de mapa libres), y la IA con Gemini (capa gratuita) a través de un proxy serverless gratuito que guarda la clave en secreto. Si la IA no está disponible, un motor local basado en los datos de la guía responde en su lugar.

## Users

Dos audiencias por igual (confirmado por el autor):

- **Turistas que planean un viaje** a Buenaventura (nacionales y extranjeros hispanohablantes): deciden si ir, qué ver, dónde dormir y comer, y arman un plan día por día. Usan el sitio desde el celular y el computador, a menudo antes del viaje y a veces ya en el destino (con conectividad irregular).
- **Quienes evalúan el portafolio del autor**: el sitio es también una pieza que demuestra dominio de frontend, 3D, animación e integración de IA.

## Product Purpose

Una guía turística inteligente de una sola página, tipo folleto interactivo, que muestra y promociona Buenaventura (Valle del Cauca, Colombia) y ayuda a planear la visita. Éxito: el visitante entiende en segundos por qué ir, encuentra lugares, rutas, hospedaje, comida y negocios locales, y sale con un itinerario propio.

## Positioning

La única guía que combina el Pacífico de Buenaventura (ballenas, manglares, playas de Juanchaco y Ladrilleros, cultura afropacífica) con herramientas que realmente trabajan: clima y condiciones del mar en vivo, orden por cercanía con la ubicación del visitante, un planificador que arma itinerarios con los lugares de la guía y un asistente que responde sobre el destino.

## Operating Context

- Secciones del producto (del README): Inicio, Lugares de Interés (filtrable, orden por cercanía), Rutas Turísticas, Hoteles y Restaurantes, Negocios Locales, Planificador IA, Chat flotante, Clima en vivo y Favoritos.
- Sin backend propio ni base de datos: los datos viven en el código. Favoritos y preferencias se guardan en el navegador del visitante.
- Botones como "Iniciar sesión", "Reservar" o "Contáctanos" no están conectados a sistemas reales de reservas ni autenticación.

## Capabilities and Constraints

- Idioma: solo español.
- Gratis de punta a punta; nada de servicios pagos ni claves expuestas en el código público.
- La IA (chat y planificador) usa Gemini mediante proxy; el sitio debe seguir funcionando completo sin él (motor local como respaldo).
- Lugares, hoteles, restaurantes, rutas y negocios son datos de referencia escritos en el código, no un catálogo comercial verificado.
- Todo commit y publicación va a nombre del autor (Cristian Rios Rivas), sin otros contribuidores.

## Brand Commitments

- Nombre del sitio en el original: "Buenaventura Guía" / "Tu Guía Inteligente".
- Pedido explícito del autor: diseño inteligente, innovador, interactivo e intuitivo; elementos 3D que se mueven; paneles movibles; sorprendente y con un toque elegante; interfaces únicas y animadas.

## Evidence on Hand

- `legacy/` conserva el HTML original (datos de ejemplo: 3 lugares, 3 rutas, 2 hoteles, 2 restaurantes, 2 negocios).
- No hay fotos propias, testimonios, alianzas comerciales, precios verificados ni datos de contacto reales (el correo y teléfono del footer original son de ejemplo). No se deben inventar reseñas, cifras de visitantes, alianzas ni contactos; los datos de ejemplo se marcan como tales.

## Product Principles

1. Herramientas que funcionan de verdad antes que botones decorativos.
2. Siempre funciona: si una API falla, hay un respaldo local honesto.
3. Buenaventura como protagonista: su mar, su selva y su cultura, no un destino genérico.
4. Honestidad de datos: lo que es referencia o ejemplo se dice.

## Accessibility & Inclusion

Uso frecuente en celular y redes móviles inestables: el 3D y las animaciones deben degradar con elegancia (prefers-reduced-motion, dispositivos modestos) y el contenido debe ser legible sin ellos.
