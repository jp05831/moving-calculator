'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../types';
import { submitCalcLead } from '../submit';
import { Lock, ArrowRight, MapPin, Package, Calendar } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'new york': { lat: 40.7128, lng: -74.0060 },
  'nyc': { lat: 40.7128, lng: -74.0060 },
  'boston': { lat: 42.3601, lng: -71.0589 },
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'baltimore': { lat: 39.2904, lng: -76.6122 },
  'washington': { lat: 38.9072, lng: -77.0369 },
  'dc': { lat: 38.9072, lng: -77.0369 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'orlando': { lat: 28.5383, lng: -81.3792 },
  'tampa': { lat: 27.9506, lng: -82.4572 },
  'jacksonville': { lat: 30.3322, lng: -81.6557 },
  'atlanta': { lat: 33.7490, lng: -84.3880 },
  'charlotte': { lat: 35.2271, lng: -80.8431 },
  'raleigh': { lat: 35.7796, lng: -78.6382 },
  'nashville': { lat: 36.1627, lng: -86.7816 },
  'memphis': { lat: 35.1495, lng: -90.0490 },
  'new orleans': { lat: 29.9511, lng: -90.0715 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'detroit': { lat: 42.3314, lng: -83.0458 },
  'cleveland': { lat: 41.4993, lng: -81.6944 },
  'columbus': { lat: 39.9612, lng: -82.9988 },
  'indianapolis': { lat: 39.7684, lng: -86.1581 },
  'milwaukee': { lat: 43.0389, lng: -87.9065 },
  'minneapolis': { lat: 44.9778, lng: -93.2650 },
  'st louis': { lat: 38.6270, lng: -90.1994 },
  'kansas city': { lat: 39.0997, lng: -94.5786 },
  'omaha': { lat: 41.2565, lng: -95.9345 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'san antonio': { lat: 29.4241, lng: -98.4936 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'tucson': { lat: 32.2226, lng: -110.9747 },
  'albuquerque': { lat: 35.0844, lng: -106.6504 },
  'las vegas': { lat: 36.1699, lng: -115.1398 },
  'denver': { lat: 39.7392, lng: -104.9903 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'la': { lat: 34.0522, lng: -118.2437 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'sf': { lat: 37.7749, lng: -122.4194 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'sacramento': { lat: 38.5816, lng: -121.4944 },
  'portland': { lat: 45.5152, lng: -122.6784 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'salt lake city': { lat: 40.7608, lng: -111.8910 },
  'oklahoma city': { lat: 35.4676, lng: -97.5164 },
  'louisville': { lat: 38.2527, lng: -85.7585 },
  'birmingham': { lat: 33.5207, lng: -86.8025 },
  'richmond': { lat: 37.5407, lng: -77.4360 },
  'buffalo': { lat: 42.8864, lng: -78.8784 },
  'hartford': { lat: 41.7658, lng: -72.6734 },
  'providence': { lat: 41.8240, lng: -71.4128 },
};

function findCityCoordinates(cityInput: string): { lat: number; lng: number } | null {
  const normalized = cityInput.toLowerCase().trim();
  if (cityCoordinates[normalized]) return cityCoordinates[normalized];
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (normalized.includes(city) || city.includes(normalized.split(',')[0].trim())) {
      return coords;
    }
  }
  return null;
}

function calculateDistance(from: string, to: string): number {
  const fromCoords = findCityCoordinates(from);
  const toCoords = findCityCoordinates(to);
  if (!fromCoords || !toCoords) {
    const hash = (from + to).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 1500) + 300;
  }
  const R = 3959;
  const dLat = (toCoords.lat - fromCoords.lat) * Math.PI / 180;
  const dLng = (toCoords.lng - fromCoords.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromCoords.lat * Math.PI / 180) * Math.cos(toCoords.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.2);
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function StepQuote({ formData, updateFormData, onNext, onBack }: Props) {
  const router = useRouter();
  const [name, setName] = useState(formData.fullName);
  const [email, setEmail] = useState(formData.email);
  const [phone, setPhone] = useState(formData.phone);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<'calculating' | 'reveal'>('calculating');
  const [progress, setProgress] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const distance = useMemo(() =>
    calculateDistance(formData.fromCity, formData.toCity),
    [formData.fromCity, formData.toCity]
  );

  const baseEstimate = useMemo(() => {
    const base = distance * 1.2 + 800;
    return Math.round(base / 50) * 50;
  }, [distance]);

  const discount = 600;

  // Calculating animation
  useEffect(() => {
    if (phase !== 'calculating') return;
    const duration = 3000;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min(elapsed / duration, 1);
      // Ease out
      setProgress(1 - Math.pow(1 - p, 3));
      if (p >= 1) {
        clearInterval(timer);
        setTimeout(() => setPhase('reveal'), 400);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [phase]);

  // Repeating twitch every 10s on the unlock button
  useEffect(() => {
    if (phase !== 'reveal') return;
    const doTwitch = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove('animate-twitch');
        // Force reflow
        void buttonRef.current.offsetWidth;
        buttonRef.current.classList.add('animate-twitch');
      }
    };
    // Initial twitch after 1s
    const initialTimeout = setTimeout(doTwitch, 1000);
    // Then every 10s
    const interval = setInterval(doTwitch, 10000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && phone.trim()) {
      setSubmitting(true);
      const updatedData = {
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      };
      updateFormData(updatedData);

      const lead = {
        ...formData,
        ...updatedData,
        distance,
        submittedAt: new Date().toISOString(),
      };
      const existingLeads = JSON.parse(localStorage.getItem('calc-leads') || '[]');
      existingLeads.push(lead);
      localStorage.setItem('calc-leads', JSON.stringify(existingLeads));

      try {
        await submitCalcLead(lead);
      } catch {
        // Don't block redirect
      }
      router.push('/success');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const moveSizeLabel = {
    'studio': 'Studio/Room',
    '1bed': '1 Bedroom',
    '1br': '1 Bedroom',
    '2bed': '2 Bedroom',
    '2br': '2 Bedrooms',
    '3bed': '3 Bedroom',
    '3br': '3+ Bedrooms',
    '4bed': '4+ Bedroom',
    'storage': 'Storage / Other',
  }[formData.moveSize] || formData.moveSize;

  const moveDate = formData.notSureDate
    ? 'Flexible'
    : formData.moveDate
      ? new Date(formData.moveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'TBD';

  // Calculating phase
  if (phase === 'calculating') {
    return (
      <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 p-8 border border-slate-200">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Calculating your estimate...
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Analyzing routes, rates, and available discounts
          </p>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.round(progress * 100)}%</p>
          </div>

          {/* Details being "processed" */}
          <div className="mt-6 space-y-2 text-sm text-slate-400">
            <p className={`transition-opacity duration-300 ${progress > 0.1 ? 'opacity-100' : 'opacity-0'}`}>
              ✓ Route: {formData.fromCity} → {formData.toCity}
            </p>
            <p className={`transition-opacity duration-300 ${progress > 0.35 ? 'opacity-100' : 'opacity-0'}`}>
              ✓ Move size: {moveSizeLabel}
            </p>
            <p className={`transition-opacity duration-300 ${progress > 0.6 ? 'opacity-100' : 'opacity-0'}`}>
              ✓ Checking mover availability...
            </p>
            <p className={`transition-opacity duration-300 ${progress > 0.85 ? 'opacity-100' : 'opacity-0'}`}>
              ✓ Applying available discounts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reveal phase — estimate + unlock form
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 border border-slate-200 overflow-hidden">
      {/* Estimate summary */}
      <div className="p-6 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Estimate</p>

        {/* Distance */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-slate-900">{distance.toLocaleString()}</span>
          <span className="text-slate-400 text-sm">miles</span>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{formData.fromCity}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span>{formData.toCity}</span>
        </div>

        {/* Details row */}
        <div className="flex gap-4 text-xs text-slate-400 mt-2">
          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{moveSizeLabel}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{moveDate}</span>
        </div>
      </div>

      {/* Pricing (blurred) */}
      <div className="p-6 border-b border-slate-100 space-y-3">
        {/* Original estimate */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Original estimate</span>
          <span className="text-sm text-slate-400 blur-sm select-none">${baseEstimate.toLocaleString()}</span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Available mover discounts</span>
          <span className="text-sm font-semibold text-red-500">-${discount}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-800">Final price</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800 blur-sm select-none">
                ${(baseEstimate - discount).toLocaleString()}
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Unlock form */}
      <div className="p-6">
        <p className="text-center text-sm font-semibold text-slate-700 mb-4">
          One last step — unlock your quote
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
            required
          />

          <button
            ref={buttonRef}
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-lg"
          >
            <Lock className="w-5 h-5" />
            {submitting ? 'Unlocking...' : 'Unlock My Quote'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
          {' '}and consent to be contacted by phone or text by us and our moving partners regarding your moving estimate. Message &amp; data rates may apply.
        </p>

        <button
          onClick={onBack}
          className="w-full mt-3 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors text-sm"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
