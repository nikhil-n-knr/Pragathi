'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';

const stats = [
  { target: 35,  suffix: '+',  isDecimal: false, label: 'Years of Legacy' },
  { target: 75,  suffix: '+',  isDecimal: false, label: 'Projects Delivered' },
  { target: 3,   suffix: 'M+', isDecimal: false, label: 'Sq. Ft. Completed' },
];

function CTAStat({ target, suffix, isDecimal, label }) {
  const [display, setDisplay] = useState('0');
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const elementRef = useRef(null);

  const runCounter = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(intervalRef.current);
    
    // Set up auto re-run interval of 20s
    intervalRef.current = setInterval(() => {
      runCounter();
    }, 20000);

    const steps = 60;
    const duration = 1400;
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      if (step >= steps) {
        setDisplay(isDecimal ? target.toFixed(1) : String(Math.floor(target)));
        clearInterval(timerRef.current);
      } else {
        setDisplay(isDecimal ? current.toFixed(1) : String(Math.floor(current)));
      }
    }, duration / steps);
  }, [target, isDecimal]);

  useEffect(() => {
    // Start interval
    intervalRef.current = setInterval(() => {
      runCounter();
    }, 20000);

    // Run when scrolled into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCounter();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(intervalRef.current);
      observer.disconnect();
    };
  }, [runCounter]);

  return (
    <div
      ref={elementRef}
      className="stat-item flex flex-col items-center justify-center py-6 md:py-8 px-3 opacity-0 select-none cursor-default"
      onMouseEnter={() => {
        setHovered(true);
        runCounter();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="font-bold leading-none mb-2 transition-colors duration-200"
        style={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          color: hovered ? '#FFEA0A' : '#ffffff'
        }}
      >
        {display}{suffix}
      </div>
      <div
        className="uppercase tracking-widest font-mono transition-colors duration-200"
        style={{
          fontSize: 'clamp(6px, 1.5vw, 10px)',
          color: hovered ? '#FFEA0A' : 'rgba(255,255,255,0.5)'
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      [line1Ref.current, line2Ref.current, line3Ref.current],
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.0, ease: 'power4.out', stagger: 0.12 }
    )
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(btnsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo(
        statsRef.current?.querySelectorAll('.stat-item'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: '100svh', fontFamily: '"Outfit", sans-serif' }}
    >
      {/* ── Full-bleed background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/finalcta_bg.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.22) saturate(0.6) contrast(1.1)' }}
        />
        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.30) 50%, rgba(10,10,10,0.80) 100%)' }}
        />
        {/* Left edge vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.45) 0%, transparent 60%)' }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-[1600px] mx-auto px-10 md:px-12 lg:px-20 xl:px-24 pt-20 md:pt-28 pb-40 md:pb-52">

        {/* Mono label */}
        <span className="text-[#FFEA0A]/60 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] mb-8 md:mb-10 block">
          {'// Begin Your Build'}
        </span>

        {/* Headline — 3 staggered lines */}
        <div className="overflow-hidden mb-3 md:mb-4">
          <h2
            ref={line1Ref}
            className="text-white font-bold uppercase leading-none"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              transform: 'translateY(110%)'
            }}
          >
            Ready to Build
          </h2>
        </div>
        <div className="overflow-hidden mb-3 md:mb-4">
          <h2
            ref={line2Ref}
            className="text-[#FFEA0A] font-bold uppercase leading-none"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              transform: 'translateY(110%)'
            }}
          >
            Something That
          </h2>
        </div>
        <div className="overflow-hidden mb-10 md:mb-14">
          <h2
            ref={line3Ref}
            className="text-white font-bold uppercase leading-none"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              transform: 'translateY(110%)'
            }}
          >
            Lasts Forever?
          </h2>
        </div>

        {/* Subtext */}
        <p
          ref={subRef}
          className="text-white/55 font-light text-sm md:text-lg max-w-xl leading-relaxed mb-10 md:mb-12 opacity-0"
          style={{ fontFamily: '"Outfit", sans-serif' }}
        >
          From site acquisition to the final material swatch, Jagathi manages every phase with zero tolerance for compromise. Reach our advisory desk — we answer within 24 hours.
        </p>

        {/* CTA Buttons */}
        <div
          ref={btnsRef}
          className="flex flex-col sm:flex-row gap-4 opacity-0"
        >
          <a
            href="mailto:info@jagathi.co"
            className="group inline-flex items-center justify-center gap-3 bg-[#FFEA0A] text-[#1a1a1a] px-8 py-4 uppercase text-xs md:text-sm tracking-[0.2em] font-bold hover:bg-white transition-all duration-300"
            data-interactive
            id="finalcta-consult-btn"
          >
            Request Consultation
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-base">→</span>
          </a>
          <Link
            href="/#landmarks"
            className="group inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 uppercase text-xs md:text-sm tracking-[0.2em] font-semibold hover:border-[#FFEA0A] hover:text-[#FFEA0A] transition-all duration-300"
            data-interactive
            id="finalcta-portfolio-btn"
          >
            Explore Portfolio
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-base">→</span>
          </Link>
        </div>
      </div>

      {/* ── Stats bar — pinned to bottom ── */}
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="h-px bg-white/10 w-full" />
        <div
          className="grid grid-cols-3 divide-x divide-white/10 w-full"
          style={{ background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(12px)' }}
        >
          {stats.map((s, i) => (
            <CTAStat
              key={i}
              {...s}
            />
          ))}
        </div>
      </div>

      {/* Subtle grid overlay texture */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
    </section>
  );
}
