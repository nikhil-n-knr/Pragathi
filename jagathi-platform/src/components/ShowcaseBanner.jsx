'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/kenBurns.module.css';

function HoverStat({ registryId, target, suffix, isDecimal, label, coord }) {
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
      className="flex flex-col items-center px-4 py-8 md:py-10 cursor-default select-none"
      onMouseEnter={() => {
        setHovered(true);
        runCounter();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="text-3xl md:text-5xl lg:text-6xl font-black font-basement leading-none transition-colors duration-200 mb-2"
        style={{ color: hovered ? '#FFEA0A' : '#ffffff' }}
      >
        {display}{suffix}
      </div>
      <div
        className="text-[9px] md:text-[11px] tracking-widest uppercase font-semibold transition-colors duration-300"
        style={{ color: hovered ? '#FFEA0A' : 'rgba(255,255,255,0.6)' }}
      >
        {label}
      </div>
    </div>
  );
}

const stats = [
  { registryId: 'NODE_REGISTRY_01', target: 35,  suffix: '+',  isDecimal: false, label: 'Years of Legacy',   coord: 'LAT: 12.9716° N'    },
  { registryId: 'NODE_REGISTRY_02', target: 75,  suffix: '+',  isDecimal: false, label: 'Delivered Assets',  coord: 'LNG: 77.5946° E'    },
  { registryId: 'NODE_REGISTRY_03', target: 3,   suffix: 'M+', isDecimal: false, label: 'Sq. Ft. Completed', coord: 'ALT: 920.0 METERS'   },
  { registryId: 'NODE_REGISTRY_04', target: 100, suffix: '%',  isDecimal: false, label: 'Compliance Rating', coord: 'STATUS: COMPLIANT_OK' },
];

/* ─────────────────────────────────────
   Main showcase items
───────────────────────────────────────*/
const showcaseItems = [
  {
    index: 0, label: '01',
    title: 'The Jagathi Standard',
    subtitle: 'Quality without compromise',
    description: "Every project we touch carries one non-negotiable — it must outlast the generation that built it. No shortcuts in material selection, no tolerance for misaligned joints, no acceptance of 'good enough'. The Jagathi Standard is a singular commitment to permanence.",
    image: '/assets/images/showcase_jagathi_standard.webp',
    kenBurns: styles.kenBurns0,
  },
  {
    index: 1, label: '02',
    title: 'The Full Lifecycle',
    subtitle: 'Land to living — one team',
    description: "We acquire the land. We design the structure. We build the shell. We finish the interior. No gaps, no handoffs, no version loss between disciplines. When Jagathi takes a project from brief to handover, every phase is owned in-house.",
    image: '/assets/images/showcase_full_lifecycle.webp',
    kenBurns: styles.kenBurns1,
  },
  {
    index: 2, label: '03',
    title: '35 Years. Still Building.',
    subtitle: 'A legacy measured in skylines',
    description: "Since 1989, we have completed projects that define the skylines and communities of the regions we build in. Thirty-five years of earned trust, delivered on deadline, built on honesty. The benchmark is not the industry average — it is the last project we completed.",
    image: '/assets/images/showcase_35_years.webp',
    kenBurns: styles.kenBurns2,
  },
  {
    index: 3, label: '04',
    title: 'The Promise Delivered',
    subtitle: 'Every handover. On time.',
    description: "A build is only as strong as the trust that surrounds it. Jagathi's track record of on-time, on-spec delivery has made us the first call for clients who cannot afford surprises. We sign on accountability and we follow through — every single time.",
    image: '/assets/images/showcase_the_promise.webp',
    kenBurns: styles.kenBurns0,
  },
  {
    index: 4, label: '05',
    title: 'Precision at Every Level',
    subtitle: 'Engineered to the millimetre',
    description: "From the reinforcement spacing in a load-bearing column to the flush alignment of a door frame — Jagathi's quality process operates at a resolution that most developers never reach. Precision is not an attribute here. It is the baseline.",
    image: '/assets/images/showcase_precision.webp',
    kenBurns: styles.kenBurns1,
  },
];

/* ─────────────────────────────────────
   Main component
───────────────────────────────────────*/
export default function ShowcaseBanner({ onPlayReel }) {
  const [activeTab, setActiveTab] = useState(0);
  const autoRef = useRef(null);
  const sectionRef = useRef(null);

  const startAutoplay = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcaseItems.length);
    }, 4500);
  }, []);

  useEffect(() => { startAutoplay(); return () => clearInterval(autoRef.current); }, [startAutoplay]);

  // Click → switch + reset timer
  const handleTabClick = (index) => {
    clearInterval(autoRef.current);
    setActiveTab(index);
    startAutoplay();
  };

  // Hover → instantly switch + reset timer
  const handleTabHover = (index) => {
    if (index === activeTab) return;
    clearInterval(autoRef.current);
    setActiveTab(index);
    startAutoplay();
  };

  // When mouse leaves the section → resume autoplay
  const handleSectionLeave = () => { startAutoplay(); };

  // Scroll reveal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const targets = sectionRef.current?.querySelectorAll('.sc-reveal');
    if (!targets?.length) return;
    gsap.set(targets, { y: 36, opacity: 0 });
    const t = gsap.to(targets, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);

  const active = showcaseItems[activeTab];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#1C1C1C] overflow-hidden flex flex-col"
      style={{ fontFamily: '"Outfit", sans-serif', minHeight: '100vh' }}
      onMouseLeave={handleSectionLeave}
    >
      {/* ── Dimmed full-bleed BG ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {showcaseItems.map(({ index, image, kenBurns }) => (
          <div key={index} className="absolute inset-0 transition-opacity duration-900 ease-in-out"
            style={{ opacity: activeTab === index ? 1 : 0 }}>
            <img src={image} alt="" aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover block ${activeTab === index ? kenBurns : ''}`}
              style={{ filter: 'brightness(0.18) saturate(0.5)' }} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C] via-[#1C1C1C]/60 to-[#1C1C1C]" />
      </div>

      {/* ══════════════════════════════
          TOP: Centered title
      ══════════════════════════════ */}
      <div className="sc-reveal relative z-10 w-full text-center pt-24 md:pt-32 pb-14 md:pb-20 px-10">
        <span className="block text-[#FFEA0A]/70 font-mono text-xs md:text-sm uppercase tracking-[0.45em] font-semibold mb-6">
          {'// Who We Are'}
        </span>
        {/* Title turns yellow on hover */}
        <h2
          className="font-basement text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-wide leading-none text-white hover:text-[#FFEA0A] transition-colors duration-300 cursor-default select-none"
        >
          The Jagathi Story
        </h2>
      </div>

      {/* ══════════════════════════════════════════
          MIDDLE: Tabs left | Image bleeds right
      ══════════════════════════════════════════ */}
      <div 
        className="relative z-10 flex flex-col md:flex-row flex-1 items-stretch w-full max-w-[1200px] mx-auto" 
        style={{ paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', boxSizing: 'border-box' }}
      >

        {/* MOBILE ONLY: compact image strip above tabs */}
        <div className="block md:hidden w-full relative overflow-hidden" style={{ height: '220px' }}>
          {showcaseItems.map(({ index, image, title, kenBurns }) => (
            <div key={index} className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: activeTab === index ? 1 : 0, zIndex: activeTab === index ? 2 : 1 }}>
              <img src={image} alt={title}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover block ${activeTab === index ? kenBurns : ''}`}
                style={{ filter: 'brightness(0.78) contrast(1.05)' }} />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #1C1C1C 0%, transparent 100%)' }} />
        </div>

        {/* LEFT: Accordion tabs */}
        <div
          className="flex-shrink-0 flex flex-col justify-center w-full md:w-auto"
          style={{ maxWidth: '460px', paddingLeft: '0px', paddingRight: '1.5rem', paddingBottom: '4rem', paddingTop: '1.5rem', boxSizing: 'border-box' }}
        >
          {showcaseItems.map(({ index, label, title, subtitle, description }) => {
            const isActive = activeTab === index;
            return (
              <div
                key={index}
                className="sc-reveal relative border-b border-white/[0.07] last:border-b-0 cursor-pointer select-none"
                onClick={() => handleTabClick(index)}
                onMouseEnter={() => handleTabHover(index)}
              >
                {/* Yellow left bar */}
                <div className="absolute left-0 top-0 w-[2px] rounded-r-full bg-[#FFEA0A] transition-all duration-500 ease-in-out"
                  style={{ height: isActive ? '100%' : '0%' }} />

                {/* Header */}
                <div className="flex items-center gap-5 py-8 pl-14 pr-4">
                  <span className="font-mono text-sm font-bold tracking-[0.3em] flex-shrink-0 transition-colors duration-300"
                    style={{ color: isActive ? '#FFEA0A' : 'rgba(255,255,255,0.2)' }}>
                    {label}
                  </span>
                  <h3 className="font-basement text-lg md:text-xl lg:text-2xl xl:text-3xl font-black uppercase leading-tight transition-colors duration-300"
                    style={{ 
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.22)',
                      letterSpacing: '0.08em'
                    }}>
                    {title}
                  </h3>
                </div>

                {/* Accordion */}
                <div className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <div className="pl-14 pr-4 pb-8 flex flex-col gap-6">
                      <span className="text-[#FFEA0A] text-base md:text-lg font-semibold" style={{ letterSpacing: '0.05em' }}>{subtitle}</span>
                      <p className="text-white/60 text-base md:text-lg font-light" style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}>{description}</p>
                      {onPlayReel && (
                        <button onClick={(e) => { e.stopPropagation(); onPlayReel({ title: active.title, tag: active.label, image: active.image, desc: active.description }); }}
                          className="inline-flex items-center gap-2.5 mt-2 w-fit group">
                          <span className="w-7 h-7 rounded-full border border-[#FFEA0A]/40 flex items-center justify-center group-hover:bg-[#FFEA0A] transition-all duration-300 flex-shrink-0">
                            <span className="text-[#FFEA0A] text-xs group-hover:text-black transition-colors ml-0.5">▶</span>
                          </span>
                          <span className="text-[#FFEA0A] text-xs font-extrabold uppercase tracking-[0.22em] group-hover:text-white transition-colors">Watch Reel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Image — fills to right edge — desktop only */}
        <div className="hidden md:block flex-1 relative overflow-hidden rounded-tl-[20px] rounded-bl-[20px]">
          {/* Left blend */}
          <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #1C1C1C 0%, transparent 100%)' }} />
          {/* Bottom blend */}
          <div className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #1C1C1C 0%, transparent 100%)' }} />

          {/* Images */}
          {showcaseItems.map(({ index, image, title, kenBurns }) => (
            <div key={index} className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: activeTab === index ? 1 : 0, zIndex: activeTab === index ? 2 : 1 }}>
              <img src={image} alt={title}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover block ${activeTab === index ? kenBurns : ''}`}
                style={{ filter: 'brightness(0.88) contrast(1.05)' }} />
            </div>
          ))}

          {/* Active label */}
          <div className="absolute bottom-20 left-8 z-20 flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFEA0A] animate-pulse" />
            <span className="text-white/50 font-mono text-[10px] tracking-[0.25em] uppercase">
              {active.label} — {active.title}
            </span>
          </div>

          {/* Dot nav */}
          <div className="absolute top-5 right-6 z-20 flex gap-2.5">
            {showcaseItems.map(({ index }) => (
              <button key={index} onClick={() => handleTabClick(index)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: activeTab === index ? '#FFEA0A' : 'rgba(255,255,255,0.25)',
                  transform: activeTab === index ? 'scale(1.6)' : 'scale(1)',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM: Stats bar — full width over image
      ══════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Divider line */}
        <div className="w-full h-px bg-white/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 backdrop-blur-sm"
          style={{ background: 'rgba(66,66,66,0.75)' }}>
          {stats.map((stat) => (
            <HoverStat key={stat.registryId} {...stat} />
          ))}
        </div>
      </div>

    </section>
  );
}
