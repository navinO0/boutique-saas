import React from 'react';
import { motion } from 'framer-motion';

const PookieLoader = ({ fullScreen = false }) => {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
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

  return (
    <div style={containerStyle}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {/* The Animated "Sketch" Outline Loop - FIXED PATH & DIRECTION */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <motion.path
            // Perfectly symmetrical boutique heart
            d="M 50, 28 
               C 50, 18 42, 8 28, 8 
               C 12, 8 8, 35 8, 45 
               C 8, 65 30, 85 50, 95 
               C 70, 85 92, 65 92, 45 
               C 92, 35 88, 8 72, 8 
               C 58, 8 50, 18 50, 28"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 1]
            }}
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Subtle Accent Sketch Line */}
          <motion.path
            d="M 38, 42 Q 50, 36 62, 42"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.2"
            strokeDasharray="1,2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
          />
        </svg>

        {/* Outer Glow / Halo Effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            position: 'absolute', 
            inset: '-10px', 
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: -1
          }}
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ 
          fontFamily: 'Playfair Display', 
          fontSize: '0.9rem', 
          color: 'var(--secondary)',
          marginTop: '2rem',
          letterSpacing: '3px',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontStyle: 'italic'
        }}
      >
        Sprinkling Magic...
      </motion.p>
    </div>
  );
};

export default PookieLoader;
