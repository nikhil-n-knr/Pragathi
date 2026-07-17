'use client';

import React, { useState } from 'react';

export default function InteriorProcessAccordion() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Layout & Circulation Logic',
      desc: 'Analyzing functional zones, movement vectors, and sightlines to maximize ergonomics and spatial flow.'
    },
    {
      num: '02',
      title: 'Material Lab Curation',
      desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our physical materials lab.'
    },
    {
      num: '03',
      title: 'CNC Carpentry Fabrication',
      desc: 'Precision carpentry, cladding preparation, and customized light fittings built in our dedicated fabrication centers.'
    }
  ];

  return (
    <section
      id="process-accordion"
      className="bg-[#FFEA0A] text-[#121315] w-full border-t border-b border-[#121315]/10"
      style={{
        padding: '10rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="grid gap-16 lg:grid-cols-12 items-start" style={{ boxSizing: 'border-box' }}>
          
          {/* Centered Left Info Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 text-center flex flex-col items-center cr-reveal">
            <p
              className="text-sm font-mono tracking-widest uppercase mb-4"
              style={{ color: 'rgba(18, 19, 21, 0.65)' }}
            >
              // Curation Process
            </p>
            <h2
              className="hover:text-white transition-colors duration-300 cursor-default"
              style={{
                fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
                fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
                fontWeight: '900',
                textTransform: 'uppercase',
                lineHeight: '1.02',
                margin: '0 0 2rem 0',
                textAlign: 'center'
              }}
            >
              Rigorous Execution.
              <br />
              Zero Surprises.
            </h2>
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '1rem',
                lineHeight: '1.7',
                color: 'rgba(18, 19, 21, 0.75)',
                margin: '0 0 2.5rem 0',
                maxWidth: '420px',
                textAlign: 'center'
              }}
            >
              From custom joinery alignment to final surface curations — one single point of contact managing the entire layout lifecycle.
            </p>
            <a
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center gap-2 px-8 text-xs font-bold uppercase transition-all bg-[#121315] text-white hover:bg-white hover:text-[#121315] rounded-none cursor-pointer border-none shadow-md"
              style={{
                fontFamily: '"Basement Grotesque", sans-serif',
                letterSpacing: '0.15em',
                transition: 'all 0.3s ease'
              }}
            >
              Ask about turnkey fits <span>↗</span>
            </a>
          </div>

          {/* Right Accordion Column */}
          <div
            className="lg:col-span-7 divide-y divide-[#121315]/15 border-t border-b border-[#121315]/15 w-full cr-reveal"
            style={{ boxSizing: 'border-box' }}
          >
            {steps.map((step, idx) => {
              const isOpen = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(isOpen ? -1 : idx)}
                  className="w-full py-8 text-left focus:outline-none block transition-colors duration-300 relative group cursor-pointer border-none bg-transparent"
                  style={{ boxSizing: 'border-box' }}
                >
                  <div className="grid gap-5 sm:grid-cols-[4rem_1fr_auto] sm:items-start text-[#121315]">
                    {/* Number */}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: isOpen ? '#121315' : 'rgba(18, 19, 21, 0.55)',
                        fontWeight: isOpen ? 'bold' : 'normal',
                        transition: 'color 0.3s'
                      }}
                    >
                      {step.num}
                    </span>

                    {/* Content */}
                    <div>
                      <h3
                        className="group-hover:text-white transition-colors duration-300"
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '1.45rem',
                          fontWeight: '600',
                          letterSpacing: '-0.01em',
                          margin: 0,
                          color: '#121315',
                          transition: 'color 0.3s'
                        }}
                      >
                        {step.title}
                      </h3>
                      
                      <div
                        style={{
                          gridColumn: '2',
                          maxHeight: isOpen ? '160px' : '0px',
                          overflow: 'hidden',
                          transition: 'max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                          marginTop: isOpen ? '1.25rem' : '0'
                        }}
                      >
                        <p
                          style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.95rem',
                            lineHeight: '1.65',
                            color: 'rgba(18, 19, 21, 0.75)',
                            margin: 0
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Plus/Minus Sign */}
                    <span
                      className="group-hover:text-white transition-colors duration-300"
                      style={{
                        fontSize: '1.5rem',
                        lineHeight: '1',
                        color: isOpen ? '#121315' : 'rgba(18, 19, 21, 0.6)',
                        transition: 'color 0.3s'
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
