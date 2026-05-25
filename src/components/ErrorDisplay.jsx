import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CloudOff, Sparkles } from 'lucide-react';

const ErrorDisplay = ({ message = "The magic was interrupted...", onRetry }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '6rem 2rem',
      minHeight: '400px',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        {/* Abstract "Broken Magic" Illustration */}
        <svg viewBox="0 0 200 200" style={{ width: '180px', height: '180px' }}>
          <motion.path
            d="M50 150 L150 50"
            stroke="#eee"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <motion.path
            d="M40 160 L140 60"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0.45, 0.45, 1], opacity: [1, 1, 0.5, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.55, 1] }}
          />
          <motion.circle
            cx="145" cy="55" r="5"
            fill="var(--primary)"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M80 80 L120 120 M120 80 L80 120"
            stroke="var(--primary)"
            strokeWidth="2"
            opacity="0.2"
          />
        </svg>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', inset: -20, border: '1px dashed #ffe4e1', borderRadius: '50%', zIndex: -1 }}
        />
      </div>

      <h2 style={{ 
        fontFamily: 'Playfair Display', 
        fontSize: '2rem', 
        color: 'var(--secondary)',
        marginBottom: '1rem'
      }}>
        {message}
      </h2>
      
      <p style={{ 
        color: '#999', 
        maxWidth: '400px', 
        lineHeight: 1.8, 
        marginBottom: '2.5rem',
        fontSize: '0.95rem'
      }}>
        Regrettably, even the finest dreams encounter a brief pause. May we suggest refreshing the page to invite the inspiration back? ✨
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem', 
            padding: '1rem 2.5rem', 
            background: 'var(--secondary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <RefreshCw size={18} /> Re-invite Magic
        </motion.button>
      )}
    </div>
  );
};

export default ErrorDisplay;
