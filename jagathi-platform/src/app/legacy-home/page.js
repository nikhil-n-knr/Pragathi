'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../../components/Footer';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1], // Cubic bezier easeOut
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Hero Content Section */}
      <div className="flex-grow flex items-center justify-center px-8 py-32 z-10">
        <motion.div 
          className="max-w-5xl text-center flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Statement */}
          <motion.h1 
            className="text-white font-extrabold uppercase tracking-widest text-4xl sm:text-6xl md:text-7xl leading-tight"
            variants={itemVariants}
          >
            Shaping <span style={{ color: 'var(--brand-yellow)' }}>Landscapes</span>
          </motion.h1>

          {/* Sub Statement */}
          <motion.h2 
            className="text-white font-extrabold uppercase tracking-widest text-4xl sm:text-6xl md:text-7xl leading-tight"
            variants={itemVariants}
          >
            Building <span style={{ color: 'var(--brand-yellow)' }}>Legacies</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-gray-400 font-light text-lg sm:text-xl max-w-2xl mx-auto mt-4 leading-relaxed font-sans"
            variants={itemVariants}
          >
            Deploying continuous 3D systems and fluid interactive architectures to redefine corporate environments and spatial experiences.
          </motion.p>

          {/* Call to Action button */}
          <motion.div variants={itemVariants} className="mt-8">
            <a 
              href="/construction" 
              className="inline-block border border-yellow-400 text-yellow-400 px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-yellow-400 hover:text-black transition-colors duration-400 rounded-sm"
              data-interactive
            >
              Explore Portfolio
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Global Typographic Footer */}
      <Footer />
    </div>
  );
}
