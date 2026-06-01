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
      aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '4 / 5' : '16 / 9',
      minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? '500px' : 'auto',
      overflow: 'hidden', 
      borderRadius: fullWidth ? '0' : '24px', 
      marginBottom: fullWidth ? '0' : '4rem', 
      boxShadow: fullWidth ? 'none' : '0 25px 60px rgba(0,0,0,0.1)', 
      background: 'var(--secondary)' 
    }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onClick={() => currentBanner.link && (currentBanner.link.startsWith('http') ? window.open(currentBanner.link, '_blank') : navigate(currentBanner.link))}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;
            const handleTouchEnd = (ee) => {
              const endX = ee.changedTouches[0].clientX;
              if (startX - endX > 50) nextSlide();
              if (endX - startX > 50) prevSlide();
              document.removeEventListener('touchend', handleTouchEnd);
            };
            document.addEventListener('touchend', handleTouchEnd);
          }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            cursor: currentBanner.link ? 'pointer' : 'default',
            zIndex: 1
          }}
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)', pointerEvents: 'none' }}></div>
          
          <div className="banner-content" style={{ 
            position: 'absolute', 
            bottom: '12%', 
            left: '6%', 
            color: 'white', 
            width: 'fit-content',
            maxWidth: '90%',
            zIndex: 5,
            display: 'flex',
            gap: '2rem'
          }}>
            {/* Signature Vertical Line - Hidden on very small mobile if desired, but making it responsive */}
            <div className="desktop-only" style={{ width: '2px', background: 'var(--primary)', height: '100px', alignSelf: 'center', opacity: 0.8 }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  color: 'var(--primary)', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '5px', 
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
                  fontFamily: 'Outfit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Sparkles size={14} /> {currentBanner.subtitle || 'Exclusive Collection'}
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ 
                  fontSize: 'clamp(2rem, 5vw, 5rem)', 
                  fontFamily: 'Playfair Display', 
                  marginBottom: '0.8rem', 
                  lineHeight: 1.0, 
                  color: 'white', 
                  letterSpacing: '-1px',
                  textShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}
              >
                {currentBanner.title}
              </motion.h2>

              {currentBanner.buttonText && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="banner-cta"
                  style={{
                    padding: '1rem 2.5rem',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '4px',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    width: 'fit-content',
                    boxShadow: '0 12px 30px rgba(233,163,163,0.3)',
                    transition: 'var(--transition)',
                    fontFamily: 'Outfit'
                  }}
                >
                  {currentBanner.buttonText}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            className="desktop-only"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="desktop-only"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
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
