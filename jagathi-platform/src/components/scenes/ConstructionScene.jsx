'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import YellowFog from '../YellowFog';

export default function ConstructionScene({ scrollProgress }) {
  const sceneRef = useRef();
  const craneRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Milestone nodes data
  const milestones = useMemo(() => [
    { id: 'steel', label: 'Steel Reinforcement', pos: [-1.8, -1.2, 1.2], metric: 'Grade Fe 550, 1,200 Tons' },
    { id: 'concrete', label: 'Structural Concrete', pos: [-0.6, 0.2, 1.8], metric: 'M50 Grade, 4,500 Cubic Metres' },
    { id: 'facade', label: 'Facade Glazing', pos: [1.4, 1.6, -0.6], metric: 'Double-glazed, 82% Acoustic Seal' },
    { id: 'handover', label: 'Handover Quality', pos: [0.0, 3.2, 0.0], metric: '100% Structural Sign-off' }
  ], []);

  // Building components that assemble (columns, slabs, panels)
  const components = useMemo(() => {
    const list = [];
    // Columns
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      list.push({
        type: 'column',
        pos: [Math.cos(angle) * 1.5, -0.5, Math.sin(angle) * 1.5],
        size: [0.15, 2.0, 0.15],
        startDelay: 0.1 + i * 0.08
      });
    }
    // Floor Slabs
    list.push({ type: 'slab', pos: [0, -1.5, 0], size: [4.0, 0.12, 4.0], startDelay: 0.0 });
    list.push({ type: 'slab', pos: [0, 0.5, 0], size: [3.2, 0.12, 3.2], startDelay: 0.45 });
    list.push({ type: 'slab', pos: [0, 2.2, 0], size: [2.2, 0.12, 2.2], startDelay: 0.75 });
    
    // Core wall block
    list.push({ type: 'core', pos: [0, 0.5, 0], size: [0.8, 4.0, 0.8], startDelay: 0.05 });

    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const p = scrollProgress.current; // 0.0 to 1.0 based on page scroll

    // Animate building components based on local delay and scroll progress
    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child.userData && child.userData.startDelay !== undefined) {
          const delay = child.userData.startDelay;
          const localProg = THREE.MathUtils.clamp((p - delay) / 0.25, 0.0, 1.0);
          
          // Apply scale and translation drop
          const scale = localProg;
          child.scale.set(scale, scale, scale);
          
          // Slight vertical drop down as they assemble
          const originalY = child.userData.originalY;
          child.position.y = originalY + (1.0 - localProg) * 1.5;
        }
      });
    }

    // Camera travels around active build grid on scroll
    // R3F let's us control the camera inside the frame loop
    const camera = state.camera;
    // Map scroll progress to a sweeping camera angle and descent
    const angle = 0.5 + p * Math.PI * 0.45;
    const radius = 6.8 - p * 1.2;
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.position.y = 2.5 - p * 2.8;
    camera.lookAt(0, 0.5, 0);

    // Subtle swinging of crane arm to make the site feel alive
    if (craneRef.current) {
      craneRef.current.rotation.y = Math.sin(time * 0.4) * 0.15 + (p * Math.PI * 0.5);
    }
  });

  return (
    <group>
      {/* Volumetric Fog */}
      <YellowFog scrollProgress={scrollProgress} baseOpacity={0.04} />

      {/* Ground Technical Drafting Grid */}
      <gridHelper args={[15, 30, '#ffea00', '#1c1c1a']} position={[0, -1.5, 0]} />

      {/* 3D Wireframe Crane Model */}
      <group ref={craneRef} position={[2.5, -1.5, 2.5]}>
        {/* Vertical mast */}
        <mesh position={[0, 3.0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 6.0, 8]} />
          <meshBasicMaterial color="#333330" wireframe={true} />
        </mesh>
        
        {/* Horizontal jib arm */}
        <group position={[0, 6.0, 0]}>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 3.0, 6]} />
            <meshBasicMaterial color="#ffea00" wireframe={true} />
          </mesh>
          
          {/* Tension wire cables */}
          <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, -0.45]}>
            <cylinderGeometry args={[0.005, 0.005, 1.8]} />
            <meshBasicMaterial color="#ffea00" />
          </mesh>

          {/* Hanging load hook string */}
          <mesh position={[1.8, -1.8, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 3.5]} />
            <meshBasicMaterial color="#555555" />
          </mesh>
        </group>
      </group>

      {/* Assembling Building Structures (driven by Scroll) */}
      <group ref={sceneRef}>
        {components.map((c, idx) => (
          <mesh 
            key={idx} 
            position={c.pos} 
            userData={{ startDelay: c.startDelay, originalY: c.pos[1] }}
          >
            {c.type === 'column' && <cylinderGeometry args={[c.size[0], c.size[0], c.size[1], 8]} />}
            {c.type === 'slab' && <boxGeometry args={c.size} />}
            {c.type === 'core' && <boxGeometry args={c.size} />}
            <meshStandardMaterial 
              color="#0e0e10" 
              roughness={0.25} 
              metalness={0.9} 
              wireframe={false} 
            />
          </mesh>
        ))}
      </group>

      {/* Interactive Milestone Nodes (Steel, Concrete, Façade, Handover) */}
      {milestones.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <group key={node.id} position={node.pos}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                setHoveredNode(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[isHovered ? 0.15 : 0.09, 16, 16]} />
              <meshBasicMaterial 
                color="#ffea00" 
                transparent={true} 
                opacity={isHovered ? 0.95 : 0.65} 
              />
            </mesh>

            {/* Glowing outer aura for milestones */}
            {isHovered && (
              <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#ffff00" transparent={true} opacity={0.22} />
              </mesh>
            )}

            {/* Floating metrics panel projection on hover */}
            {isHovered && (
              <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(255, 230, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)'
                }}>
                  <div style={{ color: '#ffea00', fontWeight: 'bold', marginBottom: '2px' }}>
                    {node.label}
                  </div>
                  <div style={{ opacity: 0.7 }}>
                    {node.metric}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
