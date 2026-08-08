import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CraftParallaxBanner() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const sparrowRef = useRef(null);

  // 1:1 GSAP Parallax matching Ref/generated-page.html
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Parallax floating cybernetic sparrow
      if (sparrowRef.current) {
        gsap.to(sparrowRef.current, {
          yPercent: -30,
          xPercent: 15,
          rotation: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative overflow-hidden flex items-center shadow-inner"
      style={{ height: '70vh' }}
    >
      {/* Background Layer */}
      <div
        ref={bgRef}
        id="craftBg"
        className="absolute inset-[-15%] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/cf973fee-26dd-4029-b42e-26dfa75c7417_3840w.png')`,
          filter: 'brightness(0.7) saturate(0.9)',
        }}
      />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-tealbrand-950/90 via-tealbrand-900/80 to-emerald-950/90" />

      {/* Floating 3D Cybernetic Sparrow Artwork */}
      <div
        ref={sparrowRef}
        className="absolute right-12 md:right-32 top-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 pointer-events-none opacity-90 z-10 hidden sm:block"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/images/sparrow_cybernetic.png"
          alt="3D Cybernetic Sparrow"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(13,148,136,0.6)] animate-soft-float"
        />
      </div>

      <div className="mx-auto px-6 max-w-[77.5rem] relative z-20">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-md">
          <img src="/logo.png" alt="Πsparrow Mark" className="w-3.5 h-3.5 object-contain" />
          <span className="font-mono text-[10px] font-bold text-tealbrand-300 uppercase tracking-widest">
            BIO-MIMETIC PRECISION
          </span>
        </div>

        <div className="reveal-line overflow-hidden">
          <h2
            className="tracking-tight text-white font-medium max-w-2xl leading-[1.1]"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3.25rem)' }}
          >
            Every algorithm is optimized by hand, the moment it compiles.
          </h2>
        </div>

        <a
          href="#contact"
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium px-6 py-3 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-all backdrop-blur-md shadow-lg group"
          style={{ willChange: 'transform' }}
        >
          <span>Explore our architecture</span>
          <ArrowRight className="w-4 h-4 text-cyanbrand-300 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
