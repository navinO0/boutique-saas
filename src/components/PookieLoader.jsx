import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const PookieLoader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '300px',
      gap: '2rem'
    }}>
      <div style={{ position: 'relative' }}>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ color: 'var(--primary)' }}
        >
          <Heart size={60} fill="var(--primary)" />
        </motion.div>

        {/* Floating Sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4
            }}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%',
              color: 'var(--primary)'
            }}
          >
            <Sparkles size={16} />
          </motion.div>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ 
          fontFamily: 'Playfair Display', 
          fontSize: '1.2rem', 
          color: 'var(--secondary)',
          fontWeight: 700,
          letterSpacing: '1px'
        }}
      >
        Sprinkling magic... ✨
      </motion.p>
    </div>
  );
};

export default PookieLoader;
