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

    // Phase 1: Circular loader fill and Counter ticker increments from 1900 to 1989
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const loaderPath = document.querySelector('.preloader-loader-path');

    tl.to(counterObj, {
      val: 1989,
      duration: 1.8, // dynamic count-up mechanism over 1.8s
      ease: "power2.inOut",
      snap: "val",
      onUpdate: () => {
        if (yearDigits) yearDigits.textContent = counterObj.val;
      }
    }, 0);

    // Animate loader path stroke-dashoffset to 70% complete (drawn)
    if (loaderPath) {
      const length = loaderPath.getTotalLength();
      gsap.set(loaderPath, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      tl.to(loaderPath, {
        strokeDashoffset: length * 0.3,
        duration: 1.8,
        ease: "power2.inOut"
      }, 0);
    }

    tl.set('.preloader-text-box', { display: 'block' }, 1.8);

    // Reveal '& EST.' text exactly when counter reaches 1989 (at 1.8s) — gray, smooth fade-in
    tl.to(['.preloader-ampersand', '.preloader-est-label'], {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 1.8);

    // Initial typography zoom in and rapid flash sequence
    tl.fromTo('.preloader-text-box', 
      { scale: 0.85, opacity: 0 },
      { scale: 1.05, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      1.8
    );

    // Flash opacity in rapid succession mimicking screen/glitch impacts
    tl.to('.preloader-text-box', { opacity: 0.2, duration: 0.06, repeat: 4, yoyo: true }, 2.0);
    tl.to('.preloader-text-box', { opacity: 1, duration: 0.08 }, 2.3);

    // Phase 3: Collapse text box into a tiny central outline icon
    tl.to('.preloader-text-box', {
      scale: 0.0,
      opacity: 0.0,
      duration: 0.45,
      ease: "power3.in"
    }, 2.6);

    // Innermost logo scallop outline and full logo badge fade/scale in at the origin center
    const outlines = document.querySelectorAll('.preloader-scallop-outline');
    
    // Hide all outlines at t=0 — they will be revealed solid on their stagger time (not faded in)
    tl.set(outlines, { opacity: 0 }, 0);

    // Step 2: Symmetrically from the center, the yellow contour lines begin their slow, smooth outward flow ripple.
    tl.fromTo(outlines,
      {
        scale: 1.0,
        opacity: 1,          // solid from first frame — no fade
        attr: { 'stroke-width': 1.5 }
      },
      {
        scale: (i) => 1.0 + 59.0 * Math.pow(i / (outlines.length - 1), 2.5),
        attr: {
          'stroke-width': (i) => {
            const t = i / (outlines.length - 1); // 0 (innermost) → 1 (outermost)
            return parseFloat((1.5 + 13.5 * Math.pow(t, 1.2)).toFixed(2));
          }
        },
        transformOrigin: "50% 50%",
        duration: 3.2, // Sped up outlines scale
        ease: "sine.inOut",
        immediateRender: false,
        stagger: {
          each: 0.15, // Faster stagger intervals
          from: "end"
        }
      },
      3.05
    );

    // Step 3 & 4: Logo appears ~0.35s after waves start (at 3.05s + 0.35s = 3.4s)
    tl.set('.preloader-logo-badge', { display: 'block' }, 3.4);
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.9, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 0.8, ease: "power2.out", immediateRender: false },
      3.4
    );

    // Step 5: Start portal reveal mask expansion, logo & loader fade-out, and brand container fade-out at 4.5s (speeding up entry)
    tl.to(['.preloader-logo-badge', '.preloader-loader-container'], {
      scale: 1.1,
      opacity: 0,
      duration: 1.2,
      ease: "power1.inOut"
    }, 4.5);

    tl.to('.preloader-brand-container', {
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    }, 4.5);

    // Fade out the entire preloader overlay (cinematic dissolve)
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, 4.5);

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
        <span className="preloader-ampersand">&</span>
        <span className="preloader-est-label"> EST. </span>
        <span className="year-digits">1900</span>
      </div>

      {/* 3. Custom Scalloped Circular Loader */}
      <div className="preloader-loader-container">
        <svg 
          viewBox="-200 -200 400 400" 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <path d={badgePath} className="preloader-loader-bg-path" />
          <path d={badgePath} className="preloader-loader-path" />
        </svg>
      </div>

      {/* 4. Typography Box for 'JAGATHI' */}
      <div className="preloader-text-box">
        <div className="preloader-text">JAGATHI</div>
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
