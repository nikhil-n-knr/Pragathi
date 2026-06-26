'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import HomeScene from '../../components/scenes/HomeScene';

/* ─── Data ─────────────────────────────────────── */
const spaceTypes = [
  { label: 'Penthouse Living', tag: '[ RESIDENTIAL ]', image: '/assets/images/interior/penthouse.webp', desc: 'Full-height curtain wall glazing, Calacatta stone floors, bespoke joinery. Crafted to collector standard.' },
  { label: 'Corporate Boardroom', tag: '[ CORPORATE ]', image: '/assets/images/interior/corporate.webp', desc: 'Acoustic wall panels, coffered LED ceilings, precision millwork. Built for authority and performance.' },
  { label: 'Hospitality Lounge', tag: '[ HOSPITALITY ]', image: '/assets/images/interior/hospitality.webp', desc: 'Double-height atriums, sculptural light installations, stone cladding. Luxury delivered at guest-facing scale.' },
];

const processStages = [
  { num: '01', title: 'Concept & Brief', desc: 'Client brief translation into spatial mood boards, material palettes, and layout studies. We define the language before we lift a tool.', image: '/assets/images/interior-design-modern-loft-drawing-600nw-1102581248.webp' },
  { num: '02', title: 'Material Selection', desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our curated materials library — every sample approved in-person.', image: '/assets/images/landmarks/calacatta_after.webp' },
  { num: '03', title: 'In-house Fabrication', desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication center — no third-party delays.', image: '/assets/images/modern-wooden-sauna-geometric-interior-stylish-relaxation-space_169016-68903.webp' },
  { num: '04', title: 'Delivery & Fitting', desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations to zero-punch-list handover.', image: '/assets/images/interior/penthouse.webp' },
];

const swatches = [
  { tag: '[ CALACATTA HONED ]', label: 'Texture 01 / Italian Stone', title: 'Dark Veined Marble', desc: 'Deep charcoal marble surfaces with structural golden veins, honed white Calacatta finish for luxury tactility.', image: '/assets/images/landmarks/calacatta_after.webp' },
  { tag: '[ SMOKED OAK ]', label: 'Texture 02 / Hardwood', title: 'Bespoke Smoked Joinery', desc: 'Stained smoked oak features designed for floating sideboard cabinetry and wall paneling.', image: '/assets/images/modern-wooden-sauna-geometric-interior-stylish-relaxation-space_169016-68903.webp' },
  { tag: '[ TACTILE BOUCLÉ ]', label: 'Texture 03 / Upholstery', title: 'Bouclé Lounge Curation', desc: 'High-tactility bouclé fabric selected for parametric furniture curations and lounge seating.', image: '/assets/images/photo-1616611213095-58abb651f70c.webp' },
];

const planningItems = [
  { title: 'Layout & Circulation Logic', desc: 'Analyzing functional zones, movement vectors, and sightlines to maximize ergonomics and spatial flow.' },
  { title: 'Execution Scope Analysis', desc: 'Full-scale electrical-light sync, custom false ceilings, custom carpentry integration, and structural partition walls.' },
  { title: 'Signature Environments', desc: 'Curating premium hospitality lounges, retail showrooms, corporate director suites, and luxury penthouses.' },
];

const workflowItems = [
  { title: 'Stage 01 / Material Lab', desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our physical materials lab.' },
  { title: 'Stage 02 / CNC Carpentry', desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication centers.' },
  { title: 'Stage 03 / Surface Curation', desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations.' },
];

/* ─── Component ─────────────────────────────────── */
export default function InteriorPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);

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

    const revealEls = gsap.utils.toArray('.ir-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
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
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center z-10 border-b border-[#424242]/10 text-center px-6 md:px-16 lg:px-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/interior/penthouse.webp"
            alt="Interior Design"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.35) saturate(0.7)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.85) 100%)' }} />
        </div>
        
        {/* Centered Content Area */}
        <div className="relative z-10 max-w-4xl flex flex-col items-center justify-center">
          <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.35em] mb-6 block">{'// Pillar 02 / Interspace Design'}</span>
          
          <h1 className="font-bold text-white uppercase leading-none mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)', letterSpacing: '-0.02em' }}>
            SPATIAL SYSTEMS
          </h1>
          
          <div className="h-px w-20 bg-[#FFEA0A] mb-8" />
          
          {/* Centered glassmorphic card */}
          <div className="p-8 md:p-10 border border-white/10 rounded-sm w-full max-w-2xl bg-white/5 backdrop-blur-md">
            <span className="text-[#FFEA0A] font-mono text-[9px] uppercase tracking-[0.3em] block mb-4">{'// Design Philosophy'}</span>
            <p className="text-white/90 font-light leading-relaxed text-sm md:text-base" style={{ fontFamily: '"Outfit", sans-serif' }}>
              We design and execute flawless interior spaces. From master planning and bespoke carpentry to structural lighting and texture curation — every square inch managed in-house, concept to handover.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer after Hero */}
      <div className="h-28 md:h-44 w-full" />

      {/* ── Space Types (Transparent with centered card layouts) ── */}
      <section className="relative z-10 w-full py-28 md:py-36 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-40 bg-transparent text-center flex flex-col items-center">
        <div className="max-w-[1400px] w-full flex flex-col items-center">
          <div className="text-center mb-20 ir-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Space Typologies'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight">Environments We Curate</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-20 w-full">
            {spaceTypes.map((space, i) => (
              <div key={i} className="ir-reveal group overflow-hidden border border-[#424242]/12 bg-white/20 hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500 flex flex-col justify-between text-center items-center w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.33%-2.5rem)] max-w-sm">
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={space.image}
                      alt={space.label}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      style={{ filter: 'brightness(0.9)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">{space.tag}</span>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col items-center">
                    <h3 className="font-bold text-lg uppercase tracking-wide mb-3">{space.label}</h3>
                    <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed max-w-xs" style={{ fontFamily: '"Outfit", sans-serif' }}>{space.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer after Space Types */}
      <div className="h-28 md:h-44 w-full" />

      {/* ── Spatial Planning & Workflow (Editorial Centered Grid - Transparent Background) ── */}
      <section className="relative z-10 w-full py-32 md:py-48 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-40 bg-transparent border-t border-[#424242]/10 text-center flex flex-col items-center">
        <div className="max-w-[1400px] w-full flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-16 md:gap-24 lg:gap-32 w-full">
            
            {/* Left Column: Spatial Planning */}
            <div className="ir-reveal flex flex-col items-center w-full md:w-[45%] max-w-xl">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Design Clusters'}</span>
              <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-8">Spatial Planning</h2>
              <div className="flex flex-col gap-10 w-full">
                {planningItems.map((item, i) => (
                  <div key={i} className="border-t border-[#424242]/15 pt-6 hover:bg-[#424242]/5 px-6 py-6 rounded-sm transition-all duration-300 flex flex-col items-center">
                    <h4 className="font-bold text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed max-w-sm" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Turnkey Workflow */}
            <div className="ir-reveal flex flex-col items-center mt-20 md:mt-0 w-full md:w-[45%] max-w-xl">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Curation Process'}</span>
              <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-8">Turnkey Workflow</h2>
              <div className="flex flex-col gap-10 w-full">
                {workflowItems.map((item, i) => (
                  <div key={i} className="border-t border-[#424242]/15 pt-6 hover:bg-[#424242]/5 px-6 py-6 rounded-sm transition-all duration-300 flex flex-col items-center">
                    <h4 className="font-bold text-base uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-[#424242]/70 font-light text-xs md:text-sm leading-relaxed max-w-sm" style={{ fontFamily: '"Outfit", sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer after Workflow */}
      <div className="h-28 md:h-44 w-full" />

      {/* ── Our Design Process (Sticky Card Stack Section) ── */}
      <section className="relative z-10 w-full py-28 md:py-36 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-40 bg-transparent border-t border-[#424242]/10">
        <div className="max-w-[1400px] mx-auto relative flex flex-col items-center">
          <div className="mb-24 ir-reveal text-center">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Concept to Fitting'}</span>
            <h2 className="font-bold text-3xl md:text-6xl uppercase tracking-tight">OUR DESIGN PROCESS</h2>
          </div>

          <div className="relative w-full pb-[25vh]">
            {processStages.map((stage, i) => {
              const rowDirection = i % 2 === 1 ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row';
              return (
                <div
                  key={i}
                  className={`sticky top-[15vh] mx-auto w-[96%] md:w-[85%] max-w-[1100px] bg-[#1E1E1E] border border-white/10 rounded-sm shadow-2xl overflow-hidden flex ${rowDirection} items-stretch justify-between gap-0 min-h-[50vh] md:h-[52vh] md:min-h-[480px] text-white z-10 mb-[12vh]`}
                >
                  
                  {/* Details Column */}
                  <div className="p-8 md:p-12 flex flex-col justify-between items-center text-center w-full md:w-[60%] flex-shrink-0 md:h-full">
                    <div className="flex flex-col items-center w-full">
                      <span className="text-[#FFEA0A] font-mono text-[10px] bg-white/5 border border-[#FFEA0A]/20 px-3 py-1.5 inline-block tracking-widest mb-4">{stage.num}</span>
                      <h3 className="font-bold text-xl md:text-3xl uppercase tracking-wide text-white mb-2">{stage.title}</h3>
                      <span className="font-mono text-[8px] tracking-[0.3em] text-[#FFEA0A] uppercase mt-2">{'// INTERSPACE_0' + (i+1)}</span>
                    </div>

                    <p className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-xl mt-6" style={{ fontFamily: '"Outfit", sans-serif' }}>
                      {stage.desc}
                    </p>

                    <div className="flex justify-center mt-8 w-full border-t border-white/5 pt-4">
                      <span className="text-white/20 font-mono text-[8px] uppercase tracking-widest">JAGATHI SPATIAL / QUALITY GUARANTEED</span>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className="relative w-full h-[30vh] md:h-full md:w-[40%] overflow-hidden group flex-shrink-0">
                    <img
                      src={stage.image}
                      alt={stage.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spacer after Design Process */}
      <div className="h-28 md:h-44 w-full" />

      {/* ── Material Swatches (Transparent Grid - Centered cards) ── */}
      <section className="relative z-10 w-full py-28 md:py-36 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-40 bg-transparent border-t border-[#424242]/10 text-center flex flex-col items-center">
        <div className="max-w-[1600px] w-full flex flex-col items-center">
          <div className="text-center mb-20 ir-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Material Language'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight">Material Swatches & Finishes</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 w-full max-w-[1400px]">
            {swatches.map((s, i) => (
              <div key={i} className="ir-reveal group border border-[#424242]/12 bg-white/20 overflow-hidden hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500 flex flex-col justify-between text-center items-center w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.33%-2.5rem)] max-w-sm">
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      style={{ filter: 'brightness(0.88)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">{s.tag}</span>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col items-center">
                    <span className="text-[#424242]/50 font-mono text-[8px] uppercase tracking-widest block mb-2">{s.label}</span>
                    <h3 className="font-bold text-[15px] md:text-[17px] uppercase tracking-wide mb-3">{s.title}</h3>
                    <p className="text-[#424242]/75 font-light text-[13px] md:text-sm leading-relaxed max-w-xs" style={{ fontFamily: '"Outfit", sans-serif' }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer before CTA */}
      <div className="h-28 md:h-44 w-full" />

      {/* ── CTA (Glassmorphic Box) ── */}
      <section className="relative z-10 w-full py-28 md:py-36 px-6 bg-transparent border-t border-[#424242]/10 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center"
             style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', padding: '6rem 3rem' }}>
          <span className="text-[#424242]/45 font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">{'// Custom Spaces'}</span>
          <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-5 leading-tight">
            Consult our Turnkey<br />Design Team.
          </h2>
          <p className="text-[#424242]/60 font-light text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ fontFamily: '"Outfit", sans-serif' }}>
            From preliminary layouts to fabric selection and installation, we manage the entire spatial lifecycle. Book a concept meeting today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="mailto:design@jagathi.com" className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-10 py-5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#333] transition-colors" data-interactive>
              Consult Turnkey Planner <span>→</span>
            </a>
            <a href="#catalog" className="inline-flex items-center justify-center gap-2 border border-[#424242]/25 text-[#424242] px-10 py-5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300" data-interactive>
              Explore Catalog <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}