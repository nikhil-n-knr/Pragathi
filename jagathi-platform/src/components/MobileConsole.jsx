'use client';

import React, { useEffect, useState } from 'react';

export default function MobileConsole() {
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileDebug, setIsMobileDebug] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if ?debug=1 or ?debug=true is present in URL
    const params = new URLSearchParams(window.location.search);
    const hasDebugParam = params.get('debug') === '1' || params.get('debug') === 'true' || localStorage.getItem('jagathi_debug') === '1';

    if (hasDebugParam) {
      setIsMobileDebug(true);
      // Load Eruda full mobile DevTools console from CDN
      if (!window.eruda) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        script.async = true;
        script.onload = () => {
          if (window.eruda) {
            window.eruda.init();
          }
        };
        document.body.appendChild(script);
      }
    }

    // Capture all uncaught JS errors on mobile/desktop
    const handleGlobalError = (event) => {
      const errorMsg = event.error ? event.error.stack || event.error.message : event.message;
      const fileInfo = `${event.filename || ''}:${event.lineno || ''}:${event.colno || ''}`;
      setErrors((prev) => [
        { type: 'error', message: event.message, stack: errorMsg, file: fileInfo, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19)
      ]);
    };

    // Capture unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      const reason = event.reason ? (event.reason.stack || event.reason.message || String(event.reason)) : 'Unhandled Promise Rejection';
      setErrors((prev) => [
        { type: 'promise', message: 'Unhandled Rejection', stack: reason, file: 'Async/Promise', time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19)
      ]);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[999999] font-mono text-xs select-none">
      {/* Floating Error Badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white font-bold px-3 py-2 rounded-full shadow-2xl flex items-center gap-2 text-[11px] uppercase tracking-wider animate-pulse border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          ⚠️ {errors.length} Mobile Log{errors.length > 1 ? 's' : ''}
        </button>
      )}

      {/* On-Screen Mobile Debug Drawer */}
      {isOpen && (
        <div className="bg-[#121315]/95 backdrop-blur-md text-white border border-white/10 rounded-xl p-4 w-[90vw] max-w-[420px] max-h-[60vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
            <span className="font-bold text-yellow-400 uppercase tracking-widest text-[11px]">
              📱 Mobile Dev Console ({errors.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setErrors([])}
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-gray-300"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[12px] text-gray-400 hover:text-white px-2"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {errors.map((err, i) => (
              <div key={i} className="bg-black/60 rounded p-2 border border-red-500/30 text-[11px]">
                <div className="flex justify-between text-[9px] text-red-400 font-semibold mb-1">
                  <span>[{err.type.toUpperCase()}] {err.time}</span>
                  <span className="truncate max-w-[180px]">{err.file}</span>
                </div>
                <div className="text-white font-bold text-[11px] mb-1">{err.message}</div>
                {err.stack && (
                  <pre className="text-[9px] text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-[100px] opacity-80 leading-relaxed bg-black/40 p-1 rounded">
                    {err.stack}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-gray-400 text-center">
            Tip: Add <code className="text-yellow-400">?debug=1</code> to URL to load full Eruda Inspector
          </div>
        </div>
      )}
    </div>
  );
}
