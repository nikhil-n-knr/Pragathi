'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const projects = [
  {
    id: 1,
    num: '01',
    title: 'Cogen Energy Complex',
    tag: 'Heavy Build',
    titleFirst: 'Cogen',
    titleRest: 'Energy Complex',
    beforeImage: '/assets/images/landmarks/cogen_sketch.png',
    afterImage: '/assets/images/landmarks/cogen_finished.png',
    desc: 'From barren excavated terrain to a fully operational co-generation energy complex — thermodynamic piping loops, civil concrete grids, and structural foundation matrices.',
    location: 'Whitefield, IN',
    coords: '13.0640° N, 80.2460° E',
    metric: '1,200T Steel · M50 Grade',
    aspect: '[ COGEN CORES ]',
  },
  {
    id: 2,
    num: '02',
    title: 'Solitaire Valleys',
    tag: 'Real Estate',
    titleFirst: 'Solitaire',
    titleRest: 'Valleys',
    beforeImage: '/assets/images/landmarks/solitaire_sketch.png',
    afterImage: '/assets/images/landmarks/solitaire_finished.png',
    desc: 'Raw architectural sketch transformed into a premium estate valley — strategic land acquisition, luxury villa typologies, winding roads, and municipal green zones.',
    location: 'Nandi Foothills, IN',
    coords: '13.0980° N, 80.2920° E',
    metric: '48 Luxury Plots · 12 Acres',
    aspect: '[ RIDGE ESTATES ]',
  },
  {
    id: 3,
    num: '03',
    title: 'Orion Glass Villa',
    tag: 'Engineering',
    titleFirst: 'Orion',
    titleRest: 'Glass Villa',
    beforeImage: '/assets/images/landmarks/orion_sketch.png',
    afterImage: '/assets/images/landmarks/orion_finished.png',
    desc: 'Exposed structural sketch raised into a suspended lattice-core glass villa — genetic structural shear mapping, cantilevered volumes, and double-glazed acoustic extensions.',
    location: 'Beverly Hills, CA',
    coords: '34.0736° N, 118.4004° W',
    metric: '82% Acoustic Seal · Grade Fe 550',
    aspect: '[ STRUCTURAL SHEAR ]',
  },
  {
    id: 4,
    num: '04',
    title: 'Calacatta Residence',
    tag: 'Infrastructure',
    titleFirst: 'Calacatta',
    titleRest: 'Penthouse',
    beforeImage: '/assets/images/landmarks/calacatta_sketch.png',
    afterImage: '/assets/images/landmarks/calacatta_finished.png',
    desc: 'Pure architectural line sketch transitioned into a luxury penthouse tower — deep core shear walls, curtained glass facade, and high-efficiency floorplates.',
    location: 'Metropolis, IN',
    coords: '12.9716° N, 77.5946° E',
    metric: '80 Floors · 1.2M SqFt',
    aspect: '[ SKYLINE PILLAR ]',
  },
];

