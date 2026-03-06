'use client';

import { useState } from 'react';
import { FormData } from '../types';
import { Shield, Star, BadgeCheck, Sparkles } from 'lucide-react';
import CityAutocomplete from './CityAutocomplete';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  quotesRequested: number;
}

export default function StepFrom({ formData, updateFormData, onNext, quotesRequested }: Props) {
  const [city, setCity] = useState(formData.fromCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      updateFormData({ fromCity: city.trim() });
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 p-8 border border-slate-200">
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-blue-600 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Instant Quote Calculator
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Calculate Your Moving Cost
        </h2>
        <p className="text-slate-600 text-lg">
          Where are you moving <span className="font-semibold text-slate-800">from</span>?
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <CityAutocomplete
            value={city}
            onChange={setCity}
            placeholder="Enter your current city..."
            autoFocus
          />
        </div>

        {/* Live counter */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span><span className="font-semibold text-slate-700">{quotesRequested}</span> quotes requested today</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 text-lg shadow-md shadow-blue-500/20 animate-twitch"
        >
          Continue →
        </button>
      </form>

      {/* Mini trust badges */}
      <div className="flex flex-wrap justify-center gap-5 mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Star className="w-3.5 h-3.5 text-slate-400" />
          <span>Top Rated</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Price Guarantee</span>
        </div>
      </div>
    </div>
  );
}
