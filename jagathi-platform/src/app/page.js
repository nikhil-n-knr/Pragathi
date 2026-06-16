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
import GatewaySection from '../components/GatewaySection';

// Modularized Homepage Components
import Hero from '../components/home/Hero';
import ProofStrip from '../components/home/ProofStrip';
import FinalCTA from '../components/home/FinalCTA';
import ProjectOverlay from '../components/home/ProjectOverlay';

export default function Home() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0
    });

    // Synchronize Lenis frames with requestAnimationFrame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger updates with Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Track scroll progress to animate R3F WebGL Camera and mesh
    const scrollTracker = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
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
      scrollTracker.kill();
      gatewaysReveal.kill();
      revealsTweens.forEach(t => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      id="home-scroll-container"
      className="relative min-h-[220vh] bg-transparent text-white font-sans overflow-x-hidden w-full flex flex-col items-center"
    >
      {/* 1. Page-Specific Local WebGL Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Brand Hero Landing Block */}
      <Hero />

      {/* 3. Kinetic Word Bands (Yu-inspired) */}
      <section className="relative z-10 py-8">
        <KineticHeadline />
      </section>

      {/* 4. Three Gateway Panels (Build, Secure, Curate) */}
      <GatewaySection onSelectProject={setSelectedProject} />

      {/* 5. Proof Strip (Metrics, Legacy, Delivery Model) */}
      <ProofStrip />

      {/* 5b. Play Reel Showcase Banner (Organic Elastic Expansion) */}
      <ShowcaseBanner onPlayReel={(reel) => setSelectedProject(reel)} />

      {/* 6. Featured Media Strip (Fluid Parallax Cards - Staggered columns) */}
      <section className="relative z-10 px-6 w-full max-w-6xl mx-auto overflow-visible flex flex-col items-center" style={{ paddingTop: 'clamp(4rem, 8vw, 10rem)', paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
        <div className="flex flex-col items-center text-center mb-6 w-full">
          <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest block text-center">// Featured Work</span>
          <h2 className="text-white font-bold text-3xl md:text-5xl uppercase tracking-wider mt-2 text-center w-full">
            Landmarks of Distinction
          </h2>
        </div>
        <div className="w-full">
          <FluidMediaField onSelectProject={(proj) => setSelectedProject(proj)} />
        </div>
      </section>

      {/* 7. Final Call to Action Strip */}
      <FinalCTA />

      {/* 8. Fullscreen Morphing Unfurling Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}
