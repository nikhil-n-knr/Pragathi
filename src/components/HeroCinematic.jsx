import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, ShieldCheck, Zap, Activity, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroCinematic() {
  const sectionRef = useRef(null);
  const pinStageRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeBeat, setActiveBeat] = useState(0);

  const beatsData = [
    {
      version: 'VERSION 2.0 / BIO-MIMETIC PLATFORM',
      title: 'Quiet Circuitry,',
      subtitle: 'Waiting Data',
      description: 'Structured platforms inspired by organic resilience and engineering precision.',
      start: 0.0,
      end: 0.13,
    },
    {
      version: 'NATURE-INSPIRED ALGORITHMS',
      title: 'The Bio-Digital Engine',
      subtitle: 'Self-healing, micro-service networks unfold like natural ecosystems.',
      description: 'Co-designing software algorithms with physical PCB circuit architecture.',
      start: 0.14,
      end: 0.28,
    },
    {
      version: 'HARDWARE & EMBEDDED SWARMS',
      title: 'Co-Designed Silicon',
      subtitle: 'Precision PCB Manufacturing & Edge Computing',
      description: 'Integrated hardware clusters running at sub-millisecond edge latency.',
      start: 0.29,
      end: 0.43,
    },
    {
      version: 'INFINITE SCALABILITY',
      title: 'Connected Micro-Clusters',
      subtitle: 'Fifty-four autonomous nodes scaling across cloud and physical devices.',
      description: 'Built for industrial reliability, high-frequency throughput, and zero downtime.',
      start: 0.44,
      end: 0.58,
    },
    {
      version: 'ZERO-LATENCY TELEMETRY',
      title: 'Carried by Light Stream',
      subtitle: 'Real-time telemetry pipelines engineered with bio-mimetic efficiency.',
      description: 'Instant data synchronization across localized edge points.',
      start: 0.59,
      end: 0.74,
    },
    {
      version: 'INDUSTRIAL DEPLOYMENT',
      title: 'Into The Ecosystem',
      subtitle: 'From prototype to high-volume production.',
      description: 'Turnkey hardware and software execution built for modern industry.',
      start: 0.75,
      end: 0.88,
    },
    {
      version: 'DEPLOYED & OPERATIONAL',
      title: 'Πsparrow Platform',
      subtitle: 'System Active — Explore the Ecosystem Below.',
      description: 'Discover our showcase products, hardware capabilities, and core flock.',
      start: 0.89,
      end: 1.0,
    },
  ];

  // 1. Canvas Light Nature Particles Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let height = (canvas.height = window.innerHeight * window.devicePixelRatio);

    const handleResize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 65;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: (2 + Math.random() * 6) * window.devicePixelRatio,
        speed: 0.15 + Math.random() * 0.45,
        drift: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.55,
        color: i % 3 === 0 ? 'rgba(13, 148, 136, ' : i % 3 === 1 ? 'rgba(16, 185, 129, ' : 'rgba(6, 182, 212, ',
      });
    }

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const px = (p.x + Math.sin(time * 0.0005 * p.speed + p.drift) * 0.03) * width;
        const py = ((p.y - time * 0.0001 * p.speed) % 1) * height + (p.y < 0 ? height : 0);
        const currentPy = py < 0 ? py + height : py;

        const radialGradient = ctx.createRadialGradient(px, currentPy, 0, px, currentPy, p.radius * 2);
        radialGradient.addColorStop(0, `${p.color}${p.alpha})`);
        radialGradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(px, currentPy, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. GSAP ScrollTrigger Pinned Beats Timeline
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const prog = self.progress;
        setCurrentProgress(prog);

        // Find active beat index
        const index = beatsData.findIndex((b) => prog >= b.start && prog <= b.end);
        if (index !== -1) {
          setActiveBeat(index);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const jumpToBeat = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const targetBeat = beatsData[index];
    const midPoint = (targetBeat.start + targetBeat.end) / 2;
    const totalScrollable = section.offsetHeight - window.innerHeight;
    const targetScroll = section.offsetTop + midPoint * totalScrollable;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={sectionRef} id="cinematic" className="relative" style={{ height: '700vh' }}>
      {/* Sticky Stage Container */}
      <div
        ref={pinStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-tealbrand-50/30 to-emerald-50/20"
      >
        {/* Canvas Particle Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        />

        {/* Ambient Nature Radial Glow */}
        <div className="absolute inset-0 z-0 bg-nature-radial pointer-events-none" />

        {/* Technical Corner Framing Markers */}
        <div className="absolute inset-6 md:inset-10 z-30 pointer-events-none">
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-tealbrand-600/40 rounded-tl-sm"></span>
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-tealbrand-600/40 rounded-tr-sm"></span>
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-tealbrand-600/40 rounded-bl-sm"></span>
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-tealbrand-600/40 rounded-br-sm"></span>
        </div>

        {/* Central 3D Floating Visual Card */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div
            className="transition-transform duration-700 ease-out"
            style={{
              transform: `scale(${1 + currentProgress * 0.25}) rotate(${currentProgress * 6}deg)`,
            }}
          >
            <div className="w-[300px] h-[300px] md:w-[460px] md:h-[460px] rounded-3xl nature-glass border border-tealbrand-500/20 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              {/* Inner Circuit Micro Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Top Card Bar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                    NODE ARCHITECTURE // Π-SPARROW
                  </span>
                </div>
                <Cpu className="w-5 h-5 text-tealbrand-600" />
              </div>

              {/* Central Glowing Microchip Emblem */}
              <div className="my-auto flex flex-col items-center justify-center z-10 text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-tealbrand-500/10 via-emerald-500/10 to-cyanbrand-500/10 border border-tealbrand-500/30 flex items-center justify-center shadow-inner mb-4 relative">
                  <div className="absolute inset-2 rounded-xl border border-dashed border-tealbrand-500/30 animate-spin-slow"></div>
                  <span className="font-mono font-bold text-3xl md:text-5xl text-tealbrand-700 tracking-tighter">
                    Π
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500 font-medium tracking-widest uppercase">
                  BIO-CIRCUIT CORE
                </span>
              </div>

              {/* Bottom Card Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 z-10">
                <div>
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                    Throughput
                  </span>
                  <span className="font-mono text-xs font-bold text-tealbrand-800">
                    10.4 GB/s
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                    Efficiency
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    99.84%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Beat Copy Overlay */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
          {beatsData.map((beat, idx) => {
            const isVisible = activeBeat === idx;
            return (
              <div
                key={idx}
                className={`beat-text absolute text-center max-w-3xl flex flex-col items-center transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
                  <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                    {beat.version}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-slate-900 tracking-tight leading-tight mb-3">
                  {beat.title}{' '}
                  {beat.subtitle && (
                    <span className="font-bold text-tealbrand-600 block sm:inline">
                      {beat.subtitle}
                    </span>
                  )}
                </h1>

                <p className="font-mono text-xs sm:text-sm text-slate-600 tracking-wider uppercase max-w-xl mx-auto leading-relaxed">
                  {beat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Timeline HUD Control (Bottom Left) */}
        <div className="absolute left-6 md:left-12 bottom-8 z-50 flex items-center space-x-4 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-sm">
          <div className="w-28 md:w-36 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500 transition-all duration-150"
              style={{ width: `${currentProgress * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
            {(currentProgress * 12.0).toFixed(2)}s
          </span>
        </div>

        {/* Interactive Beat Navigation Dots (Bottom Right) */}
        <div className="absolute right-6 md:right-12 bottom-8 z-50 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-tealbrand-500/20 shadow-sm">
          {beatsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToBeat(idx)}
              title={`Jump to Beat ${idx + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeBeat === idx
                  ? 'bg-tealbrand-600 scale-125 ring-2 ring-tealbrand-500/30'
                  : 'bg-slate-300 hover:bg-tealbrand-400'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator Prompt */}
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
