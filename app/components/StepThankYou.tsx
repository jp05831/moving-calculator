'use client';

import { FormData } from '../types';
import { CheckCircle } from 'lucide-react';

interface Props {
  formData: FormData;
}

export default function StepThankYou({ formData }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/40 p-8 border border-slate-200 text-center">
      {/* Success icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        You&apos;re All Set, {formData.fullName.split(' ')[0]}!
      </h2>

      <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
        Your quote request has been submitted successfully.
      </p>

      {/* Mover Match */}
      <div className="border border-slate-200 rounded-lg p-6 text-left">
        <h3 className="font-bold text-slate-900 mb-1">Mover Match in Progress</h3>
        <p className="text-sm text-slate-500 mb-4">
          We&apos;re checking availability with licensed movers in your area.
        </p>
        <p className="text-sm text-slate-400">
          A moving specialist may reach out to confirm details and provide your estimate.
        </p>
      </div>
    </div>
  );
}
