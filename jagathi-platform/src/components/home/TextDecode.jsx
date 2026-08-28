'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const GLYPHS = '█▓▒░ABCDEFGHIKLMNOPRSTUVXZ0123456789°./—';

export default function TextDecode({ text, className = '', duration = 0.9 }) {
  const elRef = useRef(null);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const el = elRef.current;
    if (!el) return;

    const state = { p: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          p: 1,
          duration,
          ease: 'none',
          onUpdate() {
            const reveal = Math.floor(state.p * text.length);
            let out = '';
            for (let i = 0; i < text.length; i++) {
              const ch = text[i];
              if (ch === ' ' || i < reveal) {
                out += ch;
              } else {
                out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
              }
            }
            setDisplayText(out);
          },
          onComplete() {
            setDisplayText(text);
          },
        });
      },
    });

    return () => trigger.kill();
  }, [text, duration]);

  return (
    <span ref={elRef} className={`font-mono ${className}`}>
      {displayText}
    </span>
  );
}
