'use client';

// Fixed constants — MUST match logo-demo/page.js exactly
const GRID   = 4;
const R      = 40;
const STROKE = 9;
const GAP    = 64;
const PAD    = 56;
const TOTAL  = PAD * 2 + (GRID - 1) * GAP; // 304
const ci = 4, cr = 30;
const cw = TOTAL - ci * 2, ch = TOTAL - ci * 2;

const SLOTS = [];
for (let row = 0; row < GRID; row++)
  for (let col = 0; col < GRID; col++)
    SLOTS.push({ id: `${row}${col}`, cx: PAD + col * GAP, cy: PAD + row * GAP });

export default function Compare() {
  return (
    <div style={{ background: '#F7E443', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, padding: 40 }}>
      <h1 style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 5, textTransform: 'uppercase', color: '#000', margin: 0 }}>Side-by-side comparison</h1>
      <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* Actual logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 4, color: '#000', margin: 0 }}>ACTUAL LOGO (1.png)</p>
          <img src="/assets/branding/logo.webp" style={{ width: 280, height: 280, objectFit: 'contain', border: '1px solid rgba(0,0,0,0.15)' }} alt="actual logo" />
        </div>

        {/* Animated version — static render */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 4, color: '#000', margin: 0 }}>ANIMATED VERSION</p>
          <div style={{ width: 280, height: 280, border: '1px solid rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7E443' }}>
            <svg viewBox={`0 0 ${TOTAL} ${TOTAL}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="cmp-clip">
                  <rect x={ci} y={ci} width={cw} height={ch} rx={cr} ry={cr} />
                </clipPath>
              </defs>
              <g clipPath="url(#cmp-clip)">
                {SLOTS.map(({ id, cx, cy }) => (
                  <g key={id} transform={`translate(${cx} ${cy})`}>
                    <circle r={R} fill="#F7E443" stroke="#0A0A0A" strokeWidth={STROKE} />
                  </g>
                ))}
              </g>
              <rect x={ci} y={ci} width={cw} height={ch} rx={cr} ry={cr} fill="none" stroke="#0A0A0A" strokeWidth={STROKE} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
