import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Compass, Sparkles } from 'lucide-react';

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);

  const DUR = 12.75;

  const beats = [
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

  // Helper for smooth beat opacity calculation
  const calculateBeatOpacity = (p, s, e) => {
    const span = e - s;
    const fade = span * 0.3;
    if (p < s || p > e) return 0;
    if (p < s + fade) return (p - s) / fade;
    if (p > e - fade) return (e - p) / fade;
    return 1;
  };

  // 1. Canvas Petal Field (Biomorphic Floating Spores)
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
    for (let i = 0; i < 75; i++) {
      petals.push({
        x: Math.random(),
        y: Math.random(),
        r: (5 + Math.random() * 12) * window.devicePixelRatio,
        sp: 0.2 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2,
        a: 0.3 + Math.random() * 0.5,
        type: i % 3,
      });
    }

    let t = 0;
    const draw = () => {
      t += 16;
      ctx.clearRect(0, 0, W, H);

      petals.forEach((p) => {
        const px = (p.x + Math.sin(t * 0.0003 * p.sp + p.drift) * 0.04) * W;
        const py = (((p.y - t * 0.00005 * p.sp) % 1) + 1) % 1 * H;
        const size = p.r;

        ctx.globalAlpha = p.a * 0.75;
        const g = ctx.createRadialGradient(px, py, 0, px, py, size);

        if (p.type === 0) {
          g.addColorStop(0, 'rgba(13, 148, 136, 0.85)'); // Teal
          g.addColorStop(1, 'rgba(13, 148, 136, 0)');
        } else if (p.type === 1) {
          g.addColorStop(0, 'rgba(16, 185, 129, 0.85)'); // Emerald
          g.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else {
          g.addColorStop(0, 'rgba(6, 182, 212, 0.85)'); // Cyan
          g.addColorStop(1, 'rgba(6, 182, 212, 0)');
        }

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

  // 2. Smooth RAF Interpolation for 60FPS Scroll Animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let animReq;

    const loop = () => {
      renderP += (rawP - renderP) * 0.1;
      setProgress(renderP);

      // Find active beat
      const currentBeatIdx = beats.findIndex((b) => renderP >= b.s && renderP <= b.e);
      if (currentBeatIdx !== -1) {
        setActiveBeatIndex(currentBeatIdx);
      }

      animReq = requestAnimationFrame(loop);
    };

    animReq = requestAnimationFrame(loop);

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
      cancelAnimationFrame(animReq);
    };
  }, []);

  const jumpToBeat = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const b = beats[index];
    const mid = (b.s + b.e) / 2;
    const travel = section.offsetHeight - window.innerHeight;
    const targetScroll = section.offsetTop + mid * travel;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Compute cinematic transforms based on render progress
  const bouquetScale = 1 + progress * 0.55 - Math.max(0, progress - 0.48) * 0.35;
  const bouquetRoll = progress * 4 - Math.max(0, progress - 0.65) * 3;
  const bouquetFwd = progress * -40;

  // Letterbox height calculation (0 to 7vh)
  let lbHeight = 0;
  if (progress < 0.06) lbHeight = (progress / 0.06) * 6;
  else if (progress > 0.92) lbHeight = 6 * (1 - (progress - 0.92) / 0.08);
  else lbHeight = 6;

  return (
    <section ref={sectionRef} id="cinematic" className="relative" style={{ height: '820vh' }}>
      {/* Sticky Stage Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50">
        {/* Canvas Petal Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-80"
        />

        {/* Dynamic Letterbox Bars (Top & Bottom) */}
        <div
          className="absolute top-0 left-0 right-0 bg-slate-950 z-30 transition-all duration-75"
          style={{ height: `${lbHeight}vh` }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-slate-950 z-30 transition-all duration-75"
          style={{ height: `${lbHeight}vh` }}
        />

        {/* Ambient Radial Color Wash */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(204, 251, 241, 0.45), rgba(248, 250, 252, 0.85) 75%)',
            opacity: 0.6 + Math.sin(progress * Math.PI) * 0.4,
          }}
        />

        {/* Corner Brackets Framing */}
        <div className="absolute inset-8 md:inset-12 z-30 pointer-events-none">
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-tealbrand-600/50 rounded-tl-sm"></span>
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-tealbrand-600/50 rounded-tr-sm"></span>
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-tealbrand-600/50 rounded-bl-sm"></span>
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-tealbrand-600/50 rounded-br-sm"></span>
        </div>

        {/* Central Floating Visual Card & Floating 3D Girl / Asset */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div
            className="relative flex items-center justify-center transition-transform duration-100 ease-linear"
            style={{
              transform: `scale(${bouquetScale}) rotate(${bouquetRoll}deg) translateY(${bouquetFwd}px)`,
            }}
          >
            {/* Soft Ambient Aura behind floating asset */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-tealbrand-400/20 blur-3xl animate-pulse-slow pointer-events-none" />

            {/* 3D Floating Hero Image Asset (The Floating Visual from Reference) */}
            <div
              className="z-40 relative shadow-2xl rounded-3xl overflow-hidden border border-tealbrand-500/20 bg-white/40 backdrop-blur-md"
              style={{
                width: 'min(58vw, 42rem)',
                aspectRatio: '16 / 11',
                backgroundImage: `url("https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d0f628cf-26bf-473d-81b9-50e422c51521_3840w.png")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
              }}
            />
          </div>
        </div>

        {/* Multi-Beat Copy Beat Layer */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
          {beats.map((beat, idx) => {
            const op = calculateBeatOpacity(progress, beat.s, beat.e);
            return (
              <div
                key={idx}
                className="absolute flex flex-col items-center text-center max-w-3xl px-4 transition-all duration-300"
                style={{
                  opacity: op.toFixed(3),
                  transform: `translateY(${(1 - op) * 24}px)`,
                  pointerEvents: op > 0.5 ? 'auto' : 'none',
                }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-tealbrand-700 font-bold mb-3">
                  {beat.version}
                </p>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
                  {beat.h1}{' '}
                  {beat.h1Sub && (
                    <span className="block text-tealbrand-600 font-light">{beat.h1Sub}</span>
                  )}
                </h1>

                {beat.p && (
                  <p className="text-sm md:text-base font-mono text-slate-600 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
                    {beat.p}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline HUD Track (Bottom-Left) */}
        <div className="absolute left-6 md:left-12 bottom-8 z-40 flex items-center space-x-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
          <div className="w-32 md:w-44 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500 transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-800 tabular-nums">
            {(progress * DUR).toFixed(2)}s
          </span>
        </div>

        {/* Interactive Beat Dots (Bottom-Right) */}
        <div className="absolute right-6 md:right-12 bottom-8 z-40 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
          {beats.map((b, idx) => {
            const isActive = progress >= b.s && progress <= b.e;
            return (
              <button
                key={idx}
                onClick={() => jumpToBeat(idx)}
                title={`Jump to Beat ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-tealbrand-600 scale-150 ring-2 ring-tealbrand-500/40'
                    : 'bg-slate-300 hover:bg-tealbrand-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
