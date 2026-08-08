import React, { useRef } from 'react';

export default function AboutSection() {
  const cardRef = useRef(null);

  // 3D Perspective Tilt on MouseMove
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease-out';
  };

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-tealbrand-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="nature-glass rounded-2xl p-8 md:p-14 border border-tealbrand-500/20 relative shadow-xl overflow-hidden">
          {/* Corner Markers */}
          <span className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-tealbrand-600/50"></span>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-tealbrand-600/50"></span>
          <span className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-2 border-l-2 border-tealbrand-600/50"></span>
          <span className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-2 border-r-2 border-tealbrand-600/50"></span>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600 animate-ping"></span>
                <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                  WHO WE ARE // DESIGN PHILOSOPHY
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-6">
                Welcome to <span className="font-mono font-bold text-tealbrand-600">Πsparrow</span>
              </h2>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                At Πsparrow, we believe in the power of technology to foster growth and structural efficiency. Like a sparrow building its nest twig by twig with precision, we build our software architectures with meticulous care, focusing on mathematical precision and technical detail.
              </p>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans">
                Our name combines <strong className="text-tealbrand-700 font-mono">Π (Pi)</strong>, representing the mathematical precision and infinite potential of computing, with <strong className="text-tealbrand-700">Sparrow</strong>, representing diligence, agility, and system integrity. This design philosophy drives us to deliver robust, high-performance, and perfectly clean digital systems.
              </p>
            </div>

            {/* Interactive 3D Quantum Nest Card */}
            <div className="flex justify-center">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-80 h-80 border border-tealbrand-500/30 bg-gradient-to-br from-tealbrand-50/90 via-white to-emerald-50/90 rounded-2xl flex flex-col items-center justify-center p-6 relative shadow-2xl cursor-pointer group"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* 3D Quantum Nest Image */}
                <div
                  className="w-56 h-56 rounded-xl overflow-hidden mb-3 relative flex items-center justify-center"
                  style={{ transform: 'translateZ(40px)', willChange: 'transform' }}
                >
                  <img
                    src="/images/sparrow_nest.png"
                    alt="Bio-Mimetic Quantum Sparrow Nest Architecture"
                    className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div
                  className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-tealbrand-600/10 border border-tealbrand-500/30 p-1 flex items-center justify-center shadow-md"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <img src="/logo.png" alt="Πsparrow Mark" className="w-full h-full object-contain" />
                </div>

                <span
                  className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Quantum Sparrow Nest Architecture
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
