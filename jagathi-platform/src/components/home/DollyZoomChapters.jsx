'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const chapters = [
  {
    no: '01',
    title: 'CONSTRUCTION & LAND DEVELOPMENT',
    subtitle: 'Heavy civil, master concrete cores & industrial complexes',
    desc: 'Delivering master-scale concrete cores, structural lattices, and industrial complexes built to endure generations.',
    image: '/assets/images/construction_discipline.webp',
    videoMp4: '/assets/videos/construction_loop.mp4',
    href: '/construction',
  },
  {
    no: '02',
    title: 'ARCHITECTURAL INTERIOR SOLUTIONS',
    subtitle: 'Turnkey bespoke interiors & spatial curation',
    desc: 'Every square inch managed seamlessly — from raw architectural layouts and custom millwork to absolute lighting design.',
    image: '/assets/images/interiors_discipline.webp',
    videoMp4: '/assets/videos/interiors_loop.mp4',
    href: '/interior',
  },
  {
    no: '03',
    title: 'PROPERTY ADVISORY SERVICES',
    subtitle: 'Lands, plotted inventories & strategic growth corridors',
    desc: 'Vetting and securing high-potential growth corridors, industrial smart-zones, and premium plotted inventories.',
    image: '/assets/images/civil_market_discipline.webp',
    videoMp4: '/assets/videos/civil_market_loop.mp4',
    href: '/civil-market',
  },
];

export default function DollyZoomChapters() {
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const chapterEls = container.querySelectorAll('.dolly-chapter');

    chapterEls.forEach((ch) => {
      const stage = ch.querySelector('.ch-stage');
      const mask = ch.querySelector('.ch-mask');
      const img = ch.querySelector('.ch-img');
      const video = ch.querySelector('.ch-video');
      const lines = ch.querySelectorAll('.ch-line');

      if (!stage || !mask || !img) return;

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Mobile lightweight ScrollTrigger reveal (no scroll-pinning delay on mobile)
        gsap.set(mask, { scale: 1 });
        gsap.set(img, { scale: 1, filter: 'brightness(0.85) contrast(1.05)' });
        if (video) gsap.set(video, { scale: 1, opacity: 1 });
        gsap.set(lines, { y: 0, opacity: 1 });

        gsap.fromTo(
          stage,
          { opacity: 0.85, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      } else {
        // Desktop GSAP 160% Scrub Scroll Pinning
        gsap.set(mask, { scale: 0.78 });
        gsap.set(img, { scale: 1.1, filter: 'brightness(0.9) contrast(1.05)' });
        if (video) gsap.set(video, { scale: 1.1, opacity: 0 });
        gsap.set(lines, { y: 25, opacity: 0 });

        let bloomed = false;
        const bloom = (on) => {
          if (on === bloomed) return;
          bloomed = on;
          if (video) {
            gsap.to(video, {
              opacity: on ? 1 : 0,
              duration: 0.6,
              ease: 'power2.inOut',
            });
          }
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => bloom(self.progress > 0.4),
          },
        });

        tl.to(mask, { scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
          .to(img, { scale: 1.0, duration: 0.6, ease: 'power2.out' }, 0)
          .to(video, { scale: 1.0, duration: 0.6, ease: 'power2.out' }, 0)
          .to(lines, { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, 0.45);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full flex flex-col items-center bg-transparent my-2 md:my-4"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      {/* Clean Section Header */}
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 text-center mb-3 sm:mb-6 pointer-events-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-[#1C1C1C] hover:text-[#222222] hover:scale-[1.02] transition-all duration-350 leading-tight sm:leading-none tracking-tight cursor-default select-none">
          One Group. Three Disciplines.
        </h2>
      </div>

      {chapters.map((ch, idx) => (
        <section
          key={idx}
          className="dolly-chapter relative w-full min-h-[75vh] md:min-h-screen text-white overflow-hidden my-2 sm:my-4"
        >
          <div className="ch-stage relative w-full h-full md:h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 box-border overflow-hidden">
            {/* Top Empty Space */}
            <div className="relative z-20 w-full max-w-[1360px] mx-auto pointer-events-none" />

            {/* Center Mask & Video Frame */}
            <div
              className="ch-mask relative md:absolute inset-0 w-full min-h-[380px] md:h-full overflow-hidden cursor-pointer flex items-center justify-center rounded-none shadow-[0_40px_100px_rgba(0,0,0,0.85)] border border-[#FFEA0A]/40 group"
              onClick={() => router.push(ch.href)}
            >
              <img
                src={ch.image}
                alt={ch.title}
                className="ch-img absolute inset-0 w-full h-full object-cover block will-change-transform"
              />
              <video
                autoPlay
                muted
                loop
                playsInline
                className="ch-video absolute inset-0 w-full h-full object-cover block will-change-transform pointer-events-none"
              >
                <source src={ch.videoMp4} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121315]/95 via-[#121315]/30 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Caption Meta Box */}
            <div className="relative z-20 w-full max-w-[1360px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 pointer-events-auto bg-[#121315]/95 p-4 sm:p-6 md:p-8 border border-[#FFEA0A]/30 backdrop-blur-xl mt-4 md:mt-0">
              <div className="flex flex-col gap-1.5 sm:gap-2 max-w-2xl">
                <h3
                  onClick={() => router.push(ch.href)}
                  className="ch-line text-lg sm:text-2xl md:text-3xl font-black uppercase text-white hover:text-[#FFEA0A] transition-colors duration-300 cursor-pointer tracking-tight leading-snug sm:leading-none"
                >
                  {ch.title}
                </h3>
                <p className="ch-line text-gray-300 hover:text-white transition-colors duration-300 text-[11px] sm:text-xs md:text-sm font-light leading-relaxed max-w-xl">
                  {ch.desc}
                </p>
              </div>

              <button
                onClick={() => router.push(ch.href)}
                className="ch-line w-full md:w-auto bg-[#FFEA0A] text-[#121315] hover:bg-white hover:text-[#000000] uppercase tracking-[0.2em] text-[11px] sm:text-xs font-black py-3.5 sm:py-3.5 px-6 sm:px-7 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl flex-shrink-0 cursor-pointer"
              >
                Explore Discipline <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
