'use client';

import React, { useState, useEffect } from 'react';
import { FluidProvider } from '../context/FluidContext';
import CustomCursor from '../components/CustomCursor';
import Preloader from '../components/Preloader';
import Header from '../components/Header';

export default function MainLayout({ children }) {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Lock scrolling on page load while preloader is active
    if (!loadingComplete) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, [loadingComplete]);

  return (
    <FluidProvider>
      {/* 1. Black & Yellow Cinematic Preloader Sequence */}
      <Preloader onComplete={() => setLoadingComplete(true)} />

      {/* 2. Custom Dual-Stage Spring Cursor */}
      <CustomCursor />

      {/* 4. Global SVG Melting & Silk Displacement Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="melting-noise">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01 0.08" 
              numOctaves="2" 
              result="noise" 
            />
            <feDisplacementMap 
              id="global-melt-map" 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
          <filter id="silk-wave">
            <feTurbulence 
              id="silk-turbulence"
              type="fractalNoise" 
              baseFrequency="0.03 0.0" 
              numOctaves="2" 
              seed="0"
              result="noise" 
            />
            <feDisplacementMap 
              id="silk-wave-map" 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* 5. Persistent navigation elements and content */}
      <div 
        className="relative z-10 flex flex-col min-h-screen"
        style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Global Grain Texture Overlay */}
        <div className="noise-overlay" />
        
        <Header />
        <main className="flex-grow w-full flex flex-col items-center">
          {children}
        </main>
      </div>
    </FluidProvider>
  );
}
