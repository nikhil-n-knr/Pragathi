'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const dispatches = [
  {
    no: 'DISPATCH 01',
    date: '24.11.2025',
    coord: '13.0640° N / 80.2460° E',
    title: 'Thermodynamic Piping & Core Grid at Cogen',
    text: 'Eleven hundred metric tons of structural reinforcement laid over high-density aggregate foundations. Seamless integration of high-pressure steam loops delivered within strict industrial tolerances.',
    img: '/assets/images/landmarks/cogen_finished.png',
    tag: 'HEAVY CIVIL',
  },
  {
    no: 'DISPATCH 02',
    date: '18.08.2025',
    coord: '13.0980° N / 80.2920° E',
    title: 'Hillside Terracing & Contour Drainage at Solitaire',
    text: 'Transforming 12 acres of steep terrain into 48 luxury residential plot typologies. Complete municipal water line integration, subterranean drainage networks, and asphalt access arterial corridors.',
    img: '/assets/images/landmarks/solitaire_finished.png',
    tag: 'LAND DEVELOPMENT',
  },
  {
    no: 'DISPATCH 03',
    date: '05.04.2025',
    coord: '34.0736° N / 118.4004° W',
    title: 'Suspended Lattice & Cantilever Alignment at Orion',
    text: 'Precision acoustic glass installation with structural Fe 550 shear walls. Achieving an 82% acoustic isolation rating across double-glazed curtain extensions suspended over hillside terrain.',
    img: '/assets/images/landmarks/orion_finished.png',
    tag: 'STRUCTURAL ARCS',
  },
];

export default function FieldDispatches() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll('.dispatch-card'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="dispatches"
      className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-12 py-16 md:py-24 text-white"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#FFEA0A]/20 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold block mb-2">
            {'// FIELD DISPATCHES & EXECUTION PROVENANCE'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
            Filed En Route
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
          LOGGED BY PROJECT ENGINEERS
        </span>
      </div>

      {/* Cards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dispatches.map((item, idx) => (
          <article
            key={idx}
            className="dispatch-card bg-[#121315] border border-white/10 p-6 flex flex-col justify-between hover:border-[#FFEA0A] transition-all duration-300 group shadow-lg"
          >
            <div>
              {/* Media */}
              <div className="w-full h-[200px] overflow-hidden mb-6 relative border border-white/10">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#FFEA0A] text-black font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                  {item.tag}
                </span>
              </div>

              {/* Meta */}
              <div className="flex justify-between items-center font-mono text-[10px] text-[#FFEA0A] mb-3">
                <span className="font-bold">{item.no}</span>
                <span className="text-gray-400">{item.date}</span>
              </div>

              {/* Title & Text */}
              <h3 className="text-lg font-black uppercase text-white tracking-wide mb-3 leading-snug group-hover:text-[#FFEA0A] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed font-light mb-6">
                {item.text}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center font-mono text-[9px] text-gray-500 uppercase">
              <span>{item.coord}</span>
              <span className="text-[#FFEA0A] group-hover:translate-x-1 transition-transform">
                DETAILS →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
