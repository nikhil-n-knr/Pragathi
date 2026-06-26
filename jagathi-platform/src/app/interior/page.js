'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/* ─── Data ─────────────────────────────────────── */
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

const planningItems = [
  { title: 'Layout & Circulation Logic', desc: 'Analyzing functional zones, movement vectors, and sightlines to maximize ergonomics and spatial flow.' },
  { title: 'Execution Scope', desc: 'Full-scale electrical-light sync, custom false ceilings, custom carpentry integration, and structural partition walls.' },
  { title: 'Signature Environments', desc: 'Curating premium hospitality lounges, retail showrooms, corporate director suites, and luxury penthouses.' },
];

const workflowItems = [
  { title: 'Stage 01 / Material Selection', desc: 'Choosing stones, fine hardwoods, structural metal finishes, and textiles from our physical materials lab.' },
  { title: 'Stage 02 / In-house Fabrication', desc: 'Precision carpentry, cladding prep, and customized light fittings built in our dedicated fabrication centers.' },
  { title: 'Stage 03 / Delivery & Fitting', desc: 'One point of contact managing assembly, light installation, joinery alignments, and final surface curations.' },
];

/* ─── Component ─────────────────────────────────── */
export default function InteriorPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const revealEls = gsap.utils.toArray('.ir-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="w-full min-h-screen text-[#424242]" style={{ fontFamily: '"Outfit", sans-serif', backgroundColor: '#F8F7F4' }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '88vh' }}>
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/interior/penthouse.webp"
            alt="Interior Design"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.38) saturate(0.75)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.25) 70%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 55%)' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-24" style={{ minHeight: '88vh' }}>
          <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.35em] mb-5 block">{'// Pillar 02 / Interspace Design'}</span>
          <h1 className="font-bold text-white uppercase leading-none mb-6" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: 'clamp(2.6rem, 7vw, 7rem)', letterSpacing: '-0.02em' }}>
            Spatial<br />
            <span style={{ fontWeight: 300, opacity: 0.75, fontSize: '0.65em', letterSpacing: '0.02em' }}>Systems</span>
          </h1>
          <div className="h-px w-12 bg-[#FFEA0A] mb-6" />
          <p className="text-white/60 font-light leading-relaxed max-w-lg" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            We design and execute flawless interior spaces. From master planning and bespoke carpentry to structural lighting and texture curation — every square inch managed in-house, concept to handover.
          </p>
        </div>
      </section>

      {/* ── Space Types ───────────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#F8F7F4]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 ir-reveal">
            <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Space Typologies'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Environments We Curate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spaceTypes.map((space, i) => (
              <div key={i} className="ir-reveal group overflow-hidden border border-[#424242]/10 bg-white hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={space.image}
                    alt={space.label}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    style={{ filter: 'brightness(0.9)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">{space.tag}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[15px] uppercase tracking-wide mb-2">{space.label}</h3>
                  <p className="text-[#424242]/50 font-light text-[13px] leading-relaxed">{space.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spatial Planning & Workflow ───────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-white border-t border-[#424242]/8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 mb-16">
            <div className="ir-reveal">
              <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Design Clusters'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Spatial Planning</h2>
              <div className="flex flex-col gap-6">
                {planningItems.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/15 pl-5 hover:border-[#424242]/60 transition-colors duration-300">
                    <h4 className="font-semibold text-sm uppercase tracking-wide mb-1.5">{item.title}</h4>
                    <p className="text-[#424242]/55 font-light text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="ir-reveal">
              <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Curation Process'}</span>
              <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>Turnkey Workflow</h2>
              <div className="flex flex-col gap-6">
                {workflowItems.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#424242]/15 pl-5 hover:border-[#424242]/60 transition-colors duration-300">
                    <h4 className="font-semibold text-sm uppercase tracking-wide mb-1.5">{item.title}</h4>
                    <p className="text-[#424242]/55 font-light text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processStages.map((stage, i) => (
              <div key={i} className="ir-reveal group border border-[#424242]/10 bg-[#F8F7F4] p-6 hover:border-[#424242]/30 hover:shadow-md transition-all duration-300">
                <span className="text-[#FFEA0A] font-mono text-[10px] bg-[#424242] px-2.5 py-1 inline-block tracking-widest mb-4">{stage.num}</span>
                <h3 className="font-semibold text-sm uppercase tracking-wide mb-3">{stage.title}</h3>
                <p className="text-[#424242]/45 font-light text-[13px] leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Material Swatches ─────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 xl:px-24 bg-[#F8F7F4]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-14 ir-reveal">
            <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">{'// Material Language'}</span>
            <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>Material Swatches & Finishes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {swatches.map((s, i) => (
              <div key={i} className="ir-reveal group border border-[#424242]/10 bg-white overflow-hidden hover:border-[#424242]/25 hover:shadow-xl transition-all duration-500">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    style={{ filter: 'brightness(0.88)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#FFEA0A] bg-[#424242] px-2.5 py-1 border border-[#FFEA0A]/20">{s.tag}</span>
                </div>
                <div className="p-6">
                  <span className="text-[#424242]/40 font-mono text-[8px] uppercase tracking-widest block mb-2">{s.label}</span>
                  <h3 className="font-bold text-[15px] uppercase tracking-wide mb-2">{s.title}</h3>
                  <p className="text-[#424242]/50 font-light text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="w-full py-20 md:py-28 px-6 border-t border-[#424242]/10 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[#424242]/40 font-mono text-[10px] uppercase tracking-[0.3em] block mb-5">{'// Custom Spaces'}</span>
          <h2 className="font-bold text-2xl md:text-4xl uppercase tracking-tight mb-5 leading-tight" style={{ fontFamily: '"Outfit", sans-serif' }}>
            Consult our Turnkey<br />Design Team.
          </h2>
          <p className="text-[#424242]/55 font-light text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
            From preliminary layouts to fabric selection and installation, we manage the entire spatial lifecycle. Book a concept meeting today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:design@jagathi.com" className="inline-flex items-center justify-center gap-2 bg-[#424242] text-[#FFEA0A] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#333] transition-colors" data-interactive>
              Consult Turnkey Planner <span>→</span>
            </a>
            <a href="#catalog" className="inline-flex items-center justify-center gap-2 border border-[#424242]/25 text-[#424242] px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#424242] hover:text-[#FFEA0A] transition-all duration-300" data-interactive>
              Explore Catalog <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}