'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import HomeScene from '../components/scenes/HomeScene';
import KineticHeadline from '../components/KineticHeadline';
import Footer from '../components/Footer';
import FluidMediaField from '../components/FluidMediaField';
import ShowcaseBanner from '../components/ShowcaseBanner';

// Core Homepage Components
import Hero from '../components/home/Hero';
import FinalCTA from '../components/home/FinalCTA';
import ProjectOverlay from '../components/home/ProjectOverlay';
import OrganicBackgroundLine from '../components/home/OrganicBackgroundLine';
import DollyZoomChapters from '../components/home/DollyZoomChapters';

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

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Track scroll progress to animate R3F WebGL Camera
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
      },
    });

    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      scrollTracker.kill();
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      id="home-scroll-container"
      className="relative min-h-[220vh] bg-transparent text-current font-sans overflow-x-hidden w-full flex flex-col items-center gap-4 md:gap-8"
    >
      {/* 1. Page-Specific 3D WebGL Background Canvas */}
      <div className="fixed inset-0 w-full h-full h-[100dvh] pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop={preloaderDone && isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero Landing Block */}
      <Hero />

      {/* 3. Kinetic Marquee Bands */}
      <div className="w-full my-2 md:my-4">
        <KineticHeadline />
      </div>

      {/* 4. Main Content Area with Organic Background Line & Clean Pinned Video Chapters */}
      <div className="relative w-full flex flex-col items-center gap-6 md:gap-12 py-2 md:py-4">
        {/* Organic Wavy Background Line */}
        <OrganicBackgroundLine />

        {/* 5. Clean Pinned Scrubbed Dolly-Zoom Chapters (01 Construction, 02 Interiors, 03 Civil Market) */}
        <div className="w-full my-2 md:my-4">
          <DollyZoomChapters />
        </div>

        {/* 6. Showcase Banner — The Jagathi Story */}
        <div className="w-full my-4 md:my-8 px-4 sm:px-8 md:px-12">
          <ShowcaseBanner onPlayReel={(reel) => setSelectedProject(reel)} />
        </div>

        {/* 7. Fluid Media / Landmarks of Distinction (Horizontal Pinned Scroll) */}
        <div className="w-full my-4 md:my-8">
          <FluidMediaField onSelectProject={(proj) => setSelectedProject(proj)} />
        </div>
      </div>

      {/* 8. Final Call to Action */}
      <div className="w-full my-6 md:my-10">
        <FinalCTA />
      </div>

      {/* 9. Fullscreen Project Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* 10. Interactive 3D WebGL Footer */}
      <Footer />
    </div>
  );
}
