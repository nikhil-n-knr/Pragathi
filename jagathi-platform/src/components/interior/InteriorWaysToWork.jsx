'use client';

import React from 'react';

export default function InteriorWaysToWork() {
  return (
    <section
      id="engagement"
      className="bg-[#1b1c1e] text-white w-full border-b border-white/10"
      style={{
        padding: '10rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Top Info Panel */}
        <div className="text-center flex flex-col items-center cr-reveal mb-16">
          <p className="text-sm font-mono tracking-widest text-[#FFEA0A] uppercase mb-4">// Engagement structures</p>
          <h2
            className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
              fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
              fontWeight: '900',
              textTransform: 'uppercase',
              lineHeight: '1.02',
              margin: '0 0 2rem 0',
              textAlign: 'center'
            }}
          >
            Built around
            <br />
            the moment you’re in.
          </h2>
        </div>

        {/* Center-aligned Dual Cards */}
        <div className="grid gap-8 sm:grid-cols-2 w-full max-w-4xl cr-reveal" style={{ boxSizing: 'border-box' }}>
          {/* Card 1: Outlined Strategic Curation */}
          <article
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '0px',
              padding: '3rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '340px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              boxSizing: 'border-box'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-6">
                Bespoke Consultation
              </span>
              <h3
                className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
                style={{
                  fontFamily: '"Basement Grotesque", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 1.25rem 0',
                  color: '#ffffff'
                }}
              >
                Concept Design
              </h3>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: '1.75',
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0
                }}
              >
                Full architectural mood boarding, layout mapping, and texture rendering. We establish the design syntax for your own fitting team to execute.
              </p>
            </div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '9.5px',
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '2.5rem 0 0 0',
                textAlign: 'center'
              }}
            >
              Typically 6–8 weeks
            </p>
          </article>

          {/* Card 2: Solid Yellow Design-Build */}
          <article
            style={{
              backgroundColor: '#FFEA0A',
              border: '1px solid #FFEA0A',
              borderRadius: '0px',
              padding: '3rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '340px',
              color: '#121315',
              boxSizing: 'border-box'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-[#121315]/65 uppercase tracking-widest block mb-6">
                End-To-End Delivery
              </span>
              <h3
                className="hover:text-white transition-colors duration-300 cursor-default"
                style={{
                  fontFamily: '"Basement Grotesque", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 1.25rem 0',
                  color: '#121315'
                }}
              >
                Turnkey Fitting
              </h3>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: '1.75',
                  color: 'rgba(18, 19, 21, 0.75)',
                  margin: 0
                }}
              >
                Complete design, material acquisition, CNC carpentry fabrication, and assembly. Handed over with zero punch list items.
              </p>
            </div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '9.5px',
                color: 'rgba(18, 19, 21, 0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '2.5rem 0 0 0',
                textAlign: 'center'
              }}
            >
              Comprehensive integration
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
