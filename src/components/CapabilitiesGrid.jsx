import React from 'react';
import { Cpu, Cloud, CircuitBoard, Shield, CheckCircle2 } from 'lucide-react';

export default function CapabilitiesGrid() {
  const capabilities = [
    {
      icon: Cpu,
      title: 'Embedded Systems & Firmware',
      description: 'Ultra-low power micro-kernel development for ARM Cortex, STM32, RISC-V, and ESP32 with zero-heap memory safety in Rust & C++.',
      features: ['Real-Time OS (RTOS)', 'Bare-Metal C/Rust Drivers', 'Over-The-Air (OTA) Updates'],
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Infrastructure',
      description: 'Distributed cloud architectures that aggregate edge sensor feeds into zero-latency time-series pipelines with 99.99% operational uptime.',
      features: ['Kubernetes & Edge Nodes', 'High-Throughput gRPC APIs', 'Automated CI/CD Pipelines'],
    },
    {
      icon: CircuitBoard,
      title: 'Custom PCB & Hardware Engineering',
      description: 'Industrial multi-layer PCB design, impedance matching, thermal simulation, component sourcing, and rapid turnaround prototyping.',
      features: ['Multi-Layer High Speed PCB', 'Thermal & EMI Simulation', 'Turnkey Assembly & Testing'],
    },
    {
      icon: Shield,
      title: 'Zero-Trust Security Mesh',
      description: 'Hardware-backed cryptographic identity, secure boot verification, and end-to-end encrypted mesh communications for mission-critical hardware.',
      features: ['Hardware Security Module (HSM)', 'Encrypted Mesh Communication', 'Tamper-Proof Bootloader'],
    },
  ];

  return (
    <section id="capabilities" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              CAPABILITIES // HARDWARE & SOFTWARE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
            Deploy Seamlessly Across <span className="font-bold text-tealbrand-600">Your Operational Stack</span>
          </h2>
          <p className="mt-4 font-mono text-xs text-slate-500 uppercase tracking-wider leading-relaxed">
            From raw silicon layout to global cloud clusters — we engineer integrated solutions designed for maximum reliability.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="nature-glass nature-glass-hover rounded-2xl p-8 border border-slate-200/80 relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-tealbrand-500/10 border border-tealbrand-500/20 flex items-center justify-center text-tealbrand-600 mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-2">
                  {cap.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-xs font-mono font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
