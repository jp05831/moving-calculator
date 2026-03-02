'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

const US_CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Indianapolis, IN",
  "Charlotte, NC", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Portland, OR",
  "Memphis, TN", "Oklahoma City, OK", "Las Vegas, NV", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
  "Kansas City, MO", "Mesa, AZ", "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO",
  "Raleigh, NC", "Long Beach, CA", "Virginia Beach, VA", "Miami, FL", "Oakland, CA",
  "Minneapolis, MN", "Tulsa, OK", "Bakersfield, CA", "Wichita, KS", "Arlington, TX",
  "Aurora, CO", "Tampa, FL", "New Orleans, LA", "Cleveland, OH", "Honolulu, HI",
  "Anaheim, CA", "Lexington, KY", "Stockton, CA", "Corpus Christi, TX", "Henderson, NV",
  "Riverside, CA", "Newark, NJ", "Saint Paul, MN", "Santa Ana, CA", "Cincinnati, OH",
  "Irvine, CA", "Orlando, FL", "Pittsburgh, PA", "St. Louis, MO", "Greensboro, NC",
  "Jersey City, NJ", "Anchorage, AK", "Lincoln, NE", "Plano, TX", "Durham, NC",
  "Buffalo, NY", "Chandler, AZ", "Chula Vista, CA", "Toledo, OH", "Madison, WI",
  "Gilbert, AZ", "Reno, NV", "Fort Wayne, IN", "North Las Vegas, NV", "St. Petersburg, FL",
  "Lubbock, TX", "Irving, TX", "Laredo, TX", "Winston-Salem, NC", "Chesapeake, VA",
  "Glendale, AZ", "Garland, TX", "Scottsdale, AZ", "Norfolk, VA", "Boise, ID",
  "Fremont, CA", "Spokane, WA", "Santa Clarita, CA", "Baton Rouge, LA", "Richmond, VA",
  "Hialeah, FL", "San Bernardino, CA", "Tacoma, WA", "Modesto, CA", "Huntsville, AL",
  "Des Moines, IA", "Yonkers, NY", "Rochester, NY", "Moreno Valley, CA", "Fayetteville, NC",
  "Fontana, CA", "Columbus, GA", "Worcester, MA", "Port St. Lucie, FL", "Little Rock, AR",
  "Augusta, GA", "Oxnard, CA", "Birmingham, AL", "Montgomery, AL", "Frisco, TX",
  "Amarillo, TX", "Salt Lake City, UT", "Grand Rapids, MI", "Tallahassee, FL", "Huntington Beach, CA",
  "Overland Park, KS", "Grand Prairie, TX", "Knoxville, TN", "Brownsville, TX", "Vancouver, WA",
  "Providence, RI", "Newport News, VA", "Santa Rosa, CA", "Chattanooga, TN", "Tempe, AZ",
  "Oceanside, CA", "Fort Lauderdale, FL", "Ontario, CA", "Bridgeport, CT", "Elk Grove, CA",
  "Cary, NC", "Palmdale, CA", "Salem, OR", "Garden Grove, CA", "Rancho Cucamonga, CA",
  "Springfield, MO", "Pembroke Pines, FL", "Peoria, AZ", "Eugene, OR", "Corona, CA",
  "Clarksville, TN", "Lakewood, CO", "Alexandria, VA", "Hayward, CA", "Murfreesboro, TN",
  "Boca Raton, FL", "Savannah, GA", "Naples, FL", "West Palm Beach, FL", "Fort Myers, FL"
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}

export default function CityAutocomplete({ value, onChange, placeholder, autoFocus }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChange(input);
    setHighlightedIndex(-1);

    if (input.length >= 2) {
      const filtered = US_CITIES.filter(city =>
        city.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatch = (city: string, query: string) => {
    const idx = city.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return city;
    
    return (
      <>
        {city.slice(0, idx)}
        <span className="font-semibold text-blue-600">{city.slice(idx, idx + query.length)}</span>
        {city.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 outline-none transition-all text-slate-800 placeholder:text-slate-400"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {suggestions.map((city, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`w-full px-4 py-3.5 text-left flex items-center gap-3 transition-colors ${
                highlightedIndex === idx 
                  ? 'bg-blue-50' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <MapPin className={`w-4 h-4 ${highlightedIndex === idx ? 'text-blue-500' : 'text-slate-400'}`} />
              <span className="text-slate-700">{highlightMatch(city, value)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
