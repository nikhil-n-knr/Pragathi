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

    // Trigger main layout fade-in and page entrance events at 5.6s (when exit starts)
    tl.call(() => {
      window.dispatchEvent(new Event('preloaderComplete'));
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, null, 5.6);

    // Phase 1: Loader at Center, Counter at Bottom-Left (0.0s to 1.8s)
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const loaderPath = document.querySelector('.preloader-loader-path');

    // Reveal '& EST.' text immediately in Phase 1 (faded gray)
    tl.set(['.preloader-ampersand', '.preloader-est-label'], { opacity: 0.4 }, 0);

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
        strokeDashoffset: length
      });
      tl.to(loaderPath, {
        strokeDashoffset: length * 0.3, // 70% complete (30% remaining offset)
        duration: 1.8,
        ease: "power2.inOut"
      }, 0);
    }

    // Phase 2 Transition: Fade out Phase 1 circular loader and zoom counter (1.8s to 2.8s)
    tl.to('.preloader-loader-container', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.inOut"
    }, 1.8);
    tl.set('.preloader-loader-container', { display: 'none' }, 2.2);

    // Zoom in the counter layout
    tl.to('.preloader-brand-container', {
      scale: 3.8,
      x: "18vw",
      y: "-15vh",
      transformOrigin: "bottom left",
      duration: 1.0,
      ease: "power3.inOut"
    }, 1.8);

    // Phase 3 Transition: Fade out counter (at 2.8s)
    tl.to('.preloader-brand-container', {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }, 2.8);
    tl.set('.preloader-brand-container', { display: 'none' }, 3.0);

    // Reveal Phase 3 Boxed Text 'JAGATHI' at the center (at 3.0s)
    tl.set('.preloader-text-box', { display: 'block', opacity: 0, y: 0, scale: 0.9 }, 3.0);
    tl.to('.preloader-text-box', {
      opacity: 1,
      scale: 1.0,
      duration: 0.4,
      ease: "back.out(1.7)"
    }, 3.0);

    // Dual-Action Animation for JAGATHI:
    // 1. Letters wiggle
    const chars = document.querySelectorAll('.preloader-char');
    tl.fromTo(chars,
      { x: () => gsap.utils.random(-25, 25), y: () => gsap.utils.random(-15, 15), opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.03 },
      3.0
    );
    tl.to(chars, {
      x: () => gsap.utils.random(-4, 4),
      y: () => gsap.utils.random(-2, 2),
      duration: 0.07,
      repeat: 8,
      yoyo: true,
      ease: "none"
    }, 3.35);
    tl.to(chars, { x: 0, y: 0, duration: 0.08 }, 4.00);

    // 2. Border strobe
    tl.to('.preloader-text-box', {
      borderColor: "transparent",
      duration: 0.04,
      repeat: 24,
      yoyo: true,
      ease: "none"
    }, 3.00);
    tl.to('.preloader-text-box', {
      borderColor: "#424242",
      duration: 0.04
    }, 4.00);

    // Phase 4 Transition: Fade out wordmark (at 4.2s)
    tl.to('.preloader-text-box', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in"
    }, 4.2);
    tl.set('.preloader-text-box', { display: 'none' }, 4.6);

    // Reveal SVG Outlines and Logo Badge (at 4.2s)
    tl.set('.preloader-svg-container', { display: 'flex' }, 4.2);

    // Outlines zoom outward and get thicker
    const outlines = document.querySelectorAll('.preloader-scallop-outline');
    tl.set(outlines, { opacity: 0 }, 0);
    tl.fromTo(outlines,
      {
        scale: 0.5,
        opacity: 1,
        attr: { 'stroke-width': 2.0 }
      },
      {
        scale: (i) => 1.0 + 75.0 * Math.pow(i / (outlines.length - 1), 2.2),
        attr: {
          'stroke-width': (i) => {
            const t = i / (outlines.length - 1);
            return parseFloat((2.0 + 80.0 * Math.pow(t, 1.5)).toFixed(2));
          }
        },
        transformOrigin: "50% 50%",
        duration: 2.8,
        ease: "sine.inOut",
        immediateRender: false,
        stagger: {
          each: 0.12,
          from: "end"
        }
      },
      4.2
    );

    // Central logo badge scales/fades in (at 4.5s)
    tl.set('.preloader-logo-badge', { display: 'block', y: 0 }, 4.5);
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.7, opacity: 0 },
      { scale: 1.0, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)", immediateRender: false },
      4.5
    );

    // Phase 5 Exit: Conclude by fading/scaling everything out (at 5.6s)
    tl.to('.preloader-logo-badge', {
      scale: 1.2,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 5.6);

    tl.to(outlines, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 5.6);

    // Fade out overlay background to seamlessly reveal home viewport
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, 5.6);

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

      {/* 3. Semi-Circular Loader (Phase 1) */}
      <div className="preloader-loader-container">
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <circle cx="0" cy="0" r="150" className="preloader-loader-path" />
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
          src="/assets/branding/logo.svg" 
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
