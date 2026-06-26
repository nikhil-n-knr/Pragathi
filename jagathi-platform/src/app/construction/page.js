'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/* ─── Data ─────────────────────────────────────── */
const processSteps = [
  { num: '01', title: 'Site Survey & Geotech', desc: 'Deep core drilling, soil-matrix stress mapping, hydrostatic pressure profiling, and environmental compliance baseline.' },
  { num: '02', title: 'BIM & Structural Design', desc: '3D BIM modeling integration to cross-verify load distributions, shear walls, and cantilever forces prior to casting.' },
  { num: '03', title: 'Foundation & Piling', desc: 'Reinforced pile caps, isolated footings, and raft foundation systems engineered to M50 grade concrete standards.' },
  { num: '04', title: 'Superstructure Build', desc: 'Column and slab cycles, core wall formation, structural steel erection, and floor deck expansion — all sequenced precisely.' },
  { num: '05', title: 'MEP & Systems', desc: 'Mechanical, electrical, and plumbing coordination built in-parallel with structural timelines to eliminate rework loops.' },
  { num: '06', title: 'Handover & Sign-off', desc: 'NDT testing, concrete cube compressive metrics, structural audits, and zero-punch-list final handover to client.' },
];

const materials = [
  { code: 'MAT-01', name: 'Grade Fe 550 Steel', spec: 'Tensile 550 MPa · High-yield ribbed bars', desc: 'Used exclusively for primary structural reinforcement — shear walls, column cages, and transfer beams.' },
  { code: 'MAT-02', name: 'M50 Grade Concrete', spec: 'Characteristic strength 50 N/mm² · 28-day cube', desc: 'All structural pours executed to M50 specification — ensuring chemical resistance, compression capacity, and longevity.' },
  { code: 'MAT-03', name: 'Structural Float Glass', spec: 'Acoustic-sealed · Triple-glazed IGU systems', desc: 'Engineered curtain wall glazing systems with wind load certification for all facade and atrium applications.' },
];

const portfolioCards = [
  { tag: '[ CABLE-STAYED BRIDGE ]', sector: 'Case 01 / Civic Infrastructure', title: 'Orion Link Bridge', desc: 'Suspended steel-lattice cable-stayed arc spanning 420m. Genetic structural load-balancing algorithm-driven tension pylon design.', image: '/assets/images/construction/bridge.webp' },
  { tag: '[ COMMERCIAL HIGH-RISE ]', sector: 'Case 02 / Commercial Tower', title: 'Silicon Arc Tower', desc: 'Grade-A commercial high-rise with parametric concrete core, curtain wall glazing system, and wind-resilient load distribution frames.', image: '/assets/images/construction/highrise.webp' },
  { tag: '[ CHEMICAL PROCESSING ]', sector: 'Case 03 / Industrial Plant', title: 'Cogen Industrial Complex', desc: 'Supercooled chemical processing facility. Vibration isolation foundation matrices for heavy turbine and pressure vessel loops.', image: '/assets/images/construction/industrial.webp' },
];

const capabilities = [
  { title: 'Industrial Infrastructure', desc: 'Supercooled chemical spaces, thermodynamic piping loops, and heavy machinery footing vaults designed for structural isolation.' },
  { title: 'Commercial Frameworks', desc: 'Parametric high-rises and corporate spaces using carbon-fiber wind-resilient load distribution grids.' },
  { title: 'Heavy Civic & Bridges', desc: 'Multi-lane cable-stayed arcs configured via genetic structural load-balancing algorithms.' },
];

const science = [
  { title: '01 / Site Geotech Planning', desc: 'Deep core drilling, soil-matrix stress mapping, and hydrostatic pressure testing.' },
  { title: '02 / Structural Coordination', desc: '3D BIM modeling integration to cross-verify load stress distributions prior to concrete casting.' },
  { title: '03 / Material Verification', desc: 'NDT testing, concrete cube compressive metrics, and structural steel shear verification.' },
];

