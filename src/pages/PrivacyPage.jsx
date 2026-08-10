import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Database, ShieldCheck, Eye, Server, ChevronDown, Search, CheckCircle2, Terminal } from 'lucide-react';
import ParticleSwarm3D from '../components/ParticleSwarm3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  const sectionRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const beatElsRef = useRef([]);

  const [activeTab, setActiveTab] = useState('privacy');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedSection, setExpandedSection] = useState(0); // Open first section by default
  const [searchQuery, setSearchQuery] = useState('');

  const beats = [
    {
      label: 'ZERO-TRUST ENCRYPTION',
      title: 'Zero-Trust Encryption',
      p: 'All data ingested across our agentic AI swarms and SaaS products is encrypted at rest using 256-bit Hardware Security Modules (HSM) and TLS 1.3 in transit.',
      s: 0.0,
      e: 0.25,
    },
    {
      label: 'MODEL ISOLATION',
      title: 'Private Model Isolation',
      p: 'Enterprise datasets provided for custom AI model training are strictly isolated within private tenant containers. Client telemetry is never used for public models.',
      s: 0.26,
      e: 0.5,
    },
    {
      label: 'QUANTUM TELEMETRY',
      title: 'Quantum Telemetry',
      p: 'We use minimal essential telemetry cookies to maintain session authenticity, load balance edge clusters, and optimize render performance.',
      s: 0.51,
      e: 0.75,
    },
    {
      label: 'REGULATORY COMPLIANCE',
      title: 'Regulatory Compliance',
      p: 'Fully compliant with GDPR, CCPA, and international data governance frameworks. Automated data deletion and export tools provided out of the box.',
      s: 0.76,
      e: 1.0,
    },
  ];

  const sections = [
    {
      id: 0,
      tag: 'ENCRYPTION',
      icon: Lock,
      title: '1. Zero-Trust Cryptographic Infrastructure',
      badge: 'AES-256 GCM & TLS 1.3',
      summary: 'Every transaction, user session, and model prompt processed by Πsparrow is secured via AES-256 GCM encryption at rest and TLS 1.3 in transit.',
      details: [
        'Master cryptographic keys stored in FIPS 140-2 Level 3 Hardware Security Modules (HSM).',
        'Automated 90-day master key rotation with zero system downtime.',
        'Ephemeral TLS 1.3 session handshakes with Perfect Forward Secrecy (PFS).',
        'Zero plain-text logging across edge nodes or agentic swarm workers.',
      ],
    },
    {
      id: 1,
      tag: 'AI-ISOLATION',
      icon: Database,
      title: '2. AI Swarm & Training Dataset Isolation',
      badge: 'Dedicated Tenant Containers',
      summary: 'Client training datasets, prompt histories, and fine-tuned model weights remain strictly isolated inside dedicated virtualized sandbox containers.',
      details: [
        'Zero data leakage policy: Client telemetry is NEVER used to train shared base models.',
        'Fine-tuned model weights encrypted with client-owned master keys.',
        'Ephemeral memory wiping upon completion of agentic swarm execution tasks.',
        'Isolated vector database index namespaces for RAG knowledge bases.',
      ],
    },
    {
      id: 2,
      tag: 'GDPR-CCPA',
      icon: ShieldCheck,
      title: '3. Global Regulatory Compliance (GDPR & CCPA)',
      badge: 'Sovereignty & Portability',
      summary: 'Compliant with GDPR, CCPA, and international data governance standards, providing 1-click erasure scripts and full data export capabilities.',
      details: [
        'Automated Right-to-Erasure: Trigger 24-hour cryptographic tenant purging via admin portal.',
        'Full Data Portability: Export complete database schemas and training histories in JSON/CSV formats.',
        'Strict Data Localization: Choose deployment regions across US, EU, and APAC edge clusters.',
        'DPPA & HIPAA compliant data handling options available upon request.',
      ],
    },
    {
      id: 3,
      tag: 'TELEMETRY',
      icon: Eye,
      title: '4. Essential Cookies & Session Telemetry',
      badge: 'Minimal Telemetry',
      summary: 'We utilize minimal bioluminescent session cookies strictly for session authentication, load balancing, and render optimization.',
      details: [
        'Essential cookies only: No cross-site advertising trackers or third-party behavioral scripts.',
        'Anonymized performance telemetry for edge cluster response optimization.',
        'Granular cookie preferences configurable at any time via floating control bar.',
      ],
    },
    {
      id: 4,
      tag: 'DATA-PURGE',
      icon: Server,
      title: '5. Data Retention & Cryptographic Erasure Policy',
      badge: '30-Day Auto Purge',
      summary: 'Operational logs and agentic execution states are retained strictly within agreed lifecycle limits and permanently zeroed upon contract termination.',
      details: [
        'Automated 30-day purge cycle for expired tenant session logs and temporary files.',
        'NIST 800-88 compliant multi-pass cryptographic data sanitization for retired storage blocks.',
        'Instant tenant revocation commands available for compliance officers.',
      ],
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

  const filteredSections = sections.filter((sec) => {
    const matchesFilter = activeFilter === 'ALL' || sec.tag === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-tealbrand-500/20 selection:text-tealbrand-900 relative font-sans">
      <Navbar />

      {/* Image-Free Cinematic Sticky Stage */}
      <section ref={sectionRef} className="relative" style={{ height: '360vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-50 flex items-center justify-center">
          <ParticleSwarm3D />

          {/* Letterbox Bars */}
          <div ref={lbTopRef} className="absolute top-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none" style={{ height: '0vh' }} />
          <div ref={lbBotRef} className="absolute bottom-0 left-0 right-0 bg-slate-950 z-30 pointer-events-none" style={{ height: '0vh' }} />

          {/* Interactive Protocol Switcher Header Bar */}
          <div className="absolute top-24 left-6 right-6 max-w-4xl mx-auto z-40 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:text-tealbrand-600 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Platform Home</span>
            </Link>

            {/* Protocol Switcher Pills */}
            <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200/90 shadow-md font-mono text-[10px] font-bold">
              <Link
                to="/privacy"
                className="px-3.5 py-1.5 rounded-full bg-tealbrand-600 text-white shadow-sm transition-all"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-tealbrand-600 transition-all"
              >
                Terms
              </Link>
              <Link
                to="/security"
                className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-tealbrand-600 transition-all"
              >
                Security
              </Link>
            </div>
          </div>

          {/* 4 Pinned Beats with High-Contrast Text */}
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
            {beats.map((beat, idx) => (
              <div
                key={idx}
                ref={(el) => (beatElsRef.current[idx] = el)}
                className="flex flex-col items-center absolute text-center px-6 max-w-3xl"
                style={{ opacity: 0 }}
              >
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-tealbrand-500/30 mb-4 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600 animate-ping"></span>
                  <span className="text-[11px] uppercase tracking-[0.25rem] text-tealbrand-800 font-extrabold font-mono">
                    {beat.label}
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6"
                  style={{
                    filter: 'drop-shadow(0 4px 16px rgba(255, 255, 255, 1.0))',
                  }}
                >
                  {beat.title}
                </h1>

                <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/90 shadow-xl max-w-xl">
                  <p className="text-xs sm:text-sm font-mono text-slate-900 font-bold leading-relaxed uppercase tracking-wider">
                    {beat.p}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Track */}
          <div className="absolute left-8 bottom-12 z-45 flex items-center gap-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/30 shadow-lg">
            <div className="w-40 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div ref={tlFillRef} className="h-full bg-tealbrand-600" style={{ width: '0%' }} />
            </div>
            <span className="font-mono text-xs font-bold text-slate-900">Privacy Governance</span>
          </div>
        </div>
      </section>

      {/* Interactive Quantum Governance Terminal & Accordion Deck */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-12">
        {/* Terminal Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <Terminal className="w-4 h-4 text-tealbrand-600" />
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              QUANTUM GOVERNANCE TERMINAL // PRIVACY SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Data Governance & Privacy Framework
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
            Interactive Technical Specification Deck — Πsparrow Software Solutions
          </p>
        </div>

        {/* Live Governance Metric Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Encryption Protocol
            </span>
            <span className="font-mono text-sm font-bold text-tealbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>AES-256 GCM</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-emerald-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Model Isolation
            </span>
            <span className="font-mono text-sm font-bold text-emerald-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>100% Private</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-cyanbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              GDPR Sovereignty
            </span>
            <span className="font-mono text-sm font-bold text-cyanbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyanbrand-600 animate-ping"></span>
              <span>1-Click Purge</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Retention Policy
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>30-Day Auto</span>
            </span>
          </div>
        </div>

        {/* Real-Time Clause Search & Filter Bar */}
        <div className="nature-glass rounded-2xl p-4 border border-slate-200 bg-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search privacy clauses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/10"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto py-1 font-mono text-[10px] font-bold">
            {['ALL', 'ENCRYPTION', 'AI-ISOLATION', 'GDPR-CCPA', 'TELEMETRY', 'DATA-PURGE'].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  activeFilter === tag
                    ? 'bg-tealbrand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Expandable Policy Accordion Cards */}
        <div className="space-y-4">
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            const isOpen = expandedSection === sec.id;

            return (
              <div
                key={sec.id}
                className={`nature-glass rounded-2xl border transition-all duration-300 bg-white overflow-hidden ${
                  isOpen ? 'border-tealbrand-500/50 shadow-xl' : 'border-slate-200/80 shadow-md hover:border-tealbrand-500/30'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedSection(isOpen ? null : sec.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-tealbrand-600 text-white shadow-md' : 'bg-tealbrand-500/10 text-tealbrand-600 border border-tealbrand-500/20'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-[9px] font-bold text-tealbrand-700 uppercase tracking-widest">
                          #{sec.tag}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[9px] font-bold uppercase">
                          {sec.badge}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold font-mono text-slate-900">
                        {sec.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-tealbrand-50 text-tealbrand-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Accordion Content Body */}
                {isOpen && (
                  <div className="px-6 md:px-8 pb-8 pt-2 border-t border-slate-100 space-y-6 animate-fadeIn">
                    <p className="text-slate-700 text-sm leading-relaxed font-sans">
                      {sec.summary}
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Technical Execution Standards:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sec.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-700 flex items-start space-x-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
