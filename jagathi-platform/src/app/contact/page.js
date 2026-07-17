'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import HomeScene from '../../components/scenes/HomeScene';
import Footer from '../../components/Footer';

// Detect API base: in dev, Next.js proxies PHP via XAMPP at root;
// in static export hosted on XAMPP the files sit at /api/*.php
const API_BASE = '/api';

export default function ContactPage() {
  const scrollProgress = useRef(0);
  const [deskTime, setDeskTime] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pillar: 'Construction',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [submittingStep, setSubmittingStep] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // Live Desk Time (IST Zone)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setDeskTime(new Intl.DateTimeFormat('en-US', options).format(new Date()) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme configuration on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('home-theme-yellow-gray');
    return () => {
      document.body.classList.remove('home-theme-yellow-gray');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });
    setSubmittingStep('ESTABLISHING SECURE NODE CONNECTION...');

    // ── Request geolocation ──
    await new Promise(resolve => setTimeout(resolve, 600));
    setSubmittingStep('ACQUIRING TELEMETRY & REGION CODES...');
    
    let locationData = { latitude: null, longitude: null, error: 'Not requested' };
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0
          })
        );
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null
        };
        setSubmittingStep(`COORDINATES RESOLVED: ${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`);
      } else {
        locationData.error = 'Geolocation not supported';
        setSubmittingStep('TELEMETRY SCAN: NO HARDWARE RESPONSE');
      }
    } catch (err) {
      locationData.error = err.message || 'Permission denied';
      setSubmittingStep('TELEMETRY SCROLL: COMPROMISED / REFUSED');
    }

    await new Promise(resolve => setTimeout(resolve, 700));
    setSubmittingStep('ENCRYPTING INQUIRY ARCHIVE...');
    await new Promise(resolve => setTimeout(resolve, 600));
    setSubmittingStep('TRANSMITTING PACKET VIA SECURE ADVISORY CHANNEL...');

    const payload = { ...formData, location: locationData };

    try {
      const response = await fetch(`${API_BASE}/submit-lead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setReceiptData({
          id: `JGT-${new Date().getFullYear()}-${Math.random().toString(36).substring(3, 8).toUpperCase()}`,
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
          pillar: formData.pillar,
          name: formData.name,
          email: formData.email,
          location: locationData.latitude ? `${locationData.latitude.toFixed(6)}°N, ${locationData.longitude.toFixed(6)}°E` : 'Region Verification Bypassed',
        });
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', phone: '', pillar: 'Construction', message: '' });
      } else {
        throw new Error(result.message || 'Server error occurred');
      }
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message || 'Failed to submit.' });
    }
  };

  const pillars = [
    { id: 'Construction', label: 'Pillar 01', title: 'Build', subtitle: 'Construction & Land' },
    { id: 'Interior', label: 'Pillar 02', title: 'Curate', subtitle: 'Interior Systems' },
    { id: 'Civil Market', label: 'Pillar 03', title: 'Secure', subtitle: 'Civil Market' },
    { id: 'Other', label: 'Advisory', title: 'Consult', subtitle: 'Strategic Council' }
  ];

  return (
    <div
      id="contact-root"
      className="w-full relative min-h-screen text-[#424242] bg-transparent flex flex-col items-center justify-between"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      {/* ── 3D Canvas Background ── */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 6, 4]} intensity={0.7} />
          <HomeScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Main Content Area */}
      <section
        className="relative z-10 w-full flex flex-col items-center justify-center"
        style={{
          paddingTop: '13rem',
          paddingBottom: '8rem',
          maxWidth: '1200px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Typographic Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '1060px',
            marginBottom: '2.5rem',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1.5rem'
          }}
        >
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                color: 'rgba(66, 66, 66, 0.5)',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              // Pillar Integration Channel
            </span>
            <h1
              style={{
                fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
                fontSize: '2.5rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                lineHeight: '1.0',
                letterSpacing: '0.02em',
                margin: 0,
                color: '#424242'
              }}
            >
              ENGAGE <span style={{ color: 'rgba(66, 66, 66, 0.45)' }}>JAGATHI</span>
            </h1>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(66, 66, 66, 0.75)',
              lineHeight: '1.5',
              textAlign: 'right'
            }}
          >
            <div>GATEWAY: ACTIVE NODE / JGT_BENGALURU</div>
            <div>DESK ACTIVE: {deskTime || '09:00:00 AM IST'}</div>
          </div>
        </motion.div>

        {/* Massive Unified Contact Card (Split Layout with SHARP EDGES & EXPLICIT SPACING) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '1060px',
            backgroundColor: '#121315',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            minHeight: '760px',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Top glowing strip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: '#FFEA0A',
              zIndex: 20
            }}
          />

          {/* Left Pane: Spacious Form Controls with explicit typography and padding */}
          <div
            style={{
              flex: '1 1 58%',
              minWidth: '320px',
              padding: '3.5rem 3.5rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 10,
              boxSizing: 'border-box'
            }}
          >
            <AnimatePresence mode="wait">
              {status.success && receiptData ? (
                /* ── SUCCESS RECEIPT STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div
                      style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        backgroundColor: '#FFEA0A',
                        color: '#121315',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 14px rgba(255,234,10,0.3)',
                        borderRadius: '0px'
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: '"Basement Grotesque", sans-serif',
                          fontSize: '1.3rem',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          margin: 0,
                          letterSpacing: '0.05em'
                        }}
                      >
                        TRANSMISSION SECURED
                      </h2>
                      <p
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.5)',
                          margin: '4px 0 0 0',
                          letterSpacing: '0.1em'
                        }}
                      >
                        RECEIPT ID: {receiptData.id}
                      </p>
                    </div>
                  </div>

                  {/* Receipt Details Table */}
                  <div
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0px',
                      padding: '1.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>SENDER NAME</span>
                      <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{receiptData.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>SENDER EMAIL</span>
                      <span style={{ fontWeight: 'bold', color: '#FFEA0A' }}>{receiptData.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>PILLAR ROUTE</span>
                      <span style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' }}>{receiptData.pillar}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>TIMESTAMP</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{receiptData.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>VERIFIED REGION</span>
                      <span style={{ color: '#FFEA0A', fontWeight: 'bold', fontSize: '10px' }}>{receiptData.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                        lineHeight: '1.6',
                        fontFamily: '"Outfit", sans-serif',
                        margin: 0
                      }}
                    >
                      Your parameters have successfully bypassed regional validation protocols and are routed to the advisory desk. The desk SLA mandates review and response within 24 to 48 hours.
                    </p>
                    
                    {/* Decorative Digital Barcode */}
                    <div style={{ opacity: 0.35 }}>
                      <svg width="220" height="35" viewBox="0 0 220 35" fill="white">
                        <rect x="0" width="4" height="35" />
                        <rect x="8" width="2" height="35" />
                        <rect x="14" width="8" height="35" />
                        <rect x="26" width="3" height="35" />
                        <rect x="34" width="1" height="35" />
                        <rect x="40" width="6" height="35" />
                        <rect x="52" width="2" height="35" />
                        <rect x="58" width="4" height="35" />
                        <rect x="68" width="8" height="35" />
                        <rect x="82" width="1" height="35" />
                        <rect x="88" width="3" height="35" />
                        <rect x="96" width="6" height="35" />
                        <rect x="108" width="2" height="35" />
                        <rect x="114" width="8" height="35" />
                        <rect x="126" width="4" height="35" />
                        <rect x="134" width="2" height="35" />
                        <rect x="142" width="1" height="35" />
                        <rect x="148" width="6" height="35" />
                        <rect x="160" width="4" height="35" />
                        <rect x="168" width="2" height="35" />
                        <rect x="176" width="8" height="35" />
                        <rect x="190" width="1" height="35" />
                        <rect x="196" width="4" height="35" />
                        <rect x="204" width="6" height="35" />
                        <rect x="214" width="3" height="35" />
                      </svg>
                    </div>

                    <button
                      onClick={() => setStatus({ submitting: false, success: false, error: null })}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '1rem 2rem',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: 'fit-content'
                      }}
                      data-interactive
                    >
                      Transmit New Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── FORM STATE WITH SOLID BLOCK INPUTS & SPACIOUS PADDING ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2.5rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h2
                      style={{
                        fontFamily: '"Basement Grotesque", sans-serif',
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '0.03em',
                        color: '#ffffff'
                      }}
                    >
                      Transmit Inquiry
                    </h2>
                    <p
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.45)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}
                    >
                      Enter details to route your message to the appropriate advisory channel.
                    </p>
                  </div>

                  {/* Form fields Grid with wide spacing */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '1.75rem'
                      }}
                    >
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.15em',
                            color: '#FFEA0A',
                            display: 'block',
                            marginBottom: '0.6rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          Full Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={status.submitting}
                          style={{
                            width: '100%',
                            height: '54px',
                            backgroundColor: '#1b1c1e',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '0px',
                            paddingLeft: '1.25rem',
                            paddingRight: '1.25rem',
                            fontSize: '0.9rem',
                            color: '#ffffff',
                            fontFamily: '"Outfit", sans-serif',
                            boxSizing: 'border-box'
                          }}
                          placeholder="e.g. Arjun Mehta"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          style={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.15em',
                            color: '#FFEA0A',
                            display: 'block',
                            marginBottom: '0.6rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={status.submitting}
                          style={{
                            width: '100%',
                            height: '54px',
                            backgroundColor: '#1b1c1e',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '0px',
                            paddingLeft: '1.25rem',
                            paddingRight: '1.25rem',
                            fontSize: '0.9rem',
                            color: '#ffffff',
                            fontFamily: '"Outfit", sans-serif',
                            boxSizing: 'border-box'
                          }}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em',
                          color: '#FFEA0A',
                          display: 'block',
                          marginBottom: '0.6rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={status.submitting}
                        style={{
                          width: '100%',
                          height: '54px',
                          backgroundColor: '#1b1c1e',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '0px',
                          paddingLeft: '1.25rem',
                          paddingRight: '1.25rem',
                          fontSize: '0.9rem',
                          color: '#ffffff',
                          fontFamily: '"Outfit", sans-serif',
                          boxSizing: 'border-box'
                        }}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    {/* Pillar Selection Pills Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em',
                          color: '#FFEA0A',
                          display: 'block',
                          textTransform: 'uppercase'
                        }}
                      >
                        Select Routing Pillar
                      </label>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '1rem'
                        }}
                      >
                        {pillars.map((p) => {
                          const isSelected = formData.pillar === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              disabled={status.submitting}
                              onClick={() => setFormData(prev => ({ ...prev, pillar: p.id }))}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                                padding: '1.25rem 1.5rem',
                                border: isSelected ? '1px solid #FFEA0A' : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '0px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: isSelected ? '#FFEA0A' : '#1b1c1e',
                                color: isSelected ? '#121315' : '#ffffff',
                                boxSizing: 'border-box'
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '8px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.15em',
                                  color: isSelected ? 'rgba(18,19,21,0.6)' : 'rgba(255,255,255,0.4)',
                                  display: 'block',
                                  marginBottom: '0.25rem'
                                }}
                              >
                                {p.label}
                              </span>
                              <span
                                style={{
                                  fontFamily: '"Basement Grotesque", sans-serif',
                                  fontSize: '11px',
                                  fontWeight: '900',
                                  textTransform: 'uppercase',
                                  display: 'block'
                                }}
                              >
                                {p.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '9.5px',
                                  fontWeight: '300',
                                  color: isSelected ? 'rgba(18,19,21,0.75)' : 'rgba(255,255,255,0.5)',
                                  display: 'block',
                                  marginTop: '0.25rem'
                                }}
                              >
                                {p.subtitle}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message Brief Textarea */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        style={{
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em',
                          color: '#FFEA0A',
                          display: 'block',
                          marginBottom: '0.6rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        Outline Requirements
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={status.submitting}
                        rows={5}
                        style={{
                          width: '100%',
                          minHeight: '160px',
                          backgroundColor: '#1b1c1e',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '0px',
                          padding: '1rem 1.25rem',
                          fontSize: '0.9rem',
                          color: '#ffffff',
                          fontFamily: '"Outfit", sans-serif',
                          boxSizing: 'border-box',
                          resize: 'none',
                          lineHeight: '1.6'
                        }}
                        placeholder="Specify your architectural or layout parameters..."
                      />
                    </div>
                  </div>

                  {/* Error Notification */}
                  {status.error && (
                    <div
                      style={{
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        padding: '1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        borderRadius: '0px'
                      }}
                    >
                      ⚠ ERROR: {status.error}
                    </div>
                  )}

                  {/* Submit Trigger Button */}
                  <button
                    type="submit"
                    disabled={status.submitting}
                    data-interactive
                    style={{
                      width: '100%',
                      height: '56px',
                      backgroundColor: '#FFEA0A',
                      color: '#121315',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.25em',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: '"Basement Grotesque", "Syncopate", sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(255, 234, 10, 0.15)'
                    }}
                  >
                    {status.submitting ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', fontWeight: 'bold' }} className="animate-pulse">
                        {submittingStep}
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Transmit Signal <span>→</span>
                      </span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Pane: Light Google Maps Integration */}
          <div
            style={{
              flex: '1 1 42%',
              minWidth: '320px',
              backgroundColor: '#e5e3df',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Native Light Theme Google Map Frame */}
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5831969248483!2d77.57090057478794!3d12.925688587385292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15733f9eb8f1%3A0x20a0f600a33e887c!2sJAGATHI!5e0!3m2!1sen!2sin!4v1721187498424!5m2!1sen!2sin"
                style={{
                  height: '100%',
                  width: '100%',
                  border: 0
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Float HUD Overlays over Google Maps */}
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 10, pointerEvents: 'none' }}>
              <div
                style={{
                  backgroundColor: '#121315',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '0px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '8px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FFEA0A', display: 'block' }}>JAGATHI OFFICE</span>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', fontFamily: '"Basement Grotesque",sans-serif', display: 'block', marginTop: '2px' }}>Bengaluru HQ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem' }}>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span style={{ fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>ACTIVE</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none' }}>
              {/* Coordinates details */}
              <div
                style={{
                  backgroundColor: '#121315',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '1.25rem',
                  borderRadius: '0px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontFamily: 'monospace' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Coordinates</span>
                  <span style={{ color: '#FFEA0A', fontWeight: 'bold' }}>12.9257° N, 77.5735° E</span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '350', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontFamily: '"Outfit", sans-serif' }}>
                  4th Block, Jayanagar, Bengaluru, Karnataka 560011, India
                </div>
              </div>

              {/* Action Button */}
              <a
                href="https://maps.app.goo.gl/bGfvdfhjzKPAKJEh6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '1.1rem 0',
                  backgroundColor: '#1b1c1e',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '0px',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <span>Get Directions in Google Maps</span>
                <span style={{ fontSize: '10px', fontFamily: 'sans-serif', fontWeight: 'normal' }}>↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
