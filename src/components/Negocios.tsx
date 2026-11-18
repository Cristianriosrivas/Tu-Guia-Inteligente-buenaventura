import { ArrowUpRight } from 'lucide-react';
import { NEGOCIOS, ZONAS } from '../data/guia';
import './negocios.css';

const REPO = 'https://github.com/Cristianriosrivas/Tu-Guia-Inteligente-buenaventura';

const plantilla = encodeURIComponent(
  `**Nombre del negocio:**\n\n**Categoría (tours, comida, hospedaje, artesanías, cultura…):**\n\n**Zona:**\n\n**Descripción corta:**\n\n**Cómo contactarlos (sitio web o red social pública):**\n`,
);

export function Negocios() {
  return (
    <section id="negocios" className="seccion campo-achiote negocios" aria-labelledby="titulo-negocios">
      <div className="contenedor">
        <h2 id="titulo-negocios" className="titulo-seccion">
          Hecho en Buenaventura
        </h2>
        <p className="entrada">
          Emprendimientos de la comunidad: tours, música, artesanías y bebidas tradicionales. Estas fichas son ejemplos de cómo se verá el directorio; los negocios reales se suman a medida que se registran.
        </p>

        <ul className="cartelera">
          {NEGOCIOS.map((n) => (
            <li key={n.id}>
              <span className="cartelera-categoria">{n.categoria}</span>
              <span className="cartelera-nombre">{n.nombre}</span>
              <span className="cartelera-desc">
                {n.descripcion} <em>{ZONAS[n.zona].nombre.split(',')[0]}.</em>
              </span>
              {n.ejemplo && <span className="etiqueta-ejemplo">Ejemplo</span>}
            </li>
          ))}
        </ul>

        <div className="sumate">
          <p>
            <strong>¿Tienes un negocio en Buenaventura?</strong> Súmalo a la guía sin costo: cuéntanos qué haces y lo publicamos.
          </p>
          <a
            className="boton boton-sol"
            href={`${REPO}/issues/new?title=${encodeURIComponent('Registrar negocio: ')}&body=${plantilla}`}
            target="_blank"
            rel="noreferrer"
          >
            Registrar mi negocio <ArrowUpRight size={20} strokeWidth={2.6} />
          </a>
        </div>
      </div>
    </section>
  );
}
