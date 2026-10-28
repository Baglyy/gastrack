import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLon, Station } from "../types/station";
import { formatPrice, priceColor } from "../utils/format";
import { StationPopup } from "./StationPopup";

interface Props {
  center: LatLon;
  stations: Station[];
  selected: Station | null;
  min: number;
  max: number;
  onViewChange: (center: LatLon, radiusKm: number) => void;
  onSelect: (id: string | null) => void;
}

const MAX_RADIUS_KM = 30;

/** Remonte le centre et le rayon visibles à chaque fin de déplacement. */
function ViewWatcher({ onViewChange }: Pick<Props, "onViewChange">) {
  const map = useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      const ne = map.getBounds().getNorthEast();
      const radius = Math.ceil(c.distanceTo(ne) / 1000);
      onViewChange({ lat: c.lat, lon: c.lng }, Math.min(MAX_RADIUS_KM, Math.max(2, radius)));
    },
  });
  return null;
}

/** Recentre la carte quand le centre change depuis l'extérieur (géolocalisation). */
function Recenter({ center }: { center: LatLon }) {
  const map = useMap();
  useEffect(() => {
    const c = map.getCenter();
    if (c.distanceTo([center.lat, center.lon]) > 500) map.flyTo([center.lat, center.lon], 13);
  }, [center.lat, center.lon, map]);
  return null;
}

/** Centre la carte sur la station choisie dans la liste. */
function FlyToSelected({ station }: { station: Station | null }) {
  const map = useMap();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (station && station.id !== last.current) {
      map.flyTo([station.lat, station.lon], Math.max(map.getZoom(), 14), { duration: 0.6 });
    }
    last.current = station?.id ?? null;
  }, [station, map]);
  return null;
}

function pinIcon(station: Station, min: number, max: number, selected: boolean): L.DivIcon {
  const color = priceColor(station.price, min, max);
  return L.divIcon({
    className: "pin-wrapper",
    html: `<span class="pin ${selected ? "pin-selected" : ""}" style="--pin:${color}">${formatPrice(station.price).replace(" €", "")}</span>`,
    iconSize: [58, 28],
    iconAnchor: [29, 28],
  });
}

export function MapView({ center, stations, selected, min, max, onViewChange, onSelect }: Props) {
  const icons = useMemo(
    () => new Map(stations.map((s) => [s.id, pinIcon(s, min, max, s.id === selected?.id)])),
    [stations, min, max, selected?.id],
  );

  return (
    <MapContainer center={[center.lat, center.lon]} zoom={12} className="map" zoomControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ViewWatcher onViewChange={onViewChange} />
      <Recenter center={center} />
      <FlyToSelected station={selected} />
      {stations.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lon]}
          icon={icons.get(s.id)}
          zIndexOffset={s.id === selected?.id ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(s.id) }}
        />
      ))}
      {selected && (
        <Popup position={[selected.lat, selected.lon]} offset={[0, -28]} eventHandlers={{ remove: () => onSelect(null) }}>
          <StationPopup station={selected} />
        </Popup>
      )}
    </MapContainer>
  );
}
