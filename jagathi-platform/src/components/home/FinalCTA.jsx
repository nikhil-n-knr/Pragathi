'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Special characters helper component to manage local hover and SVGs
const SpecialChar = ({ type, resolvedChar, active }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSVGActive = active || isHovered;

  // Compass SVG for 'A' in DRAFTING
  const renderCompass = () => (
    <span className="relative inline-flex items-center justify-center overflow-visible select-none" style={{ width: '0.85em', height: '1.2em' }}>
      <span className={`transition-all duration-700 absolute inset-0 flex items-center justify-center ${isSVGActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {resolvedChar}
      </span>
      <span 
        className="absolute pointer-events-none origin-center flex items-center justify-center"
        style={{ 
          width: '1.3em', 
          height: '1.3em',
          opacity: isSVGActive ? 1 : 0,
          transform: isSVGActive ? 'scale(1.25)' : 'scale(0.5)',
          transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg className="w-full h-full text-[#424242]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v2" />
          <path d="M12 6L7 19h10L12 6z" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        </svg>
      </span>
    </span>
  );

  // Horizon line for 'T' in FUTURE
  const renderHorizon = () => (
    <span className="relative inline-flex items-center justify-center overflow-visible select-none" style={{ width: '0.85em', height: '1.2em' }}>
      <span className={`transition-all duration-700 absolute inset-0 flex items-center justify-center ${isSVGActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {resolvedChar}
      </span>
      <span 
        className="absolute pointer-events-none origin-center flex items-center justify-center"
        style={{ 
          width: '1.3em', 
          height: '1.3em',
          opacity: isSVGActive ? 1 : 0,
          transform: isSVGActive ? 'scale(1.25)' : 'scale(0.5)',
          transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg className="w-full h-full text-[#424242] overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14" />
          <path d="M2 5h20" />
        </svg>
      </span>
    </span>
  );

  // Spinning Voxel Circle for 'C' in STRUCTURAL
  const renderVoxel = () => (
    <span className="relative inline-flex items-center justify-center overflow-visible select-none" style={{ width: '0.85em', height: '1.2em' }}>
      <span className={`transition-all duration-700 absolute inset-0 flex items-center justify-center ${isSVGActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {resolvedChar}
      </span>
      <span 
        className="absolute pointer-events-none origin-center flex items-center justify-center"
        style={{ 
          width: '1.3em', 
          height: '1.3em',
          opacity: isSVGActive ? 1 : 0,
          transform: isSVGActive ? 'scale(1.35)' : 'scale(0.5)',
          transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg className="w-full h-full text-[#424242] animate-spin" style={{ animationDuration: '3.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
          <path d="M12 2v20M2 12h20" strokeWidth="0.75" strokeDasharray="1 1" />
        </svg>
      </span>
    </span>
  );

  // Bulb SVG for 'V' in ENVIRONMENTS
  const renderBulb = () => (
    <span className="relative inline-flex items-center justify-center overflow-visible select-none" style={{ width: '0.85em', height: '1.2em' }}>
      <span className={`transition-all duration-700 absolute inset-0 flex items-center justify-center ${isSVGActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {resolvedChar}
      </span>
      <span 
        className="absolute pointer-events-none origin-center flex items-center justify-center"
        style={{ 
          width: '1.3em', 
          height: '1.3em',
          opacity: isSVGActive ? 1 : 0,
          transform: isSVGActive ? 'scale(1.25) translateY(-4px)' : 'scale(0.5) translateY(0px)',
          transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg className="w-full h-full text-[#424242] overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18h6M10 20h4" strokeLinecap="round"/>
          <path d="M7.5 10.5c0-3 2-5 4.5-5s4.5 2 4.5 5c0 1.5-1 2.5-2 3.5l-1 1.5h-3l-1-1.5c-1-1-2-2-2-3.5Z"/>
          <path d="M12 7v5" strokeLinecap="round"/>
          <polygon 
            points="12,14 1,24 23,24" 
            fill="rgba(66, 66, 66, 0.18)" 
            stroke="rgba(66, 66, 66, 0.5)" 
            strokeWidth="0.75" 
            strokeDasharray="2 2"
            className="animate-pulse"
          />
        </svg>
      </span>
    </span>
  );

  // Upward trend line arrow for 'E' in INVESTMENT
  const renderTrend = () => (
    <span className="relative inline-flex items-center justify-center overflow-visible select-none" style={{ width: '0.85em', height: '1.2em' }}>
      <span className={`transition-all duration-700 absolute inset-0 flex items-center justify-center ${isSVGActive ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {resolvedChar}
      </span>
      <span 
        className="absolute pointer-events-none origin-center flex items-center justify-center"
        style={{ 
          width: '1.3em', 
          height: '1.3em',
          opacity: isSVGActive ? 1 : 0,
          transform: isSVGActive ? 'scale(1.25)' : 'scale(0.5)',
          transition: 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <svg className="w-full h-full text-[#424242]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 5H8v14h9" />
          <path d="M8 12h5l6-6M19 6h-4M19 6v4" />
        </svg>
      </span>
    </span>
  );

  return (
    <span className="inline-block text-[#424242]">
      {type === 'compass' && renderCompass()}
      {type === 'horizon' && renderHorizon()}
      {type === 'voxel' && renderVoxel()}
      {type === 'bulb' && renderBulb()}
      {type === 'trend' && renderTrend()}
    </span>
  );
};

// Word level morphing & slide wrapper component
const Word = ({ wordData, wordIdx, activeWordIdx }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAutoActive = activeWordIdx === wordIdx;
  const isActive = isHovered || isAutoActive;

  return (
    <span 
      className="relative inline-block overflow-visible cursor-pointer py-1 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible structural base holding the exact width of the bold font to avoid reflow shake */}
      <span className="invisible select-none opacity-0 pointer-events-none font-black whitespace-nowrap">
        {wordData.original}
      </span>

      {/* Visible absolute overlay that slides and changes weight cleanly */}
      <span 
        className="absolute inset-0 flex flex-row items-center justify-center transition-all duration-[750ms] overflow-visible"
        style={{
          fontWeight: isActive ? 100 : 900,
          filter: isActive ? 'blur(1.5px)' : 'blur(0px)',
          transform: isActive ? 'translateY(4px)' : 'translateY(0px)',
          transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {wordData.original.split('').map((char, charIdx) => {
          const isSpecialChar = charIdx === wordData.specialIdx;
          const showSVG = isSpecialChar && isActive;

          if (isSpecialChar) {
            return (
              <SpecialChar 
                key={charIdx} 
                type={wordData.type} 
                resolvedChar={char} 
                active={showSVG} 
              />
            );
          } else {
            return (
              <span 
                key={charIdx} 
                className="inline-block overflow-hidden h-[1.25em] relative select-none"
                style={{ width: '0.65em', textAlign: 'center' }}
              >
                <span 
                  className="inline-block transition-transform duration-700 select-none"
                  style={{
                    transform: isActive ? 'translateY(4px)' : 'translateY(0px)',
                    transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                >
                  {char}
                </span>
              </span>
            );
          }
        })}
      </span>
    </span>
  );
};

// Panel Text Slot Machine precision slide (mechanical lock)
const PanelSlotText = ({ text, isHovered }) => {
  const letters = text.split('');
  return (
    <span 
      className="flex items-center justify-center gap-[0.02em] font-black tracking-wider leading-none transition-all duration-[750ms]"
      style={{
        fontWeight: isHovered ? 200 : 900,
        filter: isHovered ? 'blur(0.5px)' : 'blur(0px)',
        transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {letters.map((char, idx) => {
        if (char === ' ') return <span key={idx}>&nbsp;</span>;
        return (
          <span 
            key={idx} 
            className="inline-block overflow-hidden h-[1.25em] relative"
            style={{ width: '0.75em', textAlign: 'center' }}
          >
            <span 
              className="inline-block transition-transform duration-700"
              style={{ 
                transform: isHovered ? 'translateY(4px)' : 'translateY(0%)',
                transitionDelay: `${idx * 0.015}s`, // precision lock ripple
                transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default function FinalCTA() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [activeWordIdx, setActiveWordIdx] = useState(null);
  const [hoveredPanel, setHoveredPanel] = useState(null); // null, 1, 2

  const wordsData = [
    { word: "Drafting", specialIdx: 2, type: "compass", original: "DRAFTING" },
    { word: "the", specialIdx: -1, original: "THE" },
    { word: "future", specialIdx: 2, type: "horizon", original: "FUTURE" },
    { word: "of", specialIdx: -1, original: "OF" },
    { word: "structural", specialIdx: 4, type: "voxel", original: "STRUCTURAL" },
    { word: "environments", specialIdx: 2, type: "bulb", original: "ENVIRONMENTS" },
    { word: "for", specialIdx: -1, original: "FOR" },
    { word: "elite", specialIdx: -1, original: "ELITE" },
    { word: "investment", specialIdx: 7, type: "trend", original: "INVESTMENT" },
    { word: "horizons.", specialIdx: -1, original: "HORIZONS." }
  ];

  const specialWordIndices = [0, 2, 4, 5, 8];

  // 2-Second Heartbeat loop: thins out a random word & reveals its SVG
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const randomIdx = specialWordIndices[Math.floor(Math.random() * specialWordIndices.length)];
      setActiveWordIdx(randomIdx);

      // Kept active for 2200ms (1.5s fade-in is fully complete, then slides back)
      setTimeout(() => {
        setActiveWordIdx(null);
      }, 2200);

    }, 4000); // 4 seconds total interval guarantees 1800ms rest between heartbeat loops

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 bg-transparent text-[#424242] border-t border-[#424242]/15 w-full flex flex-col items-center justify-center overflow-visible select-none"
      style={{
        paddingTop: 'clamp(6rem, 10vw, 12rem)',
        paddingBottom: 'clamp(18rem, 24vw, 32rem)',
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 900
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center overflow-visible">
        {/* Living Blueprint Headline */}
        <h2 
          className="text-[#424242] font-black text-3xl md:text-5xl lg:text-[2.65rem] uppercase tracking-wider leading-tight text-center w-full select-none overflow-visible flex flex-wrap justify-center items-center gap-x-[0.3em] gap-y-[0.1em] font-sans"
          style={{ letterSpacing: '0.05em', fontFamily: '"Basement Grotesque", "Syncopate", sans-serif' }}
        >
          {wordsData.map((wData, wIdx) => (
            <Word 
              key={wIdx} 
              wordData={wData} 
              wordIdx={wIdx} 
              activeWordIdx={activeWordIdx} 
            />
          ))}
        </h2>

        {/* Advisory Subtext */}
        <p 
          className="text-[#424242]/75 font-sans font-light text-xs md:text-sm lg:text-base mt-8 leading-relaxed text-center max-w-xl split-reveal"
          style={{ fontWeight: 300 }}
        >
          Begin matching your investment horizon or spatial execution parameters with our specialist advisory desk.
        </p>

        {/* Massive Split Monoliths Buttons Layout */}
        <div className="w-full flex flex-col md:flex-row gap-6 mt-20 max-w-5xl mx-auto overflow-visible items-stretch split-reveal">
          
          {/* Panel 1: Request Consultation */}
          <div 
            onMouseEnter={() => setHoveredPanel(1)}
            onMouseLeave={() => setHoveredPanel(null)}
            onClick={() => window.location.href = "mailto:info@jagathi.com"}
            className="border border-[#424242] relative overflow-hidden flex flex-col justify-center items-center h-[260px] cursor-pointer bg-transparent text-[#424242] hover:bg-[#424242] hover:text-[#FFEA0A] p-8 text-center"
            style={{
              flexGrow: hoveredPanel === 1 ? 1.85 : hoveredPanel === 2 ? 1.0 : 1.4,
              flexBasis: '0px',
              willChange: 'flex-grow',
              transition: 'flex-grow 0.75s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.5s cubic-bezier(0.25, 1, 0.5, 1), color 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Grid background layer drawing on hover */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-grid-pattern z-0"
              style={{ 
                opacity: hoveredPanel === 1 ? 0.16 : 0,
                backgroundImage: 'linear-gradient(rgba(66, 66, 66, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 66, 66, 0.2) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            {/* Panel text content */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[1.35rem] md:text-[1.65rem] lg:text-[1.85rem] block mb-3 leading-none uppercase">
                <PanelSlotText text="REQUEST CONSULTATION" isHovered={hoveredPanel === 1} />
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] opacity-85 block uppercase mt-1">
                // INTERSPACE ENTRY
              </span>
            </div>
          </div>

          {/* Panel 2: Advisory Desk */}
          <div 
            onMouseEnter={() => setHoveredPanel(2)}
            onMouseLeave={() => setHoveredPanel(null)}
            onClick={() => router.push('/civil-market')}
            className="border border-[#424242] relative overflow-hidden flex flex-col justify-center items-center h-[260px] cursor-pointer bg-transparent text-[#424242] hover:bg-[#424242] hover:text-[#FFEA0A] p-8 text-center"
            style={{
              flexGrow: hoveredPanel === 2 ? 1.85 : hoveredPanel === 1 ? 1.0 : 1.4,
              flexBasis: '0px',
              willChange: 'flex-grow',
              transition: 'flex-grow 0.75s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.5s cubic-bezier(0.25, 1, 0.5, 1), color 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Coordinate line tracker sweeping on hover */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-[#424242]/70 pointer-events-none transition-all duration-1000 ease-in-out z-0"
              style={{
                left: hoveredPanel === 2 ? '100%' : '-10%',
                opacity: hoveredPanel === 2 ? 1 : 0
              }}
            />
            {/* Panel text content with kinetic lag translation */}
            <div 
              className="relative z-10 flex flex-col items-center transition-transform duration-500 ease-out"
              style={{
                transform: hoveredPanel === 2 ? 'translateX(15px)' : 'translateX(0)'
              }}
            >
              <span className="text-[1.35rem] md:text-[1.65rem] lg:text-[1.85rem] block mb-3 leading-none uppercase">
                <PanelSlotText text="ADVISORY DESK" isHovered={hoveredPanel === 2} />
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] opacity-85 block uppercase mt-1">
                // SECURE CORRIDORS
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
