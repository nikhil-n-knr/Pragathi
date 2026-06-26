'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CivilMarketScene from '../../components/scenes/CivilMarketScene';

const investmentMetrics = [
  { value: '48', suffix: '+', label: 'Active Plots', code: '// ACTIVE_INVENTORY' },
  { value: '₹12Cr', suffix: '', label: 'Average Asset Yield', code: '// AVG_YIELD_METRIC' },
  { value: '6', suffix: '', label: 'Smart Zones', code: '// ZONE_CLUSTERS' },
  { value: '100', suffix: '%', label: 'Title Secured', code: '// LEGAL_CLEARANCE' },
];

const zoneTypes = [
  {
    tag: '[ RESIDENTIAL ZONE ]',
    title: 'Premium Residential',
    subtitle: 'Plotted luxury estates',
    desc: 'Gated residential communities with clubhouse amenities, green belt perimeters, and all municipal clearances secured. Ideal for individual villa construction.',
    image: '/assets/images/civil/residential.webp',
    stat: '48 Active Plots · 12–25 Acres',
  },
  {
    tag: '[ INDUSTRIAL ZONE ]',
    title: 'Industrial Smart Zone',
    subtitle: 'Warehouse & logistics',
    desc: 'State-of-the-art industrial hubs with grid-connected power, water treatment, wide 40ft roads, and solar-ready roof structures. Ideal for manufacturing and logistics.',
    image: '/assets/images/civil/industrial.webp',
    stat: '8–180 Acres Available',
  },
  {
    tag: '[ COMMERCIAL ZONE ]',
    title: 'Commercial Corridor',
    subtitle: 'Retail & mixed-use',
    desc: 'Prime commercial corridor plots with arterial road connectivity, high footfall catchment areas, and favorable mixed-use zoning for retail, hospitality and offices.',
    image: '/assets/images/civil/residential.webp', // fallback to residential aerial
    stat: '5–30 Acres · High ROI',
  },
];

const trustPillars = [
  { icon: '⬡', title: 'Growth Corridor Mapping', desc: 'We screen plot appreciation patterns, transit loops, and arterial connectivity matrices to isolate high-potential zones before market saturation.' },
  { icon: '⬡', title: 'Regulatory / Zoning Clearance', desc: 'Complete zoning clearance, title search verification, environmental compliance, and structural build permission audits — done before you sign.' },
  { icon: '⬡', title: 'Micro-Infrastructure Ready', desc: 'Every asset we list is equipped with dedicated grid access, baseline drainage setups, and boundary structural retaining systems.' },
  { icon: '⬡', title: 'Advisory Screen Process', desc: 'One-on-one consultation aligning portfolio allocations with verified structural assets. We work to your liquidity horizon, not ours.' },
];

const assetDossiers = [
  {
    tag: '[ SILICON PLOTS ]',
    sector: 'Sector A / Whitefield',
    title: 'Industrial Zone Hub',
    desc: 'Acreage: 18.2 Acres // Coords: 13.0640° N, 80.2460° E. Ideal for thermodynamic cogen grids.',
    image: '/assets/images/3b077e58-5a29-436c-b927-cd27d6b12948.webp',
  },
  {
    tag: '[ RESIDENTIAL RECENT ]',
    sector: 'Sector B / Foothills',
    title: 'Solitaire Ridge',
    desc: 'Acreage: 12.5 Acres // Coords: 13.0980° N, 80.2920° E. Premium luxury estate zoning, gated community.',
    image: '/assets/images/6a35eb17-d080-4a95-a7b4-877a2f58e914.webp',
  },
  {
    tag: '[ COMMERCIAL HOLD ]',
    sector: 'Sector C / Corridor',
    title: 'Nexus Edge Plot',
    desc: 'Acreage: 8.4 Acres // Coords: 13.0320° N, 80.1880° E. Smart-grid ready commercial buffer zone.',
    image: '/assets/images/9373d4ee-6453-4600-9e02-3fc7cb704741.webp',
  },
];

