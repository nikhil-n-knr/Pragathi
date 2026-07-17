'use client';

import React from 'react';

export default function CivilCTA() {
  return (
    <section
      className="bg-[#1b1c1e] text-white w-full relative z-10"
      style={{
        padding: '10rem 1.5rem',
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="flex flex-col items-center text-center cr-reveal" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Tagline */}
        <p className="text-sm font-mono tracking-widest text-[#FFEA0A] uppercase mb-6">
          // Have a land holding challenge?
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

        {/* Action Button Stack */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
          <a
            href="/contact"
            className="inline-flex min-h-14 items-center justify-center bg-[#FFEA0A] text-[#121315] hover:bg-white transition-all px-10 text-xs font-bold uppercase tracking-[0.2em] rounded-none border-none shadow-lg cursor-pointer"
            style={{ fontFamily: '"Basement Grotesque", sans-serif', width: '100%' }}
          >
            Consult plot advisor <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
