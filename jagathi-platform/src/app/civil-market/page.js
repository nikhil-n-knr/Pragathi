'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import HomeScene from '../../components/scenes/HomeScene';

/* ─── Data ─────────────────────────────────────── */
const investmentMetrics = [
  { value: 48, suffix: '+', label: 'Active Plots', code: '// ACTIVE_INVENTORY' },
  { value: 12, prefix: '₹', suffix: 'Cr', label: 'Average Asset Yield', code: '// AVG_YIELD_METRIC' },
  { value: 6, suffix: '', label: 'Smart Zones', code: '// ZONE_CLUSTERS' },
  { value: 100, suffix: '%', label: 'Title Secured', code: '// LEGAL_CLEARANCE' },
];

const zoneTypes = [
  {
    tag: '[ RESIDENTIAL ZONE ]',
    title: 'Premium Residential',
    subtitle: 'Plotted luxury estates',
    desc: 'Gated residential communities with clubhouse amenities, green belt perimeters, and all municipal clearances secured. Ideal for individual villa construction and premium family estates.',
    image: '/assets/images/civil/residential.webp',
    stat: '48 Active Plots · 12–25 Acres',
    phase: 'PHASE_01'
  },
  {
    tag: '[ INDUSTRIAL ZONE ]',
    title: 'Industrial Smart Zone',
    subtitle: 'Warehouse & logistics',
    desc: 'State-of-the-art industrial hubs with grid-connected power, water treatment, wide 40ft roads, and solar-ready roof structures. Vetted for manufacturing, assembly, and heavy logistics operations.',
    image: '/assets/images/civil/industrial.webp',
    stat: '8–180 Acres Available',
    phase: 'PHASE_02'
  },
  {
    tag: '[ COMMERCIAL ZONE ]',
    title: 'Commercial Corridor',
    subtitle: 'Retail & mixed-use',
    desc: 'Prime commercial corridor plots with arterial road connectivity, high footfall catchment areas, and favorable mixed-use zoning. Fully cleared for retail spaces, hotel development, and office centers.',
    image: '/assets/images/civil/residential.webp', // fallback to residential aerial
    stat: '5–30 Acres · High ROI',
    phase: 'PHASE_03'
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

/* ─── Component ─────────────────────────────────── */
export default function CivilMarketPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);
  const stat4 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

    /* Scroll progress tracker for 3D Camera fly-through */
    const scrollTracker = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      }
    });

    // Scroll reveals
    const revealEls = gsap.utils.toArray('.cm-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // Animated counters
    const statVal1 = { val: 0 }, statVal2 = { val: 0 }, statVal3 = { val: 0 }, statVal4 = { val: 0 };
    ScrollTrigger.create({
      trigger: '#cm-stats',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(statVal1, { val: 48, duration: 1.8, ease: 'power2.out', snap: 'val', onUpdate: () => { if (stat1.current) stat1.current.textContent = statVal1.val + '+'; } });
        gsap.to(statVal2, { val: 12, duration: 1.8, ease: 'power2.out', snap: 'val', onUpdate: () => { if (stat2.current) stat2.current.textContent = '₹' + statVal2.val + 'Cr'; } });
        gsap.to(statVal3, { val: 6, duration: 1.8, ease: 'power2.out', snap: 'val', onUpdate: () => { if (stat3.current) stat3.current.textContent = statVal3.val; } });
        gsap.to(statVal4, { val: 100, duration: 1.8, ease: 'power2.out', snap: 'val', onUpdate: () => { if (stat4.current) stat4.current.textContent = statVal4.val + '%'; } });
      }
    });

    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
      scrollTracker.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="w-full relative min-h-screen text-[#424242] bg-transparent">

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

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between z-10 border-b border-[#424242]/10">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/civil_market_discipline.webp"
            alt="Civil Market"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.38) saturate(0.8)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 70%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }} />
        </div>

        {/* Top Spacer */}
        <div className="w-full py-8" />

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-12 relative w-full">
          {/* Right-aligned glassmorphic card */}
          <div className="absolute top-[15%] md:top-auto md:bottom-[30%] right-6 md:right-16 lg:right-24 w-[90%] md:w-[32rem] p-8 md:p-10 border border-white/10 rounded-sm z-20"
               style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <span className="text-[#FFEA0A] font-mono text-[9px] uppercase tracking-[0.3em] block mb-4">{'// Market Vetting'}</span>
            <p className="text-white/90 font-light leading-relaxed text-sm md:text-base" style={{ fontFamily: '"Outfit", sans-serif' }}>
              Securing premium industrial zones, plotted inventories, and commercial growth corridors. Our civil market portfolios are engineered around absolute title security, geotech clearance, and high capital growth trajectories.
            </p>
          </div>

          {/* Left-aligned bold brand title */}
          <div className="relative mt-auto pointer-events-none select-none z-10 max-w-4xl">
            <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.35em] mb-4 block">{'// Pillar 03 / Land Asset Corridors'}</span>
            <h1 className="font-bold text-white uppercase leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 8vw, 8.5rem)', letterSpacing: '-0.03em' }}>
              CIVIL MARKET
            </h1>
          </div>
        </div>
      </section>

      {/* ── Investment Metrics Bar (Solid Block) ───────────────── */}
      <section id="cm-stats" className="relative z-10 w-full px-6 md:px-12 lg:px-20 xl:px-24 -mt-10 md:-mt-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-white/5 divide-x divide-white/5 bg-[#1E1E1E] shadow-2xl">
            <div className="flex flex-col items-center justify-center py-8 md:py-10 px-3 text-center">
              <span className="text-[#FFEA0A]/40 font-mono text-[8px] block mb-2">// ACTIVE_INVENTORY</span>
              <div ref={stat1} className="font-bold text-[#FFEA0A] leading-none mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>0+</div>
              <div className="text-white/40 uppercase tracking-widest font-mono text-[9px]">Active Plots</div>
            </div>
            <div className="flex flex-col items-center justify-center py-8 md:py-10 px-3 text-center">
              <span className="text-[#FFEA0A]/40 font-mono text-[8px] block mb-2">// AVG_YIELD_METRIC</span>
              <div ref={stat2} className="font-bold text-[#FFEA0A] leading-none mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>₹0Cr</div>
              <div className="text-white/40 uppercase tracking-widest font-mono text-[9px]">Average Asset Yield</div>
            </div>
            <div className="flex flex-col items-center justify-center py-8 md:py-10 px-3 text-center">
              <span className="text-[#FFEA0A]/40 font-mono text-[8px] block mb-2">// ZONE_CLUSTERS</span>
              <div ref={stat3} className="font-bold text-[#FFEA0A] leading-none mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>0</div>
              <div className="text-white/40 uppercase tracking-widest font-mono text-[9px]">Smart Zones</div>
            </div>
            <div className="flex flex-col items-center justify-center py-8 md:py-10 px-3 text-center">
              <span className="text-[#FFEA0A]/40 font-mono text-[8px] block mb-2">// LEGAL_CLEARANCE</span>
              <div ref={stat4} className="font-bold text-[#FFEA0A] leading-none mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>0%</div>
              <div className="text-white/40 uppercase tracking-widest font-mono text-[9px]">Title Secured</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Land Zone Portfolio (Sticky Card Stack Section) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-transparent">
        <div className="max-w-[1400px] mx-auto relative">
          <div className="mb-24 cm-reveal text-center">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Zone Categories'}</span>
            <h2 className="font-bold text-3xl md:text-6xl uppercase tracking-tight">LAND ZONE PORTFOLIO</h2>
          </div>

          <div className="relative flex flex-col gap-[10vh]">
            {zoneTypes.map((zone, i) => (
              <div
                key={i}
                className="sticky top-[15vh] w-full flex items-center justify-center mb-[5vh] z-10"
              >
                {/* Horizontal split card layout inspired by Dubai card grid template */}
                <div className="w-[96%] md:w-[90%] bg-[#1E1E1E] border border-white/10 rounded-sm shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[45vh] md:min-h-[55vh] text-white">
                  
                  {/* Left Column: Details (Col-span 7) */}
                  <div className="p-8 md:p-12 flex flex-col justify-between md:col-span-7">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[#FFEA0A] font-mono text-[9px] bg-white/5 border border-[#FFEA0A]/20 px-2 py-1 tracking-wider">{zone.tag}</span>
                      </div>
                      <h3 className="font-bold text-xl md:text-3xl uppercase tracking-wide text-white mb-2">{zone.title}</h3>
                      <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider block mb-5">{zone.subtitle}</span>
                      <p className="text-white/60 font-light text-xs md:text-sm leading-relaxed max-w-xl" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        {zone.desc}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-[#FFEA0A] font-mono text-[10px] tracking-widest uppercase">{zone.stat}</span>
                      <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">{zone.phase}</span>
                    </div>
                  </div>

                  {/* Right Column: Wide Aerial Image (Col-span 5) */}
                  <div className="relative w-full h-[30vh] md:h-full md:col-span-5 overflow-hidden">
                    <img
                      src={zone.image}
                      alt={zone.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E1E] via-transparent to-transparent hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent md:hidden" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Land Intelligence & Investor Logic (Editorial Split Columns - Solid White Panel) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-white border-t border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            
            {/* Left Column: Land Intelligence */}
            <div className="cm-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Curation Logic'}</span>
              <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight mb-8">Land Intelligence</h2>
              <div className="flex flex-col gap-10">
                {[
                  { title: 'Growth Corridor Mapping', desc: 'We screen plot appreciation patterns, transit loops, and arterial connectivity matrices to isolate high-potential zones before market saturation.' },
                  { title: 'Regulatory / Zoning Clearance', desc: 'Complete zoning clearance, title search verification, environmental compliance, and structural build permission audits — done before you sign.' },
                  { title: 'Micro-Infrastructure Ready', desc: 'Every asset we list is equipped with dedicated grid access, baseline drainage setups, and boundary structural retaining systems.' }
                ].map((item, i) => (
                  <div key={i} className="border-t border-[#424242]/15 pt-6 hover:bg-[#424242]/5 px-4 -mx-4 rounded-sm transition-all duration-300">
                    <h4 className="font-bold text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Investor Logic */}
            <div className="cm-reveal mt-20 lg:mt-0">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Investor Framework'}</span>
              <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight mb-8">Investor Logic</h2>
              <div className="flex flex-col gap-10">
                {[
                  { title: 'Liquidity Horizon Modeling', desc: 'Analysis matching your capitalization model with appreciation velocity metrics — short vs long-term horizons.' },
                  { title: 'Advisory Screen Process', desc: 'One-on-one consultation aligning portfolio allocations with verified structural assets and growth projections.' },
                  { title: 'Appreciation Analytics', desc: 'Historical zone performance audits and projection reports driven by spatial industrial expansions and transit planning.' }
                ].map((item, i) => (
                  <div key={i} className="border-t border-[#424242]/15 pt-6 hover:bg-[#424242]/5 px-4 -mx-4 rounded-sm transition-all duration-300">
                    <h4 className="font-bold text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why Jagathi Lands / Trust Pillars (Solid Charcoal Block) ────── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-[#1E1E1E]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20 cm-reveal">
            <span className="text-[#FFEA0A]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Trust Foundation'}</span>
            <h2 className="font-bold text-white text-2xl md:text-4xl uppercase tracking-tight">Why Jagathi Lands</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {trustPillars.map((pillar, i) => (
              <div key={i} className="cm-reveal border border-white/5 p-8 hover:border-[#FFEA0A]/30 transition-all duration-350 bg-white/[0.02] flex flex-col justify-start">
                <div className="text-[#FFEA0A] text-2xl mb-4 font-mono">{pillar.icon}</div>
                <h3 className="text-white font-bold text-base uppercase tracking-wide mb-3">{pillar.title}</h3>
                <p className="text-white/40 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plotted Premium Civil Inventory (Transparent) ──────── */}
      <section className="relative z-10 w-full py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-transparent border-t border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20 cm-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Civil Assets'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight">Plotted Premium Civil Inventory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {assetDossiers.map((asset, i) => (
              <div key={i} className="cm-reveal group overflow-hidden border border-[#424242]/12 bg-white/20 hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute bottom-3 left-4 text-[9px] font-mono tracking-widest text-[#FFEA0A] bg-[#1E1E1E] px-2.5 py-1">
                      {asset.tag}
                    </span>
                  </div>
                  <div className="p-8">
                    <span className="text-[#424242]/50 font-mono text-[9px] uppercase tracking-widest block mb-2">{asset.sector}</span>
                    <h3 className="font-bold text-lg uppercase tracking-wide mb-3">{asset.title}</h3>
                    <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{asset.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section (Glassmorphic Box) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 bg-transparent border-t border-[#424242]/10 px-6">
        <div className="max-w-3xl mx-auto text-center"
             style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', padding: '5rem 2rem' }}>
          <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Strategic Security'}</span>
          <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-6 leading-tight">
            Secure Premium<br />Civil Assets
          </h2>
          <p className="text-[#424242]/60 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Our civil market assets are vetted with absolute title security and geo-appreciation models. Connect with our dedicated advisory desk to scan live coordinates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:civil@jagathi.com"
              className="inline-flex items-center justify-center gap-2 bg-[#1E1E1E] text-[#FFEA0A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#333] transition-colors"
              data-interactive>
              Talk to Advisory Desk <span>→</span>
            </a>
            <a href="#catalog"
              className="inline-flex items-center justify-center gap-2 border border-[#1E1E1E]/30 text-[#1E1E1E] px-8 py-4 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#1E1E1E] hover:text-[#FFEA0A] transition-all duration-300"
              data-interactive>
              Scan Asset Catalog <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
