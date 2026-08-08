import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CraftParallaxBanner() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // 1:1 GSAP background scroll parallax matching Ref/generated-page.html line 698
  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
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
      {/* Background Parallax Image Layer matching Ref/generated-page.html line 267 */}
      <div
        ref={bgRef}
        id="craftBg"
        className="absolute inset-[-15%] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/cf973fee-26dd-4029-b42e-26dfa75c7417_3840w.png')`,
          filter: 'brightness(0.7) saturate(0.9)',
        }}
      />

      {/* Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-tealbrand-950/85 via-tealbrand-900/75 to-emerald-950/85" />

      <div className="mx-auto px-6 max-w-[77.5rem] relative z-10">
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
