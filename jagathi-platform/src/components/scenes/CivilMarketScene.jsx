'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Simple deterministic pseudo-random generator to satisfy React 19 purity rules
function seededRandom(s) {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
}

export default function CivilMarketScene({ scrollProgress }) {
  const sceneRef = useRef();
  const terrainMaterialRef = useRef();
  
  const [hoveredData, setHoveredData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(new THREE.Vector3(0, 0, 0));

  // The terrain center is placed at Y = -40
  const terrainY = -40;

  useFrame((state) => {
    if (terrainMaterialRef.current) {
      const p = scrollProgress && typeof scrollProgress === 'object' && 'current' in scrollProgress ? scrollProgress.current : Number(scrollProgress);

      const sceneOpacity = 1.0;
      if (sceneRef.current) {
        sceneRef.current.visible = true;
      }

      // Camera controller local Y-descent
      const camera = state.camera;
      camera.position.x = 2.0;
      camera.position.z = 7.0;
      camera.position.y = -12.0 - p * 23.0; // descends from Y = -12 down to Y = -35
      camera.lookAt(0, -40, 0);

      // Set opacity uniform for terrain shader
      terrainMaterialRef.current.uniforms.uOpacity.value = sceneOpacity;
      terrainMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

      // Smoothly decay hover intensity if not hovering
      if (!hoveredData) {
        terrainMaterialRef.current.uniforms.uHoverIntensity.value += (0.0 - terrainMaterialRef.current.uniforms.uHoverIntensity.value) * 0.1;
      } else {
        terrainMaterialRef.current.uniforms.uHoverIntensity.value += (1.0 - terrainMaterialRef.current.uniforms.uHoverIntensity.value) * 0.15;
      }
    }
  });

  // Procedural masterplan plots geometry (arranged on a grid)
  const plots = useMemo(() => {
    const grid = [];
    const size = 10;
    const spacing = 1.6;
    
    for (let x = -size / 2; x < size / 2; x++) {
      for (let z = -size / 2; z < size / 2; z++) {
        // Leave central channels empty for visual flow (roads)
        if (Math.abs(x) === 0 || Math.abs(z) === 0) continue;

        // Generate height and project data using deterministic seeds
        const seed1 = x * 12.9898 + z * 78.233;
        const seed2 = x * 43.123 + z * 93.382;
        const seed3 = x * 57.821 + z * 18.521;
        const seed4 = x * 31.415 + z * 62.831;

        const height = 0.2 + seededRandom(seed1) * 0.8;
        const acres = (1.5 + seededRandom(seed2) * 8.5).toFixed(1);
        const randX = seededRandom(seed3);
        const randZ = seededRandom(seed4);

        const code = `SECTOR-${Math.abs(x)}${String.fromCharCode(65 + Math.abs(z))}`;
        const coordinates = `${(13.045 + x * 0.012).toFixed(4)}° N, ${(80.220 + z * 0.018).toFixed(4)}° E`;

        grid.push({
          x: x * spacing + (randX - 0.5) * 0.2,
          z: z * spacing + (randZ - 0.5) * 0.2,
          w: 1.1,
          h: height,
          d: 1.1,
          code,
          acres,
          coordinates
        });
      }
    }
    return grid;
  }, []);

  // Liquid gold terrain vertex + fragment shader
  const terrainShader = useMemo(() => ({
    vertexShader: `
      uniform vec3 uHitPoint;
      uniform float uHoverIntensity;
      uniform float uTime;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vDistToHit;

      void main() {
        vec3 pos = position;
        vNormal = normal;
        
        // Calculate world position
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vPosition = worldPos.xyz;

        // Calculate distance from raycast hit point
        float d = distance(worldPos.xyz, uHitPoint);
        vDistToHit = d;

        // Apply radial liquid gold wave displacement
        if (uHoverIntensity > 0.001 && d < 6.0) {
          float wave = sin(d * 4.5 - uTime * 6.0) * 0.18;
          // Apply Gaussian envelope to decay the wave outward
          float factor = exp(-pow(d * 0.45, 2.0)) * uHoverIntensity;
          pos.z += wave * factor; // Displace vertex along plane normal (Z in local space)
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uHoverIntensity;
      uniform float uOpacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vDistToHit;

      void main() {
        // Base dark matte floor color
        vec3 darkBase = vec3(0.04, 0.04, 0.04);
        // Liquid gold color (themed to charcoal)
        vec3 liquidGold = vec3(66.0 / 255.0, 66.0 / 255.0, 66.0 / 255.0);

        // Grid pattern
        vec2 gridVal = abs(fract(vPosition.xz * 1.5 - 0.5) - 0.5) / 0.03;
        float gridLines = 1.0 - min(min(gridVal.x, gridVal.y), 1.0);
        
        // Merge grid color with gold highlights
        vec3 col = mix(darkBase, vec3(0.12, 0.12, 0.12), gridLines);

        // Apply gold highlight within the ripple influence area
        if (uHoverIntensity > 0.001 && vDistToHit < 6.0) {
          float rippleEdge = sin(vDistToHit * 4.5 - uTime * 6.0) * 0.5 + 0.5;
          float factor = exp(-pow(vDistToHit * 0.45, 2.0)) * uHoverIntensity;
          
          // Specular golden shimmer
          vec3 shimmer = liquidGold * (0.4 + 0.6 * rippleEdge);
          col = mix(col, shimmer, factor * 0.95);
        }

        gl_FragColor = vec4(col, uOpacity);
      }
    `
  }), []);

  // Handle pointer move over terrain to perform raycasting calculations
  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (terrainMaterialRef.current) {
      terrainMaterialRef.current.uniforms.uHitPoint.value.copy(e.point);
    }
    
    // Find closest plot
    const worldPoint = e.point;
    let closestPlot = null;
    let minDist = 1.8; // max hover radius

    plots.forEach((plot) => {
      const plotPos = new THREE.Vector3(plot.x, terrainY + plot.h / 2, plot.z);
      const dist = worldPoint.distanceTo(plotPos);
      if (dist < minDist) {
        minDist = dist;
        closestPlot = plot;
      }
    });

    if (closestPlot) {
      setHoveredData(closestPlot);
      setHoveredPoint(new THREE.Vector3(closestPlot.x, terrainY + closestPlot.h + 0.5, closestPlot.z));
    } else {
      setHoveredData(null);
    }
  };

  const handlePointerOut = () => {
    setHoveredData(null);
    if (terrainMaterialRef.current) {
      terrainMaterialRef.current.uniforms.uHitPoint.value.set(999, 999, 999);
    }
  };

  return (
    <group ref={sceneRef}>
      {/* 1. Floating 3D Parallax Typography on Z/Y axes */}
      <Text
        position={[2.0, -18, -1]}
        fontSize={0.6}
        color="#424242"
        font="https://cdn.jsdelivr.net/npm/@fontsource/outfit/files/outfit-latin-700-normal.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFEA0A"
      >
        [ CIVIL MARKET ]
      </Text>

      <Text
        position={[-2.2, -26, 0.5]}
        fontSize={0.65}
        color="#424242"
        font="https://cdn.jsdelivr.net/npm/@fontsource/outfit/files/outfit-latin-700-normal.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFEA0A"
      >
        [ LUXURY SPACES ]
      </Text>

      <Text
        position={[1.5, -33, -1.5]}
        fontSize={0.6}
        color="#424242"
        font="https://cdn.jsdelivr.net/npm/@fontsource/outfit/files/outfit-latin-700-normal.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFEA0A"
      >
        [ FUTURE EQUITY ]
      </Text>

      {/* 2. Abstract Community Layout plots */}
      <group>
        {plots.map((p, idx) => {
          const isHovered = hoveredData && hoveredData.code === p.code;
          return (
            <mesh
              key={idx}
              position={[p.x, terrainY + p.h / 2, p.z]}
            >
              <boxGeometry args={[p.w, p.h, p.d]} />
              <meshStandardMaterial
                color={isHovered ? '#424242' : '#222222'}
                roughness={0.1}
                metalness={isHovered ? 0.95 : 0.8}
                wireframe={false}
                transparent={true}
                opacity={0.9}
              />
            </mesh>
          );
        })}
      </group>

      {/* 3. Infinite Grid Ground Terrain (with Pointer events for liquid gold shader) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, terrainY, 0]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[30, 30, 80, 80]} />
        <shaderMaterial
          ref={terrainMaterialRef}
          vertexShader={terrainShader.vertexShader}
          fragmentShader={terrainShader.fragmentShader}
          uniforms={useMemo(() => ({
            uTime: { value: 0 },
            uHitPoint: { value: new THREE.Vector3(999, 999, 999) },
            uHoverIntensity: { value: 0.0 },
            uOpacity: { value: 0.0 }
          }), [])}
          transparent={true}
          depthWrite={true}
        />
      </mesh>

      {/* 4. Floating glassmorphic coordinate panel projected on hover */}
      {hoveredData && (
        <Html
          position={hoveredPoint}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease-in-out',
            opacity: hoveredData ? 1 : 0
          }}
        >
          <div style={{
            background: 'rgba(66, 66, 66, 0.95)',
            border: '1px solid #FFEA0A',
            backdropFilter: 'blur(8px)',
            borderRadius: '2px',
            padding: '8px 12px',
            width: '180px',
            color: '#ffffff',
            fontFamily: '"Outfit", sans-serif',
            fontSize: '10px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}>
            <div style={{ color: '#FFEA0A', fontWeight: 'bold', marginBottom: '4px' }}>
              {hoveredData.code}
            </div>
            <div style={{ margin: '2px 0', opacity: 0.8 }}>
              Size: {hoveredData.acres} Acres
            </div>
            <div style={{ fontSize: '8px', opacity: 0.6 }}>
              {hoveredData.coordinates}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
