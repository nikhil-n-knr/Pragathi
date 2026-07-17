'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CivilHero() {
  return (
    <section
      className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center z-10 border-b border-white/10"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/civil/residential.webp"
          alt="Plotted land development"
          className="w-full h-full object-cover object-center"
          decoding="async"
          style={{ filter: 'brightness(0.3) saturate(0.65)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #1b1c1e 0%, rgba(27,28,30,0.3) 60%, #1b1c1e 100%)'
          }}
        />
      </div>

      <div
        className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center text-center px-6"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-mono uppercase tracking-[0.4em] text-[#FFEA0A] block"
          style={{
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            marginBottom: '2rem'
          }}
        >
          // Pillar 03 / Land & Civil Market
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-bold uppercase leading-[1.02] tracking-tighter hover:text-[#FFEA0A] transition-colors duration-300 cursor-default text-white"
          style={{
            fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
            fontSize: 'clamp(2.5rem, 6.2vw, 6.2rem)',
            letterSpacing: '-0.02em',
            margin: '0 0 2.5rem 0',
            maxWidth: '1000px'
          }}
        >
          SECURED LAND ASSETS
        </motion.h1>

        {/* Description & CTAs in Center-Aligned vertical stack with generous spacing */}
        <div className="flex flex-col items-center w-full max-w-2xl mt-4">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
              fontWeight: '300',
              lineHeight: '1.75',
              color: 'rgba(255, 255, 255, 0.75)',
              margin: '0 0 3.5rem 0',
              textAlign: 'center'
            }}
          >
            Clear titles, transit-linked perimeters, and dynamic infrastructure. We source, audit, and engineer high-yield plotted land portfolios cleared for immediate execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full"
            style={{ boxSizing: 'border-box' }}
          >
            <a
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center bg-[#FFEA0A] text-[#121315] hover:bg-white transition-all px-10 text-xs font-bold uppercase tracking-[0.2em] rounded-none border-none shadow-lg cursor-pointer"
              style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
            >
              Enquire plots <span>→</span>
            </a>
            <a
              href="#sectors"
              className="inline-flex min-h-14 items-center justify-center border border-white/20 text-white hover:bg-white/5 transition-all px-10 text-xs font-bold uppercase tracking-[0.2em] rounded-none cursor-pointer"
              style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
            >
              View sectors <span>↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
