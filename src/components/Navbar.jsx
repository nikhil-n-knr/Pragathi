import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling on page load if hash is present in location
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Solutions', href: '#services' },
    { name: 'Platforms', href: '#products' },
    { name: 'Telemetry', href: '#noema-board' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo Link to Home Page */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/20 p-1 flex items-center justify-center shadow-sm group-hover:border-tealbrand-500/50 transition-colors">
            <img src="/logo.png" alt="Πsparrow Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-slate-900 group-hover:text-tealbrand-600 transition-colors">
              Πsparrow
            </span>
            <span className="font-mono text-[8px] font-bold tracking-widest text-tealbrand-700 uppercase">
              SOFTWARE SOLUTIONS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-tealbrand-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-mono text-[10px] font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            <span>System Active</span>
          </span>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="inline-flex items-center space-x-2 bg-tealbrand-600 hover:bg-tealbrand-700 text-white px-5 py-2.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
          >
            <span>Initialize Project</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 hover:text-tealbrand-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block font-mono text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-tealbrand-600"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="block w-full text-center bg-tealbrand-600 text-white py-3 rounded-md font-mono text-xs font-bold uppercase tracking-wider"
          >
            Initialize Project
          </a>
        </div>
      )}
    </header>
  );
}
