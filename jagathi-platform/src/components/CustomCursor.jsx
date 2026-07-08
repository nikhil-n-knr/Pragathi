'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/cursor.module.css';

export default function CustomCursor() {
  const ringRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch device or screen size <= 1024px
    const checkIsTouchMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 
                      'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 ||
                      window.innerWidth <= 1024;
      return isTouch;
    };

    if (checkIsTouchMobile()) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Add active class to body to hide the default browser cursor
    document.body.classList.add('custom-cursor-active');

    const mouse = { x: -100, y: -100 };
    const pos   = { x: -100, y: -100 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    let rAfId;
    const updateCursor = () => {
      // Spring-lerp the arrow ring with elegant snappy lag (increased from 0.095)
      const ease = 0.16;
      pos.x += (mouse.x - pos.x) * ease;
      pos.y += (mouse.y - pos.y) * ease;

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

  if (!isVisible) return null;

  return (
    <div className={styles.cursorWrapper}>
      {/* Spring-physics SVG arrow — white bordered, no dot */}
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${
          clicked ? styles.cursorRingClick : hovered ? styles.cursorRingHover : ''
        }`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className={styles.arrowSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 3L19.5 12L12.5 14L10.5 21L4.5 3Z"
            className={styles.arrowPath}
          />
        </svg>
      </div>
    </div>
  );
}
