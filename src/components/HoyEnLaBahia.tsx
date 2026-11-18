import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Sun, type LucideIcon } from 'lucide-react';
import { useCondiciones } from '../lib/estado';
import { proximaPleamar, tendenciaMarea, textoClima, type Condiciones } from '../lib/mar';
import './hoy.css';

function icono(codigo: number): LucideIcon {
  if (codigo === 0) return Sun;
  if (codigo <= 2) return CloudSun;
  if (codigo === 3) return Cloud;
  if (codigo === 45 || codigo === 48) return CloudFog;
  if (codigo >= 51 && codigo <= 57) return CloudDrizzle;
  if (codigo >= 95) return CloudLightning;
  if (codigo >= 61) return CloudRain;
  return Cloud;
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const coma = (n: number, d = 1) => (Math.abs(n) < 0.05 ? 0 : n).toFixed(d).replace('.', ',');

function TrazoMarea({ marea }: { marea: Condiciones['marea'] }) {
  const W = 640;
  const H = 230;
  const m = { izq: 44, der: 14, arr: 28, aba: 30 };
  const niveles = marea.map((p) => p.nivel);
  const min = Math.min(...niveles);
  const max = Math.max(...niveles);
  const rango = Math.max(0.2, max - min);
  const x = (i: number) => m.izq + (i / (marea.length - 1)) * (W - m.izq - m.der);
  const y = (v: number) => m.arr + (1 - (v - min) / rango) * (H - m.arr - m.aba);
  const linea = marea.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.nivel).toFixed(1)}`).join(' ');
  const area = `${linea} L${x(marea.length - 1)} ${H - m.aba} L${x(0)} ${H - m.aba} Z`;
  const pleamar = proximaPleamar(marea);
  const iPle = pleamar ? marea.indexOf(pleamar) : -1;
  const marcas = [min, (min + max) / 2, max];

  return (
    <svg className="trazo" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Nivel del mar estimado para las próximas 24 horas, entre ${coma(min)} y ${coma(max)} metros`}>
      {marcas.map((v) => (
        <g key={v}>
          <line x1={m.izq} x2={W - m.der} y1={y(v)} y2={y(v)} className="reticula" />
          <text x={m.izq - 8} y={y(v) + 4} className="eje" textAnchor="end">
            {coma(v)}
          </text>
        </g>
      ))}
      {marea.map((p, i) =>
        i % 3 === 0 ? (
          <text key={p.hora} x={x(i)} y={H - 8} className="eje" textAnchor="middle">
            {p.hora.slice(11, 13)}h
          </text>
        ) : null,
      )}
      <path d={area} className="area" />
      <path d={linea} className="linea-marea" />
      <line x1={x(0)} x2={x(0)} y1={m.arr - 10} y2={H - m.aba} className="ahora" />
      <circle cx={x(0)} cy={y(marea[0].nivel)} r={6} className="punto" />
      <text x={x(0) + 10} y={m.arr - 12} className="eje fuerte">
        Ahora
      </text>
      {iPle > 0 && (
        <g>
          <circle cx={x(iPle)} cy={y(marea[iPle].nivel)} r={5} className="punto-ple" />
          <text x={x(iPle)} y={y(marea[iPle].nivel) - 12} className="eje fuerte" textAnchor="middle">
            Pleamar {marea[iPle].hora.slice(11, 16)}
          </text>
        </g>
      )}
    </svg>
  );
}

export function HoyEnLaBahia() {
  const { datos, cargando, error } = useCondiciones();
  const tendencia = tendenciaMarea(datos.marea);

  return (
    <section id="condiciones" className="seccion campo-sol hoy" aria-labelledby="titulo-hoy">
      <div className="contenedor hoy-rejilla">
        <div className="hoy-cabeza">
          <h2 id="titulo-hoy" className="titulo-seccion">
            El mar de hoy
          </h2>
          <p className="entrada">
            Las lanchas a Juanchaco y La Bocana dependen de la marea y el oleaje. Revisa el pronóstico antes de salir y madruga: el mar suele estar más calmado temprano.
          </p>
          {error && <p className="hoy-aviso">No pudimos cargar los datos en vivo. Buenaventura es cálida (26–28 °C) y lluviosa todo el año.</p>}
        </div>

        <div className="hoy-marea">
          <div className="hoy-marea-cabeza">
            <h3>Marea · próximas 24 horas</h3>
            {tendencia && (
              <span className="tendencia">
                {tendencia === 'sube' ? 'Subiendo' : tendencia === 'baja' ? 'Bajando' : 'Estable'}
              </span>
            )}
          </div>
          {datos.marea.length > 4 ? (
            <TrazoMarea marea={datos.marea} />
          ) : (
            <div className="trazo-vacio">{cargando ? 'Cargando la marea…' : 'La marea no está disponible en este momento.'}</div>
          )}
          <p className="nota-modelo">Nivel del mar en metros respecto al nivel medio, estimado por el modelo de Open-Meteo. Sirve para planear, no para navegar.</p>
        </div>

        <dl className="hoy-datos">
          <div>
            <dt>Agua</dt>
            <dd className="num">{datos.temperaturaMar != null ? `${datos.temperaturaMar} °C` : '—'}</dd>
          </div>
          <div>
            <dt>Ola</dt>
            <dd className="num">{datos.oleaje != null ? `${coma(datos.oleaje)} m` : '—'}</dd>
          </div>
          <div>
            <dt>Periodo</dt>
            <dd className="num">{datos.periodoOla != null ? `${Math.round(datos.periodoOla)} s` : '—'}</dd>
          </div>
          <div>
            <dt>Humedad</dt>
            <dd className="num">{datos.humedad}%</dd>
          </div>
          <div>
            <dt>Viento</dt>
            <dd className="num">{datos.viento} km/h</dd>
          </div>
          <div>
            <dt>Lluvia hoy</dt>
            <dd className="num">{datos.lluviaHoy}%</dd>
          </div>
        </dl>

        {datos.dias.length > 0 && (
          <ol className="hoy-pronostico" aria-label="Pronóstico de cinco días">
            {datos.dias.map((d, i) => {
              const Icono = icono(d.codigo);
              const fecha = new Date(d.fecha + 'T12:00:00');
              return (
                <li key={d.fecha}>
                  <span className="pron-dia">{i === 0 ? 'Hoy' : DIAS[fecha.getDay()]}</span>
                  <Icono size={30} strokeWidth={2.2} aria-label={textoClima(d.codigo)} />
                  <span className="pron-temp num">
                    {d.max}° <span>{d.min}°</span>
                  </span>
                  <span className="pron-lluvia num">{d.lluviaProb}% lluvia</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
