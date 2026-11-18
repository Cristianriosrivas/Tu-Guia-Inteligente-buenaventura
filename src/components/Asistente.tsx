import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, MapPin, MessageCircle } from 'lucide-react';
import { LUGARES } from '../data/guia';
import { responderLocal, SUGERENCIAS_INICIALES, type Accion } from '../lib/asistente';
import { contextoGuia } from '../lib/contexto';
import { useCondiciones } from '../lib/estado';
import { iaDisponible, pedirIA } from '../lib/ia';
import { textoClima, type Condiciones } from '../lib/mar';
import { normalizar } from '../lib/geo';
import { Volante } from './Volante';
import './asistente.css';

interface Mensaje {
  id: number;
  de: 'yo' | 'guia';
  texto: string;
  lugares?: string[];
  acciones?: Accion[];
  fuente?: 'ia' | 'local';
}

interface Props {
  estado: { abierto: boolean; pregunta?: string; marca: number };
  onAbrir: () => void;
  onCerrar: () => void;
  onAbrirLugar: (id: string) => void;
}

const BIENVENIDA: Mensaje = {
  id: 0,
  de: 'guia',
  texto: '¡Hola! Soy tu guía de Buenaventura. Pregúntame por playas, ballenas, el clima, cómo llegar, dónde dormir o qué comer.',
  acciones: SUGERENCIAS_INICIALES,
};

function contextoVivo(c: Condiciones) {
  if (!c.enVivo) return '';
  return `\n\nCONDICIONES EN VIVO (${new Date().toLocaleString('es-CO')}): ${c.temperatura} °C, ${textoClima(c.codigo)}, humedad ${c.humedad}%, lluvia hoy ${c.lluviaHoy}%, atardecer ${c.atardecer}${c.oleaje != null ? `, oleaje ${c.oleaje} m` : ''}${c.temperaturaMar != null ? `, agua ${c.temperaturaMar} °C` : ''}.`;
}

function lugaresMencionados(texto: string) {
  const t = ` ${normalizar(texto)} `;
  return LUGARES.filter((l) => t.includes(` ${normalizar(l.nombre)} `) || t.includes(` ${normalizar(l.nombre.split(' ').slice(-1)[0])} `))
    .slice(0, 3)
    .map((l) => l.id);
}

export function Asistente({ estado, onAbrir, onCerrar, onAbrirLugar }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const { datos } = useCondiciones();
  const lista = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const ultimaMarca = useRef(0);
  const conIA = iaDisponible();
  // El botón flotante aparece al dejar atrás el cartel de inicio, para no tapar el planificador rápido.
  const [pasoCartel, setPasoCartel] = useState(false);
  useEffect(() => {
    const revisar = () => setPasoCartel(window.scrollY > (document.getElementById('inicio')?.offsetHeight ?? 800) - 120);
    revisar();
    window.addEventListener('scroll', revisar, { passive: true });
    return () => window.removeEventListener('scroll', revisar);
  }, []);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes, pensando]);

  useEffect(() => {
    if (!estado.abierto) return;
    setTimeout(() => entrada.current?.focus({ preventScroll: true }), 120);
    if (estado.pregunta && estado.marca !== ultimaMarca.current) {
      ultimaMarca.current = estado.marca;
      enviar(estado.pregunta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  async function enviar(pregunta: string) {
    const q = pregunta.trim();
    if (!q || pensando) return;
    const id = Date.now();
    const historial = [...mensajes, { id, de: 'yo' as const, texto: q }];
    setMensajes(historial);
    setTexto('');
    setPensando(true);

    let respuesta: Mensaje | null = null;
    if (conIA) {
      const t = await pedirIA({
        modo: 'chat',
        contexto: contextoGuia() + contextoVivo(datos),
        mensajes: historial
          .filter((m) => m.id !== 0)
          .slice(-10)
          .map((m) => ({ role: m.de === 'yo' ? 'user' : 'assistant', content: m.texto })),
      });
      if (t) respuesta = { id: id + 1, de: 'guia', texto: t, lugares: lugaresMencionados(t), fuente: 'ia' };
    }
    if (!respuesta) {
      await new Promise((r) => setTimeout(r, 420));
      const local = responderLocal(q, datos);
      respuesta = { id: id + 1, de: 'guia', ...local, fuente: 'local' };
    }
    setMensajes((m) => [...m, respuesta!]);
    setPensando(false);
  }

  const accion = (a: Accion) => {
    if (a.pregunta) return enviar(a.pregunta);
    if (a.seccion) {
      document.getElementById(a.seccion)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.matchMedia('(max-width: 620px)').matches) onCerrar();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!estado.abierto && pasoCartel && (
          <motion.button
            className="boton-flotante"
            onClick={onAbrir}
            aria-label="Pregúntale al guía"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <MessageCircle size={26} strokeWidth={2.4} />
            <span>Pregúntale</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Volante
        abierto={estado.abierto}
        onCerrar={onCerrar}
        etiqueta="Guía virtual"
        titulo="Guía virtual"
        subtitulo={conIA ? 'Con IA de Gemini · arrástrame' : 'Responde con los datos de la guía · arrástrame'}
        pie={
          <form
            className="chat-entrada"
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
          >
            <label htmlFor="pregunta" className="solo-lectores">
              Escribe tu pregunta
            </label>
            <input
              id="pregunta"
              ref={entrada}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="¿Cuándo llegan las ballenas?"
              autoComplete="off"
              maxLength={400}
            />
            <button type="submit" disabled={!texto.trim() || pensando} aria-label="Enviar pregunta">
              <ArrowUp size={20} strokeWidth={2.8} />
            </button>
          </form>
        }
      >
        <div className="chat-lista" ref={lista} role="log" aria-live="polite">
          {mensajes.map((m) => (
            <motion.div
              key={m.id}
              className={`burbuja burbuja-${m.de}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <p>{m.texto}</p>
              {m.lugares && m.lugares.length > 0 && (
                <div className="burbuja-lugares">
                  {m.lugares.map((id) => {
                    const l = LUGARES.find((x) => x.id === id);
                    return l ? (
                      <button key={id} onClick={() => onAbrirLugar(id)}>
                        <MapPin size={14} strokeWidth={2.6} /> {l.nombre}
                      </button>
                    ) : null;
                  })}
                </div>
              )}
              {m.acciones && m.acciones.length > 0 && (
                <div className="burbuja-acciones">
                  {m.acciones.map((a) => (
                    <button key={a.etiqueta} onClick={() => accion(a)}>
                      {a.etiqueta}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {pensando && (
            <div className="burbuja burbuja-guia escribiendo" aria-label="El guía está escribiendo">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </Volante>
    </>
  );
}
