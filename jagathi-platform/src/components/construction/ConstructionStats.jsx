'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ConstructionStats() {
  const statRef1 = useRef(null);
  const statRef2 = useRef(null);
  const statRef3 = useRef(null);
  const statRef4 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const statVal1 = { val: 0 };
    const statVal2 = { val: 0 };
    const statVal3 = { val: 0 };
    const statVal4 = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: '#proof',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(statVal1, {
          val: 1200,
          duration: 1.8,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (statRef1.current) statRef1.current.textContent = statVal1.val + 'T';
          }
        });
        gsap.to(statVal2, {
          val: 4500,
          duration: 1.8,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (statRef2.current) statRef2.current.textContent = statVal2.val + 'm³';
          }
        });
        gsap.to(statVal3, {
          val: 99,
          duration: 1.8,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (statRef3.current) statRef3.current.textContent = statVal3.val + '%';
          }
        });
        gsap.to(statVal4, {
          val: 9,
          duration: 1.8,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (statRef4.current) statRef4.current.textContent = String(statVal4.val);
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const statsData = [
    { ref: statRef1, init: '0T', label: 'Reinforcement Steel Laid', code: '// MAT_STEEL' },
    { ref: statRef2, init: '0m³', label: 'M50 Concrete Cast', code: '// MAT_CONCRETE' },
    { ref: statRef3, init: '0%', label: 'Safety Audit Compliance', code: '// AUDIT_SAFE' },
    { ref: statRef4, init: '0', label: 'Active Civic Markets', code: '// MARKETS_ACTIVE' }
  ];

  return (
    <section id="proof" className="relative z-10 w-full bg-[#FFEA0A] border-b border-[#121315]/10 text-[#121315]">
      <div style={{ width: '100%', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#121315]/15 border-b border-[#121315]/15">
          {statsData.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-16 md:py-20 px-6 text-center border-[#121315]/15"
              style={{ boxSizing: 'border-box' }}
            >
              <span className="text-[#121315]/50 font-mono text-[9px] block mb-4 tracking-[0.2em]">
                {s.code}
              </span>
              <div
                ref={s.ref}
                className="text-[#121315] font-bold font-mono leading-none mb-4"
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {s.init}
              </div>
              <div
                className="text-[#121315]/75 text-[10px] tracking-[0.2em] uppercase font-mono leading-relaxed"
                style={{ fontFamily: '"Outfit", sans-serif' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
