'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import YellowFog from '../YellowFog';

export default function ConstructionScene({ scrollProgress }) {
  const sceneRef = useRef();
  const craneRef = useRef();
  const controlsRef = useRef();
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const isInteracting = useRef(false);
  const interactTimeoutRef = useRef();

  const handleStart = () => {
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    isInteracting.current = true;
  };

  const handleEnd = () => {
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    interactTimeoutRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2500); // 2.5 seconds of inactivity before camera smoothly snaps back to scroll path
  };

  useEffect(() => {
    return () => {
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    };
  }, []);

  // Milestone nodes data
  const milestones = useMemo(() => [
    { id: 'steel', label: 'Steel Foundation', pos: [-2.0, -1.4, 1.0], metric: 'Grade Fe 550, 1,200 Tons' },
    { id: 'fireplace', label: 'Concrete Fireplace', pos: [2.2, 0.5, -1.0], metric: 'M50 Grade, 4,500 Cubic Metres' },
    { id: 'facade', label: 'Facade Glazing', pos: [0.0, 1.45, 0.4], metric: 'Double-glazed, 82% Acoustic Seal' },
    { id: 'handover', label: 'Handover Quality', pos: [0.0, 2.5, 0.0], metric: '100% Structural Sign-off' }
  ], []);

  // Building components that assemble a modern procedural villa
  const components = useMemo(() => {
    const list = [];
    
    // 1. Foundation & Pool Deck
    // Base Concrete Foundation Slab
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [0, -1.45, 0],
      size: [5.2, 0.1, 4.0],
      startDelay: 0.0
    });
    
    // Pool Deck Slab (Teak wood, elevated to rest perfectly on concrete slab to prevent color glitching)
    list.push({
      type: 'box',
      mat: 'wood',
      pos: [-2.1, -1.375, 0],
      size: [1.4, 0.05, 3.2],
      startDelay: 0.04
    });

    // Pool water block (Teal water block, recessed slightly inside the wood deck to prevent color glitching)
    list.push({
      type: 'box',
      mat: 'pool',
      pos: [-2.1, -1.375, 0],
      size: [1.1, 0.04, 2.6],
      startDelay: 0.06
    });

    // Welcoming Concrete Step (Sits on foundation slab in front of entrance door)
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [0, -1.38, 2.05],
      size: [1.6, 0.04, 0.3],
      startDelay: 0.05
    });

    // 2. Ground Floor Columns (Charcoal steel)
    const columns = [
      [-2.5, -0.45, 1.9], [2.5, -0.45, 1.9],
      [-2.5, -0.45, -1.9], [2.5, -0.45, -1.9],
      [0.0, -0.45, -1.9], [-1.4, -0.45, 1.9]
    ];
    columns.forEach((pos, i) => {
      list.push({
        type: 'cylinder',
        mat: 'metal',
        pos: pos,
        size: [0.08, 1.9, 12],
        startDelay: 0.08 + i * 0.015
      });
    });

    // 3. Ground Floor Walls
    // Back Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [0.6, -0.45, -1.85],
      size: [3.6, 1.9, 0.15],
      startDelay: 0.16
    });
    
    // Fireplace / Chimney Column (Raw architectural concrete, passes through roof)
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [2.2, 0.5, -1.0],
      size: [0.6, 4.0, 0.9],
      startDelay: 0.18
    });
    
    // Left Side Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [-2.5, -0.45, -0.6],
      size: [0.15, 1.9, 2.4],
      startDelay: 0.20
    });

    // Right Side Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [2.5, -0.45, 0.0],
      size: [0.15, 1.9, 1.6],
      startDelay: 0.22
    });

    // 4. Ground Floor Main Entrance, Door Handle & Entrance Address Board
    // Door Metal Frame
    list.push({ type: 'box', mat: 'metal', pos: [-0.7, -0.45, 1.9], size: [0.05, 1.9, 0.05], startDelay: 0.23 });
    list.push({ type: 'box', mat: 'metal', pos: [0.7, -0.45, 1.9], size: [0.05, 1.9, 0.05], startDelay: 0.24 });
    list.push({ type: 'box', mat: 'metal', pos: [0.0, 0.48, 1.9], size: [1.45, 0.05, 0.05], startDelay: 0.25 });
    // Teak Wood Door Panel
    list.push({ type: 'box', mat: 'wood', pos: [0.0, -0.475, 1.9], size: [1.3, 1.85, 0.04], startDelay: 0.26 });
    // Polished Brass Door Handle / Knob
    list.push({ type: 'box', mat: 'brass', pos: [0.45, -0.45, 1.93], size: [0.03, 0.5, 0.03], startDelay: 0.29 });
    // Entrance Address Board Sign next to door
    list.push({ type: 'box', mat: 'wood', pos: [0.9, -0.3, 1.91], size: [0.22, 0.32, 0.02], startDelay: 0.28 });
    list.push({ type: 'box', mat: 'brass', pos: [0.9, -0.3, 1.925], size: [0.18, 0.04, 0.01], startDelay: 0.30 });

    // Ground Floor Front Glass Panels
    list.push({ type: 'box', mat: 'glass', pos: [-1.6, -0.45, 1.9], size: [1.7, 1.9, 0.02], startDelay: 0.27 });
    list.push({ type: 'box', mat: 'glass', pos: [1.6, -0.45, 1.9], size: [1.7, 1.9, 0.02], startDelay: 0.28 });

    // Ground Floor Front Window Metal Frames (Top and Bottom tracks)
    list.push({ type: 'box', mat: 'metal', pos: [-1.6, -1.38, 1.9], size: [1.7, 0.04, 0.04], startDelay: 0.26 });
    list.push({ type: 'box', mat: 'metal', pos: [-1.6, 0.48, 1.9], size: [1.7, 0.04, 0.04], startDelay: 0.28 });
    list.push({ type: 'box', mat: 'metal', pos: [1.6, -1.38, 1.9], size: [1.7, 0.04, 0.04], startDelay: 0.27 });
    list.push({ type: 'box', mat: 'metal', pos: [1.6, 0.48, 1.9], size: [1.7, 0.04, 0.04], startDelay: 0.29 });

    // Ground Floor Side Windows & Frames (Left side)
    list.push({ type: 'box', mat: 'glass', pos: [-2.5, -0.45, 1.0], size: [0.02, 1.9, 1.2], startDelay: 0.29 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.5, 0.48, 1.0], size: [0.04, 0.04, 1.2], startDelay: 0.28 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.5, -1.38, 1.0], size: [0.04, 0.04, 1.2], startDelay: 0.27 });

    // Ground Floor Side Windows & Frames (Right side)
    list.push({ type: 'box', mat: 'glass', pos: [2.5, -0.45, 1.2], size: [0.02, 1.9, 1.2], startDelay: 0.30 });
    list.push({ type: 'box', mat: 'metal', pos: [2.5, 0.48, 1.2], size: [0.04, 0.04, 1.2], startDelay: 0.29 });
    list.push({ type: 'box', mat: 'metal', pos: [2.5, -1.38, 1.2], size: [0.04, 0.04, 1.2], startDelay: 0.28 });

    // 5. Ground Floor Interior Furniture (Living Room)
    // Layout: TV is against the BACK wall (Z = -1.85). Sofa faces TV, centered in the room.
    // Floor surface Y = -1.40. Seat box 0.18 tall → seat center Y = -1.31, seat top Y = -1.22.

    // --- TV Wall (back wall, Z = -1.77) ---
    // TV Media Console (Teak, flush against back wall)
    list.push({ type: 'box', mat: 'wood',   pos: [0.2, -1.31, -1.64], size: [1.5, 0.18, 0.36], startDelay: 0.30 });
    // Console hairpin legs (4 metal cylinders)
    list.push({ type: 'cylinder', mat: 'metal', pos: [-0.40, -1.42, -1.60], size: [0.010, 0.18, 6], startDelay: 0.305 });
    list.push({ type: 'cylinder', mat: 'metal', pos: [ 0.80, -1.42, -1.60], size: [0.010, 0.18, 6], startDelay: 0.306 });
    // Flat-screen TV frame (wall-mounted above console)
    list.push({ type: 'box', mat: 'metal',  pos: [0.2, -0.68, -1.78], size: [1.30, 0.72, 0.04], startDelay: 0.31 });
    // TV screen (slightly inset from frame)
    list.push({ type: 'box', mat: 'metal',  pos: [0.2, -0.68, -1.76], size: [1.25, 0.67, 0.01], startDelay: 0.315 });

    // --- L-Shape Sofa (centered in room, backrest toward front glass Z=1.9, faces TV at Z=-1.85) ---
    // Main long section runs along X-axis. Seat center at Z = 0.35, backrest at Z = 0.68 (+Z side = front).
    // Seat: X from -0.70 to 0.90, Z from 0.025 to 0.675
    list.push({ type: 'box', mat: 'sofa',    pos: [0.10, -1.31, 0.35], size: [1.60, 0.18, 0.65], startDelay: 0.32 });
    // Seat cushion top (slightly narrower, lighter cream)
    list.push({ type: 'box', mat: 'plaster', pos: [0.10, -1.22, 0.35], size: [1.55, 0.05, 0.60], startDelay: 0.325 });
    // Backrest slab (at back of seat = high Z = 0.68)
    list.push({ type: 'box', mat: 'sofa',    pos: [0.10, -1.01, 0.66], size: [1.60, 0.40, 0.14], startDelay: 0.33 });
    // Left arm (capping left end X = -0.72)
    list.push({ type: 'box', mat: 'sofa',    pos: [-0.73, -1.16, 0.35], size: [0.12, 0.30, 0.65], startDelay: 0.335 });
    // Right arm — this is also the JOIN corner between main + L sections (X = 0.92)
    list.push({ type: 'box', mat: 'sofa',    pos: [0.92, -1.16, 0.35], size: [0.12, 0.30, 0.65], startDelay: 0.34 });

    // L corner section (wraps toward TV = toward -Z from right end of main sofa)
    // Corner seat: X from 0.88 to 1.48, Z from -0.35 to 0.025
    list.push({ type: 'box', mat: 'sofa',    pos: [1.18, -1.31, -0.16], size: [0.60, 0.18, 0.60], startDelay: 0.345 });
    // Corner top cushion
    list.push({ type: 'box', mat: 'plaster', pos: [1.18, -1.22, -0.16], size: [0.55, 0.05, 0.55], startDelay: 0.35 });
    // Corner side backrest (right side of L, at X = 1.46)
    list.push({ type: 'box', mat: 'sofa',    pos: [1.46, -1.01, -0.16], size: [0.14, 0.40, 0.60], startDelay: 0.355 });
    // Corner far arm (closes the L at -Z end)
    list.push({ type: 'box', mat: 'sofa',    pos: [1.18, -1.16, -0.45], size: [0.60, 0.30, 0.12], startDelay: 0.36 });

    // Coffee Table (between sofa front Z=0.025 and TV Z=-1.64, placed at Z = -0.38)
    list.push({ type: 'box', mat: 'wood',    pos: [0.10, -1.21, -0.38], size: [0.85, 0.05, 0.45], startDelay: 0.365 });
    // 4 hairpin legs
    list.push({ type: 'cylinder', mat: 'metal', pos: [-0.32, -1.38, -0.18], size: [0.012, 0.34, 6], startDelay: 0.366 });
    list.push({ type: 'cylinder', mat: 'metal', pos: [ 0.52, -1.38, -0.18], size: [0.012, 0.34, 6], startDelay: 0.367 });
    list.push({ type: 'cylinder', mat: 'metal', pos: [-0.32, -1.38, -0.58], size: [0.012, 0.34, 6], startDelay: 0.368 });
    list.push({ type: 'cylinder', mat: 'metal', pos: [ 0.52, -1.38, -0.58], size: [0.012, 0.34, 6], startDelay: 0.369 });

    // 6. Stairs (Rich teak wooden steps with steel brackets and metal handrails)
    for (let i = 0; i < 10; i++) {
      // Wooden tread
      list.push({
        type: 'box',
        mat: 'wood',
        pos: [1.6, -1.4 + i * 0.18, 0.8 - i * 0.22],
        size: [0.6, 0.05, 0.25],
        startDelay: 0.35 + i * 0.01
      });
      // Steel support bracket stringer under step
      list.push({
        type: 'box',
        mat: 'metal',
        pos: [1.6, -1.46 + i * 0.18, 0.8 - i * 0.22],
        size: [0.12, 0.06, 0.2],
        startDelay: 0.34 + i * 0.01
      });
      // Handrail post (baluster)
      list.push({
        type: 'cylinder',
        mat: 'metal',
        pos: [1.32, -1.4 + i * 0.18 + 0.4, 0.8 - i * 0.22],
        size: [0.015, 0.8, 6],
        startDelay: 0.36 + i * 0.01
      });
      // Handrail top bar segment
      list.push({
        type: 'box',
        mat: 'metal',
        pos: [1.32, -1.4 + i * 0.18 + 0.8, 0.8 - i * 0.22],
        size: [0.03, 0.03, 0.28],
        startDelay: 0.37 + i * 0.01
      });
    }

    // 7. First Floor Slab split sections to leave a clean staircase landing cutout/opening
    // Main Left Slab (Spans X = -2.6 to +1.0)
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [-0.8, 0.5, 0.0],
      size: [3.6, 0.1, 4.0],
      startDelay: 0.44
    });
    // Right Front Slab (Spans X = 1.0 to 2.6, Z = -0.4 to 2.0)
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [1.8, 0.5, 0.8],
      size: [1.6, 0.1, 2.4],
      startDelay: 0.44
    });
    // Right Back Slab (Spans X = 1.0 to 2.6, Z = -2.0 to -1.4)
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [1.8, 0.5, -1.7],
      size: [1.6, 0.1, 0.6],
      startDelay: 0.44
    });

    // 8. First Floor Columns (Charcoal steel, thinner)
    const upperColumns = [
      [-2.5, 1.45, 1.9], [2.5, 1.45, 1.9],
      [-2.5, 1.45, -1.9], [2.5, 1.45, -1.9],
      [-1.0, 1.45, 1.9], [1.0, 1.45, 1.9]
    ];
    upperColumns.forEach((pos, i) => {
      list.push({
        type: 'cylinder',
        mat: 'metal',
        pos: pos,
        size: [0.06, 1.8, 10],
        startDelay: 0.46 + i * 0.015
      });
    });

    // 9. First Floor Walls
    // Back Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [-0.8, 1.45, -1.85],
      size: [3.2, 1.8, 0.15],
      startDelay: 0.54
    });
    
    // Left Side Cantilever Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [-2.5, 1.45, 0.0],
      size: [0.15, 1.8, 3.6],
      startDelay: 0.56
    });

    // Right Side Wall (Solid plaster wall)
    list.push({
      type: 'box',
      mat: 'plaster',
      pos: [2.5, 1.45, -0.5],
      size: [0.15, 1.8, 2.6],
      startDelay: 0.58
    });

    // First Floor Side Ribbon Window & Frames (Left side)
    list.push({ type: 'box', mat: 'glass', pos: [-2.5, 1.5, 0.0], size: [0.17, 0.4, 3.0], startDelay: 0.59 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.55, 1.72, 0.0], size: [0.04, 0.04, 3.0], startDelay: 0.58 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.55, 1.28, 0.0], size: [0.04, 0.04, 3.0], startDelay: 0.59 });

    // First Floor Side Window & Frames (Right side)
    list.push({ type: 'box', mat: 'glass', pos: [2.5, 1.45, 1.0], size: [0.02, 1.8, 0.8], startDelay: 0.60 });
    list.push({ type: 'box', mat: 'metal', pos: [2.5, 2.33, 1.0], size: [0.04, 0.04, 0.8], startDelay: 0.58 });
    list.push({ type: 'box', mat: 'metal', pos: [2.5, 0.57, 1.0], size: [0.04, 0.04, 0.8], startDelay: 0.59 });

    // 10. First Floor Interior Furniture (Bedroom & Bathroom)
    // --- Bathroom Zone (far left, against back wall) ---
    // Bathtub outer shell (porcelain white, freestanding)
    list.push({ type: 'box', mat: 'plaster', pos: [-1.75, 0.68, -1.30], size: [1.10, 0.36, 0.60], startDelay: 0.60 });
    // Bathtub inner trough (teal water)
    list.push({ type: 'box', mat: 'pool',   pos: [-1.75, 0.85, -1.30], size: [0.95, 0.01, 0.46], startDelay: 0.61 });
    // Bathtub rim edges (plaster)
    list.push({ type: 'box', mat: 'plaster', pos: [-1.75, 0.88, -1.05], size: [1.10, 0.04, 0.06], startDelay: 0.615 }); // front rim
    list.push({ type: 'box', mat: 'plaster', pos: [-1.75, 0.88, -1.55], size: [1.10, 0.04, 0.06], startDelay: 0.616 }); // back rim
    // Tub floor feet / plinth
    list.push({ type: 'box', mat: 'concrete', pos: [-1.75, 0.525, -1.30], size: [0.95, 0.06, 0.42], startDelay: 0.617 });

    // --- Vanity Zone (right of bathtub, still against back wall) ---
    // Vanity counter top (wood)
    list.push({ type: 'box', mat: 'wood',    pos: [-0.80, 0.72, -1.62], size: [0.70, 0.07, 0.30], startDelay: 0.62 });
    // Vanity cabinet below counter
    list.push({ type: 'box', mat: 'plaster', pos: [-0.80, 0.58, -1.62], size: [0.68, 0.20, 0.28], startDelay: 0.625 });
    // Basin (round cutout approximated as small white box inset in counter top)
    list.push({ type: 'box', mat: 'plaster', pos: [-0.80, 0.755, -1.62], size: [0.26, 0.03, 0.22], startDelay: 0.63 });
    // Tap fixture (brass, tiny vertical + horizontal bars)
    list.push({ type: 'box', mat: 'brass',   pos: [-0.80, 0.82, -1.70], size: [0.02, 0.12, 0.02], startDelay: 0.635 }); // spout vertical
    list.push({ type: 'box', mat: 'brass',   pos: [-0.80, 0.88, -1.65], size: [0.20, 0.02, 0.02], startDelay: 0.636 }); // handle bar
    // Bathroom mirror (glass, mounted on back wall)
    list.push({ type: 'box', mat: 'glass',   pos: [-0.80, 1.22, -1.82], size: [0.55, 0.65, 0.02], startDelay: 0.64 });
    // Mirror frame (metal)
    list.push({ type: 'box', mat: 'metal',   pos: [-0.80, 1.22, -1.81], size: [0.58, 0.68, 0.015], startDelay: 0.645 });

    // --- Bedroom Zone (left slab, X from -2.6 to 1.0, Z from -1.9 to ~-0.3) ---
    // Bed centered at X = -0.30, Z = -0.90. Headboard against back wall (Z = -1.85).
    // First floor surface Y = 0.55. Platform height 0.22 → center Y = 0.66. Top of platform Y = 0.77.
    // Mattress height 0.12 → center Y = 0.83. Pillow height 0.09 → center Y = 0.87 (sitting on mattress).

    // Bed platform / base (cream fabric sofa mat)
    list.push({ type: 'box', mat: 'sofa',    pos: [-0.30, 0.66, -0.90], size: [1.40, 0.22, 1.60], startDelay: 0.62 });
    // Mattress (lighter plaster, slightly narrower/shorter than platform)
    list.push({ type: 'box', mat: 'plaster', pos: [-0.30, 0.78, -0.90], size: [1.35, 0.12, 1.54], startDelay: 0.625 });
    // Headboard (teak, standing at back of bed: Z = -0.90 - 1.60/2 = -1.70)
    list.push({ type: 'box', mat: 'wood',    pos: [-0.30, 0.97, -1.69], size: [1.42, 0.84, 0.09], startDelay: 0.63 });
    // Pillow LEFT (center at X = -0.30 - 0.38 = -0.68, Z near headboard = -1.42)
    list.push({ type: 'box', mat: 'plaster', pos: [-0.68, 0.87, -1.42], size: [0.38, 0.09, 0.26], startDelay: 0.64 });
    // Pillow RIGHT (center at X = -0.30 + 0.38 = 0.08, same Z, gap = 0.76 - 0.38 = 0.38 → no overlap)
    list.push({ type: 'box', mat: 'plaster', pos: [ 0.08, 0.87, -1.42], size: [0.38, 0.09, 0.26], startDelay: 0.645 });
    // Bedside table LEFT (outside left edge of platform: platform left edge = -0.30 - 0.70 = -1.00)
    list.push({ type: 'box', mat: 'wood',    pos: [-1.16, 0.68, -1.10], size: [0.28, 0.26, 0.28], startDelay: 0.65 });
    // Bedside lamp LEFT (on table top, table top Y = 0.55 + 0.26 = 0.81)
    list.push({ type: 'cylinder', mat: 'metal', pos: [-1.16, 0.96, -1.10], size: [0.012, 0.30, 6], startDelay: 0.655 });
    list.push({ type: 'cylinder', mat: 'light', pos: [-1.16, 1.12, -1.10], size: [0.08, 0.14, 8], startDelay: 0.658 });
    // Bedside table RIGHT (outside right edge: platform right edge = -0.30 + 0.70 = 0.40)
    list.push({ type: 'box', mat: 'wood',    pos: [ 0.56, 0.68, -1.10], size: [0.28, 0.26, 0.28], startDelay: 0.65 });
    // Bedside lamp RIGHT
    list.push({ type: 'cylinder', mat: 'metal', pos: [ 0.56, 0.96, -1.10], size: [0.012, 0.30, 6], startDelay: 0.655 });
    list.push({ type: 'cylinder', mat: 'light', pos: [ 0.56, 1.12, -1.10], size: [0.08, 0.14, 8], startDelay: 0.658 });

    // 11. First Floor Balcony & Glass Railings
    // Balcony Floor Decking (Teak wood)
    list.push({ type: 'box', mat: 'wood', pos: [-1.0, 0.515, 1.1], size: [2.8, 0.02, 1.4], startDelay: 0.60 });
    // Front Glass Railing Panel
    list.push({ type: 'box', mat: 'glass', pos: [-1.0, 0.95, 1.8], size: [2.8, 0.9, 0.02], startDelay: 0.61 });
    // Left Glass Railing Panel
    list.push({ type: 'box', mat: 'glass', pos: [-2.4, 0.95, 1.1], size: [0.02, 0.9, 1.4], startDelay: 0.62 });
    // Metal Handrails
    list.push({ type: 'box', mat: 'metal', pos: [-1.0, 1.4, 1.8], size: [2.8, 0.04, 0.04], startDelay: 0.63 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.4, 1.4, 1.1], size: [0.04, 0.04, 1.4], startDelay: 0.64 });
    // Metal Railing Posts
    list.push({ type: 'box', mat: 'metal', pos: [-2.4, 0.95, 1.8], size: [0.04, 0.9, 0.04], startDelay: 0.63 });
    list.push({ type: 'box', mat: 'metal', pos: [0.4, 0.95, 1.8], size: [0.04, 0.9, 0.04], startDelay: 0.64 });
    list.push({ type: 'box', mat: 'metal', pos: [-2.4, 0.95, 0.4], size: [0.04, 0.9, 0.04], startDelay: 0.65 });

    // Staircase Opening Protective Glass Railing (Sits around the stair landing hole on the first floor)
    // Left protective rail
    list.push({ type: 'box', mat: 'glass', pos: [1.0, 0.95, -0.9], size: [0.02, 0.9, 1.0], startDelay: 0.62 });
    list.push({ type: 'box', mat: 'metal', pos: [1.0, 1.4, -0.9], size: [0.04, 0.04, 1.0], startDelay: 0.63 });
    list.push({ type: 'box', mat: 'metal', pos: [1.0, 0.95, -0.4], size: [0.04, 0.9, 0.04], startDelay: 0.63 });
    list.push({ type: 'box', mat: 'metal', pos: [1.0, 0.95, -1.4], size: [0.04, 0.9, 0.04], startDelay: 0.64 });
    // Front protective rail
    list.push({ type: 'box', mat: 'glass', pos: [1.8, 0.95, -0.4], size: [1.6, 0.9, 0.02], startDelay: 0.63 });
    list.push({ type: 'box', mat: 'metal', pos: [1.8, 1.4, -0.4], size: [1.6, 0.04, 0.04], startDelay: 0.64 });
    list.push({ type: 'box', mat: 'metal', pos: [2.6, 0.95, -0.4], size: [0.04, 0.9, 0.04], startDelay: 0.64 });

    // 12. First Floor Glass Facade (setback at Z = 0.4)
    list.push({ type: 'box', mat: 'metal', pos: [0.0, 0.57, 0.4], size: [4.8, 0.04, 0.04], startDelay: 0.64 });
    list.push({ type: 'box', mat: 'metal', pos: [0.0, 2.33, 0.4], size: [4.8, 0.04, 0.04], startDelay: 0.65 });
    list.push({ type: 'box', mat: 'glass', pos: [-1.2, 1.45, 0.4], size: [2.35, 1.72, 0.02], startDelay: 0.66 });
    list.push({ type: 'box', mat: 'glass', pos: [1.2, 1.45, 0.4], size: [2.35, 1.72, 0.02], startDelay: 0.67 });

    // 13. Ceiling Lights & Standing Lamps (Glowing warm fixtures)
    // Ground floor ceiling lights
    list.push({ type: 'box', mat: 'light', pos: [-1.2, 0.43, 0.5], size: [0.12, 0.02, 0.12], startDelay: 0.66 });
    list.push({ type: 'box', mat: 'light', pos: [1.2, 0.43, 0.5], size: [0.12, 0.02, 0.12], startDelay: 0.67 });
    // First floor ceiling lights
    list.push({ type: 'box', mat: 'light', pos: [-1.2, 2.33, -0.5], size: [0.12, 0.02, 0.12], startDelay: 0.68 });
    list.push({ type: 'box', mat: 'light', pos: [1.2, 2.33, -0.5], size: [0.12, 0.02, 0.12], startDelay: 0.69 });
    // Floor standing lamps (Metal poles + glowing warm yellow shades)
    list.push({ type: 'cylinder', mat: 'metal', pos: [1.8, -0.9, 0.5], size: [0.015, 1.0, 8], startDelay: 0.66 });
    list.push({ type: 'cylinder', mat: 'light', pos: [1.8, 0.1, 0.5], size: [0.12, 0.2, 10], startDelay: 0.68 }); // lamp shade

    // 14. Roof Structure & Overhang Ceiling
    // Concrete Roof Slab
    list.push({
      type: 'box',
      mat: 'concrete',
      pos: [0, 2.4, 0],
      size: [5.4, 0.1, 4.2],
      startDelay: 0.68
    });
    
    // Roof Overhang Under-Ceiling (Teak wood cladding underneath)
    list.push({
      type: 'box',
      mat: 'wood',
      pos: [0, 2.345, 0.8],
      size: [5.4, 0.01, 2.4],
      startDelay: 0.70
    });

    // Slanted architectural wood shading fins on the right side screen
    for (let i = 0; i < 8; i++) {
      list.push({
        type: 'box',
        mat: 'wood',
        pos: [2.5, 1.45, -1.8 + i * 0.4],
        size: [0.04, 1.8, 0.15],
        startDelay: 0.70 + i * 0.007
      });
    }

    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const p = scrollProgress.current; // 0.0 to 1.0 based on page scroll

    const completed = p >= 0.96;
    if (completed !== isCompleted) {
      setIsCompleted(completed);
      if (state.gl && state.gl.domElement) {
        state.gl.domElement.style.pointerEvents = completed ? 'auto' : 'none';
      }
    }

    if (!completed) {
      isInteracting.current = false;
    }

    // Animate building components based on local delay and scroll progress
    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child.userData && child.userData.startDelay !== undefined) {
          const delay = child.userData.startDelay;
          const localProg = THREE.MathUtils.clamp((p - delay) / 0.12, 0.0, 1.0);
          
          // Apply scale and translation drop
          const scale = localProg;
          child.scale.set(scale, scale, scale);
          
          // Slight vertical drop down as they assemble
          const originalY = child.userData.originalY;
          child.position.y = originalY + (1.0 - localProg) * 1.5;
        }
      });
    }

    // Camera travels around active build grid on scroll or user drag
    const camera = state.camera;
    if (!isInteracting.current) {
      const angle = 0.6 + p * 1.7; // Sweeps from 0.6 to 2.3 radians
      const radius = 7.0 - p * 1.5; // Sweeps from 7.0 down to 5.5 (closer view)
      const targetX = Math.cos(angle) * radius;
      const targetZ = Math.sin(angle) * radius;
      const targetY = 3.0 - p * 1.7; // From 3.0 down to 1.3 (perfect eye level)
      
      // Smoothly lerp towards target scroll position
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

      if (controlsRef.current) {
        controlsRef.current.target.x = THREE.MathUtils.lerp(controlsRef.current.target.x, 0, 0.05);
        controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, 0.2, 0.05);
        controlsRef.current.target.z = THREE.MathUtils.lerp(controlsRef.current.target.z, 0, 0.05);
        controlsRef.current.update();
      } else {
        camera.lookAt(0, 0.2, 0);
      }
    } else {
      // If user is interacting, just update the controls to apply damping inertia
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }

    // Subtle swinging of crane arm to make the site feel alive
    if (craneRef.current) {
      craneRef.current.rotation.y = Math.sin(time * 0.4) * 0.15 + (p * Math.PI * 0.5);
    }
  });

  return (
    <group>
      {/* OrbitControls to allow the user to move around in 3D */}
      <OrbitControls 
        ref={controlsRef}
        enabled={isCompleted}
        enableZoom={false} // Disable zoom so scroll wheel scrolls the page normally!
        enablePan={false}  // Disable panning so the user doesn't get lost
        enableRotate={isCompleted}
        enableDamping={true}
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05} // prevent going under the ground floor slab
        minDistance={3}
        maxDistance={12}
        onStart={handleStart}
        onEnd={handleEnd}
      />

      {/* Volumetric Fog */}
      <YellowFog scrollProgress={scrollProgress} baseOpacity={0.04} />

      {/* 3D Solid Crane Model (Steel) */}
      <group ref={craneRef} position={[2.5, -1.5, 2.5]}>
        {/* Vertical mast - Solid square pillar */}
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[0.16, 6.0, 0.16]} />
          <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Horizontal jib arm - Solid horizontal beam */}
        <group position={[0, 6.0, 0]}>
          <mesh position={[0.8, 0, 0]}>
            <boxGeometry args={[3.0, 0.08, 0.08]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Solid block counterweight at the short end */}
          <mesh position={[-0.5, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.16]} />
            <meshStandardMaterial color="#8c8d8f" metalness={0.1} roughness={0.8} />
          </mesh>

          {/* Crane operator cabin */}
          <mesh position={[0.15, -0.12, 0.12]}>
            <boxGeometry args={[0.2, 0.2, 0.15]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, -0.12, 0.20]}>
            <boxGeometry args={[0.18, 0.18, 0.01]} />
            <meshStandardMaterial color="#a9c8cc" metalness={0.9} roughness={0.15} transparent={true} opacity={0.6} />
          </mesh>

          {/* Trolley block sliding on jib */}
          <mesh position={[1.8, -0.07, 0]}>
            <boxGeometry args={[0.15, 0.06, 0.1]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
          </mesh>
          
          {/* Tension wire cables */}
          <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, -0.45]}>
            <cylinderGeometry args={[0.005, 0.005, 1.8]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Hanging load hook string */}
          <mesh position={[1.8, -1.75, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 3.5]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Torus Hook and Cargo steel beam */}
          <group position={[1.8, -3.5, 0]}>
            {/* Torus hook */}
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.04, 0.01, 8, 16]} />
              <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Steel cargo beam */}
            <mesh>
              <boxGeometry args={[0.4, 0.15, 0.15]} />
              <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
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
            {c.type === 'cylinder' ? (
              <cylinderGeometry args={[c.size[0], c.size[0], c.size[1], c.size[2] || 8]} />
            ) : (
              <boxGeometry args={c.size} />
            )}
            
            {c.mat === 'concrete' && (
              <meshStandardMaterial 
                color="#8c8d8f" 
                roughness={0.8} 
                metalness={0.2} 
              />
            )}
            {c.mat === 'plaster' && (
              <meshStandardMaterial 
                color="#f3f3f0" 
                roughness={0.9} 
                metalness={0.0} 
              />
            )}
            {c.mat === 'metal' && (
              <meshStandardMaterial 
                color="#2c2c2c" 
                roughness={0.3} 
                metalness={0.8} 
              />
            )}
            {c.mat === 'wood' && (
              <meshStandardMaterial 
                color="#b58c4c" 
                roughness={0.5} 
                metalness={0.1} 
              />
            )}
            {c.mat === 'glass' && (
              <meshStandardMaterial 
                color="#a9c8cc" 
                roughness={0.15} 
                metalness={0.9}
                transparent={true}
                opacity={0.35}
              />
            )}
            {c.mat === 'pool' && (
              <meshStandardMaterial 
                color="#2c7b8c" 
                roughness={0.1} 
                metalness={0.9}
                transparent={true}
                opacity={0.75}
              />
            )}
            {c.mat === 'sofa' && (
              <meshStandardMaterial 
                color="#dcd7c9" 
                roughness={0.85} 
                metalness={0.0} 
              />
            )}
            {c.mat === 'light' && (
              <meshBasicMaterial 
                color="#ffe3a8" 
              />
            )}
            {c.mat === 'brass' && (
              <meshStandardMaterial 
                color="#c5a059" 
                roughness={0.2} 
                metalness={0.9} 
              />
            )}
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
                color="#424242" 
                transparent={true} 
                opacity={isHovered ? 0.95 : 0.65} 
              />
            </mesh>

            {/* Glowing outer aura for milestones */}
            {isHovered && (
              <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#424242" transparent={true} opacity={0.22} />
              </mesh>
            )}

            {/* Floating metrics panel projection on hover */}
            {isHovered && (
              <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                <div style={{
                  background: 'rgba(66, 66, 66, 0.95)',
                  border: '1px solid #FFEA0A',
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
                  <div style={{ color: '#FFEA0A', fontWeight: 'bold', marginBottom: '2px' }}>
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
