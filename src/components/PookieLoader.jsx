import React from 'react';
import { motion } from 'framer-motion';

const PookieLoader = ({ fullScreen = false }) => {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(15px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    width: '100%'
  };

  const heartPath = "M 50, 28 C 50, 18 42, 8 28, 8 C 12, 8 8, 35 8, 45 C 8, 65 30, 85 50, 95 C 70, 85 92, 65 92, 45 C 92, 35 88, 8 72, 8 C 58, 8 50, 18 50, 28";
  const totalLen = 310;

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes heartCompleteFlow {
          0% {
            stroke-dasharray: 0, ${totalLen};
            stroke-dashoffset: 0;
            opacity: 1;
          }
          40% {
            stroke-dasharray: ${totalLen}, ${totalLen};
            stroke-dashoffset: 0;
            opacity: 1;
          }
          60% {
            stroke-dasharray: ${totalLen}, ${totalLen};
            stroke-dashoffset: 0;
            opacity: 1;
          }
          85% {
            stroke-dasharray: ${totalLen}, ${totalLen};
            stroke-dashoffset: -${totalLen};
            opacity: 0;
          }
          100% {
            stroke-dashoffset: -${totalLen};
            opacity: 0;
          }
        }
        @keyframes softPulse {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes hardPulse {
          0% { transform: scale(1); }
          15% { transform: scale(1.1); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
        }
      `}</style>

      <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Background Soft Pulse Effect - Tightened */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            width: '40px', height: '40px', 
            background: 'var(--primary)', 
            borderRadius: '50%', 
            filter: 'blur(15px)',
            animation: 'softPulse 2s ease-out infinite' 
          }} />
        </div>

        {/* The Outline Drawing Animation - Soft Finishing */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 2,
            overflow: 'visible',
            filter: 'drop-shadow(0 0 4px rgba(233,163,163,0.4))' // Soft finishing around the draw
          }}
        >
          <path
            d={heartPath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              animation: 'heartCompleteFlow 2.5s ease-in-out infinite'
            }}
          />
        </svg>

        {/* Center Static Guide Heart (Subtle Finishing) */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            zIndex: 1,
            filter: 'blur(0.5px)'
          }}
        >
          <path d={heartPath} fill="none" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="2 4" />
        </svg>

        {/* Center Hard Pulse Heart - Scaled Down */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'hardPulse 2s ease-in-out infinite',
          zIndex: 3
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '30px', height: '30px' }}>
            <path
              d={heartPath}
              fill="var(--primary)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(233,163,163,0.5))' }}
            />
          </svg>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ 
          fontFamily: 'Roboto', 
          fontSize: '0.75rem', 
          color: 'var(--secondary)',
          marginTop: '1.5rem',
          letterSpacing: '4px',
          fontWeight: 800,
          textTransform: 'uppercase'
        }}
      >
        Sprinkling Magic
      </motion.p>
    </div>
  );
};

export default PookieLoader;
