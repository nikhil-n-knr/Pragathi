'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HomeScene from '../../components/scenes/HomeScene';
import Footer from '../../components/Footer';

// Detect API base: in dev, Next.js proxies PHP via XAMPP at root;
// in static export hosted on XAMPP the files sit at /api/*.php
const API_BASE = '/api';

export default function ContactPage() {
  const scrollProgress = useRef(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pillar: 'Construction',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    // ── Request geolocation ──
    let locationData = { latitude: null, longitude: null, error: 'Not requested' };
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0
          })
        );
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null
        };
      } else {
        locationData.error = 'Geolocation not supported';
      }
    } catch (err) {
      locationData.error = err.message || 'Permission denied';
    }

    const payload = { ...formData, location: locationData };

    try {
      const response = await fetch(`${API_BASE}/submit-lead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', phone: '', pillar: 'Construction', message: '' });
      } else {
        throw new Error(result.message || 'Server error occurred');
      }
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message || 'Failed to submit.' });
    }
  };

  return (
    <div
      id="contact-root"
      className="w-full relative min-h-screen text-[#424242] bg-transparent flex flex-col"
    >
      {/* ── 3D Canvas Background ── */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* ── Hero Strip ── */}
      <section
        id="contact-hero"
        data-section-name="contact-hero"
        data-track-section
        className="relative z-10 w-full flex flex-col items-center justify-center text-center pt-36 pb-16 px-6"
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.4em] mb-4 block"
          style={{ color: 'rgba(66,66,66,0.45)' }}
        >
          {'// Pillar Integration Channel'}
        </span>
        <h1
          className="font-bold text-4xl md:text-6xl xl:text-7xl uppercase leading-none tracking-tight"
          style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
        >
          ENGAGE
          <br />
          <span style={{ color: 'rgba(66,66,66,0.4)' }}>JAGATHI</span>
        </h1>
        <p
          className="mt-6 text-xs uppercase tracking-widest font-light max-w-xs"
          style={{ fontFamily: '"Outfit",sans-serif', color: 'rgba(66,66,66,0.6)' }}
        >
          Architectural Shaping & Legacy Building
        </p>
        <div className="h-[1px] w-16 mt-8" style={{ background: 'rgba(66,66,66,0.25)' }} />
      </section>

      {/* ── Contact Form Section ── */}
      <section
        id="contact-form"
        data-section-name="contact-form"
        data-track-section
        className="relative z-10 w-full flex flex-col items-center px-6 pb-32"
      >
        <div
          className="max-w-xl w-full"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(66,66,66,0.12)',
            padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,3rem)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.06)',
            borderRadius: '6px'
          }}
        >
          {status.success ? (
            /* ── Success State ── */
            <div className="text-center py-12">
              <div
                className="w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6"
                style={{
                  background: '#424242',
                  color: '#FFEA0A',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px rgba(66,66,66,0.3)'
                }}
              >
                ✓
              </div>
              <h2
                className="font-bold text-2xl uppercase mb-4"
                style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
              >
                TRANSMISSION RECEIVED
              </h2>
              <p
                className="text-sm leading-relaxed mb-10 max-w-sm mx-auto"
                style={{ fontFamily: '"Outfit",sans-serif', color: 'rgba(66,66,66,0.7)' }}
              >
                Your request has been registered. A confirmation has been sent to your inbox.
                Our advisory desk will respond within 24–48 hours.
              </p>
              <button
                onClick={() => setStatus({ submitting: false, success: false, error: null })}
                className="bg-[#424242] text-[#FFEA0A] px-10 py-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#333] transition-colors"
                data-interactive
              >
                Send Another
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                  style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Arjun Mehta"
                  style={{ fontFamily: '"Outfit",sans-serif' }}
                  className="w-full bg-white/50 border border-[#424242]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#424242] transition-colors"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                    style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={{ fontFamily: '"Outfit",sans-serif' }}
                    className="w-full bg-white/50 border border-[#424242]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#424242] transition-colors"
                  />
                </div>
                <div>
                  <label
                    className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                    style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    style={{ fontFamily: '"Outfit",sans-serif' }}
                    className="w-full bg-white/50 border border-[#424242]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#424242] transition-colors"
                  />
                </div>
              </div>

              {/* Pillar */}
              <div>
                <label
                  className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                  style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                >
                  Integration Pillar
                </label>
                <select
                  id="contact-pillar"
                  name="pillar"
                  value={formData.pillar}
                  onChange={handleChange}
                  style={{ fontFamily: '"Outfit",sans-serif' }}
                  className="w-full bg-white/50 border border-[#424242]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#424242] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Construction">Pillar 01 / Construction &amp; Land Development</option>
                  <option value="Interior">Pillar 02 / Interior Systems</option>
                  <option value="Civil Market">Pillar 03 / Civil Market</option>
                  <option value="Other">Other Advisory / Strategic Consultation</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                  style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                >
                  Transmission Brief
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Outline your architectural / strategic requirements…"
                  style={{ fontFamily: '"Outfit",sans-serif' }}
                  className="w-full bg-white/50 border border-[#424242]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#424242] transition-colors resize-none"
                />
              </div>

              {/* Error notice */}
              {status.error && (
                <div className="border text-xs p-3 font-medium uppercase tracking-wide" style={{ background: 'rgba(200,30,30,0.06)', borderColor: 'rgba(200,30,30,0.2)', color: '#b91c1c' }}>
                  ⚠ {status.error}
                </div>
              )}

              {/* Location notice */}
              <p
                className="text-[9px] uppercase tracking-widest"
                style={{ fontFamily: '"Outfit",sans-serif', color: 'rgba(66,66,66,0.45)' }}
              >
                Location will be requested on submission to verify your region.
              </p>

              <button
                type="submit"
                disabled={status.submitting}
                data-interactive
                className="w-full py-5 text-[11px] tracking-[0.25em] uppercase font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: '#424242',
                  color: '#FFEA0A',
                  fontFamily: '"Basement Grotesque","Syncopate",sans-serif'
                }}
              >
                {status.submitting ? '⟳ Verifying Location & Transmitting…' : '→ Transmit Message'}
              </button>
            </form>
          )}
        </div>

        {/* ── Contact Details Strip ── */}
        <div
          className="max-w-xl w-full mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { label: 'Email', value: 'info@jagathi.co' },
            { label: 'Pillars', value: 'Build · Secure · Curate' },
            { label: 'Advisory', value: '24–48h Response' }
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(66,66,66,0.1)',
                padding: '1.2rem 1rem',
                borderRadius: '4px'
              }}
            >
              <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'rgba(66,66,66,0.5)', fontFamily: '"Outfit",sans-serif' }}>{item.label}</p>
              <p className="text-[11px] font-bold" style={{ fontFamily: '"Outfit",sans-serif' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
