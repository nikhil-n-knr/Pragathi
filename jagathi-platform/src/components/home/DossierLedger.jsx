'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import TextDecode from './TextDecode';

const ledgerEntries = [
  {
    id: '00',
    no: '00',
    name: 'Cogen Energy Complex',
    location: 'WHITEFIELD, IN',
    year: '2024',
    coord: '13.0640° N / 80.2460° E',
    category: 'HEAVY BUILD',
    metric: '1,200T Steel · M50 Grade',
    sketch: '/assets/images/landmarks/cogen_sketch.png',
    built: '/assets/images/landmarks/cogen_finished.png',
    desc: 'From barren excavated terrain to a fully operational co-generation energy complex — thermodynamic piping loops, civil concrete grids, and structural foundation matrices.',
  },
  {
    id: '01',
    no: '01',
    name: 'Solitaire Valleys',
    location: 'NANDI FOOTHILLS, IN',
    year: '2023',
    coord: '13.0980° N / 80.2920° E',
    category: 'REAL ESTATE',
    metric: '48 Luxury Plots · 12 Acres',
    sketch: '/assets/images/landmarks/solitaire_sketch.png',
    built: '/assets/images/landmarks/solitaire_finished.png',
    desc: 'Raw scrubland hillside transformed into a premium residential valley — strategic land acquisition, luxury villa typologies, and municipal green zones.',
  },
  {
    id: '02',
    no: '02',
    name: 'Orion Glass Villa',
    location: 'BEVERLY HILLS, CA',
    year: '2022',
    coord: '34.0736° N / 118.4004° W',
    category: 'ENGINEERING',
    metric: '82% Acoustic Seal · Fe 550',
    sketch: '/assets/images/landmarks/orion_sketch.png',
    built: '/assets/images/landmarks/orion_finished.png',
    desc: 'Exposed steel skeleton raised into a suspended lattice-core glass villa — genetic structural shear mapping, cantilevered volumes, and double-glazed extensions.',
  },
  {
    id: '03',
    no: '03',
    name: 'Calacatta Penthouse',
    location: 'ASPEN HEIGHTS, CO',
    year: '2021',
    coord: '39.1911° N / 106.8175° W',
    category: 'CURATION',
    metric: '100% Structural Sign-off',
    sketch: '/assets/images/landmarks/calacatta_sketch.png',
    built: '/assets/images/landmarks/calacatta_finished.png',
    desc: 'Bare concrete shell elevated to an ultra-high-net-worth turnkey residence — Italian Calacatta stone surfaces, smoked oak joinery, and brass hardware.',
  },
  {
    id: '04',
    no: '04',
    name: 'Monolith Spatial Core',
    location: 'BENGALURU, IN',
    year: '2025',
    coord: '12.9716° N / 77.5946° E',
    category: 'ARCHITECTURE',
    metric: '12 Floors · Grade M60',
    sketch: '/assets/images/landmarks/monolith_sketch.png',
    built: '/assets/images/white_renders/white_render_spatial_1.webp',
    desc: 'A brutalist concrete monolith reimagined as a premium spatial core — raw aggregate surfaces, void atrium geometry, and precision-engineered floor plates.',
  },
];

