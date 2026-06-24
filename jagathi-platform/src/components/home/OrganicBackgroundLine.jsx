'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function OrganicBackgroundLine() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const svgEl = svgRef.current;
    const containerEl = containerRef.current;
    if (!svgEl || !containerEl) return;

    // Initialize state
    gsap.set(svgEl, {
      clipPath: 'inset(0% 0% 100% 0%)'
    });

    // Create a ScrollTrigger that updates the clipPath inline style on every scroll tick.
    // By using direct DOM mutation inside onUpdate, we avoid React re-render lag.
    const trigger = ScrollTrigger.create({
      trigger: containerEl,
      start: 'top 70%', // Starts drawing when container top is at 70% of viewport height (just after kinetic section)
      end: 'bottom 95%', // Finishes drawing when container bottom is at 95% of viewport height
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Inset from bottom: 100% (hidden) down to 0% (fully revealed)
        const insetBottom = (1 - progress) * 100;
        svgEl.style.clipPath = `inset(0% 0% ${insetBottom}% 0%)`;
      }
    });

    // Handle viewport resize and recalculate scroll metrics
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-30">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -5,0 
             C 80,0 100,73 70,110 
             C 30,146 30,49 80,85 
             C 110,110 90,207 50,244 
             C -10,281 10,366 30,415 
             C 80,488 80,366 20,390 
             C -20,415 -10,537 40,573 
             C 90,610 110,695 80,744 
             C 40,805 40,695 90,732 
             C 120,756 100,854 60,878 
             C 20,902 50,1000 105,1000"
          className="[stroke-width:12px] md:[stroke-width:32px]"
          fill="none"
          stroke="#424242"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

