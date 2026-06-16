'use client';

import React, { useRef, useEffect } from 'react';
import { useFluid } from '../context/FluidContext';

export default function MediaFloat({ 
  children, 
  intensity = 1.0, 
  className = "",
  style = {} 
}) {
  const cardRef = useRef(null);
  const { smoothScrollVel } = useFluid();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Track physical states
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const pos = { x: 0, y: 0, rx: 0, ry: 0 };
    let isHovered = false;

    const onMouseMove = (e) => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor coordinates relative to card center (-1 to 1 range)
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      mouse.targetX = (e.clientX - cx) / (rect.width / 2);
      mouse.targetY = (e.clientY - cy) / (rect.height / 2);
    };

    const onMouseEnter = () => {
      isHovered = true;
      card.style.transition = "none"; // disable CSS transitions during manual animation
    };

    const onMouseLeave = () => {
      isHovered = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
      // Re-enable CSS transitions to snap back smoothly
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    };

    // Spring damping animation tick
    let rAfId;
    const tick = () => {
      const ease = 0.085; // Viscous spring easing coefficient
      
      pos.x += (mouse.targetX - pos.x) * ease;
      pos.y += (mouse.targetY - pos.y) * ease;
      
      // Compute tilt angles (X tilt depends on Y displacement, Y tilt depends on X displacement)
      pos.rx = -pos.y * 12.0 * intensity;
      pos.ry = pos.x * 12.0 * intensity;
      
      // Shift coordinate offsets (up to 18px translation)
      const tx = pos.x * 18.0 * intensity;
      const ty = pos.y * 18.0 * intensity;

      // Real-time scroll velocity bend calculation
      const currentScrollVel = smoothScrollVel ? smoothScrollVel.current : 0;
      const skewYVal = currentScrollVel * 0.035 * intensity; // Smooth elastic skew

      if (cardRef.current && isHovered) {
        cardRef.current.style.transform = `
          perspective(1000px) 
          rotateX(${pos.rx}deg) 
          rotateY(${pos.ry}deg) 
          translate3d(${tx}px, ${ty}px, 15px)
          scale3d(1.02, 1.02, 1.02)
          skewY(${skewYVal}deg)
        `;
      } else if (cardRef.current && !isHovered) {
        cardRef.current.style.transform = `
          perspective(1000px) 
          rotateX(0deg) 
          rotateY(0deg) 
          translate3d(0px, 0px, 0px)
          scale3d(1.0, 1.0, 1.0)
          skewY(${skewYVal}deg)
        `;
      }

      rAfId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    
    rAfId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rAfId);
    };
  }, [intensity, smoothScrollVel]);

  return (
    <div 
      ref={cardRef} 
      className={`${className}`} 
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        overflow: 'visible',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      {children}
    </div>
  );
}
