import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Cpu, Scale } from 'lucide-react';
import ParticleSwarm3D from '../components/ParticleSwarm3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  const sectionRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const beatElsRef = useRef([]);

  const beats = [
    {
      label: 'TERMS BEAT 01',
      title: 'Architecture Licensing',
      p: 'All custom software products, UI/UX design systems, and agentic workflows built by Πsparrow are licensed for enterprise scalability under dedicated agreement terms.',
      s: 0.0,
      e: 0.25,
    },
    {
      label: 'TERMS BEAT 02',
      title: '99.99% SLA Commitment',
      p: 'Our global multi-region edge mesh maintains a guaranteed 99.99% operational uptime. Automated status telemetry is publicly auditable in real time.',
      s: 0.26,
      e: 0.5,
    },
    {
      label: 'TERMS BEAT 03',
      title: 'Swarm Governance Rules',
      p: 'Autonomous AI swarms must operate within certified ethics guidelines and rate boundaries. Misuse or unthrottled scraping triggers automated container isolation.',
      s: 0.51,
      e: 0.75,
    },
    {
      label: 'TERMS BEAT 04',
      title: 'Turnkey SaaS Support',
      p: 'Full maintenance, automatic security patches, and database migrations are provided continuously for HRMS, CRM, CMS, LMS, and PlaySchool platforms.',
      s: 0.76,
      e: 1.0,
    },
  ];

  const calculateBeatOpacity = (p, s, e) => {
    const span = e - s;
    const fade = span * 0.3;
    if (p < s || p > e) return 0;
    if (p < s + fade) return (p - s) / fade;
    if (p > e - fade) return (e - p) / fade;
    return 1;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const section = sectionRef.current;
    if (!section) return;

    let rawP = 0;
    let renderP = 0;
    let animId;

    const rafLoop = () => {
      renderP += (rawP - renderP) * 0.1;
      const p = renderP;

      let lb = 0;
      if (p < 0.06) lb = (p / 0.06) * 6;
      else if (p > 0.92) lb = 6 * (1 - (p - 0.92) / 0.08);
      else lb = 6;

      if (lbTopRef.current) lbTopRef.current.style.height = `${lb.toFixed(2)}vh`;
      if (lbBotRef.current) lbBotRef.current.style.height = `${lb.toFixed(2)}vh`;

      if (tlFillRef.current) tlFillRef.current.style.width = `${(p * 100).toFixed(2)}%`;

      beats.forEach((b, idx) => {
        const o = calculateBeatOpacity(p, b.s, b.e);
        const el = beatElsRef.current[idx];
        if (el) {
          el.style.opacity = o.toFixed(3);
          el.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`;
        }
      });

      animId = requestAnimationFrame(rafLoop);
    };

    animId = requestAnimationFrame(rafLoop);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      rawP = travel > 0 ? scrolled / travel : 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-tealbrand-500/20 selection:text-tealbrand-900 relative">
      <Navbar />

      {/* Sticky Hero Stage */}
      <section ref={sectionRef} className="relative" style={{ height: '400vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50 flex items-center justify-center">
          <ParticleSwarm3D />

          <div ref={lbTopRef} className="absolute top-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none" style={{ height: '0vh' }} />
          <div ref={lbBotRef} className="absolute bottom-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none" style={{ height: '0vh' }} />

          <div className="absolute top-24 left-8 z-40">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:text-tealbrand-600 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Platform</span>
            </Link>
          </div>

          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
            {beats.map((beat, idx) => (
              <div
                key={idx}
                ref={(el) => (beatElsRef.current[idx] = el)}
                className="flex flex-col items-center absolute text-center px-6 max-w-3xl"
                style={{ opacity: 0 }}
              >
                <p className="text-xs uppercase tracking-[0.35rem] text-tealbrand-700 font-bold mb-4 font-mono">
                  {beat.label}
                </p>
                <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                  {beat.title}
                </h1>
                <p className="text-sm sm:text-base font-mono text-slate-600 max-w-xl leading-relaxed uppercase tracking-wider">
                  {beat.p}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute left-8 bottom-12 z-45 flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/20 shadow-md">
            <div className="w-40 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div ref={tlFillRef} className="h-full bg-tealbrand-600" style={{ width: '0%' }} />
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">Terms of Service</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-16">
        <div className="nature-glass rounded-2xl p-8 md:p-12 border border-slate-200 bg-white shadow-xl space-y-6">
          <div className="flex items-center space-x-3 text-tealbrand-600">
            <FileText className="w-8 h-8" />
            <h2 className="text-2xl font-bold font-mono text-slate-900 uppercase tracking-tight">
              1. Master Service Agreement
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            By deploying software, AI agentic swarms, or ready SaaS platforms from Πsparrow Software Solutions, enterprise clients enter into a binding master agreement protecting operational integrity and code quality.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
