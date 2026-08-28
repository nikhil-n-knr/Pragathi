'use client';

import React from 'react';

export default function YellowDivider({ text = "UNCOMPROMISING STANDARDS // ENGINEERING EXCELLENCE // " }) {
  return (
    <section className="w-full bg-[#FFEA0A] text-[#121315] relative z-10 overflow-hidden flex items-center border-y border-[#121315]/10" style={{ height: '140px' }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repeat text to ensure it fills the screen for a marquee effect */}
        {[...Array(6)].map((_, i) => (
          <span 
            key={i} 
            className="font-black uppercase mx-4"
            style={{
              fontFamily: '"Basement Grotesque", "Syncopate", sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              letterSpacing: '0.05em'
            }}
          >
            {text}
          </span>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </section>
  );
}
