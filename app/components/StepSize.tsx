'use client';

import { FormData } from '../types';
import { Home, Building, Building2, Package, Check } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  quotesRequested: number;
}

const sizeOptions = [
  { id: '1br', label: '1 Bedroom / Studio', desc: '400-600 cu ft', icon: Home, color: 'blue' },
  { id: '2br', label: '2 Bedrooms', desc: '800-1000 cu ft', icon: Building, color: 'indigo' },
  { id: '3br', label: '3+ Bedrooms', desc: '1200+ cu ft', icon: Building2, color: 'violet' },
  { id: 'storage', label: 'Storage / Other', desc: 'Partial moves', icon: Package, color: 'slate' },
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/25',
  violet: 'from-violet-500 to-violet-600 shadow-violet-500/25',
  slate: 'from-slate-500 to-slate-600 shadow-slate-500/25',
};

export default function StepSize({ formData, updateFormData, onNext, onBack, quotesRequested }: Props) {
  const handleSelect = (size: string) => {
    updateFormData({ moveSize: size });
    setTimeout(() => onNext(), 200);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          What size is your move?
        </h2>
        <p className="text-slate-600">
          Select the option that best describes your home
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {sizeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.moveSize === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`relative p-5 rounded-2xl text-left transition-all duration-200 border-2 group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[option.color]} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-slate-900 mb-1">{option.label}</div>
              <div className="text-sm text-slate-500">{option.desc}</div>
            </button>
          );
        })}
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
        onClick={onBack}
        className="w-full py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
