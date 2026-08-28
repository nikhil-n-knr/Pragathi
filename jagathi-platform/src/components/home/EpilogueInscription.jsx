'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const sentenceWords = [
  'Concrete', 'does', 'not', 'apologise.', 'It', 'records', '—', 'the', 'weather,', 'the', 'century,', 'the', 'hand', 'of', 'the', 'pour', '—', 'and', 'waits', 'to', 'be', 'read.'
];

export default function EpilogueInscription() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.epi-word');

    gsap.fromTo(
      words,
      { opacity: 0.12, filter: 'blur(7px)', y: 10 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 55%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full py-28 md:py-40 bg-transparent text-white text-center overflow-hidden"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold block mb-8">
          {'// EPILOGUE / INSCRIPTION RECORD'}
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-wide leading-relaxed max-w-4xl text-white flex flex-wrap justify-center gap-x-3 gap-y-2">
          {sentenceWords.map((word, idx) => {
            const isHighlight = ['and', 'waits', 'to', 'be', 'read.'].includes(word);
            return (
              <span
                key={idx}
                className={`epi-word inline-block will-change-transform ${
                  isHighlight ? 'text-[#FFEA0A] underline decoration-[#FFEA0A]/40 underline-offset-8' : ''
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
