'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/cursor.module.css';

export default function CustomCursor() {
  const ringRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch device or mobile/tablet screen (<=1024px)
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 1024
    ) {
      setIsDesktop(false);
      return;
    }

    setIsDesktop(true);
    document.body.classList.add('custom-cursor-active');

    let mouse = { x: -100, y: -100 };
    let pos = { x: -100, y: -100 };
    let initialized = false;
    let rAfId = null;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!initialized) {
        initialized = true;
        pos.x = e.clientX;
        pos.y = e.clientY;
      }

      // Check boundary exit
      if (
        e.clientX <= 1 ||
        e.clientY <= 1 ||
        e.clientX >= window.innerWidth - 1 ||
        e.clientY >= window.innerHeight - 1
      ) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);
    const handleBlur = () => setIsHidden(true);
    const handleFocus = () => setIsHidden(false);

    // Exact out2 lerp loop (0.16 smoothing factor)
    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.16;
      pos.y += (mouse.y - pos.y) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }

      rAfId = requestAnimationFrame(loop);
    };

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
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    rAfId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      if (rAfId) cancelAnimationFrame(rAfId);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      className={styles.cursorWrapper}
      style={{
        opacity: isHidden ? 0 : 1,
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${
          clicked ? styles.cursorRingClick : hovered ? styles.cursorRingHover : ''
        }`}
      >
        <svg
          width="24"
          height="24"
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
