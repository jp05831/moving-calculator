'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Phone, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { submitAvailabilityLead } from '../submit';
import Footer from '../components/Footer';
import { MapPin as MapPinIcon } from 'lucide-react';

function MiniCalendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const selectedStr = value;
  const fmt = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isPast = (d: number) => new Date(year, month, d) < today;

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 focus-within:border-blue-500 transition-all">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="text-sm font-semibold text-slate-800">{monthName}</span>
        <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-[10px] font-medium text-slate-400 py-1">{d}</div>
        ))}
        {days.map((d, i) =>
          d === null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={d}
              type="button"
              disabled={isPast(d)}
              onClick={() => onChange(fmt(d))}
              className={`text-sm py-1.5 rounded-lg transition-all ${
                fmt(d) === selectedStr
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : isPast(d)
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default function CheckAvailability() {
  const router = useRouter();
  const [zip, setZip] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !moveDate) return;

    setSubmitting(true);

    const lead = {
      zip: zip,
      location: zip,
      moveDate,
      phone: phone.trim(),
      submittedAt: new Date().toISOString(),
    };

    const existingLeads = JSON.parse(localStorage.getItem('availability-leads') || '[]');
    existingLeads.push(lead);
    localStorage.setItem('availability-leads', JSON.stringify(existingLeads));

    try {
      await submitAvailabilityLead(lead);
    } catch {
      // Don't block redirect
    }
    router.push('/success');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-4 glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-blue-800">Freedom</span>
            <span className="text-slate-800"> Movers</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Check If Movers Are Available For Your Move Date
            </h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Enter your move details and we&apos;ll connect you with the best option available.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Your ZIP Code
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="Enter your ZIP code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Move Date - Mini Calendar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Move Date
              </label>
              <MiniCalendar value={moveDate} onChange={setMoveDate} />
              {moveDate && (
                <p className="text-xs text-blue-600 font-medium mt-1.5 ml-1">
                  Selected: {new Date(moveDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                required
              />
              <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                By submitting, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>{' '}
                and consent to be contacted by phone or text by us and our moving partners regarding mover availability and your moving request. Message &amp; data rates may apply.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !moveDate || zip.length !== 5}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-lg"
            >
              <CheckCircle className="w-5 h-5" />
              {submitting ? 'Checking...' : 'Check Availability'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
