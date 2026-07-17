'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function CivilStats() {
  const statVal1 = useRef({ val: 0 });
  const statVal2 = useRef({ val: 0 });
  const statVal3 = useRef({ val: 0 });
  const statVal4 = useRef({ val: 0 });

  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const textRef3 = useRef(null);
  const textRef4 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: '#civil-proof',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(statVal1.current, {
          val: 48,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            if (textRef1.current) {
              textRef1.current.innerText = Math.floor(statVal1.current.val) + '+';
            }
          }
        });

        gsap.to(statVal2.current, {
          val: 12,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            if (textRef2.current) {
              textRef2.current.innerText = '₹' + Math.floor(statVal2.current.val) + 'Cr';
            }
          }
        });

        gsap.to(statVal3.current, {
          val: 6,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate: () => {
            if (textRef3.current) {
              textRef3.current.innerText = Math.floor(statVal3.current.val);
            }
          }
        });

        gsap.to(statVal4.current, {
          val: 100,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            if (textRef4.current) {
              textRef4.current.innerText = Math.floor(statVal4.current.val) + '%';
            }
          }
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const statsData = [
    { ref: textRef1, initial: '0+', label: '// ACTIVE_PLOTS', desc: 'Plotted assets cleared' },
    { ref: textRef2, initial: '₹0Cr', label: '// AVG_ASSET_YIELD', desc: 'Average portfolio yield' },
    { ref: textRef3, initial: '0', label: '// ZONE_CLUSTERS', desc: 'Sectors / Zones mapped' },
    { ref: textRef4, initial: '0%', label: '// LEGAL_CLEARANCE', desc: 'Secured title rate' }
  ];

  return (
    <section id="civil-proof" className="relative z-10 w-full bg-[#FFEA0A] border-b border-[#121315]/10 text-[#121315]">
      <div style={{ width: '100%', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#121315]/15 border-b border-[#121315]/15">
          {statsData.map((s, i) => (
            <div
              key={i}
              className="p-8 md:p-14 flex flex-col justify-between min-h-[220px]"
              style={{ boxSizing: 'border-box' }}
            >
              <span className="font-mono text-[9px] tracking-wider text-[#121315]/60 mb-8 block">
                {s.label}
              </span>
              <div>
                <span
                  ref={s.ref}
                  className="font-bold text-4xl md:text-6xl tracking-tight leading-none block mb-3"
                  style={{ fontFamily: '"Basement Grotesque","Syncopate",sans-serif' }}
                >
                  {s.initial}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#121315]/80 block">
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
