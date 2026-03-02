'use client';

import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    text: "The team was professional and efficient. Made our cross-country move stress-free!",
    author: "Sarah T.",
    route: "California → Texas",
    rating: 5
  },
  {
    text: "Accurate quote, on-time pickup and delivery. Couldn't ask for more.",
    author: "Michael R.",
    route: "New York → Florida",
    rating: 5
  },
  {
    text: "Excellent service from start to finish. The movers were careful with all our belongings.",
    author: "Jennifer K.",
    route: "Florida → Texas",
    rating: 5
  }
];

export default function TrustBadges() {
  return (
    <div className="mt-12">
      {/* Rating summary */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="w-6 h-6 text-amber-400 fill-amber-400"
            />
          ))}
        </div>
        <p className="text-slate-600">
          <span className="font-bold text-slate-900">4.8/5</span> from <span className="font-semibold">12,800+</span> reviews
        </p>
      </div>

      {/* Reviews */}
      <div className="space-y-4 mb-8">
        {reviews.map((review, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <Quote className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-slate-700 mb-3">{review.text}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{review.author}</p>
                <p className="text-sm text-slate-500">{review.route}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
          🏆 Member AMSA
        </span>
        <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
          ✓ Certified ProMover
        </span>
        <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
          A+ BBB Rated
        </span>
      </div>

      {/* Guarantee */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 text-center border border-emerald-100">
        <p className="text-slate-700">
          <span className="font-bold text-emerald-700">100% Satisfaction Guarantee</span>
          <br />
          <span className="text-sm text-slate-600">If you&apos;re not completely satisfied, we&apos;ll make it right.</span>
        </p>
      </div>
    </div>
  );
}
