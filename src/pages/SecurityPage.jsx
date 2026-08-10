import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Server, Cpu, AlertTriangle, RefreshCw, ChevronDown, Search, CheckCircle2, Terminal } from 'lucide-react';
import ParticleSwarm3D from '../components/ParticleSwarm3D';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SecurityPage() {
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
      label: 'ISOLATED SANDBOXES',
      title: 'Isolated Tenant Sandboxes',
      p: 'Every SaaS platform instance and AI swarm operates within a dedicated isolated container with strict memory boundaries.',
      s: 0.0,
      e: 0.25,
    },
    {
      label: 'IMMUTABLE AUDIT LOGGING',
      title: 'Immutable Audit Logging',
      p: 'All data mutations, permission changes, and model inferences generate real-time cryptographic audit logs for total transparency.',
      s: 0.26,
      e: 0.5,
    },
    {
      label: '256-BIT HSM VAULT',
      title: '256-Bit HSM Vault',
      p: 'API keys, database credentials, and fine-tuned weights are locked behind Hardware Security Modules with automated rotation.',
      s: 0.51,
      e: 0.75,
    },
    {
      label: '24/7 THREAT TELEMETRY',
      title: '24/7 Threat Telemetry',
      p: 'Real-time automated DDoS defense, vulnerability scanning, and anomaly detection swarms monitor every request line continuously.',
      s: 0.76,
      e: 1.0,
    },
  ];

  const sections = [
    {
      id: 0,
      tag: 'SANDBOX-ISOLATION',
      icon: ShieldCheck,
      title: '1. Multi-Tenant Container Sandbox Isolation',
      badge: 'Isolated Containers',
      summary: 'Every SaaS platform instance (HRMS, CRM, CMS, LMS, PlaySchool) and AI agent process operates inside a virtualized sandbox container with dedicated memory allocation.',
      details: [
        'Dedicated container memory namespaces and compute quota limits.',
        'Schema-level database separation with zero cross-tenant query visibility.',
        'Strict Role-Based Access Control (RBAC) policy enforcement.',
        'Automated container teardown and ephemeral state zeroing.',
      ],
    },
    {
      id: 1,
      tag: 'HSM-VAULT',
      icon: Lock,
      title: '2. 256-Bit HSM Key Management & Vault Protection',
      badge: 'FIPS 140-2 Level 3',
      summary: 'Secrets, database connection strings, and fine-tuned AI model weights are sealed within FIPS 140-2 Level 3 certified Hardware Security Modules (HSM).',
      details: [
        'AES-256 GCM master key envelope encryption.',
        'Automated 90-day key rotation with hardware-enforced access controls.',
        'Client-controlled KMS key integrations for hybrid cloud deployments.',
        'Instant emergency key revocation triggers.',
      ],
    },
    {
      id: 2,
      tag: 'IMMUTABLE-AUDIT',
      icon: Server,
      title: '3. Cryptographically Signed Immutable Audit Ledgers',
      badge: 'Hash-Chain Logging',
      summary: 'All system mutations, permission configuration changes, and model inference executions generate cryptographically signed audit logs.',
      details: [
        'SHA-256 hash-chained audit log structures for tamper resistance.',
        'Real-time automated SIEM telemetry stream integration.',
        'Immutable event history for compliance forensic reviews.',
      ],
    },
    {
      id: 3,
      tag: 'THREAT-TELEMETRY',
      icon: AlertTriangle,
      title: '4. Real-Time Automated DDoS & Threat Telemetry',
      badge: '< 5ms Edge Mitigation',
      summary: 'Perimeter firewalls and edge clusters utilize continuous automated rate limiting and AI threat detection swarms to block malicious requests instantly.',
      details: [
        'Sub-5 millisecond automated edge rate-limiting and DDoS mitigation.',
        'Automated Web Application Firewall (WAF) SQLi and XSS filtering.',
        'Anomaly detection swarms analyzing request telemetry 24/7.',
      ],
    },
    {
      id: 4,
      tag: 'SOC-2-AUDIT',
      icon: Cpu,
      title: '5. SOC-2 Alignment & Penetration Testing Protocols',
      badge: 'Quarterly Audits',
      summary: 'Independent third-party security auditors conduct quarterly penetration testing and vulnerability assessments across our infrastructure.',
      details: [
        'SOC-2 Type II control alignment across security, availability, and confidentiality.',
        'Quarterly external penetration testing and grey-box vulnerability scans.',
        'Continuous automated dependency and vulnerability scanning.',
      ],
    },
    {
      id: 5,
      tag: 'DISASTER-RECOVERY',
      icon: RefreshCw,
      title: '6. Incident Response & Disaster Recovery Infrastructure',
      badge: 'RPO < 15m / RTO < 1h',
      summary: 'Automated database snapshot backups are replicated across geo-redundant storage clusters every 15 minutes with guaranteed recovery metrics.',
      details: [
        '15-minute geo-redundant encrypted snapshot backup replication.',
        'Recovery Point Objective (RPO) guaranteed under 15 minutes.',
        'Recovery Time Objective (RTO) guaranteed under 1 hour.',
        'Automated failover routing across multi-region edge mesh clusters.',
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
                className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-tealbrand-600 transition-all"
              >
                Terms
              </Link>
              <Link
                to="/security"
                className="px-3.5 py-1.5 rounded-full bg-tealbrand-600 text-white shadow-sm transition-all"
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
            <span className="font-mono text-xs font-bold text-slate-900">Security Architecture</span>
          </div>
        </div>
      </section>

      {/* Interactive Quantum Governance Terminal & Accordion Deck */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
            <Terminal className="w-4 h-4 text-tealbrand-600" />
            <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
              QUANTUM GOVERNANCE TERMINAL // ZERO-TRUST DEFENSE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Security & Defense Architecture
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
            Interactive Zero-Trust Specifications — Πsparrow Software Solutions
          </p>
        </div>

        {/* Live Governance Metric Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              HSM Cryptography
            </span>
            <span className="font-mono text-sm font-bold text-tealbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>FIPS 140-2 Level 3</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-emerald-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Threat Mitigation
            </span>
            <span className="font-mono text-sm font-bold text-emerald-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>&lt; 5ms Response</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-cyanbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Backup Replication
            </span>
            <span className="font-mono text-sm font-bold text-cyanbrand-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyanbrand-600 animate-ping"></span>
              <span>15m Snapshots</span>
            </span>
          </div>

          <div className="nature-glass rounded-xl p-4 border border-tealbrand-500/20 bg-white shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Audit Compliance
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              <span>SOC-2 Aligned</span>
            </span>
          </div>
        </div>

        {/* Real-Time Clause Search & Filter Bar */}
        <div className="nature-glass rounded-2xl p-4 border border-slate-200 bg-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search security specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-tealbrand-600 focus:ring-2 focus:ring-tealbrand-500/10"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto py-1 font-mono text-[10px] font-bold">
            {['ALL', 'SANDBOX-ISOLATION', 'HSM-VAULT', 'IMMUTABLE-AUDIT', 'THREAT-TELEMETRY', 'SOC-2-AUDIT', 'DISASTER-RECOVERY'].map((tag) => (
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
                        Security Implementation Parameters:
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
