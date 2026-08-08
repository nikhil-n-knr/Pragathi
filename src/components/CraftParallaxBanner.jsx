import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

export default function CraftParallaxBanner() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-tealbrand-900 via-tealbrand-800 to-emerald-900 text-white overflow-hidden shadow-inner">
      {/* Background Decorative Tech Lattice */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Ambient Radial Highlights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyanbrand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-cyanbrand-300 animate-spin-slow" />
            <span className="font-mono text-[10px] font-bold text-cyanbrand-200 uppercase tracking-widest">
              THE PI SPARROW MANIFESTO // ENGINEERING PHILOSOPHY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight mb-6 text-white">
            Every line of code and trace of copper is architected for{' '}
            <span className="font-semibold text-cyanbrand-300">nature-like resilience.</span>
          </h2>

          <p className="text-sm md:text-base font-mono text-tealbrand-100/90 leading-relaxed mb-8 max-w-2xl">
            We don't build temporary software. We engineer bio-mimetic systems, self-balancing circuit arrays, and high-frequency edge nodes engineered to survive, adapt, and scale indefinitely.
          </p>

          <a
            href="#contact"
            className="inline-flex items-center space-x-3 bg-white text-tealbrand-900 hover:bg-cyanbrand-50 px-6 py-3.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-cyanbrand-500/20 hover:-translate-y-0.5"
          >
            <span>Explore Bio-Architecture</span>
            <ArrowRight className="w-4 h-4 text-tealbrand-600" />
          </a>
        </div>
      </div>
    </section>
  );
}
