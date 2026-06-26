'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import InteriorScene from '../../components/scenes/InteriorScene';

const spaceTypes = [
  { label: 'Penthouse Living', tag: '[ RESIDENTIAL ]', image: '/assets/images/interior/penthouse.webp', desc: 'Full-height curtain wall glazing, Calacatta stone floors, bespoke joinery. Crafted to collector standard.' },
  { label: 'Corporate Boardroom', tag: '[ CORPORATE ]', image: '/assets/images/interior/corporate.webp', desc: 'Acoustic wall panels, coffered LED ceilings, precision millwork. Built for authority and performance.' },
  { label: 'Hospitality Lounge', tag: '[ HOSPITALITY ]', image: '/assets/images/interior/hospitality.webp', desc: 'Double-height atriums, sculptural light installations, stone cladding. Luxury delivered at guest-facing scale.' },
];

const processStages = [
  { num: '01', title: 'Concept & Brief', desc: 'Client brief translation into spatial mood boards, material palettes, and layout studies. We define the language before we lift a tool.' },
  { num: '02', title: 'Material Selection', desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our curated materials library — every sample approved in-person.' },
  { num: '03', title: 'In-house Fabrication', desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication center — no third-party delays.' },
  { num: '04', title: 'Delivery & Fitting', desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations to zero-punch-list handover.' },
];

const swatches = [
  { tag: '[ CALACATTA HONED ]', label: 'Texture 01 / Italian Stone', title: 'Dark Veined Marble', desc: 'Deep charcoal marble surfaces with structural golden veins, hone finished for luxury tactility.', image: '/assets/images/modern-room-with-wooden-staircase-daytime_181624-11447.webp' },
  { tag: '[ SMOKED OAK ]', label: 'Texture 02 / Hardwood', title: 'Bespoke Smoked Joinery', desc: 'Stained smoked oak features designed for floating sideboard cabinetry and wall paneling.', image: '/assets/images/modern-wooden-sauna-geometric-interior-stylish-relaxation-space_169016-68903.webp' },
  { tag: '[ TACTILE BOUCLÉ ]', label: 'Texture 03 / Upholstery', title: 'Bouclé Lounge Curation', desc: 'High-tactility bouclé fabric selected for parametric furniture curations and lounge seating.', image: '/assets/images/photo-1616611213095-58abb651f70c.webp' },
];

export default function InteriorPage() {
  const scrollProgress = useRef(0);
  const scrollContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

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

    const revealEls = document.querySelectorAll('.ir-reveal');
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
          camera={{ position: [2.0, -60.2, 4.8], fov: 60 }}
          gl={{ antialias: true, alpha: true, stencil: true, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'never'}
        >
          <ambientLight intensity={0.1} />
          <InteriorScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. Hero */}
      <section className="relative h-screen flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 z-10 pointer-events-none w-full max-w-5xl">
        <span className="text-[#424242]/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">{'// Pillar 02 / Interspace Design'}</span>
        <h1 className="text-[#424242] font-bold text-4xl sm:text-5xl md:text-7xl leading-none uppercase tracking-tight select-text mb-6" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
          Spatial<br />
          <span className="font-light text-[#424242]/70 italic text-3xl sm:text-4xl md:text-6xl tracking-wide">Systems</span>
        </h1>
        <div className="border-l-2 border-[#424242]/25 pl-5 md:pl-7 py-2 max-w-lg">
          <p className="text-[#424242]/75 font-light text-xs md:text-sm leading-relaxed select-text">
            We design and execute flawless interior spaces. From master planning and bespoke carpentry to structural lighting and texture curation — every square inch managed in-house, concept to handover.
          </p>
        </div>
      </section>

      {/* 3. Space Types — Image Grid */}
      <section className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 ir-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Space Typologies'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Environments We Curate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {spaceTypes.map((space, i) => (
              <div key={i} className="ir-reveal group overflow-hidden border border-[#424242]/12 hover:border-[#424242]/30 transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={space.image}
                    alt={space.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/85 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-1 border border-[#FFEA0A]/20">{space.tag}</span>
                </div>
                <div className="p-5 md:p-6 bg-white/50">
                  <h3 className="text-[#424242] font-bold text-sm md:text-base uppercase tracking-wide mb-2">{space.label}</h3>
                  <p className="text-[#424242]/60 font-light text-xs leading-relaxed">{space.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Spatial Curation & Turnkey Process */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16 bg-[#424242]/5 border-y border-[#424242]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 mb-16">
            <div className="ir-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// Design Clusters'}</span>
              <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Spatial Planning</h2>
              <div className="flex flex-col gap-5">
                {[
                  { title: 'Layout & Circulation Logic', desc: 'Analyzing functional zones, movement vectors, and sightlines to maximize ergonomics and spatial flow.' },
                  { title: 'Execution Scope', desc: 'Full-scale electrical-light sync, custom false ceilings, custom carpentry integration, and structural partition walls.' },
                  { title: 'Signature Environments', desc: 'Curating premium hospitality lounges, retail showrooms, corporate director suites, and luxury penthouses.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300">
                    <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="ir-reveal">
              <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em]">{'// Curation Process'}</span>
              <h2 className="text-[#424242] font-bold text-2xl md:text-3xl uppercase tracking-tight mt-3 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Turnkey Workflow</h2>
              <div className="flex flex-col gap-5">
                {[
                  { title: 'Stage 01 / Material Selection', desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our physical materials lab.' },
                  { title: 'Stage 02 / In-house Fabrication', desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication centers.' },
                  { title: 'Stage 03 / Delivery & Fitting', desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/20 pl-4 hover:border-[#424242] transition-colors duration-300">
                    <h4 className="text-[#424242] font-semibold text-sm uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[#424242]/65 font-light text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4-step process cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processStages.map((stage, i) => (
              <div key={i} className="ir-reveal bg-white/70 border border-[#424242]/10 p-6 hover:border-[#424242]/30 hover:shadow-lg transition-all duration-300 group">
                <span className="text-[#FFEA0A] font-mono text-xs bg-[#424242] px-2 py-1 inline-block tracking-widest mb-4">{stage.num}</span>
                <h3 className="text-[#424242] font-semibold text-sm uppercase tracking-wide mb-3 group-hover:text-[#424242] transition-colors">{stage.title}</h3>
                <p className="text-[#424242]/55 font-light text-xs leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Material Swatches */}
      <section className="relative z-10 py-20 md:py-28 w-full px-6 md:px-12 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 ir-reveal">
            <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-3">{'// Material Language'}</span>
            <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Material Swatches & Finishes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {swatches.map((s, i) => (
              <div key={i} className="ir-reveal group border border-[#424242]/12 bg-white/40 overflow-hidden hover:border-[#424242]/30 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#424242]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2 py-1 border border-[#FFEA0A]/20">{s.tag}</span>
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-[#424242]/50 font-mono text-[8px] uppercase tracking-widest block mb-2">{s.label}</span>
                  <h3 className="text-[#424242] font-bold text-sm uppercase tracking-wide mb-2">{s.title}</h3>
                  <p className="text-[#424242]/60 font-light text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="relative z-10 py-20 md:py-28 bg-transparent border-t border-[#424242]/15 w-full">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#424242]/50 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Custom Spaces'}</span>
          <h2 className="text-[#424242] font-bold text-2xl md:text-4xl uppercase tracking-tight mb-6 leading-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Consult our Turnkey<br />Design Team.
          </h2>
          <p className="text-[#424242]/65 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            From preliminary layouts to fabric selection and installation, we manage the entire spatial lifecycle. Book a concept meeting today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:design@jagathi.com"
              className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#555] transition-colors"
              data-interactive>
              Consult Turnkey Planner <span>→</span>
            </a>
            <a href="#catalog"
              className="inline-flex items-center justify-center gap-2 border border-[#424242]/35 text-[#424242] px-8 py-4 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300"
              data-interactive>
              Explore Catalog <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}