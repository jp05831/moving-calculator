'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string, zip: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}

export default function AddressAutocomplete({ value, onChange, placeholder, autoFocus }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'address_components', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let city = '';
      let state = '';
      let zip = '';
      for (const component of place.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
          zip = component.long_name;
        }
      }

      const formatted = city && state ? `${city}, ${state}` : place.name || '';
      onChange(formatted, zip);
    });

    autocompleteRef.current = autocomplete;
  }, [onChange]);

  useEffect(() => {
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const checkInterval = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(checkInterval);
        initAutocomplete();
      }
    }, 200);

    return () => clearInterval(checkInterval);
  }, [initAutocomplete]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={value}
          onChange={(e) => onChange(e.target.value, '')}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-lg focus:border-blue-500 focus:bg-white focus:shadow-md outline-none transition-all text-slate-800 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
