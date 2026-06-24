'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import InteriorScene from '../../components/scenes/InteriorScene';
import MediaFloat from '../../components/MediaFloat';
// import Footer from '../../components/Footer';

export default function InteriorPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    // Track scroll to drive local camera pan and bulb descent
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress; // 0.0 to 1.0
      }
    });

    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      trigger.kill();
    };
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative min-h-[300vh] bg-transparent text-[#424242] font-sans overflow-x-hidden w-full flex flex-col items-center"
    >
      {/* 1. Page-Specific Local WebGL Background Canvas (Hidden per request) */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        {/* <Canvas
          camera={{ position: [2.0, -60.2, 4.8], fov: 60 }}
          gl={{ antialias: true, alpha: true, stencil: true, depth: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.1} />
          <InteriorScene scrollProgress={scrollProgress} />
        </Canvas> */}
      </div>

      {/* 2. Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-start px-8 md:px-24 z-10 pointer-events-none max-w-4xl">
        <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest mb-3">{"// Pillar 02 / Interspace Design"}</span>
        <h1 className="text-[#424242] font-extrabold text-4xl md:text-7xl leading-none uppercase select-text tracking-wider">
          <span className="text-[#424242] font-sans tracking-[0.1em]">SPATIAL SYSTEMS /</span>
          <span className="font-serif-luxury italic text-[#424242]/90 lowercase first-letter:uppercase tracking-[0.05em] block mt-4 font-normal">
            Concept to curation
          </span>
        </h1>
        <div className="border-l border-[#424242]/20 pl-6 md:pl-8 py-2 mt-8 max-w-xl">
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm leading-relaxed select-text">
            We design and execute flawless interior spaces. From master planning and bespoke carpentry to structural lighting and texture curation, we manage every square inch of your environment.
          </p>
        </div>
      </section>

      {/* 3. Spatial Curation & Material Language */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Design Clusters"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">Spatial Planning</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Layout & Circulation Logic</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Analyzing functional zones, movement vectors, and sightlines to maximize ergonomics and spatial flow.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Execution Scope</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Full-scale electrical-light sync, custom false ceilings, custom carpentry integration, and localized structural partition walls.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Signature Environments</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Curating premium hospitality lounges, retail showrooms, corporate director suites, and luxury penthouses.
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Curation Process"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">Turnkey Workflow</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Stage 01 / Material Selection</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Choosing stones, fine hardwoods, structural metal finishes, and textiles from our physical materials lab.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Stage 02 / In-house Fabrication</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication centers.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Stage 03 / Delivery & Fitting</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  One point of contact managing assembly, light installation, joinery alignments, and final surface curations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Swatches (Floating Media Cards - ApeChain style) */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Material Language"}</span>
          <h2 className="text-[#424242] font-bold text-3xl md:text-5xl uppercase tracking-wider mt-2">
            Material Swatches & Finishes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaFloat intensity={1.1}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/modern-room-with-wooden-staircase-daytime_181624-11447.avif" 
                  alt="Dark Veined Marble"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ CALACATTA HONED ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Texture 01 / Italian Stone</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Dark Veined Marble</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Deep charcoal marble surfaces with structural golden veins, hone finished.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={0.9}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/modern-wooden-sauna-geometric-interior-stylish-relaxation-space_169016-68903.avif" 
                  alt="Bespoke Smoked Joinery"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ SMOKED OAK ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Texture 02 / Hardwood</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Bespoke Smoked Joinery</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Stained smoked oak features designed for floating sideboard cabinetry.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={1.2}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/photo-1616611213095-58abb651f70c.avif" 
                  alt="Bouclé Lounge Curation"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ TACTILE BOUCLÉ ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Texture 03 / Upholstery</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Bouclé Lounge Curation</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  High-tactility bouclé fabric selected for parametric furniture curations.
                </p>
              </div>
            </div>
          </MediaFloat>
        </div>
      </section>

      {/* 5. Curation Call to Action */}
      <section className="relative z-10 py-24 bg-transparent border-t border-[#424242]/20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Custom Spaces"}</span>
          <h2 className="text-[#424242] font-extrabold text-3xl md:text-5xl uppercase tracking-wider mt-2 leading-tight">
            Consult our Turnkey Designers.
          </h2>
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm mt-6 leading-relaxed max-w-xl mx-auto">
            From preliminary layouts to fabric selection and installation loops, we manage the entire spatial lifecycle. Book a concept meeting today.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:design@jagathi.com" 
              className="inline-block bg-[#424242] text-[#FFEA0A] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#555555] transition-colors rounded-sm"
              data-interactive
            >
              Consult Turnkey Planner
            </a>
            <a 
              href="#catalog" 
              className="inline-block border border-[#424242]/40 text-[#424242] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300 rounded-sm"
              data-interactive
            >
              Explore Turnkey Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
