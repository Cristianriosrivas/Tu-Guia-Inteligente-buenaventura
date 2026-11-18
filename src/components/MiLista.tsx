import { Trash2 } from 'lucide-react';
import { LUGARES } from '../data/guia';
import { useFavoritos } from '../lib/estado';
import { Volante } from './Volante';
import './milista.css';

interface Props {
  abierta: boolean;
  onCerrar: () => void;
  onAbrirLugar: (id: string) => void;
}

const ORDEN = ['Lugar', 'Ruta', 'Hotel', 'Restaurante', 'Negocio'] as const;
const PLURAL: Record<(typeof ORDEN)[number], string> = { Lugar: 'Lugares', Ruta: 'Rutas', Hotel: 'Hospedaje', Restaurante: 'Restaurantes', Negocio: 'Negocios' };

export function MiLista({ abierta, onCerrar, onAbrirLugar }: Props) {
  const { lista, quitar } = useFavoritos();

  return (
    <Volante
      abierto={abierta}
      onCerrar={onCerrar}
      etiqueta="Mi lista"
      titulo="Mi lista"
      subtitulo={lista.length ? `${lista.length} guardado${lista.length === 1 ? '' : 's'} en este dispositivo` : 'Se guarda solo en este dispositivo'}
      lado="izquierda"
    >
      {lista.length === 0 ? (
        <div className="lista-vacia">
          <p>
            <strong>Aún no guardas nada.</strong> Toca el marcador de un lugar, ruta, hotel o restaurante y quedará sellado aquí para armar tu viaje.
          </p>
        </div>
      ) : (
        <div className="lista-grupos">
          {ORDEN.filter((t) => lista.some((f) => f.tipo === t)).map((tipo) => (
            <div key={tipo}>
              <h3>{PLURAL[tipo]}</h3>
              <ul>
                {lista
                  .filter((f) => f.tipo === tipo)
                  .map((f) => {
                    const esLugar = tipo === 'Lugar' && LUGARES.some((l) => l.id === f.id);
                    return (
                      <li key={f.id}>
                        {esLugar ? (
                          <button className="lista-nombre enlace" onClick={() => onAbrirLugar(f.id)}>
                            {f.nombre}
                          </button>
                        ) : (
                          <span className="lista-nombre">{f.nombre}</span>
                        )}
                        <button className="lista-quitar" onClick={() => quitar(f.id)} aria-label={`Quitar ${f.nombre}`}>
                          <Trash2 size={17} strokeWidth={2.4} />
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Volante>
  );
}
