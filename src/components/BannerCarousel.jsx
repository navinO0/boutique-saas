import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BannerCarousel = ({ banners = [], fullWidth = false }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIdx];

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: fullWidth ? 'clamp(500px, 85vh, 900px)' : 'clamp(250px, 40vh, 500px)', 
      overflow: 'hidden', 
      borderRadius: fullWidth ? '0' : '40px', 
      marginBottom: fullWidth ? '0' : '4rem', 
      boxShadow: fullWidth ? 'none' : '0 25px 60px rgba(233,163,163,0.15)', 
      background: '#fffcfc' 
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => currentBanner.link && (currentBanner.link.startsWith('http') ? window.open(currentBanner.link, '_blank') : navigate(currentBanner.link))}
          style={{ position: 'relative', width: '100%', height: '100%', cursor: currentBanner.link ? 'pointer' : 'default' }}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={currentBanner.mobileImage || currentBanner.image} />
            <source media="(max-width: 1024px)" srcSet={currentBanner.tabletImage || currentBanner.image} />
            <img
              src={currentBanner.desktopImage || currentBanner.image}
              alt={currentBanner.title || 'Banner'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(74, 55, 55, 0.4) 0%, transparent 60%)' }}></div>
          <div style={{ position: 'absolute', bottom: fullWidth ? '30%' : '15%', left: fullWidth ? '10%' : '8%', color: 'white', maxWidth: '600px' }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}
            >
              <Sparkles size={14} /> {currentBanner.subtitle || 'Exclusive Collection'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontFamily: 'Roboto', marginBottom: '1rem', lineHeight: 1.1 }}
            >
              {currentBanner.title}
            </motion.h2>
            {currentBanner.buttonText && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="banner-cta"
                style={{
                  padding: '0.8rem 1.8rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  boxShadow: '0 10px 20px rgba(233,163,163,0.3)'
                }}
              >
                {currentBanner.buttonText}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          >
            <ChevronRight size={24} />
          </button>
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '8px', zIndex: 10 }}>
            {banners.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                style={{
                  width: i === currentIdx ? '30px' : '8px',
                  height: '8px',
                  background: i === currentIdx ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: '0.4s'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
