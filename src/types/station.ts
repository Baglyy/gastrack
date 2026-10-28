export type FuelType = "gazole" | "sp95" | "e10" | "sp98" | "e85" | "gplc";

export interface FuelInfo {
  id: FuelType;
  label: string;
}

export const FUELS: FuelInfo[] = [
  { id: "gazole", label: "Gazole" },
  { id: "e10", label: "SP95-E10" },
  { id: "sp95", label: "SP95" },
  { id: "sp98", label: "SP98" },
  { id: "e85", label: "E85" },
  { id: "gplc", label: "GPLc" },
];

export interface Station {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lon: number;
  /** Prix du carburant sélectionné (€/L) */
  price: number;
  /** Date de mise à jour du prix sélectionné (ISO) */
  updatedAt: string | null;
  /** Tous les prix connus de la station */
  prices: Partial<Record<FuelType, number>>;
  /** Distance au centre de recherche en km */
  distanceKm: number;
}

export interface LatLon {
  lat: number;
  lon: number;
}
