import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Mail, MessageSquare, User, Tag } from 'lucide-react';

export default function ContactCanal() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Full-Stack Software Architecture',
    message: '',
  });

  const canvasRef = useRef(null);

  // Section-scoped 3D bioluminescent particle canvas
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

    const count = 40;
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
        speed: 0.15 + Math.random() * 0.4,
        drift: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.4,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 relative overflow-hidden border-t border-slate-200/80">
      {/* 3D Bioluminescent Particle Canvas Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-tealbrand-500/30 mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600 animate-ping"></span>
            <span className="font-mono text-[10px] font-bold text-tealbrand-800 uppercase tracking-widest">
              COMMUNICATION CANAL // INQUIRIES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
            Initialize A <span className="font-bold text-tealbrand-600">Project</span>
          </h2>
          <p className="mt-3 font-mono text-xs text-slate-600 uppercase tracking-wider">
            Let us construct your structured software platform & AI solution.
          </p>
        </div>

        <div className="max-w-2xl mx-auto nature-glass rounded-2xl p-8 md:p-10 border border-tealbrand-500/30 bg-white/90 backdrop-blur-lg relative shadow-2xl">
          {/* Tech Frame Corner Markers */}
          <span className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-tealbrand-600"></span>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-tealbrand-600"></span>
          <span className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-2 border-l-2 border-tealbrand-600"></span>
          <span className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-2 border-r-2 border-tealbrand-600"></span>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-mono">Project Initialized</h3>
              <p className="text-xs font-mono text-slate-600 max-w-md mx-auto leading-relaxed uppercase">
                Thank you, <span className="font-bold text-tealbrand-700">{formData.name}</span>. Our lead software architect will review your parameters and respond within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', category: 'Full-Stack Software Architecture', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-tealbrand-600 hover:bg-tealbrand-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/20 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/20 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project Domain
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/20 transition-all font-sans"
                  >
                    <option>Full-Stack Software Architecture</option>
                    <option>AI Automation & Swarms</option>
                    <option>Model Fine-Tuning & Deployment</option>
                    <option>Turnkey SaaS Platform Integration</option>
                    <option>Custom UI/UX Design System</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Project Scope & Specifications
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your target requirements, software architecture, or project timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/20 transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-tealbrand-600 hover:bg-tealbrand-700 text-white rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Transmit Project Parameters</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
