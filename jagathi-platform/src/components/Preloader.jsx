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
          duration: 7.5, // slightly slower per ripple
          ease: 'power1.out',
          force3D: true,
          keyframes: [
            { opacity: 0.30, duration: 1.4 }, // softer peak opacity
            { opacity: 0, duration: 6.1 }     // fade out
          ]
        },
        i * 0.40 // wider stagger since only 6 outlines now
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

    // preloaderComplete fires when the overlay begins fading — calculated below after phase4Start is set

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
    // Slower & smoother: duration 0.95s, stagger 0.10s per char
    tl.fromTo('.preloader-char',
      { y: 110, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.95, 
        stagger: {
          each: 0.10,
          from: "end"
        }, 
        ease: "power2.out", 
        immediateRender: false 
      },
      5.2
    );

    // ── Stepwise 3-ring border blink sequence ─────────────────────────
    // Letters finish at ~5.2 + 0.10*6 + 0.95 = ~6.75s → blinks start at 6.8s
    // Each ring blinks exactly 3 times (on→off = 1 cycle, 3 cycles = repeat:5, yoyo:true)
    // Step timing: each ring gets 0.72s (3 blinks × 0.24s each)
    // Order: INNER (current box border) → MIDDLE ring → OUTER ring
    const blinkDur   = 0.12; // half-period: on for 0.12s, off for 0.12s → 0.24s per blink
    const blinkStart = 6.8;
    const ringGap    = 0.72; // 3 blinks × 2 × 0.12 s = 0.72s per ring

    // Ring 1 – inner (the text-box border itself)
    tl.set('.preloader-text-box', { borderColor: 'transparent' }, blinkStart);
    tl.to('.preloader-text-box', {
      borderColor: '#424242',
      duration: blinkDur,
      repeat: 5,   // 6 states alternating → 3 full on-off cycles
      yoyo: true,
      ease: 'none'
    }, blinkStart);

    // Ring 2 – middle (starts after ring 1 finishes)
    tl.set('.preloader-ring-mid', { opacity: 0, borderColor: 'transparent' }, blinkStart + ringGap);
    tl.to('.preloader-ring-mid', {
      borderColor: '#424242',
      opacity: 1,
      duration: blinkDur,
      repeat: 5,
      yoyo: true,
      ease: 'none'
    }, blinkStart + ringGap);

    // Ring 3 – outer (starts after ring 2 finishes)
    tl.set('.preloader-ring-out', { opacity: 0, borderColor: 'transparent' }, blinkStart + ringGap * 2);
    tl.to('.preloader-ring-out', {
      borderColor: '#424242',
      opacity: 1,
      duration: blinkDur,
      repeat: 5,
      yoyo: true,
      ease: 'none'
    }, blinkStart + ringGap * 2);

    // After all blinks, hold all three borders solid for a beat before Phase 4
    tl.set('.preloader-text-box', { borderColor: '#424242' }, blinkStart + ringGap * 3);
    tl.set('.preloader-ring-mid', { borderColor: '#424242', opacity: 1 }, blinkStart + ringGap * 3);
    tl.set('.preloader-ring-out', { borderColor: '#424242', opacity: 1 }, blinkStart + ringGap * 3);

    // Phase 4 Transition: Reveal Logo Badge & Wave Outlines
    // Increased hold to 1.8s so the full 3-ring composition has time to read
    const phase4Start = blinkStart + ringGap * 3 + 1.8;
    tl.to(['.preloader-text-box', '.preloader-ring-mid', '.preloader-ring-out'], {
      opacity: 0,
      scale: 0.90,
      duration: 0.55,
      ease: "power2.inOut",
      stagger: 0.08
    }, phase4Start);
    tl.set('.preloader-text-box', { display: 'none' }, phase4Start + 0.6);

    // Reveal SVG Outlines (fade opacity to 1) – pushed slightly later
    tl.to('.preloader-svg-container', { opacity: 1, duration: 0.4 }, phase4Start + 0.3);

    // Start the infinite looping ripples after phase 4 begins
    tl.call(() => {
      rippleTl.play();
    }, null, phase4Start + 0.3);

    // Central logo badge scales/fades in slowly and majestically (overlapping crossfade)
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.7, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 1.6, ease: "power2.out", immediateRender: false },
      phase4Start + 0.3
    );

    // Brand kit 5 badge fades in underneath the logo badge shortly AFTER the logo appears
    tl.fromTo('.preloader-brand-badge-5',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", immediateRender: false },
      phase4Start + 1.2
    );

    // ── Phase 5 Exit ──────────────────────────────────────────────────
    // Logo fades in at phase4Start + 0.3 (duration 1.6s → fully in at phase4Start + 1.9)
    // Brand badge in at phase4Start + 1.2 (duration 1.2s → fully in at phase4Start + 2.4)
    // Give the full composition 2.5s to breathe before exiting
    const exitStart = phase4Start + 4.2; // logo fully in at +1.9, breathe 2.3s more

    tl.to('.preloader-logo-badge', {
      scale: 1.06,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, exitStart);

    tl.to('.preloader-brand-badge-5', {
      scale: 1.06,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, exitStart);

    tl.to('.preloader-svg-container', {
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut"
    }, exitStart);

    // Overlay fades 0.8s after elements begin exiting
    const overlayFadeAt = exitStart + 0.8;
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 1.4,
      ease: "power3.inOut"
    }, overlayFadeAt);

    // Fire preloaderComplete so main layout begins fading in as overlay exits
    tl.call(() => {
      window.dispatchEvent(new Event('preloaderComplete'));
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, null, overlayFadeAt + 0.3);

    return () => {
      tl.kill();
      rippleTl.kill();
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

      {/* 4. Typography Box for 'JAGATHI'
          The two concentric rings are CHILDREN of the text-box so they
          use inset to expand outward relative to it. */}
      <div className="preloader-text-box" style={{ display: 'none', opacity: 0 }}>
        {/* Middle ring: 8px border, 20px gap outside the 14px inner border */}
        <div className="preloader-ring-mid" style={{ opacity: 0, borderColor: 'transparent' }} />
        {/* Outer ring: 4px border, 20px gap outside the 8px middle border */}
        <div className="preloader-ring-out" style={{ opacity: 0, borderColor: 'transparent' }} />
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
          {/* 6 outlines — reduced from 12 for cleaner, less cluttered ripple */}
          {Array.from({ length: 6 }).map((_, i) => (
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
