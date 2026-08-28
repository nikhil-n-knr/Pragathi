'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useFluid } from '../context/FluidContext';

// Row config — decompiled from out2 exactly
const rows = [
  {
    speed: 84,
    direction: 'left',
    words: [
      { text: 'INFRASTRUCTURE',   path: '/construction' },
      { text: 'CIVIL MARKET',     path: '/civil-market' },
      { text: 'INTERIOR DESIGN',  path: '/interior' },
      { text: 'CIVIL ENGINEERING',path: '/construction' },
    ],
    stroke: '#FFEA0A',
    glowColor: 'rgba(255, 234, 10, 0.5)',
  },
  {
    speed: 112,
    direction: 'right',
    words: [
      { text: 'ESTABLISHED 1989',      path: '/legacy-home' },
      { text: 'UNCOMPROMISED QUALITY', path: '/legacy-home' },
      { text: 'CONCEPT TO CURATION',   path: '/interior' },
    ],
    stroke: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.5)',
  },
];

export default function KineticHeadline() {
  // Scroll velocity from FluidContext — drives parallax shift between the two rows
  const { smoothScrollVel } = useFluid();

  // innerRefs — the actual scrolling track divs animated by GSAP
  const innerRef0 = useRef(null);
  const innerRef1 = useRef(null);

  // parentRefs — the outer container divs that listen for hover (pause/resume)
  const parentRef0 = useRef(null);
  const parentRef1 = useRef(null);

  const innerRefs   = [innerRef0, innerRef1];
  const parentRefs  = [parentRef0, parentRef1];

  // ── 1. GSAP infinite marquee + mouse-pause ─────────────────────────────
  useEffect(() => {
    const tweens = [];

    rows.forEach((row, rowIdx) => {
      const trackEl  = innerRefs[rowIdx].current;
      const parentEl = parentRefs[rowIdx].current;
      if (!trackEl || !parentEl) return;

      const halfWidth = trackEl.scrollWidth / 2;

      // Infinite GSAP tween using modifiers for seamless looping
      const tween = gsap.to(trackEl, {
        x: row.direction === 'right' ? halfWidth : -halfWidth,
        ease: 'none',
        duration: row.speed,
        repeat: -1,
        modifiers: {
          x: (rawX) => {
            const x = parseFloat(rawX);
            if (row.direction === 'right') {
              return `${(x % halfWidth) - halfWidth}px`;
            } else {
              return `${x % halfWidth}px`;
            }
          },
        },
      });

      tweens.push({ tween, target: trackEl });

      // Hover → pause / resume the marquee
      const pause   = () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: 'auto' });
      const resume  = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: 'auto' });

      parentEl.addEventListener('mouseenter', pause);
      parentEl.addEventListener('mouseleave', resume);
      parentEl._cleanMarquee = () => {
        parentEl.removeEventListener('mouseenter', pause);
        parentEl.removeEventListener('mouseleave', resume);
      };
    });

    return () => {
      tweens.forEach(({ tween, target }) => {
        tween.kill();
        const parent = target.parentElement;
        if (parent && parent._cleanMarquee) parent._cleanMarquee();
      });
    };
  }, []);

  // ── 2. Scroll-velocity parallax between rows ───────────────────────────
  useEffect(() => {
    let raf;
    const loop = () => {
      // smoothScrollVel.current is positive on scroll-down, negative on scroll-up
      const shift = -0.22 * (smoothScrollVel ? smoothScrollVel.current : 0);
      if (parentRef0.current) parentRef0.current.style.transform = `translateX(${shift}px)`;
      if (parentRef1.current) parentRef1.current.style.transform = `translateX(${-shift}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [smoothScrollVel]);

  return (
    <section className="relative z-10 pt-4 pb-6 md:pb-8 mb-6 md:mb-10 w-full">
      <div
        className="w-full py-2.5 sm:py-3.5 md:py-4 overflow-hidden bg-[#1C1C1C] select-none flex flex-col gap-1.5 md:gap-2 relative z-10 shadow-xl"
        style={{ transform: 'skewY(-1.8deg)' }}
      >
        {rows.map((row, rowIdx) => {
          const words = [...row.words, ...row.words, ...row.words, ...row.words, ...row.words, ...row.words];

          return (
            <div
              key={rowIdx}
              ref={parentRefs[rowIdx]}
              style={{ width: 'fit-content' }}
              className="flex whitespace-nowrap overflow-visible relative group/rail will-change-transform py-0.5"
            >
              <div
                ref={innerRefs[rowIdx]}
                style={{ willChange: 'transform' }}
                className="flex gap-6 md:gap-10 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider relative transition-opacity duration-300 leading-none"
              >
                {words.map((word, idx) => (
                  <div key={idx} className="flex items-center gap-6 md:gap-10 overflow-visible">
                    <Link
                      href={word.path}
                      className="inline-block relative transition-all duration-355 hover:scale-108 hover:z-20 hover:tracking-wide select-all font-bold"
                      style={{
                        transformOrigin: 'center center',
                        textShadow: '0 0 0px transparent',
                        color: 'transparent',
                        WebkitTextStroke: `1.5px ${row.stroke}`,
                        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textShadow = `0 0 20px ${row.glowColor}`;
                        e.target.style.color = row.stroke;
                        e.target.style.WebkitTextStroke = `1.5px ${row.stroke}`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textShadow = '0 0 0px transparent';
                        e.target.style.color = 'transparent';
                        e.target.style.WebkitTextStroke = `1.5px ${row.stroke}`;
                      }}
                      data-interactive="true"
                    >
                      {word.text}
                    </Link>
                    <span className="text-[#FFEA0A]/40 text-xl md:text-3xl font-light select-none">•</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
