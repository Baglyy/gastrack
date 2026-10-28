import { useCallback, useMemo, useState } from "react";
import { haversineKm } from "./api/fuelApi";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { stations, loading, error } = useStations(center, radiusKm, fuel);
  const { locate, locating, error: geoError } = useGeolocation(setCenter);

  // Évite de relancer une requête pour un micro-déplacement de la carte.
  const handleViewChange = useCallback((next: LatLon, radius: number) => {
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
        {stations.length > 0 && (
          <>
            <PriceLegend min={min} max={max} />
            <p className="count">
              {stations.length} stations les moins chères dans un rayon de {radiusKm} km
            </p>
          </>
        )}
        <StationList
          stations={stations}
          loading={loading}
          error={error}
          selectedId={selectedId}
          min={min}
          max={max}
          onSelect={setSelectedId}
        />
      </aside>
      <main className="map-area">
        <MapView
          center={center}
          stations={stations}
          selected={selected}
          min={min}
          max={max}
          onViewChange={handleViewChange}
          onSelect={setSelectedId}
        />
        {loading && <div className="loading-badge">Chargement des prix…</div>}
      </main>
    </div>
  );
}
