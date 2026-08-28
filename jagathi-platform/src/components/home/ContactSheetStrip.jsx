'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const frames = [
  { id: 'FR-01', label: 'SITE EXCAVATION', img: '/assets/images/white_renders/white_render_spatial_2.webp' },
  { id: 'FR-02', label: 'BLUEPRINT CORE', img: '/assets/images/sketches/sketch_blueprint_3.webp' },
  { id: 'FR-03', label: 'STRUCTURAL CORE', img: '/assets/images/completed/completed_project_1.webp' },
  { id: 'FR-04', label: 'FACADE ELEVATION', img: '/assets/images/sketches/sketch_arch_facade_2.webp' },
  { id: 'FR-05', label: 'SPATIAL VOLUME', img: '/assets/images/white_renders/white_render_building_1.webp' },
  { id: 'FR-06', label: 'CONCRETE SHEAR', img: '/assets/images/landmarks/cogen_sketch.png' },
  { id: 'FR-07', label: 'TERRAIN PLAN', img: '/assets/images/landmarks/solitaire_sketch.png' },
];

export default function ContactSheetStrip() {
  const trackRef = useRef(null);
  const doubledFrames = [...frames, ...frames, ...frames];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    const quickSkew = gsap.quickTo(track, 'skewX', { duration: 0.6, ease: 'power3.out' });
    const clampSkew = gsap.utils.clamp(-6, 6);

    const trigger = ScrollTrigger.create({
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const vel = self.getVelocity() / 300;
        quickSkew(clampSkew(vel));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="relative z-10 w-full py-16 bg-[#121315]/90 border-t border-b border-[#FFEA0A]/20 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 mb-8 flex justify-between items-center">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold">
          {'// ARCHITECTURAL PLATES & CONTACT SHEET'}
        </span>
        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest hidden md:block">
          UNFILED FRAMES · SCROLL-WARPED STREAM
        </span>
      </div>

      {/* Infinite horizontal scroll strip with velocity skew */}
      <div className="w-full overflow-hidden flex select-none">
        <div
          ref={trackRef}
          className="flex gap-6 animate-marquee whitespace-nowrap will-change-transform py-2"
        >
          {doubledFrames.map((item, idx) => (
            <figure
              key={idx}
              className="w-[260px] sm:w-[320px] h-[190px] sm:h-[220px] flex-shrink-0 bg-[#1C1C1C] border border-white/10 p-2 flex flex-col justify-between group hover:border-[#FFEA0A] transition-all duration-300 shadow-md"
            >
              <div className="w-full h-[150px] sm:h-[170px] overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                />
              </div>
              <figcaption className="flex justify-between items-center font-mono text-[10px] text-gray-400 pt-2 border-t border-white/10">
                <span className="text-[#FFEA0A] font-bold">{item.id}</span>
                <span className="uppercase tracking-widest">{item.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
