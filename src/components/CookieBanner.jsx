import React, { useState, useEffect } from 'react';
import { Cookie, Check, X, ShieldAlert } from 'lucide-react';

export default function CookieBanner({ onOpenPrivacy }) {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    telemetry: true,
    aiPersonalization: true,
  });

  useEffect(() => {
    const accepted = localStorage.getItem('pisparrow_cookie_consent');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('pisparrow_cookie_consent', 'all');
    setVisible(false);
  };

  const handleDeclineOptional = () => {
    localStorage.setItem('pisparrow_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 animate-bounce-in">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-tealbrand-500/30 rounded-2xl p-5 shadow-2xl text-slate-200 font-sans relative overflow-hidden">
        {/* Corner Markers */}
        <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-tealbrand-500/50"></span>
        <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-tealbrand-500/50"></span>

        <div className="flex items-start space-x-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-tealbrand-500/10 border border-tealbrand-500/30 flex items-center justify-center text-tealbrand-400 flex-shrink-0">
            <Cookie className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Bioluminescent Telemetry & Cookies
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              We use minimal quantum cookies to optimize edge swarm routing and neural render performance.
            </p>
          </div>
        </div>

        {/* Toggle Ticker Summary */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Check className="w-3 h-3 text-tealbrand-400" />
            <span>Essential</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Telemetry</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3 h-3 text-cyanbrand-400" />
            <span>AI Swarms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-tealbrand-600 hover:bg-tealbrand-700 text-white font-mono text-xs font-bold py-2 rounded-md uppercase tracking-wider transition-colors shadow-md text-center"
          >
            Accept Swarms
          </button>

          <button
            onClick={handleDeclineOptional}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold py-2 px-3 rounded-md uppercase tracking-wider transition-colors"
          >
            Essential Only
          </button>

          <button
            onClick={() => setVisible(false)}
            className="p-2 text-slate-500 hover:text-white"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
