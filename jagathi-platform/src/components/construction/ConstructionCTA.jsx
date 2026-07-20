'use client';

import React from 'react';

export default function ConstructionCTA() {
  return (
    <section
      id="contact"
      className="bg-[#1b1c1e] text-white w-full relative z-10 flex flex-col items-center border-t border-white/10"
      style={{
        fontFamily: '"Outfit", sans-serif',
        padding: '11rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center text-center cr-reveal" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Tagline */}
        <p className="text-sm font-mono tracking-widest text-[#FFEA0A] uppercase mb-6">
          // Have a structural challenge?
        </p>

        {/* Centered Title */}
        <h2
          className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
          style={{
            fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
            fontSize: 'clamp(2.5rem, 6.2vw, 6.2rem)',
            fontWeight: '900',
            textTransform: 'uppercase',
            lineHeight: '1.02',
            margin: '0 auto 3.5rem auto',
            maxWidth: '900px',
            letterSpacing: '-0.02em',
            textAlign: 'center'
          }}
        >
          Let’s make the next landmark count.
        </h2>

        {/* Centered Button Link */}
        <a
          href="mailto:info@jagathi.co"
          className="group inline-flex min-h-16 items-center justify-center gap-3 px-10 text-base font-bold uppercase text-[#121315] bg-[#FFEA0A] hover:bg-white hover:text-[#121315] rounded-none transition-colors duration-300 shadow-xl cursor-pointer"
          style={{
            fontFamily: '"Basement Grotesque", sans-serif',
            letterSpacing: '0.15em',
            boxSizing: 'border-box'
          }}
          data-interactive
        >
          <span>info@jagathi.co</span>
          <span style={{ fontSize: '1.25rem' }}>↗</span>
        </a>

        {/* Centered Footer Metadata strip */}
        <div
          style={{
            marginTop: '5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.06em'
          }}
        >
          <span>New projects begin with a brief structural consultation.</span>
          <span className="hidden sm:inline">•</span>
          <span>Advisory replies usually arrive within 24–48 hours.</span>
        </div>

      </div>
    </section>
  );
}
