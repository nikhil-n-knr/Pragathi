'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';

const FluidContext = createContext(null);

export function FluidProvider({ children }) {
  const mousePos = useRef({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const mouseVel = useRef({ x: 0, y: 0, speed: 0 });
  const lastTime = useRef(typeof window !== 'undefined' ? Date.now() : 0);
  const hoverActive = useRef(false);

  // Scroll velocity refs
  const scrollY = useRef(0);
  const scrollVel = useRef(0);
  const smoothScrollVel = useRef(0);

  // Register hover state to coordinate with the fluid simulation shader
  const setHoverActive = (active) => {
    hoverActive.current = active;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize scroll position
    scrollY.current = window.scrollY;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastTime.current);
      
      const prevX = mousePos.current.x;
      const prevY = mousePos.current.y;
      
      const x = e.clientX;
      const y = e.clientY;

      // Normalized coordinates for WebGL (-1 to +1, top-left is -1, 1 or bottom-left is -1, -1)
      const normalizedX = (x / window.innerWidth) * 2 - 1;
      const normalizedY = -(y / window.innerHeight) * 2 + 1;

      mousePos.current = { x, y, normalizedX, normalizedY };

      // Calculate velocity
      const dx = x - prevX;
      const dy = y - prevY;
      const vx = dx / dt;
      const vy = dy / dt;
      const speed = Math.sqrt(vx * vx + vy * vy);

      mouseVel.current = { x: vx, y: vy, speed };
      lastTime.current = now;

      // Update CSS variables for CSS radial glow
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };

    // Continuous requestAnimationFrame loop to calculate and decay scroll velocity
    let rAfId;
    const updateScrollPhysics = () => {
      const currentScrollY = window.scrollY;
      const instantVel = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      scrollVel.current = instantVel;
      // Smooth interpolation coefficient for elastic decay
      smoothScrollVel.current += (instantVel - smoothScrollVel.current) * 0.1;

      // Set global CSS property for potential CSS-driven skew
      document.documentElement.style.setProperty('--scroll-velocity', `${smoothScrollVel.current}`);

      rAfId = requestAnimationFrame(updateScrollPhysics);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rAfId = requestAnimationFrame(updateScrollPhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rAfId);
    };
  }, []);

  return (
    <FluidContext.Provider value={{ mousePos, mouseVel, hoverActive, setHoverActive, smoothScrollVel }}>
      {children}
    </FluidContext.Provider>
  );
}

export function useFluid() {
  const context = useContext(FluidContext);
  if (!context) {
    throw new Error('useFluid must be used within a FluidProvider');
  }
  return context;
}

