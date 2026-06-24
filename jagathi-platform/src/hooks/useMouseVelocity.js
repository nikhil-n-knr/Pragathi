import { useEffect, useRef } from 'react';

export default function useMouseVelocity() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0, speed: 0 });
  const lastTimeRef = useRef(0);

  useEffect(() => {
    lastTimeRef.current = Date.now();
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const timeDelta = Math.max(1, currentTime - lastTimeRef.current);
      
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      
      // Calculate velocity in pixels per millisecond
      const vx = dx / timeDelta;
      const vy = dy / timeDelta;
      
      // Calculate scalar speed
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Store results
      velocityRef.current = { x: vx, y: vy, speed };
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = currentTime;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { mouseRef, velocityRef };
}
