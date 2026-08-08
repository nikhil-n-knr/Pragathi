import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let H = (canvas.height = window.innerHeight * window.devicePixelRatio);

    const handleResize = () => {
      W = canvas.width = window.innerWidth * window.devicePixelRatio;
      H = canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for magnetic particle field parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const handleMouseMove = (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 60;
      tmy = (e.clientY / window.innerHeight - 0.5) * 60;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const count = 90;
    const particles = [];

    const colors = [
      'rgba(13, 148, 136, ',  // Teal 600
      'rgba(16, 185, 129, ',  // Emerald 500
      'rgba(6, 182, 212, ',   // Cyan 500
      'rgba(20, 184, 166, ',  // Mint Teal
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: (2 + Math.random() * 5) * window.devicePixelRatio,
        speed: 0.15 + Math.random() * 0.45,
        drift: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.5,
        color: colors[i % colors.length],
        seed: Math.random() * 100,
      });
    }

    let time = 0;
    const render = () => {
      time += 16;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        const px = (p.x + Math.sin(time * 0.0004 * p.speed + p.drift) * 0.05) * W + mx;
        const py = (((p.y - time * 0.00004 * p.speed) % 1 + 1) % 1) * H + my;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.002 + p.seed));
        const size = p.radius * (0.8 + 0.2 * Math.cos(time * 0.0015 + p.seed));

        ctx.globalAlpha = pulseAlpha;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5);
        gradient.addColorStop(0, `${p.color}0.9)`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}
