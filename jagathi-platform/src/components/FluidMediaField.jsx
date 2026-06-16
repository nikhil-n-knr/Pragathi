'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

function BeforeAfterSlider({ beforeImage, afterImage, title, aspect }) {
  const containerRef = useRef(null);
  const [sliderVal, setSliderVal] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const autoOscillateRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (isHovered) {
      if (autoOscillateRef.current) {
        cancelAnimationFrame(autoOscillateRef.current);
      }
      return;
    }

    const animate = () => {
      timeRef.current += 1.5;
      // Oscillate between 42% and 58%
      const val = 50 + Math.sin(timeRef.current * 0.02) * 8;
      setSliderVal(val);
      autoOscillateRef.current = requestAnimationFrame(animate);
    };

    autoOscillateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoOscillateRef.current) {
        cancelAnimationFrame(autoOscillateRef.current);
      }
    };
  }, [isHovered]);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderVal(percentage);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize bg-zinc-900 group/slider"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Before Image (Background) */}
      <img 
        src={beforeImage} 
        alt={`${title} Before`} 
        className="absolute inset-0 w-full h-full object-cover opacity-35 filter grayscale"
        draggable="false"
      />
      <div className="absolute top-4 left-4 text-[8px] font-mono tracking-widest text-yellow-400/50 bg-black/60 px-2.5 py-1 border border-yellow-400/10 rounded-sm">
        BEFORE // BLUEPRINT_RAW
      </div>

      {/* After Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)` }}
      >
        <img 
          src={afterImage} 
          alt={`${title} After`} 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          draggable="false"
        />
      </div>
      <div className="absolute top-4 right-4 text-[8px] font-mono tracking-widest text-yellow-400 bg-black/85 px-2.5 py-1 border border-yellow-400/20 rounded-sm font-semibold pointer-events-none">
        AFTER // ARCHITECTED
      </div>

      {/* Divider Bar */}
      <div 
        className="absolute inset-y-0 w-[1px] bg-yellow-400/80 pointer-events-none"
        style={{ left: `${sliderVal}%` }}
      >
        {/* Glow effect on the line */}
        <div className="absolute inset-y-0 -left-[1px] w-[3px] bg-yellow-400/30 blur-[2px]" />
        
        {/* Central sliding badge */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-zinc-950 border border-yellow-400/40 flex items-center justify-center shadow-2xl">
          <span className="text-yellow-400 text-[8px] font-bold">↔</span>
        </div>
      </div>

      {/* Aspect Label */}
      <span className="absolute bottom-4 left-4 text-[9px] font-mono tracking-widest text-yellow-400 bg-black/85 px-3 py-1 border border-yellow-400/20 rounded-sm font-semibold pointer-events-none">
        {aspect}
      </span>
    </div>
  );
}

export default function FluidMediaField({ onSelectProject }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const projects = [
    {
      id: 1,
      num: "01",
      title: "Cogen Energy Complex",
      tag: "Project 01 / Heavy Build",
      beforeImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80",
      afterImage: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/aa5ed4de-1a7e-4bb7-b0ea-1a4c511663df_1600w.webp",
      desc: "Isolated structural foundation matrices for thermodynamic piping loops and massive civil concrete grids.",
      aspect: "[ COGEN CORES ]",
      location: "Whitefield, IN",
      coords: "13.0640° N, 80.2460° E"
    },
    {
      id: 2,
      num: "02",
      title: "Solitaire Valleys",
      tag: "Project 02 / Real Estate",
      beforeImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
      afterImage: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/952269bf-60f5-48dc-afce-13953bead1eb_1600w.webp",
      desc: "Strategic land acquisition and premium residential valley plot mappings overlooking municipal green zones.",
      aspect: "[ RIDGE ESTATES ]",
      location: "Nandi Foothills, IN",
      coords: "13.0980° N, 80.2920° E"
    },
    {
      id: 3,
      num: "03",
      title: "Orion Glass Villa",
      tag: "Project 03 / Engineering",
      beforeImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=80",
      afterImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      desc: "Suspended steel-lattice core configured via genetic structural shear mapping and glass architectural extensions.",
      aspect: "[ STRUCTURAL ARCS ]",
      location: "Beverly Hills, CA",
      coords: "34.0736° N, 118.4004° W"
    },
    {
      id: 4,
      num: "04",
      title: "Calacatta Penthouse",
      tag: "Project 04 / Curation",
      beforeImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=1600&q=80",
      afterImage: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1600&q=80",
      desc: "Bespoke Italian stone surfaces and smoked wood carpentries tailored for ultra-high-net-worth turnkey estates.",
      aspect: "[ TURNKEY INTERIOR ]",
      location: "Aspen Heights, CO",
      coords: "39.1911° N, 106.8175° W"
    }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current;
    
    // Stacking animation logic
    cards.forEach((card, i) => {
      const nextCard = cards[i + 1];
      if (nextCard && card) {
        gsap.to(card.querySelector('.card-inner'), {
          scale: 0.94,
          opacity: 0.45, 
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom", 
            end: "top 10vh",    
            scrub: true
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto px-4 overflow-visible flex flex-col py-12"
    >
      <div className="flex flex-col gap-24 w-full relative overflow-visible">
        {projects.map((p, idx) => (
          <div 
            key={p.id}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="card-item sticky top-[10vh] h-[80vh] w-full flex items-center justify-center mb-16 overflow-visible"
          >
            <div 
              className="card-inner w-full h-full bg-zinc-950 border border-yellow-400/15 rounded-sm shadow-2xl shadow-black/95 overflow-hidden flex flex-col relative"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Top - Image Before/After Slider */}
              <div className="relative w-full h-[52%] md:h-[55%] overflow-hidden border-b border-yellow-400/10">
                <BeforeAfterSlider 
                  beforeImage={p.beforeImage} 
                  afterImage={p.afterImage} 
                  title={p.title} 
                  aspect={p.aspect} 
                />
              </div>

              {/* Bottom - Metadata & Wording (with plenty of breathing room) */}
              <div className="w-full h-[48%] md:h-[45%] flex flex-col justify-between p-6 md:p-8 lg:p-10 text-left bg-zinc-950">
                <div>
                  <div className="flex justify-between items-center w-full mb-3 md:mb-4">
                    <span className="text-yellow-400/35 font-mono text-[9px] uppercase tracking-widest block">
                      // SYSTEM_INDEX: {p.num}
                    </span>
                    <span className="text-yellow-400/20 font-mono text-[7px]">
                      GPS: {p.coords}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                    <h3 className="text-white font-extrabold text-xl md:text-2xl lg:text-3xl uppercase leading-none font-sans tracking-wide">
                      <span className="text-yellow-400 tracking-[0.05em] mr-2">{p.title.split(' ')[0]} /</span>
                      <span className="font-serif-luxury italic text-white lowercase first-letter:uppercase tracking-[0.05em] font-normal">
                        {p.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h3>
                    <span className="text-yellow-400 font-mono text-[9px] uppercase tracking-widest block font-medium">
                      {p.tag}
                    </span>
                  </div>

                  <div className="h-px bg-yellow-400/10 w-full mb-4" />

                  <p className="text-gray-400 font-sans font-light text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed max-w-3xl">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 flex flex-row items-center justify-between w-full border-t border-yellow-400/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-mono text-[7px] uppercase tracking-widest">Location</span>
                    <span className="text-gray-300 text-[11px] font-medium font-sans uppercase mt-1">{p.location}</span>
                  </div>
                  <button 
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-300 px-6 py-2 uppercase text-[9px] tracking-widest font-semibold rounded-sm"
                    data-interactive
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
