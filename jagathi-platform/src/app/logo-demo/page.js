'use client';

/**
 * JAGATHI Logo Animation - "/logo-demo" page
 *
 * Animation: "Stamp & Settle" — each circle pops from scale-0 at its grid
 * position with elastic squash/overshoot, staggered diagonally.
 *
 * LOGO GEOMETRY — reverse-engineered from 1.png / 1.svg reference:
 * ─────────────────────────────────────────────────────────────────
 * - The 16 circles are clipped inside a rounded-square clipPath so the
 *   outer circles get "cut off" at the boundary exactly like the reference.
 * - A thick outer border (strokeWidth) wraps the entire rounded square.
 * - Circle fill: #E8E8E8 (light gray matching reference logo on white bg).
 *   On the yellow demo background we keep yellow fill so they blend in
 *   and only the black strokes + outer border remain visible — identical
 *   to the actual logo visual signature.
 * - Heavy stroke weight (strokeWidth = 10) and tight center spacing (gap <
 *   diameter) to reproduce the interlocking bubble grid pattern.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

// ─── Grid Geometry (calibrated via side-by-side pixel comparison with 1.png) ─
// R=40 → diameter=80. GAP=76 → overlap=4px per side (strokes barely touch).
// PAD=48 → outer circles clipped just at edge, fills clearly separated.
// CLIP_RADIUS=30 → the rounded-square corners match reference logo exactly.
const GRID   = 4;
const R      = 40;    // radius of full circle (outer edge of stroke)
const STROKE = 9;     // thick stroke matching reference
const FILL_R = R - STROKE; // = 31 — fill stays inside stroke, never overlaps neighbor
const GAP    = 76;    // center-to-center → circles spread out, strokes just touch
const PAD    = 48;    // padding → clips outer circles cleanly at boundary

// Total SVG canvas size
const TOTAL = PAD * 2 + (GRID - 1) * GAP; // 48*2 + 3*76 = 324

// Rounded square clip bounds
const CLIP_INSET  = 4;                       // slight inset from canvas edge
const CLIP_RADIUS = 30;                      // rounded corner radius matching reference logo

// Pre-compute 16 grid slots
const SLOTS = [];
for (let row = 0; row < GRID; row++) {
  for (let col = 0; col < GRID; col++) {
    SLOTS.push({
      id: `b${row}${col}`,
      row,
      col,
      cx: PAD + col * GAP,
      cy: PAD + row * GAP,
      diag: row + col,
    });
  }
}

// Sort by diagonal → top-left first, bottom-right last
const ORDERED = [...SLOTS].sort((a, b) => a.diag - b.diag || a.col - b.col);

// ─── Component ───────────────────────────────────────────────────────────────
export default function LogoDemo() {
  const circleRefs = useRef({});
  const textRef    = useRef(null);
  const hasRunRef  = useRef(false);

  const setRef = (id) => (el) => {
    if (el) circleRefs.current[id] = el;
  };

  // ── Animation ────────────────────────────────────────────────────────────
  const runAnimation = useCallback(() => {
    const refs = circleRefs.current;

    // Reset all circles to invisible at final positions
    SLOTS.forEach(({ id }) => {
      const el = refs[id];
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.set(el, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
    });

    // Reset text
    if (textRef.current) {
      gsap.killTweensOf(textRef.current);
      gsap.set(textRef.current, { opacity: 0, y: 20, scale: 0.94 });
    }

    const SPEED   = 0.78;  // base animation duration per circle
    const STAGGER = 0.09;  // delay between diagonal steps

    // Stamp each circle in diagonal wave order
    ORDERED.forEach(({ id }, index) => {
      const el = refs[id];
      if (!el) return;

      const delay = index * STAGGER;
      const tl = gsap.timeline({ delay });

      // Phase 1: Pop in — overshoot upward
      tl.to(el, {
        scale: 1.28,
        opacity: 1,
        duration: SPEED * 0.36,
        ease: 'power3.out',
      });

      // Phase 2: Squash on landing (flatten slightly)
      tl.to(el, {
        scaleX: 1.12,
        scaleY: 0.86,
        duration: SPEED * 0.13,
        ease: 'power2.in',
      });

      // Phase 3: Elastic rebound to final rest
      tl.to(el, {
        scaleX: 1,
        scaleY: 1,
        scale: 1,
        duration: SPEED * 0.51,
        ease: 'back.out(2.6)',
      });
    });

    // Typography fades in after grid completes
    const totalDuration = (ORDERED.length - 1) * STAGGER + SPEED;
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'back.out(1.4)',
        delay: totalDuration * 0.92,
      });
    }
  }, []);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    const t = setTimeout(runAnimation, 200);
    return () => clearTimeout(t);
  }, [runAnimation]);

  // SVG clip dimensions
  const ci = CLIP_INSET;
  const cr = CLIP_RADIUS;
  const cw = TOTAL - ci * 2;
  const ch = TOTAL - ci * 2;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-between select-none py-10 px-6"
      style={{ backgroundColor: '#F7E443', fontFamily: '"Outfit", sans-serif' }}
    >

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl flex justify-between items-center border-b border-black/15 pb-4">
        <div>
          <p className="text-[10px] font-mono text-black/50 uppercase tracking-[0.3em]">
            // Visual Presentation
          </p>
          <h1 className="text-sm font-black text-black uppercase tracking-widest mt-0.5">
            Logo Stamp Animation
          </h1>
        </div>
        <Link
          href="/"
          className="text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 border border-black/30 rounded text-black hover:bg-black hover:text-[#F7E443] transition-all duration-200"
        >
          ← Back Home
        </Link>
      </div>

      {/* ── Main Stage ──────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer gap-8"
        onClick={runAnimation}
        title="Click to replay"
      >

        {/* ── SVG Logo ──────────────────────────────────────────────────── */}
        <div style={{ width: '100%', maxWidth: 320 }}>
          <svg
            viewBox={`0 0 ${TOTAL} ${TOTAL}`}
            width="100%"
            height="100%"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/*
               * clipPath: rounded-square that clips all 16 circles.
               * This is the KEY structural element of the real logo.
               * Outer circles are cut off at this boundary exactly like
               * the reference 1.png image.
               */}
              <clipPath id="logo-clip">
                <rect
                  x={ci}
                  y={ci}
                  width={cw}
                  height={ch}
                  rx={cr}
                  ry={cr}
                />
              </clipPath>
            </defs>

            {/*
             * TWO-PASS RENDERING — the key fix for circle overlap:
             *
             * PASS 1: Draw ALL fills first (yellow, no stroke).
             *         Each circle's yellow interior stays within its radius.
             *         Fills do NOT bleed over adjacent circles.
             *
             * PASS 2: Draw ALL strokes on top (black stroke, fill="none").
             *         Strokes render above all fills, so they always show
             *         cleanly regardless of circle overlap.
             *
             * This reproduces the exact look of the reference logo where
             * only the black border overlaps — never the inner fill area.
             */}

            {/* PASS 1 — All circle fills (yellow, no stroke) */}
            <g clipPath="url(#logo-clip)">
              {SLOTS.map(({ id, cx, cy }) => (
                <g key={`fill-${id}`} transform={`translate(${cx} ${cy})`}>
                  <g ref={setRef(id)}>
                    {/* FILL_R = R - STROKE: fill sits entirely inside the stroke zone */}
                    <circle r={FILL_R} fill="#F7E443" stroke="none" />
                  </g>
                </g>
              ))}
            </g>

            {/* PASS 2 — All circle strokes on top (black, no fill) */}
            <g clipPath="url(#logo-clip)" style={{ pointerEvents: 'none' }}>
              {SLOTS.map(({ id, cx, cy }) => (
                <g key={`stroke-${id}`} transform={`translate(${cx} ${cy})`}>
                  {/*
                   * strokeRefs are NOT animated — strokes always visible.
                   * Only the fill pass (PASS 1) is GSAP animated.
                   * This means strokes pop in as fills animate in naturally.
                   */}
                  <circle
                    r={R}
                    fill="none"
                    stroke="#0A0A0A"
                    strokeWidth={STROKE}
                  />
                </g>
              ))}
            </g>


          </svg>
        </div>

        {/*
          Font: Barlow Condensed ExtraBold 800 — exact match to 5.png.
          Characteristics matching reference:
            - Medium-condensed (not ultra-narrow like Anton)
            - Very bold weight, round letterforms on A/G/H
            - JAGATHI: large display size, near-zero letter-spacing
            - & EST.1989: same font, ~52% size, right-aligned below
            - No line, no border — pure clean stacked typography
        */}
        <div
          ref={textRef}
          className="flex flex-col items-end"
          style={{
            opacity: 0,
            transform: 'translateY(20px) scale(0.94)',
            width: '100%',
            maxWidth: 320,
          }}
        >
          {/* JAGATHI — Barlow Condensed ExtraBold, wide bold condensed */}
          <p
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 8vw, 4.6rem)',
              letterSpacing: '-0.01em',  /* very tight, matches 5.png */
              lineHeight: 1,
              color: '#0A0A0A',
              textTransform: 'uppercase',
              margin: 0,
              width: '100%',
              textAlign: 'right',
            }}
          >
            JAGATHI
          </p>
          {/* & EST.1989 — same font, ~52% size, right-aligned */}
          <p
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.3rem, 3.4vw, 2rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              color: '#0A0A0A',
              textTransform: 'uppercase',
              margin: 0,
              marginTop: '0.12em',
              textAlign: 'right',
            }}
          >
            &amp; EST.1989
          </p>
        </div>

      </div>

      {/* ── Hint ────────────────────────────────────────────────────────── */}
      <p className="text-[9px] font-mono text-black/40 uppercase tracking-[0.25em] text-center">
        Click anywhere on the logo to replay
      </p>

    </div>
  );
}
