'use client';

import { useState, useEffect, useRef } from 'react';
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

// Use Google Geocoding to get coordinates + ZIP, then Haversine for distance
function geocodeCity(city: string): Promise<{ lat: number; lng: number; zip: string | null } | null> {
  return new Promise((resolve) => {
    if (!window.google?.maps) {
      resolve(null);
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: city }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location;
        // Extract ZIP code from address components
        let zip: string | null = null;
        for (const component of results[0].address_components) {
          if (component.types.includes('postal_code')) {
            zip = component.short_name;
            break;
          }
        }
        resolve({ lat: loc.lat(), lng: loc.lng(), zip });
      } else {
        resolve(null);
      }
    });
  });
}

function haversineDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 3959;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // ~20% added for road vs straight line
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
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [phase, setPhase] = useState<'calculating' | 'reveal'>('calculating');
  const [progress, setProgress] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [fromZip, setFromZip] = useState<string | null>(null);
  const [toZip, setToZip] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const discount = 600;
  const baseEstimate = distance ? Math.round((distance * 1.2 + 800) / 50) * 50 : 0;

  // Geocode both cities and calculate real distance + extract ZIPs
  useEffect(() => {
    let cancelled = false;
    async function calc() {
      const [fromCoords, toCoords] = await Promise.all([
        geocodeCity(formData.fromCity),
        geocodeCity(formData.toCity),
      ]);
      if (cancelled) return;
      if (fromCoords && toCoords) {
        setDistance(haversineDistance(fromCoords, toCoords));
        setFromZip(fromCoords.zip);
        setToZip(toCoords.zip);
      } else {
        // Fallback
        setDistance(500);
      }
    }
    calc();
    return () => { cancelled = true; };
  }, [formData.fromCity, formData.toCity]);

  // Calculating animation (waits for distance too)
  useEffect(() => {
    if (phase !== 'calculating') return;
    const duration = 3000;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min(elapsed / duration, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p >= 1) {
        clearInterval(timer);
        // Wait for distance to be ready, then reveal
        const check = setInterval(() => {
          // distance is in a ref-like state, check via callback
          setDistance((d) => {
            if (d !== null) {
              clearInterval(check);
              setTimeout(() => setPhase('reveal'), 400);
            }
            return d;
          });
        }, 100);
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
        void buttonRef.current.offsetWidth;
        buttonRef.current.classList.add('animate-twitch');
      }
    };
    const initialTimeout = setTimeout(doTwitch, 1000);
    const interval = setInterval(doTwitch, 10000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: { name?: string; email?: string; phone?: string } = {};
    
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a complete 10-digit phone number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSubmitting(true);
      const updatedData = {
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };
      updateFormData(updatedData);

      const lead = {
        ...formData,
        ...updatedData,
        fromZip,
        toZip,
        distance: distance ?? 0,
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

  const moveSizeLabel =
    ({
      studio: 'Studio/Room',
      '1bed': '1 Bedroom',
      '1br': '1 Bedroom',
      '2bed': '2 Bedroom',
      '2br': '2 Bedrooms',
      '3bed': '3 Bedroom',
      '3br': '3+ Bedrooms',
      '4bed': '4+ Bedroom',
      storage: 'Storage / Other',
    } as Record<string, string>)[formData.moveSize] || formData.moveSize;

  const moveDate = formData.notSureDate
    ? 'Flexible'
    : formData.moveDate
      ? new Date(formData.moveDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
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

          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {Math.round(progress * 100)}%
            </p>
          </div>

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

  // Reveal phase
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 border border-slate-200 overflow-hidden">
      {/* Estimate summary */}
      <div className="p-6 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Your Estimate
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-slate-900">
            {distance?.toLocaleString()}
          </span>
          <span className="text-slate-400 text-sm">miles</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{formData.fromCity}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <span>{formData.toCity}</span>
        </div>

        <div className="flex gap-4 text-xs text-slate-400 mt-2">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {moveSizeLabel}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {moveDate}
          </span>
        </div>
      </div>

      {/* Pricing (blurred) */}
      <div className="p-6 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Original estimate:</span>
          <span className="text-sm text-slate-400 blur-sm select-none">
            ${baseEstimate.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-red-500">
            Available mover discounts:
          </span>
          <span className="text-sm font-semibold text-red-500">-${discount}</span>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-800">
              Final price:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-slate-800">$</span>
              <div className="relative inline-flex items-center">
                <span className="text-lg font-bold text-slate-800 blur-sm select-none">
                  {(baseEstimate - discount).toLocaleString()}
                </span>
                <Lock className="w-5 h-5 text-slate-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlock form */}
      <div className="p-6">
        <p className="text-center text-lg font-bold text-slate-800 mb-1">
          One Last Step!
        </p>
        <p className="text-center text-sm text-slate-500 mb-5">
          Enter your contact information to get your complete moving quote with all available discounts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => { handlePhoneChange(e); setErrors(prev => ({ ...prev, phone: undefined })); }}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={submitting || phone.replace(/\D/g, '').length < 10}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-lg"
          >
            <Lock className="w-5 h-5" />
            {submitting ? 'Unlocking...' : 'Get My Moving Estimate'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>{' '}
          and consent to be contacted by phone or text by us and our moving
          partners regarding your moving estimate. Message &amp; data rates may
          apply.
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
