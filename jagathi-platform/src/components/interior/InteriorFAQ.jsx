'use client';

import React, { useState } from 'react';

export default function InteriorFAQ() {
  const [activeFaq, setActiveFaq] = useState(-1);

  const faqs = [
    {
      q: 'Do you manage execution or just design concept?',
      a: 'We handle both. We offer a Concept Design tier (deliverables include layout matrices, structural blueprints, material specs) and a full Turnkey Fitting tier where our in-house teams construct, fabricate, and install the complete space.'
    },
    {
      q: 'How long does a premium penthouse fit-out typically take?',
      a: 'A bespoke high-end residential fit-out averages 14–20 weeks, depending on custom joinery volume, stone fabrication timelines, and structural wall removals.'
    },
    {
      q: 'Are all carpentry elements fabricated in-house?',
      a: 'Yes. All millwork, wood stained paneling, and custom fittings are crafted inside our dedicated CNC carpentry fabrication center to guarantee tolerances and eliminate third-party delays.'
    }
  ];

  const handleToggle = (idx) => {
    setActiveFaq(activeFaq === idx ? -1 : idx);
  };

  return (
    <section
      id="faq"
      className="bg-[#FFEA0A] text-[#121315] w-full"
      style={{
        padding: '4rem 1.5rem',
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

          {/* Right Accordion List */}
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

                  {/* Expanded Answer with CSS Transition */}
                  <div
                    style={{
                      maxHeight: isOpen ? '250px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: '1.75',
                        color: 'rgba(18, 19, 21, 0.75)',
                        paddingBottom: '2rem',
                        margin: 0
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
