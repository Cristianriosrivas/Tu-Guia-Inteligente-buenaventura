import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Programa } from './components/Programa';
import { Cartel } from './components/Cartel';
import { HoyEnLaBahia } from './components/HoyEnLaBahia';
import { Lugares } from './components/Lugares';
import { Rutas } from './components/Rutas';
import { DormirComer } from './components/DormirComer';
import { Negocios } from './components/Negocios';
import { Planifica } from './components/Planifica';
import { Cierre } from './components/Cierre';
import { FichaLugar } from './components/FichaLugar';
import { Asistente } from './components/Asistente';
import { MiLista } from './components/MiLista';
import type { Interes } from './data/guia';

export interface PedidoPlan {
  dias: number;
  intereses: Interes[];
  /** Cambia en cada pedido para disparar la generación. */
  marca: number;
}

export function App() {
  const [lugarAbierto, setLugarAbierto] = useState<string | null>(null);
  const [chat, setChat] = useState<{ abierto: boolean; pregunta?: string; marca: number }>({ abierto: false, marca: 0 });
  const [listaAbierta, setListaAbierta] = useState(false);
  const [pedido, setPedido] = useState<PedidoPlan | null>(null);

  const abrirLugar = useCallback((id: string) => setLugarAbierto(id), []);
  const preguntar = useCallback((pregunta?: string) => setChat((c) => ({ abierto: true, pregunta, marca: c.marca + 1 })), []);
  const armarPlan = useCallback((dias: number, intereses: Interes[]) => {
    setPedido({ dias, intereses, marca: Date.now() });
    document.getElementById('planifica')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Programa onAbrirLista={() => setListaAbierta(true)} onPreguntar={() => preguntar()} />
      <main id="contenido">
        <Cartel onArmarPlan={armarPlan} />
        <HoyEnLaBahia />
        <Lugares onAbrir={abrirLugar} />
        <Rutas onAbrirLugar={abrirLugar} />
        <DormirComer />
        <Negocios />
        <Planifica pedido={pedido} onAbrirLugar={abrirLugar} />
      </main>
      <Cierre />

      <FichaLugar id={lugarAbierto} onCerrar={() => setLugarAbierto(null)} onPreguntar={preguntar} />
      <MiLista abierta={listaAbierta} onCerrar={() => setListaAbierta(false)} onAbrirLugar={abrirLugar} />
      <Asistente estado={chat} onAbrir={() => preguntar()} onCerrar={() => setChat((c) => ({ ...c, abierto: false }))} onAbrirLugar={abrirLugar} />
    </MotionConfig>
  );
}
