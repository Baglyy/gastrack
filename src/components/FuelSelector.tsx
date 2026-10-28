import { FUELS, type FuelType } from "../types/station";

interface Props {
  value: FuelType;
  onChange: (fuel: FuelType) => void;
}

export function FuelSelector({ value, onChange }: Props) {
  return (
    <div className="fuel-selector" role="radiogroup" aria-label="Type de carburant">
      {FUELS.map((f) => (
        <button
          key={f.id}
          role="radio"
          aria-checked={f.id === value}
          className={`chip ${f.id === value ? "chip-active" : ""}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
