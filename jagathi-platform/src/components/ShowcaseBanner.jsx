'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ShowcaseBanner({ onPlayReel }) {
  const triggerRef = useRef(null);
  const bannerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerRef.current;
    const banner = bannerRef.current;
    const content = contentRef.current;
    if (!trigger || !banner) return;

    // Pin timeline scrubbing the mask rect attributes and content fade/scale
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // 1-second smooth catch-up delay
        pin: banner,
        pinSpacing: false
      }
    });

    // 1. Scrub SVG mask-rect attributes from centered float rounded container to fullbleed rect
    tl.fromTo('#mask-rect', 
      {
        attr: {
          x: '28%',
          y: '22%',
          width: '44%',
          height: '56%',
          rx: '40px',
          ry: '40px'
        }
      },
      {
        attr: {
          x: '0%',
          y: '0%',
          width: '100%',
          height: '100%',
          rx: '0px',
          ry: '0px'
        },
        ease: 'power2.inOut',
        force3D: true // GPU acceleration
      },
      0
    );

    // 2. Liquid wobble peak (up to scale 95 at 50% transition, then decays to 0)
    tl.fromTo('#liquid-jelly-map',
      { attr: { scale: 0 } },
      { attr: { scale: 95 }, ease: 'sine.out', duration: 0.5 },
      0
    ).to('#liquid-jelly-map',
      { attr: { scale: 0 }, ease: 'sine.in', duration: 0.5 },
      0.5
    );

    // 3. Fade and scale the inner content to coordinate with the expansion
    if (content) {
      tl.fromTo(content,
        { opacity: 0.5, scale: 0.9 },
        { opacity: 1, scale: 1, ease: 'power2.out' },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === trigger) t.kill();
      });
    };
  }, []);

  return (
    <div 
      ref={triggerRef} 
      className="relative w-full h-[160vh] bg-transparent overflow-hidden flex items-center justify-center z-20"
    >
      {/* Expanding Banner Container using mask-image to clip boundaries only */}
      <div 
        ref={bannerRef}
        className="w-full h-screen relative flex items-center justify-center overflow-hidden"
        style={{
          maskImage: 'url(#showcase-mask)',
          WebkitMaskImage: 'url(#showcase-mask)',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          willChange: 'mask-image'
        }}
      >
        {/* Self-contained SVG Liquid Wobble Filter & Mask inside the viewport */}
        <svg 
          style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }} 
          aria-hidden="true"
        >
          <defs>
            <filter id="liquid-jelly" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.008 0.015" 
                numOctaves="2" 
                result="noise" 
              />
              <feDisplacementMap 
                id="liquid-jelly-map" 
                in="SourceGraphic" 
                in2="noise" 
                scale="0" 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>

            <mask id="showcase-mask" maskContentUnits="userSpaceOnUse">
              <rect 
                id="mask-rect"
                fill="white"
                x="28%"
                y="22%"
                width="44%"
                height="56%"
                rx="40"
                ry="40"
                filter="url(#liquid-jelly)"
              />
            </mask>
          </defs>
        </svg>

        {/* Background Project Image acting as Video/Reel preview */}
        <img 
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/482e7b6a-168c-4d0d-b35d-0e2ff4014577_3840w.webp" 
          alt="Showcase Reel Banner" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none scale-105 opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/80 pointer-events-none" />

        {/* Play Banner Interface */}
        <div 
          ref={contentRef}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl pointer-events-auto"
        >
          <span className="text-yellow-400 font-mono text-[9px] md:text-[11px] uppercase tracking-[0.35em] mb-4">
            // CINEMATIC ENCODING
          </span>
          <h2 className="text-white font-extrabold text-3xl md:text-6xl uppercase tracking-[0.1em] leading-tight mb-8">
            HEAVY BUILD REEL
          </h2>
          
          {/* Elastic Play Button Container */}
          <div 
            onClick={() => onPlayReel && onPlayReel({
              title: "HEAVY BUILD CINEMATIC REEL",
              tag: "EXPLORE THE LANDMARKS",
              image: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/482e7b6a-168c-4d0d-b35d-0e2ff4014577_3840w.webp",
              desc: "A high-fidelity capture of heavy engineering complexes, core foundations, municipal lattice works, and industrial design curations completed from 1989 to present."
            })}
            className="w-20 h-20 rounded-full border border-yellow-400 flex items-center justify-center cursor-pointer hover:bg-yellow-400 hover:scale-110 active:scale-95 group transition-all duration-300 shadow-lg shadow-yellow-400/10"
            data-interactive
          >
            <span className="text-yellow-400 text-2xl group-hover:text-black transition-colors ml-1">▶</span>
          </div>
          
          <span className="text-gray-400 font-mono text-[8px] tracking-widest uppercase mt-6 select-none animate-pulse">
            Scroll to expand & play
          </span>
        </div>

        {/* Technical Hud Markers inside Banner */}
        <div className="absolute top-12 left-12 font-mono text-[8px] text-yellow-400/35 hidden md:block">
          STATUS: IN_VIEW_WARP_ACTIVE
        </div>
        <div className="absolute bottom-12 right-12 font-mono text-[8px] text-yellow-400/35 hidden md:block">
          ZOOM: SCALE_SCRUB_1.0
        </div>
      </div>
    </div>
  );
}
