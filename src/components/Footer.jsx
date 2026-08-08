import React from 'react';

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="relative z-40 bg-[#090d16] text-slate-300 py-16 border-t border-slate-800 font-mono text-xs shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 p-1 flex items-center justify-center">
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

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Innovative Software, Naturally. High-performance software architectures, agentic AI swarms, custom model fine-tuning, and ready SaaS suites engineered with mathematical precision.
          </p>

          <div className="pt-2 flex items-center space-x-3 text-[10px] text-tealbrand-400 font-bold">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-400 animate-ping"></span>
              <span>Global Multi-Region Mesh</span>
            </span>
          </div>
        </div>

        {/* Core Navigation */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Solutions</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#about" className="hover:text-tealbrand-400 transition-colors">About Us</a></li>
            <li><a href="#services" className="hover:text-tealbrand-400 transition-colors">Software & UI/UX</a></li>
            <li><a href="#services" className="hover:text-tealbrand-400 transition-colors">AI Automation & Swarms</a></li>
            <li><a href="#services" className="hover:text-tealbrand-400 transition-colors">Model Fine-Tuning</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">Flagship Platforms</a></li>
            <li><a href="#contact" className="hover:text-tealbrand-400 transition-colors">Contact Canal</a></li>
          </ul>
        </div>

        {/* Flagship SaaS Suites */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">SaaS Platforms</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">HRMS Enterprise</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">CRM Marketing</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">CMS Publisher</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">LMS Education</a></li>
            <li><a href="#products" className="hover:text-tealbrand-400 transition-colors">PlaySchool Safety</a></li>
            <li><a href="https://visualfrog.pisparrow.com" target="_blank" rel="noopener noreferrer" className="hover:text-tealbrand-400 transition-colors">VisualFrog Converter</a></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Governance & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onOpenLegal('privacy')} className="hover:text-tealbrand-400 transition-colors text-left">
                Privacy Protocol
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-tealbrand-400 transition-colors text-left">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('security')} className="hover:text-tealbrand-400 transition-colors text-left">
                Zero-Trust Security
              </button>
            </li>
            <li>
              <span className="text-slate-500 block pt-2 text-[10px]">
                GDPR & CCPA Compliant
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Πsparrow Software Solutions. All rights reserved.</p>

        <div className="flex items-center space-x-6 mt-4 md:mt-0 font-mono">
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-tealbrand-400">Privacy</button>
          <button onClick={() => onOpenLegal('terms')} className="hover:text-tealbrand-400">Terms</button>
          <button onClick={() => onOpenLegal('security')} className="hover:text-tealbrand-400">Security</button>
          <span className="text-slate-600">v2.0.0-PROD</span>
        </div>
      </div>
    </footer>
  );
}
