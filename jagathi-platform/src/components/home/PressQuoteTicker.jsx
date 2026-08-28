'use client';

import React, { useState, useEffect } from 'react';

const quotes = [
  {
    quote: "“Jagathi's execution resolution operates at a standard most developers never attempt. Delivered on deadline, exactly to spec.”",
    source: "ARCHITECTURAL RECORD — INDUSTRIAL EDITION",
  },
  {
    quote: "“Master-scale heavy cores built with zero version loss between engineering and turnkey handover.”",
    source: "CIVIL ENGINEERING DIGEST",
  },
  {
    quote: "“Thirty-five years of uncompromised trust in land development and structural construction.”",
    source: "REAL ESTATE & INFRASTRUCTURE FORUM",
  },
  {
    quote: "“Precision at every level — from structural shear reinforcement to bespoke interior millwork.”",
    source: "SPATIAL DESIGN REVIEW",
  },
];

export default function PressQuoteTicker() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = quotes[activeIdx];

  return (
    <section className="relative z-10 w-full py-16 bg-[#121315] border-t border-b border-[#FFEA0A]/20 text-white">
      <div
        className="max-w-[1100px] mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-center min-h-[220px]"
        style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold block mb-6">
          {'// WHAT THE RECORD SAYS / CLIENT & INDUSTRY EVALUATION'}
        </span>

        <blockquote className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-wide max-w-3xl leading-snug transition-all duration-500">
          {current.quote}
        </blockquote>

        <cite className="font-mono text-xs text-[#FFEA0A]/80 tracking-widest uppercase block mt-6 not-italic font-bold">
          {current.source}
        </cite>

        <div className="flex gap-2 mt-8">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIdx === idx ? 'bg-[#FFEA0A] scale-125' : 'bg-white/20'
              }`}
              aria-label={`Go to quote ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
