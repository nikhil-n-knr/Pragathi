import React, { useEffect, useRef, useState } from 'react';
import ParticleSwarm3D from './ParticleSwarm3D';

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const bouquetRef = useRef(null);
  const gradeWashRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const timeLabelRef = useRef(null);
  const dotRowRef = useRef(null);
  const beatElsRef = useRef([]);

  const DUR = 10.0;

  const beatsData = [
    {
      version: 'COMPLETE SOFTWARE & UI/UX',
      h1: 'Software & UI/UX,',
      h1Sub: 'Designed Naturally',
      p: 'We craft high-performance full-stack web applications, mobile platforms, and sleek UI/UX design systems.',
      s: 0.0,
      e: 0.18,
    },
    {
      version: 'AI AUTOMATION & AGENTIC AI',
      h1: 'Agentic AI Swarms,',
      h1Sub: 'Automated Execution',
      p: 'Engineering autonomous AI agents that handle complex multi-step workflows with mathematical precision.',
      s: 0.19,
      e: 0.38,
    },
    {
      version: 'MODEL TRAINING & FINE-TUNING',
      h1: 'Custom Model Training,',
      h1Sub: 'Domain Intelligence',
      p: 'Training and fine-tuning specialized AI models tailored specifically for enterprise domain modules.',
      s: 0.39,
      e: 0.58,
    },
    {
      version: 'READY SAAS PRODUCTS',
      h1: 'Turnkey Products,',
      h1Sub: 'Built For Industry',
      p: 'Ready-to-deploy platforms: HRMS, CRM, CMS, LMS, PlaySchool Safety, and Utility engines.',
      s: 0.59,
      e: 0.78,
    },
    {
      version: 'ΠSPARROW ECOSYSTEM',
      h1: 'ΠSPARROW PLATFORM',
      h1Sub: '',
      p: 'System active — explore our core software solutions and flagship products below.',
      s: 0.79,
      e: 1.0,
    },
  ];

  const calculateBeatOpacity = (p, s, e) => {
    const span = e - s;
    const fade = span * 0.3;
    if (p < s || p > e) return 0;
    if (p < s + fade) return (p - s) / fade;
    if (p > e - fade) return (e - p) / fade;
    return 1;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let autoP = 0;
    let isUserScrolling = false;
    let scrollIdleTimer = null;
    let animId;

    const dotRow = dotRowRef.current;
    const dotSpans = [];
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const totalDots = isMobile ? 20 : 30;

    if (dotRow) {
      dotRow.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const d = document.createElement('span');
        d.style.cssText =
          'width:0.4rem;height:0.4rem;border-radius:50%;background:rgba(13,148,136,0.25);transition:background .3s,transform .3s;cursor:pointer;display:inline-block;flex-shrink:0;';

        const beatIndex = Math.min(
          beatsData.length - 1,
          Math.floor((i / totalDots) * beatsData.length)
        );
        const targetBeat = beatsData[beatIndex];

        d.addEventListener('click', () => {
          const top =
            section.offsetTop +
            ((targetBeat.s + targetBeat.e) / 2) *
              (section.offsetHeight - window.innerHeight);
          window.scrollTo({ top, behavior: 'smooth' });
        });

        dotRow.appendChild(d);
        dotSpans.push(d);
      }
    }

    let lastTime = performance.now();

    const rafLoop = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const rect = section.getBoundingClientRect();
      const isAtTop = rect.top >= -50;

      if (isAtTop && !isUserScrolling) {
        autoP = (autoP + delta * 0.06) % 1.0;
        rawP = autoP;
      } else {
        autoP = rawP;
      }

      renderP += (rawP - renderP) * 0.08;
      const p = renderP;

      const scale = 1 + p * 0.45 - Math.max(0, p - 0.5) * 0.25;
      const roll = p * 3 - Math.max(0, p - 0.7) * 2;
      const fwd = p * -30;

      if (bouquetRef.current) {
        bouquetRef.current.style.transform = `scale(${scale.toFixed(4)}) rotate(${roll.toFixed(2)}deg) translateY(${fwd.toFixed(1)}px)`;
      }
      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `scale(${(1.1 + p * 0.15).toFixed(4)}) translateY(${(p * -40).toFixed(1)}px)`;
      }
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translateY(${(p * 20).toFixed(1)}px)`;
      }

      if (gradeWashRef.current) {
        gradeWashRef.current.style.opacity = (0.4 + Math.sin(p * Math.PI) * 0.5).toFixed(3);
      }

      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 5;
      else if (p > 0.92) lb = 5 * (1 - (p - 0.92) / 0.08);
      else lb = 5;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb.toFixed(2)}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb.toFixed(2)}vh`;

      if (tlFillRef.current) tlFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (timeLabelRef.current) timeLabelRef.current.textContent = `${(p * DUR).toFixed(2)}s`;

      beatsData.forEach((b, idx) => {
        const o = calculateBeatOpacity(p, b.s, b.e);
        const el = beatElsRef.current[idx];

        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${((1 - o) * 16).toFixed(1)}px)`;
          el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
        }
      });

      const activeDotIndex = Math.min(totalDots - 1, Math.floor(p * totalDots));
      dotSpans.forEach((dot, idx) => {
        const isActive = idx === activeDotIndex;
        dot.style.background = isActive ? '#0d9488' : 'rgba(13, 148, 136, 0.25)';
        dot.style.transform = isActive ? 'scale(1.5)' : 'scale(1)';
      });

      animId = requestAnimationFrame(rafLoop);
    };

    animId = requestAnimationFrame(rafLoop);

    const onScroll = () => {
      isUserScrolling = true;
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        isUserScrolling = false;
      }, 2500);

      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      if (scrolled > 0) {
        rawP = travel > 0 ? scrolled / travel : 0;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="cinematic" className="relative" style={{ height: '520vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50">
        <ParticleSwarm3D />

        <div id="visualWrap" className="absolute inset-0 z-1 pointer-events-none" style={{ willChange: 'transform' }}>
          <div
            ref={bgLayerRef}
            id="bgLayer"
            className="absolute -inset-[8%] bg-cover bg-center overflow-hidden isolation-isolate"
            style={{ willChange: 'transform' }}
          />
          <div
            ref={midLayerRef}
            id="midLayer"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ willChange: 'transform' }}
          >
            <div className="flex items-center justify-center w-full h-full px-4">
              <div className="animate-soft-float flex items-center justify-center">
                <div
                  ref={bouquetRef}
                  id="bouquet"
                  className="z-40 relative pointer-events-none"
                  style={{
                    width: 'min(84vw, 42rem)',
                    aspectRatio: '16 / 11',
                    backgroundImage: `url("https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d0f628cf-26bf-473d-81b9-50e422c51521_3840w.png")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={gradeWashRef}
          id="gradeWash"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(204, 251, 241, 0.4), rgba(248, 250, 252, 0.82) 70%)',
            mixBlendMode: 'screen',
          }}
        />

        <div
          ref={lbTopRef}
          id="lbTop"
          className="absolute top-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none"
          style={{ height: '0vh', willChange: 'height' }}
        />
        <div
          ref={lbBotRef}
          id="lbBot"
          className="absolute bottom-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none"
          style={{ height: '0vh', willChange: 'height' }}
        />

        <div className="absolute inset-4 md:inset-10 z-30 pointer-events-none">
          <span className="absolute top-0 left-0 w-4 h-4 md:w-5.5 md:h-5.5 border-t border-l border-tealbrand-600/50"></span>
          <span className="absolute top-0 right-0 w-4 h-4 md:w-5.5 md:h-5.5 border-t border-r border-tealbrand-600/50"></span>
          <span className="absolute bottom-0 left-0 w-4 h-4 md:w-5.5 md:h-5.5 border-b border-l border-tealbrand-600/50"></span>
          <span className="absolute bottom-0 right-0 w-4 h-4 md:w-5.5 md:h-5.5 border-b border-r border-tealbrand-600/50"></span>
        </div>

        {/* 5 Copy Beats */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-4 sm:px-6">
          {beatsData.map((beat, idx) => (
            <div
              key={idx}
              ref={(el) => (beatElsRef.current[idx] = el)}
              className="beat flex flex-col items-center absolute text-center px-4 sm:px-6 max-w-4xl"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25rem] sm:tracking-[0.35rem] text-tealbrand-700 font-bold mb-3 font-mono">
                {beat.version}
              </p>

              <h1 className="tracking-tight text-slate-900 font-medium leading-[0.95]" style={{ fontSize: 'clamp(1.85rem, 6.8vw, 5.8rem)' }}>
                {beat.h1}{' '}
                {beat.h1Sub && (
                  <>
                    <br />
                    <span className="text-tealbrand-600 font-light">{beat.h1Sub}</span>
                  </>
                )}
              </h1>

              {beat.p && (
                <p className="text-xs sm:text-sm md:text-base mt-3 sm:mt-4 text-slate-600 font-mono tracking-wider uppercase max-w-lg leading-relaxed">
                  {beat.p}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Timeline HUD (Bottom Left) */}
        <div className="absolute left-4 sm:left-8 bottom-6 sm:bottom-12 z-45 flex items-center gap-2.5 sm:gap-4 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-tealbrand-500/20 shadow-md">
          <div className="flex items-center space-x-1 sm:space-x-1.5 mr-0.5">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
            <span className="font-mono text-[8px] sm:text-[9px] font-bold text-tealbrand-700 uppercase tracking-widest">
              LIVE
            </span>
          </div>
          <div id="timelineTrack" className="w-24 sm:w-36 h-1 rounded-full bg-slate-200 overflow-hidden">
            <div
              ref={tlFillRef}
              id="timelineFill"
              className="h-full bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500"
              style={{ width: '0%', willChange: 'width' }}
            />
          </div>
          <span
            ref={timeLabelRef}
            id="timeLabel"
            className="text-[10px] sm:text-xs font-mono font-bold tabular-nums text-slate-700"
          >
            0.00s
          </span>
        </div>

        {/* Timeline Dots (Bottom Right) */}
        <div
          ref={dotRowRef}
          id="dotRow"
          className="absolute right-4 sm:right-8 bottom-6 sm:bottom-12 z-45 flex gap-1 sm:gap-1.5 items-center max-w-[45vw] overflow-x-auto py-1 hidden sm:flex"
        />
      </div>
    </section>
  );
}
