import { Bookmark, BookmarkCheck } from 'lucide-react';
import { FOTOS } from '../data/fotos';
import { HOTELES, PLATOS, PRESUPUESTOS, RESTAURANTES, ZONAS } from '../data/guia';
import { useFavoritos } from '../lib/estado';
import './dormir.css';

function Guardar({ id, nombre, tipo }: { id: string; nombre: string; tipo: 'Hotel' | 'Restaurante' }) {
  const { es, alternar } = useFavoritos();
  const g = es(id);
  return (
    <button
      className="fila-guardar"
      aria-pressed={g}
      aria-label={g ? `Quitar ${nombre} de mi lista` : `Guardar ${nombre} en mi lista`}
      onClick={() => alternar({ id, nombre, tipo })}
    >
      {g ? <BookmarkCheck size={18} strokeWidth={2.4} /> : <Bookmark size={18} strokeWidth={2.4} />}
    </button>
  );
}

export function DormirComer() {
  return (
    <section id="dormir" className="seccion campo-papel dormir" aria-labelledby="titulo-dormir">
      <div className="contenedor">
        <h2 id="titulo-dormir" className="titulo-seccion">
          Dónde dormir y qué comer
        </h2>
        <p className="entrada">
          Tres bases para dormir: el centro, la costa de Bahía Málaga y La Bocana. Las fichas marcadas como ejemplo son de demostración: confirma tarifas y disponibilidad directamente antes de viajar.
        </p>

        <div className="dormir-rejilla">
          <div>
            <h3 className="subtitulo">Hospedaje</h3>
            <ul className="filas">
              {HOTELES.map((h) => (
                <li key={h.id} className="fila">
                  <div className="fila-principal">
                    <span className="fila-nombre">{h.nombre}</span>
                    <span className="fila-tipo">
                      {h.tipo} · {ZONAS[h.zona].nombre.split(',')[0]}
                    </span>
                    <span className="fila-desc">{h.descripcion}</span>
                  </div>
                  <div className="fila-lado">
                    <span className="fila-precio num">{h.precio}</span>
                    <span className="fila-rango">{PRESUPUESTOS[h.rango].nombre}</span>
                    {h.ejemplo && <span className="etiqueta-ejemplo">Ejemplo</span>}
                  </div>
                  <Guardar id={h.id} nombre={h.nombre} tipo="Hotel" />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="subtitulo">Restaurantes</h3>
            <ul className="filas">
              {RESTAURANTES.map((r) => (
                <li key={r.id} className="fila">
                  <div className="fila-principal">
                    <span className="fila-nombre">{r.nombre}</span>
                    <span className="fila-tipo">
                      {r.cocina} · {ZONAS[r.zona].nombre.split(',')[0]}
                    </span>
                    <span className="fila-desc">
                      {r.descripcion} Pide: {r.plato.toLowerCase()}.
                    </span>
                  </div>
                  <div className="fila-lado">
                    <span className="signos" aria-label={`Precio ${['bajo', 'medio', 'alto'][r.precio - 1]}`}>
                      {'$$$'.split('').map((s, i) => (
                        <span key={i} className={i < r.precio ? '' : 'apagado'}>
                          {s}
                        </span>
                      ))}
                    </span>
                    {r.ejemplo && <span className="etiqueta-ejemplo">Ejemplo</span>}
                  </div>
                  <Guardar id={r.id} nombre={r.nombre} tipo="Restaurante" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="platos">
          <div className="platos-fotos">
            {[FOTOS.moluscos, FOTOS.platoPianguita, FOTOS.cocinando].map((f) => (
              <figure key={f.src}>
                <img src={f.src} alt={f.alt} loading="lazy" />
                <figcaption>
                  {f.autor} · {f.licencia}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="platos-lista">
            <h3 className="subtitulo">Sabores del Pacífico</h3>
            <dl>
              {PLATOS.map((p) => (
                <div key={p.nombre}>
                  <dt>{p.nombre}</dt>
                  <dd>{p.descripcion}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
