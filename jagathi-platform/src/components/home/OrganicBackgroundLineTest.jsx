'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function OrganicBackgroundLineTest() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pathData, setPathData] = useState({ d: '', totalLength: 0, arcLengths: [] });

  // 1. Measure container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // 2. Generate single continuous unbroken mathematical path
  useEffect(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const loopSpacingPx = 500; // Moderately spaced organic loops
    const totalLoops = Math.max(3, Math.floor(height / loopSpacingPx));
    const omega = totalLoops * Math.PI * 2;
    const maxRadius = Math.min(width * 0.22, 240);

    const numSegments = Math.max(2000, totalLoops * 100);

    const getPos = (t) => {
      const yPixels = t * height;
      const entrancePx = Math.min(1000, height * 0.2);

      const startE = Math.sin(Math.min((yPixels / entrancePx) * (Math.PI / 2), Math.PI / 2));
      const endE = Math.sin(Math.min(((height - yPixels) / entrancePx) * (Math.PI / 2), Math.PI / 2));
      const envelope = startE * endE;

      let baseX;
      if (yPixels < entrancePx) {
        const localT = yPixels / entrancePx;
        const ease = Math.sin(localT * Math.PI / 2);
        baseX = (width * 0.5) * ease;
      } else if (yPixels > height - entrancePx) {
        const localT = (yPixels - (height - entrancePx)) / entrancePx;
        const ease = 1 - Math.cos(localT * Math.PI / 2);
        baseX = (width * 0.5) + (width * 0.5) * ease;
      } else {
        baseX = width * 0.5;
      }

      const wanderFreq = totalLoops / 2.5;
      const wander = Math.sin(t * Math.PI * 2 * wanderFreq) * (width * 0.28) * envelope;
      
      baseX += wander;

      const currentRadius = maxRadius * envelope;
      const angle = t * omega;

      const x = baseX + Math.cos(angle) * currentRadius;
      const y = yPixels + Math.sin(angle) * currentRadius;

      return { x, y };
    };

    let lastPos = getPos(0);
    let d = `M ${lastPos.x.toFixed(2)},${lastPos.y.toFixed(2)} `;
    const arcLengths = [0];
    let totalLength = 0;

    for (let i = 1; i <= numSegments; i++) {
      const t = i / numSegments;
      const pos = getPos(t);
      
      const dx = pos.x - lastPos.x;
      const dy = pos.y - lastPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      totalLength += dist;
      arcLengths.push(totalLength);
      
      d += `L ${pos.x.toFixed(2)},${pos.y.toFixed(2)} `;
      lastPos = pos;
    }

    setPathData({ d, totalLength, arcLengths });
  }, [dimensions]);

  // 3. Smooth single path pen stroke drawing driven by scroll
  useEffect(() => {
    if (pathData.totalLength === 0 || !pathRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const path = pathRef.current;
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const totalLen = pathData.totalLength;
    gsap.set(path, {
      strokeDasharray: totalLen,
      strokeDashoffset: totalLen
    });

    const trigger = ScrollTrigger.create({
      trigger: containerEl,
      start: 'top 70%',
      end: 'bottom 95%',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const numSegments = pathData.arcLengths.length - 1;
        const exactIndex = progress * numSegments;
        const i = Math.floor(exactIndex);
        
        let exactArcLength = 0;
        if (i >= numSegments) {
          exactArcLength = totalLen;
        } else if (i >= 0) {
          const fraction = exactIndex - i;
          exactArcLength = pathData.arcLengths[i] + (pathData.arcLengths[i + 1] - pathData.arcLengths[i]) * fraction;
        }
        
        const offset = totalLen - exactArcLength;
        path.style.strokeDashoffset = `${offset}px`;
      }
    });

    return () => {
      trigger.kill();
    };
  }, [pathData]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-20 md:opacity-30">
      {pathData.d && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            d={pathData.d}
            className="stroke-[8px] md:stroke-[24px]"
            fill="none"
            stroke="#424242"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}