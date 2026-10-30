import { useEffect, useState } from "react";
import { fetchStations } from "../api/fuelApi";
import type { FuelType, LatLon, Station } from "../types/station";

interface State {
  stations: Station[];
  loading: boolean;
  error: string | null;
}

/**
 * Charge les stations quand le centre, le rayon ou le carburant changent.
 * Si `enabled` est faux (carte trop dézoomée), aucune requête n'est envoyée
 * et une requête en cours est annulée.
 */
export function useStations(center: LatLon, radiusKm: number, fuel: FuelType, enabled: boolean): State {
  const [state, setState] = useState<State>({ stations: [], loading: true, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ stations: [], loading: false, error: null });
      return;
    }
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchStations({ center, radiusKm, fuel }, controller.signal)
      .then((stations) => setState({ stations, loading: false, error: null }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Erreur inconnue.";
        setState({ stations: [], loading: false, error: message });
      });

    return () => controller.abort();
  }, [center.lat, center.lon, radiusKm, fuel, enabled]);

  return state;
}
