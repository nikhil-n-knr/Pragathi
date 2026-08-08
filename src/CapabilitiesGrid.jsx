import React from 'react';
import { Monitor, Code, Calculator, CheckCircle2 } from 'lucide-react';

export default function CapabilitiesGrid() {
  const services = [
    {
      icon: Monitor,
      title: 'Web Application Development',
      description: 'Crafting responsive, secure, and user-friendly web portals optimized with modular components and high-contrast styling systems.',
      features: ['MODULAR COMPONENT ARCHITECTURE', 'HIGH-CONTRAST LIGHT STYLING', 'RESPONSIVE PORTALS'],
    },
    {
      icon: Code,
      title: 'Custom Software Architectures',
      description: 'Tailor-made software products engineered specifically to streamline your business rules, registries, and operational targets.',
      features: ['TAILOR-MADE BUSINESS ENGINES', 'REGISTRY & RULE AUTOMATION', 'OPERATIONAL SCALE'],
    },
    {
      icon: Calculator,
      title: 'Finance & Auditing Tools',
      description: 'Highly secure and reliable transaction engines designed to audit records, calculate dynamic fields, and compile ledgers accurately.',
      features: ['TRANSACTION HISTORY AUDITING', 'DYNAMIC FIELD CALCULATIONS', 'SECURE LEDGER COMPILATION'],
    },
  ];

  return (
    <section id="services" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              SERVICE DIRECTORY // CORE COMPETENCIES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
            Core <span className="font-bold text-tealbrand-600">Competencies</span>
          </h2>
          <p className="mt-3 font-mono text-xs text-slate-500 uppercase tracking-wider leading-relaxed">
            Diligence and precision in every line of code.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="nature-glass nature-glass-hover rounded-2xl p-8 border border-slate-200/80 relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-tealbrand-500/10 border border-tealbrand-500/20 flex items-center justify-center text-tealbrand-600 mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-mono uppercase tracking-wide mb-3">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-[11px] font-mono font-medium text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600 flex-shrink-0" />
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
