import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuantumPipelineVisualizer from './QuantumPipelineVisualizer';

gsap.registerPlugin(ScrollTrigger);

export default function TelemetryBoard() {
  const boardRef = useRef(null);
  const supportRef = useRef(null);
  const boardH2Ref = useRef(null);
  const supportH2Ref = useRef(null);

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  // GSAP Watermark Parallax Drifts + Live Counter Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (boardH2Ref.current) {
        gsap.to(boardH2Ref.current, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: boardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (supportH2Ref.current) {
        gsap.to(supportH2Ref.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: supportRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Live Animated Telemetry Counters
      const obj = { c1: 0, c2: 0 };
      gsap.to(obj, {
        c1: 99.99,
        c2: 128,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: boardRef.current,
          start: 'top 75%',
        },
        onUpdate: () => {
          setCounter1(obj.c1);
          setCounter2(Math.floor(obj.c2));
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* #noema-board section in Pristine Light Theme */}
      <section
        ref={boardRef}
        id="noema-board"
        className="relative min-h-screen overflow-hidden py-28 px-6 flex items-center font-sans bg-slate-50 border-t border-slate-200/80"
      >
        {/* Giant Watermark Text matching Ref/generated-page.html line 353 */}
        <h2
          ref={boardH2Ref}
          className="absolute z-0 font-extrabold tracking-tighter whitespace-nowrap left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200/70 pointer-events-none select-none"
          style={{ fontSize: 'clamp(8rem, 28vw, 30rem)', lineHeight: 0.78 }}
        >
          MODELS
        </h2>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="min-h-[180px] border border-tealbrand-500/20 bg-white text-slate-900 p-6 flex flex-col justify-between rounded-2xl shadow-lg hover:-translate-y-1.5 transition-all duration-300 nature-glass">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-tealbrand-700 font-mono font-bold">
                  Deployment Uptime
                </p>
                <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              </div>
              <h3 className="font-extrabold text-3xl leading-tight mt-3 font-mono text-slate-900">
                {counter1.toFixed(2)}%
              </h3>
            </div>
            <div className="flex items-end justify-between text-xs text-slate-500 font-mono">
              <span>
                Global Cluster
                <br />
                Multi-Region Active
              </span>
            </div>
          </article>

          <article className="min-h-[180px] border border-emerald-500/20 bg-white text-slate-900 p-6 flex flex-col justify-between rounded-2xl shadow-lg hover:-translate-y-1.5 transition-all duration-300 nature-glass">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-mono font-bold">
                  Neural Latency
                </p>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              </div>
              <h3 className="font-extrabold text-3xl leading-tight mt-3 font-mono text-slate-900">
                12ms Ping
              </h3>
            </div>
            <div className="flex items-end justify-between text-xs text-slate-500 font-mono">
              <span>
                EU & US Edge
                <br />
                Zero-Lag Swarms
              </span>
            </div>
          </article>

          <article className="min-h-[180px] border border-cyanbrand-500/20 bg-white text-slate-900 p-6 flex flex-col justify-between rounded-2xl shadow-lg hover:-translate-y-1.5 transition-all duration-300 nature-glass">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-cyanbrand-700 font-mono font-bold">
                  Model Epochs
                </p>
                <span className="w-2 h-2 rounded-full bg-cyanbrand-600 animate-ping"></span>
              </div>
              <h3 className="font-extrabold text-3xl leading-tight mt-3 font-mono text-slate-900">
                Epoch {counter2}
              </h3>
            </div>
            <div className="flex items-end justify-between text-xs text-slate-500 font-mono">
              <span>
                Domain Training
                <br />
                Continuous Stream
              </span>
            </div>
          </article>

          <article className="min-h-[180px] border border-tealbrand-500/30 bg-gradient-to-br from-tealbrand-50 to-emerald-50 text-slate-900 p-6 flex flex-col justify-between rounded-2xl shadow-lg hover:-translate-y-1.5 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-tealbrand-800 font-mono font-bold">
                  Zero-Trust Shield
                </p>
                <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
              </div>
              <h3 className="font-extrabold text-3xl leading-tight mt-3 font-mono text-slate-900">
                256-Bit HSM
              </h3>
            </div>
            <div className="flex items-end justify-between text-xs text-tealbrand-800 font-mono font-medium">
              <span>
                Hardware Protected
                <br />
                Encrypted Vault
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* #noema-support section featuring Quantum Pipeline Visualizer */}
      <section
        ref={supportRef}
        id="noema-support"
        className="relative min-h-screen bg-white text-slate-900 overflow-hidden px-6 flex items-center font-sans py-28 border-t border-slate-200/80"
      >
        {/* Giant Watermark Text matching Ref/generated-page.html line 436 */}
        <h2
          ref={supportH2Ref}
          className="absolute z-0 text-slate-200/70 font-extrabold tracking-tighter whitespace-nowrap left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ fontSize: 'clamp(8rem, 28vw, 30rem)', lineHeight: 0.78 }}
        >
          SCALE
        </h2>

        <div className="relative z-10 w-full">
          <QuantumPipelineVisualizer />
        </div>
      </section>
    </>
  );
}
