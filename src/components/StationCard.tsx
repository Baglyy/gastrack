import type { Station } from "../types/station";
import { formatDistance, formatPrice, formatUpdated, priceColor } from "../utils/format";

interface Props {
  station: Station;
  min: number;
  max: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function StationCard({ station, min, max, selected, onSelect }: Props) {
  return (
    <li>
      <button className={`card ${selected ? "card-selected" : ""}`} onClick={() => onSelect(station.id)}>
        <span className="card-price" style={{ color: priceColor(station.price, min, max) }}>
          {formatPrice(station.price)}
        </span>
        <span className="card-body">
          <span className="card-address">{station.address}</span>
          <span className="card-meta">
            {station.postalCode} {station.city} – à {formatDistance(station.distanceKm)}
          </span>
          <span className="card-meta">Mis à jour : {formatUpdated(station.updatedAt)}</span>
        </span>
      </button>
    </li>
  );
}
