import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-tealbrand-500/15 shadow-sm py-3'
          : 'bg-white/60 backdrop-blur-sm border-b border-slate-200/60 py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 group"
        >
          <div className="w-9 h-9 rounded-md bg-tealbrand-500/10 border border-tealbrand-500/25 flex items-center justify-center text-tealbrand-600 font-mono font-bold text-base shadow-sm group-hover:scale-105 group-hover:bg-tealbrand-500 group-hover:text-white transition-all duration-300">
            Π
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-tealbrand-600 transition-colors">
              sparrow
            </span>
            <span className="text-[9px] font-mono tracking-wider text-tealbrand-600 uppercase">
              Nature & Engineering
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('cinematic')}
            className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 hover:text-tealbrand-600 transition-colors"
          >
            System
          </button>
          <button
            onClick={() => scrollToSection('showcase')}
            className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 hover:text-tealbrand-600 transition-colors"
          >
            Showcase
          </button>
          <button
            onClick={() => scrollToSection('capabilities')}
            className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 hover:text-tealbrand-600 transition-colors"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToSection('telemetry')}
            className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 hover:text-tealbrand-600 transition-colors"
          >
            Telemetry
          </button>
          <button
            onClick={() => scrollToSection('team')}
            className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 hover:text-tealbrand-600 transition-colors"
          >
            Team
          </button>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
            System v2.0 Live
          </div>
          <button
            onClick={() => scrollToSection('contact')}
            className="inline-flex items-center space-x-2 bg-tealbrand-600 hover:bg-tealbrand-700 text-white px-4 py-2 rounded-md font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Initialize Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-3 pb-6 bg-white/95 backdrop-blur-lg border-t border-slate-200 space-y-3 animate-fadeIn">
          <button
            onClick={() => scrollToSection('cinematic')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-widest text-slate-700 hover:text-tealbrand-600"
          >
            System
          </button>
          <button
            onClick={() => scrollToSection('showcase')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-widest text-slate-700 hover:text-tealbrand-600"
          >
            Showcase
          </button>
          <button
            onClick={() => scrollToSection('capabilities')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-widest text-slate-700 hover:text-tealbrand-600"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToSection('telemetry')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-widest text-slate-700 hover:text-tealbrand-600"
          >
            Telemetry
          </button>
          <button
            onClick={() => scrollToSection('team')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-widest text-slate-700 hover:text-tealbrand-600"
          >
            Team
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full mt-2 bg-tealbrand-600 text-white text-center py-2.5 rounded-md font-mono text-xs font-bold uppercase tracking-widest"
          >
            Initialize Project
          </button>
        </div>
      )}
    </header>
  );
}
