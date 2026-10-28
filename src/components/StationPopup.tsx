import { FUELS, type Station } from "../types/station";
import { formatDistance, formatPrice, formatUpdated } from "../utils/format";

export function StationPopup({ station }: { station: Station }) {
  return (
    <div className="popup">
      <strong>{station.address}</strong>
      <div className="popup-city">
        {station.postalCode} {station.city} – à {formatDistance(station.distanceKm)}
      </div>
      <table>
        <tbody>
          {FUELS.filter((f) => station.prices[f.id] !== undefined).map((f) => (
            <tr key={f.id}>
              <th>{f.label}</th>
              <td>{formatPrice(station.prices[f.id]!)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="popup-city">Prix mis à jour : {formatUpdated(station.updatedAt)}</div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`}
        target="_blank"
        rel="noreferrer"
      >
        Itinéraire
      </a>
    </div>
  );
}
