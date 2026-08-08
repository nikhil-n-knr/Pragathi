import React from 'react';
import { X, ExternalLink, Check, ShieldCheck, Play, ArrowRight } from 'lucide-react';

export default function ProductDemoModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-tealbrand-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 font-sans">
        {/* Corner Markers */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-tealbrand-500/60 pointer-events-none"></span>
        <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-tealbrand-500/60 pointer-events-none"></span>

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 text-tealbrand-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              {product.badge}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              {product.version}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Copy */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {product.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Module Capabilities List */}
              <div className="space-y-2 pt-2">
                <p className="font-mono text-[10px] font-bold text-tealbrand-400 uppercase tracking-widest">
                  PLATFORM CORE CAPABILITIES
                </p>
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs font-mono text-slate-300">
                    <Check className="w-4 h-4 text-tealbrand-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Sandbox Link */}
              <div className="pt-4 flex items-center space-x-4">
                {product.link ? (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-tealbrand-600 hover:bg-tealbrand-700 text-white px-6 py-3 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
                  >
                    <span>Launch Live Engine</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="inline-flex items-center space-x-2 bg-tealbrand-600 hover:bg-tealbrand-700 text-white px-6 py-3 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
                  >
                    <span>Request Private Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Preview Image / Visual Container */}
            <div>
              {product.image ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                  <img
                    src={product.image}
                    alt={`${product.title} Dashboard Demo`}
                    className="w-full h-auto object-cover max-h-[380px]"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
                  <div className="w-16 h-16 rounded-2xl bg-tealbrand-500/10 border border-tealbrand-500/30 text-tealbrand-400 flex items-center justify-center mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-2">
                    VISUALFROG CONVERTER ENGINE
                  </h4>
                  <p className="font-mono text-xs text-slate-400 max-w-xs">
                    Client-side batch image transformation tool with ZIP folder structure preservation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
            Architecture Version: {product.version}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
