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
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
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
          disabled={!city.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg shadow-lg shadow-blue-500/25 disabled:shadow-none"
        >
          Continue →
        </button>
      </form>

      {/* Mini trust badges */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Star className="w-4 h-4 text-amber-500" />
          <span>Top Rated</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <BadgeCheck className="w-4 h-4 text-blue-500" />
          <span>Price Guarantee</span>
        </div>
      </div>
    </div>
  );
}
