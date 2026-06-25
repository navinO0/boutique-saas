import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveImageUrl } from '../utils/imageUtils';

const ShimmerImage = React.memo(({ src, alt, style, className, loading = "lazy", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  const resolvedSrc = resolveImageUrl(src);

  useEffect(() => {
    // Check if image is already cached
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [resolvedSrc]);

  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden', background: '#f5f5f5' }} className={className}>
      {/* The Shimmer/Placeholder Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
          pointerEvents: 'none',
          animation: isLoaded ? 'none' : 'shimmer-move 2s infinite linear',
        }}
      />

      <img
        ref={imgRef}
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: style?.objectFit || 'cover',
          display: 'block',
        }}
        {...props}
      />

      <style>{`
        @keyframes shimmer-move {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
});

export default ShimmerImage;