export default function FluidMediaField() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // Desktop GSAP Horizontal Scrub Pinning
      const ctx = gsap.context(() => {
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;
        const totalWidth = getScrollAmount();

        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }, section);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div className="relative z-25 w-full overflow-visible bg-transparent my-4 sm:my-8">
      {/* Mobile Header Block */}
      <div className="block md:hidden px-4 mb-4 text-center">
        <span className="text-[#1C1C1C]/70 font-mono text-[10px] uppercase tracking-[0.3em] font-semibold block mb-1">
          {'// Featured Work'}
        </span>
        <h2 className="text-2xl font-black uppercase text-[#1C1C1C] font-basement leading-tight">
          Landmarks of Distinction
        </h2>
        <span className="text-[#1C1C1C]/60 font-mono text-[10px] uppercase tracking-widest block mt-2">
          ← Swipe to explore 4 landmark sketches →
        </span>
      </div>

      <div
        ref={sectionRef}
        className="relative w-full min-h-[auto] md:min-h-screen overflow-hidden flex items-center bg-transparent z-20 landmark-horizontal-section"
        style={{ paddingTop: 'clamp(1rem, 4vw, 4rem)', paddingBottom: 'clamp(2rem, 5vw, 5rem)' }}
      >
        <div
          ref={trackRef}
          className="flex flex-row items-stretch md:items-center gap-4 sm:gap-8 md:gap-16 px-4 md:px-[8vw] h-auto md:h-[75vh] will-change-transform overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-6 md:pb-0"
          style={{ width: 'max-content' }}
        >
          {/* Desktop Intro text panel */}
          <div
            className="hidden md:flex w-[85vw] max-w-[1000px] flex-shrink-0 flex-col justify-center px-10 md:px-12 lg:px-16 text-left mx-auto"
            style={{ boxSizing: 'border-box' }}
          >
            <span
              className="text-[#1C1C1C]/70 font-mono text-xs uppercase block text-left font-semibold"
              style={{ letterSpacing: '0.4em', marginBottom: '1.25rem' }}
            >
              {'// Featured Work'}
            </span>
            <h2
              className="text-[#1C1C1C] font-black uppercase text-left w-full leading-none font-basement"
              style={{ letterSpacing: '0.08em', fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', marginTop: '0.5rem' }}
            >
              Landmarks of Distinction
            </h2>
            <p
              className="text-[#1C1C1C]/60 text-left"
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(11px, 1.3vw, 15px)',
                lineHeight: '1.8',
                letterSpacing: '0.05em',
                marginTop: '1.25rem',
                maxWidth: '32rem',
              }}
            >
              Four architectural transformations. Pure white line sketches materialized into landmark physical realities.
            </p>
          </div>

          {/* Cards 1-4 (Mobile Touch Snap Container & Desktop Pin Cards) */}
          {projects.map((p) => (
            <div
              key={p.id}
              className="w-[88vw] sm:w-[80vw] md:w-[85vw] max-w-[860px] h-auto md:h-[62vh] min-h-[460px] flex-shrink-0 bg-[#121315] border border-[#FFEA0A]/20 rounded-none shadow-[0_45px_90px_-25px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col md:flex-row items-stretch justify-between gap-0 cursor-pointer group work-card-inner snap-center"
              style={{ boxSizing: 'border-box' }}
            >
              {/* Top/Left Image Column: Landmarks White Line Sketch */}
              <div className="w-full md:w-[55%] h-[240px] sm:h-[300px] md:h-full relative overflow-hidden bg-white flex-shrink-0 order-1 md:order-2">
                <img
                  src={p.beforeImage}
                  alt={`${p.title} White Architectural Sketch`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ filter: 'brightness(0.98) contrast(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 font-mono text-[9px] sm:text-[10px] text-[#FFEA0A] bg-black/80 backdrop-blur-md px-2.5 py-1 border border-[#FFEA0A]/30">
                  {p.coords}
                </div>
              </div>

              {/* Bottom/Right Details Column */}
              <div
                className="p-5 sm:p-8 md:p-12 flex flex-col justify-between items-center text-center w-full md:w-[45%] flex-shrink-0 bg-[#121315] order-2 md:order-1"
                style={{ boxSizing: 'border-box' }}
              >
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#FFEA0A] font-mono text-[9px] bg-white/5 border border-[#FFEA0A]/20 px-3 py-1.5 flex-shrink-0 tracking-widest mb-4 md:mb-6">
                    {p.tag}
                  </span>

                  <h3
                    className="font-bold text-base sm:text-lg md:text-xl uppercase tracking-wide text-white mb-2 group-hover:text-[#FFEA0A] transition-colors duration-300 font-basement"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    <span className="text-[#FFEA0A]">{p.titleFirst}</span>{' '}
                    <span className="font-light text-white/95">{p.titleRest}</span>
                  </h3>

                  <span className="font-mono text-[8px] tracking-[0.25em] text-[#FFEA0A]/70 uppercase mt-1">
                    {p.aspect}
                  </span>

                  <p
                    className="text-gray-300 font-light text-[11px] sm:text-xs leading-relaxed mt-3 max-w-[280px]"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    {p.desc}
                  </p>
                </div>

                <div className="w-full flex flex-col items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-white/10 mt-4 sm:mt-6">
                  <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono text-gray-400">
                    <span>{p.location}</span>
                    <span>•</span>
                    <span className="text-[#FFEA0A]">{p.metric}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
