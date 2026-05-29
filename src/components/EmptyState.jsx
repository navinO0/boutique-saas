import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ message = "We couldn't find any magic matching your search.", subtext = "Try adjusting your filters or searching for something else." }) => {
  const emptyImageUrl = "https://res.cloudinary.com/dzapdxkgc/image/upload/v1780070325/eamty_sy9wob.png";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '4rem 2rem', 
        textAlign: 'center',
        background: 'white',
        borderRadius: '40px',
        width: '100%'
      }}
    >
      <div style={{ position: 'relative', width: 'clamp(280px, 40vw, 450px)', marginBottom: '2rem' }}>
        <img 
          src={emptyImageUrl} 
          alt="No products found" 
          style={{ width: '100%', height: 'auto', borderRadius: '30px' }} 
        />
      </div>
      <h3 style={{ 
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
        fontFamily: 'Playfair Display', 
        color: 'var(--secondary)', 
        marginBottom: '1rem' 
      }}>
        {message}
      </h3>
      <p style={{ 
        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', 
        color: 'var(--text-light)', 
        maxWidth: '500px', 
        lineHeight: 1.6,
        fontWeight: 600
      }}>
        {subtext}
      </p>
    </motion.div>
  );
};

export default EmptyState;
