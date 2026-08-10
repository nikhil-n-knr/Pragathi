import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import CookieBanner from './components/CookieBanner';

// Lazy-loaded dynamic imports for legal sub-pages
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));

function PagePreloader() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-tealbrand-700 font-bold uppercase tracking-widest">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-tealbrand-600 animate-ping"></span>
        <span>Loading Specification Deck...</span>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-tealbrand-500/20 selection:text-tealbrand-900 relative gallery-grid-pattern flex flex-col">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 flex-grow">
        <HeroCinematic />
        <AboutSection />
        <ShowcaseGrid />
        <CraftParallaxBanner />
        <CapabilitiesGrid />
        <ManifestoTypography />
        <TelemetryBoard />
        <TeamSection />
        <ContactCanal />
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  // Initialize Lenis Smooth Scroll
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
    <Suspense fallback={<PagePreloader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </Suspense>
  );
}
