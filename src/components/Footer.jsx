import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-40 bg-[#F8F9FA] text-slate-700 py-16 border-t border-slate-200/80 font-mono text-xs shadow-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 p-1 flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="Πsparrow Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-slate-900 uppercase tracking-widest block">
                Πsparrow
              </span>
              <span className="text-[9px] text-tealbrand-700 font-bold uppercase tracking-wider">
                Software Solutions
              </span>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
            Innovative Software, Naturally. High-performance software architectures, agentic AI swarms, custom model fine-tuning, and ready SaaS suites engineered with mathematical precision.
          </p>

          <div className="pt-2 flex items-center space-x-3 text-[10px] text-tealbrand-700 font-bold">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>Global Multi-Region Mesh</span>
            </span>
          </div>
        </div>

        {/* Core Navigation */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-widest mb-4 text-xs">Solutions</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/#about" className="hover:text-tealbrand-600 transition-colors">About Us</a></li>
            <li><a href="/#services" className="hover:text-tealbrand-600 transition-colors">Software & UI/UX</a></li>
            <li><a href="/#services" className="hover:text-tealbrand-600 transition-colors">AI Automation & Swarms</a></li>
            <li><a href="/#services" className="hover:text-tealbrand-600 transition-colors">Model Fine-Tuning</a></li>
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">Flagship Platforms</a></li>
            <li><a href="/#contact" className="hover:text-tealbrand-600 transition-colors">Contact Canal</a></li>
          </ul>
        </div>

        {/* Flagship SaaS Suites */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-widest mb-4 text-xs">SaaS Platforms</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">HRMS Enterprise</a></li>
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">CRM Marketing</a></li>
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">CMS Publisher</a></li>
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">LMS Education</a></li>
            <li><a href="/#products" className="hover:text-tealbrand-600 transition-colors">PlaySchool Safety</a></li>
            <li><a href="https://visualfrog.pisparrow.com" target="_blank" rel="noopener noreferrer" className="hover:text-tealbrand-600 transition-colors">VisualFrog Converter</a></li>
          </ul>
        </div>

        {/* Legal Pages Link */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-widest mb-4 text-xs">Governance & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/privacy" className="hover:text-tealbrand-600 transition-colors block">
                Privacy Protocol
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-tealbrand-600 transition-colors block">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/security" className="hover:text-tealbrand-600 transition-colors block">
                Zero-Trust Security
              </Link>
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
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Πsparrow Software Solutions. All rights reserved.</p>

        <div className="flex items-center space-x-6 mt-4 md:mt-0 font-mono">
          <Link to="/privacy" className="hover:text-tealbrand-600">Privacy</Link>
          <Link to="/terms" className="hover:text-tealbrand-600">Terms</Link>
          <Link to="/security" className="hover:text-tealbrand-600">Security</Link>
          <span className="text-tealbrand-700 font-bold">Enterprise System Active</span>
        </div>
      </div>
    </footer>
  );
}
