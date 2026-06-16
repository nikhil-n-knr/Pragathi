'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useFluid } from '../context/FluidContext';

export default function KineticHeadline() {
  const { smoothScrollVel } = useFluid();
  
  // Rail refs for horizontal slides
  const rail1Ref = useRef(null);
  const rail2Ref = useRef(null);
  
  // Parent refs for applying skew/lag without conflicting with GSAP
  const parent1Ref = useRef(null);
  const parent2Ref = useRef(null);

  // Configuration of words, targets, and speeds per rail
  const railData = [
    {
      ref: rail1Ref,
      parentRef: parent1Ref,
      speed: 28, // seconds for full loop
      direction: 'left',
      words: [
        { text: "INFRASTRUCTURE", path: "/construction" },
        { text: "LAND ACQUISITION", path: "/real-estate" },
        { text: "INTERIOR DESIGN", path: "/interior" },
        { text: "CIVIL ENGINEERING", path: "/construction" }
      ]
    },
    {
      ref: rail2Ref,
      parentRef: parent2Ref,
      speed: 36, // slower speed going opposite
      direction: 'right',
      words: [
        { text: "ESTABLISHED 1989", path: "/legacy-home" },
        { text: "UNCOMPROMISED QUALITY", path: "/legacy-home" },
        { text: "CONCEPT TO CURATION", path: "/interior" }
      ]
    }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tweens = [];

    // Initialize marquee animations
    railData.forEach((rail) => {
      const target = rail.ref.current;
      if (!target) return;

      const totalWidth = target.scrollWidth / 2; // Half is duplicate repeat
      const limit = totalWidth;
      
      const tween = gsap.to(target, {
        x: rail.direction === 'right' ? limit : -limit,
        ease: 'none',
        duration: rail.speed,
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            if (rail.direction === 'right') {
              const wrapped = (val % limit) - limit;
              return `${wrapped}px`;
            } else {
              const wrapped = val % limit;
              return `${wrapped}px`;
            }
          }
        }
      });

      tweens.push({ tween, target });

      // Add mouseover listeners to slow down rail speed to 35% when cursor enters it
      const onMouseEnter = () => {
        gsap.to(tween, { timeScale: 0.35, duration: 0.4, overwrite: 'auto' });
      };

      const onMouseLeave = () => {
        gsap.to(tween, { timeScale: 1.0, duration: 0.6, overwrite: 'auto' });
      };

      target.addEventListener('mouseenter', onMouseEnter);
      target.addEventListener('mouseleave', onMouseLeave);

      target._cleanMarquee = () => {
        target.removeEventListener('mouseenter', onMouseEnter);
        target.removeEventListener('mouseleave', onMouseLeave);
      };
    });

    return () => {
      tweens.forEach(({ tween, target }) => {
        tween.kill();
        if (target._cleanMarquee) target._cleanMarquee();
      });
    };
  }, []);

  // Update skew and horizontal lag in real-time scroll velocity loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rAfId;
    const updateLag = () => {
      const vel = smoothScrollVel ? smoothScrollVel.current : 0;
      
      // Elastic lag and skew variables
      const skew = vel * -0.055; // horizontal skew lag
      const lag = vel * -0.22; // translation lag offset

      if (parent1Ref.current) {
        parent1Ref.current.style.transform = `skewX(${skew}deg) translateX(${lag}px)`;
      }
      if (parent2Ref.current) {
        parent2Ref.current.style.transform = `skewX(${-skew}deg) translateX(${-lag}px)`;
      }

      rAfId = requestAnimationFrame(updateLag);
    };

    rAfId = requestAnimationFrame(updateLag);
    return () => {
      cancelAnimationFrame(rAfId);
    };
  }, [smoothScrollVel]);

  // Repeat word array multiple times to fill overflow
  const getLoopingWords = (words) => {
    return [...words, ...words, ...words, ...words, ...words, ...words];
  };

  return (
    <div 
      className="w-full py-12 overflow-hidden bg-black/90 border-y border-yellow-400/10 select-none flex flex-col gap-6 relative z-10"
      style={{ transform: 'skewY(-1.8deg)' }} // Technical slanted grid alignment
    >
      {railData.map((rail, railIdx) => {
        const loopList = getLoopingWords(rail.words);
        return (
          <div 
            key={railIdx} 
            ref={rail.parentRef}
            className="flex whitespace-nowrap overflow-visible relative group/rail will-change-transform" 
            style={{ width: 'fit-content' }}
          >
            {/* Scrollable Rail container */}
            <div 
              ref={rail.ref} 
              className="flex gap-16 md:gap-24 text-5xl md:text-8xl font-black uppercase tracking-wider relative transition-opacity duration-300"
              style={{ willChange: 'transform' }}
            >
              {loopList.map((word, wordIdx) => (
                <div key={wordIdx} className="flex items-center gap-16 md:gap-24 overflow-visible">
                  
                  {/* Dynamic interactive Word Link Capsule */}
                  <Link 
                    href={word.path}
                    className="inline-block relative transition-all duration-300 hover:scale-108 hover:z-20 hover:tracking-wide select-all font-bold"
                    style={{
                      transformOrigin: 'center center',
                      textShadow: '0 0 0px transparent',
                      color: railIdx === 0 ? '#ffffff' : '#ffea00'
                    }}
                    onMouseEnter={(e) => {
                      if (railIdx === 0) {
                        e.target.style.textShadow = '0 0 16px rgba(255, 230, 0, 0.4)';
                        e.target.style.color = '#ffea00';
                      } else {
                        e.target.style.textShadow = '0 0 16px rgba(255, 255, 255, 0.4)';
                        e.target.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textShadow = '0 0 0px transparent';
                      e.target.style.color = railIdx === 0 ? '#ffffff' : '#ffea00';
                    }}
                    data-interactive
                  >
                    {word.text}
                  </Link>

                  <span className="text-yellow-400/25 text-3xl md:text-5xl font-light select-none">•</span>
                </div>
              ))}
            </div>

            {/* CSS-driven Row dimming mechanism when hovering over capsules */}
            <style jsx global>{`
              .group\\/rail:hover .flex > div > a {
                opacity: 0.45;
                filter: blur(0.3px);
              }
              .group\\/rail .flex > div > a:hover {
                opacity: 1 !important;
                filter: blur(0px) !important;
              }
            `}</style>

          </div>
        );
      })}
    </div>
  );
}
