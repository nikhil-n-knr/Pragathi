'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import YellowFog from '../YellowFog';

function seededRandom(s) {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
}

// Dynamic 3D Drifting Structural Particles with High Speed & Deep 3D Perspective
function GridParticles() {
  const pointsRef = useRef();
  const count = 650;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const rX = seededRandom(i * 12.9898 + 1);
      const rY = seededRandom(i * 78.233 + 2);
      const rZ = seededRandom(i * 43.123 + 3);
      pos[i * 3] = (rX - 0.5) * 22;     // X spread
      pos[i * 3 + 1] = (rY - 0.5) * 22; // Y spread
      pos[i * 3 + 2] = (rZ - 0.5) * 24; // Deep Z spread (-12 to +12 depth layer)
    }
    return pos;
  }, []);

  const circleTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // 3.5x Faster orbital drift & wave rotation
      const t = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = t * 0.055;
      pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.08 + t * 0.022;
      pointsRef.current.rotation.z = Math.cos(t * 0.2) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#222222"
        size={0.14}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.7}
        depthWrite={false}
        map={circleTexture || undefined}
        alphaTest={0.01}
      />
    </points>
  );
}

export default function HomeScene({ scrollProgress }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Responsive 3D mouse tilt with smooth interpolation
      const targetRY = state.pointer.x * 0.6;
      const targetRX = -state.pointer.y * 0.4;
      groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.12;
      groupRef.current.rotation.x += (targetRX - groupRef.current.rotation.x) * 0.12;
    }

    // Scroll-driven camera 3D depth travel
    const prog = scrollProgress ? scrollProgress.current : 0;
    const targetX = Math.sin(prog * Math.PI) * 2.2;
    const targetY = -prog * 5.0;
    const targetZ = 6.0 - prog * 4.0;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.08;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.08;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.08;
    state.camera.lookAt(0, -prog * 3.5, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Volumetric Fog */}
      <YellowFog scrollProgress={scrollProgress} baseOpacity={0.045} />

      {/* Dynamic Fast Deep 3D Particle Field */}
      <GridParticles />
    </group>
  );
}
