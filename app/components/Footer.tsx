import { Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 px-4 mt-12">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-red-600">Freedom</span>
            <span className="text-slate-800"> Movers</span>
          </span>
        </div>
        
        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4">
          <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
          <span className="text-slate-300">•</span>
          <a href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</a>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-sm text-slate-400">
          © 2026 Freedom Movers LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