/* ─── Component ─────────────────────────────────── */
export default function ConstructionPage() {
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Scroll reveals */
    const revealEls = gsap.utils.toArray('.cr-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Animated counters */
    const statVal1 = { val: 0 }, statVal2 = { val: 0 }, statVal3 = { val: 0 };
    ScrollTrigger.create({
      trigger: '#con-stats',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(statVal1, { val: 1200, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat1.current) stat1.current.textContent = statVal1.val + 'T'; } });
        gsap.to(statVal2, { val: 4500, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat2.current) stat2.current.textContent = statVal2.val + 'm³'; } });
        gsap.to(statVal3, { val: 99, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat3.current) stat3.current.textContent = statVal3.val + '%'; } });
      }
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="w-full min-h-screen text-[#424242]" style={{ fontFamily: '"Outfit", sans-serif', backgroundColor: '#F8F7F4' }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '88vh' }}>
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/construction/bridge.webp"
            alt="Construction"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.42) saturate(0.7)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 55%)' }} />
        </div>

        {/* Text */}
        <div className="relative z-10 flex flex-col justify-end h-full w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-24" style={{ minHeight: '88vh' }}>
          <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.35em] mb-5 block">{'// Pillar 01 / Construction & Land Development'}</span>
          <h1 className="font-bold text-white uppercase leading-none mb-6" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: 'clamp(2.6rem, 7vw, 7rem)', letterSpacing: '-0.02em' }}>
            Construction<br />
            <span style={{ fontWeight: 300, opacity: 0.75, fontSize: '0.65em', letterSpacing: '0.02em' }}>& Land Development</span>
          </h1>
          <div className="h-px w-12 bg-[#FFEA0A] mb-6" />
          <p className="text-white/60 font-light leading-relaxed max-w-lg" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            We manage the entire lifecycle of heavy civil, land development, and commercial infrastructure — anchored in mathematical precision, strict structural integrity, and zero-compromise execution.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <span className="w-2 h-2 rounded-full bg-[#FFEA0A] animate-pulse flex-shrink-0" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">Active Site Operations</span>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────── */}
      <section id="con-stats" className="w-full bg-[#424242]">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#FFEA0A]/15">
            {[
              { ref: stat1, init: '0T', label: 'Reinforcement Steel Laid', code: '// MAT_STEEL' },
              { ref: stat2, init: '0m³', label: 'M50 Concrete Cast', code: '// MAT_CONCRETE' },
              { ref: stat3, init: '0%', label: 'Safety Audit Rating', code: '// AUDIT_SAFE' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-10 md:py-14 px-6 text-center">
                <span className="text-[#FFEA0A]/30 font-mono text-[7px] block mb-3 tracking-widest">{s.code}</span>
                <div ref={s.ref} className="text-[#FFEA0A] font-bold font-mono leading-none mb-3" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>{s.init}</div>
                <div className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capability Clusters ───────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#F8F7F4]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
            <div className="cr-reveal">
              <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// What We Build'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Capability Clusters</h2>
              <div className="flex flex-col gap-6">
                {capabilities.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/15 pl-5 hover:border-[#424242]/60 transition-colors duration-300">
                    <h4 className="font-semibold text-sm uppercase tracking-wide mb-1.5">{item.title}</h4>
                    <p className="text-[#424242]/55 font-light text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="cr-reveal">
              <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Engineering Discipline'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Scientific Approach</h2>
              <div className="flex flex-col gap-6">
                {science.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/15 pl-5 hover:border-[#424242]/60 transition-colors duration-300">
                    <h4 className="font-semibold text-sm uppercase tracking-wide mb-1.5">{item.title}</h4>
                    <p className="text-[#424242]/55 font-light text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Timeline ──────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 border-t border-[#424242]/8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Delivery Method'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Our Build Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step, i) => (
              <div key={i} className="cr-reveal group border border-[#424242]/10 bg-[#F8F7F4] p-7 hover:border-[#424242]/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#FFEA0A] font-mono text-[10px] bg-[#424242] px-2.5 py-1 flex-shrink-0 tracking-widest">{step.num}</span>
                  <h3 className="font-semibold text-sm uppercase tracking-wide">{step.title}</h3>
                </div>
                <p className="text-[#424242]/50 font-light text-[13px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials Science ─────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#424242]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#FFEA0A]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Material Standards'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight text-white" style={{ fontFamily: '"Outfit", sans-serif' }}>Materials Science</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {materials.map((m, i) => (
              <div key={i} className="cr-reveal group border border-white/8 p-7 hover:border-[#FFEA0A]/30 transition-all duration-300">
                <span className="text-[#FFEA0A]/40 font-mono text-[8px] tracking-[0.3em] block mb-5 uppercase">{m.code}</span>
                <h3 className="text-white font-bold text-base uppercase tracking-wide mb-2 group-hover:text-[#FFEA0A] transition-colors duration-300">{m.name}</h3>
                <span className="text-[#FFEA0A]/50 font-mono text-[9px] uppercase tracking-wider block mb-5">{m.spec}</span>
                <div className="h-px bg-white/8 mb-5" />
                <p className="text-white/40 font-light text-[13px] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Cards ───────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#F8F7F4]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Signature Outcomes'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Signature Civil Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioCards.map((card, i) => (
              <div key={i} className="cr-reveal group border border-[#424242]/10 bg-white overflow-hidden hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    style={{ filter: 'brightness(0.88)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-[0.25em] text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">
                    {card.tag}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-[#424242]/40 font-mono text-[8px] uppercase tracking-widest block mb-2">{card.sector}</span>
                  <h3 className="font-bold text-[15px] uppercase tracking-wide mb-2">{card.title}</h3>
                  <p className="text-[#424242]/50 font-light text-[13px] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 border-t border-[#424242]/10 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Monolithic Handover'}</span>
          <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-5 leading-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Compliance. Durability.<br />Scale-Readiness.
          </h2>
          <p className="text-[#424242]/55 font-light text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
            From geotech planning to concrete sign-offs, we hold a zero-tolerance margin. Start coordinating with our senior structural planners today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:build@jagathi.com" className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#333] transition-colors" data-interactive>
              Talk to Advisory Team <span>→</span>
            </a>
            <a href="#deck" className="inline-flex items-center justify-center gap-2 border border-[#424242]/25 text-[#424242] px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300" data-interactive>
              Request Capability Deck <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
