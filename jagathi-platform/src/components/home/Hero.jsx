'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function Hero() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasIntroduced = false;
    const playIntro = () => {
      if (hasIntroduced) return;
      hasIntroduced = true;

      const tl = gsap.timeline();
      tl.fromTo('.hero-title-reveal', 
        { y: '100%' },
        { y: '0%', duration: 1.5, ease: 'power4.out', delay: 0.4 }
      );
      tl.fromTo('.hero-subtitle', 
        { opacity: 0, letterSpacing: '0.1em' },
        { opacity: 1, letterSpacing: '0.3em', duration: 1.8, ease: 'power3.out' },
        '-=1.0'
      );
      tl.fromTo('.hero-desc', 
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
        '-=1.2'
      );
      tl.fromTo('.hero-scroll-btn',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
        '-=0.9'
      );
    };

    if (!document.getElementById('preloader-overlay')) {
      playIntro();
    } else {
      window.addEventListener('preloaderComplete', playIntro);
    }
    
    // Fallback in case preloader completed earlier but overlay is still there momentarily
    const fallbackTimeout = setTimeout(playIntro, 5500);

    return () => {
      window.removeEventListener('preloaderComplete', playIntro);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center px-10 z-10 pointer-events-none">
      <div style={{ maxWidth: '890px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="hero-title text-[#1C1C1C] font-extrabold text-4xl sm:text-5xl md:text-8xl leading-none uppercase overflow-hidden select-text h-[1.15em] flex items-center justify-center" style={{ letterSpacing: '0.22em' }}>
          <span className="hero-title-reveal inline-block transform translate-y-full will-change-transform">
            JAGATHI
          </span>
        </h1>
        <h2 
          className="hero-subtitle uppercase select-text opacity-0" 
          style={{ 
            fontFamily: '"Outfit", sans-serif', 
            fontWeight: 300, 
            fontSize: 'clamp(11px, 1.5vw, 18px)',
            color: 'rgba(28, 28, 28, 0.8)', 
            marginTop: '2rem',
            letterSpacing: '0.45em'
          }}
        >
          Built for Legacies
        </h2>
        <p 
          className="hero-desc select-text opacity-0" 
          style={{ 
            fontFamily: '"Outfit", sans-serif', 
            fontWeight: 300, 
            fontSize: 'clamp(10px, 1.2vw, 14px)',
            color: '#4a4a4a', 
            marginTop: '2rem', 
            maxWidth: '36rem', 
            paddingLeft: '1.5rem', 
            paddingRight: '1.5rem', 
            lineHeight: '1.8',
            letterSpacing: '0.05em'
          }}
        >
          We engineer landmark infrastructure, develop high-yield land, and design flawless, turnkey interior spaces from A to Z.
        </p>
      </div>
      <div className="hero-scroll-btn absolute bottom-16 flex flex-col items-center gap-2 opacity-0">
        <span className="text-gray-600 uppercase tracking-[0.30em] text-[8px] animate-bounce">Scroll to explore</span>
      </div>
    </section>
  );
}
