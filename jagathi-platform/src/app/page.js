'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import HomeScene from '../components/scenes/HomeScene';
import KineticHeadline from '../components/KineticHeadline';
// import Footer from '../components/Footer';
import FluidMediaField from '../components/FluidMediaField';
import ShowcaseBanner from '../components/ShowcaseBanner';
import GatewaySection from '../components/GatewaySection';

// Modularized Homepage Components
import Hero from '../components/home/Hero';

import FinalCTA from '../components/home/FinalCTA';
import ProjectOverlay from '../components/home/ProjectOverlay';
import OrganicBackgroundLine from '../components/home/OrganicBackgroundLine';

export default function Home() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleComplete = () => setPreloaderDone(true);
    window.addEventListener('preloaderComplete', handleComplete);
    if (!document.getElementById('preloader-overlay')) {
      setPreloaderDone(true);
    }
    return () => {
      window.removeEventListener('preloaderComplete', handleComplete);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.5
    });

    // Sync GSAP ScrollTrigger updates with Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP's ticker (removes duplicate raf loop and ensures perfect sync)
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 2. Track scroll progress to animate R3F WebGL Camera and mesh
    const scrollTracker = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        const currentInView = self.progress <= 0.45;
        setIsInView((prev) => {
          if (prev !== currentInView) return currentInView;
          return prev;
        });
      }
    });

    // 3. Staggered Gateway cards reveal
    const gatewaysReveal = gsap.fromTo('.gateway-card',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gateways-grid',
          start: 'top bottom-=80px',
          toggleActions: 'play none none none'
        }
      }
    );

    // 4. Global scroll reveals for sections and titles
    const reveals = gsap.utils.toArray('.split-reveal');
    const revealsTweens = reveals.map((el) => {
      return gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=60px',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Cleanup scrolling triggers and Lenis instance
    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      scrollTracker.kill();
      gatewaysReveal.kill();
      revealsTweens.forEach(t => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      id="home-scroll-container"
      className="relative min-h-[220vh] bg-transparent text-current font-sans overflow-x-hidden w-full flex flex-col items-center"
    >
      {/* 1. Page-Specific Local WebGL Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          frameloop={preloaderDone && isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Brand Hero Landing Block */}
      <Hero />

      {/* 3. Kinetic Word Bands (Yu-inspired) */}
      <section className="relative z-10 pt-12 pb-20 w-full">
        <KineticHeadline />
      </section>

      {/* Main Content Area with Organic Background Line */}
      <div className="relative w-full flex flex-col items-center">
        {/* Organic Wavy Background Line */}
        <OrganicBackgroundLine />

        {/* 4. Three Gateway Panels (Build, Secure, Curate) */}
        <GatewaySection onSelectProject={setSelectedProject} />



        {/* 5b. Play Reel Showcase Banner (Organic Elastic Expansion) */}
        <ShowcaseBanner onPlayReel={(reel) => setSelectedProject(reel)} />

        {/* 6. Featured Media Strip — 2-column Before/After Grid */}
        <section className="relative z-10 w-full overflow-visible flex flex-col items-center" style={{ paddingTop: 'clamp(4rem, 8vw, 10rem)', paddingBottom: 'clamp(5rem, 10vw, 12rem)' }}>
          <div className="flex flex-col items-center text-center mb-10 md:mb-14 w-full px-6">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block text-center mb-3">{"// Featured Work"}</span>
            <h2 className="text-[#424242] font-bold text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-center w-full leading-none" style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.02em' }}>
              Landmarks of Distinction
            </h2>
            <p className="text-[#424242]/50 font-sans font-light text-xs md:text-sm mt-4 max-w-lg text-center leading-relaxed">
              Four transformations. Every detail engineered, every surface curated, every deadline met.
            </p>
          </div>
          <FluidMediaField onSelectProject={(proj) => setSelectedProject(proj)} />
        </section>
      </div>

      {/* 7. Final Call to Action Strip */}
      <FinalCTA />

      {/* 8. Fullscreen Morphing Unfurling Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
