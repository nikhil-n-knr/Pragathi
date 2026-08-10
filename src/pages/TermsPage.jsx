import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Cpu, Award, CreditCard, ShieldAlert, ChevronDown, Search, CheckCircle2, Terminal } from 'lucide-react';
import ParticleSwarm3D from '../components/ParticleSwarm3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  const sectionRef = useRef(null);
  const lbTopRef = useRef(null);
  const lbBotRef = useRef(null);
  const tlFillRef = useRef(null);
  const beatElsRef = useRef([]);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedSection, setExpandedSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const beats = [
    {
      label: 'ARCHITECTURE LICENSING',
      title: 'Architecture Licensing',
      p: 'All custom software products, UI/UX design systems, and agentic workflows built by Πsparrow are licensed for enterprise scalability under dedicated agreement terms.',
      s: 0.0,
      e: 0.25,
    },
    {
      label: '99.99% SLA COMMITMENT',
      title: '99.99% SLA Commitment',
      p: 'Our global multi-region edge mesh maintains a guaranteed 99.99% operational uptime. Automated status telemetry is publicly auditable in real time.',
      s: 0.26,
      e: 0.5,
    },
    {
      label: 'SWARM GOVERNANCE',
      title: 'Swarm Governance Rules',
      p: 'Autonomous AI swarms must operate within certified ethics guidelines and rate boundaries. Misuse or unthrottled scraping triggers automated container isolation.',
      s: 0.51,
      e: 0.75,
    },
    {
      label: 'TURNKEY SAAS SUPPORT',
      title: 'Turnkey SaaS Support',
      p: 'Full maintenance, automatic security patches, and database migrations are provided continuously for HRMS, CRM, CMS, LMS, and PlaySchool platforms.',
      s: 0.76,
      e: 1.0,
    },
  ];

  const sections = [
    {
      id: 0,
      tag: 'LICENSING',
      icon: FileText,
      title: '1. Enterprise Software & Architecture Licensing',
      badge: 'Dedicated Tenant Scope',
      summary: 'All software products, full-stack portals, custom UI/UX design systems, and agentic workflows developed by Πsparrow are provided under enterprise non-exclusive or dedicated architecture license terms.',
      details: [
        'Full operational license for enterprise deployment across authorized tenant instances.',
        'Dedicated intellectual property rights granted for custom workflow modules.',
        'Source code & design system token handovers available under enterprise tier plans.',
        'No per-user hidden surcharge: Transparent tier-based capacity limits.',
      ],
    },
    {
      id: 1,
      tag: 'SLA-UPTIME',
      icon: Scale,
      title: '2. 99.99% Service Level Agreement (SLA) & Uptime Guarantee',
      badge: '99.99% Multi-Region SLA',
      summary: 'Πsparrow guarantees a 99.99% operational availability SLA for hosted multi-region SaaS instances (HRMS, CRM, CMS, LMS, PlaySchool Safety).',
      details: [
        'Multi-region edge cluster redundancy with automated sub-second failover.',
        '48-hour prior notice for scheduled system maintenance windows.',
        'Automated SLA credit compensations credited directly to subsequent billing invoices.',
        'Public real-time status telemetry dashboard accessible 24/7.',
      ],
    },
    {
      id: 2,
      tag: 'AI-SWARM-RULES',
      icon: Cpu,
      title: '3. AI Swarm & Autonomous Agent Governance Rules',
      badge: 'Ethical Swarm Boundaries',
      summary: 'Users deploying autonomous AI swarms must comply with ethical computing boundaries and rate limits. Misuse triggers automated container sandbox isolation.',
      details: [
        'Prohibition of malicious prompt injection, unthrottled scraping, or DDoS scripts.',
        'Enforced rate-limiting boundaries per swarm worker to protect shared cluster stability.',
        'Automated container isolation and administrative notifications upon protocol breaches.',
      ],
    },
    {
      id: 3,
      tag: 'SAAS-SUPPORT',
      icon: Award,
      title: '4. Turnkey SaaS Suite Licensing & Continuous Maintenance',
      badge: 'Continuous Upgrades',
      summary: 'Our flagship SaaS suites (HRMS, CRM, CMS, LMS, PlaySchool Safety, VisualFrog Engine) include continuous platform updates and database migrations under active subscriptions.',
      details: [
        'Zero-downtime rolling database schema migrations.',
        'Automated weekly security patch deployment.',
        '24/7 priority developer support with guaranteed 1-hour ticket response SLAs.',
      ],
    },
    {
      id: 4,
      tag: 'BILLING-TERMS',
      icon: CreditCard,
      title: '5. Subscription Billing, Upgrades & Lifecycle Terms',
      badge: 'Transparent Billing',
      summary: 'Enterprise subscriptions are billed on a monthly or annual cycle with zero hidden fees. Capacity upgrades take effect immediately.',
      details: [
        'Instant tier upgrades with prorated billing adjustments.',
        '30-day notice for plan modifications or subscription cancellations.',
        'Zero cancellation penalty fee upon completion of initial agreement term.',
      ],
    },
    {
      id: 5,
      tag: 'LIABILITY-CAPS',
      icon: ShieldAlert,
      title: '6. Limitation of Liability & Dispute Resolution',
      badge: 'Enterprise Indemnification',
      summary: 'Πsparrow provides enterprise indemnification for core architecture deliverables. Liability is capped as specified in master order agreements.',
      details: [
        'Liability capped at total subscription fees paid during preceding 12-month period.',
        'Exclusion of indirect or consequential damages caused by third-party network failure.',
        'Disputes resolved through binding international commercial arbitration.',
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

            <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200/90 shadow-md font-mono text-[10px] font-bold">
              <Link
                to="/privacy"
                className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-tealbrand-600 transition-all"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="px-3.5 py-1.5 rounded-full bg-tealbrand-600 text-white shadow-sm transition-all"
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

          <div className="absolute left-8 bottom-12 z-45 flex items-center gap-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-tealbrand-500/30 shadow-lg">
            <div className="w-40 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div ref={tlFillRef} className="h-full bg-tealbrand-600" style={{ width: '0%' }} />
            </div>
            <span className="font-mono text-xs font-bold text-slate-900">Terms of Service</span>
          </div>
        </div>
      </section>

      {/* Interactive Quantum Governance Terminal & Accordion Deck */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <Terminal className="w-4 h-4 text-tealbrand-600" />
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              QUANTUM GOVERNANCE TERMINAL // SERVICE AGREEMENTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Terms of Service & Licensing Deck
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
            Interactive Master Agreement Specifications — Πsparrow Software Solutions
          </p>
        </div>

        {/* Live Governance Metric Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              SLA Commitment
            </span>
            <span className="font-mono text-sm font-bold text-tealbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>99.99% Uptime</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-emerald-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Maintenance Notice
            </span>
            <span className="font-mono text-sm font-bold text-emerald-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>48-Hour Advance</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-cyanbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Swarm Rate Limits
            </span>
            <span className="font-mono text-sm font-bold text-cyanbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyanbrand-600 animate-ping"></span>
              <span>Enforced Bounds</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Support Response
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>1-Hour Ticket SLA</span>
            </span>
          </div>
        </div>

        {/* Real-Time Clause Search & Filter Bar */}
        <div className="nature-glass rounded-2xl p-4 border border-slate-200 bg-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search service terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/10"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto py-1 font-mono text-[10px] font-bold">
            {['ALL', 'LICENSING', 'SLA-UPTIME', 'AI-SWARM-RULES', 'SAAS-SUPPORT', 'BILLING-TERMS', 'LIABILITY-CAPS'].map((tag) => (
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

                {isOpen && (
                  <div className="px-6 md:px-8 pb-8 pt-2 border-t border-slate-100 space-y-6 animate-fadeIn">
                    <p className="text-slate-700 text-sm leading-relaxed font-sans">
                      {sec.summary}
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Enterprise Agreement Provisions:
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
