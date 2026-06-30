'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectOverlay({ selectedProject, onClose }) {
  if (!selectedProject) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden cursor-default"
      initial={{ 
        clipPath: 'inset(18% 22% 18% 22% round 30px)',
        opacity: 0
      }}
      animate={{ 
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        opacity: 1
      }}
      exit={{ 
        clipPath: 'inset(18% 22% 18% 22% round 30px)',
        opacity: 0
      }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Image / Render */}
      <div className="absolute inset-0 w-full h-full z-0 select-none">
        {selectedProject.image ? (
          <img 
            src={selectedProject.image} 
            alt={selectedProject.title} 
            decoding="async"
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-zinc-950 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl px-8 text-center flex flex-col items-center select-text">
        <span className="text-yellow-400 font-mono text-xs md:text-sm uppercase tracking-widest mb-4">
          {selectedProject.tag}
        </span>
        <h2 className="text-white font-extrabold text-4xl md:text-7xl uppercase tracking-wider mb-6 leading-tight">
          {selectedProject.title}
        </h2>
        <p className="text-gray-300 font-sans font-light text-sm md:text-lg max-w-2xl leading-relaxed">
          {selectedProject.desc}
        </p>
        
        <div className="mt-12 flex gap-4">
          {selectedProject.path && (
            <a
              href={selectedProject.path}
              className="bg-yellow-400 text-black px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-yellow-300 transition-colors rounded-sm"
              data-interactive
            >
              Enter Section
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="border border-white/20 text-white px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            data-interactive
          >
            Close Exploration
          </button>
        </div>
      </div>

      {/* Corner Technical Overlay Details */}
      <div className="absolute top-8 left-8 font-mono text-[9px] text-yellow-400/40 select-none hidden md:block">
        SYS_REF: [MORPH_FILL_100vw_100vh]
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[9px] text-yellow-400/40 select-none hidden md:block">
        FRAMEWORK: NEXT_MOTION_LIQUID_V2
      </div>
    </motion.div>
  );
}
