'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData } from '../types';
import { submitCalcLead } from '../submit';
import { Tag, Zap, Lock, ArrowRight, MapPin, Calendar, Package } from 'lucide-react';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Major US city coordinates for distance calculation
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Northeast
  'new york': { lat: 40.7128, lng: -74.0060 },
  'nyc': { lat: 40.7128, lng: -74.0060 },
  'boston': { lat: 42.3601, lng: -71.0589 },
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'baltimore': { lat: 39.2904, lng: -76.6122 },
  'washington': { lat: 38.9072, lng: -77.0369 },
  'dc': { lat: 38.9072, lng: -77.0369 },
  
  // Southeast
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
  
  // Midwest
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
  
  // Southwest
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'san antonio': { lat: 29.4241, lng: -98.4936 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'tucson': { lat: 32.2226, lng: -110.9747 },
  'albuquerque': { lat: 35.0844, lng: -106.6504 },
  'las vegas': { lat: 36.1699, lng: -115.1398 },
  'denver': { lat: 39.7392, lng: -104.9903 },
  
  // West Coast
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'la': { lat: 34.0522, lng: -118.2437 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'sf': { lat: 37.7749, lng: -122.4194 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'sacramento': { lat: 38.5816, lng: -121.4944 },
  'portland': { lat: 45.5152, lng: -122.6784 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  
  // Other
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
  
  // Direct match
  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }
  
  // Try to find partial match (e.g., "Dallas, TX" should match "dallas")
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
    // Fallback: estimate based on string difference (rough approximation)
    const hash = (from + to).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 1500) + 300;
  }
  
  // Haversine formula for distance calculation
  const R = 3959; // Earth's radius in miles
  const dLat = (toCoords.lat - fromCoords.lat) * Math.PI / 180;
  const dLng = (toCoords.lng - fromCoords.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromCoords.lat * Math.PI / 180) * Math.cos(toCoords.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;
  
  // Add ~20% for road distance vs straight line
  return Math.round(straightLineDistance * 1.2);
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
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const distance = useMemo(() => 
    calculateDistance(formData.fromCity, formData.toCity),
    [formData.fromCity, formData.toCity]
  );

  const discount = 600;

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

      // POST to Google Sheets webhook, then redirect
      try {
        await submitCalcLead(lead);
      } catch {
        // Don't block redirect on failure
      }
      router.push('/success');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const moveSizeLabel = {
    'studio': 'Studio/Room',
    '1bed': '1 Bedroom',
    '2bed': '2 Bedroom',
    '3bed': '3 Bedroom',
    '4bed': '4+ Bedroom',
  }[formData.moveSize] || formData.moveSize;

  const moveDate = formData.notSureDate 
    ? 'Flexible' 
    : formData.moveDate 
      ? new Date(formData.moveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'TBD';

  return (
    <div className="relative">
      {/* Background content (blurred) */}
      <div className={`transition-all duration-500 ${isVisible ? 'blur-sm scale-[0.98] opacity-60' : ''}`}>
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
            <div className="flex items-center gap-3 text-sm mb-4">
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

            {/* Move details */}
            <div className="flex gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>{moveSizeLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{moveDate}</span>
              </div>
            </div>

            {/* Discount badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
              <Tag className="w-4 h-4" />
              Save ${discount} — Limited Time Offer
            </div>
          </div>

          {/* Placeholder content */}
          <div className="p-6 space-y-4">
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Popup form (floating on top) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm">
          <div className="text-center mb-5">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Unlock Your Quote</h3>
            <p className="text-slate-500 text-sm">
              Enter your details to see your personalized moving estimate
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>
            
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
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
          </p>

          <button
            onClick={onBack}
            className="w-full mt-3 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors text-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
