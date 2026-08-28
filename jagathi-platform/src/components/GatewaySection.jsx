'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/kenBurns.module.css';
import DisciplineVideo from './DisciplineVideo';

const disciplines = [
  {
    disciplineNum: '1',
    title: 'CONSTRUCTION & LAND DEVELOPMENT',
    subtitle: 'Structural engineering & land development',
    description:
      'Delivering master-scale concrete cores, structural lattices, and industrial complexes built to endure generations.',
    image: '/assets/images/construction_discipline.webp',
    videoMp4: '/assets/videos/construction_loop.mp4',
    alt: 'Construction & Land Development',
    href: '/construction/',
    index: 0,
    reverse: false,
    zIndex: 11,
    topOffset: '0px',
    kenBurns: styles.kenBurns0,
    brightness: 1.06,
  },
  {
    disciplineNum: '2',
    title: 'ARCHITECTURAL INTERIOR SOLUTIONS',
    subtitle: 'Turnkey bespoke interiors & spatial design',
    description:
      'Every square inch managed seamlessly — from raw architectural layouts and custom millwork to absolute lighting design.',
    image: '/assets/images/interiors_discipline.webp',
    videoMp4: '/assets/videos/interiors_loop.mp4',
    alt: 'Architectural Interior Solutions',
    href: '/interior/',
    index: 1,
    reverse: true,
    zIndex: 12,
    topOffset: '35px',
    kenBurns: styles.kenBurns1,
    brightness: 0.92,
  },
  {
    disciplineNum: '3',
    title: 'PROPERTY ADVISORY SERVICES',
    subtitle: 'Lands & plotted assets advisory',
    description:
      'Vetting and securing high-potential growth corridors, industrial smart-zones, and premium plotted inventories.',
    image: '/assets/images/civil_market_discipline.webp',
    videoMp4: '/assets/videos/civil_market_loop.mp4',
    alt: 'Property Advisory Services',
    href: '/civil-market/',
    index: 2,
    reverse: false,
    zIndex: 13,
    topOffset: '70px',
    kenBurns: styles.kenBurns2,
    brightness: 0.92,
  },
];

export default function GatewaySection() {
  const router = useRouter();

  // GSAP sticky stack scale-down on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const allTriggers = [];
    const cards = gsap.utils.toArray('.gateway-card-item');

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

    return () => {
      allTriggers.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section
      id="gateways"
      data-section="gateways"
      className="relative z-10 w-full text-white bg-transparent flex flex-col items-center justify-center overflow-visible"
      style={{
        paddingTop: 'clamp(40px, 5vh, 60px)',
        paddingBottom: 'clamp(50px, 7vh, 80px)',
        marginTop: '20px',
        marginBottom: '30px',
        boxSizing: 'border-box',
      }}
    >
      {/* Section header */}
      <div
        className="w-full max-w-[1100px] mx-auto px-6 md:px-10 text-center flex flex-col items-center justify-center pointer-events-none"
        style={{ marginBottom: 'clamp(24px, 4vh, 45px)' }}
      >
        <h2 className="rise-target text-[#1C1C1C] font-black uppercase text-center w-full leading-none font-basement tracking-[0.06em] text-[clamp(2.4rem,5vw,5rem)]">
          One Group <br />Three Disciplines
        </h2>
      </div>

      {/* Cards stack */}
      <div className="gateway-stack-container w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center relative overflow-visible">
        {disciplines.map(({ disciplineNum, title, subtitle, description, image, videoMp4, alt, href, index, reverse, zIndex, topOffset, kenBurns, brightness }) => (
          <div
            key={index}
            className="gateway-card-item sticky w-full max-w-[1160px] mx-auto flex items-center justify-center"
            style={{
              top: `calc(14vh + ${topOffset})`,
              zIndex,
              height: 'clamp(560px, 64vh, 640px)',
              marginBottom: 'clamp(35px, 6vh, 60px)',
            }}
          >
            <div
              className={`gateway-card-inner relative w-full h-full bg-[#121315]/90 backdrop-blur-xl border flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch justify-between shadow-[0_45px_100px_-20px_rgba(0,0,0,0.65)] overflow-hidden cursor-pointer group rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-[#FFEA0A]/30 hover:border-[#FFEA0A]/70`}
              onClick={() => router.push(href)}
            >
              {/* Image/Video panel */}
              <div className="h-full relative overflow-hidden flex-shrink-0 bg-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-[62%] lg:w-[64%] border-b md:border-b-0 border-[#FFEA0A]/15">
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={image}
                    alt={alt}
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover block ${kenBurns}`}
                    style={{ filter: `brightness(${brightness})`, transition: 'filter 0.9s ease, opacity 0.8s ease', opacity: 1, zIndex: 1 }}
                  />
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover block"
                    style={{ opacity: 0, transition: 'opacity 1.2s ease', filter: `brightness(${brightness})`, zIndex: 2 }}
                  >
                    <source src={videoMp4} type="video/mp4" />
                  </video>
                </div>
                <div
                  className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(to top, rgba(18,19,21,0.85) 0%, transparent 100%)' }}
                />
              </div>

              {/* Text panel */}
              <div
                className={`h-full bg-[#121315]/90 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 md:p-9 lg:p-12 text-left font-sans relative z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-[40%] lg:w-[38%] opacity-100 border-l border-r border-[#FFEA0A]/15 md:border-r-0`}
                style={{ boxSizing: 'border-box' }}
              >
                <div className="flex flex-col gap-3.5 pr-2 md:pr-4">
                  <span className="text-[#FFEA0A]/80 font-mono text-[10px] tracking-[0.3em] uppercase block font-bold">
                    {`// DISCIPLINE 0${disciplineNum}`}
                  </span>
                  <h3 className="font-basement text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-snug uppercase text-white hover:text-[#FFEA0A] transition-colors break-words pr-2">
                    {title}
                  </h3>
                  <span className="font-sans font-medium text-[#FFEA0A] tracking-wider text-xs md:text-sm">
                    {subtitle}
                  </span>
                  <div className="w-12 h-[2px] bg-[#FFEA0A]/40 my-1" />
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans font-light line-clamp-4 md:line-clamp-6">
                    {description}
                  </p>
                </div>
                <div className="pt-6 border-t border-white/15 pr-2 md:pr-4">
                  <button className="w-full bg-[#FFEA0A] text-[#1C1C1C] hover:bg-white uppercase tracking-[0.2em] text-[10.5px] font-black py-3.5 px-4 transition-all flex items-center justify-center gap-2 rounded-none shadow-lg">
                    Explore Discipline <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
