import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Πsparrow Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-white uppercase tracking-widest block">
                Πsparrow
              </span>
              <span className="text-[9px] text-tealbrand-400 font-bold uppercase tracking-wider">
                Software Solutions
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Innovative Software, Naturally. High-contrast digital architectures, AI swarms, and ready-to-deploy platforms built twig by twig.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Navigation</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#about" className="hover:text-tealbrand-400 transition-colors">About Us</a></li>
            <li><a href="#services" className="hover:text-tealbrand-400 transition-colors">Solutions & AI</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">Flagship Products</a></li>
            <li><a href="#noema-board" className="hover:text-tealbrand-400 transition-colors">Live Telemetry</a></li>
            <li><a href="#contact" className="hover:text-tealbrand-400 transition-colors">Contact Canal</a></li>
          </ul>
        </div>

        {/* Ready Platforms */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Platforms</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">HRMS Enterprise (v2.1.0)</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">CRM Marketing (v1.8.5)</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">CMS Publisher (v3.0.2)</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">LMS Education (v1.5.0)</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">PlaySchool Safety (v1.2.2)</a></li>
            <li><a href="https://visualfrog.pisparrow.com" target="_blank" rel="noopener noreferrer" className="hover:text-tealbrand-400 transition-colors">VisualFrog Converter</a></li>
          </ul>
        </div>

        {/* System Telemetry & Copyright */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-widest mb-2 text-xs">System Registry</h4>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-[10px]">
            <div className="flex items-center justify-between text-tealbrand-400 font-bold">
              <span>STATUS</span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-400 animate-ping"></span>
                <span>SYSTEM ACTIVE</span>
              </span>
            </div>
            <div className="text-slate-500">REGION: Global Multi-Cluster</div>
            <div className="text-slate-500">BUILD: v2.0.0-PROD</div>
          </div>
          <p className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} Πsparrow Software Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
