'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/kenBurns.module.css';

/**
 * DisciplineVideo
 * ─────────────────────────────────────────
 * Lazy-loads a looping video for a discipline card.
 * Behaviour:
 *  1. Shows static <img> with Ken Burns animation immediately (no flash)
 *  2. IntersectionObserver triggers video load when card enters viewport
 *  3. Once video can play, it fades in over the static image
 *  4. If no videoSrc provided or load fails → stays on Ken Burns img forever
 */
export default function DisciplineVideo({ imageSrc, videoSrcWebm, videoSrcMp4, alt, kenBurnsClass, isActive }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  // Lazy-load: only inject video src when wrapper enters the viewport
  useEffect(() => {
    if (!videoSrcWebm && !videoSrcMp4) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            // Assign sources and load
            if (videoRef.current.children.length === 0) {
              if (videoSrcWebm) {
                const src1 = document.createElement('source');
                src1.src = videoSrcWebm;
                src1.type = 'video/webm';
                videoRef.current.appendChild(src1);
              }
              if (videoSrcMp4) {
                const src2 = document.createElement('source');
                src2.src = videoSrcMp4;
                src2.type = 'video/mp4';
                videoRef.current.appendChild(src2);
              }
              videoRef.current.load();
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [videoSrcWebm, videoSrcMp4]);

  // When video is ready to play, mark it visible
  const handleCanPlay = () => {
    setVideoReady(true);
    // Small delay so the crossfade isn't jarring
    setTimeout(() => setVideoLoaded(true), 80);
  };

  const hasVideo = Boolean(videoSrcWebm || videoSrcMp4);

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden">

      {/* ── Layer 1: Ken Burns still image (always present as base/fallback) ── */}
      <img
        src={imageSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover block ${kenBurnsClass}`}
        style={{
          filter: isActive ? 'brightness(1.06)' : 'brightness(0.92)',
          transition: 'filter 0.9s ease, opacity 0.8s ease',
          // Fade out once video is ready
          opacity: videoLoaded ? 0 : 1,
          zIndex: 1,
        }}
      />

      {/* ── Layer 2: Looping video (only rendered when video source exists) ── */}
      {hasVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={handleCanPlay}
          className="absolute inset-0 w-full h-full object-cover block"
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease',
            filter: isActive ? 'brightness(1.06)' : 'brightness(0.92)',
            zIndex: 2,
          }}
        />
      )}

      {/* ── Layer 3: Edge gradient blending toward text panel ── */}
      {/* Applied by parent — slot for children */}
    </div>
  );
}
