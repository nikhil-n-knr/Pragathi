'use client';

import React, { useState } from 'react';

export default function ConstructionProcessAccordion() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Geotechnical Survey & Stress Mapping',
      desc: 'We map the geotechnical load matrices, execute core drilling scans, and audit hydrological pressures before defining structural bounds.',
      output: 'Output: Geotechnical stress report & site load matrix'
    },
    {
      num: '02',
      title: 'BIM Prototyping & Twin Simulations',
      desc: 'We construct 3D digital twins to simulate seismic shears, load redistributions, and MEP layout routing in digital space to eliminate physical rework.',
      output: 'Output: Digital twin BIM model & structural schema'
    },
    {
      num: '03',
      title: 'NDT Verification & Handover Audits',
      desc: 'We perform Non-Destructive Testing on concrete pours, log compressive shear strengths, and deliver a zero-punch-list handoff file.',
      output: 'Output: NDT certifications & compressive log dossier'
    }
  ];

  return (
    <section
      id="process"
      data-section="process"
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
              // How we work
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
              Clear stages.
              <br />
              Fewer surprises.
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
              Senior structural engineers stay close throughout. Decisions are logged, audits are systematic, and every milestone delivers concrete evidence.
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
              Ask about our approach <span>↗</span>
            </a>
          </div>

          {/* Right Accordion Column with dark divider lines */}
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
                      
                      {/* Expanded Section */}
                      <div
                        style={{
                          height: isOpen ? 'auto' : 0,
                          opacity: isOpen ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <p
                          style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.95rem',
                            lineHeight: '1.7',
                            color: 'rgba(18, 19, 21, 0.75)',
                            marginTop: '1.25rem',
                            marginBottom: '1rem',
                            maxWidth: '580px'
                          }}
                        >
                          {step.desc}
                        </p>
                        <p
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '10px',
                            color: 'rgba(18, 19, 21, 0.55)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            margin: 0
                          }}
                        >
                          {step.output}
                        </p>
                      </div>
                    </div>

                    {/* Icon indicator */}
                    <span
                      style={{
                        fontSize: '1.35rem',
                        color: '#121315',
                        fontWeight: 'bold',
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
