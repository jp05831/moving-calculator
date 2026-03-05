'use client';

import { useState } from 'react';
import { FormData } from '../types';
import { MapPin } from 'lucide-react';
import CityAutocomplete from './CityAutocomplete';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  quotesRequested: number;
}

export default function StepTo({ formData, updateFormData, onNext, onBack, quotesRequested }: Props) {
  const [city, setCity] = useState(formData.toCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      updateFormData({ toCity: city.trim() });
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Where are you moving to?
        </h2>
        <p className="text-slate-600">
          Enter your destination to get an accurate quote
        </p>
      </div>

      {/* Route summary */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-slate-700 font-medium">{formData.fromCity}</span>
        </div>
        <div className="ml-1.5 border-l-2 border-dashed border-slate-300 h-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-slate-400">{city || 'Your destination...'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <CityAutocomplete
            value={city}
            onChange={setCity}
            placeholder="Enter your destination city..."
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
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg shadow-lg shadow-emerald-500/25 disabled:shadow-none"
        >
          Get My Quote →
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}
