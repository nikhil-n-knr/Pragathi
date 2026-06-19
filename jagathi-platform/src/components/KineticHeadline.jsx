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
        { text: "CIVIL MARKET", path: "/civil-market" },
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
      
      // Elastic horizontal translation lag offset based on scroll speed
      const lag = vel * -0.22;

      if (parent1Ref.current) {
        parent1Ref.current.style.transform = `translateX(${lag}px)`;
      }
      if (parent2Ref.current) {
        parent2Ref.current.style.transform = `translateX(${-lag}px)`;
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
      className="w-full pt-12 pb-18 overflow-hidden bg-[#424242] border-y border-[#FFEA0A]/20 select-none flex flex-col gap-6 relative z-10 shadow-2xl"
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
                    className="inline-block relative transition-all duration-355 hover:scale-108 hover:z-20 hover:tracking-wide select-all font-bold"
                    style={{
                      transformOrigin: 'center center',
                      textShadow: '0 0 0px transparent',
                      color: 'transparent',
                      WebkitTextStroke: railIdx === 0 ? '1.5px #FFEA0A' : '1.5px #ffffff',
                      transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (railIdx === 0) {
                        e.target.style.textShadow = '0 0 20px rgba(255, 234, 10, 0.5)';
                        e.target.style.color = '#FFEA0A';
                        e.target.style.WebkitTextStroke = '1.5px #FFEA0A';
                      } else {
                        e.target.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
                        e.target.style.color = '#ffffff';
                        e.target.style.WebkitTextStroke = '1.5px #ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textShadow = '0 0 0px transparent';
                      e.target.style.color = 'transparent';
                      e.target.style.WebkitTextStroke = railIdx === 0 ? '1.5px #FFEA0A' : '1.5px #ffffff';
                    }}
                    data-interactive
                  >
                    {word.text}
                  </Link>

                  <span className="text-[#FFEA0A]/40 text-3xl md:text-5xl font-light select-none">•</span>
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
