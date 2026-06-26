'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/kenBurns.module.css';
import DisciplineVideo from './DisciplineVideo';

const disciplines = [
  {
    portal: '// PORTAL 01',
    title: 'CONSTRUCTION & LAND DEVELOPMENT',
    subtitle: 'Heavy civil & land development',
    description:
      'Delivering master-scale concrete cores, structural lattices, and industrial complexes built to endure generations.',
    image: '/assets/images/construction_discipline.webp',
    videoWebm: '/assets/videos/construction_loop.webm',
    videoMp4: '/assets/videos/construction_loop.mp4',
    alt: 'Construction & Land Development',
    href: '/construction',
    index: 0,
    reverse: false,
    zIndex: 11,
    kenBurns: styles.kenBurns0,
  },
  {
    portal: '// PORTAL 02',
    title: 'INTERIORS',
    subtitle: 'Turnkey bespoke spaces',
    description:
      'Every square inch managed seamlessly — from raw architectural layouts and custom millwork to absolute lighting design.',
    image: '/assets/images/interiors_discipline.webp',
    videoWebm: '/assets/videos/interiors_loop.webm',
    videoMp4: '/assets/videos/interiors_loop.mp4',
    alt: 'Interiors',
    href: '/interior',
    index: 1,
    reverse: true,
    zIndex: 12,
    kenBurns: styles.kenBurns1,
  },
  {
    portal: '// PORTAL 03',
    title: 'CIVIL MARKET',
    subtitle: 'Lands & plotted assets',
    description:
      'Vetting and securing high-potential growth corridors, industrial smart-zones, and premium plotted inventories.',
    image: '/assets/images/civil_market_discipline.webp',
    videoWebm: '/assets/videos/civil_market_loop.webm',
    videoMp4: '/assets/videos/civil_market_loop.mp4',
    alt: 'Civil Market',
    href: '/civil-market',
    index: 2,
    reverse: false,
    zIndex: 13,
    kenBurns: styles.kenBurns2,
  },
];

export default function GatewaySection() {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [autoplayRow, setAutoplayRow] = useState(0);

  const getIsActive = (index) =>
    hoveredRow === index || (hoveredRow === null && autoplayRow === index);

  // Autoplay cycle — pauses while hovering
  useEffect(() => {
    if (hoveredRow !== null) return;
    const interval = setInterval(() => {
      setAutoplayRow((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, [hoveredRow]);

  // GSAP — sticky stack + staggered rise-in per card
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const allTriggers = [];
    const cards = gsap.utils.toArray('.gateway-card-item');

    // Sticky stack scale-down
    cards.forEach((card, i) => {
      const nextCard = cards[i + 1];
      if (nextCard) {
        const innerCard = card.querySelector('.gateway-card-inner');
        const t = gsap.to(innerCard, {
          scale: 0.92,
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom',
            end: 'top 18vh',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        allTriggers.push(t);
      }
    });

    // Rise-in per card
    cards.forEach((card) => {
      const targets = card.querySelectorAll('.rise-target');
      if (!targets.length) return;
      gsap.set(targets, { y: 48, opacity: 0 });
      const t = gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.82,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      allTriggers.push(t);
    });

    return () => {
      allTriggers.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section
      className="relative z-10 w-full bg-transparent flex flex-col items-center justify-start overflow-visible"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(8rem, 15vw, 15rem)',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* ── Section Header ── */}
      <div className="flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full mb-6">
        <span className="rise-target text-[#424242]/70 font-mono text-xs uppercase tracking-widest block text-center mb-3 font-semibold">
          {'// Gateway Portals'}
        </span>
        <h2 className="rise-target text-[#424242] font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-wider mt-2 text-center w-full leading-none font-basement">
          One Group. Three Disciplines.
        </h2>
      </div>

      {/* ── Cards Stack ── */}
      <div className="gateway-stack-container w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col gap-0 relative overflow-visible mt-14 md:mt-24 lg:mt-32">
        {disciplines.map(({ portal, title, subtitle, description, image, videoWebm, videoMp4, alt, href, index, reverse, zIndex, kenBurns }) => {
          const isActive = getIsActive(index);
          const rowDirection = reverse ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row';

          return (
            <div
              key={index}
              className="gateway-card-item sticky top-[8vh] md:top-[14vh] w-full md:h-[80vh] flex items-center justify-center mb-[12vh] md:mb-[20vh]"
              style={{ zIndex }}
            >
              <div
                className={`gateway-card-inner w-full h-full bg-[#424242] border border-[#FFEA0A]/10 rounded-[36px] flex ${rowDirection} items-stretch justify-between gap-0 shadow-[0_45px_90px_-25px_rgba(0,0,0,0.40)] overflow-hidden cursor-pointer`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => router.push(href)}
              >
                {/* ── Image / Video Panel ── */}
                <div className="w-full md:w-[50%] h-[56vw] sm:h-[44vw] md:h-full relative overflow-hidden flex-shrink-0">
                  <DisciplineVideo
                    imageSrc={image}
                    videoSrcWebm={videoWebm}
                    videoSrcMp4={videoMp4}
                    alt={alt}
                    kenBurnsClass={kenBurns}
                    isActive={isActive}
                  />
                  {/* Edge gradient blending toward text */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: reverse
                        ? 'linear-gradient(to left, rgba(66,66,66,0.60) 0%, transparent 42%)'
                        : 'linear-gradient(to right, rgba(66,66,66,0.60) 0%, transparent 42%)',
                    }}
                  />
                  {/* Bottom fade */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to top, rgba(66,66,66,0.45) 0%, transparent 100%)',
                    }}
                  />
                </div>

                {/* ── Text Panel ── */}
                <div
                  className={`
                    w-full md:w-[50%] flex flex-col justify-center items-start text-left font-sans
                    px-5 md:px-12 lg:px-16 xl:px-20
                    py-7 md:py-14 lg:py-18 xl:py-20
                    ${reverse
                      ? 'border-r-0 md:border-r border-[#FFEA0A]/10'
                      : 'border-l-0 md:border-l border-[#FFEA0A]/10'}
                  `}
                >
                  <div className="flex flex-col gap-5 w-full max-w-lg">
                    <div className="overflow-hidden">
                      <span className="rise-target block text-[#FFEA0A]/60 font-mono text-xs md:text-sm tracking-[0.28em] uppercase font-semibold">
                        {portal}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="rise-target font-basement text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] uppercase text-white">
                        {title}
                      </h3>
                    </div>
                    <div className="overflow-hidden">
                      <span className="rise-target block font-sans font-normal text-[#FFEA0A] tracking-wider text-base md:text-xl lg:text-2xl">
                        {subtitle}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <div className="rise-target w-10 h-[2px] bg-[#FFEA0A]/30 rounded-full" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="rise-target text-gray-300 text-sm md:text-lg lg:text-xl leading-relaxed font-sans font-light">
                        {description}
                      </p>
                    </div>
                    <div className="overflow-hidden pt-3">
                      <button className="rise-target inline-flex items-center gap-3 text-[#FFEA0A] uppercase tracking-[0.2em] text-xs md:text-sm font-extrabold border-b-2 border-[#FFEA0A]/30 pb-2 hover:text-white hover:border-white hover:gap-5 transition-all duration-300">
                        Explore Discipline <span className="text-base">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
