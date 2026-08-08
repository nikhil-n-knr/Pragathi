import React, { useEffect, useRef } from 'react';
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

  const DUR = 12.75;

  const beatsData = [
    {
      version: 'ENGINEERING PLATFORMS // V2.0',
      h1: 'Quiet Nodes,',
      h1Sub: 'Waiting Data',
      p: 'Algorithms unfold as raw data moves through the neural bio-circuit network.',
      s: 0.0,
      e: 0.1,
    },
    {
      version: 'THE DESIGN PHILOSOPHY',
      h1: 'The First Boot',
      h1Sub: '',
      p: 'Combining mathematical precision with agility, diligence, and system integrity.',
      s: 0.11,
      e: 0.22,
    },
    {
      version: 'SYSTEM REGISTRY',
      h1: 'Connected Swarms',
      h1Sub: '',
      p: 'Ready-to-deploy, high-contrast visual architectures tailored for modern enterprise.',
      s: 0.23,
      e: 0.33,
    },
    {
      version: 'PRECISION COMPUTING',
      h1: 'A Full Cluster',
      h1Sub: '',
      p: 'Fifty-four autonomous nodes, architected to scale from every angle.',
      s: 0.34,
      e: 0.47,
    },
    {
      version: 'SERVICE DIRECTORY',
      h1: 'Data Lift',
      h1Sub: 'Carried by Cloud',
      p: 'High-frequency telemetry carried naturally through light-speed streams.',
      s: 0.48,
      e: 0.64,
    },
    {
      version: 'COMMUNICATION CANAL',
      h1: 'Into the Stream',
      h1Sub: '',
      p: 'Turnkey hardware and software execution built for modern industry.',
      s: 0.65,
      e: 0.81,
    },
    {
      version: 'ΠSPARROW LIVE',
      h1: 'ΠSPARROW PLATFORM',
      h1Sub: '',
      p: 'System active — explore the products and capabilities below.',
      s: 0.82,
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

  // 1:1 Velocity-Aware RAF Loop matching Ref/generated-page.html lines 613-664
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let animId;

    // Build continuous timeline dot row matching Image 2 1:1 (~35 dots across bottom right)
    const dotRow = dotRowRef.current;
    const dotSpans = [];
    const totalDots = 35;
    if (dotRow) {
      dotRow.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const d = document.createElement('span');
        d.style.cssText =
          'width:0.45rem;height:0.45rem;border-radius:50%;background:rgba(13,148,136,0.25);transition:background .3s,transform .3s;cursor:pointer;display:inline-block;flex-shrink:0;';

        const beatIndex = Math.min(
          beatsData.length - 1,
          Math.floor((i / totalDots) * beatsData.length)
        );
        const targetBeat = beatsData[beatIndex];

        d.addEventListener('mouseenter', () => {
          d.style.transform = 'scale(1.8)';
        });
        d.addEventListener('mouseleave', () => {
          d.style.transform = 'scale(1)';
        });

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

    const rafLoop = () => {
      renderP += (rawP - renderP) * 0.1;
      const p = renderP;

      // 1:1 Scale, Roll, Translation math from Ref/generated-page.html lines 617-623
      const scale = 1 + p * 0.55 - Math.max(0, p - 0.48) * 0.35;
      const roll = p * 4 - Math.max(0, p - 0.65) * 3;
      const fwd = p * -40;

      if (bouquetRef.current) {
        bouquetRef.current.style.transform = `scale(${scale.toFixed(4)}) rotate(${roll.toFixed(2)}deg) translateY(${fwd.toFixed(1)}px)`;
      }
      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `scale(${(1.1 + p * 0.15).toFixed(4)}) translateY(${(p * -60).toFixed(1)}px)`;
      }
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translateY(${(p * 30).toFixed(1)}px)`;
      }

      // Grade wash opacity matching Ref/generated-page.html line 628
      if (gradeWashRef.current) {
        gradeWashRef.current.style.opacity = (0.4 + Math.sin(p * Math.PI) * 0.5).toFixed(3);
      }

      // Letterbox height math (0 to 7vh) matching Ref/generated-page.html lines 630-636
      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 7;
      else if (p > 0.92) lb = 7 * (1 - (p - 0.92) / 0.08);
      else lb = 7;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb.toFixed(2)}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb.toFixed(2)}vh`;

      // Timeline fill & label matching Ref/generated-page.html lines 638-639
      if (tlFillRef.current) tlFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (timeLabelRef.current) timeLabelRef.current.textContent = `${(p * DUR).toFixed(2)}s`;

      // Update beats text opacity & dot highlight row matching Ref/generated-page.html lines 641-648
      beatsData.forEach((b, idx) => {
        const o = calculateBeatOpacity(p, b.s, b.e);
        const el = beatElsRef.current[idx];

        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`;
          el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
        }
      });

      const activeDotIndex = Math.min(totalDots - 1, Math.floor(p * totalDots));
      dotSpans.forEach((dot, idx) => {
        const isActive = idx === activeDotIndex;
        dot.style.background = isActive ? '#0d9488' : 'rgba(13, 148, 136, 0.25)';
        dot.style.transform = isActive ? 'scale(1.6)' : 'scale(1)';
      });

      animId = requestAnimationFrame(rafLoop);
    };

    animId = requestAnimationFrame(rafLoop);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      rawP = travel > 0 ? scrolled / travel : 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="cinematic" className="relative" style={{ height: '820vh' }}>
      {/* Pinned Stage Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50">
        {/* 3D WebGL Swarming Particle Atmosphere (Swirling 3D Orbital Rings) */}
        <ParticleSwarm3D />

        {/* Parallax Visual Layers matching Ref/generated-page.html lines 54-84 */}
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
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-soft-float flex items-center justify-center">
                {/* 1:1 Transparent Floating Figure (NO white card wrapper!) matching Ref/generated-page.html line 80 */}
                <div
                  ref={bouquetRef}
                  id="bouquet"
                  className="z-40 relative pointer-events-none"
                  style={{
                    width: 'min(58vw, 42rem)',
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

        {/* Radial Color Grade Wash matching Ref/generated-page.html line 87 */}
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

        {/* Dynamic Letterbox Bars matching Ref/generated-page.html lines 90-91 */}
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

        {/* Corner Brackets Frame matching Ref/generated-page.html lines 93-99 */}
        <div className="absolute inset-6 md:inset-10 z-30 pointer-events-none">
          <span className="absolute top-0 left-0 w-5.5 h-5.5 border-t border-l border-tealbrand-600/50"></span>
          <span className="absolute top-0 right-0 w-5.5 h-5.5 border-t border-r border-tealbrand-600/50"></span>
          <span className="absolute bottom-0 left-0 w-5.5 h-5.5 border-b border-l border-tealbrand-600/50"></span>
          <span className="absolute bottom-0 right-0 w-5.5 h-5.5 border-b border-r border-tealbrand-600/50"></span>
        </div>

        {/* Copy Beats Layer matching Ref/generated-page.html lines 102-162 */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
          {beatsData.map((beat, idx) => (
            <div
              key={idx}
              ref={(el) => (beatElsRef.current[idx] = el)}
              className="beat flex flex-col items-center absolute text-center px-6"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <p className="text-xs uppercase tracking-[0.35rem] text-tealbrand-700 font-bold mb-4 font-mono">
                {beat.version}
              </p>

              <h1 className="tracking-tight text-slate-900 font-medium leading-[0.95]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                {beat.h1}{' '}
                {beat.h1Sub && (
                  <>
                    <br />
                    <span className="text-tealbrand-600 font-light">{beat.h1Sub}</span>
                  </>
                )}
              </h1>

              {beat.p && (
                <p className="text-sm md:text-base mt-4 text-slate-600 font-mono tracking-wider uppercase max-w-md">
                  {beat.p}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Timeline HUD Track matching Ref/generated-page.html lines 165-170 (Bottom Left) */}
        <div className="absolute left-8 bottom-12 z-45 flex items-center gap-4 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
          <div id="timelineTrack" className="w-44 h-1 rounded-full bg-slate-200 overflow-hidden">
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
            className="text-xs font-mono font-bold tabular-nums text-slate-700"
          >
            0.00s
          </span>
        </div>

        {/* Continuous Dot Row matching Ref/generated-page.html lines 173-195 (Bottom Right, Image 2 1:1) */}
        <div
          ref={dotRowRef}
          id="dotRow"
          className="absolute right-8 bottom-12 z-45 flex gap-1.5 items-center max-w-[50vw] overflow-x-auto py-1"
        />
      </div>
    </section>
  );
}
