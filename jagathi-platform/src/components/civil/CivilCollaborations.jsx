'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CivilCollaborations() {
  const trackRef1 = useRef(null);
  const trackRef2 = useRef(null);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);

  const row1Words = ['STRATEGIC LAND CORRIDORS', 'PLOTTED REAL ESTATE', 'INDUSTRIAL SMART ZONES', 'HIGHWAY INTERCHANGES'];
  const row2Words = ['PROPERTY ADVISORY DESK', 'CLEAR TITLES', 'MUNICIPAL ZONING', 'HIGH YIELD ASSETS'];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupMarquee = (track, parent, direction, speed) => {
      if (!track || !parent) return null;
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return null;

      const tween = gsap.to(track, {
        x: direction === 'right' ? halfWidth : -halfWidth,
        ease: 'none',
        duration: speed,
        repeat: -1,
        modifiers: {
          x: (rawX) => {
            const x = parseFloat(rawX);
            return direction === 'right'
              ? `${(x % halfWidth) - halfWidth}px`
              : `${x % halfWidth}px`;
          },
        },
      });

      const pause = () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: 'auto' });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: 'auto' });

      parent.addEventListener('mouseenter', pause);
      parent.addEventListener('mouseleave', resume);

      return () => {
        tween.kill();
        parent.removeEventListener('mouseenter', pause);
        parent.removeEventListener('mouseleave', resume);
      };
    };

    const cleanup1 = setupMarquee(trackRef1.current, containerRef1.current, 'left', 50);
    const cleanup2 = setupMarquee(trackRef2.current, containerRef2.current, 'right', 60);

    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    };
  }, []);

  const tripleRow1 = [...row1Words, ...row1Words, ...row1Words, ...row1Words];
  const tripleRow2 = [...row2Words, ...row2Words, ...row2Words, ...row2Words];

  return (
    <section className="relative z-10 w-full py-8 md:py-12 my-2 md:my-4 select-none overflow-hidden flex flex-col gap-2">
      {/* Row 1: Dark Charcoal Background (#1C1C1C) with Yellow Outline Text */}
      <div
        ref={containerRef1}
        className="w-full py-3.5 sm:py-5 bg-[#1C1C1C] overflow-hidden shadow-xl cursor-pointer"
        style={{ transform: 'skewY(-1.2deg)' }}
      >
        <div
          ref={trackRef1}
          className="flex whitespace-nowrap gap-8 md:gap-12 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider will-change-transform py-1"
          style={{ width: 'fit-content' }}
        >
          {tripleRow1.map((w, idx) => (
            <div key={idx} className="flex items-center gap-8 md:gap-12">
              <span
                className="inline-block transition-all duration-350 hover:scale-110 hover:text-[#FFEA0A] font-bold"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #FFEA0A',
                  textShadow: '0 0 0px transparent',
                }}
              >
                {w}
              </span>
              <span className="text-[#FFEA0A]/40 text-lg md:text-2xl font-light">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Brand Yellow Background (#FFEA0A) with Dark Charcoal Outline Text */}
      <div
        ref={containerRef2}
        className="w-full py-3.5 sm:py-5 bg-[#FFEA0A] overflow-hidden shadow-xl cursor-pointer"
        style={{ transform: 'skewY(-1.2deg)' }}
      >
        <div
          ref={trackRef2}
          className="flex whitespace-nowrap gap-8 md:gap-12 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider will-change-transform py-1"
          style={{ width: 'fit-content' }}
        >
          {tripleRow2.map((w, idx) => (
            <div key={idx} className="flex items-center gap-8 md:gap-12">
              <span
                className="inline-block transition-all duration-350 hover:scale-110 hover:text-[#1C1C1C] font-bold"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #1C1C1C',
                  textShadow: '0 0 0px transparent',
                }}
              >
                {w}
              </span>
              <span className="text-[#1C1C1C]/40 text-lg md:text-2xl font-light">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
