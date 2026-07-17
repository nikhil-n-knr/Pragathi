'use client';

import React from 'react';

export default function ConstructionCollaborations() {
  const projects = [
    {
      title: 'Orion Link Bridge',
      sector: 'Case 01 / Civic Infrastructure',
      spec: 'Cable-stayed steel arc · 420m span',
      year: '2026',
      image: '/assets/images/construction/bridge.webp',
      gridClass: 'lg:col-span-7',
      aspectClass: 'aspect-[4/3]'
    },
    {
      title: 'Silicon Arc Tower',
      sector: 'Case 02 / Commercial Real Estate',
      spec: 'Concrete shear core · Curtained facade',
      year: '2025',
      image: '/assets/images/construction/highrise.webp',
      gridClass: 'lg:col-span-5 lg:pt-24',
      aspectClass: 'aspect-square'
    },
    {
      title: 'Cogen Industrial',
      sector: 'Case 03 / Industrial Complex',
      spec: 'Vibration isolated · Supercooled vessel loops',
      year: '2025',
      image: '/assets/images/construction/industrial.webp',
      gridClass: 'lg:col-span-5',
      aspectClass: 'aspect-[4/5]'
    },
    {
      title: 'Concrete Pavilion',
      sector: 'Case 04 / Signature Landmarks',
      spec: 'Minimalist structural grid · Architectural concrete',
      year: '2026',
      image: '/assets/images/construction/modern_concrete_structure.png',
      gridClass: 'lg:col-span-7 lg:pl-16',
      aspectClass: 'aspect-[16/10]'
    }
  ];

  return (
    <section
      id="work"
      data-section="work"
      className="bg-[#FFEA0A] text-[#121315] w-full"
      style={{
        padding: '10rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Title Block with generous margins */}
        <div
          className="cr-reveal"
          style={{
            borderBottom: '1px solid rgba(18, 19, 21, 0.15)',
            paddingBottom: '4rem',
            marginBottom: '5rem',
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          <p
            className="font-mono tracking-widest uppercase"
            style={{ fontSize: '10.5px', color: 'rgba(18, 19, 21, 0.6)', marginBottom: '1.25rem' }}
          >
            // Selected collaborations
          </p>
          <h2
            className="hover:text-white transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
              fontWeight: '900',
              textTransform: 'uppercase',
              lineHeight: '1.02',
              margin: '0 auto 2.5rem auto',
              maxWidth: '850px'
            }}
          >
            Work with evidence.
          </h2>
          <a
            href="#project-index"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#111213] decoration-[#111213]/40 underline underline-offset-8 hover:decoration-black transition"
            style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
          >
            View project index <span>↓</span>
          </a>
        </div>

        {/* Asymmetrical Masonry Grid */}
        <div className="grid gap-x-8 gap-y-20 lg:grid-cols-12 items-start" style={{ width: '100%', boxSizing: 'border-box' }}>
          {projects.map((p, i) => (
            <div key={i} className={`${p.gridClass} w-full cr-reveal`} style={{ boxSizing: 'border-box' }}>
              <div className="group block cursor-pointer select-none">
                <div className={`relative ${p.aspectClass} overflow-hidden bg-[#121315]/10 rounded-none border border-black/5`}>
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/15" />
                  
                  {/* Details Badge */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-none bg-[#121315] px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View project <span style={{ fontSize: '11px' }}>↗</span>
                  </span>
                </div>

                {/* Grid details block with margins */}
                <div className="mt-6 flex items-start justify-between gap-5 border-t border-[#121315]/10 pt-5">
                  <div style={{ fontFamily: '"Outfit", sans-serif' }}>
                    <h3
                      className="font-bold text-lg uppercase tracking-wide text-[#121315] hover:text-white transition-colors duration-300 cursor-default"
                      style={{ fontFamily: '"Basement Grotesque", sans-serif', margin: '0 0 6px 0' }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-black/60 leading-relaxed" style={{ margin: 0 }}>
                      {p.sector}
                    </p>
                    <span className="text-[9.5px] font-mono text-black/50 uppercase tracking-widest block mt-3.5">
                      {p.spec}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-black/60 pt-1">{p.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
