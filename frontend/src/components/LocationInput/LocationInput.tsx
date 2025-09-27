import { useEffect, useRef } from "react";

type LocationInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly className?: string;
};

export default function LocationInput({
  value,
  onChange,
  placeholder,
  required,
  className,
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    interface WindowWithGoogle extends Window {
      google?: typeof google;
    }
    const typedWindow = window as WindowWithGoogle;
    if (!inputRef.current || !typedWindow.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"], 
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      } else if (place.name) {
        onChange(place.name);
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
