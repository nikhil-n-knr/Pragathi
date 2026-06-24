'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';
import { useFluid } from '../context/FluidContext';
import { FluidVertexShader, FluidFragmentShader } from '../shaders/fluidShaders';

function FluidSimulation() {
  const { mousePos, mouseVel } = useFluid();
  const { size, gl, scene, camera } = useThree();
  
  // Create double FBO targets for read/write swap feedback loop
  const fboA = useFBO(size.width, size.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });
  
  const fboB = useFBO(size.width, size.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  const readTarget = useRef(fboA);
  const writeTarget = useRef(fboB);

  // Mesh refs
  const simMeshRef = useRef();
  const simMaterialRef = useRef();
  const displayMeshRef = useRef();

  // Create a orthographic camera scene exclusively for FBO simulation to avoid recursively rendering the screen
  const fboScene = useMemo(() => new THREE.Scene(), []);
  const fboCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  // Update loop
  useFrame((state) => {
    const { clock } = state;
    
    if (simMaterialRef.current) {
      // Set uniforms
      simMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      simMaterialRef.current.uniforms.uAspect.value = size.width / size.height;
      
      // Update mouse position & velocity from context
      simMaterialRef.current.uniforms.uMouse.value.set(
        mousePos.current.normalizedX,
        mousePos.current.normalizedY
      );
      
      // Decelerate stored velocity slightly over frame loops to prevent drift when mouse stops
      simMaterialRef.current.uniforms.uMouseVel.value.set(
        mouseVel.current.x * 0.9,
        mouseVel.current.y * 0.9
      );

      // Swap uPrevFrame to the previous readTarget
      simMaterialRef.current.uniforms.uPrevFrame.value = readTarget.current.texture;
    }

    // 1. Render simulation pass to the writeTarget
    gl.setRenderTarget(writeTarget.current);
    gl.render(fboScene, fboCamera);
    gl.setRenderTarget(null);

    // 2. Set the display mesh texture to the write target
    if (displayMeshRef.current) {
      displayMeshRef.current.material.map = writeTarget.current.texture;
    }

    // 3. Swap read/write targets
    const temp = readTarget.current;
    readTarget.current = writeTarget.current;
    writeTarget.current = temp;
  });

  return (
    <>
      {/* 1. Port of simulation quad to fboScene */}
      {createPortal(
        <mesh ref={simMeshRef}>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={simMaterialRef}
            vertexShader={FluidVertexShader}
            fragmentShader={FluidFragmentShader}
            uniforms={useMemo(() => ({
              uPrevFrame: { value: null },
              uMouse: { value: new THREE.Vector2(0, 0) },
              uMouseVel: { value: new THREE.Vector2(0, 0) },
              uTime: { value: 0 },
              uAspect: { value: size.width / size.height },
              uDamp: { value: 0.985 }, // smoke dissipation rate (lower = dissipates faster)
              uRadius: { value: 0.055 }, // brush stroke size
              uSpeedFactor: { value: 2.2 } // density increase based on speed
            }), [size.width, size.height])}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>,
        fboScene
      )}

      {/* 2. Main visible display quad rendering to the viewport */}
      <mesh ref={displayMeshRef}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial depthWrite={false} depthTest={false} />
      </mesh>
    </>
  );
}

export default function FluidBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      backgroundColor: '#000000',
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: false
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for mobile performance
      >
        <FluidSimulation />
      </Canvas>
    </div>
  );
}
