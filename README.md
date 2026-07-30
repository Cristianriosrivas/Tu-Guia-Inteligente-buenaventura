Qué es este proyecto

Es un sitio de una sola página tipo folleto/landing page: su objetivo principal es mostrar y promocionar el destino de forma visual y atractiva, no operar como una plataforma de reservas real.

+Contenido y navegación: reales y funcionales (secciones, filtros, favoritos, geolocalización).

+Chat y planificador con IA: funcionales de verdad (llaman a un modelo de lenguaje).

+Botones como "Iniciar Sesión", "Reservar" o "Contáctanos": son parte del diseño visual, no están conectados a ningún sistema (no hay backend, base de datos ni autenticación real).

+Lugares, hoteles, rutas, etc.: son datos de ejemplo escritos directamente en el código, no vienen de una base de datos.



*Secciones*


Inicio= hero con imagen, estadísticas y presentación general.

Lugares de Interés= catálogo filtrable por categoría, con opción de ordenar por cercanía usando la ubicación del navegador.

Rutas Turísticas= itinerarios sugeridos con duración y número de paradas.

Hoteles y Restaurantes= fichas con calificación, ubicación y precios de referencia.

Negocios Locales= directorio de emprendimientos de la comunidad.

Planificador IA= genera un itinerario de ejemplo día por día según presupuesto, duración e intereses.

Chat flotante= asistente que responde preguntas sobre el destino usando la información del propio sitio como contexto.

Clima en vivo y Favoritos= pequeños extras interactivos para reforzar la sensación de "guía inteligente".


*Cómo verlo*


Es un archivo único, sin instalación ni dependencias:

git clone (https://github.com/Cristianriosrivas/Tu-Guia-Inteligente-buenaventura.git)


cd Tu Guía Inteligente buenaventura


⚠️ Sobre el chat y el planificador de IA

*Estas dos funciones llaman directamente a api.anthropic.com desde el navegador sin API key propia, usando una integración especial disponible solo dentro del entorno de artifacts de Claude.ai.

*Funcionan si el archivo se abre/edita dentro de Claude.ai.

*No funcionarán si despliegas el sitio en GitHub Pages, Netlify u otro hosting, porque no hay backend que autentique esas llamadas.

*El resto del folleto (navegación, filtros, favoritos, clima, geolocalización) sí funciona igual en cualquier hosting estático.

👤 Autor

Cristian — estudiante en Buenaventura, Colombia.

📄 Licencia

Proyecto de uso educativo/portafolio. Puedes adaptarlo libremente citando la fuente.
