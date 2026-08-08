import React from 'react';

export default function ManifestoTypography() {
  const words = [
    'Everything',
    'your',
    'hardware',
    '&',
    'software',
    'network',
    'needs,',
    'engineered',
    'naturally',
    'into',
    'one',
    'unified',
    'ecosystem.',
  ];

  return (
    <section className="relative min-h-screen bg-slate-100 text-slate-900 overflow-hidden flex items-center justify-center py-24 px-6 font-sans">
      {/* Background Soft Nature Wash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(13,148,136,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />

      {/* Decorative Technical Frame Corner Lines */}
      <div className="absolute inset-8 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-tealbrand-600"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-tealbrand-600"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-tealbrand-600"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-tealbrand-600"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`font-black uppercase tracking-tighter leading-none transition-all duration-300 ${
              word.toLowerCase().includes('naturally') || word.toLowerCase().includes('unified')
                ? 'text-tealbrand-600 drop-shadow-sm'
                : word.toLowerCase().includes('ecosystem.')
                ? 'text-emerald-700'
                : 'text-slate-900'
            }`}
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 6.5rem)',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="absolute left-8 bottom-8 z-10 font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">
        04 // SYSTEM MANIFESTO — ΠSPARROW
      </div>
    </section>
  );
}
