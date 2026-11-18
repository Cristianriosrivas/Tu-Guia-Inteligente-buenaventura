import { ArrowUp, CodeXml } from 'lucide-react';
import { FOTOS } from '../data/fotos';
import { Cenefa } from './Cenefa';
import './cierre.css';

export function Cierre() {
  const fotos = Object.values(FOTOS);
  return (
    <footer className="cierre campo-mar">
      <Cenefa />
      <div className="cierre-cuerpo">
        <p className="cierre-frase">
          Nos vemos
          <br />
          en el Pacífico
        </p>
        <div className="cierre-acciones">
          <a className="boton boton-sol" href="#planifica">
            Armar mi plan
          </a>
          <a className="boton boton-linea" href="#inicio">
            <ArrowUp size={18} strokeWidth={2.6} /> Volver arriba
          </a>
        </div>

        <div className="cierre-columnas">
          <div>
            <h2>Sobre esta guía</h2>
            <p>
              Tu Guía Inteligente es un proyecto de Cristian Rios Rivas, estudiante en Buenaventura. Los lugares son reales; las coordenadas son aproximadas y los precios, de
              referencia. Las fichas marcadas como ejemplo son de demostración. Confirma siempre horarios, tarifas y el estado del mar con operadores locales.
            </p>
            <a className="cierre-repo" href="https://github.com/Cristianriosrivas/Tu-Guia-Inteligente-buenaventura" target="_blank" rel="noreferrer">
              <CodeXml size={18} strokeWidth={2.2} /> Código en GitHub
            </a>
          </div>
          <div>
            <h2>Datos abiertos</h2>
            <p>
              Clima, oleaje y marea: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> (CC BY 4.0). Mapa: ©{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                OpenStreetMap
              </a>{' '}
              y <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>. Asistente: motor local con los datos de la guía y, si está configurada, la API
              gratuita de Gemini.
            </p>
          </div>
          <div>
            <h2>Fotografías</h2>
            <ul className="creditos">
              {fotos.map((f) => (
                <li key={f.src}>
                  <a href={f.fuente} target="_blank" rel="noreferrer">
                    {f.alt}
                  </a>{' '}
                  · {f.autor} · {f.licencia}
                </li>
              ))}
            </ul>
            <p className="creditos-nota">Fotos de Wikimedia Commons, redimensionadas y convertidas a WebP. Se comparten bajo la misma licencia de cada original.</p>
          </div>
        </div>

        <p className="cierre-firma">
          © {new Date().getFullYear()} Cristian Rios Rivas · Hecho en Buenaventura, Valle del Cauca
        </p>
      </div>
    </footer>
  );
}
