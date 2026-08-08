import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoTypography() {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);

  const words = [
    'Everything',
    'your',
    'autonomous',
    'network',
    'needs,',
    'deployed',
    'into',
    'one',
    'unified',
    'ecosystem.',
  ];

  // 1:1 GSAP progressive opacity scrub matching Ref/generated-page.html line 948
  useEffect(() => {
    const wordSpans = wordsRef.current.filter(Boolean);
    if (!wordSpans.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordSpans,
        { autoAlpha: 0.15, y: '0.4em' },
        {
          autoAlpha: 1,
          y: '0em',
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="noema-manifesto"
      className="relative min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-center justify-center py-24 px-6 font-sans"
    >
      {/* Radial Gradient Wash matching Ref/generated-page.html line 315 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(13,148,136,0.18),transparent_32%),radial-gradient(circle_at_80%_72%,rgba(16,185,129,0.18),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1180px] flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-[0.18em] text-center">
        {words.map((word, idx) => (
          <span
            key={idx}
            ref={(el) => (wordsRef.current[idx] = el)}
            className="inline-block font-extrabold tracking-tighter uppercase leading-[0.9] text-slate-900"
            style={{
              fontSize: 'clamp(2.4rem, 7.8vw, 7.4rem)',
              willChange: 'opacity, transform',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <p className="absolute left-6 bottom-6 z-10 text-[0.72rem] tracking-[0.18em] uppercase font-bold text-slate-500">
        04 / ARCHITECTURE MANIFESTO — ΠSPARROW
      </p>
    </section>
  );
}
