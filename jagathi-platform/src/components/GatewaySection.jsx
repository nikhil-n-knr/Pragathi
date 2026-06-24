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

  // Fetch of the fluid context
  const fluid = useFluid();
  const smoothScrollVel = fluid ? fluid.smoothScrollVel : null;

  const row1DescTokens = ["Delivering", "master-scale", "concrete", "cores,", "structural", "lattices,", "and", "industrial", "complexes", "built", "to", "endure", "generations."];
  const row2DescTokens = ["Every", "square", "inch", "managed", "seamlessly—from", "raw", "architectural", "layouts", "and", "custom", "millwork", "to", "absolute", "lighting", "design."];
  const row3DescTokens = ["Vetting", "and", "securing", "high-potential", "growth", "corridors,", "industrial", "smart-zones,", "and", "premium", "plotted", "inventories."];

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
        const distance = gsap.utils.random(1.5, 2.5); // subtle horizontal drift to avoid collision
        const duration = gsap.utils.random(1.2, 1.8); // faster, energetic loop

        const tween = gsap.to(el, {
          x: dir * distance,
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
      r1.forEach(({ tween }) => active1 ? tween.play() : gsap.to(tween.targets(), { x: 0, duration: 0.3, onComplete: () => tween.pause() }));

      // Row 2
      const active2 = getIsActive(1);
      r2.forEach(({ tween }) => active2 ? tween.play() : gsap.to(tween.targets(), { x: 0, duration: 0.3, onComplete: () => tween.pause() }));

      // Row 3
      const active3 = getIsActive(2);
      r3.forEach(({ tween }) => active3 ? tween.play() : gsap.to(tween.targets(), { x: 0, duration: 0.3, onComplete: () => tween.pause() }));
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
      className="relative z-10 w-full bg-transparent text-[#424242] flex flex-col items-center justify-center gap-[clamp(8rem,14vw,18rem)] overflow-visible"
      style={{
        paddingTop: 'clamp(6rem, 10vw, 12rem)',
        paddingBottom: 'clamp(8rem, 14vw, 18rem)',
        fontFamily: '"Outfit", sans-serif'
      }}
    >
      {/* Visual Title Header */}
      <div className="flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full mt-8 md:mt-14 mb-8 split-reveal">
        <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest block text-center mb-4">{"// Gateway Portals"}</span>
        <h2 className="text-[#424242] font-black text-3xl md:text-5xl lg:text-6xl uppercase tracking-wider mt-2 text-center w-full leading-normal font-basement">
          One Group. Three Disciplines.
        </h2>
      </div>

      {/* ROW 1: Construction & Land Development */}
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
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#424242]/30 transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(0) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="/assets/images/9bac245c-5aba-4bc5-98af-f60ccff7fb97.jpeg" 
                alt="Construction & Land Development" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Right Column (45% width): Kinetic text inside sidebar border */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-start text-left overflow-visible select-text cursor-default border-l border-[#424242]/20 hover:border-[#424242]/60 transition-colors duration-500 pl-6 md:pl-8 py-2"
          onMouseEnter={() => setHoveredRow(0)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#424242]/60 font-mono text-[9px] tracking-widest uppercase mb-4">{"// PORTAL 01 // CONSTRUCTION & LAND DEVELOPMENT"}</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-8 leading-normal select-none uppercase font-basement">
            <span className="text-[#424242] tracking-[0.03em] block">CONSTRUCTION & LAND DEVELOPMENT /</span>
            <span className="font-sans font-light text-gray-800 lowercase first-letter:uppercase tracking-[0.05em] block mt-3 text-xl md:text-2xl">
              Heavy civil & land development
            </span>
          </div>
          <div className="text-[#424242]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row1DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-0 kinetic-word inline-block mr-3 mb-2">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Interiors (Bespoke Turnkey design) */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20 overflow-visible split-reveal">
        {/* Left Column (45% width): Kinetic text inside sidebar border (Aligned right) */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-end text-right overflow-visible select-text cursor-default border-r border-[#424242]/20 hover:border-[#424242]/60 transition-colors duration-500 pr-6 md:pr-8 py-2"
          onMouseEnter={() => setHoveredRow(1)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#424242]/60 font-mono text-[9px] tracking-widest uppercase mb-4">{"// PORTAL 02 // INTERIOR A-Z"}</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-8 leading-normal select-none uppercase font-basement">
            <span className="text-[#424242] tracking-[0.1em] block">INTERIORS /</span>
            <span className="font-sans font-light text-gray-800 lowercase first-letter:uppercase tracking-[0.05em] block mt-3 text-xl md:text-2xl">
              Turnkey bespoke spaces
            </span>
          </div>
          <div className="text-[#424242]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row2DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-1 kinetic-word inline-block mr-3 mb-2">
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
            onClick={() => router.push('/interior')}
          >
            <div
              ref={(el) => (imageRefs.current[1] = el)}
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#424242]/30 transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(1) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="/assets/images/modern-room-with-wooden-staircase-daytime_181624-11447.avif" 
                alt="Interiors" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Civil Market */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 overflow-visible split-reveal">
        {/* Left Column (52% width): Floating, expandable image */}
        <div className="w-full md:w-[52%] flex justify-center items-center overflow-visible">
          <div 
            className="relative w-full aspect-[16/10] md:aspect-[16/9] max-w-2xl overflow-visible cursor-pointer"
            onMouseEnter={() => setHoveredRow(2)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => router.push('/civil-market')}
          >
            <div
              ref={(el) => (imageRefs.current[2] = el)}
              className="image-frame-wrapper w-full h-full relative overflow-hidden border border-[#424242]/30 transition-all duration-700 ease-out z-10"
              data-hovered={getIsActive(2) ? "true" : "false"}
              style={{
                clipPath: 'inset(8% 12% 8% 12% round 24px)',
                borderRadius: '24px',
                willChange: 'clip-path, transform, border-radius',
              }}
            >
              <img 
                src="/assets/images/aab4121b-6a8c-49a8-85ca-4e53328ac84c.jpeg" 
                alt="Civil Market" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#000000]/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Right Column (45% width): Kinetic text inside sidebar border */}
        <div 
          className="w-full md:w-[45%] flex flex-col items-start text-left overflow-visible select-text cursor-default border-l border-[#424242]/20 hover:border-[#424242]/60 transition-colors duration-500 pl-6 md:pl-8 py-2"
          onMouseEnter={() => setHoveredRow(2)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <span className="text-[#424242]/60 font-mono text-[9px] tracking-widest uppercase mb-4">{"// PORTAL 03 // CIVIL MARKET"}</span>
          <div className="font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider mb-8 leading-normal select-none uppercase font-basement">
            <span className="text-[#424242] tracking-[0.1em] block">CIVIL MARKET /</span>
            <span className="font-sans font-light text-gray-800 lowercase first-letter:uppercase tracking-[0.05em] block mt-3 text-xl md:text-2xl">
              Lands & plotted assets
            </span>
          </div>
          <div className="text-[#424242]/75 text-sm md:text-base font-light leading-relaxed max-w-xl text-justify font-sans">
            {row3DescTokens.map((t, idx) => (
              <span key={idx} className="drift-word-2 kinetic-word inline-block mr-3 mb-2">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
