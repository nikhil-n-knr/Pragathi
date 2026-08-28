'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const LAT_START = 12.9716; // Bengaluru HQ
const LAT_END = 34.0736;   // Beverly Hills / Extended reach

export default function MeridianRail() {
  const [progress, setProgress] = useState(0);
  const [currentLat, setCurrentLat] = useState(LAT_START.toFixed(4) + '°N');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        const lat = LAT_START + (LAT_END - LAT_START) * p;
        setCurrentLat(lat.toFixed(4) + '°N');
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-40 pointer-events-none select-none text-white/70"
      style={{ fontFamily: 'monospace', fontSize: '10px' }}
    >
      <span className="font-bold tracking-widest text-[#FFEA0A]">N</span>

      <div className="relative w-[2px] h-[220px] bg-white/10 rounded-full overflow-hidden">
        {/* Track Fill */}
        <div
          className="absolute top-0 left-0 w-full bg-[#FFEA0A] origin-top transition-transform duration-100 ease-out"
          style={{ height: '100%', transform: `scaleY(${progress})` }}
        />
        {/* Glowing Dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FFEA0A] shadow-[0_0_8px_#FFEA0A]"
          style={{ top: `${progress * 212}px` }}
        />
      </div>

      <span className="font-bold tracking-widest text-white/50">S</span>

      <span className="mt-2 font-mono text-[9px] tracking-widest text-[#FFEA0A] font-bold">
        {currentLat}
      </span>
    </aside>
  );
}
