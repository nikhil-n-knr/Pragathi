import React, { useState } from 'react';
import { Send, CheckCircle, Mail, MessageSquare, User, Tag } from 'lucide-react';
import ParticleSwarm3D from './ParticleSwarm3D';

export default function ContactCanal() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Full-Stack Software Architecture',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-28 bg-slate-50 relative overflow-hidden border-t border-slate-200/80">
      {/* Exact Same Three.js 3D WebGL Particle Swarm System as Hero */}
      <ParticleSwarm3D className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" />

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
