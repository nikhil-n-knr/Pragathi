'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CivilMarketScene from '../../components/scenes/CivilMarketScene';
import MediaFloat from '../../components/MediaFloat';
// import Footer from '../../components/Footer';

export default function CivilMarketPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    // Track scroll to drive camera deep vertical descent through plots
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress; // 0.0 to 1.0
        const currentInView = self.progress <= 0.45;
        setIsInView((prev) => {
          if (prev !== currentInView) return currentInView;
          return prev;
        });
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
      {/* 1. Page-Specific Local WebGL Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [2.0, -12, 7.0], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.12} />
          <directionalLight position={[-3, 10, -5]} intensity={0.65} />
          <CivilMarketScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-start px-8 md:px-24 z-10 pointer-events-none max-w-4xl">
        <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest mb-3">{"// Pillar 03 / Civil Market"}</span>
        <h1 className="text-[#424242] font-extrabold text-4xl md:text-7xl leading-none uppercase select-text tracking-wider">
          <span className="text-[#424242] font-sans tracking-[0.1em]">CIVIL MARKET /</span>
          <span className="font-serif-luxury italic text-[#424242]/90 lowercase first-letter:uppercase tracking-[0.05em] block mt-4 font-normal">
            Lands & plotted assets
          </span>
        </h1>
        <div className="border-l border-[#424242]/20 pl-6 md:pl-8 py-2 mt-8 max-w-xl">
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm leading-relaxed select-text">
            Securing smart-grid industrial zones, plotted inventories, and commercial growth corridors. Our civil market portfolio is anchored in geotech stability, accessibility, and high capital growth.
          </p>
        </div>
      </section>

      {/* 3. Land Curation Intelligence */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Curation Logic"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">Land Intelligence</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Growth Corridor Mapping</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  We screen plot appreciation patterns, transit loops, and arterial connectivity matrices to isolate high-potential zones before market saturation.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Regulatory/Zoning Clearance</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Complete zoning clearance, titles search verification, environmental compliance, and structural build permission audits.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Micro-Infrastructure Ready</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Every asset we list is equipped with dedicated grid access, baseline drainage setups, and boundary structural retaining systems.
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Investor Framework"}</span>
            <h2 className="text-[#424242] font-bold text-3xl uppercase tracking-wider mt-2 select-text">Investor Logic</h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Liquidity Horizon Modeling</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Analysis matching your capitalization model with appreciation velocity metrics (short vs long-term horizons).
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Advisory Screen Process</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  One-on-one consultation aligning portfolio allocations with verified structural assets.
                </p>
              </div>
              <div className="border-l-2 border-[#424242]/30 pl-4 hover:border-[#424242] transition-colors">
                <h4 className="text-[#424242] font-bold text-sm uppercase">Appreciation Analytics</h4>
                <p className="text-[#424242]/80 font-sans font-light text-xs mt-1 leading-relaxed">
                  Historical zone performance audits and projection reports driven by spatial industrial expansions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Asset Dossiers (Floating Media Cards - ApeChain style) */}
      <section className="relative z-10 py-24 px-8 md:px-24 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Civil Assets"}</span>
          <h2 className="text-[#424242] font-bold text-3xl md:text-5xl uppercase tracking-wider mt-2">
            Plotted Premium Civil Inventory
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaFloat intensity={0.95}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/3b077e58-5a29-436c-b927-cd27d6b12948.webp" 
                  alt="Industrial Zone Hub"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ SILICON PLOTS ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Sector A / Whitefield</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Industrial Zone Hub</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Acreage: 18.2 Acres // Coords: 13.0640° N, 80.2460° E. Ideal for thermodynamic cogen grids.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={1.15}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/6a35eb17-d080-4a95-a7b4-877a2f58e914.webp" 
                  alt="Solitaire Ridge"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ RESIDENTIAL RECENT ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Sector B / Foothills</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Solitaire Ridge</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Acreage: 12.5 Acres // Coords: 13.0980° N, 80.2920° E. Premium luxury estate zoning.
                </p>
              </div>
            </div>
          </MediaFloat>

          <MediaFloat intensity={0.85}>
            <div className="border border-[#424242]/20 bg-[#424242]/5 p-6 flex flex-col justify-between h-[360px] rounded-sm group">
              <div className="relative h-44 w-full bg-zinc-900 border border-[#424242]/20 overflow-hidden group/img">
                <img 
                  src="/assets/images/9373d4ee-6453-4600-9e02-3fc7cb704741.webp" 
                  alt="Nexus Edge Plot"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-0.5 border border-[#FFEA0A]/20 rounded-sm font-semibold">
                  [ COMMERCIAL HOLD ]
                </span>
              </div>
              <div className="mt-4 text-center flex flex-col items-center w-full">
                <span className="text-[#424242]/60 font-mono text-[9px] uppercase tracking-widest block text-center w-full">Sector C / Corridor</span>
                <h3 className="text-[#424242] font-bold text-lg uppercase mt-1 text-center w-full group-hover:text-[#424242]/70 transition-colors">Nexus Edge Plot</h3>
                <p className="text-[#424242]/80 text-xs mt-2 leading-relaxed font-light font-sans text-center w-full">
                  Acreage: 8.4 Acres // Coords: 13.0320° N, 80.1880° E. Smart-grid ready commercial buffer.
                </p>
              </div>
            </div>
          </MediaFloat>
        </div>
      </section>

      {/* 5. Opportunity Map & Advisory CTA */}
      <section className="relative z-10 py-24 bg-transparent border-t border-[#424242]/20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[#424242]/70 font-mono text-xs uppercase tracking-widest">{"// Strategic Security"}</span>
          <h2 className="text-[#424242] font-extrabold text-3xl md:text-5xl uppercase tracking-wider mt-2 leading-tight">
            Secure Premium Civil Assets.
          </h2>
          <p className="text-[#424242]/80 font-sans font-light text-xs md:text-sm mt-6 leading-relaxed max-w-xl mx-auto">
            Our civil market assets are vetted with absolute title security and geo-appreciation models. Connect with our dedicated advisory desk to scan live coordinates.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:civil@jagathi.com" 
              className="inline-block bg-[#424242] text-[#FFEA0A] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#555555] transition-colors rounded-sm"
              data-interactive
            >
              Talk to Advisory Desk
            </a>
            <a 
              href="#map" 
              className="inline-block border border-[#424242]/40 text-[#424242] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300 rounded-sm"
              data-interactive
            >
              Scan Asset Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
