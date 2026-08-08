import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
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
      version: 'VERSION NO. 07 // BIO-MIMETIC PLATFORM',
      h1: 'Quiet Nodes,',
      h1Sub: 'Waiting Data',
      p: 'Algorithms unfold as raw data moves through the neural bio-circuit network.',
      s: 0.0,
      e: 0.1,
    },
    {
      version: 'THE INITIALIZATION',
      h1: 'The First Boot',
      h1Sub: '',
      p: 'Co-designing physical circuit architectures with self-balancing software swarms.',
      s: 0.11,
      e: 0.22,
    },
    {
      version: 'HARDWARE & EDGE SWARMS',
      h1: 'Connected Swarms',
      h1Sub: '',
      p: 'Fifty-four autonomous nodes, architected to scale from every angle.',
      s: 0.23,
      e: 0.33,
    },
    {
      version: 'HARDWARE COMPILER',
      h1: 'A Full Cluster',
      h1Sub: '',
      p: 'Industrial PCB microservices integrated into zero-latency edge layers.',
      s: 0.34,
      e: 0.47,
    },
    {
      version: 'TELEMETRY STREAM',
      h1: 'Data Lift',
      h1Sub: 'Carried by Cloud',
      p: 'High-frequency telemetry carried naturally through light-speed streams.',
      s: 0.48,
      e: 0.64,
    },
    {
      version: 'DEPLOYMENT PIPELINE',
      h1: 'Into the Stream',
      h1Sub: '',
      p: 'Turnkey hardware and software execution built for modern industry.',
      s: 0.65,
      e: 0.81,
    },
    {
      version: 'DEPLOYED LIVE',
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

  // 1. WebGL / Canvas Petal Field matching Ref/generated-page.html lines 516-563
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let H = (canvas.height = window.innerHeight * window.devicePixelRatio);

    const onResize = () => {
      W = canvas.width = window.innerWidth * window.devicePixelRatio;
      H = canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', onResize);

    const petals = [];
    for (let i = 0; i < 70; i++) {
      petals.push({
        x: Math.random(),
        y: Math.random(),
        r: 6 + Math.random() * 14,
        sp: 0.2 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2,
        a: 0.3 + Math.random() * 0.5,
      });
    }

    let t = 0;
    const draw = () => {
      t += 16;
      ctx.clearRect(0, 0, W, H);

      petals.forEach((p) => {
        const px = (p.x + Math.sin(t * 0.0003 * p.sp + p.drift) * 0.04) * W;
        const py = (((p.y + t * 0.00004 * p.sp) % 1 + 1) % 1) * H;
        const size = p.r * window.devicePixelRatio;

        ctx.globalAlpha = p.a * 0.75;
        const g = ctx.createRadialGradient(px, py, 0, px, py, size);
        g.addColorStop(0, 'rgba(13, 148, 136, 0.85)'); // Teal
        g.addColorStop(1, 'rgba(16, 185, 129, 0)');    // Emerald fade

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(px, py, size, size * 0.6, p.drift + t * 0.0002, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Velocity-Aware 1:1 RAF Loop matching Ref/generated-page.html lines 613-664
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let animId;

    // Build timeline dots dynamically
    const dotRow = dotRowRef.current;
    const dotSpans = [];
    if (dotRow) {
      dotRow.innerHTML = '';
      beatsData.forEach((b, i) => {
        const d = document.createElement('span');
        d.style.cssText =
          'width:0.5rem;height:0.5rem;border-radius:50%;background:#cbd5e1;transition:background .3s,transform .3s;cursor:pointer;display:inline-block;';

        d.addEventListener('mouseenter', () => {
          if (window.gsap) gsap.to(d, { scale: 1.8, duration: 0.3, ease: 'back.out(2)' });
        });
        d.addEventListener('mouseleave', () => {
          if (window.gsap) gsap.to(d, { scale: 1, duration: 0.3 });
        });

        d.addEventListener('click', () => {
          const top = section.offsetTop + ((b.s + b.e) / 2) * (section.offsetHeight - window.innerHeight);
          window.scrollTo({ top, behavior: 'smooth' });
        });

        dotRow.appendChild(d);
        dotSpans.push(d);
      });
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

      // 1:1 Grade wash opacity
      if (gradeWashRef.current) {
        gradeWashRef.current.style.opacity = (0.4 + Math.sin(p * Math.PI) * 0.5).toFixed(3);
      }

      // 1:1 Letterbox height math (0 to 7vh)
      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 7;
      else if (p > 0.92) lb = 7 * (1 - (p - 0.92) / 0.08);
      else lb = 7;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb.toFixed(2)}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb.toFixed(2)}vh`;

      // 1:1 Timeline fill & label
      if (tlFillRef.current) tlFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (timeLabelRef.current) timeLabelRef.current.textContent = `${(p * DUR).toFixed(2)}s`;

      // 1:1 Beat opacity & dot status
      beatsData.forEach((b, idx) => {
        const o = calculateBeatOpacity(p, b.s, b.e);
        const el = beatElsRef.current[idx];
        const dot = dotSpans[idx];

        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`;
          el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
        }

        if (dot) {
          const active = p >= b.s && p <= b.e;
          dot.style.background = active ? '#0d9488' : '#cbd5e1';
          dot.style.transform = active ? 'scale(1.4)' : 'scale(1)';
        }
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
        {/* WebGL / Canvas Petal Layer */}
        <canvas
          ref={canvasRef}
          id="petalCanvas"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-85"
        />

        {/* Parallax Visual Layers matching Ref/generated-page.html lines 54-84 */}
        <div id="visualWrap" className="absolute inset-0 z-1 pointer-events-none" style={{ willChange: 'transform' }}>
          <div
            ref={bgLayerRef}
            id="bgLayer"
            className="absolute -inset-[8%] bg-cover bg-center overflow-hidden isolation-isolate"
            style={{
              filter: 'saturate(0.8) brightness(0.95)',
              willChange: 'transform',
            }}
          />
          <div
            ref={midLayerRef}
            id="midLayer"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ willChange: 'transform' }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-soft-float flex items-center justify-center">
                <div
                  ref={bouquetRef}
                  id="bouquet"
                  className="z-40 relative shadow-2xl rounded-3xl overflow-hidden border border-tealbrand-500/20 bg-white/40 backdrop-blur-md"
                  style={{
                    width: 'min(56vw, 40rem)',
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

        {/* Color Grade Wash matching Ref/generated-page.html line 87 */}
        <div
          ref={gradeWashRef}
          id="gradeWash"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(204, 251, 241, 0.45), rgba(248, 250, 252, 0.85) 70%)',
            mixBlendMode: 'multiply',
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
                    <span className="text-tealbrand-600">{beat.h1Sub}</span>
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

        {/* Timeline HUD matching Ref/generated-page.html lines 165-170 */}
        <div className="absolute left-8 bottom-14 z-45 flex items-center gap-4 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
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

        {/* Timeline Dots matching Ref/generated-page.html lines 173-195 */}
        <div
          ref={dotRowRef}
          id="dotRow"
          className="absolute right-8 bottom-14 z-45 flex gap-2.5 items-center bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md"
        />
      </div>
    </section>
  );
}