export default function CivilMarketPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const metricsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        const currentInView = self.progress <= 0.45;
        setIsInView((prev) => { if (prev !== currentInView) return currentInView; return prev; });
      }
    });

    const revealEls = document.querySelectorAll('.cm-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top bottom-=60px', toggleActions: 'play none none none' }
        }
      );
    });

    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      trigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="relative min-h-[400vh] bg-transparent text-[#424242] font-sans overflow-x-hidden w-full flex flex-col items-center"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      {/* 1. WebGL Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [2.0, -12, 7.0], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.12} />
          <directionalLight position={[-3, 10, -5]} intensity={0.65} />
          <CivilMarketScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero */}
      <section className="relative h-screen flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 z-10 pointer-events-none w-full max-w-5xl">
        <span className="text-[#424242]/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">{'// Pillar 03 / Civil Market'}</span>
        <h1 className="text-[#424242] font-bold text-4xl sm:text-5xl md:text-7xl leading-none uppercase tracking-tight select-text mb-6" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
          Civil<br />
          <span className="font-light text-[#424242]/70 italic text-3xl sm:text-4xl md:text-6xl tracking-wide">Market</span>
        </h1>
        <div className="border-l-2 border-[#424242]/25 pl-5 md:pl-7 py-2 max-w-lg">
          <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed select-text">
            Securing smart-grid industrial zones, plotted inventories, and commercial growth corridors. Our civil market portfolio is anchored in geotech stability, accessibility, and high capital growth trajectories.
          </p>
        </div>
      </section>

      {/* 3. Investment Metrics Bar */}
      <section className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[#FFEA0A]/15 divide-x divide-[#FFEA0A]/10 bg-[#424242]/95 shadow-2xl">
            {investmentMetrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-8 md:py-12 px-3 text-center select-none">
                <span className="text-[#FFEA0A]/30 font-mono text-[7px] block mb-3">{m.code}</span>
                <div className="font-bold text-[#FFEA0A] leading-none mb-2" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  {m.value}{m.suffix}
                </div>
                <div className="text-white/50 uppercase tracking-widest font-mono" style={{ fontSize: 'clamp(6px, 1.5vw, 9px)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Zone Type Cards — with images */}
      <section className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cm-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Zone Categories'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Land Zone Portfolio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {zoneTypes.map((zone, i) => (
              <div key={i} className="cm-reveal group overflow-hidden border border-[#424242]/12 bg-white/30 hover:border-[#424242]/30 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={zone.image}
                    alt={zone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/85 via-[#1a1a1a]/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-1 border border-[#FFEA0A]/20">{zone.tag}</span>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-[#424242] font-bold text-sm md:text-base uppercase tracking-wide mb-1">{zone.title}</h3>
                  <span className="text-[#424242]/50 font-mono text-[8px] uppercase tracking-widest block mb-3">{zone.subtitle}</span>
                  <p className="text-[#424242]/60 font-light text-xs leading-relaxed mb-4">{zone.desc}</p>
                  <div className="h-px bg-[#424242]/10 mb-3" />
                  <span className="text-[#424242]/45 font-mono text-[8px] tracking-widest">{zone.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Land Intelligence & Investor Logic */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16 bg-[#424242]/5 border-y border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">
            <div className="cm-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// Curation Logic'}</span>
              <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Land Intelligence</h2>
              <div className="flex flex-col gap-5">
                {[
                  { title: 'Growth Corridor Mapping', desc: 'We screen plot appreciation patterns, transit loops, and arterial connectivity matrices to isolate high-potential zones before market saturation.' },
                  { title: 'Regulatory/Zoning Clearance', desc: 'Complete zoning clearance, titles search verification, environmental compliance, and structural build permission audits.' },
                  { title: 'Micro-Infrastructure Ready', desc: 'Every asset we list is equipped with dedicated grid access, baseline drainage setups, and boundary structural retaining systems.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300">
                    <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="cm-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// Investor Framework'}</span>
              <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Investor Logic</h2>
              <div className="flex flex-col gap-5">
                {[
                  { title: 'Liquidity Horizon Modeling', desc: 'Analysis matching your capitalization model with appreciation velocity metrics — short vs long-term horizons.' },
                  { title: 'Advisory Screen Process', desc: 'One-on-one consultation aligning portfolio allocations with verified structural assets and growth projections.' },
                  { title: 'Appreciation Analytics', desc: 'Historical zone performance audits and projection reports driven by spatial industrial expansions and transit planning.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300">
                    <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Jagathi Lands — Trust Pillars */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16 bg-[#424242]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cm-reveal">
            <span className="text-[#FFEA0A]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Trust Foundation'}</span>
            <h2 className="text-white font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Why Jagathi Lands</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {trustPillars.map((pillar, i) => (
              <div key={i} className="cm-reveal border border-[#FFEA0A]/12 p-7 md:p-8 hover:border-[#FFEA0A]/35 transition-all duration-300 group">
                <div className="text-[#FFEA0A]/40 text-2xl mb-4 font-mono">{pillar.icon}</div>
                <h3 className="text-white font-semibold text-sm md:text-base uppercase tracking-wide mb-3 group-hover:text-[#FFEA0A] transition-colors duration-300">{pillar.title}</h3>
                <p className="text-gray-400 font-light text-xs leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Asset Dossiers */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cm-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Civil Assets'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Plotted Premium Civil Inventory</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {assetDossiers.map((asset, i) => (
              <div key={i} className="cm-reveal group border border-[#424242]/15 bg-white/40 overflow-hidden hover:border-[#424242]/35 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={asset.image}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#424242]/85 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-1 border border-[#FFEA0A]/20">{asset.tag}</span>
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-[#424242]/50 font-mono text-[8px] uppercase tracking-widest block mb-2">{asset.sector}</span>
                  <h3 className="text-[#424242] font-bold text-sm uppercase tracking-wide mb-2">{asset.title}</h3>
                  <p className="text-[#424242]/60 font-light text-xs leading-relaxed">{asset.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="relative z-10 py-20 md:py-28 bg-transparent border-t border-[#424242]/15 w-full">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Strategic Security'}</span>
          <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight mb-6 leading-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Secure Premium<br />Civil Assets.
          </h2>
          <p className="text-[#424242]/65 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Our civil market assets are vetted with absolute title security and geo-appreciation models. Connect with our dedicated advisory desk to scan live coordinates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:civil@jagathi.com"
              className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#555] transition-colors"
              data-interactive>
              Talk to Advisory Desk <span>→</span>
            </a>
            <a href="#map"
              className="inline-flex items-center justify-center gap-2 border border-[#424242]/35 text-[#424242] px-8 py-4 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300"
              data-interactive>
              Scan Asset Catalog <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
