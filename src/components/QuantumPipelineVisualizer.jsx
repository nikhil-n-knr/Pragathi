import React, { useEffect, useRef, useState } from 'react';
import { Database, Cpu, Rocket, ArrowRight, Zap, CheckCircle, Activity, BarChart2 } from 'lucide-react';

export default function QuantumPipelineVisualizer() {
  const canvasRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1); // 0: COLLECTED, 1: PROCESSED, 2: DEPLOYED
  const [showMetrics, setShowMetrics] = useState(false);

  const steps = [
    {
      id: 0,
      phase: '01 / INGESTION',
      title: 'COLLECTED',
      icon: Database,
      badge: 'Edge Ingestion Active',
      desc: 'Raw data is securely ingested from enterprise edge nodes instantly via zero-trust TLS 1.3 streams.',
      metrics: {
        throughput: '2.48 GB/s',
        activeNodes: '1,280 Edge Nodes',
        security: '256-Bit Encrypted',
      },
    },
    {
      id: 1,
      phase: '02 / SYNTHESIS',
      title: 'PROCESSED',
      icon: Cpu,
      badge: 'Neural Core Processing',
      desc: 'Data is synthesized, audited, and transformed in real-time through isolated agentic swarm pipelines.',
      metrics: {
        latency: '3.2ms Processing',
        accuracy: '99.999% Neural Match',
        agentsActive: '64 Swarm Workers',
      },
    },
    {
      id: 2,
      phase: '03 / OUTPUT',
      title: 'DEPLOYED',
      icon: Rocket,
      badge: 'Operational Pipeline Live',
      desc: 'Actionable insights and transformed data streams deployed directly into your operational target systems.',
      metrics: {
        deployStatus: '100% Broadcast',
        destinations: 'Multi-Region Mesh',
        integrity: 'Cryptographically Signed',
      },
    },
  ];

  // Canvas Laser Particle Stream Animation connecting Stage 0 -> Stage 1 -> Stage 2
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = (canvas.width = canvas.parentElement.offsetWidth * window.devicePixelRatio);
    let H = (canvas.height = canvas.parentElement.offsetHeight * window.devicePixelRatio);

    const onResize = () => {
      if (!canvas.parentElement) return;
      W = canvas.width = canvas.parentElement.offsetWidth * window.devicePixelRatio;
      H = canvas.height = canvas.parentElement.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', onResize);

    // Particle flow stream
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        size: (2 + Math.random() * 4) * window.devicePixelRatio,
        yOffset: (Math.random() - 0.5) * 20 * window.devicePixelRatio,
        color: i % 2 === 0 ? 'rgba(13, 148, 136, ' : 'rgba(16, 185, 129, ',
      });
    }

    let t = 0;
    const draw = () => {
      t += 16;
      ctx.clearRect(0, 0, W, H);

      const yPos = H * 0.5;

      // Draw Laser Conduit Line
      ctx.beginPath();
      ctx.moveTo(W * 0.15, yPos);
      ctx.lineTo(W * 0.85, yPos);
      ctx.strokeStyle = 'rgba(13, 148, 136, 0.25)';
      ctx.lineWidth = 3 * window.devicePixelRatio;
      ctx.setLineDash([8 * window.devicePixelRatio, 6 * window.devicePixelRatio]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Moving Energy Particles
      particles.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1.0;
        const px = W * 0.15 + p.progress * (W * 0.7);
        const py = yPos + Math.sin(t * 0.003 + p.progress * Math.PI * 4) * 12 * window.devicePixelRatio;

        const alpha = Math.sin(p.progress * Math.PI) * 0.9;
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow aura around active particles
        ctx.fillStyle = `${p.color}${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="w-full relative font-sans">
      {/* Background Interactive Laser Stream Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* 3 Step Interactive Cards Row */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`rounded-2xl p-8 transition-all duration-500 cursor-pointer relative flex flex-col justify-between overflow-hidden group ${
                isActive
                  ? 'bg-white border-2 border-tealbrand-500 shadow-2xl scale-105 z-20'
                  : 'bg-white/80 border border-slate-200/80 shadow-md hover:bg-white hover:border-tealbrand-500/40 hover:scale-[1.02] z-10'
              }`}
            >
              {/* Top Bioluminescent Beam Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-tealbrand-500 via-emerald-500 to-cyanbrand-500 opacity-100'
                    : 'bg-slate-200 opacity-40 group-hover:opacity-100'
                }`}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                    {step.phase}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 ${
                      isActive
                        ? 'bg-tealbrand-600 text-white shadow-lg scale-110'
                        : 'bg-tealbrand-500/10 text-tealbrand-600 border border-tealbrand-500/20'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3
                  className={`font-bold leading-none tracking-tight mb-4 transition-colors ${
                    isActive ? 'text-tealbrand-700' : 'text-slate-900'
                  }`}
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}
                >
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-sans mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Action Button for Step 2 */}
              {step.id === 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep(1);
                    setShowMetrics(!showMetrics);
                  }}
                  className="w-full bg-tealbrand-600 hover:bg-tealbrand-700 text-white text-xs font-mono font-bold py-3 rounded-full uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <Activity className="w-4 h-4" />
                  <span>{showMetrics ? 'HIDE METRICS' : 'VIEW METRICS'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
                  <span>{step.badge}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Telemetry Inspector Drawer */}
      <div className="mt-8 max-w-6xl mx-auto relative z-20">
        <div className="nature-glass rounded-2xl p-6 md:p-8 border border-tealbrand-500/30 bg-white/95 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-tealbrand-500/10 border border-tealbrand-500/20 flex items-center justify-center text-tealbrand-600">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-tealbrand-700 uppercase tracking-widest block">
                  LIVE QUANTUM TELEMETRY INSPECTOR
                </span>
                <h4 className="font-bold text-lg text-slate-900 font-mono">
                  {currentStep.title} — {currentStep.badge}
                </h4>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2 font-mono text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Real-Time Edge Stream Verified</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(currentStep.metrics).map(([key, val], idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
