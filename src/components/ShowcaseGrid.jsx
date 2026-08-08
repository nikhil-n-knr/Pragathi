import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Layers, ArrowRight, ExternalLink } from 'lucide-react';

export default function ShowcaseGrid() {
  const [activeFilter, setActiveFilter] = useState('all');

  const products = [
    {
      id: 'sparrow-core',
      category: 'OS & Firmware',
      title: 'Sparrow Core OS',
      subtitle: 'Micro-kernel RTOS designed for embedded IoT hardware with sub-millisecond execution.',
      badge: 'Edge Ready',
      price: '$840/mo',
      specs: ['0.4ms Latency', 'Zero-Trust Kernel', 'C/Rust Native'],
      icon: Cpu,
      gradient: 'from-tealbrand-500/10 via-emerald-500/5 to-white',
    },
    {
      id: 'bio-mesh',
      category: 'Networking',
      title: 'Bio-Mesh Router',
      subtitle: 'Self-healing wireless mesh routing protocol inspired by organic ant colony networks.',
      badge: '99.99% Resilience',
      price: '$1,120/mo',
      specs: ['Dynamic Re-route', 'AES-256 Mesh', 'LoRa / BLE 5.4'],
      icon: Layers,
      gradient: 'from-cyanbrand-500/10 via-tealbrand-500/5 to-white',
    },
    {
      id: 'sensor-array',
      category: 'Telemetry',
      title: 'Sensor Array Synthesizer',
      subtitle: 'High-frequency telemetry ingestion pipeline processing up to 100k events/sec.',
      badge: 'Real-Time Stream',
      price: '$1,450/mo',
      specs: ['100k Events/sec', 'Time-Series Engine', 'MQTT & gRPC'],
      icon: Zap,
      gradient: 'from-emerald-500/10 via-tealbrand-500/5 to-white',
    },
    {
      id: 'pcb-compiler',
      category: 'Hardware',
      title: 'PCB Hardware Compiler',
      subtitle: 'Automated circuit trace optimizer & turnkey board manufacturing bridge.',
      badge: 'Silicon Prototype',
      price: '$2,100/mo',
      specs: ['Gerber AI Auditor', 'Trace Thermal Simulation', 'DFM Automated Check'],
      icon: ShieldCheck,
      gradient: 'from-tealbrand-600/10 via-cyanbrand-500/5 to-white',
    },
  ];

  const categories = ['all', 'OS & Firmware', 'Networking', 'Telemetry', 'Hardware'];

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="showcase" className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Decorative Light Backdrop Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tealbrand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
              <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                THE SHOWCASE // PLATFORM MODULES
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
              Autonomous Systems & <span className="font-bold text-tealbrand-600">Hardware Engines</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === cat
                    ? 'bg-tealbrand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="nature-glass nature-glass-hover rounded-2xl p-6 flex flex-col justify-between relative group cursor-pointer border border-tealbrand-500/15"
              >
                {/* Card Header & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tealbrand-500/10 to-emerald-500/10 border border-tealbrand-500/20 flex items-center justify-center text-tealbrand-600 group-hover:scale-110 group-hover:bg-tealbrand-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-mono text-[9px] font-bold uppercase tracking-wider">
                      {product.badge}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-tealbrand-700 font-bold uppercase tracking-widest block mb-1">
                    {product.category}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-tealbrand-600 transition-colors mb-2">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {product.subtitle}
                  </p>

                  {/* Tech Specs List */}
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-100">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-tealbrand-500"></span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {product.price}
                  </span>
                  <span className="inline-flex items-center text-xs font-mono font-bold text-tealbrand-600 group-hover:translate-x-1 transition-transform">
                    <span>Deploy</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
