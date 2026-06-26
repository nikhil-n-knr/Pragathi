'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import HomeScene from '../../components/scenes/HomeScene';

/* ─── Data ─────────────────────────────────────── */
const processSteps = [
  { num: '01', title: 'Site Survey & Geotech', desc: 'Deep core drilling, soil-matrix stress mapping, hydrostatic pressure profiling, and environmental compliance baseline. We examine the earth before laying a single stone.' },
  { num: '02', title: 'BIM & Structural Design', desc: '3D BIM modeling integration to cross-verify load distributions, shear walls, and cantilever forces prior to casting. Digital twins prevent physical errors.' },
  { num: '03', title: 'Foundation & Piling', desc: 'Reinforced pile caps, isolated footings, and raft foundation systems engineered to M50 grade concrete standards. Built to anchor massive structures forever.' },
  { num: '04', title: 'Superstructure Build', desc: 'Column and slab cycles, core wall formation, structural steel erection, and floor deck expansion. Every floor poured with mathematical consistency.' },
  { num: '05', title: 'MEP & Systems Sync', desc: 'Mechanical, electrical, and plumbing coordination built in-parallel with structural timelines to eliminate rework loops and guarantee spatial synergy.' },
  { num: '06', title: 'Handover & Sign-off', desc: 'Non-Destructive Testing, concrete compressive strength metrics, regulatory structural audits, and zero-punch-list final handover to client.' },
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
  { title: 'Site Geotech Planning', desc: 'Deep core drilling, soil-matrix stress mapping, and hydrostatic pressure testing.' },
  { title: 'Structural Coordination', desc: '3D BIM modeling integration to cross-verify load stress distributions prior to concrete casting.' },
  { title: 'Material Verification', desc: 'NDT testing, concrete cube compressive metrics, and structural steel shear verification.' },
];

