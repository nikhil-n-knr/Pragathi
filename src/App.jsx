import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import HeroCinematic from './components/HeroCinematic';
import ShowcaseGrid from './components/ShowcaseGrid';
import CraftParallaxBanner from './components/CraftParallaxBanner';
import CapabilitiesGrid from './components/CapabilitiesGrid';
import ManifestoTypography from './components/ManifestoTypography';
import TelemetryBoard from './components/TelemetryBoard';
import TeamSection from './components/TeamSection';
import ContactCanal from './components/ContactCanal';
import Footer from './components/Footer';

export default function App() {
  // Initialize Lenis Smooth Scroll for silky 60fps/120fps scroll physics
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-tealbrand-500/20 selection:text-tealbrand-900 relative gallery-grid-pattern">
      {/* Interactive Global Particle Canvas */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Cinematic Pinned Scroll Hero */}
        <HeroCinematic />

        {/* 2. Showcase Grid */}
        <ShowcaseGrid />

        {/* 3. Craft Parallax Banner */}
        <CraftParallaxBanner />

        {/* 4. Capabilities Grid */}
        <CapabilitiesGrid />

        {/* 5. Typography Manifesto */}
        <ManifestoTypography />

        {/* 6. Telemetry & Scale Board */}
        <TelemetryBoard />

        {/* 7. Core Flock Team Section */}
        <TeamSection />

        {/* 8. Contact & Project Form */}
        <ContactCanal />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
