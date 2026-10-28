import { formatPrice, priceColor } from "../utils/format";

interface Props {
  min: number;
  max: number;
}

export function PriceLegend({ min, max }: Props) {
  return (
    <div className="legend" aria-label="Échelle des prix">
      <span>{formatPrice(min)}</span>
      <div
        className="legend-bar"
        style={{ background: `linear-gradient(90deg, ${priceColor(min, min, max)}, ${priceColor((min + max) / 2, min, max)}, ${priceColor(max, min, max)})` }}
      />
      <span>{formatPrice(max)}</span>
    </div>
  );
}
