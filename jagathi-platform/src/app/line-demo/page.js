'use client';

import React from 'react';
import OrganicBackgroundLineTest from '../../components/home/OrganicBackgroundLineTest';

export default function LineDemoPage() {
  return (
    <div className="relative w-full bg-[#FFEA0A] text-black min-h-[3000px] flex flex-col items-center pt-20 px-8">
      {/* Dedicated Experimental Organic Background Line Component */}
      <OrganicBackgroundLineTest />

      <div className="relative z-10 w-full max-w-[800px] text-center my-10 bg-black/10 p-8 rounded-xl border border-black/20">
        <h1 className="text-3xl md:text-5xl font-black uppercase mb-4">Organic Line Sandbox</h1>
        <p className="text-sm md:text-base font-semibold uppercase tracking-wider text-black/80">
          Experimental test bench for refining OrganicBackgroundLineTest in isolation.
        </p>
      </div>

      {/* Markers down the test page to observe scroll sync */}
      {[500, 1000, 1500, 2000, 2500].map((height) => (
        <div key={height} className="relative z-10 my-[300px] bg-black/10 px-6 py-4 rounded-lg font-mono text-xs font-bold border border-black/20">
          SCROLL MARKER: {height}PX
        </div>
      ))}
    </div>
  );
}
