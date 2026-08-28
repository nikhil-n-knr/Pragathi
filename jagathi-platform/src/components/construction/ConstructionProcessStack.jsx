'use client';

import React from 'react';

export default function ConstructionProcessStack() {
  const steps = [
    {
      num: '01',
      title: 'Geotechnical Survey & Load Matrix',
      desc: 'Executing core drilling scans, hydrological stress tests, and seismic vector mapping before laying foundation piles.',
      image: '/assets/images/landmarks/cogen_sketch.png'
    },
    {
      num: '02',
      title: 'BIM Prototyping & Twin Simulations',
      desc: 'Constructing 3D digital twins to simulate seismic shears, load redistributions, and MEP layout routing in digital space.',
      image: '/assets/images/white_renders/construction_3d_main.webp'
    },
    {
      num: '03',
      title: 'NDT Verification & Handover Audits',
      desc: 'Performing Non-Destructive Testing on concrete pours, logging compressive shear strengths, and delivering a zero-punch-list handoff file.',
      image: '/assets/images/white_renders/white_render_building_1.webp'
    }
  ];

  return (
    <section
      id="process-stack"
      className="bg-[#1b1c1e] text-white w-full relative z-10"
      style={{
        padding: '4rem 1.5rem',
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="relative flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Header Title */}
        <div className="mb-16 text-center cr-reveal">
          <span className="text-[#FFEA0A] font-mono text-[10.5px] uppercase tracking-[0.3em] block mb-4 font-bold">
            // Engineering Execution Matrix
          </span>
          <h2
            className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Basement Grotesque", "Syncopate", sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              fontWeight: '900',
              textTransform: 'uppercase',
              lineHeight: '1.02'
            }}
          >
            EXECUTION PROCESS STACK.
          </h2>
        </div>

        {/* 3 Process Cards with Landmarks White Architectural Sketches */}
        <div className="w-full flex flex-col gap-16">
          {steps.map((stage, idx) => (
            <div
              key={idx}
              className="cr-reveal grid lg:grid-cols-12 gap-8 items-center bg-[#121315] border border-[#FFEA0A]/20 p-8 sm:p-10 shadow-2xl hover:border-[#FFEA0A]/60 transition-all duration-300 group"
            >
              {/* Left Info Column */}
              <div className="lg:col-span-6 flex flex-col justify-center gap-4">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#FFEA0A]">
                  {stage.num}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white group-hover:text-[#FFEA0A] transition-colors duration-300 font-basement">
                  {stage.title}
                </h3>
                <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  {stage.desc}
                </p>
              </div>

              {/* Right Architectural Line Sketch Drawing Frame */}
              <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden bg-white border border-white/20 shadow-inner">
                <img
                  src={stage.image}
                  alt={`${stage.title} Engineering CAD Sketch`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ filter: 'brightness(0.98) contrast(1.05)' }}
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono text-[#FFEA0A] border border-[#FFEA0A]/30">
                  LANDMARKS ARCHITECTURAL SKETCH
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
