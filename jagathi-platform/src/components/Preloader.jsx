'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const [isDestroyed, setIsDestroyed] = useState(false);
  const badgePath = "M -150 -100 A 50 50 0 1 1 -100 -150 A 50 50 0 0 1 0 -150 A 50 50 0 0 1 100 -150 A 50 50 0 1 1 150 -100 A 50 50 0 0 1 150 0 A 50 50 0 0 1 150 100 A 50 50 0 1 1 100 150 A 50 50 0 0 1 0 150 A 50 50 0 0 1 -100 150 A 50 50 0 1 1 -150 100 A 50 50 0 0 1 -150 0 A 50 50 0 0 1 -150 -100 Z";

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Off-thread asynchronous image decoding to prevent first-render main thread decode stutters (hangs)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const logoImg = new Image();
    logoImg.src = "/assets/branding/logo.webp";
    if (logoImg.decode) {
      logoImg.decode().catch(() => {});
    }
    const badgeImg = new Image();
    badgeImg.src = "/assets/brand/5.webp";
    if (badgeImg.decode) {
      badgeImg.decode().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Lock body scrolling during preloader phase
    document.body.classList.add('preloader-active');

    // Calculate dynamic required scale to guarantee full screen corner coverage on any screen size
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius = Math.sqrt(vw * vw + vh * vh) / 2;
    const targetScale = (maxRadius / 200) * 1.5; // Scale increased to cover complete screen (was 0.45)

    // Build the infinite looping timeline for topographic ripple waves
    const outlines = document.querySelectorAll('.preloader-scallop-outline');
    const rippleTl = gsap.timeline({ repeat: -1, paused: true });
    outlines.forEach((outline, i) => {
      rippleTl.fromTo(outline,
        { scale: 0.7, opacity: 0, svgOrigin: '0 0' },
        { 
          scale: targetScale, 
          svgOrigin: '0 0', 
          duration: 6.5, // Slower ripple (graceful motion)
          ease: 'power1.out',
          force3D: true, // GPU acceleration for buttery smoothness
          keyframes: [
            { opacity: 0.45, duration: 1.2 }, // reaches a softer max opacity of 45%
            { opacity: 0, duration: 5.3 }   // fades out completely as it moves further away
          ]
        },
        i * 0.25 // Smooth stagger for 12 outlines
      );
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Restore body scrolling
        document.body.classList.remove('preloader-active');
        
        // Remove preloader overlay from React tree
        setIsDestroyed(true);
      }
    });

    // Trigger main layout fade-in and page entrance events at 11.0s (when exit is almost complete)
    tl.call(() => {
      window.dispatchEvent(new Event('preloaderComplete'));
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, null, 11.0);

    // Phase 1: Loader at Center, Counter at Bottom-Left (0.0s to 1.8s)
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const loaderPath = document.querySelector('.preloader-loader-path');

    // Reveal '& EST.' text prefix wrapper: starts completely hidden, will reveal at count completion
    tl.set('.preloader-est-prefix', { width: 0, opacity: 0, marginRight: 0 }, 0);

    // Ticker count-up animation
    tl.to(counterObj, {
      val: 1989,
      duration: 4.0, // Slowed down from 1.8s
      ease: "power2.out",
      snap: "val",
      onUpdate: () => {
        if (yearDigits) yearDigits.textContent = counterObj.val;
      }
    }, 0);

    // Animate loader path stroke-dashoffset to 70% complete (drawn)
    if (loaderPath) {
      const length = 2 * Math.PI * 150; // Radius 150
      gsap.set(loaderPath, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      tl.to(loaderPath, {
        strokeDashoffset: length * 0.3, // 70% complete (30% remaining offset)
        duration: 4.0,
        ease: "power2.inOut"
      }, 0);

      // Initialize leading dot path on the exact same coordinate system with increased gap
      const loaderDot = document.querySelector('.preloader-loader-dot-path');
      gsap.set(loaderDot, {
        strokeDasharray: `0 ${length}`,
        strokeDashoffset: length - 57 // starts 57px ahead
      });
      
      // Animate leading dot in perfect mathematical sync with main path with constant visual gap
      tl.to(loaderDot, {
        strokeDashoffset: length * 0.3 - 109, // ends 109px ahead to maintain constant gap
        duration: 4.0,
        ease: "power2.inOut"
      }, 0);
    }

    // Phase 2 Transition: Fade out Phase 1 circular loader
    tl.to('.preloader-loader-container', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.inOut"
    }, 4.0);
    tl.set('.preloader-loader-container', { display: 'none' }, 4.4);

    // Zoom brand container slightly and reveal '& EST.' on the left, sliding digits to the right
    tl.to('.preloader-brand-container', {
      scale: 1.15,
      transformOrigin: "bottom left",
      duration: 0.5,
      ease: "power2.out"
    }, 4.0);
    tl.to('.preloader-est-prefix', {
      width: 'auto',
      opacity: 1,
      marginRight: '0.45rem',
      duration: 0.6,
      ease: "power2.out"
    }, 4.0);

    // Phase 3 Transition: Fade out counter (at 5.0s)
    tl.to('.preloader-brand-container', {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, 5.0);
    tl.set('.preloader-brand-container', { display: 'none' }, 5.3);

    // Reveal Phase 3 Boxed Text 'JAGATHI' at the center (at 5.2s, starting with transparent border)
    tl.fromTo('.preloader-text-box',
      { scale: 0.9, opacity: 0, display: 'block', borderColor: "transparent" },
      { scale: 1.0, opacity: 1, duration: 0.4, ease: "back.out(1.7)", immediateRender: false },
      5.2
    );

    // Stagger character entrance in REVERSE order (from end to start):
    tl.fromTo('.preloader-char',
      { y: 120, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.65, 
        stagger: {
          each: 0.06,
          from: "end"
        }, 
        ease: "power3.out", 
        immediateRender: false 
      },
      5.2
    );

    // Border Reveal & Blinking (starts at 5.85s, right as letters finish rising)
    // Blinks between transparent and solid brand charcoal (#424242) exactly 3 times
    tl.to('.preloader-text-box', {
      borderColor: "#424242",
      duration: 0.1,
      repeat: 4, // 5 states: solid -> trans -> solid -> trans -> solid
      yoyo: true,
      ease: "none"
    }, 5.85);

    // Phase 4 Transition: Reveal Logo Badge & Wave Outlines (at 6.5s)
    // Fade out the wordmark box a bit early
    tl.to('.preloader-text-box', {
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
      ease: "power2.inOut"
    }, 6.5);
    tl.set('.preloader-text-box', { display: 'none' }, 7.0);

    // Reveal SVG Outlines (fade opacity to 1)
    tl.to('.preloader-svg-container', { opacity: 1, duration: 0.4 }, 6.8);

    // Start the infinite looping ripples at 6.8s
    tl.call(() => {
      rippleTl.play();
    }, null, 6.8);

    // Central logo badge scales/fades in slowly and majestically (overlapping crossfade)
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.7, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 1.6, ease: "power2.out", immediateRender: false },
      6.8
    );

    // Brand kit 5 badge fades in underneath the logo badge shortly AFTER the logo appears
    tl.fromTo('.preloader-brand-badge-5',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", immediateRender: false },
      7.6
    );

    // Phase 5 Exit: Conclude by fading/scaling everything out (at 10.0s)
    tl.to('.preloader-logo-badge', {
      scale: 1.12,
      opacity: 0, // Smoothly fade out logo badge
      duration: 1.3,
      ease: "power2.inOut"
    }, 10.0);

    tl.to('.preloader-brand-badge-5', {
      scale: 1.12,
      opacity: 0, // Smoothly fade out brand badge
      duration: 1.3,
      ease: "power2.inOut"
    }, 10.0);

    tl.to('.preloader-svg-container', {
      opacity: 0, // Smoothly fade out ripple outlines container
      duration: 1.3,
      ease: "power3.inOut"
    }, 10.0);

    // Fade out overlay background to reveal the main website (all nested children fade out automatically with parent opacity)
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 1.3,
      ease: "power3.inOut"
    }, 10.0);

    return () => {
      tl.kill();
      rippleTl.kill(); // clean up infinite loop on unmount
      document.body.classList.remove('preloader-active');
    };
  }, []);

  if (isDestroyed) return null;

  return (
    <div id="preloader-overlay">
      {/* 2. Heritage Counter Ticker */}
      <div className="preloader-brand-container">
        <span className="preloader-est-prefix">
          <span className="preloader-ampersand">&amp;</span>
          <span className="preloader-est-label">EST.</span>
        </span>
        <span className="year-digits">1900</span>
      </div>

      {/* 3. Semi-Circular Loader (Phase 1) */}
      <div className="preloader-loader-container">
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <circle cx="0" cy="0" r="150" className="preloader-loader-path" />
          <circle cx="0" cy="0" r="150" className="preloader-loader-dot-path" />
        </svg>
      </div>

      {/* 4. Typography Box for 'JAGATHI' */}
      <div className="preloader-text-box" style={{ display: 'none', opacity: 0 }}>
        <div className="preloader-text">
          {"JAGATHI".split("").map((char, i) => (
            <span key={i} className="preloader-char" style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* 4b. Jagathi Brand Kit Badge (appears centered below the logo) */}
      <div className="preloader-brand-badge-5 absolute z-[100001] preloader-brand-badge-5-margin" style={{ top: '50%', left: '50%', transform: 'translateX(-50%)', opacity: 0, pointerEvents: 'none' }}>
        <img src="/assets/brand/5.webp" alt="Brand element" style={{ width: 'min(408px, 90vw)', height: 'auto', opacity: 0.9 }} decoding="async" />
      </div>

      {/* 4c. JAGATHI Logo Badge (renders logo/image.png) */}
      <div className="preloader-logo-badge" style={{ opacity: 0 }}>
        <img 
          className="preloader-logo-image" 
          src="/assets/branding/logo.webp" 
          alt="Jagathi Logo" 
          decoding="async"
        />
      </div>

      {/* 5. SVG outlines for Phase 4 Topographic Waves */}
      <div className="preloader-svg-container" style={{ opacity: 0 }}>
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            <g id="jagathi-contour-shape">
              <path d={badgePath} />
            </g>
          </defs>
          {Array.from({ length: 12 }).map((_, i) => (
            <path 
              key={i} 
              d={badgePath} 
              className="preloader-scallop-outline" 
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* Invisible SVG Definition for Liquid Entrance Wave Displacement Map */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="liquid-entrance-wave">
            <feTurbulence 
              id="liquid-entrance-turbulence"
              type="fractalNoise" 
              baseFrequency="0.02 0.05" 
              numOctaves="2" 
              result="noise" 
            />
            <feDisplacementMap 
              id="liquid-entrance-displacement"
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
