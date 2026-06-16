'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ConstructionScene from '../../components/scenes/ConstructionScene';
import MediaFloat from '../../components/MediaFloat';
import Footer from '../../components/Footer';

export default function ConstructionPage() {
  const scrollContainerRef = useRef(null);
  const scrollProgress = useRef(0);
  
  // Metric counter refs
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Track page scroll to drive local 3D crane grid assembly progress
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress; // 0.0 to 1.0
      }
    });

    // Animate stats/counters when they enter viewport
    const statVal1 = { val: 0 };
    const statVal2 = { val: 0 };
    const statVal3 = { val: 0 };

    const counterTrigger = ScrollTrigger.create({
      trigger: '#construction-stats-strip',
      start: 'top bottom-=100',
      onEnter: () => {
        gsap.to(statVal1, {
          val: 1200,
          duration: 2.0,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (stat1.current) stat1.current.textContent = statVal1.val + 'T';
          }
        });
        gsap.to(statVal2, {
          val: 4500,
          duration: 2.0,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (stat2.current) stat2.current.textContent = statVal2.val + 'm³';
          }
        });
        gsap.to(statVal3, {
          val: 99,
          duration: 2.0,
          ease: 'power3.out',
          snap: 'val',
          onUpdate: () => {
            if (stat3.current) stat3.current.textContent = statVal3.val + '%';
          }
        });
      }
    });

    return () => {
      trigger.kill();
      counterTrigger.kill();
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative min-h-[300vh] bg-black text-white font-sans overflow-x-hidden w-full flex flex-col items-center"
    >
      {/* 1. Page-Specific Local WebGL Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 10, 7]} intensity={0.8} />
          <ConstructionScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-start px-8 md:px-24 z-10 pointer-events-none max-w-4xl">
        <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest mb-3">// Pillar 01 / Infrastructure</span>
        <h1 className="text-white font-extrabold text-4xl md:text-7xl leading-none uppercase select-text tracking-wider">
          <span className="text-yellow-400 font-sans tracking-[0.1em]">FOUNDATIONS /</span>
          <span className="font-serif-luxury italic text-white lowercase first-letter:uppercase tracking-[0.05em] block mt-4 font-normal">
            Monolithic execution
          </span>
        </h1>
        <div className="border-l border-yellow-400/20 pl-6 md:pl-8 py-2 mt-8 max-w-xl">
          <p className="text-gray-400 font-sans font-light text-xs md:text-sm leading-relaxed select-text">
            We manage the entire lifecycle of heavy civil and commercial infrastructure. Our builds are anchored in absolute mathematical precision, strict structural integrity, and zero-compromise execution.
          </p>
        </div>
      </section>

      {/* 3. Capability Clusters */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest">// Capability Clusters</span>
            <h2 className="text-white font-bold text-3xl uppercase tracking-wider mt-2 select-text">What We Build</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">Industrial Infrastructure</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  Supercooled chemical spaces, thermodynamic piping loops, and heavy machinery footing vaults designed for structural isolation.
                </p>
              </div>
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">Commercial Frameworks</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  Parametric high-rises and corporate spaces using carbon-fiber wind-resilient load distribution grids.
                </p>
              </div>
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">Heavy Civic & Bridges</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  Multi-lane cable-stayed arcs configured via genetic structural load-balancing algorithms.
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest">// Engineering Discipline</span>
            <h2 className="text-white font-bold text-3xl uppercase tracking-wider mt-2 select-text">Scientific Approach</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">01 / Site Geotech Planning</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  Deep core drilling, soil-matrix stress mapping, and hydrostatic pressure testing.
                </p>
              </div>
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">02 / Structural Coordination</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  3D BIM modeling integration to cross-verify load stress distributions prior to concrete casting.
                </p>
              </div>
              <div className="border-l-2 border-yellow-400/30 pl-4 hover:border-yellow-400 transition-colors">
                <h4 className="text-white font-bold text-sm uppercase">03 / Material Verification</h4>
                <p className="text-gray-400 font-sans font-light text-xs mt-1 leading-relaxed">
                  NDT testing, concrete cube compressive metrics, and structural steel shear verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Delivery Stack & Stats Strip */}
      <section 
        id="construction-stats-strip"
        className="relative z-10 py-16 bg-transparent text-center"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 border border-yellow-400/15 divide-y sm:divide-y-0 sm:divide-x divide-yellow-400/15 bg-zinc-950/90 py-12 rounded-sm shadow-2xl">
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-yellow-400/30 font-mono text-[7px] block mb-2">// CAP_VALUE_A // MAT_STEEL</span>
            <div ref={stat1} className="text-yellow-400 text-4xl md:text-5xl font-black font-mono tracking-wider">0T</div>
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mt-3">// Reinforcement Steel Laid</div>
          </div>
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-yellow-400/30 font-mono text-[7px] block mb-2">// CAP_VALUE_B // MAT_CONCRETE</span>
            <div ref={stat2} className="text-yellow-400 text-4xl md:text-5xl font-black font-mono tracking-wider">0m³</div>
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mt-3">// M50 Concrete Cast</div>
          </div>
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-yellow-400/30 font-mono text-[7px] block mb-2">// CAP_VALUE_C // AUDIT_SAFE</span>
            <div ref={stat3} className="text-yellow-400 text-4xl md:text-5xl font-black font-mono tracking-wider">0%</div>
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mt-3">// Safety Audit Rating</div>
          </div>
        </div>
      </section>

      {/* 5. Project Showcase (Floating Media Cards - ApeChain style) */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest">// Portfolios in Action</span>
          <h2 className="text-white font-bold text-3xl md:text-5xl uppercase tracking-wider mt-2">
            Signature Civil Outcomes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaFloat intensity={1.0}>
            <div className="border border-yellow-400/15 bg-zinc-950 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-yellow-400/20 overflow-hidden group/img">
                <img 
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80" 
                  alt="Silicon Arc Dome"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-yellow-400 bg-black/85 px-2 py-0.5 border border-yellow-400/20 rounded-sm font-semibold">
                  [ GEODESIC ARENA ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-gray-500 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 01 / Parametric shell</span>
                <h3 className="text-white font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-yellow-400 transition-colors">Silicon Arc Dome</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Retractable roof shell using geodesic structural frames and reflective solar fabrics.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={1.2}>
            <div className="border border-yellow-400/15 bg-zinc-950 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-yellow-400/20 overflow-hidden group/img">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" 
                  alt="Cogen Plant B"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-yellow-400 bg-black/85 px-2 py-0.5 border border-yellow-400/20 rounded-sm font-semibold">
                  [ CHEMICAL VAULT ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-gray-500 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 02 / Isolated Slab</span>
                <h3 className="text-white font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-yellow-400 transition-colors">Cogen Plant B</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Vibration isolation foundation matrices for heavy turbine loops.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={0.9}>
            <div className="border border-yellow-400/15 bg-zinc-950 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-yellow-400/20 overflow-hidden group/img">
                <img 
                  src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=80" 
                  alt="Orion Link Bridge"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-yellow-400 bg-black/85 px-2 py-0.5 border border-yellow-400/20 rounded-sm font-semibold">
                  [ TENSION SUSPENSION ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-gray-500 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 03 / Genetic Arc</span>
                <h3 className="text-white font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-yellow-400 transition-colors">Orion Link Bridge</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Suspended steel-lattice core minimizing material shear stress.
                </p>
              </div>
            </div>
          </MediaFloat>
        </div>
      </section>

      {/* 6. Signature Outcomes & CTAs */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-black to-zinc-950 border-t border-yellow-400/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest">// Monolithic Handover</span>
          <h2 className="text-white font-extrabold text-3xl md:text-5xl uppercase tracking-wider mt-2 leading-tight">
            Compliance. Durability. Scale-Readiness.
          </h2>
          <p className="text-gray-400 font-sans font-light text-xs md:text-sm mt-6 leading-relaxed max-w-xl mx-auto">
            From geotech planning to concrete sign-offs, we hold a zero-tolerance margin. Start coordinating with our senior structural planners today.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:build@jagathi.com" 
              className="inline-block bg-yellow-400 text-black px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-yellow-300 transition-colors rounded-sm"
              data-interactive
            >
              Talk to Advisory Team
            </a>
            <a 
              href="#deck" 
              className="inline-block border border-yellow-400/40 text-yellow-400 px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded-sm"
              data-interactive
            >
              Request Capability Deck
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
