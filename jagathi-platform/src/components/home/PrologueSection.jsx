'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function PrologueSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    const targets = el.querySelectorAll('.prologue-reveal');
    gsap.fromTo(
      targets,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-12 py-16 md:py-24 text-white"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      <div className="border-t border-[#FFEA0A]/20 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Label */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="prologue-reveal font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold">
            {'// FIELD RECORD 1989—2026'}
          </span>
          <h2 className="prologue-reveal text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[1.05] text-white tracking-tight">
            Architectural Shaping & <br />
            <span className="text-[#FFEA0A]">Legacy Building</span>
          </h2>
          <div className="prologue-reveal w-16 h-[2px] bg-[#FFEA0A] my-2" />
        </div>

        {/* Center Text */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-gray-300 font-light text-sm md:text-base leading-relaxed">
          <p className="prologue-reveal text-white font-medium text-base md:text-lg">
            For over thirty-five years, Jagathi has operated at the intersection of heavy civil engineering, bespoke interior curation, and high-value land asset advisory.
          </p>
          <p className="prologue-reveal text-gray-400">
            Every structure we raise carries one non-negotiable directive: it must endure. We control the complete lifecycle — from raw land acquisition to structural concrete cores and turnkey handover — ensuring zero compromise in craftsmanship or execution timeline.
          </p>
        </div>

        {/* Right Ledger Specs */}
        <div className="lg:col-span-3 bg-[#121315]/90 border border-[#FFEA0A]/20 p-6 flex flex-col gap-4 shadow-xl">
          <span className="prologue-reveal font-mono text-[10px] tracking-[0.3em] uppercase text-[#FFEA0A]">
            {'// LEDGER SPECIFICATIONS'}
          </span>
          <div className="prologue-reveal flex justify-between items-center text-xs border-b border-white/10 pb-2">
            <span className="text-gray-400">FOUNDED</span>
            <span className="text-white font-bold font-mono">1989 BENGALURU</span>
          </div>
          <div className="prologue-reveal flex justify-between items-center text-xs border-b border-white/10 pb-2">
            <span className="text-gray-400">COMPLETED WORK</span>
            <span className="text-[#FFEA0A] font-bold font-mono">3.0M+ SQ. FT.</span>
          </div>
          <div className="prologue-reveal flex justify-between items-center text-xs border-b border-white/10 pb-2">
            <span className="text-gray-400">DELIVERED ASSETS</span>
            <span className="text-white font-bold font-mono">75+ PROJECTS</span>
          </div>
          <div className="prologue-reveal flex justify-between items-center text-xs">
            <span className="text-gray-400">COMPLIANCE</span>
            <span className="text-[#FFEA0A] font-bold font-mono">100% RERA / IS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
