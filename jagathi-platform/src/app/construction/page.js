'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ConstructionScene from '../../components/scenes/ConstructionScene';

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
  {
    tag: '[ CABLE-STAYED BRIDGE ]',
    sector: 'Case 01 / Civic Infrastructure',
    title: 'Orion Link Bridge',
    desc: 'Suspended steel-lattice cable-stayed arc spanning 420m. Genetic structural load-balancing algorithm-driven tension pylon design.',
    image: '/assets/images/construction/bridge.webp',
  },
  {
    tag: '[ COMMERCIAL HIGH-RISE ]',
    sector: 'Case 02 / Commercial Tower',
    title: 'Silicon Arc Tower',
    desc: 'Grade-A commercial high-rise with parametric concrete core, curtain wall glazing system, and wind-resilient load distribution frames.',
    image: '/assets/images/construction/highrise.webp',
  },
  {
    tag: '[ CHEMICAL PROCESSING ]',
    sector: 'Case 03 / Industrial Plant',
    title: 'Cogen Industrial Complex',
    desc: 'Supercooled chemical processing facility. Vibration isolation foundation matrices for heavy turbine and pressure vessel loops.',
    image: '/assets/images/construction/industrial.webp',
  },
];

export default function ConstructionPage() {
  const scrollContainerRef = useRef(null);
  const scrollProgress = useRef(0);
  const [isInView, setIsInView] = useState(true);
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);

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
        setIsInView((prev) => {
          if (prev !== currentInView) return currentInView;
          return prev;
        });
      }
    });

    // Counter animation
    const statVal1 = { val: 0 }, statVal2 = { val: 0 }, statVal3 = { val: 0 };
    const counterTrigger = ScrollTrigger.create({
      trigger: '#construction-stats-strip',
      start: 'top bottom-=100',
      onEnter: () => {
        gsap.to(statVal1, { val: 1200, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat1.current) stat1.current.textContent = statVal1.val + 'T'; } });
        gsap.to(statVal2, { val: 4500, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat2.current) stat2.current.textContent = statVal2.val + 'm³'; } });
        gsap.to(statVal3, { val: 99, duration: 2.0, ease: 'power3.out', snap: 'val', onUpdate: () => { if (stat3.current) stat3.current.textContent = statVal3.val + '%'; } });
      }
    });

    // Scroll reveals
    const revealEls = document.querySelectorAll('.cr-reveal');
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
      counterTrigger.kill();
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
          style={{ pointerEvents: 'none' }}
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 10, 7]} intensity={0.8} />
          <ConstructionScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero */}
      <section className="relative h-screen flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 z-10 pointer-events-none w-full max-w-5xl">
        <span className="text-[#424242]/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">{'// Pillar 01 / Construction & Land Development'}</span>
        <h1 className="text-[#424242] font-bold text-4xl sm:text-5xl md:text-7xl leading-none uppercase tracking-tight select-text mb-6" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
          Construction<br />
          <span className="font-light text-[#424242]/70 italic text-3xl sm:text-4xl md:text-6xl tracking-wide">& Land Development</span>
        </h1>
        <div className="border-l-2 border-[#424242]/25 pl-5 md:pl-7 py-2 max-w-lg">
          <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed select-text">
            We manage the entire lifecycle of heavy civil, land development, and commercial infrastructure — anchored in mathematical precision, strict structural integrity, and zero-compromise execution.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-8 opacity-70">
          <span className="w-2 h-2 rounded-full bg-[#424242] animate-pulse" />
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#424242]/60">Active Site Operations</span>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section
        id="construction-stats-strip"
        className="relative z-10 w-full px-4 md:px-8 lg:px-12"
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#FFEA0A]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#FFEA0A]/15 bg-[#424242]/95 py-12 shadow-2xl">
            {[
              { ref: stat1, init: '0T', label: '// Reinforcement Steel Laid', code: '// CAP_VALUE_A // MAT_STEEL' },
              { ref: stat2, init: '0m³', label: '// M50 Concrete Cast', code: '// CAP_VALUE_B // MAT_CONCRETE' },
              { ref: stat3, init: '0%', label: '// Safety Audit Rating', code: '// CAP_VALUE_C // AUDIT_SAFE' },
            ].map((s, i) => (
              <div key={i} className="py-8 sm:py-0 flex flex-col items-center justify-center">
                <span className="text-[#FFEA0A]/35 font-mono text-[7px] block mb-3">{s.code}</span>
                <div ref={s.ref} className="text-[#FFEA0A] font-bold font-mono tracking-wider" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{s.init}</div>
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Capability Clusters */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">
          <div className="cr-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// What We Build'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Capability Clusters</h2>
            <div className="flex flex-col gap-6">
              {[
                { title: 'Industrial Infrastructure', desc: 'Supercooled chemical spaces, thermodynamic piping loops, and heavy machinery footing vaults designed for structural isolation.' },
                { title: 'Commercial Frameworks', desc: 'Parametric high-rises and corporate spaces using carbon-fiber wind-resilient load distribution grids.' },
                { title: 'Heavy Civic & Bridges', desc: 'Multi-lane cable-stayed arcs configured via genetic structural load-balancing algorithms.' },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300 cursor-default">
                  <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                  <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="cr-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// Engineering Discipline'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Scientific Approach</h2>
            <div className="flex flex-col gap-6">
              {[
                { title: '01 / Site Geotech Planning', desc: 'Deep core drilling, soil-matrix stress mapping, and hydrostatic pressure testing.' },
                { title: '02 / Structural Coordination', desc: '3D BIM modeling integration to cross-verify load stress distributions prior to concrete casting.' },
                { title: '03 / Material Verification', desc: 'NDT testing, concrete cube compressive metrics, and structural steel shear verification.' },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300 cursor-default">
                  <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                  <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Timeline */}
      <section className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-[#424242]/5 border-y border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Delivery Method'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Our Build Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="cr-reveal relative bg-white/60 border border-[#424242]/10 p-6 md:p-8 hover:border-[#424242]/30 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[#FFEA0A] font-mono text-xs bg-[#424242] px-2 py-1 flex-shrink-0 tracking-widest">{step.num}</span>
                  <h3 className="text-[#424242] font-semibold text-sm md:text-base uppercase tracking-wide leading-tight group-hover:text-[#424242] transition-colors">{step.title}</h3>
                </div>
                <p className="text-[#424242]/60 font-light text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Materials Science */}
      <section className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-[#424242]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#FFEA0A]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Material Standards'}</span>
            <h2 className="text-white font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Materials Science</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {materials.map((m, i) => (
              <div key={i} className="cr-reveal border border-[#FFEA0A]/15 p-7 md:p-8 hover:border-[#FFEA0A]/40 transition-all duration-300 group">
                <span className="text-[#FFEA0A]/50 font-mono text-[8px] tracking-[0.35em] block mb-4">{m.code}</span>
                <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-wide mb-2 group-hover:text-[#FFEA0A] transition-colors duration-300">{m.name}</h3>
                <span className="text-[#FFEA0A]/60 font-mono text-[9px] uppercase tracking-wider block mb-4">{m.spec}</span>
                <div className="h-px bg-[#FFEA0A]/10 mb-4" />
                <p className="text-gray-400 font-light text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Portfolio Cards */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 cr-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Signature Outcomes'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Signature Civil Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {portfolioCards.map((card, i) => (
              <div key={i} className="cr-reveal group border border-[#424242]/15 bg-white/40 overflow-hidden hover:border-[#424242]/35 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#424242]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-[0.25em] text-[#FFEA0A] bg-[#424242] px-2 py-1 border border-[#FFEA0A]/20">
                    {card.tag}
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-[#424242]/50 font-mono text-[8px] uppercase tracking-widest block mb-2">{card.sector}</span>
                  <h3 className="text-[#424242] font-bold text-base uppercase tracking-wide mb-2 group-hover:text-[#424242] transition-colors">{card.title}</h3>
                  <p className="text-[#424242]/60 font-light text-xs leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="relative z-10 py-20 md:py-28 bg-transparent border-t border-[#424242]/15 w-full">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Monolithic Handover'}</span>
          <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight mb-6 leading-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Compliance. Durability.<br />Scale-Readiness.
          </h2>
          <p className="text-[#424242]/65 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            From geotech planning to concrete sign-offs, we hold a zero-tolerance margin. Start coordinating with our senior structural planners today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:build@jagathi.com"
              className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#555] transition-colors"
              data-interactive>
              Talk to Advisory Team <span>→</span>
            </a>
            <a href="#deck"
              className="inline-flex items-center justify-center gap-2 border border-[#424242]/35 text-[#424242] px-8 py-4 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300"
              data-interactive>
              Request Capability Deck <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
