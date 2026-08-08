import React from 'react';
import Navbar from './components/Navbar';
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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-tealbrand-500/20 selection:text-tealbrand-900">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* 1. Cinematic Scroll Hero (Pinned 7-Beat GSAP Stage + Canvas Particles) */}
        <HeroCinematic />

        {/* 2. Showcase Grid (3D Product Cards) */}
        <ShowcaseGrid />

        {/* 3. Craft Parallax Banner */}
        <CraftParallaxBanner />

        {/* 4. Capabilities Grid (Hardware & Software Enterprise Stack) */}
        <CapabilitiesGrid />

        {/* 5. Typography Manifesto */}
        <ManifestoTypography />

        {/* 6. Telemetry & Scale System Board */}
        <TelemetryBoard />

        {/* 7. Core Flock Team Section */}
        <TeamSection />

        {/* 8. Contact & Project Initialization Form */}
        <ContactCanal />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
