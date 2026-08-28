'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyVolumeCTA() {
  const router = useRouter();

  return (
    <section
      id="volume"
      className="relative z-10 w-full max-w-[1360px] mx-auto px-6 md:px-12 py-20 md:py-28 text-white"
      style={{ fontFamily: '"Basement Grotesque", sans-serif' }}
    >
      <div className="bg-[#121315] border border-[#FFEA0A]/30 p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        {/* Left: 3D Book / Ledger Presentation Card */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[340px] aspect-[3/4] bg-[#1C1C1C] border-2 border-[#FFEA0A] p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] transform -rotate-1 hover:rotate-0 transition-transform duration-500 group">
            <div className="flex justify-between items-center border-b border-[#FFEA0A]/30 pb-4">
              <span className="font-mono text-[9px] text-[#FFEA0A] tracking-widest font-bold">
                JAGATHI · EDITION I
              </span>
              <span className="font-mono text-[9px] text-gray-400">1989—2026</span>
            </div>
            <div className="my-auto py-8">
              <h3 className="text-3xl font-black uppercase text-white tracking-wider leading-none mb-2">
                JAGATHI <br />
                <span className="text-[#FFEA0A]">DOSSIER✚</span>
              </h3>
              <p className="font-mono text-[10px] text-gray-400 tracking-widest uppercase mt-4">
                A FIELD SPECIFICATION FOR HEAVY CIVIL & LUXURY SPACES
              </p>
            </div>
            <div className="pt-4 border-t border-[#FFEA0A]/30 flex justify-between items-center font-mono text-[9px] text-gray-400">
              <span>528 PLATES</span>
              <span className="text-[#FFEA0A] font-bold">LIMITED ARCHIVE</span>
            </div>
          </div>
        </div>

        {/* Right: Info & Consultation Action */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA0A] font-bold">
            {'// THE RECORD & CONSULTATION BRIEF'}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            The Whole Record, <br />
            <span className="text-[#FFEA0A]">Engineered for You.</span>
          </h2>

          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
            Ready to initiate a master-scale build, commission turnkey interior spatial design, or secure prime plotted land corridors? Our senior engineering directorate works directly with clients from brief to final sign-off.
          </p>

          {/* Specs Table */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-6 font-mono text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">CAPACITY</span>
              <span className="text-white font-bold uppercase">HEAVY CIVIL & COMMERCIAL</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">TIMELINE</span>
              <span className="text-[#FFEA0A] font-bold uppercase">GUARANTEED HANDOVER</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">LOCATION COVERAGE</span>
              <span className="text-white font-bold uppercase">SOUTH INDIA & SELECT US</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">DISCIPLINE INTEGRATION</span>
              <span className="text-[#FFEA0A] font-bold uppercase">100% IN-HOUSE</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => router.push('/contact')}
              className="bg-[#FFEA0A] text-[#121315] hover:bg-white uppercase tracking-[0.2em] text-xs font-black py-4 px-8 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              Initiate Project Brief <span>→</span>
            </button>
            <button
              onClick={() => router.push('/construction')}
              className="border border-[#FFEA0A]/40 text-[#FFEA0A] hover:bg-[#FFEA0A]/10 uppercase tracking-[0.2em] text-xs font-bold py-4 px-8 transition-all flex items-center justify-center gap-3"
            >
              Explore Disciplines
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
