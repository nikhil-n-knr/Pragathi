import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bouquetRef = useRef(null);
  const gradeWashRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const timeLabelRef = useRef(null);
  const beatElsRef = useRef([]);
  const dotElsRef = useRef([]);

  const DUR = 12.75;

  const beatsData = [
    {
      version: 'ENGINEERING PLATFORMS // V2.0',
      title: 'Innovative Software,',
      subtitle: 'Naturally.',
      description: 'We engineer secure, boxy, high-contrast digital architectures designed for infinite growth.',
      s: 0.0,
      e: 0.1,
    },
    {
      version: 'THE DESIGN PHILOSOPHY',
      title: 'Pi (Π) & Sparrow',
      subtitle: '',
      description: 'Combining mathematical precision with agility, diligence, and system integrity.',
      s: 0.11,
      e: 0.22,
    },
    {
      version: 'SYSTEM REGISTRY',
      title: 'Flagship Platforms',
      subtitle: 'HRMS, CRM, CMS, LMS, Safety & Utilities',
      description: 'Ready-to-deploy, high-contrast visual architectures tailored for modern enterprise.',
      s: 0.23,
      e: 0.33,
    },
    {
      version: 'PRECISION COMPUTING',
      title: 'Built Twig By Twig',
      subtitle: '',
      description: 'Structured software built with meticulous care and mathematical exactness.',
      s: 0.34,
      e: 0.47,
    },
    {
      version: 'SERVICE DIRECTORY',
      title: 'Core Competencies',
      subtitle: 'Web Apps, Custom Architectures & Auditing Tools',
      description: 'Diligence and technical perfection in every line of code.',
      s: 0.48,
      e: 0.64,
    },
    {
      version: 'COMMUNICATION CANAL',
      title: 'Initialize A Project',
      subtitle: '',
      description: 'Let us construct your structured platform solution.',
      s: 0.65,
      e: 0.81,
    },
    {
      version: 'ΠSPARROW LIVE',
      title: 'ΠSPARROW PLATFORM',
      subtitle: '',
      description: 'System active — explore our flagship platforms and competencies below.',
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

  // 1. Canvas Nature Particles (WebGL / 2D Petals)
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
          g.addColorStop(0, 'rgba(13, 148, 136, 0.85)');
          g.addColorStop(1, 'rgba(13, 148, 136, 0)');
        } else if (p.type === 1) {
          g.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
          g.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else {
          g.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
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

  // 2. Direct DOM RAF Loop for Silky 60/120 FPS Performance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let animId;

    const rafLoop = () => {
      renderP += (rawP - renderP) * 0.08;
      const p = renderP;

      // 1. Bouquet Visual Transform
      if (bouquetRef.current) {
        const scale = 1 + p * 0.55 - Math.max(0, p - 0.48) * 0.35;
        const roll = p * 4 - Math.max(0, p - 0.65) * 3;
        const fwd = p * -40;
        bouquetRef.current.style.transform = `scale(${scale.toFixed(4)}) rotate(${roll.toFixed(2)}deg) translateY(${fwd.toFixed(1)}px)`;
      }

      // 2. Ambient Grade Wash Opacity
      if (gradeWashRef.current) {
        const op = 0.5 + Math.sin(p * Math.PI) * 0.4;
        gradeWashRef.current.style.opacity = op.toFixed(3);
      }

      // 3. Letterbox Bars Height
      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 6;
      else if (p > 0.92) lb = 6 * (1 - (p - 0.92) / 0.08);
      else lb = 6;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb.toFixed(2)}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb.toFixed(2)}vh`;

      // 4. Timeline Progress & Label
      if (tlFillRef.current) tlFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      if (timeLabelRef.current) timeLabelRef.current.textContent = `${(p * DUR).toFixed(2)}s`;

      // 5. Beats Copy Opacity & Translates
      beatsData.forEach((b, idx) => {
        const o = calculateBeatOpacity(p, b.s, b.e);
        const el = beatElsRef.current[idx];
        const dot = dotElsRef.current[idx];

        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${((1 - o) * 20).toFixed(1)}px)`;
          el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
        }

        if (dot) {
          const isActive = p >= b.s && p <= b.e;
          dot.style.backgroundColor = isActive ? '#0d9488' : '#cbd5e1';
          dot.style.transform = isActive ? 'scale(1.4)' : 'scale(1)';
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

  const jumpToBeat = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const b = beatsData[index];
    const mid = (b.s + b.e) / 2;
    const travel = section.offsetHeight - window.innerHeight;
    const targetScroll = section.offsetTop + mid * travel;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="cinematic" className="relative" style={{ height: '820vh' }}>
      {/* Sticky Pinned Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50">
        {/* Canvas Particle Field */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-80"
        />

        {/* Dynamic Letterbox Bars */}
        <div
          ref={lbTopRef}
          className="absolute top-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none"
          style={{ height: '0vh', willChange: 'height' }}
        />
        <div
          ref={lbBotRef}
          className="absolute bottom-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none"
          style={{ height: '0vh', willChange: 'height' }}
        />

        {/* Ambient Color Wash */}
        <div
          ref={gradeWashRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(204, 251, 241, 0.45), rgba(248, 250, 252, 0.85) 75%)',
            willChange: 'opacity',
          }}
        />

        {/* Precision Corner Brackets */}
        <div className="absolute inset-8 md:inset-12 z-30 pointer-events-none">
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-tealbrand-600/50 rounded-tl-sm"></span>
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-tealbrand-600/50 rounded-tr-sm"></span>
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-tealbrand-600/50 rounded-bl-sm"></span>
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-tealbrand-600/50 rounded-br-sm"></span>
        </div>

        {/* Central 3D Floating Visual Card */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div
            ref={bouquetRef}
            className="z-40 relative shadow-2xl rounded-3xl overflow-hidden border border-tealbrand-500/20 bg-white/40 backdrop-blur-md"
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

        {/* Copy Beats Layer */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
          {beatsData.map((beat, idx) => (
            <div
              key={idx}
              ref={(el) => (beatElsRef.current[idx] = el)}
              className="absolute flex flex-col items-center text-center max-w-3xl px-4"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-tealbrand-700 font-bold mb-3">
                {beat.version}
              </p>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
                {beat.title}{' '}
                {beat.subtitle && (
                  <span className="block text-tealbrand-600 font-light">{beat.subtitle}</span>
                )}
              </h1>

              {beat.description && (
                <p className="text-sm md:text-base font-mono text-slate-600 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
                  {beat.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Timeline HUD Progress Bar */}
        <div className="absolute left-6 md:left-12 bottom-8 z-40 flex items-center space-x-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
          <div className="w-32 md:w-44 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              ref={tlFillRef}
              className="h-full bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500"
              style={{ width: '0%', willChange: 'width' }}
            />
          </div>
          <span
            ref={timeLabelRef}
            className="font-mono text-xs font-bold text-slate-800 tabular-nums"
          >
            0.00s
          </span>
        </div>

        {/* Interactive Beat Dots */}
        <div className="absolute right-6 md:right-12 bottom-8 z-40 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
          {beatsData.map((_, idx) => (
            <button
              key={idx}
              ref={(el) => (dotElsRef.current[idx] = el)}
              onClick={() => jumpToBeat(idx)}
              title={`Jump to Beat ${idx + 1}`}
              className="w-2.5 h-2.5 rounded-full bg-slate-300 transition-all duration-200"
              style={{ willChange: 'transform, background-color' }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex flex-col items-center text-slate-400 animate-bounce">
          <span className="font-mono text-[9px] uppercase tracking-widest mb-1 text-slate-500">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 text-tealbrand-600" />
        </div>
      </div>
    </section>
  );
}
