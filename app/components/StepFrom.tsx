'use client';

import { useState } from 'react';
import { FormData } from '../types';
import { Shield, Star, BadgeCheck } from 'lucide-react';
import { MapPin } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  quotesRequested: number;
}

export default function StepFrom({ formData, updateFormData, onNext, quotesRequested }: Props) {
  const [zip, setZip] = useState(formData.fromZip);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZip(digits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      updateFormData({ fromZip: zip, fromCity: zip });
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 p-8 border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Calculate Your Moving Cost
        </h2>
        <p className="text-slate-600 text-lg font-medium">
          What&apos;s your current ZIP code?
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="Enter your ZIP code"
              value={zip}
              onChange={handleZipChange}
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-lg focus:border-blue-500 focus:bg-white focus:shadow-md outline-none transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
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
          disabled={zip.length !== 5}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-200 text-lg shadow-md shadow-blue-500/20 animate-twitch"
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
