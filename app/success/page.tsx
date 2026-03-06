'use client';

import { CheckCircle, Search, MessageSquare } from 'lucide-react';
import Footer from '../components/Footer';

export default function Success() {
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
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 text-center">
          {/* Success animation */}
          <div className="relative mb-6 inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            You&apos;re All Set!
          </h2>

          <p className="text-slate-600 mb-8 max-w-sm mx-auto text-lg">
            We&apos;ve received your request. A local moving specialist will reach out to you shortly.
          </p>

          {/* What's next */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-4 text-center">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Mover Match In Progress</div>
                  <div className="text-sm text-slate-500">
                    We&apos;re checking availability with licensed movers in your area.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Confirm &amp; Estimate</div>
                  <div className="text-sm text-slate-500">
                    A moving specialist may reach out to confirm details and provide your estimate.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href="/calc"
            className="inline-block mt-8 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Get a detailed moving quote →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
