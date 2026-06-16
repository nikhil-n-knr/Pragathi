'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useFluid } from '../context/FluidContext';

export default function GatewaySection() {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [autoplayRow, setAutoplayRow] = useState(0);
  const imageRefs = useRef([]);
  const hoverProgressRefs = useRef([0, 0, 0]); // Smooth zoom progress trackers

  // Safe fetch of the fluid context
  let fluid = null;
  try {
    fluid = useFluid();
  } catch (e) {
    console.warn("FluidContext not found. Bending animations will run on fallback scroll tracker.");
  }
  const smoothScrollVel = fluid ? fluid.smoothScrollVel : null;

  const row1DescTokens = ["Delivering", "master-scale", "concrete", "cores,", "structural", "lattices,", "and", "industrial", "complexes", "built", "to", "endure", "generations."];
  const row2DescTokens = ["Sourcing,", "securing,", "and", "scaling", "exclusive", "property", "holdings", "and", "topographic", "developments", "for", "long-term", "equity."];
  const row3DescTokens = ["Every", "square", "inch", "managed", "seamlessly—from", "raw", "architectural", "layouts", "and", "custom", "millwork", "to", "absolute", "lighting", "design."];

  const getIsActive = (index) => {
    return hoveredRow === index || (hoveredRow === null && autoplayRow === index);
  };

  // 1. Autoplay cycle (every 3.5s) pauses when mouse is hovering
  useEffect(() => {
    if (hoveredRow !== null) return;

    const interval = setInterval(() => {
      setAutoplayRow((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(interval);
  }, [hoveredRow]);

  // 2. Staggered vertical drift loop only active when the row is selected/hovered
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const runActiveDrift = (rowIdx, tokensClass) => {
      const elements = gsap.utils.toArray(tokensClass);
      return elements.map((el, index) => {
        const dir = index % 2 === 0 ? 1 : -1;
        const distance = gsap.utils.random(2, 4); // tight vertical wiggle
        const duration = gsap.utils.random(1.2, 1.8); // faster, energetic loop

        const tween = gsap.to(el, {
          y: dir * distance,
          duration: duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 0.5),
          paused: true // start paused
        });

        return { tween, el };
      });
    };

    const r1 = runActiveDrift(0, '.drift-word-0');
    const r2 = runActiveDrift(1, '.drift-word-1');
    const r3 = runActiveDrift(2, '.drift-word-2');

    const updatePlayState = () => {
      // Row 1
      const active1 = getIsActive(0);
      r1.forEach(({ tween }) => active1 ? tween.play() : gsap.to(tween.targets(), { y: 0, duration: 0.3, onComplete: () => tween.pause() }));

      // Row 2
      const active2 = getIsActive(1);
      r2.forEach(({ tween }) => active2 ? tween.play() : gsap.to(tween.targets(), { y: 0, duration: 0.3, onComplete: () => tween.pause() }));

      // Row 3
      const active3 = getIsActive(2);
      r3.forEach(({ tween }) => active3 ? tween.play() : gsap.to(tween.targets(), { y: 0, duration: 0.3, onComplete: () => tween.pause() }));
    };

    updatePlayState();
    
    // Listen for state shifts
    const observer = new MutationObserver(updatePlayState);
    imageRefs.current.forEach(el => {
      if (el) observer.observe(el, { attributes: true, attributeFilter: ['data-hovered'] });
    });

    return () => {
      observer.disconnect();
      r1.forEach(({ tween }) => tween.kill());
      r2.forEach(({ tween }) => tween.kill());
      r3.forEach(({ tween }) => tween.kill());
    };
  }, [hoveredRow, autoplayRow]);

  // 3. RequestAnimationFrame loop for skew-bending and smooth JS lerped clip-path/scale expansions
  useEffect(() => {
    let rAfId;
    let fallbackScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let fallbackVel = 0;

    const tick = () => {
      let velocity = 0;
      if (smoothScrollVel) {
        velocity = smoothScrollVel.current;
      } else {
        const currentY = window.scrollY;
        const instant = currentY - fallbackScrollY;
        fallbackScrollY = currentY;
        fallbackVel += (instant - fallbackVel) * 0.1;
        velocity = fallbackVel;
      }

      const skewYVal = velocity * 0.045;
      const clampedSkew = Math.max(-12, Math.min(12, skewYVal));

      imageRefs.current.forEach((el, index) => {
        if (!el) return;

        const isActive = el.getAttribute('data-hovered') === 'true';
        const targetVal = isActive ? 1.0 : 0.0;

        hoverProgressRefs.current[index] += (targetVal - hoverProgressRefs.current[index]) * 0.08;
        const t = hoverProgressRefs.current[index];

        const scale = 1.0 + t * 0.12; 
        const roundedPct = 24 - t * 24; 
        const insetX = 12 - t * 12; 
        const insetY = 8 - t * 8; 

        const clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedPct}px)`;
        const borderRadius = `${roundedPct}px`;

        el.style.transform = `scale(${scale}) skewY(${clampedSkew}deg)`;
        el.style.clipPath = clipPath;
        el.style.borderRadius = borderRadius;
      });

      rAfId = requestAnimationFrame(tick);
    };

    rAfId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rAfId);
  }, [smoothScrollVel]);

  return (
    <section 
      className="relative z-10 w-full bg-[#000000] text-[#FFFF00] flex flex-col items-center justify-center gap-[clamp(8rem,14vw,18rem)] overflow-visible"
      style={{
        paddingTop: 'clamp(6rem, 10vw, 12rem)',
        paddingBottom: 'clamp(8rem, 14vw, 18rem)',
        fontFamily: '"Outfit", sans-serif'
      }}
    >
      {/* Visual Title Header */}
      <div className="flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full mb-8 split-reveal">
        <span className="text-[#FFFF00]/70 font-mono text-xs uppercase tracking-widest block text-center">// Gateway Portals</span>
        <h2 className="text-[#FFFF00] font-black text-3xl md:text-5xl lg:text-6xl uppercase tracking-wider mt-2 text-center w-full leading-tight font-sans">
          One Group. Three Disciplines.
        </h2>
      </div>

      {/* ROW 1: Construction */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 overflow-visible split-reveal">
        {/* Left Column (52% width): Floating, expandable image */}
        <div className="w-full md:w-[52%] flex justify-center items-center overflow-visible">
          <div 
            className="relative w-full aspect-[16/10] md:aspect-[16/9] max-w-2xl overflow-visible cursor-pointer"
            onMouseEnter={() => setHoveredRow(0)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => router.push('/construction')}
          >
            <div
              ref={(el) => (imageRefs.current[0] = el)}
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#FFFF00] transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(0) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80" 
                alt="Construction" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Right Column (45% width): Kinetic text inside sidebar border */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-start text-left overflow-visible select-text cursor-default border-l border-yellow-400/20 hover:border-yellow-400/60 transition-colors duration-500 pl-6 md:pl-8 py-2"
          onMouseEnter={() => setHoveredRow(0)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#FFFF00]/60 font-mono text-[9px] tracking-widest uppercase mb-3">// PORTAL 01 // CONSTRUCTION</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-6 leading-tight select-none uppercase font-sans">
            <span className="text-yellow-400 tracking-[0.1em] mr-2">CONSTRUCTION /</span>
            <span className="font-serif-luxury italic text-white lowercase first-letter:uppercase tracking-[0.05em] block md:inline mt-2 md:mt-0 font-normal">
              Heavy civil engineering
            </span>
          </div>
          <div className="text-[#FFFF00]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row1DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-0 kinetic-word inline-block mr-1.5 mb-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Real Estate */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20 overflow-visible split-reveal">
        {/* Left Column (45% width): Kinetic text inside sidebar border (Aligned right) */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-end text-right overflow-visible select-text cursor-default border-r border-yellow-400/20 hover:border-yellow-400/60 transition-colors duration-500 pr-6 md:pr-8 py-2"
          onMouseEnter={() => setHoveredRow(1)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#FFFF00]/60 font-mono text-[9px] tracking-widest uppercase mb-3">// PORTAL 02 // REAL ESTATE</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-6 leading-tight select-none uppercase font-sans">
            <span className="text-yellow-400 tracking-[0.1em] mr-2">REAL ESTATE /</span>
            <span className="font-serif-luxury italic text-white lowercase first-letter:uppercase tracking-[0.05em] block md:inline mt-2 md:mt-0 font-normal">
              High-yield asset holdings
            </span>
          </div>
          <div className="text-[#FFFF00]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row2DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-1 kinetic-word inline-block mr-1.5 mb-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column (52% width): Floating, expandable image */}
        <div className="w-full md:w-[52%] flex justify-center items-center overflow-visible">
          <div 
            className="relative w-full aspect-[16/10] md:aspect-[16/9] max-w-2xl overflow-visible cursor-pointer"
            onMouseEnter={() => setHoveredRow(1)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => router.push('/real-estate')}
          >
            <div
              ref={(el) => (imageRefs.current[1] = el)}
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#FFFF00] transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(1) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp" 
                alt="Real Estate" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Interior A-Z */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 overflow-visible split-reveal">
        {/* Left Column (52% width): Floating, expandable image */}
        <div className="w-full md:w-[52%] flex justify-center items-center overflow-visible">
          <div 
            className="relative w-full aspect-[16/10] md:aspect-[16/9] max-w-2xl overflow-visible cursor-pointer"
            onMouseEnter={() => setHoveredRow(2)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => router.push('/interior')}
          >
            <div
              ref={(el) => (imageRefs.current[2] = el)}
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#FFFF00] transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(2) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=80" 
                alt="Interior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Right Column (45% width): Kinetic text inside sidebar border */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-start text-left overflow-visible select-text cursor-default border-l border-yellow-400/20 hover:border-yellow-400/60 transition-colors duration-500 pl-6 md:pl-8 py-2"
          onMouseEnter={() => setHoveredRow(2)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#FFFF00]/60 font-mono text-[9px] tracking-widest uppercase mb-3">// PORTAL 03 // INTERIOR A-Z</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-6 leading-tight select-none uppercase font-sans">
            <span className="text-yellow-400 tracking-[0.1em] mr-2">INTERIORS /</span>
            <span className="font-serif-luxury italic text-white lowercase first-letter:uppercase tracking-[0.05em] block md:inline mt-2 md:mt-0 font-normal">
              Turnkey bespoke spaces
            </span>
          </div>
          <div className="text-[#FFFF00]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row3DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-2 kinetic-word inline-block mr-1.5 mb-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
