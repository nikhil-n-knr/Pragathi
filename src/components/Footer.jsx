import React from 'react';
import { ArrowUp, Activity } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-tealbrand-500/20 border border-tealbrand-500/30 flex items-center justify-center text-tealbrand-400 font-mono font-bold text-sm">
                Π
              </div>
              <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
                sparrow
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm leading-relaxed mb-6">
              Bio-mimetic software, embedded hardware engineering, and precision PCB design architectures built for infinite industrial growth.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>All Edge Nodes Operational — 99.99% Uptime</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a href="#cinematic" className="hover:text-tealbrand-400 transition-colors">
                  System Beats
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-tealbrand-400 transition-colors">
                  Showcase Modules
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-tealbrand-400 transition-colors">
                  Hardware Capabilities
                </a>
              </li>
              <li>
                <a href="#telemetry" className="hover:text-tealbrand-400 transition-colors">
                  Telemetry Stream
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a href="#team" className="hover:text-tealbrand-400 transition-colors">
                  Core Flock
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-tealbrand-400 transition-colors">
                  Project Canal
                </a>
              </li>
              <li className="text-slate-500">Zero-Trust Protocol</li>
              <li className="text-slate-500">V2.0 Core RTOS</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-slate-500">
          <p>© 2026 Πsparrow Software & Hardware Solutions. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-tealbrand-400 hover:text-tealbrand-300 transition-colors"
          >
            <span>Return To Apex</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
