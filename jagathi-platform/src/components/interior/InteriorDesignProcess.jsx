'use client';

import React from 'react';

export default function InteriorDesignProcess() {
  const processStages = [
    {
      num: '01',
      title: 'Concept & Brief',
      desc: 'Client brief translation into spatial mood boards, material palettes, and layout studies. We define the language before we lift a tool.',
      image: '/assets/images/interior/concept.webp'
    },
    {
      num: '02',
      title: 'Material Selection',
      desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our curated materials library — every sample approved in-person.',
      image: '/assets/images/interior/swatches.webp'
    },
    {
      num: '03',
      title: 'In-house Fabrication',
      desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication center — no third-party delays.',
      image: '/assets/images/interior/fabrication.webp'
    },
    {
      num: '04',
      title: 'Delivery & Fitting',
      desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations to zero-punch-list handover.',
      image: '/assets/images/interior/penthouse.webp'
    }
  ];

  return (
    <section
      id="design-process-stack"
      className="bg-[#1b1c1e] text-white w-full relative z-10"
      style={{
        padding: '10rem 1.5rem 0 1.5rem',
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="relative flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Header Title with spacing */}
        <div className="mb-24 text-center cr-reveal">
          <span className="text-white/40 font-mono text-[10.5px] uppercase tracking-[0.3em] block mb-4">
            // Curation Timeline
          </span>
          <h2
            className="font-bold text-3xl md:text-5xl uppercase tracking-tight text-white hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
            style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif', margin: 0 }}
          >
            OUR DESIGN PROCESS
          </h2>
        </div>

        {/* Sticky stack timeline */}
        <div className="relative w-full pb-[10vh] flex flex-col items-center" style={{ boxSizing: 'border-box' }}>
          {processStages.map((stage, i) => {
            const rowDirection = i % 2 === 1 ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row';
            return (
              <div
                key={i}
                className={`sticky top-[15vh] w-[96%] md:w-[90%] max-w-[1100px] self-center bg-[#252629] border border-white/10 rounded-none shadow-2xl overflow-hidden flex ${rowDirection} items-stretch justify-between gap-0 min-h-[480px] z-10 mb-[12vh] cr-reveal`}
                style={{ boxSizing: 'border-box' }}
              >
                
                {/* Details Column */}
                <div
                  className="p-8 md:p-14 flex flex-col justify-between items-center text-center w-full md:w-[60%] flex-shrink-0"
                  style={{ boxSizing: 'border-box' }}
                >
                  <div className="flex flex-col items-center w-full">
                    <span
                      className="text-[#FFEA0A] font-mono text-[11px] bg-white/5 border border-[#FFEA0A]/20 px-4 py-2 flex-shrink-0 tracking-widest mb-6"
                      style={{ borderRadius: '0px' }}
                    >
                      {stage.num}
                    </span>
                    <h3
                      className="font-bold text-xl md:text-2xl uppercase tracking-wide text-white mb-2 hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
                      style={{ fontFamily: '"Basement Grotesque", sans-serif', margin: '0 0 0.5rem 0' }}
                    >
                      {stage.title}
                    </h3>
                    <span className="font-mono text-[8px] tracking-[0.3em] text-[#FFEA0A] uppercase mt-2">
                      {'// INTERSPACE_0' + (i+1)}
                    </span>
                  </div>
                  
                  <p
                    className="text-white/70 font-light text-sm md:text-base leading-relaxed max-w-xl"
                    style={{ fontFamily: '"Outfit", sans-serif', margin: '2rem 0 0 0', lineHeight: '1.75' }}
                  >
                    {stage.desc}
                  </p>

                  <div className="flex justify-center mt-10 w-full border-t border-white/5 pt-5">
                    <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">
                      JAGATHI SPATIAL / QUALITY GUARANTEED
                    </span>
                  </div>
                </div>

                {/* Image Column */}
                <div className="relative w-full h-[280px] md:h-auto md:w-[40%] overflow-hidden group flex-shrink-0">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252629]/90 via-transparent to-transparent pointer-events-none" />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
