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

    const tl = gsap.timeline({
      onComplete: () => {
        // Restore body scrolling
        document.body.classList.remove('preloader-active');
        
        // Remove preloader overlay from React tree
        setIsDestroyed(true);
      }
    });

    // Trigger main layout fade-in and page entrance events at 4.5s (when fade-out starts)
    tl.call(() => {
      window.dispatchEvent(new Event('preloaderComplete'));
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, null, 4.5);

    // Phase 1: Segmented loader fills and Counter ticker increments from 1900 to 1989
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const segments = document.querySelectorAll('.preloader-dash-segment');

    // Reveal '& EST.' text immediately in Phase 1 (faded gray, ready to zoom later)
    tl.set(['.preloader-ampersand', '.preloader-est-label'], { opacity: 0.4 }, 0);

    tl.to(counterObj, {
      val: 1989,
      duration: 2.0,
      ease: "power4.in", // Variable acceleration curve (start slow, accelerate)
      snap: "val",
      onUpdate: () => {
        if (yearDigits) yearDigits.textContent = counterObj.val;
        
        // Dynamic block progress loadout filling
        const progress = (counterObj.val - 1900) / 89;
        const fillCount = Math.floor(progress * segments.length);
        segments.forEach((seg, i) => {
          if (i < fillCount) {
            seg.classList.add('filled');
          } else {
            seg.classList.remove('filled');
          }
        });
      }
    }, 0);

    // Strobe flash rapidly at the end (1.7s to 2.0s) for quick "full loadout" transition
    tl.to(['.preloader-dashed-container', '.preloader-brand-container'], {
      opacity: 0.15,
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: "none"
    }, 1.7);
    tl.to(['.preloader-dashed-container', '.preloader-brand-container'], {
      opacity: 1,
      duration: 0.05
    }, 2.0);

    // Phase 2 Transition: Completed loadout swaps segments for the zoom-in
    tl.set('.preloader-dashed-container', { display: 'none' }, 2.0);
    
    // Smooth, dramatic scale zoom-in tracking the text string '1989 & EST'
    tl.to('.preloader-brand-container', {
      scale: 3.8,
      x: "18vw",
      y: "-15vh",
      transformOrigin: "bottom left",
      duration: 1.0,
      ease: "power3.inOut"
    }, 2.0);

    // Phase 3 Distortion Effects: Entry of the 'Jagathi' text frame at 3.0s
    tl.set('.preloader-brand-container', { display: 'none' }, 3.0);
    tl.set('.preloader-text-box', { display: 'block' }, 3.0);

    // Dual-Action Animation:
    // 1. Clean, mechanical wiggle displacement on the letter spans
    const chars = document.querySelectorAll('.preloader-char');
    tl.fromTo(chars,
      { x: () => gsap.utils.random(-25, 25), y: () => gsap.utils.random(-15, 15), opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.03 },
      3.0
    );
    tl.to(chars, {
      x: () => gsap.utils.random(-4, 4),
      y: () => gsap.utils.random(-2, 2),
      duration: 0.07,
      repeat: 4,
      yoyo: true,
      ease: "none"
    }, 3.15);
    tl.to(chars, { x: 0, y: 0, duration: 0.08 }, 3.5);

    // 2. High-contrast blinking/flashing strobe strictly on the enclosing border line
    tl.to('.preloader-text-box', {
      borderColor: "transparent",
      duration: 0.04,
      repeat: 14,
      yoyo: true,
      ease: "none"
    }, 3.0);
    tl.to('.preloader-text-box', {
      borderColor: "#424242",
      duration: 0.04
    }, 3.6);

    // Concentric scallop outlines ripple outward symmetrically
    const outlines = document.querySelectorAll('.preloader-scallop-outline');
    tl.set(outlines, { opacity: 0 }, 0);
    tl.fromTo(outlines,
      {
        scale: 1.0,
        opacity: 1,
        attr: { 'stroke-width': 1.5 }
      },
      {
        scale: (i) => 1.0 + 59.0 * Math.pow(i / (outlines.length - 1), 2.5),
        attr: {
          'stroke-width': (i) => {
            const t = i / (outlines.length - 1);
            return parseFloat((1.5 + 13.5 * Math.pow(t, 1.2)).toFixed(2));
          }
        },
        transformOrigin: "50% 50%",
        duration: 3.2,
        ease: "sine.inOut",
        immediateRender: false,
        stagger: {
          each: 0.15,
          from: "end"
        }
      },
      3.05
    );

    // Central logo badge scales/fades in
    tl.set('.preloader-logo-badge', { display: 'block' }, 3.4);
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.85, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 0.8, ease: "power2.out", immediateRender: false },
      3.4
    );

    // Phase 4 Component Separation: Conclude by translating logo UP and wordmark DOWN
    tl.to('.preloader-logo-badge', {
      y: -130,
      scale: 1.05,
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut"
    }, 4.2);

    tl.to('.preloader-text-box', {
      y: 130,
      scale: 0.95,
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut"
    }, 4.2);

    // Fade out overlay background to seamlessly reveal home viewport
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut"
    }, 4.2);

    return () => {
      tl.kill();
      document.body.classList.remove('preloader-active');
    };
  }, []);

  if (isDestroyed) return null;

  return (
    <div id="preloader-overlay">
      {/* 2. Heritage Counter Ticker */}
      <div className="preloader-brand-container">
        <span className="year-digits">1900</span>
        <span className="preloader-ampersand"> & </span>
        <span className="preloader-est-label">EST.</span>
      </div>

      {/* 3. Segmented Loading Blocks (12 blocks) */}
      <div className="preloader-dashed-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="preloader-dash-segment" />
        ))}
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
          src="/assets/branding/logo.png" 
          alt="Jagathi Logo" 
        />
      </div>

      {/* 5. SVG outlines for Phase 4 Topographic Waves */}
      <div className="preloader-svg-container">
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', position: 'absolute', overflow: 'visible' }}
        >
          <defs>
            <g id="jagathi-contour-shape">
              <path d={badgePath} />
            </g>
          </defs>
          {Array.from({ length: 18 }).map((_, i) => (
            <path 
              key={i} 
              d={badgePath} 
              className="preloader-scallop-outline" 
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
