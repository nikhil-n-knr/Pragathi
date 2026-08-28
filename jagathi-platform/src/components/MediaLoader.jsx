'use client';

import React, { useState } from 'react';

export default function MediaLoader({
  type = 'image', // 'image' | 'video'
  src,
  alt = '',
  className = '',
  poster = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  aspectRatio = '16/9',
  style = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#18181b]/40 ${className}`}
      style={{ aspectRatio, ...style }}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse z-0" />
      )}

      {/* Image Loading */}
      {type === 'image' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0'
          }`}
          {...props}
        />
      )}

      {/* Video Loading */}
      {type === 'video' && (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0'
          }`}
          {...props}
        />
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 text-zinc-500 text-xs tracking-widest font-mono uppercase z-10">
          [ Asset Unreachable ]
        </div>
      )}
    </div>
  );
}
