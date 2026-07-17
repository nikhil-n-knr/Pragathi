'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ConstructionHero() {
  return (
    <section
      id="home"
      data-section="home"
      className="relative w-full overflow-hidden flex flex-col justify-center items-center z-10 text-white"
      style={{
        backgroundColor: '#1b1c1e',
        padding: '12rem 1.5rem 10rem 1.5rem',
        boxSizing: 'border-box',
        minHeight: '90vh'
      }}
    >
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/construction/bridge.webp"
          alt="Heavy structural links"
          className="w-full h-full object-cover object-center"
          decoding="async"
          style={{ filter: 'brightness(0.24) saturate(0.5)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #1b1c1e 0%, rgba(27,28,30,0.4) 60%, #1b1c1e 100%)'
          }}
        />
      </div>

      <div
        className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center text-center"
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
          // Pillar 01 / Infrastructure
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-bold uppercase leading-[1.02] tracking-tighter hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
          style={{
            fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
            fontSize: 'clamp(2.5rem, 6.2vw, 6.2rem)',
            letterSpacing: '-0.02em',
            margin: '0 0 2.5rem 0',
            maxWidth: '1000px'
          }}
        >
          We build landmarks
          <br />
          impossible to ignore.
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
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '0 0 3.5rem 0',
              textAlign: 'center'
            }}
          >
            Strategy, structural engineering, BIM digital twin testing, and zero-compromise site execution for high-stakes landmarks.
          </motion.p>

          {/* Centered Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
            style={{ boxSizing: 'border-box' }}
          >
            <a
              href="#work"
              className="group inline-flex min-h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-none px-8 text-xs font-bold uppercase transition-all shadow-md cursor-pointer text-[#121315]"
              style={{
                backgroundColor: '#FFEA0A',
                fontFamily: '"Basement Grotesque", sans-serif',
                letterSpacing: '0.15em',
                transition: 'all 0.3s ease'
              }}
            >
              Explore selected work <span>↓</span>
            </a>
            <a
              href="/contact"
              className="inline-flex min-h-14 w-full sm:w-auto items-center justify-center rounded-none border border-white/40 px-8 text-xs font-bold uppercase text-white hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
              style={{
                fontFamily: '"Basement Grotesque", sans-serif',
                letterSpacing: '0.15em'
              }}
            >
              Discuss a brief
            </a>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '9.5px',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.45)',
            marginTop: '5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            width: '100%',
            letterSpacing: '0.15em'
          }}
        >
          <a
            href="#proof"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            className="hover:text-[#FFEA0A]"
          >
            Scroll to discover <span>↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
