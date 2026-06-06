import React from 'react';
import { motion } from 'framer-motion';

const PookieLoader = ({ fullScreen = false, mini = false }) => {
  const containerStyle = mini ? {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : (fullScreen ? {
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
  });

  const heartPath = "M 50, 30 C 50, 20 42, 10 28, 10 C 12, 10 8, 35 8, 45 C 8, 65 30, 85 50, 95 C 70, 85 92, 65 92, 45 C 92, 35 88, 10 72, 10 C 58, 10 50, 20 50, 30";
  const totalLen = 310;

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes drawOutline {
          0% {
            stroke-dasharray: 0, ${totalLen};
            stroke-dashoffset: 0;
            opacity: 0.1;
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
          100% {
            stroke-dasharray: ${totalLen}, ${totalLen};
            stroke-dashoffset: -${totalLen};
            opacity: 0;
          }
        }
      `}</style>

      <div style={{ position: 'relative', width: mini ? '18px' : '50px', height: mini ? '18px' : '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Minimal Static Underlay */}
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
          <path d={heartPath} fill="none" stroke="var(--primary)" strokeWidth="2" />
        </svg>

        {/* The Animated Outline */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 2,
            overflow: 'visible',
            filter: mini ? 'none' : 'drop-shadow(0 0 8px var(--glow))'
          }}
        >
          <path
            d={heartPath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={mini ? "10" : "5"}
            strokeLinecap="round"
            style={{
              animation: 'drawOutline 3s ease-in-out infinite'
            }}
          />
        </svg>
      </div>
      
      {!mini && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ 
            fontFamily: 'Outfit', 
            fontSize: '0.6rem', 
            color: 'var(--primary)',
            marginTop: '1.2rem',
            letterSpacing: '5px',
            fontWeight: 400,
            textTransform: 'uppercase'
          }}
        >
          LOADING...
        </motion.p>
      )}
    </div>
  );
};

export default PookieLoader;
