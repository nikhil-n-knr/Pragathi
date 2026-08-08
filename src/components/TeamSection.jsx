import React from 'react';
import { UserCheck, Shield, Terminal } from 'lucide-react';

export default function TeamSection() {
  return (
    <section id="team" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              PARTNERSHIP REGISTRY // LEADERSHIP
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
            Our Core <span className="font-bold text-tealbrand-600">Flock</span>
          </h2>
          <p className="mt-3 font-mono text-xs text-slate-500 uppercase tracking-wider">
            The architects behind the sparrow design system & bio-mimetic platforms.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="nature-glass nature-glass-hover rounded-2xl p-8 max-w-sm w-full text-center relative border border-tealbrand-500/20 group">
            {/* Tech Corner Accent */}
            <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-tealbrand-500/40"></div>
            <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-tealbrand-500/40"></div>

            {/* Initials Avatar Badge */}
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-tealbrand-500/10 to-emerald-500/10 border border-tealbrand-500/30 flex items-center justify-center font-mono font-bold text-2xl text-tealbrand-700 shadow-sm mb-6 group-hover:scale-105 group-hover:bg-tealbrand-600 group-hover:text-white transition-all duration-300">
              NN
            </div>

            <h3 className="text-xl font-bold text-slate-900 group-hover:text-tealbrand-600 transition-colors">
              Nikhil N
            </h3>

            <p className="font-mono text-xs font-semibold text-tealbrand-700 uppercase tracking-wider mt-1">
              Co-Founder & Lead Architect
            </p>

            <p className="text-xs text-slate-600 leading-relaxed mt-4 pt-4 border-t border-slate-100 font-mono">
              Specializing in bio-inspired hardware layout, micro-kernel firmware architecture, and zero-latency cloud platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
