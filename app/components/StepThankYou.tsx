'use client';

import { FormData } from '../types';
import { CheckCircle, Phone, Mail, Clock, PartyPopper } from 'lucide-react';

interface Props {
  formData: FormData;
}

export default function StepThankYou({ formData }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 text-center">
      {/* Success animation */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <PartyPopper className="w-5 h-5 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Thank You, {formData.fullName.split(' ')[0]}! 🎉
      </h2>

      <p className="text-slate-600 mb-8 max-w-sm mx-auto">
        Your quote request has been submitted. A moving specialist will contact you shortly with your personalized quote.
      </p>

      {/* What's next */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 text-left">
        <h3 className="font-semibold text-slate-900 mb-4 text-center">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">We&apos;ll call you</div>
              <div className="text-sm text-slate-500">
                Expect a call within 15 minutes during business hours
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Check your inbox</div>
              <div className="text-sm text-slate-500">
                Detailed quote sent to {formData.email}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Lock in your rate</div>
              <div className="text-sm text-slate-500">
                Your discounted rate is valid for 7 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
