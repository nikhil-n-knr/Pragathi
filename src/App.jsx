import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import HeroCinematic from './components/HeroCinematic';
import AboutSection from './components/AboutSection';
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
      {/* Global Particle Field */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Cinematic Pinned Scroll Hero */}
        <HeroCinematic />

        {/* 2. Who We Are / About Section */}
        <AboutSection />

        {/* 3. System Registry / Flagship Platforms Showcase */}
        <ShowcaseGrid />

        {/* 4. Craft Parallax Banner */}
        <CraftParallaxBanner />

        {/* 5. Service Directory / Core Competencies */}
        <CapabilitiesGrid />

        {/* 6. Typography Manifesto */}
        <ManifestoTypography />

        {/* 7. Telemetry & Scale Board */}
        <TelemetryBoard />

        {/* 8. Partnership Registry / Core Flock */}
        <TeamSection />

        {/* 9. Communication Canal / Contact Form */}
        <ContactCanal />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
