'use client';

import React from 'react';

export default function ConstructionCapabilities() {
  const capabilities = [
    {
      num: '01',
      title: 'Civil Infrastructure',
      desc: 'Bridges, highway corridors, public transit loops, and structural arches configured to anchor public mobility with maximum load resiliency.',
      spec: 'Structural arcs · Civic links'
    },
    {
      num: '02',
      title: 'Structural Engineering',
      desc: 'BIM digital twin prototyping, isolated shear core designs, cantilever load balancing, and stress simulation prior to structural casting.',
      spec: 'BIM 3D modeling · Twin checks'
    },
    {
      num: '03',
      title: 'Industrial Complex',
      desc: 'Supercooled chemical spaces, thermodynamic piping structures, and heavy isolated turbine footing vaults built to absorb high stress forces.',
      spec: 'Vibration isolation · Heavy loops'
    },
    {
      num: '04',
      title: 'Commercial Landmarks',
      desc: 'Parametric tower core design, custom curtain wall cladding structures, and high-performance carbon-fiber wind-deflection matrices.',
      spec: 'Parametric cores · Glazing systems'
    }
  ];

  return (
    <section
      id="services"
      data-section="services"
      className="bg-[#1b1c1e] text-white w-full border-b border-white/10"
      style={{
        padding: '4rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Header block with generous padding/spacing */}
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
            What we build
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
            One team from the first geotech query to the final concrete sign-off.
          </h2>
        </div>

        {/* Capabilities Grid with explicit card gaps */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
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
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '360px',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(255, 234, 10, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.35)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {item.num}
                </span>
                <span style={{ color: '#FFEA0A', fontSize: '1.25rem', fontWeight: 'bold' }}>⌁</span>
              </div>

              <div style={{ marginTop: '4rem' }}>
                <h3
                  style={{
                    fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
                    fontSize: '1.45rem',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#ffffff',
                    margin: '0 0 1.25rem 0'
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '0.95rem',
                    lineHeight: '1.75',
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0
                  }}
                >
                  {item.desc}
                </p>
                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '9.5px',
                    color: '#FFEA0A',
                    opacity: 0.55,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    margin: '2rem 0 0 0'
                  }}
                >
                  {item.spec}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
