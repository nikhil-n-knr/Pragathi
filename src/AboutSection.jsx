import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="nature-glass rounded-2xl p-8 md:p-14 border border-tealbrand-500/20 relative shadow-lg">
          {/* Corner Markers */}
          <span className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-tealbrand-600/40"></span>
          <span className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-tealbrand-600/40"></span>
          <span className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-tealbrand-600/40"></span>
          <span className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-tealbrand-600/40"></span>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
                <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                  WHO WE ARE // PHILOSOPHY
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-6">
                Welcome to <span className="font-mono font-bold text-tealbrand-600">Πsparrow</span>
              </h2>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                At Πsparrow, we believe in the power of technology to foster growth and structural efficiency. Like a sparrow building its nest twig by twig with precision, we build our software architectures with meticulous care, focusing on mathematical precision and technical detail.
              </p>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans">
                Our name combines <strong className="text-tealbrand-700 font-mono">Π (Pi)</strong>, representing the mathematical precision and infinite potential of computing, with <strong className="text-tealbrand-700">Sparrow</strong>, representing diligence, agility, and system integrity. This design philosophy drives us to deliver robust, high-performance, and perfectly clean digital systems.
              </p>
            </div>

            {/* Emblem Card */}
            <div className="flex justify-center">
              <div className="w-64 h-64 border border-tealbrand-500/20 bg-gradient-to-br from-tealbrand-50/50 via-white to-emerald-50/50 rounded-2xl flex flex-col items-center justify-center relative shadow-inner group">
                <span className="font-mono text-9xl text-slate-200 select-none group-hover:scale-105 transition-transform duration-500">
                  Π
                </span>
                <div className="absolute bottom-4 right-4 h-9 w-9 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 flex items-center justify-center text-tealbrand-600 font-mono font-bold text-sm shadow-sm">
                  ★
                </div>
                <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest mt-2">
                  Πsparrow Core
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
