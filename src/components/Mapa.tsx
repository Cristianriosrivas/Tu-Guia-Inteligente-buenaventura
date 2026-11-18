import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Lugar } from '../data/guia';

const COLOR: Record<Lugar['categoria'], string> = {
  Playa: '#0f2f57',
  Naturaleza: '#14663f',
  Cultura: '#bf3519',
  Ciudad: '#0f2f57',
};

function icono(lugar: Lugar, n: number) {
  return L.divIcon({
    className: 'pin-tinta',
    html: `<span style="--c:${COLOR[lugar.categoria]}"><b>${n}</b></span><em>${lugar.nombre}</em>`,
    iconSize: [38, 38],
    iconAnchor: [19, 36],
  });
}

function Encuadre({ lugares, ubicacion }: { lugares: Lugar[]; ubicacion: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    const puntos = lugares.map((l) => L.latLng(l.lat, l.lng));
    if (ubicacion) puntos.push(L.latLng(ubicacion.lat, ubicacion.lng));
    if (puntos.length) map.fitBounds(L.latLngBounds(puntos), { padding: [48, 48], maxZoom: 13 });
  }, [lugares, ubicacion, map]);
  return null;
}

interface Props {
  lugares: Lugar[];
  ubicacion: { lat: number; lng: number } | null;
  onAbrir: (id: string) => void;
}

export default function Mapa({ lugares, ubicacion, onAbrir }: Props) {
  return (
    <div className="mapa">
      <MapContainer center={[3.92, -77.2]} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        {lugares.map((l, i) => (
          <Marker key={l.id} position={[l.lat, l.lng]} icon={icono(l, i + 1)} eventHandlers={{ click: () => onAbrir(l.id) }} title={l.nombre} alt={l.nombre} keyboard />
        ))}
        {ubicacion && (
          <Marker
            position={[ubicacion.lat, ubicacion.lng]}
            icon={L.divIcon({ className: 'pin-yo', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] })}
            title="Tú estás aquí"
          />
        )}
        <Encuadre lugares={lugares} ubicacion={ubicacion} />
      </MapContainer>
      <p className="mapa-nota">Ubicaciones aproximadas. Toca un número para ver el lugar.</p>
    </div>
  );
}
