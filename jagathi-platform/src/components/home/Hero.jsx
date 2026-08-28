'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import useDynamicContent from '../../hooks/useDynamicContent';

const fallbackHero = {
  title: 'JAGATHI',
  subtitle: 'BUILT FOR LEGACIES',
  description: 'We engineer landmark civil infrastructure, develop high-yield land, and design turnkey interior spaces from A to Z.',
  scrollLabel: 'Scroll to explore'
};

export default function Hero() {
  const { data: heroData } = useDynamicContent('/api/get-homepage.php', fallbackHero);

  useEffect(() => {
    let timer;
    let done = false;

    const animateIn = () => {
      if (done) return;
      done = true;

      const tl = gsap.timeline();
      tl.fromTo('.hero-title-reveal', { y: '100%' }, { y: '0%', duration: 1.5, ease: 'power4.out', delay: 0.4 })
        .fromTo('.hero-subtitle', { opacity: 0, letterSpacing: '0.1em' }, { opacity: 1, letterSpacing: '0.25em', duration: 1.8, ease: 'power3.out' }, '-=1.0')
        .fromTo('.hero-desc', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.1')
        .fromTo('.hero-scroll-btn', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8');
    };

    if (document.getElementById('preloader-overlay')) {
      window.addEventListener('preloaderComplete', animateIn);
    } else {
      animateIn();
    }

    timer = setTimeout(animateIn, 5500);

    return () => {
      window.removeEventListener('preloaderComplete', animateIn);
      clearTimeout(timer);
    };
  }, []);

  const rawSubtitle = heroData?.subtitle || 'BUILT FOR LEGACIES';
  const cleanSubtitle = rawSubtitle.replace(/^[·\s]+|[·\s]+$/g, '').toUpperCase();

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-4 sm:px-8 md:px-10 py-12 sm:py-16 z-10 pointer-events-none w-full box-border">
      <div className="w-full max-w-[960px] flex flex-col items-center justify-center text-center mx-auto">
        {/* Centered Hero Title (JAGATHI - Mobile Responsive Fluid Sizing) */}
        <h1
          className="hero-title hero-main-title text-[#1C1C1C] font-black uppercase overflow-hidden select-text h-[1.15em] flex items-center justify-center w-full text-center"
          style={{
            fontSize: 'clamp(2.2rem, 7.5vw, 6.2rem)',
            letterSpacing: 'min(0.18em, 2vw)'
          }}
        >
          <span className="hero-title-reveal block transform translate-y-full text-center w-full">
            {heroData?.title || 'JAGATHI'}
          </span>
        </h1>

        {/* Subtitle (BUILT FOR LEGACIES) */}
        <p
          className="hero-subtitle uppercase select-text opacity-0"
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.75rem, 1.1vw, 1.0rem)',
            color: 'rgba(28, 28, 28, 0.85)',
            marginTop: '1.25rem',
            letterSpacing: 'clamp(0.12em, 1.5vw, 0.25em)'
          }}
        >
          {cleanSubtitle}
        </p>

        {/* Small Description Paragraph (Clean & Small Font Size) */}
        <p
          className="hero-desc uppercase select-text opacity-0 px-2 sm:px-0"
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(11px, 1.0vw, 13px)',
            color: 'rgba(28, 28, 28, 0.7)',
            maxWidth: '32rem',
            marginTop: '1.0rem',
            lineHeight: 1.7,
            letterSpacing: '0.06em'
          }}
        >
          {heroData?.description ||
            'We engineer landmark civil infrastructure, develop high-yield land, and design turnkey interior spaces from A to Z.'}
        </p>

        {/* Scroll Button */}
        <div className="hero-scroll-btn opacity-0" style={{ marginTop: '2.5rem' }}>
          <a
            href="#gateways"
            className="inline-flex items-center gap-2.5 sm:gap-3 border border-[#1C1C1C]/30 text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FFEA0A] font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 pointer-events-auto rounded-none"
          >
            {heroData?.scrollLabel || 'Scroll to explore'}
          </a>
        </div>
      </div>
    </section>
  );
}
