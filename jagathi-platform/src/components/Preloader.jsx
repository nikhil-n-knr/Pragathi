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
        { scale: 0.7, opacity: 0, strokeWidth: '14px', svgOrigin: '0 0' },
        { 
          scale: targetScale, 
          strokeWidth: '48px', 
          svgOrigin: '0 0', 
          duration: 3.75, // Slower speed (25% increase from 3.0s)
          ease: 'power1.out',
          keyframes: [
            { opacity: 1, duration: 1.0 },  // 25% increase from 0.8s
            { opacity: 0, duration: 2.75 } // 25% increase from 2.2s
          ]
        },
        i * 0.225 // 25% speed reduction delay adjustment from 0.18s
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

    // Trigger main layout fade-in and page entrance events at 5.8s (when exit starts)
    tl.call(() => {
      window.dispatchEvent(new Event('preloaderComplete'));
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, null, 5.8);

    // Phase 1: Loader at Center, Counter at Bottom-Left (0.0s to 1.8s)
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const loaderPath = document.querySelector('.preloader-loader-path');

    // Reveal '& EST.' text prefix wrapper: starts completely hidden, will reveal at count completion
    tl.set('.preloader-est-prefix', { width: 0, opacity: 0, marginRight: 0 }, 0);

    // Ticker count-up animation
    tl.to(counterObj, {
      val: 1989,
      duration: 1.8,
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
        strokeDashoffset: length,
        attr: { 'stroke-width': 32 }
      });
      tl.to(loaderPath, {
        strokeDashoffset: length * 0.3, // 70% complete (30% remaining offset)
        attr: { 'stroke-width': 84 },
        duration: 1.8,
        ease: "power2.inOut"
      }, 0);

      // Initialize leading dot path on the exact same coordinate system with increased gap
      const loaderDot = document.querySelector('.preloader-loader-dot-path');
      gsap.set(loaderDot, {
        strokeDasharray: `0 ${length}`,
        strokeDashoffset: length - 57, // starts 57px ahead
        attr: { 'stroke-width': 32 }
      });
      
      // Animate leading dot in perfect mathematical sync with main path with constant visual gap
      tl.to(loaderDot, {
        strokeDashoffset: length * 0.3 - 109, // ends 109px ahead to maintain constant 25px gap (G + W_end = 25 + 84 = 109)
        attr: { 'stroke-width': 84 },
        duration: 1.8,
        ease: "power2.inOut"
      }, 0);
    }

    // Phase 2 Transition: Fade out Phase 1 circular loader (1.8s to 2.2s)
    tl.to('.preloader-loader-container', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.inOut"
    }, 1.8);
    tl.set('.preloader-loader-container', { display: 'none' }, 2.2);

    // Zoom brand container slightly and reveal '& EST.' on the left, sliding digits to the right
    tl.to('.preloader-brand-container', {
      scale: 1.15,
      transformOrigin: "bottom left",
      duration: 0.5,
      ease: "power2.out"
    }, 1.8);
    tl.to('.preloader-est-prefix', {
      width: 'auto',
      opacity: 1,
      marginRight: '0.45rem',
      duration: 0.6,
      ease: "power2.out"
    }, 1.8);

    // Phase 3 Transition: Fade out counter (at 2.8s)
    tl.to('.preloader-brand-container', {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, 2.8);
    tl.set('.preloader-brand-container', { display: 'none' }, 3.1);

    // Initialize SVG liquid-entrance-wave filter attributes
    tl.set('#liquid-entrance-displacement', { attr: { scale: 0 } }, 0);
    tl.set('#liquid-entrance-turbulence', { attr: { baseFrequency: "0.01 0.03" } }, 0);

    // Reveal Phase 3 Boxed Text 'JAGATHI' at the center (at 3.0s, starting with transparent border)
    tl.fromTo('.preloader-text-box',
      { scale: 0.9, opacity: 0, display: 'block', borderColor: "transparent" },
      { scale: 1.0, opacity: 1, duration: 0.4, ease: "back.out(1.7)", immediateRender: false },
      3.0
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
      3.0
    );

    // High-fidelity liquid entrance wave distortion animation (Subtle Wave Mode):
    // Ramp up displacement scale gently as letters break the baseline
    tl.to('#liquid-entrance-displacement', {
      attr: { scale: 12 },
      duration: 0.20,
      ease: "power1.out"
    }, 3.0);

    // Smoothly settle displacement scale to a constant flowing state of 8px (keeps borders waving)
    tl.to('#liquid-entrance-displacement', {
      attr: { scale: 8 },
      duration: 0.50,
      ease: "power2.inOut"
    }, 3.20);

    // Create a standalone infinite loop for turbulence coordinates so the wave keeps flowing continuously
    const flowTween = gsap.to('#liquid-entrance-turbulence', {
      attr: { baseFrequency: "0.02 0.08" },
      duration: 2.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 2. Border Reveal & Blinking (starts at 3.65s, right as letters finish rising)
    // Blinks between transparent and solid brand charcoal (#424242)
    tl.to('.preloader-text-box', {
      borderColor: "#424242",
      duration: 0.12,
      repeat: 4, // 5 states: solid -> trans -> solid -> trans -> solid
      yoyo: true,
      ease: "none"
    }, 3.65);

    // Phase 4 Transition: Reveal Logo Badge & Wave Outlines (at 4.3s)
    // Fade out the wordmark box
    tl.to('.preloader-text-box', {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.inOut"
    }, 4.3);
    tl.set('.preloader-text-box', { display: 'none' }, 4.7);

    // Reveal SVG Outlines and Logo Badge
    tl.set('.preloader-svg-container', { display: 'flex' }, 4.3);

    // Start the infinite looping ripples at 4.3s
    tl.call(() => {
      rippleTl.play();
    }, null, 4.3);

    // Central logo badge scales/fades in
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.7, opacity: 0, display: 'block' },
      { scale: 1.0, opacity: 1, duration: 0.8, ease: "power2.out", immediateRender: false },
      4.3
    );

    // Phase 5 Exit: Conclude by fading/scaling everything out (at 5.8s)
    tl.to('.preloader-logo-badge', {
      scale: 1.15,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 5.8);

    // Fade out the outlines parent container to hide the continuous ripples
    tl.to('.preloader-svg-container', {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 5.8);

    // Fade out overlay background to reveal the main website
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut"
    }, 5.8);

    return () => {
      tl.kill();
      flowTween.kill();
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
      <div className="preloader-text-box">
        <div className="preloader-text">
          {"JAGATHI".split("").map((char, i) => (
            <span key={i} className="preloader-char" style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* 4b. JAGATHI Logo Badge (renders logo/image.png) */}
      <div className="preloader-logo-badge">
        <img 
          className="preloader-logo-image" 
          src="/assets/branding/logo.png?v=2" 
          alt="Jagathi Logo" 
        />
      </div>

      {/* 5. SVG outlines for Phase 4 Topographic Waves */}
      <div className="preloader-svg-container">
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            <g id="jagathi-contour-shape">
              <path d={badgePath} />
            </g>
          </defs>
          {Array.from({ length: 5 }).map((_, i) => (
            <path 
              key={i} 
              d={badgePath} 
              className="preloader-scallop-outline" 
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
