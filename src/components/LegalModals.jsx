import React from 'react';
import { X, ShieldCheck, FileText, Lock, Check } from 'lucide-react';

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-tealbrand-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 font-sans">
        {/* Corner Brackets */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-tealbrand-500/60 pointer-events-none"></span>
        <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-tealbrand-500/60 pointer-events-none"></span>
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-tealbrand-500/60 pointer-events-none"></span>
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-tealbrand-500/60 pointer-events-none"></span>

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 flex items-center justify-center text-tealbrand-400">
              {activeModal === 'privacy' && <Lock className="w-5 h-5" />}
              {activeModal === 'terms' && <FileText className="w-5 h-5" />}
              {activeModal === 'security' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                {activeModal === 'privacy' && 'Privacy Protocol & Data Governance'}
                {activeModal === 'terms' && 'Terms of Service & Architecture License'}
                {activeModal === 'security' && 'Zero-Trust Security & Compliance Policy'}
              </h3>
              <p className="font-mono text-[10px] text-tealbrand-400 font-bold uppercase tracking-widest">
                ΠSPARROW GOVERNANCE // V2.0.0
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
          {activeModal === 'privacy' && (
            <>
              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  1. Zero-Trust Data Encryption
                </h4>
                <p>
                  At Πsparrow Software Solutions, all data ingested across our agentic AI swarms and SaaS products (HRMS, CRM, CMS, LMS, PlaySchool) is encrypted at rest using 256-bit Hardware Security Modules (HSM) and in transit via TLS 1.3 zero-trust protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  2. AI Model Training Privacy
                </h4>
                <p>
                  Enterprise datasets provided for custom model fine-tuning are strictly isolated within your private tenant container. We never utilize client telemetry or domain modules to train public base models.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  3. Cookies & Telemetry Policy
                </h4>
                <p>
                  We utilize minimal essential telemetry cookies to maintain session authenticity, load balance edge clusters, and optimize render performance. You can customize cookie preferences at any time using our floating control bar.
                </p>
              </section>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  1. Platform Usage & License
                </h4>
                <p>
                  By accessing Πsparrow Software Solutions or deploying our SaaS products, you agree to comply with our modular system guidelines. All software, UI/UX design systems, and agentic workflows remain the intellectual property of Πsparrow.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  2. Service Level Agreement (SLA)
                </h4>
                <p>
                  Our multi-region edge clusters maintain a 99.99% operational uptime commitment. Scheduled maintenance is broadcast via system telemetry logs 48 hours prior to execution.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  3. Acceptable AI Agent Use
                </h4>
                <p>
                  Autonomous agentic AI swarms must not be deployed for malicious automated attacks, unauthorized data scraping, or activities violating international computing compliance laws.
                </p>
              </section>
            </>
          )}

          {activeModal === 'security' && (
            <>
              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  1. Multi-Tenant Infrastructure Isolation
                </h4>
                <p>
                  Every SaaS platform instance operates inside an isolated sandbox container with dedicated memory spaces, database registries, and role-based access control (RBAC).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-tealbrand-400 uppercase tracking-widest">
                  2. Automated Audit Timelines
                </h4>
                <p>
                  All mutations, security access events, and agent executions generate immutable audit timeline logs, allowing real-time inspection and regulatory reporting.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
            Status: Fully Compliant
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-tealbrand-600 hover:bg-tealbrand-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
