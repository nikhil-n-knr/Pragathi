'use client';

import React, { useState } from 'react';

export default function ConstructionFAQ() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'When should we bring Jagathi in?',
      a: 'Ideally before final blueprints are stamped. We are most effective when integrated during early site survey planning and structural modeling stages, helping design out stresses before they hit physical layers.'
    },
    {
      q: 'Do you work with third-party architectural firms?',
      a: 'Yes. We collaborate frequently as prime structural contractors or PMUs, integrating seamlessly with founder briefs, layout planners, and custom interior teams.'
    },
    {
      q: 'Can Jagathi manage full-scale EPC contracting?',
      a: 'Yes. We provide complete Engineering, Procurement, and Construction (EPC) services, managing structural, mechanical, plumbing, and electrical contracts from foundation to handover.'
    },
    {
      q: 'What compliance certifications are provided upon handover?',
      a: 'We deliver comprehensive quality dossiers, including geotech profile reports, concrete compression test records (M50 cube tests), and final NDT (Non-Destructive Testing) compliance sign-offs.'
    }
  ];

  const handleToggle = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="bg-[#FFEA0A] text-[#121315] w-full border-b border-[#121315]/10 relative z-10 flex flex-col items-center"
      style={{
        fontFamily: '"Outfit", sans-serif',
        padding: '10rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="grid gap-16 lg:grid-cols-12 items-start" style={{ boxSizing: 'border-box' }}>
          
          {/* Centered Left Info Panel */}
          <div className="lg:col-span-5 text-center flex flex-col items-center lg:sticky lg:top-28 cr-reveal">
            <p className="text-sm font-mono tracking-widest text-[#121315]/65 uppercase mb-4">// Direct answers</p>
            <h2
              className="hover:text-white transition-colors duration-300 cursor-default"
              style={{
                fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
                fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
                fontWeight: '900',
                textTransform: 'uppercase',
                lineHeight: '1.02',
                margin: 0,
                textAlign: 'center'
              }}
            >
              Questions
              <br />
              before starting.
            </h2>
          </div>

          {/* Right Accordion List with dark borders and generous spacing */}
          <div
            className="lg:col-span-7 divide-y divide-[#121315]/15 border-t border-b border-[#121315]/15 w-full cr-reveal"
            style={{ boxSizing: 'border-box' }}
          >
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{ boxSizing: 'border-box' }}>
                  <button
                    type="button"
                    onClick={() => handleToggle(idx)}
                    className="group"
                    style={{
                      display: 'flex',
                      width: '100%',
                      minHeight: '80px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      textAlign: 'left',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#121315',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '2rem 0',
                      transition: 'color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span className="group-hover:text-white transition-colors duration-300">{faq.q}</span>
                    <span
                      className="group-hover:text-white transition-colors duration-300"
                      style={{
                        fontSize: '1.35rem',
                        color: '#121315',
                        fontWeight: 'bold',
                        transition: 'color 0.3s'
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  
                  {/* Expanded Answer with spacing */}
                  <div
                    style={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.75',
                        color: 'rgba(18, 19, 21, 0.75)',
                        paddingBottom: '2rem',
                        margin: 0,
                        maxWidth: '600px'
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