/* ─── Component ─────────────────────────────────── */
export default function ConstructionPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const stat1 = useRef(null);
  const stat2 = useRef(null);
  const stat3 = useRef(null);

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
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/construction/bridge.webp"
            alt="Construction"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.35) saturate(0.7)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 70%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }} />
        </div>

        {/* Top Navbar spacer */}
        <div className="w-full py-8" />

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-12 relative w-full">
          {/* Glassmorphic description card (Right Aligned) */}
          <div className="absolute top-[15%] md:top-auto md:bottom-[30%] right-6 md:right-16 lg:right-24 w-[90%] md:w-[32rem] p-8 md:p-10 border border-white/10 rounded-sm z-20"
               style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <span className="text-[#FFEA0A] font-mono text-[9px] uppercase tracking-[0.3em] block mb-4">{'// Structural Mandate'}</span>
            <p className="text-white/90 font-light leading-relaxed text-sm md:text-base" style={{ fontFamily: '"Outfit", sans-serif' }}>
              We manage the entire lifecycle of heavy civil, land development, and commercial infrastructure — anchored in mathematical precision, strict structural integrity, and zero-compromise execution.
            </p>
          </div>

          {/* Massive Brand Headline (Left Aligned) */}
          <div className="relative mt-auto pointer-events-none select-none z-10 max-w-4xl">
            <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.35em] mb-4 block">{'// Pillar 01 / Infrastructure'}</span>
            <h1 className="font-bold text-white uppercase leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 8vw, 8.5rem)', letterSpacing: '-0.03em' }}>
              CONSTRUCTION
            </h1>
          </div>
        </div>
      </section>

      {/* ── Stats Strip (Solid Block) ────────────── */}
      <section id="con-stats" className="relative z-10 w-full bg-[#1E1E1E]">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
            {[
              { ref: stat1, init: '0T', label: 'Reinforcement Steel Laid', code: '// MAT_STEEL' },
              { ref: stat2, init: '0m³', label: 'M50 Concrete Cast', code: '// MAT_CONCRETE' },
              { ref: stat3, init: '0%', label: 'Safety Audit Rating', code: '// AUDIT_SAFE' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-12 md:py-16 px-6 text-center">
                <span className="text-[#FFEA0A]/40 font-mono text-[8px] block mb-3 tracking-widest">{s.code}</span>
                <div ref={s.ref} className="text-[#FFEA0A] font-bold font-mono leading-none mb-3" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>{s.init}</div>
                <div className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capability & Science (Double-Column Editorial Layout) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-transparent">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Left Column: Capabilities & Image */}
          <div className="cr-reveal flex flex-col justify-between">
            <div>
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Scope of Operations'}</span>
              <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight mb-8">CAPABILITY CLUSTERS</h2>
              <div className="flex flex-col gap-10">
                {capabilities.map((item, i) => (
                  <div key={i} className="border-t border-[#424242]/15 pt-6 hover:bg-[#424242]/5 px-4 -mx-4 rounded-sm transition-all duration-300">
                    <h4 className="font-bold text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual block */}
            <div className="mt-16 h-[35vh] md:h-[45vh] w-full border border-[#424242]/10 overflow-hidden relative group rounded-sm">
              <img
                src="/assets/images/construction/industrial.webp"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                alt="Industrial Site"
              />
            </div>
          </div>

          {/* Right Column: Approach & Image */}
          <div className="cr-reveal flex flex-col justify-between mt-20 lg:mt-0">
            {/* Visual block first for staggered grid look */}
            <div className="mb-16 h-[35vh] md:h-[45vh] w-full border border-[#424242]/10 overflow-hidden relative group rounded-sm">
              <img
                src="/assets/images/construction/highrise.webp"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                alt="Highrise core construction"
              />
            </div>
            <div>
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Engineering Rigor'}</span>
              <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight mb-8">SCIENTIFIC APPROACH</h2>
              <div className="flex flex-col gap-10">
                {science.map((item, i) => (
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

      {/* ── Build Process (Sticky Card Stack Section - No White Backing!) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-transparent border-t border-[#424242]/10">
        <div className="max-w-[1400px] mx-auto relative">
          <div className="mb-24 cr-reveal text-center">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Delivery Method'}</span>
            <h2 className="font-bold text-3xl md:text-6xl uppercase tracking-tight">OUR BUILD PROCESS</h2>
          </div>

          {/* Stacking Cards Container */}
          <div className="relative flex flex-col gap-[10vh]">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className="sticky top-[15vh] w-full flex items-center justify-center mb-[5vh] z-10"
              >
                <div className="w-[96%] md:w-[90%] bg-[#1E1E1E] border border-white/10 rounded-sm shadow-2xl p-8 md:p-14 min-h-[45vh] md:min-h-[55vh] flex flex-col justify-between text-white transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-[#FFEA0A] font-mono text-[11px] bg-white/5 border border-[#FFEA0A]/20 px-3 py-1.5 flex-shrink-0 tracking-widest">{step.num}</span>
                      <h3 className="font-bold text-lg md:text-2xl uppercase tracking-wide text-white">{step.title}</h3>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em] text-[#FFEA0A] mt-2 md:mt-0 uppercase">{'// PHASE_0' + (i+1)}</span>
                  </div>
                  
                  <p className="text-white/60 font-light text-sm md:text-lg leading-relaxed max-w-3xl" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    {step.desc}
                  </p>

                  <div className="flex justify-end mt-8">
                    <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">JAGATHI STANDARD / SECURED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials Science (Solid charcoal block) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-[#1E1E1E]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-24 cr-reveal">
            <span className="text-[#FFEA0A]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Material Standards'}</span>
            <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight text-white">Materials Science</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {materials.map((m, i) => (
              <div key={i} className="cr-reveal group border border-white/5 p-8 hover:border-[#FFEA0A]/30 transition-all duration-350 bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <span className="text-[#FFEA0A]/40 font-mono text-[8px] tracking-[0.3em] block mb-5 uppercase">{m.code}</span>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2 group-hover:text-[#FFEA0A] transition-colors duration-300">{m.name}</h3>
                  <span className="text-[#FFEA0A]/50 font-mono text-[9px] uppercase tracking-wider block mb-5">{m.spec}</span>
                  <div className="h-px bg-white/5 mb-5" />
                  <p className="text-white/40 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Signature Outcomes (Transparent) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 bg-transparent border-t border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-24 cr-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Signature Outcomes'}</span>
            <h2 className="font-bold text-3xl md:text-5xl uppercase tracking-tight">Signature Civil Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {portfolioCards.map((card, i) => (
              <div key={i} className="cr-reveal group border border-[#424242]/12 bg-white/20 overflow-hidden hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/11' }}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-4 text-[9px] font-mono tracking-[0.25em] text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-8">
                    <span className="text-[#424242]/50 font-mono text-[9px] uppercase tracking-widest block mb-2">{card.sector}</span>
                    <h3 className="font-bold text-lg uppercase tracking-wide mb-3">{card.title}</h3>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (Glassmorphic background - no plain white section!) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 bg-transparent border-t border-[#424242]/10">
        <div className="max-w-3xl mx-auto text-center"
             style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', padding: '5rem 2rem' }}>
          <span className="text-[#424242]/45 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Monolithic Handover'}</span>
          <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-5 leading-tight">
            Compliance. Durability.<br />Scale-Readiness.
          </h2>
          <p className="text-[#424242]/60 font-light text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ fontFamily: '"Outfit", sans-serif' }}>
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
