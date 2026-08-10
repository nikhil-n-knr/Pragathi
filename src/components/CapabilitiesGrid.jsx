import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CapabilitiesGrid() {
  const [activeHover, setActiveHover] = useState(null);
  const canvasRef = useRef(null);

  // Section-scoped 3D bioluminescent particle field canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = (canvas.width = canvas.parentElement.offsetWidth * window.devicePixelRatio);
    let H = (canvas.height = canvas.parentElement.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      W = canvas.width = canvas.parentElement.offsetWidth * window.devicePixelRatio;
      H = canvas.height = canvas.parentElement.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    const count = 45;
    const particles = [];
    const colors = [
      'rgba(13, 148, 136, ',  // Teal 600
      'rgba(16, 185, 129, ',  // Emerald 500
      'rgba(6, 182, 212, ',   // Cyan 500
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: (2 + Math.random() * 4) * window.devicePixelRatio,
        speed: 0.2 + Math.random() * 0.5,
        drift: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.45,
        color: colors[i % colors.length],
        seed: Math.random() * 100,
      });
    }

    let time = 0;
    const render = () => {
      time += 16;
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        const px = (p.x + Math.sin(time * 0.0003 * p.speed + p.drift) * 0.04) * W;
        const py = (((p.y - time * 0.00003 * p.speed) % 1 + 1) % 1) * H;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.002 + p.seed));
        const size = p.radius * (0.85 + 0.25 * Math.cos(time * 0.0015 + p.seed));

        ctx.globalAlpha = pulseAlpha;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5);
        gradient.addColorStop(0, `${p.color}0.85)`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const services = [
    {
      id: 'software',
      icon: Monitor,
      title: 'Full-Stack Software & UI/UX',
      badge: 'Software Architecture',
      description: 'Crafting responsive, secure, and user-friendly web portals, mobile platforms, and sleek UI/UX design systems optimized for scale.',
      features: ['FULL-STACK WEB & MOBILE PORTALS', 'SLEEK MODERN UI/UX DESIGN SYSTEMS', 'HIGH-CONTRAST LIGHT THEME ENGINE'],
    },
    {
      id: 'agentic',
      icon: Cpu,
      title: 'AI Automation & Agentic AI',
      badge: 'Agentic Engineering',
      description: 'Designing autonomous AI agent swarms and multi-step orchestration workflows that execute complex business operations automatically.',
      features: ['AUTONOMOUS MULTI-AGENT SWARMS', 'RECURRING AGENTIC WORKFLOWS', 'REAL-TIME LLM ORCHESTRATION'],
    },
    {
      id: 'models',
      icon: Sparkles,
      title: 'Model Training & Fine-Tuning',
      badge: 'Enterprise Intelligence',
      description: 'Training, fine-tuning, and deploying specialized domain AI models customized to your exact operational and business modules.',
      features: ['DOMAIN-SPECIFIC MODEL FINE-TUNING', 'ENTERPRISE DATASET CURATION', 'PRIVATE ON-PREM MODEL DEPLOYMENT'],
    },
  ];

  return (
    <section id="services" className="py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden border-t border-slate-200/80">
      {/* 3D Bioluminescent Particle Canvas Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-tealbrand-500/30 mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600 animate-ping"></span>
            <span className="font-mono text-[10px] font-bold text-tealbrand-800 uppercase tracking-widest">
              SERVICE DIRECTORY // CORE COMPETENCIES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
            Software & <span className="font-bold text-tealbrand-600">AI Solutions</span>
          </h2>
          <p className="mt-3 font-mono text-xs text-slate-600 uppercase tracking-wider leading-relaxed">
            Full-stack engineering, agentic swarms, and custom AI model training.
          </p>
        </div>

        {/* 3 Interactive Glass Cards with Bioluminescent Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isHovered = activeHover === service.id;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveHover(service.id)}
                onMouseLeave={() => setActiveHover(null)}
                className={`nature-glass rounded-2xl p-8 border transition-all duration-500 relative flex flex-col justify-between cursor-pointer group ${
                  isHovered
                    ? 'border-tealbrand-500/60 shadow-2xl bg-white/95 -translate-y-2 scale-[1.02]'
                    : 'border-slate-200/80 bg-white/80 backdrop-blur-md shadow-md'
                }`}
              >
                {/* Bioluminescent Top Border Beam */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500 rounded-t-2xl transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isHovered
                          ? 'bg-tealbrand-600 text-white shadow-lg scale-110'
                          : 'bg-tealbrand-500/10 border border-tealbrand-500/20 text-tealbrand-600'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-tealbrand-50 border border-tealbrand-200 text-tealbrand-700 font-mono text-[9px] font-bold uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-mono uppercase tracking-wide mb-3 group-hover:text-tealbrand-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="pt-6 border-t border-slate-100 space-y-2 mb-6">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[11px] font-mono font-medium text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs font-bold text-tealbrand-700">
                    <span>EXPLORE CAPABILITIES</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
