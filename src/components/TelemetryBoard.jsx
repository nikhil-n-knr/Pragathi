import React, { useState } from 'react';
import { Activity, ShieldCheck, Server, Radio, ArrowUpRight, BarChart3 } from 'lucide-react';

export default function TelemetryBoard() {
  const [selectedMetric, setSelectedMetric] = useState(0);

  const metrics = [
    {
      title: 'Cluster Alpha',
      status: 'Online',
      tag: 'Deployment',
      region: 'US-East Node',
      uptime: '99.99% Uptime',
      latency: '4.2ms',
      color: 'bg-tealbrand-600 text-white',
      border: 'border-tealbrand-500/30',
    },
    {
      title: 'Neural Edge Array',
      status: 'Active',
      tag: 'Processing',
      region: 'EU-Central Edge',
      uptime: '12ms Ping',
      latency: '0.8ms',
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-500/30',
    },
    {
      title: 'Circuit Telemetry',
      status: 'Continuous',
      tag: 'Hardware',
      region: 'Global Mesh',
      uptime: 'Epoch 128',
      latency: '100k msg/s',
      color: 'bg-slate-900 text-white',
      border: 'border-slate-700',
    },
    {
      title: 'Zero-Trust Shield',
      status: 'Protected',
      tag: 'Security',
      region: 'Hardware Enclave',
      uptime: 'Encrypted',
      latency: '256-Bit HSM',
      color: 'bg-tealbrand-500 text-white',
      border: 'border-tealbrand-400',
    },
  ];

  const steps = [
    {
      step: '01 / Ingestion',
      title: 'COLLECTED',
      description: 'Sensor data is securely ingested from physical hardware edge nodes instantly.',
      dark: true,
    },
    {
      step: '02 / Synthesis',
      title: 'PROCESSED',
      description: 'Real-time bio-mimetic algorithms clean, structure, and synthesize telemetry streams.',
      dark: false,
    },
    {
      step: '03 / Output',
      title: 'DEPLOYED',
      description: 'Actionable control signals deployed directly into operational pipelines.',
      dark: true,
    },
  ];

  return (
    <section id="telemetry" className="py-28 bg-slate-900 text-white relative overflow-hidden font-sans">
      {/* Background Huge Watermark */}
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-black text-slate-800/25 pointer-events-none select-none tracking-tighter uppercase whitespace-nowrap z-0">
        TELEMETRY
      </h2>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/20 border border-tealbrand-500/30 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-400 animate-ping"></span>
              <span className="font-mono text-[10px] font-bold text-tealbrand-300 uppercase tracking-widest">
                LIVE TELEMETRY // REAL-TIME METRICS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
              Operational Scale & <span className="font-bold text-tealbrand-400">Node Status</span>
            </h2>
          </div>

          <div className="mt-4 md:mt-0 font-mono text-xs text-slate-400 flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All Edge Clusters Operational</span>
          </div>
        </div>

        {/* 4 Cards Status Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedMetric(idx)}
              className={`p-6 rounded-xl border ${m.border} ${m.color} transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-xl flex flex-col justify-between min-h-[200px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {m.tag}
                  </span>
                  <BarChart3 className="w-4 h-4 opacity-70" />
                </div>

                <h3 className="text-2xl font-black tracking-tight leading-none mb-1">
                  {m.title}
                </h3>
                <span className="font-mono text-xs opacity-90 block">{m.status}</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px] opacity-80">
                <span>{m.region}</span>
                <span className="font-bold">{m.uptime}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-800">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border transition-all ${
                s.dark
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <span
                className={`font-mono text-xs font-bold uppercase tracking-widest block mb-4 ${
                  s.dark ? 'text-tealbrand-400' : 'text-tealbrand-700'
                }`}
              >
                {s.step}
              </span>

              <h3 className="text-3xl font-extrabold tracking-tight mb-4">{s.title}</h3>

              <p
                className={`text-xs font-mono leading-relaxed ${
                  s.dark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
