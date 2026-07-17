'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import Footer from '../../components/Footer';

// Modular Component Imports
import CivilHero from '../../components/civil/CivilHero';
import CivilStats from '../../components/civil/CivilStats';
import CivilCapabilities from '../../components/civil/CivilCapabilities';
import CivilCollaborations from '../../components/civil/CivilCollaborations';
import CivilAcquisitionProcess from '../../components/civil/CivilAcquisitionProcess';
import CivilProcessAccordion from '../../components/civil/CivilProcessAccordion';
import CivilQuote from '../../components/civil/CivilQuote';
import CivilProjectIndex from '../../components/civil/CivilProjectIndex';
import CivilWaysToWork from '../../components/civil/CivilWaysToWork';
import CivilFAQ from '../../components/civil/CivilFAQ';
import CivilCTA from '../../components/civil/CivilCTA';

export default function CivilMarketPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.5
    });

    // Sync GSAP ScrollTrigger updates with Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP's ticker
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Setup scroll reveal triggers
    const reveals = gsap.utils.toArray('.cr-reveal');
    const revealsTweens = reveals.map((el) => {
      return gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Force a ScrollTrigger refresh after initial render to avoid layout shifts
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      clearTimeout(refreshTimer);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      revealsTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      className="w-full relative min-h-screen text-[#424242] bg-[#1b1c1e] flex flex-col"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Master Render Sequence */}
      <CivilHero />
      <CivilStats />
      <CivilCapabilities />
      <CivilCollaborations />
      <CivilAcquisitionProcess />
      <CivilProcessAccordion />
      <CivilQuote />
      <CivilProjectIndex />
      <CivilWaysToWork />
      <CivilFAQ />
      <CivilCTA />
      
      <Footer />
    </div>
  );
}
