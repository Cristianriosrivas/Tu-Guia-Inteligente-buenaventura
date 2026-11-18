import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarPlus, Download, Link2, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { INTERESES, PRESUPUESTOS, ZONAS, lugarPorId, type Interes, type Presupuesto } from '../data/guia';
import { generarPlan, validarPlanIA, esTemporadaBallenas, type Plan, type Preferencias } from '../lib/planificador';
import { contextoGuia } from '../lib/contexto';
import { extraerJSON, iaDisponible, pedirIA } from '../lib/ia';
import { descargar, enlacePlan, leerEnlacePlan, planAICS } from '../lib/exportar';
import { pesos } from '../lib/geo';
import { Cenefa } from './Cenefa';
import type { PedidoPlan } from '../App';
import './planifica.css';

const DIAS = [1, 2, 3, 4, 5];

function proximoSabado() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const aFecha = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

const formatoDia = (d: Date) => d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });

interface Props {
  pedido: PedidoPlan | null;
  onAbrirLugar: (id: string) => void;
}

export function Planifica({ pedido, onAbrirLugar }: Props) {
  const desdeEnlace = useMemo(() => leerEnlacePlan(), []);
  const [dias, setDias] = useState(desdeEnlace?.pref.dias ?? 2);
  const [presupuesto, setPresupuesto] = useState<Presupuesto>(desdeEnlace?.pref.presupuesto ?? 'medio');
  const [intereses, setIntereses] = useState<Interes[]>(desdeEnlace?.pref.intereses ?? ['ballenas', 'playa', 'gastronomia']);
  const [llegada, setLlegada] = useState(desdeEnlace?.llegada ?? proximoSabado());
  const [version, setVersion] = useState(desdeEnlace?.version ?? 1);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [afinando, setAfinando] = useState(false);
  const [aviso, setAviso] = useState('');
  const cartelRef = useRef<HTMLDivElement>(null);
  const pedidoIA = useRef<AbortController | null>(null);

  const pref: Preferencias = useMemo(
    () => ({ dias, presupuesto, intereses: intereses.length ? intereses : ['playa'], mes: aFecha(llegada).getMonth() + 1 }),
    [dias, presupuesto, intereses, llegada],
  );

  const armar = (p: Preferencias, v: number) => {
    const base = generarPlan(p, v);
    setPlan(base);
    setAviso('');
    pedidoIA.current?.abort();
    if (!iaDisponible()) return;
    const ctrl = new AbortController();
    pedidoIA.current = ctrl;
    setAfinando(true);
    pedirIA(
      {
        modo: 'plan',
        contexto: contextoGuia(),
        mensajes: [
          {
            role: 'user',
            content: `Preferencias: ${p.dias} días, presupuesto ${PRESUPUESTOS[p.presupuesto].nombre}, intereses ${p.intereses.map((i) => INTERESES[i]).join(', ')}, mes ${p.mes}${esTemporadaBallenas(p.mes) ? ' (temporada de ballenas)' : ''}.\nPlan base:\n${JSON.stringify({ dias: base.dias.map((d) => ({ titulo: d.titulo, zona: d.zona, actividades: d.actividades })), consejos: base.consejos })}`,
          },
        ],
      },
      ctrl.signal,
    ).then((texto) => {
      if (ctrl.signal.aborted) return;
      setAfinando(false);
      const mejorado = texto ? validarPlanIA(extraerJSON(texto), base) : null;
      if (mejorado) setPlan(mejorado);
    });
  };

  // Plan inicial de demostración y planes pedidos desde el cartel de inicio.
  useEffect(() => {
    armar(pref, version);
    // Si llegaron con un enlace compartido, los llevamos directo a su plan.
    if (desdeEnlace) setTimeout(() => document.getElementById('planifica')?.scrollIntoView({ block: 'start' }), 400);
    return () => pedidoIA.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pedido) return;
    setDias(pedido.dias);
    setIntereses(pedido.intereses);
    armar({ ...pref, dias: pedido.dias, intereses: pedido.intereses }, version);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido]);

  const alternar = (i: Interes) => setIntereses((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));

  const otraVersion = () => {
    const v = version + 1;
    setVersion(v);
    armar(pref, v);
  };

  const descargarCartel = async () => {
    if (!cartelRef.current) return;
    setAviso('Preparando la imagen…');
    try {
      const { toPng } = await import('html-to-image');
      const url = await toPng(cartelRef.current, { pixelRatio: 2, backgroundColor: '#f2b51d', filter: (n) => !(n instanceof HTMLElement && n.dataset.exportar === 'no') });
      const blob = await (await fetch(url)).blob();
      descargar('mi-cartel-buenaventura.png', blob);
      setAviso('Cartel descargado.');
    } catch {
      setAviso('No se pudo crear la imagen. Prueba con Imprimir → Guardar como PDF.');
    }
  };

  const calendario = () => {
    if (!plan) return;
    descargar('viaje-buenaventura.ics', planAICS(plan, aFecha(llegada)));
    setAviso('Calendario descargado: ábrelo para agregar los días a tu agenda.');
  };

  const compartir = async () => {
    const url = enlacePlan(pref, llegada, version);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mi viaje a Buenaventura', text: plan?.titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setAviso('Enlace copiado: compártelo y verán el mismo plan.');
    } catch {
      setAviso(url);
    }
  };

  const inicio = aFecha(llegada);

  return (
    <section id="planifica" className="seccion campo-manglar planifica" aria-labelledby="titulo-planifica">
      <div className="contenedor planifica-rejilla">
        <form
          className="planifica-form"
          onSubmit={(e) => {
            e.preventDefault();
            armar(pref, version);
          }}
        >
          <h2 id="titulo-planifica" className="titulo-seccion">
            Arma tu cartel de viaje
          </h2>
          <p className="entrada">El planificador reparte tus días por zonas, cuida los traslados en lancha y te deja un plan listo para guardar o compartir.</p>

          <fieldset>
            <legend>¿Cuántos días?</legend>
            <div className="chips">
              {DIAS.map((d) => (
                <button key={d} type="button" className="chip num" aria-pressed={dias === d} onClick={() => setDias(d)}>
                  {d}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Presupuesto</legend>
            <div className="chips">
              {(Object.keys(PRESUPUESTOS) as Presupuesto[]).map((p) => (
                <button key={p} type="button" className="chip" aria-pressed={presupuesto === p} onClick={() => setPresupuesto(p)}>
                  {PRESUPUESTOS[p].nombre}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Lo que te gusta</legend>
            <div className="chips">
              {(Object.keys(INTERESES) as Interes[]).map((i) => (
                <button key={i} type="button" className="chip" aria-pressed={intereses.includes(i)} onClick={() => alternar(i)}>
                  {INTERESES[i]}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="campo-fecha">
            <span>Llegas el</span>
            <input type="date" value={llegada} onChange={(e) => e.target.value && setLlegada(e.target.value)} />
          </label>
          {esTemporadaBallenas(pref.mes) ? (
            <p className="nota-temporada">
              <Sparkles size={16} strokeWidth={2.4} /> Esa fecha cae en temporada de ballenas.
            </p>
          ) : intereses.includes('ballenas') ? (
            <p className="nota-temporada">Las ballenas llegan de julio a octubre: en tu fecha el plan prioriza playas y selva.</p>
          ) : null}

          <button type="submit" className="boton boton-sol planifica-boton">
            <Wand2 size={20} strokeWidth={2.4} /> Armar mi plan
          </button>
        </form>

        <div className="planifica-resultado" aria-live="polite">
          <AnimatePresence mode="wait">
            {plan && (
              <motion.div
                key={`${plan.titulo}-${version}-${plan.fuente}-${plan.dias.map((d) => d.zona).join()}`}
                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="cartel-plan campo-sol" ref={cartelRef}>
                  <Cenefa alto={18} />
                  <div className="cartel-plan-cuerpo">
                    <div className="cartel-plan-cabeza">
                      <h3>{plan.titulo}</h3>
                      <p className="cartel-plan-fechas num">
                        Buenaventura · {formatoDia(inicio)}
                        {plan.dias.length > 1 &&
                          ` — ${formatoDia(new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + plan.dias.length - 1))}`}
                      </p>
                      <span className={`fuente fuente-${plan.fuente}`} data-exportar="no">
                        {plan.fuente === 'ia' ? 'Afinado con IA (Gemini)' : afinando ? 'Afinando con IA…' : 'Armado con los datos de la guía'}
                      </span>
                    </div>

                    <ol className="cartel-dias">
                      {plan.dias.map((d) => (
                        <li key={d.numero} className="cartel-dia">
                          <div className="dia-cabeza">
                            <h4>
                              <span className="dia-num num">Día {d.numero}</span> {d.titulo}
                            </h4>
                            <span className="dia-zona">{ZONAS[d.zona].nombre}</span>
                          </div>
                          <ul className="actividades">
                            {d.actividades.map((a, j) => (
                              <li key={j} className={`actividad tipo-${a.tipo}`}>
                                <span className="act-hora num">{a.hora}</span>
                                <div>
                                  {a.lugarId && lugarPorId(a.lugarId) ? (
                                    <button type="button" className="act-titulo enlace" onClick={() => onAbrirLugar(a.lugarId!)}>
                                      {a.titulo}
                                    </button>
                                  ) : (
                                    <span className="act-titulo">{a.titulo}</span>
                                  )}
                                  <span className="act-detalle">{a.detalle}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>

                    <div className="cartel-pie">
                      <div>
                        <h5>Dónde dormir</h5>
                        <p>{plan.hospedaje.length ? plan.hospedaje.map((h) => `${h.nombre}${h.ejemplo ? ' (ejemplo)' : ''}`).join(' · ') : 'Viaje de un día: sin noche.'}</p>
                      </div>
                      <div>
                        <h5>Costo estimado por persona</h5>
                        <p className="num">
                          {pesos(plan.costo[0])} – {pesos(plan.costo[1])} COP
                        </p>
                        <small>Referencia con hospedaje, comida y traslados.</small>
                      </div>
                      <div className="cartel-consejos">
                        <h5>Antes de salir</h5>
                        <ul>
                          {plan.consejos.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="plan-acciones">
                  <button className="boton boton-linea" onClick={otraVersion}>
                    <RefreshCw size={18} strokeWidth={2.4} /> Otra versión
                  </button>
                  <button className="boton boton-linea" onClick={descargarCartel}>
                    <Download size={18} strokeWidth={2.4} /> Descargar cartel
                  </button>
                  <button className="boton boton-linea" onClick={calendario}>
                    <CalendarPlus size={18} strokeWidth={2.4} /> Al calendario
                  </button>
                  <button className="boton boton-linea" onClick={compartir}>
                    <Link2 size={18} strokeWidth={2.4} /> Compartir
                  </button>
                </div>
                {aviso && (
                  <p className="plan-aviso" role="status">
                    {aviso}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
