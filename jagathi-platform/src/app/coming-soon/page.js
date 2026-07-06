'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Link from 'next/link';
import HomeScene from '../../components/scenes/HomeScene';
import Footer from '../../components/Footer';

export default function ComingSoonPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    
    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="w-full relative min-h-screen text-[#424242] bg-transparent flex flex-col items-center justify-center">

      {/* ── 3D Canvas Background ── */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* ── Coming Soon Section (Glassmorphic Box) ── */}
      <section className="relative z-10 w-full px-6 flex flex-col items-center justify-center py-20">
        <div className="max-w-2xl w-full text-center"
             style={{ 
               background: 'rgba(255, 255, 255, 0.04)', 
               backdropFilter: 'blur(16px)', 
               WebkitBackdropFilter: 'blur(16px)', 
               border: '1px solid rgba(66, 66, 66, 0.08)', 
               padding: '6rem 3rem',
               boxShadow: '0 30px 60px rgba(0, 0, 0, 0.04)'
             }}>
          <span className="text-[#424242]/45 font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">{'// System Update'}</span>
          <h1 className="font-bold text-3xl md:text-5xl uppercase tracking-tight mb-6 leading-tight" style={{ fontFamily: '"Basement Grotesque", "Syncopate", sans-serif' }}>
            COMING SOON
          </h1>
          <div className="h-px w-20 bg-[#424242]/20 mb-8 mx-auto" />
          <p className="text-[#424242]/70 font-light text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ fontFamily: '"Outfit", sans-serif' }}>
            This spatial pillar is currently being engineered. We are building the foundations, drafting the structural frameworks, and establishing legal clearances. Expect deployment in the next release cycle.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-10 py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#333] transition-colors" data-interactive>
              <span>←</span> Return to Homepage
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
