'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ConstructionScene from '../../components/scenes/ConstructionScene';
import MediaFloat from '../../components/MediaFloat';
// import Footer from '../../components/Footer';

export default function ConstructionPage() {
  const scrollContainerRef = useRef(null);
  const scrollProgress = useRef(0);
  
  // Metric counter refs
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
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
      document.body.classList.remove('home-theme-yellow-gray');
      trigger.kill();
      counterTrigger.kill();
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative min-h-[300vh] bg-transparent text-[#424242] font-sans overflow-x-hidden w-full flex flex-col items-center"
    >
      {/* 1. Page-Specific Local WebGL Background Canvas (temporarily hidden) */}
      {false && (
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          style={{ pointerEvents: 'none' }}
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 10, 7]} intensity={0.8} />
          <ConstructionScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-start px-8 md:px-24 z-10 pointer-events-none max-w-4xl">
        <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest mb-3">{"// Pillar 01 / Construction & Land Development"}</span>
        <h1 className="text-[#424242] font-extrabold text-4xl md:text-7xl leading-none uppercase select-text tracking-wider">
          <span className="text-[#424242] font-sans tracking-[0.05em]">CONSTRUCTION & LAND DEV /</span>
          <span className="font-serif-luxury italic text-[#424242]/90 lowercase first-letter:uppercase tracking-[0.05em] block mt-4 font-normal">
            Monolithic execution
          </span>
        </h1>
        <div className="border-l border-[#424242]/20 pl-6 md:pl-8 py-2 mt-8 max-w-xl">
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm leading-relaxed select-text">
            We manage the entire lifecycle of heavy civil, land development, and commercial infrastructure. Our builds are anchored in absolute mathematical precision, strict structural integrity, and zero-compromise execution.
          </p>
        </div>
      </section>

      {/* 3. Capability Clusters */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Capability Clusters"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">What We Build</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Industrial Infrastructure</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Supercooled chemical spaces, thermodynamic piping loops, and heavy machinery footing vaults designed for structural isolation.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Commercial Frameworks</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Parametric high-rises and corporate spaces using carbon-fiber wind-resilient load distribution grids.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Heavy Civic & Bridges</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Multi-lane cable-stayed arcs configured via genetic structural load-balancing algorithms.
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Engineering Discipline"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">Scientific Approach</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">01 / Site Geotech Planning</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Deep core drilling, soil-matrix stress mapping, and hydrostatic pressure testing.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">02 / Structural Coordination</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  3D BIM modeling integration to cross-verify load stress distributions prior to concrete casting.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">03 / Material Verification</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
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
        className="relative z-10 py-16 bg-transparent text-center pointer-events-none"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 border border-[#FFEA0A]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#FFEA0A]/15 bg-[#424242]/95 py-12 rounded-sm shadow-2xl pointer-events-auto">
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-[#FFEA0A]/40 font-mono text-[7px] block mb-2">{"// CAP_VALUE_A // MAT_STEEL"}</span>
            <div ref={stat1} className="text-[#FFEA0A] text-4xl md:text-5xl font-black font-mono tracking-wider">0T</div>
            <div className="text-gray-300 text-[9px] tracking-widest uppercase mt-3">{"// Reinforcement Steel Laid"}</div>
          </div>
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-[#FFEA0A]/40 font-mono text-[7px] block mb-2">{"// CAP_VALUE_B // MAT_CONCRETE"}</span>
            <div ref={stat2} className="text-[#FFEA0A] text-4xl md:text-5xl font-black font-mono tracking-wider">0m³</div>
            <div className="text-gray-300 text-[9px] tracking-widest uppercase mt-3">{"// M50 Concrete Cast"}</div>
          </div>
          <div className="py-6 sm:py-0 flex flex-col items-center justify-center">
            <span className="text-[#FFEA0A]/40 font-mono text-[7px] block mb-2">{"// CAP_VALUE_C // AUDIT_SAFE"}</span>
            <div ref={stat3} className="text-[#FFEA0A] text-4xl md:text-5xl font-black font-mono tracking-wider">0%</div>
            <div className="text-gray-300 text-[9px] tracking-widest uppercase mt-3">{"// Safety Audit Rating"}</div>
          </div>
        </div>
      </section>

      {/* 5. Project Showcase (Floating Media Cards - ApeChain style) */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center pointer-events-none">
        <div className="text-center mb-16">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Portfolios in Action"}</span>
          <h2 className="text-[#424242] font-bold text-3xl md:text-5xl uppercase tracking-wider mt-2">
            Signature Civil Outcomes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaFloat intensity={1.0}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group pointer-events-auto">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/a0b767e2-9bd9-41f9-bd8c-ee49850132dc.jpeg" 
                  alt="Silicon Arc Dome"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ GEODESIC ARENA ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 01 / Parametric shell</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Silicon Arc Dome</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Retractable roof shell using geodesic structural frames and reflective solar fabrics.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={1.2}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group pointer-events-auto">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/a45ec4af-97ec-4f9b-8d22-1fa789968062.jpeg" 
                  alt="Cogen Plant B"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ CHEMICAL VAULT ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 02 / Isolated Slab</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Cogen Plant B</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Vibration isolation foundation matrices for heavy turbine loops.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={0.9}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group pointer-events-auto">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/aa8a58a1-23eb-4674-a0b4-e3cbf6217898.jpeg" 
                  alt="Orion Link Bridge"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ TENSION SUSPENSION ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Case 03 / Genetic Arc</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Orion Link Bridge</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Suspended steel-lattice core minimizing material shear stress.
                </p>
              </div>
            </div>
          </MediaFloat>
        </div>
      </section>

      {/* 6. Signature Outcomes & CTAs */}
      <section className="relative z-10 py-24 bg-transparent border-t border-[#424242]/20 pointer-events-none">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Monolithic Handover"}</span>
          <h2 className="text-[#424242] font-extrabold text-3xl md:text-5xl uppercase tracking-wider mt-2 leading-tight">
            Compliance. Durability. Scale-Readiness.
          </h2>
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm mt-6 leading-relaxed max-w-xl mx-auto">
            From geotech planning to concrete sign-offs, we hold a zero-tolerance margin. Start coordinating with our senior structural planners today.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:build@jagathi.com" 
              className="inline-block bg-[#424242] text-[#FFEA0A] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#555555] transition-colors rounded-sm pointer-events-auto"
              data-interactive
            >
              Talk to Advisory Team
            </a>
            <a 
              href="#deck" 
              className="inline-block border border-[#424242]/40 text-[#424242] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300 rounded-sm pointer-events-auto"
              data-interactive
            >
              Request Capability Deck
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
