import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowRight, Scissors, Sparkles, Briefcase, Phone, Mail, MapPin, Quote, Sparkle, X, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ProductDetailModal from '../components/ProductDetailModal';
import BannerCarousel from '../components/BannerCarousel';
import PookieLoader from '../components/PookieLoader';
import { resolveImageUrl } from '../utils/imageUtils';

const BookingModal = ({ isOpen, onClose }) => {
  const shop = useShop();
  const [formData, setFormData] = useState({ customer: '', phone: '', service: 'Custom Stitching', date: '', time: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    shop.showToast(`Booking request received!   We'll call you shortly.`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(255, 235, 235, 0.3)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            padding: 'clamp(1.5rem, 5vw, 3.5rem) clamp(1.2rem, 5vw, 3rem)',
            maxWidth: '550px',
            width: '100%',
            background: 'white',
            borderRadius: '12px 12px 0 0',
            position: 'relative',
            boxShadow: '0 -20px 60px rgba(233,163,163,0.3)',
            border: '2px solid #fff0f0',
            maxHeight: '92vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--primary)', background: '#fff0f0', border: 'none', borderRadius: '50%', padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={22} /></button>

          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '0.8rem' }}>Reserve Magic</h2>
            <p style={{ color: '#999', fontSize: 'clamp(0.75rem, 3vw, 1rem)', letterSpacing: '1px' }}>DREAM • MEASURE • CREATE</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Your Name</label>
              <input placeholder="Queen Name" type="text" required style={{ padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Phone Number</label>
              <input placeholder="+91" type="tel" required style={{ padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            <div className="booking-form-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Date</label>
                <input type="date" required style={{ padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontFamily: 'inherit', width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Time</label>
                <input type="time" required style={{ padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontFamily: 'inherit', width: '100%' }} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '1rem', padding: '1.3rem', background: 'var(--primary)', color: 'white', fontWeight: 800, borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 15px 30px rgba(233,163,163,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              Confirm Slot <Sparkles size={18} />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Hero = ({ onBook }) => {
  const glassStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(35px) saturate(160%)',
    WebkitBackdropFilter: 'blur(35px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.3)',
    padding: 'clamp(2.5rem, 6vw, 5rem)',
    maxWidth: '800px',
    position: 'relative',
    marginLeft: 0
  };

  return (
    <section style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      {/* Immersive Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/hero_mzqd33.jpg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
          alt="Couture background"
        />
        {/* Artistic Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%, rgba(0,0,0,0.3) 100%)' }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={glassStyle}
        >
          <div style={{ padding: '0.4rem 1rem', background: 'var(--primary)', borderRadius: '10px', color: 'white', width: 'fit-content', fontWeight: 800, letterSpacing: '3px', fontSize: 'clamp(0.5rem, 1.5vw, 0.65rem)', textTransform: 'uppercase', marginBottom: 'clamp(1rem, 3vw, 2rem)', boxShadow: '0 10px 20px rgba(233,163,163,0.3)' }}>
            Couture House • Est 2026
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 9vw, 7.5rem)', color: 'white', lineHeight: '0.9', marginBottom: 'clamp(1.2rem, 3vw, 2.5rem)', fontFamily: 'Roboto', letterSpacing: 'clamp(-1px, -0.4vw, -3px)', textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            Unfold Your <br />
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ color: 'var(--primary)', paddingLeft: 'clamp(0.8rem, 2.5vw, 2.5rem)', display: 'inline-block' }}>Aura.</motion.span>
          </h1>
          <p style={{ fontSize: 'clamp(0.78rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.95)', maxWidth: '560px', marginBottom: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: '1.9', letterSpacing: '0.01em', fontWeight: 500 }}>
            Bridging timeless heritage with futuristic silhouettes. We don't just stitch; we sculpt your dreams into wearable reality.
          </p>
          <div className="hero-cta-group">
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: 'white', color: 'var(--primary)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onBook}
              style={{ padding: 'clamp(0.8rem, 2.5vw, 1.3rem) clamp(1.6rem, 4vw, 3rem)', background: 'var(--primary)', color: 'white', borderRadius: '32px', fontWeight: 800, border: 'none', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.5px', boxShadow: '0 15px 35px rgba(233,163,163,0.4)', transition: '0.3s' }}
            >
              Start Your Journey
            </motion.button>
            <Link to="/products" style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontSize: 'clamp(0.65rem, 1.5vw, 0.78rem)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap' }}>
              The Gallery <ArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', bottom: '-20px', right: '40px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', padding: '1.5rem 2.5rem', borderRadius: '8px', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          >
            <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'Roboto', color: 'var(--primary)', lineHeight: 1 }}>500+</h4>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.3rem' }}>Masterpieces</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = ({ services }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section style={{ background: 'var(--white)', overflow: 'hidden', padding: '1rem 0 3rem' }}>
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', fontSize: 'clamp(0.55rem, 1.5vw, 0.72rem)' }}>Craftsmanship</span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontFamily: 'Roboto', color: 'var(--secondary)', lineHeight: 1.05, marginTop: '0.6rem' }}>Pure Artistry</h2>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%', 
        height: isMobile ? 'auto' : 'clamp(400px, 60vh, 700px)', 
        gap: '10px', 
        padding: '0 10px' 
      }}>
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={isMobile ? { height: '350px' } : { flex: 1 }}
            whileHover={!isMobile ? { flex: 2.5 } : { scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              borderRadius: '8px',
              height: isMobile ? '300px' : '100%',
              flex: isMobile ? 'none' : '1'
            }}
          >
            <img 
              src={service.image} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt={service.title} 
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%, rgba(0,0,0,0.2) 100%)' }}></div>
            
            <div style={{ 
              position: 'absolute', 
              bottom: '0', 
              left: '0', 
              width: '100%', 
              padding: isMobile ? '1.5rem' : 'clamp(1.5rem, 4vw, 3.5rem)',
              color: 'white'
            }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: isMobile ? '0.8rem' : 'clamp(0.8rem, 2vw, 1.1rem)', letterSpacing: '4px', display: 'block', marginBottom: '0.5rem' }}>0{idx + 1}</span>
              <h3 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Roboto', marginBottom: isMobile ? '0.5rem' : '1.2rem', whiteSpace: 'nowrap' }}>{service.title}</h3>
              <p style={{ 
                fontSize: '0.9rem', 
                lineHeight: 1.6, 
                opacity: isMobile ? 1 : 0, 
                transform: isMobile ? 'none' : 'translateY(20px)',
                transition: '0.5s',
                maxWidth: '400px'
              }} className="service-panel-desc">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {!isMobile && (
        <style>{`
          div:hover .service-panel-desc {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}</style>
      )}
    </section>
  );
};

const CustomCarousel = ({ catalog, onProductClick }) => {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Triple the catalog for a seamless loop in both directions
  const displayItems = (catalog && catalog.length > 0) ? [...catalog, ...catalog, ...catalog] : [];

  useEffect(() => {
    if (!catalog || catalog.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    // Start in the middle copy for seamless scrolling in both directions
    const oneThird = container.scrollWidth / 3;
    if (container.scrollLeft === 0) {
      container.scrollLeft = oneThird;
    }

    let animationFrameId;
    const speed = 0.8; // pixels per frame for auto-scroll

    const animateScroll = () => {
      if (!isDown && !isPaused) {
        container.scrollLeft += speed;

        const currentScroll = container.scrollLeft;
        const thirdWidth = container.scrollWidth / 3;

        if (currentScroll >= thirdWidth * 2) {
          container.scrollLeft = currentScroll - thirdWidth;
        } else if (currentScroll <= 0) {
          container.scrollLeft = currentScroll + thirdWidth;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDown, isPaused, catalog]);

  if (!catalog || catalog.length === 0) return null;

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDown(true);
    setHasDragged(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    setHasDragged(true);
    const container = containerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  };

  return (
    <section style={{ background: 'var(--secondary)', overflow: 'hidden', position: 'relative', padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      {/* Decorative Background Text - Optimized */}
      <div
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: '25vw', fontWeight: 700, color: 'var(--primary)', opacity: 0.03,
          whiteSpace: 'nowrap', zIndex: 0, fontFamily: 'Roboto', pointerEvents: 'none',
          userSelect: 'none',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}
      >
        ATELIER ATELIER ATELIER
      </div>

      <div className='container' style={{ marginBottom: 'clamp(2.5rem, 5vw, 5rem)', color: 'white', position: 'relative', zIndex: 2 }}>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', display: 'block', fontSize: '0.7rem' }}
        >
          Artisanal Heritage
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: 'Roboto', marginTop: '1rem', lineHeight: 1.05 }}
        >
          The Digital Gallery
        </motion.h2>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        className="no-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          cursor: isDown ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: '5vw',
          paddingBottom: 'clamp(2rem, 4vw, 4rem)',
          userSelect: 'none',
          scrollBehavior: 'auto'
        }}
      >
        <div className="luxury-gallery-track">
          {displayItems.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="premium-gallery-card"
              onClick={() => {
                if (!hasDragged && onProductClick) onProductClick(p.id);
              }}
              style={{
                userSelect: 'none',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <img
                src={resolveImageUrl(p.images?.[0] || p.image)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', borderRadius: '8px', background: '#fef5f5',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
                alt={p.name}
                loading="lazy"
                draggable="false"
              />
              <div className="card-glass-overlay" style={{ pointerEvents: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.5rem' }}>{p.category}</p>
                    <h3 style={{ color: 'white', fontSize: '2.2rem', fontFamily: 'Roboto', lineHeight: 1.1 }}>{p.name}</h3>
                  </div>
                  <div style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '8px', color: 'white', display: 'flex' }}><ArrowRight size={20} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import ErrorDisplay from '../components/ErrorDisplay';

const CategoryCarousel = ({ categories, onCategoryClick }) => {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayItems = (categories && categories.length > 0) ? [...categories, ...categories, ...categories] : [];

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const oneThird = container.scrollWidth / 3;
    if (container.scrollLeft === 0) {
      container.scrollLeft = oneThird;
    }

    let animationFrameId;
    const speed = 0.5;

    const animateScroll = () => {
      if (!isDown && !isPaused) {
        container.scrollLeft += speed;
        const currentScroll = container.scrollLeft;
        const thirdWidth = container.scrollWidth / 3;
        if (currentScroll >= thirdWidth * 2) {
          container.scrollLeft = currentScroll - thirdWidth;
        } else if (currentScroll <= 0) {
          container.scrollLeft = currentScroll + thirdWidth;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDown, isPaused, categories]);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    setHasDragged(true);
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => { setIsDown(false); setIsPaused(false); }}
      onMouseUp={() => setIsDown(false)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      className="no-scrollbar"
      style={{
        display: 'flex',
        overflowX: 'auto',
        cursor: isDown ? 'grabbing' : 'grab',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '1rem 5vw 1rem',
        gap: '2.5rem',
        userSelect: 'none'
      }}
    >
      {displayItems.map((cat, idx) => (
        <motion.div
          key={`${cat.id}-${idx}`}
          onClick={() => { if (!hasDragged) onCategoryClick(cat.id); }}
          style={{
            flexShrink: 0,
            width: 'clamp(280px, 40vw, 450px)',
            height: 'clamp(400px, 50vh, 600px)',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            transition: '0.4s'
          }}
          whileHover={{ y: -15, scale: 1.02 }}
        >
          <img src={cat.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={cat.name} draggable="false" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '2rem', fontFamily: 'Roboto', marginBottom: '0.5rem' }}>{cat.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px' }}>
              Explore <ArrowRight size={18} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CollectionRow = ({ products, onProductClick, isMobile }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Triple items for infinite feel
  const displayItems = [...products, ...products, ...products];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const oneThird = el.scrollWidth / 3;
    if (el.scrollLeft === 0) el.scrollLeft = oneThird;

    let frameId;
    const animate = () => {
      if (!isPaused && !isDragging) {
        el.scrollLeft += 0.8; // slightly faster for visibility
        if (el.scrollLeft >= oneThird * 2) el.scrollLeft -= oneThird;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, isDragging]);

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
    el.style.cursor = 'grabbing';
  };

  return (
    <div 
      ref={scrollRef}
      className="no-scrollbar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }}
      onTouchStart={() => setIsPaused(true)}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={(e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
      }}
      style={{
        display: 'flex',
        overflowX: 'auto',
        padding: isMobile ? '10px 10px 15px' : '15px 5vw 30px',
        gap: isMobile ? '12px' : '25px',
        cursor: 'grab',
        scrollSnapType: (isDragging || isPaused) ? 'none' : 'none' // Disable snap during auto-scroll
      }}
    >
      {displayItems.map((p, pIdx) => (
        <motion.div
          key={`${p.id}-${pIdx}`}
          whileHover={{ y: -12 }}
          onClick={() => !isDragging && onProductClick(p.id)}
          style={{
            flexShrink: 0,
            width: isMobile ? '240px' : 'clamp(280px, 25vw, 360px)',
            background: 'white',
            borderRadius: '12px',
            padding: '0.8rem',
            boxShadow: '0 20px 40px rgba(233,163,163,0.08)',
            border: '1px solid #fff5f5',
            cursor: 'pointer'
          }}
        >
          <div style={{ height: isMobile ? '280px' : 'clamp(320px, 45vh, 420px)', borderRadius: '8px', overflow: 'hidden', background: '#fefafa', position: 'relative' }}>
            <img src={p.images?.[0] || p.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={p.name} />
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.7rem', boxShadow: '0 5px 15px rgba(233,163,163,0.3)' }}>
              LATEST
            </div>
          </div>
          <div style={{ padding: '1.2rem 0.6rem 0.5rem' }}>
            <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem' }}>{p.category}</p>
            <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '0.6rem', fontWeight: 700 }}>{p.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #fef0f0', paddingTop: '0.8rem' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
              <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '50%', display: 'flex', color: 'white' }}>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const GroupedCollectionCarousels = ({ categories, products, onProductClick, onCategoryClick }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '40px', padding: '10px 0' }}>
      {categories.map((cat, idx) => {
        const catProducts = products.filter(p => p.category === cat.id);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} style={{ 
            overflow: 'hidden', 
            padding: isMobile ? '15px 0' : '40px 0',
            background: idx % 2 === 0 ? 'white' : 'rgba(233,163,163,0.02)'
          }}>
            <div className="container" style={{ marginBottom: isMobile ? '15px' : '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                  <div style={{ width: isMobile ? '40px' : '80px', height: '3px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                  <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', fontSize: isMobile ? '0.6rem' : '0.8rem' }}>Exquisite Selection</span>
                </div>
                <h2 style={{ 
                  fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 6vw, 4.5rem)', 
                  fontFamily: 'Playfair Display', 
                  color: 'var(--secondary)', 
                  lineHeight: 1,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-1px'
                }}>{cat.name}</h2>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, background: 'var(--primary)', color: 'white' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(cat.id)}
                style={{ 
                  padding: isMobile ? '0.8rem 1.5rem' : '1.2rem 2.8rem', 
                  background: 'white', 
                  border: '2px solid var(--primary)', 
                  borderRadius: '12px', 
                  color: 'var(--primary)', 
                  fontWeight: 900, 
                  fontSize: isMobile ? '0.75rem' : '0.9rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: '0 10px 25px rgba(233,163,163,0.15)',
                  transition: 'all 0.4s'
                }}
              >
                Discover Collection <ArrowRight size={18} />
              </motion.button>
            </div>

            <CollectionRow products={catProducts} onProductClick={onProductClick} isMobile={isMobile} />
          </section>
        );
      })}
    </div>
  );
};

const LandingPage = () => {
  useSmoothScroll();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { products, iconProducts, catalog, isLoading, error, fetchIconProducts, fetchProducts, clearError, addToCart, siteConfig } = useShop();

  useEffect(() => {
    fetchIconProducts();
    fetchProducts({ limit: 50 });
  }, []);

  if (error) return <ErrorDisplay message={error} onRetry={() => { clearError(); fetchIconProducts(); fetchProducts({ limit: 12 }); }} />;
  if (isLoading) return <PookieLoader fullScreen={true} />;

  return (
    <div style={{ background: 'var(--white)', overflow: 'hidden' }}>
      {siteConfig.banners && siteConfig.banners.length > 0 ? (
        <BannerCarousel banners={siteConfig.banners} fullWidth={true} />
      ) : (
        <Hero onBook={() => setIsBookingOpen(true)} />
      )}

      <Services services={siteConfig.services} />
      
      {/* Grouped Collection Carousels */}
      <section style={{ background: 'var(--accent)', padding: '10px 0' }}>
        <GroupedCollectionCarousels 
          categories={siteConfig.categories} 
          products={products} 
          onProductClick={(id) => navigate(`/product/${id}`)}
          onCategoryClick={(id) => navigate(`/products?category=${id}`)}
        />
      </section>


      <CustomCarousel catalog={products} onProductClick={(id) => navigate(`/product/${id}`)} />

      <section style={{ textAlign: 'center', background: 'white' }}>
        <div className="container" style={{ position: 'relative' }}>
          <motion.div
            whileInView={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: '-40px', left: '50%', marginLeft: '-40px', opacity: 0.1 }}
          >
            <Sparkle size={80} color="var(--primary)" />
          </motion.div>

          <Quote size={30} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
          <p style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.6rem)', color: 'var(--secondary)', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7, fontFamily: 'Roboto', padding: '0 1rem' }}>
            "Amara Boutique doesn't just create clothes; they capture emotions in architecture. The attention to detail is simply divine."
          </p>
          <div style={{ marginTop: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <p style={{ fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--primary)', fontSize: '0.7rem' }}>Anjali Varma</p>
            <p style={{ opacity: 0.4, fontSize: '0.72rem', marginTop: '0.4rem' }}>Bespoke Client since 2022</p>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default LandingPage;
