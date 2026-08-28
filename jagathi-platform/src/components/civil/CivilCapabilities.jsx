'use client';

import React from 'react';

export default function CivilCapabilities() {
  const capabilities = [
    {
      title: 'Premium Residential',
      tag: '[ RESIDENTIAL ]',
      desc: 'Clear titles, perimeter boundary Retaining walls, municipal approval. Cleared for immediate villa or estate construct.'
    },
    {
      title: 'Industrial Smart Zone',
      tag: '[ INDUSTRIAL ]',
      desc: 'Warehouse-ready plots with grid water, wide logistics roads, environmental permits. Built for smart cogen operations.'
    },
    {
      title: 'Commercial Corridor',
      tag: '[ COMMERCIAL ]',
      desc: 'High ROI arterial road plots. Environmentally audited and pre-zoned for multi-story mixed-use structures.'
    }
  ];

  return (
    <section
      id="sectors"
      data-section="sectors"
      className="bg-[#1b1c1e] text-white w-full border-b border-white/10"
      style={{
        padding: '4rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Header block */}
        <div
          className="cr-reveal"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '4.5rem',
            marginBottom: '5rem',
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: '0.9rem',
              color: '#FFEA0A',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 0 1.5rem 0'
            }}
          >
            Zoning Sectors
          </p>
          <h2
            className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.75rem, 3.8vw, 3.8rem)',
              fontWeight: '400',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 auto',
              maxWidth: '900px'
            }}
          >
            Audited land assets pre-vetted for institutional and custom development.
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: '3rem',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {capabilities.map((item, i) => (
            <article
              key={i}
              className="group cr-reveal"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0px',
                padding: '3rem 2.25rem',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.45)',
                    letterSpacing: '0.15em',
                    display: 'block',
                    marginBottom: '2rem'
                  }}
                >
                  {item.tag}
                </span>
                <h3
                  className="group-hover:text-[#FFEA0A] transition-colors duration-300"
                  style={{
                    fontFamily: '"Basement Grotesque", sans-serif',
                    fontSize: '1.45rem',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    margin: '0 0 1.25rem 0',
                    color: '#ffffff'
                  }}
                >
                  {item.title}
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
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
