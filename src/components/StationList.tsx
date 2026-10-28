import type { Station } from "../types/station";
import { StationCard } from "./StationCard";

interface Props {
  stations: Station[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  min: number;
  max: number;
  onSelect: (id: string) => void;
}

export function StationList({ stations, loading, error, selectedId, min, max, onSelect }: Props) {
  if (error) return <p className="notice notice-error">{error} Déplacez la carte pour réessayer.</p>;
  if (!loading && stations.length === 0) {
    return <p className="notice">Aucune station ne propose ce carburant ici. Dézoomez ou changez de carburant.</p>;
  }
  return (
    <ul className={`list ${loading ? "list-loading" : ""}`}>
      {stations.map((s) => (
        <StationCard key={s.id} station={s} min={min} max={max} selected={s.id === selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}
