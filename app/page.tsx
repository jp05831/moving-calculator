'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Step components
import StepFrom from './components/StepFrom';
import StepSize from './components/StepSize';
import StepDate from './components/StepDate';
import StepTo from './components/StepTo';
import StepQuote from './components/StepQuote';
import StepThankYou from './components/StepThankYou';
import Footer from './components/Footer';
import TrustBadges from './components/TrustBadges';

export interface FormData {
  fromCity: string;
  toCity: string;
  moveSize: string;
  moveDate: string | null;
  notSureDate: boolean;
  fullName: string;
  email: string;
  phone: string;
}

const initialFormData: FormData = {
  fromCity: '',
  toCity: '',
  moveSize: '',
  moveDate: null,
  notSureDate: false,
  fullName: '',
  email: '',
  phone: '',
};

const stepLabels = ['Location', 'Size', 'Date', 'Destination', 'Quote'];

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const quotesRequested = 996;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepFrom 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={nextStep}
            quotesRequested={quotesRequested}
          />
        );
      case 2:
        return (
          <StepSize 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={nextStep}
            onBack={prevStep}
            quotesRequested={quotesRequested}
          />
        );
      case 3:
        return (
          <StepDate 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={nextStep}
            onBack={prevStep}
            quotesRequested={quotesRequested}
          />
        );
      case 4:
        return (
          <StepTo 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={nextStep}
            onBack={prevStep}
            quotesRequested={quotesRequested}
          />
        );
      case 5:
        return (
          <StepQuote 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return <StepThankYou formData={formData} />;
      default:
        return null;
    }
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
      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        {step < 6 && (
          <div className="mb-8">
            {/* Step labels */}
            <div className="flex justify-between mb-3 px-1">
              {stepLabels.map((label, i) => (
                <span
                  key={label}
                  className={`text-xs font-medium transition-colors ${
                    i + 1 <= step ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="relative">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              
              {/* Step dots */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: s === step ? 1.2 : 1,
                      backgroundColor: s <= step ? '#2563eb' : '#e2e8f0'
                    }}
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Trust badges */}
        {step < 6 && <TrustBadges />}
      </main>

      <Footer />
    </div>
  );
}
