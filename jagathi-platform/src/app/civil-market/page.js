'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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

/* ─── Component ─────────────────────────────────── */
export default function CivilMarketPage() {
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);
  const stat4 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    gsap.registerPlugin(ScrollTrigger);

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
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full min-h-screen text-[#424242]" style={{ backgroundColor: '#FFEA0A' }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '88vh' }}>
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/civil_market_discipline.webp"
            alt="Civil Market"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.4) saturate(0.8)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.3) 70%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)' }} />
        </div>

        {/* Text */}
        <div className="relative z-10 flex flex-col justify-end h-full w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-24" style={{ minHeight: '88vh' }}>
          <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.35em] mb-5 block">{'// Pillar 03 / Civil Market & Assets'}</span>
          <h1 className="font-bold text-white uppercase leading-none mb-6" style={{ fontSize: 'clamp(2.6rem, 7vw, 7rem)', letterSpacing: '-0.02em' }}>
            Civil Market<br />
            <span style={{ fontWeight: 300, opacity: 0.75, fontSize: '0.65em', letterSpacing: '0.02em' }}>& Asset Portfolios</span>
          </h1>
          <div className="h-px w-12 bg-[#FFEA0A] mb-6" />
          <p className="text-white/60 font-light leading-relaxed max-w-lg" style={{ fontFamily: '"Outfit", sans-serif', fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            Securing premium industrial zones, plotted inventories, and commercial growth corridors. Our civil market portfolios are engineered around absolute title security, geotech clearance, and high capital growth trajectories.
          </p>
        </div>
      </section>

      {/* ── Investment Metrics Bar ───────────────── */}
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

      {/* ── Land Zone Portfolio ─────────────────── */}
      <section className="w-full py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-[#FFEA0A]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20 cm-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Zone Categories'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight">Land Zone Portfolio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {zoneTypes.map((zone, i) => (
              <div key={i} className="cm-reveal group overflow-hidden border border-[#424242]/12 bg-white/20 hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={zone.image}
                      alt={zone.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute bottom-3 left-4 text-[9px] font-mono tracking-widest text-[#FFEA0A] bg-[#1E1E1E] px-2.5 py-1">
                      {zone.tag}
                    </span>
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="font-bold text-lg uppercase tracking-wide mb-3">{zone.title}</h3>
                    <span className="text-[#424242]/50 font-mono text-[9px] uppercase tracking-widest block mb-4">{zone.subtitle}</span>
                    <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{zone.desc}</p>
                  </div>
                </div>
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <div className="h-px bg-[#424242]/10 mb-4" />
                  <span className="text-[#424242] font-mono text-[9px] tracking-widest uppercase">{zone.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Land Intelligence & Investor Logic ──── */}
      <section className="w-full py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-white border-t border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:gap-32">
            
            {/* Land Intelligence */}
            <div className="cm-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Curation Logic'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8">Land Intelligence</h2>
              <div className="flex flex-col gap-8">
                {[
                  { title: 'Growth Corridor Mapping', desc: 'We screen plot appreciation patterns, transit loops, and arterial connectivity matrices to isolate high-potential zones before market saturation.' },
                  { title: 'Regulatory / Zoning Clearance', desc: 'Complete zoning clearance, title search verification, environmental compliance, and structural build permission audits — done before you sign.' },
                  { title: 'Micro-Infrastructure Ready', desc: 'Every asset we list is equipped with dedicated grid access, baseline drainage setups, and boundary structural retaining systems.' }
                ].map((item, i) => (
                  <div key={i} className="border-l border-[#424242]/20 hover:border-[#424242] pl-6 transition-colors duration-300">
                    <h4 className="font-bold text-sm md:text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/75 font-light text-xs md:text-sm mt-2 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Logic */}
            <div className="cm-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Investor Framework'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8">Investor Logic</h2>
              <div className="flex flex-col gap-8">
                {[
                  { title: 'Liquidity Horizon Modeling', desc: 'Analysis matching your capitalization model with appreciation velocity metrics — short vs long-term horizons.' },
                  { title: 'Advisory Screen Process', desc: 'One-on-one consultation aligning portfolio allocations with verified structural assets and growth projections.' },
                  { title: 'Appreciation Analytics', desc: 'Historical zone performance audits and projection reports driven by spatial industrial expansions and transit planning.' }
                ].map((item, i) => (
                  <div key={i} className="border-l border-[#424242]/20 hover:border-[#424242] pl-6 transition-colors duration-300">
                    <h4 className="font-bold text-sm md:text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/75 font-light text-xs md:text-sm mt-2 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why Jagathi Lands / Trust Pillars ────── */}
      <section className="w-full py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-[#1E1E1E]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20 cm-reveal">
            <span className="text-[#FFEA0A]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Trust Foundation'}</span>
            <h2 className="font-bold text-white text-2xl md:text-4xl uppercase tracking-tight">Why Jagathi Lands</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {trustPillars.map((pillar, i) => (
              <div key={i} className="cm-reveal border border-white/5 p-8 hover:border-[#FFEA0A]/30 transition-all duration-350 bg-white/[0.02] flex flex-col justify-start">
                <div className="text-[#FFEA0A] text-2xl mb-4 font-mono">{pillar.icon}</div>
                <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wide mb-3">{pillar.title}</h3>
                <p className="text-white/40 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plotted Premium Civil Inventory ──────── */}
      <section className="w-full py-28 md:py-40 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-[#FFEA0A] border-t border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-20 cm-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Civil Assets'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight">Plotted Premium Civil Inventory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {assetDossiers.map((asset, i) => (
              <div key={i} className="cm-reveal group overflow-hidden border border-[#424242]/12 bg-white/20 hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500">
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
                <div className="p-6 md:p-8">
                  <span className="text-[#424242]/50 font-mono text-[9px] uppercase tracking-widest block mb-2">{asset.sector}</span>
                  <h3 className="font-bold text-base uppercase tracking-wide mb-3">{asset.title}</h3>
                  <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{asset.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────── */}
      <section className="w-full py-28 md:py-40 bg-white border-t border-[#424242]/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
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
