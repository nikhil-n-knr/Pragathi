'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import YellowFog from '../YellowFog';

// Custom Tube Ribbon component with progress-based reveal shader
function RibbonBranch({ points, scrollProgress, delayStart, delayEnd }) {
  const materialRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color("#424242") }
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;

    // Evaluate progress window for this specific branch
    const globalProg = scrollProgress.current; // 0.0 to 1.0 on homepage scroll
    const localProg = THREE.MathUtils.clamp(
      (globalProg - delayStart) / (delayEnd - delayStart),
      0.0,
      1.0
    );
    // Cubic ease out progress reveal
    uniforms.uProgress.value = localProg * localProg * (3.0 - 2.0 * localProg);
  });

  const shader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uProgress;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Grow tube along curve progress (U component of UV represents path progression)
        if (vUv.x > uProgress) {
          discard;
        }

        // Shimmer pulse animation traversing down the tube
        float flow = sin(vUv.x * 24.0 - uTime * 6.5) * 0.18 + 0.82;
        
        // Edge glow shading
        float edge = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
        float edgeGlow = pow(edge, 3.0) * 0.4;

        vec3 color = uColor * flow + vec3(edgeGlow);

        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), []);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.038, 12, false]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={true}
      />
    </mesh>
  );
}

// Sparse drifting structural particles
function GridParticles() {
  const pointsRef = useRef();
  const count = 350;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;  // Z
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
        size={0.026} 
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

  // Define points for the three branching curves
  // They overlap from Y = 2.5 down to Y = 0.0 to look like a single ribbon,
  // and then branch off in three different directions downwards.
  const curves = useMemo(() => {
    return {
      left: [
        new THREE.Vector3(0, 2.5, 0),
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0, 0.0, 0),
        new THREE.Vector3(-0.7, -1.0, -0.3),
        new THREE.Vector3(-2.2, -2.4, -1.0)
      ],
      center: [
        new THREE.Vector3(0, 2.5, 0),
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0, 0.0, 0),
        new THREE.Vector3(0, -1.2, 0.4),
        new THREE.Vector3(0, -2.6, 1.0)
      ],
      right: [
        new THREE.Vector3(0, 2.5, 0),
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0, 0.0, 0),
        new THREE.Vector3(0.7, -1.0, -0.3),
        new THREE.Vector3(2.2, -2.4, -1.0)
      ]
    };
  }, []);

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

      {/* Left branch - represents Build / Construction */}
      <RibbonBranch 
        points={curves.left} 
        scrollProgress={scrollProgress} 
        delayStart={0.0} 
        delayEnd={0.8} 
      />

      {/* Center branch - represents Secure / Real Estate */}
      <RibbonBranch 
        points={curves.center} 
        scrollProgress={scrollProgress} 
        delayStart={0.1} 
        delayEnd={0.9} 
      />

      {/* Right branch - represents Curate / Interiors */}
      <RibbonBranch 
        points={curves.right} 
        scrollProgress={scrollProgress} 
        delayStart={0.2} 
        delayEnd={1.0} 
      />

      {/* Emissive node lights at the base endpoints of the three branches */}
      <mesh position={[-2.2, -2.4, -1.0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#424242" />
      </mesh>
      <mesh position={[0, -2.6, 1.0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#424242" />
      </mesh>
      <mesh position={[2.2, -2.4, -1.0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#424242" />
      </mesh>
    </group>
  );
}
