'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFluid } from '../../context/FluidContext';
import * as THREE from 'three';

export default function FooterScene({ scrollProgress }) {
  const groupRef = useRef();
  const { mouseVel } = useFluid();

  // Position of footer scene: Y = -82
  const centerY = -82;

  useFrame((state) => {
    const p = scrollProgress.current;

    // Footer is active at the very end: scroll 3.6 to 4.0
    let opacity = 0;
    if (p >= 3.6) {
      opacity = Math.min(1.0, (p - 3.6) / 0.2);
    }

    if (groupRef.current) {
      groupRef.current.visible = opacity > 0.001;
    }
  });

  // Dynamic SVG melting effect loop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const meltMap = document.getElementById('global-melt-map');
    if (!meltMap) return;

    let animFrameId;
    let currentScale = 0;
    let targetScale = 0;

    const tick = () => {
      // Calculate target melt scale based on mouse velocity speed
      const speed = mouseVel.current.speed;
      
      // Speed multiplier (e.g. scale up to 75px distortion)
      targetScale = Math.min(75, speed * 60);
      
      // Lerp to make the melting distortion fluid
      currentScale += (targetScale - currentScale) * 0.12;
      
      // Apply scale to the SVG filter
      meltMap.setAttribute('scale', currentScale.toFixed(2));

      animFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animFrameId);
      // Reset scale when component unmounts
      const resetMap = document.getElementById('global-melt-map');
      if (resetMap) resetMap.setAttribute('scale', '0');
    };
  }, [mouseVel]);

  return (
    <group ref={groupRef}>
      {/* Abstract thin coordinate lines floating in the dark void to give a sense of elevation */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const lineY = centerY + (idx - 3) * 1.5;
        return (
          <mesh key={idx} position={[0, lineY, -2]}>
            <planeGeometry args={[12, 0.015]} />
            <meshBasicMaterial color="#ffea00" transparent opacity={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}
