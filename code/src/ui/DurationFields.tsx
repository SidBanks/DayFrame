import { useId } from "react";
export const durationLabel = (minutes: number) =>
  `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
/** Representation only: the canonical command continues to validate total minutes. */
export function DurationFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <fieldset className="df-duration-fields">
      <legend>{label}</legend>
      <label htmlFor={id + "h"}>
        Hours
        <input
          id={id + "h"}
          aria-label={label + " hours"}
          type="number"
          min="0"
          step="1"
          value={Math.floor(value / 60)}
          onChange={(e) => onChange(Number(e.target.value) * 60 + (value % 60))}
        />
      </label>
      <label htmlFor={id + "m"}>
        Minutes
        <input
          id={id + "m"}
          aria-label={label + " minutes"}
          type="number"
          min="0"
          max="59"
          step="1"
          value={value % 60}
          onChange={(e) => onChange(Math.floor(value / 60) * 60 + Number(e.target.value))}
        />
      </label>
    </fieldset>
  );
}
