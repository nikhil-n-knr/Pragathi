'use client';

import React from 'react';

export default function CivilWaysToWork() {
  return (
    <section
      id="engagement"
      className="bg-[#1b1c1e] text-white w-full border-b border-white/10"
      style={{
        padding: '4rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center" style={{ boxSizing: 'border-box' }}>
        
        {/* Centered Top Info Panel */}
        <div className="text-center flex flex-col items-center cr-reveal mb-16">
          <p className="text-sm font-mono tracking-widest text-[#FFEA0A] uppercase mb-4">// Investment pathways</p>
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
          {/* Card 1: Outlined Joint Development */}
          <article
            style={{
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '0px',
              padding: '3rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              boxSizing: 'border-box'
            }}
          >
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-6">
                Portfolio Curation
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
                Joint Development
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
                Partner with us to engineer high-yield plotting layouts on raw land holdings. We provide statutory clearances and engineering networks, splitting asset returns.
              </p>
            </div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '9.5px',
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '2.5rem 0 0 0'
              }}
            >
              Capital co-investment
            </p>
          </article>

          {/* Card 2: Solid Yellow Outright Acquisition */}
          <article
            style={{
              backgroundColor: '#FFEA0A',
              border: '1px solid #FFEA0A',
              borderRadius: '0px',
              padding: '3rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              color: '#121315',
              boxSizing: 'border-box'
            }}
          >
            <div>
              <span className="text-[10px] font-mono text-[#121315]/65 uppercase tracking-widest block mb-6">
                Direct ownership
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
                Outright Purchase
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
                Acquire fully-audited, pre-cleared, utility-connected residential or industrial smart plots for immediate development or asset yield positioning.
              </p>
            </div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '9.5px',
                color: 'rgba(18, 19, 21, 0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '2.5rem 0 0 0'
              }}
            >
              Direct asset transfer
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
