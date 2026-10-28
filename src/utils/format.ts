export const formatPrice = (p: number): string =>
  `${p.toFixed(3).replace(".", ",")} €`;

export const formatDistance = (km: number): string =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;

export function formatUpdated(iso: string | null): string {
  if (!iso) return "Date inconnue";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Date inconnue";
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Couleur de vert (bon marché) à rouge (cher) selon la position dans l'échelle de prix. */
export function priceColor(price: number, min: number, max: number): string {
  const t = max === min ? 0 : (price - min) / (max - min);
  const hue = 135 - 135 * Math.min(Math.max(t, 0), 1);
  return `hsl(${hue.toFixed(0)} 62% 38%)`;
}
