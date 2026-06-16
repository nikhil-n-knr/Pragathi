'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ProofStrip() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const counters = gsap.utils.toArray('.metric-number');
    const countersTweens = counters.map(counter => {
      const targetVal = parseFloat(counter.getAttribute('data-value'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const obj = { val: 0 };

      return gsap.to(obj, {
        val: targetVal,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top bottom-=60px',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = (isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
        }
      });
    });

    return () => {
      countersTweens.forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="relative z-10 bg-zinc-950/45 border-y border-yellow-400/15 w-full flex justify-center py-16 split-reveal">
      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-yellow-400/10 text-center">
        
        {/* Metric 1 */}
        <div className="flex flex-col items-center px-4 py-4 justify-between h-32">
          <span className="text-yellow-400/30 font-mono text-[8px] uppercase tracking-widest block">// NODE_REGISTRY_01</span>
          <div 
            className="metric-number text-yellow-400 text-3xl md:text-5xl font-black font-mono leading-none my-2"
            data-value="35"
            data-suffix="+"
          >
            0+
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-300 text-[10px] tracking-widest uppercase font-semibold">Years of Legacy</div>
            <span className="text-yellow-400/20 font-mono text-[7px] block mt-1">LAT: 12.9716° N</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col items-center px-4 py-4 justify-between h-32">
          <span className="text-yellow-400/30 font-mono text-[8px] uppercase tracking-widest block">// NODE_REGISTRY_02</span>
          <div 
            className="metric-number text-yellow-400 text-3xl md:text-5xl font-black font-mono leading-none my-2"
            data-value="450"
            data-suffix="+"
          >
            0+
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-300 text-[10px] tracking-widest uppercase font-semibold">Delivered Assets</div>
            <span className="text-yellow-400/20 font-mono text-[7px] block mt-1">LNG: 77.5946° E</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col items-center px-4 py-4 justify-between h-32">
          <span className="text-yellow-400/30 font-mono text-[8px] uppercase tracking-widest block">// NODE_REGISTRY_03</span>
          <div 
            className="metric-number text-yellow-400 text-3xl md:text-5xl font-black font-mono leading-none my-2"
            data-value="1.2"
            data-suffix="M+"
            data-decimal="true"
          >
            0.0M+
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-300 text-[10px] tracking-widest uppercase font-semibold">Sq. Ft. Completed</div>
            <span className="text-yellow-400/20 font-mono text-[7px] block mt-1">ALT: 920.0 METERS</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col items-center px-4 py-4 justify-between h-32">
          <span className="text-yellow-400/30 font-mono text-[8px] uppercase tracking-widest block">// NODE_REGISTRY_04</span>
          <div 
            className="metric-number text-yellow-400 text-3xl md:text-5xl font-black font-mono leading-none my-2"
            data-value="100"
            data-suffix="%"
          >
            0%
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-300 text-[10px] tracking-widest uppercase font-semibold">Compliance Rating</div>
            <span className="text-yellow-400/20 font-mono text-[7px] block mt-1">STATUS: COMPLIANT_OK</span>
          </div>
        </div>

      </div>
    </section>
  );
}
