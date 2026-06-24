'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import YellowFog from '../YellowFog';

// Simple deterministic pseudo-random generator to satisfy React 19 purity rules
function seededRandom(s) {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
}

// Sparse drifting structural particles
function GridParticles() {
  const pointsRef = useRef();
  const count = 350;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const rX = seededRandom(i * 12.9898 + 1);
      const rY = seededRandom(i * 78.233 + 2);
      const rZ = seededRandom(i * 43.123 + 3);
      pos[i * 3] = (rX - 0.5) * 14;     // X
      pos[i * 3 + 1] = (rY - 0.5) * 14; // Y
      pos[i * 3 + 2] = (rZ - 0.5) * 10;  // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.004;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#424242" 
        size={0.008} 
        sizeAttenuation={true} 
        transparent={true} 
        opacity={0.65} 
        depthWrite={false} 
      />
    </points>
  );
}

export default function HomeScene({ scrollProgress }) {
  const groupRef = useRef();

  useFrame((state) => {
    // Slowly rotate the ribbon structure slightly based on mouse position to create perspective depth
    if (groupRef.current) {
      const targetRY = state.pointer.x * 0.22;
      const targetRX = -state.pointer.y * 0.15;
      groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (targetRX - groupRef.current.rotation.x) * 0.08;
    }

    // Camera fly-through path mapped to scroll progress
    const prog = scrollProgress ? scrollProgress.current : 0;
    const targetX = Math.sin(prog * Math.PI) * 1.5;
    const targetY = -prog * 3.8;
    const targetZ = 6.0 - prog * 2.8;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.06;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.06;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.06;
    state.camera.lookAt(0, -prog * 3.0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Volumetric ambient mist */}
      <YellowFog scrollProgress={scrollProgress} baseOpacity={0.035} />

      {/* 3D grid particles backing */}
      <GridParticles />
    </group>
  );
}
