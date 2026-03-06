'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    text: "The team was professional and efficient. Made our cross-country move stress-free!",
    author: "David L.",
    route: "California → Texas",
  },
  {
    text: "Accurate quote, on-time pickup and delivery. Couldn't ask for more.",
    author: "Amanda W.",
    route: "New York → Florida",
  },
  {
    text: "Excellent service from start to finish. The movers were careful with all our belongings.",
    author: "Chris M.",
    route: "Florida → Texas",
  }
];

export default function TrustBadges() {
  return (
    <div className="mt-14">
      {/* Rating summary */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">4.8</span> from 12,800+ reviews
        </span>
      </div>

      {/* Reviews */}
      <div className="space-y-3 mb-10">
        {reviews.map((review, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-5">
            <p className="text-slate-600 text-sm leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{review.author}</p>
                <p className="text-xs text-slate-400">{review.route}</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-6 mb-6 text-sm text-slate-500">
        <span>🏆 AMSA Member</span>
        <span>✓ Certified ProMover</span>
        <span>A+ BBB Rated</span>
      </div>

      {/* Guarantee */}
      <div className="border-t border-slate-100 pt-6 text-center">
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">100% Satisfaction Guarantee</span> — If you&apos;re not completely satisfied, we&apos;ll make it right.
        </p>
      </div>
    </div>
  );
}
