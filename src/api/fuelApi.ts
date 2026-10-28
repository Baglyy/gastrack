import { FUELS, type FuelType, type LatLon, type Station } from "../types/station";

const BASE_URL =
  "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records";

/** Champs bruts renvoyés par l'API (sous-ensemble utilisé). */
interface RawRecord {
  id: number | string;
  adresse: string | null;
  ville: string | null;
  cp: string | null;
  geom: { lon: number; lat: number } | null;
  [key: string]: unknown;
}

interface ApiResponse {
  results: RawRecord[];
}

export interface FetchParams {
  center: LatLon;
  radiusKm: number;
  fuel: FuelType;
  limit?: number;
}

/** Distance à vol d'oiseau (formule de haversine), en km. */
export function haversineKm(a: LatLon, b: LatLon): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toStation(raw: RawRecord, fuel: FuelType, center: LatLon): Station | null {
  const price = raw[`${fuel}_prix`];
  if (!raw.geom || typeof price !== "number") return null;

  const prices: Station["prices"] = {};
  for (const f of FUELS) {
    const p = raw[`${f.id}_prix`];
    if (typeof p === "number") prices[f.id] = p;
  }
  const maj = raw[`${fuel}_maj`];

  const pos = { lat: raw.geom.lat, lon: raw.geom.lon };
  return {
    id: String(raw.id),
    address: raw.adresse ?? "Adresse inconnue",
    city: raw.ville ?? "",
    postalCode: raw.cp ?? "",
    lat: pos.lat,
    lon: pos.lon,
    price,
    updatedAt: typeof maj === "string" ? maj : null,
    prices,
    distanceKm: haversineKm(center, pos),
  };
}

/**
 * Récupère les stations les moins chères dans un rayon donné
 * pour un carburant donné (API Opendatasoft, data.economie.gouv.fr).
 */
export async function fetchStations(
  { center, radiusKm, fuel, limit = 100 }: FetchParams,
  signal?: AbortSignal,
): Promise<Station[]> {
  const where =
    `within_distance(geom, geom'POINT(${center.lon} ${center.lat})', ${radiusKm}km)` +
    ` AND ${fuel}_prix IS NOT NULL`;

  const url = new URL(BASE_URL);
  url.searchParams.set("where", where);
  url.searchParams.set("order_by", `${fuel}_prix ASC`);
  url.searchParams.set("limit", String(Math.min(limit, 100)));

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`L'API des carburants a répondu avec l'erreur ${res.status}.`);
  }
  const data = (await res.json()) as ApiResponse;
  return data.results
    .map((r) => toStation(r, fuel, center))
    .filter((s): s is Station => s !== null);
}
