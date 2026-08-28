'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function InteriorHero() {
  return (
    <section
      id="home"
      data-section="home"
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-center items-center text-center z-10 text-white px-4 sm:px-8 md:px-10 py-16 box-border"
      style={{
        backgroundColor: '#0D0E10',
      }}
    >
      {/* Background image: Luminous White CAD Interior Sketch on Deep Dark Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/sketches/dark_sketch_interior.png"
          alt="Interior architectural CAD sketch"
          className="w-full h-full object-cover object-center scale-105"
          decoding="async"
          style={{ opacity: 0.35, filter: 'contrast(1.15) brightness(1.05)' }}
        />
        {/* Soft Vignette Overlay for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0D0E10]/70 to-[#0D0E10]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-transparent to-[#0D0E10]/80" />
      </div>

      <div
        className="relative z-10 w-full max-w-[1140px] mx-auto flex flex-col items-center justify-center text-center my-auto"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#FFEA0A] font-bold block"
          style={{
            fontSize: 'clamp(10px, 1.2vw, 12px)',
            marginBottom: '1.5rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)'
          }}
        >
          // Pillar 02 / Spatial Solutions &amp; Curation
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-bold uppercase leading-[1.05] tracking-tighter text-white hover:text-[#FFEA0A] transition-colors duration-300 cursor-default select-text"
          style={{
            fontFamily: '"Basement Grotesque", "Syncopate", sans-serif',
            fontSize: 'clamp(2.0rem, 5.8vw, 5.5rem)',
            maxWidth: '1000px',
            marginBottom: '1.75rem',
            textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.8)'
          }}
        >
          Turnkey Interior &amp; Spatial Architecture.
        </motion.h1>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-200 font-light leading-relaxed uppercase tracking-wider px-2 sm:px-0 select-text"
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            maxWidth: '640px',
            marginBottom: '2.5rem',
            textShadow: '0 2px 15px rgba(0,0,0,0.95)'
          }}
        >
          Every square inch curated seamlessly — from technical layout drafting to custom acoustic millwork, marble surfaces, and museum lighting.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <a
            href="#capabilities"
            className="inline-flex items-center gap-3 bg-[#FFEA0A] text-[#121315] hover:bg-white hover:text-[#121315] font-mono text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] px-6 sm:px-8 py-3.5 sm:py-4 border border-[#FFEA0A]/30 shadow-2xl transition-all duration-300"
          >
            Explore Spatial Design <span>↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