export default function DossierLedger() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef(null);

  // Dual image buffer references for wipe transition
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const currentBufferRef = useRef('A');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll('.ledger-reveal'),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  const handleRowHover = (idx) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);

    const nextEntry = ledgerEntries[idx];
    const front = currentBufferRef.current === 'A' ? imgARef.current : imgBRef.current;
    const back = currentBufferRef.current === 'A' ? imgBRef.current : imgARef.current;

    if (!front || !back) return;

    back.src = nextEntry.built;
    gsap.set(back, { clipPath: 'inset(0 0 100% 0)', zIndex: 2, filter: 'grayscale(1)' });
    gsap.set(front, { zIndex: 1 });

    gsap.to(back, {
      clipPath: 'inset(0 0 0% 0)',
      filter: 'grayscale(0) contrast(1.05)',
      duration: 0.7,
      ease: 'expo.out',
      onComplete: () => {
        currentBufferRef.current = currentBufferRef.current === 'A' ? 'B' : 'A';
      },
    });
  };

  const active = ledgerEntries[activeIdx];

  return (
    <section
      ref={containerRef}
      id="ledger"
      className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-12 py-16 md:py-24 text-white"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#FFEA0A]/20 pb-6 gap-4">
        <div>
          <span className="ledger-reveal font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold block mb-2">
            {'// THE DOSSIER LEDGER'}
          </span>
          <h2 className="ledger-reveal text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
            Filed Landmark Assets
          </h2>
        </div>
        <span className="ledger-reveal font-mono text-xs text-gray-400 uppercase tracking-widest">
          SORTED BY LATITUDE & CATEGORY
        </span>
      </div>

      {/* Grid: Left List + Right Dual-Buffer Wiping Preview Plate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Rows */}
        <div className="lg:col-span-6 flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
          {ledgerEntries.map((entry, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={entry.id}
                onClick={() => handleRowHover(idx)}
                onMouseEnter={() => handleRowHover(idx)}
                className={`ledger-reveal w-full text-left py-5 px-4 flex items-center justify-between transition-all duration-300 group ${
                  isSelected
                    ? 'bg-[#FFEA0A] text-[#121315] font-bold translate-x-2'
                    : 'bg-transparent text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-xs font-bold tracking-widest ${
                      isSelected ? 'text-[#121315]' : 'text-[#FFEA0A]'
                    }`}
                  >
                    {entry.no}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-wide leading-snug">
                      {entry.name}
                    </h3>
                    <span
                      className={`text-[10px] font-mono tracking-widest block uppercase ${
                        isSelected ? 'text-[#121315]/80' : 'text-gray-400'
                      }`}
                    >
                      {entry.location} · {entry.year}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono text-[9px] uppercase px-2 py-1 border border-current tracking-widest ${
                      isSelected ? 'border-[#121315] text-[#121315]' : 'border-[#FFEA0A]/30 text-[#FFEA0A]'
                    }`}
                  >
                    {entry.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Preview Plate (Dual Buffer Clip-Path Wipe) */}
        <div className="lg:col-span-6 sticky top-24 bg-[#121315] border border-[#FFEA0A]/30 p-6 md:p-8 flex flex-col gap-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          {/* Top metadata with live text decode */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="font-mono text-xs text-[#FFEA0A] font-bold tracking-widest uppercase">
              {`// DOSSIER NO. ${active.no}`}
            </span>
            <TextDecode
              key={active.coord}
              text={active.coord}
              className="text-[10px] text-gray-300 tracking-widest uppercase font-bold"
            />
          </div>

          {/* Dual Buffer Photo Plate */}
          <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden border border-white/10">
            <img
              ref={imgARef}
              src={ledgerEntries[0].built}
              alt="Plate Buffer A"
              className="absolute inset-0 w-full h-full object-cover block will-change-transform"
            />
            <img
              ref={imgBRef}
              src={ledgerEntries[1].built}
              alt="Plate Buffer B"
              className="absolute inset-0 w-full h-full object-cover block will-change-transform"
              style={{ clipPath: 'inset(0 0 100% 0)' }}
            />
            <div className="absolute bottom-3 left-3 bg-[#FFEA0A] text-black font-mono text-[9px] font-bold px-3 py-1 tracking-widest uppercase shadow-md">
              LIVE FILED PLATE
            </div>
          </div>

          {/* Description & metrics */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xl font-black uppercase text-white tracking-wide">
              {active.name}
            </h4>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
              {active.desc}
            </p>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-[#FFEA0A] font-mono font-bold tracking-wider">
                {active.metric}
              </span>
              <span className="text-gray-400 font-mono text-[10px] uppercase">
                {active.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
