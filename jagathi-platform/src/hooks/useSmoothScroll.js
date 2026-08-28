'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    if (typeof window !== 'undefined') {
      window.ScrollTrigger = ScrollTrigger;
    }

    // Initialize single Lenis Smooth Scroll instance with ultra-smooth easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Sync GSAP ScrollTrigger updates with Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP's ticker
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    // Restore adaptive lag smoothing (caps frame spikes to 33ms over a 500ms window) to prevent scroll stutter on low-spec hardware
    gsap.ticker.lagSmoothing(500, 33);

    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      lenisRef.current = null;
      if (window.lenis === lenis) {
        delete window.lenis;
      }
    };
  }, []);

  return lenisRef;
}
