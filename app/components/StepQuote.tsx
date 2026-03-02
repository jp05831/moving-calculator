'use client';

import { useState, useMemo } from 'react';
import { FormData } from '../page';
import { MapPin, Tag, Zap, Lock, ArrowRight } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function estimateDistance(from: string, to: string): number {
  const hash = (from + to).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash % 2000) + 200;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function StepQuote({ formData, updateFormData, onNext, onBack }: Props) {
  const [name, setName] = useState(formData.fullName);
  const [email, setEmail] = useState(formData.email);
  const [phone, setPhone] = useState(formData.phone);

  const distance = useMemo(() => 
    estimateDistance(formData.fromCity, formData.toCity),
    [formData.fromCity, formData.toCity]
  );

  const discount = 600;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && phone.trim()) {
      updateFormData({ 
        fullName: name.trim(), 
        email: email.trim(), 
        phone: phone.trim() 
      });
      onNext();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      {/* Quote Summary Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium text-slate-300">Your Instant Estimate</span>
        </div>
        
        {/* Distance */}
        <div className="text-4xl font-bold mb-4">
          {distance.toLocaleString()} <span className="text-lg font-normal text-slate-400">miles</span>
        </div>
        
        {/* Route */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-slate-300">{formData.fromCity}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-slate-300">{formData.toCity}</span>
          </div>
        </div>

        {/* Discount badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
          <Tag className="w-4 h-4" />
          Save ${discount} — Limited Time Offer
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">One Last Step!</h3>
          <p className="text-slate-600 text-sm">
            Enter your details to unlock your personalized quote with all available discounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Unlock My Quote
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
          <br />We&apos;ll never spam or share your info.
        </p>

        <button
          onClick={onBack}
          className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
