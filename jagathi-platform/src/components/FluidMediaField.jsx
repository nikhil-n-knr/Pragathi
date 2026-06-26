'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

function BeforeAfterSlider({ beforeImage, afterImage, title, aspect }) {
  const containerRef = useRef(null);
  const [sliderVal, setSliderVal] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const autoOscillateRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (isHovered || isDragging) {
      if (autoOscillateRef.current) {
        cancelAnimationFrame(autoOscillateRef.current);
      }
      return;
    }

    const animate = () => {
      timeRef.current += 1.2;
      // Gentle oscillate between 38% and 62%
      const val = 50 + Math.sin(timeRef.current * 0.018) * 12;
      setSliderVal(val);
      autoOscillateRef.current = requestAnimationFrame(animate);
    };

    autoOscillateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoOscillateRef.current) {
        cancelAnimationFrame(autoOscillateRef.current);
      }
    };
  }, [isHovered, isDragging]);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderVal(percentage);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize bg-zinc-900"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* Before Image (Background - full width, desaturated) */}
      <img
        src={beforeImage}
        alt={`${title} Before`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(0.65) brightness(0.75) contrast(1.1)' }}
        draggable="false"
        loading="lazy"
      />

      {/* BEFORE badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
        <span className="text-[7px] font-mono tracking-[0.25em] text-zinc-300/80 uppercase">Before</span>
      </div>

      {/* After Image (Foreground, clipped) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)` }}
      >
        <img
          src={afterImage}
          alt={`${title} After`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(1.02) saturate(1.05)' }}
          draggable="false"
          loading="lazy"
        />
        {/* AFTER badge — only visible when in the revealed area */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFEA0A] inline-block" />
          <span className="text-[7px] font-mono tracking-[0.25em] text-[#FFEA0A] uppercase">After</span>
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 w-px pointer-events-none"
        style={{
          left: `${sliderVal}%`,
          background: 'linear-gradient(to bottom, transparent, rgba(255,234,10,0.9) 20%, rgba(255,234,10,0.9) 80%, transparent)',
          boxShadow: '0 0 8px rgba(255,234,10,0.4)'
        }}
      >
        {/* Drag handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-950/90 border border-[#FFEA0A]/50 flex items-center justify-center shadow-xl"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 4h10M4 1L1 4l3 3M8 1l3 3-3 3" stroke="#FFEA0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Aspect Label bottom right */}
      <span className="absolute bottom-3 right-3 text-[7px] font-mono tracking-widest text-[#FFEA0A]/70 bg-black/70 px-2 py-0.5 border border-[#FFEA0A]/15 pointer-events-none"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {aspect}
      </span>
    </div>
  );
}

export default function FluidMediaField({ onSelectProject }) {
  const cardsRef = useRef([]);

  const projects = [
    {
      id: 1,
      num: '01',
      title: 'Cogen Energy Complex',
      tag: 'Heavy Build',
      beforeImage: '/assets/images/landmarks/cogen_before.webp',
      afterImage: '/assets/images/landmarks/cogen_after.webp',
      desc: 'From barren excavated terrain to a fully operational co-generation energy complex — thermodynamic piping loops, civil concrete grids, and structural foundation matrices delivered to industrial grade.',
      aspect: '[ COGEN CORES ]',
      location: 'Whitefield, IN',
      coords: '13.0640° N, 80.2460° E',
      metric: '1,200T Steel · M50 Grade'
    },
    {
      id: 2,
      num: '02',
      title: 'Solitaire Valleys',
      tag: 'Real Estate',
      beforeImage: '/assets/images/landmarks/solitaire_before.webp',
      afterImage: '/assets/images/landmarks/solitaire_after.webp',
      desc: 'Raw scrubland hillside transformed into a premium residential valley — strategic land acquisition, luxury villa typologies, winding roads, and municipal green zones meticulously plotted.',
      aspect: '[ RIDGE ESTATES ]',
      location: 'Nandi Foothills, IN',
      coords: '13.0980° N, 80.2920° E',
      metric: '48 Luxury Plots · 12 Acres'
    },
    {
      id: 3,
      num: '03',
      title: 'Orion Glass Villa',
      tag: 'Engineering',
      beforeImage: '/assets/images/landmarks/orion_before.webp',
      afterImage: '/assets/images/landmarks/orion_after.webp',
      desc: 'Exposed steel skeleton raised into a suspended lattice-core glass villa — genetic structural shear mapping, cantilevered volumes, and double-glazed acoustic extensions engineered to perfection.',
      aspect: '[ STRUCTURAL ARCS ]',
      location: 'Beverly Hills, CA',
      coords: '34.0736° N, 118.4004° W',
      metric: '82% Acoustic Seal · Grade Fe 550'
    },
    {
      id: 4,
      num: '04',
      title: 'Calacatta Penthouse',
      tag: 'Curation',
      beforeImage: '/assets/images/landmarks/calacatta_before.webp',
      afterImage: '/assets/images/landmarks/calacatta_after.webp',
      desc: 'Bare concrete shell elevated to an ultra-high-net-worth turnkey residence — Italian Calacatta stone surfaces, smoked oak joinery, brass hardware, and bespoke furnishings curated for elite living.',
      aspect: '[ TURNKEY INTERIOR ]',
      location: 'Aspen Heights, CO',
      coords: '39.1911° N, 106.8175° W',
      metric: '100% Structural Sign-off'
    }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 2) * 0.15, // stagger within the same row
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=80px',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 md:px-6">
      {/* 2-column grid: 1 col on mobile, 2 cols on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full">
        {projects.map((p, idx) => (
          <div
            key={p.id}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="w-full flex flex-col bg-[#1e1e1e] border border-[#FFEA0A]/10 overflow-hidden"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Image — Before/After Slider */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <BeforeAfterSlider
                beforeImage={p.beforeImage}
                afterImage={p.afterImage}
                title={p.title}
                aspect={p.aspect}
              />
            </div>

            {/* Metadata footer */}
            <div className="flex flex-col flex-grow p-5 md:p-6 text-left bg-[#1a1a1a]">
              {/* Index + tag row */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#FFEA0A]/40 font-mono text-[8px] uppercase tracking-widest">
                  {`// ${p.num}`}
                </span>
                <span className="text-[#FFEA0A]/50 font-mono text-[7px] uppercase tracking-widest border border-[#FFEA0A]/10 px-2 py-0.5">
                  {p.tag}
                </span>
              </div>

              {/* Project title */}
              <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-wide leading-tight mb-2 font-sans">
                <span className="text-[#FFEA0A]">{p.title.split(' ')[0]}</span>
                {' '}
                <span className="font-light text-white/90">{p.title.split(' ').slice(1).join(' ')}</span>
              </h3>

              <div className="h-px bg-[#FFEA0A]/8 w-full mb-3" />

              {/* Description */}
              <p className="text-zinc-400 font-sans font-light text-[11px] md:text-[12px] leading-relaxed flex-grow">
                {p.desc}
              </p>

              {/* Footer row */}
              <div className="mt-4 pt-3 border-t border-[#FFEA0A]/8 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-zinc-500 font-mono text-[7px] uppercase tracking-widest">Location</span>
                  <span className="text-zinc-300 text-[10px] font-medium font-sans uppercase">{p.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 font-mono text-[7px] hidden md:block">{p.coords}</span>
                  <button
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="border border-[#FFEA0A]/25 text-[#FFEA0A] hover:bg-[#FFEA0A] hover:text-[#1a1a1a] transition-all duration-300 px-4 py-1.5 uppercase text-[8px] tracking-widest font-semibold"
                    data-interactive
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
