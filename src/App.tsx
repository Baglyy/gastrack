import { useCallback, useMemo, useState } from "react";
import { haversineKm } from "./api/fuelApi";
import { MIN_ZOOM_FOR_STATIONS, INITIAL_ZOOM } from "./config";
import { FuelSelector } from "./components/FuelSelector";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { PriceLegend } from "./components/PriceLegend";
import { StationList } from "./components/StationList";
import { useGeolocation } from "./hooks/useGeolocation";
import { useStations } from "./hooks/useStations";
import type { FuelType, LatLon } from "./types/station";

const DEFAULT_CENTER: LatLon = { lat: 48.8566, lon: 2.3522 };

export default function App() {
  const [fuel, setFuel] = useState<FuelType>("gazole");
  const [center, setCenter] = useState<LatLon>(DEFAULT_CENTER);
  const [radiusKm, setRadiusKm] = useState(10);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lon: number; n: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Trop dézoomé (ex. vue de toute la France) : on ne charge ni n'affiche aucune station.
  const zoomedEnough = zoom >= MIN_ZOOM_FOR_STATIONS;

  const { stations, loading, error } = useStations(center, radiusKm, fuel, zoomedEnough);

  const handleLocated = useCallback((pos: LatLon) => {
    setCenter(pos);
    setFlyTarget({ ...pos, n: Date.now() });
  }, []);
  const { locate, locating, error: geoError } = useGeolocation(handleLocated);

  // Évite de relancer une requête pour un micro-déplacement de la carte.
  const handleViewChange = useCallback((next: LatLon, radius: number, nextZoom: number) => {
    setZoom(nextZoom);
    setCenter((prev) => (haversineKm(prev, next) < 0.5 ? prev : next));
    setRadiusKm(radius);
  }, []);

  const { min, max } = useMemo(() => {
    const prices = stations.map((s) => s.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [stations]);

  const selected = stations.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="app">
      <Header locating={locating} onLocate={locate} />
      <aside className="sidebar">
        <FuelSelector value={fuel} onChange={setFuel} />
        {geoError && <p className="notice notice-error">{geoError}</p>}
        {!zoomedEnough && (
          <p className="notice notice-zoom">
            Zoomez sur la carte pour afficher les stations autour d'un point précis.
          </p>
        )}
        {zoomedEnough && stations.length > 0 && (
          <>
            <PriceLegend min={min} max={max} />
            <p className="count">
              {stations.length} stations les moins chères dans un rayon de {radiusKm} km
            </p>
          </>
        )}
        {zoomedEnough && (
        <StationList
          stations={stations}
          loading={loading}
          error={error}
          selectedId={selectedId}
          min={min}
          max={max}
          onSelect={setSelectedId}
        />
        )}
      </aside>
      <main className="map-area">
        <MapView
          center={center}
          stations={stations}
          selected={selected}
          min={min}
          max={max}
          flyTarget={flyTarget}
          onViewChange={handleViewChange}
          onSelect={setSelectedId}
        />
        {!zoomedEnough && <div className="loading-badge">Zoomez pour afficher les stations</div>}
        {zoomedEnough && loading && <div className="loading-badge">Chargement des prix…</div>}
      </main>
    </div>
  );
}
