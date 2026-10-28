import { useCallback, useState } from "react";
import type { LatLon } from "../types/station";

export function useGeolocation(onFound: (pos: LatLon) => void) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        onFound({ lat: p.coords.latitude, lon: p.coords.longitude });
      },
      () => {
        setLocating(false);
        setError("Position refusée. Déplacez la carte pour chercher ailleurs.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [onFound]);

  return { locate, locating, error };
}
