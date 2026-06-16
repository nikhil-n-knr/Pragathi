'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/cursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  // Track cursor interactive hover state
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add active class to body to hide the default browser cursor
    document.body.classList.add('custom-cursor-active');

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Smooth spring interpolation loop for the dual elements
    let rAfId;
    const updateCursor = () => {
      // 1. Move raw 4px yellow dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Lerp the spring-physics 40px outer halo ring
      const easeFactor = 0.095; // elegant spring lag
      pos.x += (mouse.x - pos.x) * easeFactor;
      pos.y += (mouse.y - pos.y) * easeFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }

      rAfId = requestAnimationFrame(updateCursor);
    };

    // Statically monitor cursor transitions on hover elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('[data-interactive]') ||
        target.classList.contains('interactive-card');
        
      setHovered(!!isInteractive);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    rAfId = requestAnimationFrame(updateCursor);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rAfId);
    };
  }, []);

  return (
    <div className={styles.cursorWrapper}>
      {/* Raw 4px Solid Yellow Dot */}
      <div 
        ref={dotRef}
        className={styles.cursorDot}
      />
      
      {/* Spring-physics 40px Outer Yellow Halo Ring */}
      <div 
        ref={ringRef} 
        className={`${styles.cursorRing} ${
          clicked ? styles.cursorRingClick : hovered ? styles.cursorRingHover : ''
        }`} 
      />
    </div>
  );
}
