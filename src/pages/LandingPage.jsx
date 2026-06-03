import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowRight, Scissors, Sparkles, Briefcase, Phone, Mail, MapPin, Quote, Sparkle, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ProductDetailModal from '../components/ProductDetailModal';
import BannerCarousel from '../components/BannerCarousel';
import PookieLoader from '../components/PookieLoader';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { resolveImageUrl } from '../utils/imageUtils';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

const BookingModal = ({ isOpen, onClose }) => {
  const shop = useShop();
  const [formData, setFormData] = useState({ customer: '', phone: '', service: 'Custom Stitching', date: '', time: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    shop.showToast(`Booking request received! We'll call you shortly.`);
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
            borderRadius: '10px 10px 0 0',
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
  return (
    <section style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/hero_mzqd33.jpg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
          alt="Couture background"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%, rgba(0,0,0,0.3) 100%)' }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '0 5vw' }}>
        <div style={{
            position: 'absolute',
            top: '-2rem',
            left: '-1rem',
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            fontFamily: 'Playfair Display',
            fontWeight: 900,
            color: 'white',
            opacity: 0.04,
            zIndex: -1,
            letterSpacing: '10px',
            pointerEvents: 'none',
            textTransform: 'uppercase'
        }}>
            AMARA
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '900px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.9 }}>
            <div style={{ width: 'clamp(20px, 5vw, 40px)', height: '1px', background: 'var(--primary)' }} />
            <span style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 800, color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: 'Outfit' }}>Couture House Est. 2026</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3.8rem, 11vw, 9rem)',
            color: 'white',
            lineHeight: '0.85',
            fontFamily: 'Playfair Display',
            letterSpacing: '-2px',
            textShadow: '0 20px 40px rgba(0,0,0,0.3)',
            margin: '0.5rem 0'
          }}>
            <span style={{ display: 'block', marginBottom: '0.2rem' }}>Unfold</span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 500, display: 'block' }}
            >
              Your Aura.
            </motion.span>
          </h1>

          <div style={{ maxWidth: '520px' }}>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.7',
              fontFamily: 'Outfit',
              marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              letterSpacing: '0.5px'
            }}>
              Bridging timeless heritage with futuristic silhouettes. <br className="desktop-only" />
              We sculpt your dreams into wearable reality.
            </p>

            <div className="hero-cta-group" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(233,163,163,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onBook}
                style={{
                  padding: window.innerWidth < 768 ? '0.8rem 1.8rem' : '1.1rem 2.8rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '10px',
                  fontWeight: 900,
                  border: 'none',
                  fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'Outfit'
                }}
              >
                Inquire Now
              </motion.button>
              <Link to="/products" style={{
                position: 'relative',
                fontWeight: 800,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'Outfit',
                paddingBottom: '0.6rem'
              }}>
                View Catalog <ArrowRight size={16} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
              </Link>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(-3rem, 10vw, 4rem)',
            left: '5vw',
            background: 'linear-gradient(135deg, rgba(255, 192, 192, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(30px)',
            padding: '1.2rem 2.5rem',
            borderRadius: '100px',
            border: '1px solid rgba(255, 192, 192, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            color: 'white',
            boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
            zIndex: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: 'Playfair Display', fontWeight: 900, color: 'white' }}>500+</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)' }}>Masterpieces</span>
                <div style={{ width: '30px', height: '1px', background: 'var(--primary)', marginTop: '2px' }} />
            </div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>ESTABLISHED</span>
            <span style={{ fontSize: '1rem', fontFamily: 'Outfit', fontWeight: 600 }}>2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = ({ services }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section style={{ background: 'var(--white)', overflow: 'hidden', padding: '1rem 0 3rem' }}>
      <div className="container" style={{ marginBottom: '1.2rem' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ color: 'var(--secondary)', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', fontSize: 'clamp(0.55rem, 1.5vw, 0.72rem)', fontFamily: 'Outfit' }}>Craftsmanship</span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontFamily: 'Playfair Display', color: 'var(--primary)', lineHeight: 1.05, marginTop: '0.6rem' }}>Pure Artistry</h2>
        </div>
      </div>

      {isMobile ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0 10px' }}>
          {services.map((service, idx) => (
            <div
              key={service.id}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '12px', height: '200px' }}
            >
              <img src={service.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={service.title} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 65%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '0.8rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '3px', display: 'block', marginBottom: '0.25rem' }}>0{idx + 1}</span>
                <h3 style={{ fontSize: '0.95rem', fontFamily: 'Playfair Display', color: 'white', lineHeight: 1.2, fontWeight: 700 }}>{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'clamp(400px, 60vh, 700px)', gap: '10px', padding: '0 10px' }}>
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ flex: 1 }}
              whileHover={{ flex: 2.5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '8px', height: '100%', flex: 1 }}
            >
              <img src={service.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={service.title} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%, rgba(0,0,0,0.2) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: 'clamp(1.5rem, 4vw, 3.5rem)', color: 'white' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', letterSpacing: '4px', display: 'block', marginBottom: '0.5rem' }}>0{idx + 1}</span>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Playfair Display', color: 'white', marginBottom: '1.2rem', whiteSpace: 'nowrap', textShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>{service.title}</h3>
                <p style={{
                  fontSize: '0.9rem', lineHeight: 1.6, opacity: 0, transform: 'translateY(20px)', transition: '0.5s', maxWidth: '400px'
                }} className="service-panel-desc">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
  if (!catalog || catalog.length === 0) return null;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section style={{ background: 'var(--secondary)', overflow: 'hidden', position: 'relative', padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
      <div
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: '25vw', fontWeight: 700, color: 'var(--primary)', opacity: 0.03,
          whiteSpace: 'nowrap', zIndex: 0, fontFamily: 'Roboto', pointerEvents: 'none',
          userSelect: 'none', maxWidth: '100vw', overflow: 'hidden'
        }}
      >
        ATELIER ATELIER ATELIER
      </div>

      <div className='container' style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'white', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}
        >
          <div style={{ width: '50px', height: '2px', background: 'var(--primary)' }} />
          <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.65rem', fontFamily: 'Outfit' }}>Artisanal Heritage</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'Playfair Display', marginTop: '0', lineHeight: 1.0, fontWeight: 700, fontStyle: 'italic', color: 'white', letterSpacing: '-1px' }}
          className="section-heading"
        >
          The Digital
          <span style={{ color: 'var(--primary)', display: 'block', fontWeight: 500 }}>Gallery.</span>
        </motion.h2>
      </div>

      <div style={{ position: 'relative', padding: '0 5vw' }}>
        <Swiper
          modules={[Autoplay, Navigation, FreeMode]}
          spaceBetween={isMobile ? 15 : 30}
          slidesPerView={'auto'}
          loop={true}
          freeMode={true}
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={{ nextEl: '.gallery-next', prevEl: '.gallery-prev' }}
          className="luxury-gallery-swiper"
          style={{ overflow: 'visible' }}
        >
          {catalog.map((p, idx) => (
            <SwiperSlide key={`${p.id}-${idx}`} style={{ width: 'auto' }}>
              <motion.div
                className="premium-gallery-card"
                onClick={() => onProductClick(p.id)}
                style={{ userSelect: 'none', flexShrink: 0, cursor: 'pointer', width: isMobile ? '160px' : '320px', height: isMobile ? '230px' : '440px' }}
              >
                <img
                  src={resolveImageUrl(p.images?.[0] || p.image)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.19,1,0.22,1)' }}
                  alt={p.name}
                />
                <div className="card-glass-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.4rem' }}>{p.category}</p>
                      <h3 style={{ color: 'white', fontSize: isMobile ? '1.1rem' : '1.4rem', fontFamily: 'Playfair Display', lineHeight: 1.15, fontStyle: 'italic' }}>{p.name}</h3>
                    </div>
                    <div style={{ background: 'var(--primary)', padding: '0.55rem', borderRadius: '8px', color: 'white' }}><ArrowRight size={18} /></div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <motion.button whileHover={{ scale: 1.1, background: 'var(--primary)' }} className="gallery-prev swiper-custom-nav" style={{ left: '1rem' }}><ChevronLeft size={24} /></motion.button>
        <motion.button whileHover={{ scale: 1.1, background: 'var(--primary)' }} className="gallery-next swiper-custom-nav" style={{ right: '1rem' }}><ChevronRight size={24} /></motion.button>
      </div>

      <style>{`
        .swiper-custom-nav {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 100;
          background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2); width: 55px; height: 55px;
          border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.4s; box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        .swiper-custom-nav:hover { border-color: var(--primary); box-shadow: 0 0 25px rgba(233,163,163,0.3); }
        .swiper-custom-nav.swiper-button-disabled { opacity: 0; pointer-events: none; }
        @media (max-width: 768px) { .swiper-custom-nav { display: none; } }
      `}</style>
    </section>
  );
};

const CategoryCarousel = ({ categories, onCategoryClick }) => {
  if (!categories || categories.length === 0) return null;
  return (
    <div style={{ padding: '1rem 0' }}>
      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={20}
        slidesPerView={'auto'}
        freeMode={true}
        className="category-swiper"
        style={{ padding: '1rem 5vw' }}
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={`${cat.id}-${idx}`} style={{ width: 'auto' }}>
            <motion.div
              onClick={() => onCategoryClick(cat.id)}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{
                width: 'clamp(140px, 20vw, 225px)', height: 'clamp(200px, 25vh, 300px)',
                position: 'relative', borderRadius: '8px', overflow: 'hidden',
                boxShadow: '0 12px 25px rgba(0,0,0,0.15)', transition: '0.4s', cursor: 'pointer'
              }}
            >
              <img src={cat.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={cat.name} draggable="false" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.2rem' }}>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontFamily: 'Roboto', marginBottom: '0.3rem' }}>{cat.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const CollectionRow = ({ products, onProductClick, isMobile }) => {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ position: 'relative', padding: '0 5vw' }}>
      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={isMobile ? 12 : 25}
        slidesPerView={'auto'}
        freeMode={true}
        navigation={{
          nextEl: `.row-next-${products?.[0]?.category || 'default'}`,
          prevEl: `.row-prev-${products?.[0]?.category || 'default'}`,
        }}
        className="collection-swiper"
        style={{ padding: '15px 0 30px' }}
      >
        {products.map((p, pIdx) => (
          <SwiperSlide key={`${p.id}-${pIdx}`} style={{ width: 'auto' }}>
            <motion.div
              whileHover={!isMobile ? { y: -12 } : {}}
              onClick={() => onProductClick(p.id)}
              style={{
                width: isMobile ? '42vw' : 'clamp(140px, 12vw, 190px)',
                background: 'white', borderRadius: '12px', padding: '0.4rem',
                boxShadow: '0 20px 40px rgba(233,163,163,0.08)', border: '1px solid #fff5f5', cursor: 'pointer'
              }}
            >
              <div style={{ height: isMobile ? '190px' : '230px', borderRadius: '10px', overflow: 'hidden', background: '#fefafa', position: 'relative' }}>
                <img src={p.images?.[0] || p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: 'var(--primary)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.5rem', letterSpacing: '1px' }}>
                  LATEST
                </div>
              </div>
              <div style={{ padding: '0.8rem 0.5rem 0.5rem' }}>
                <p style={{ color: 'var(--primary)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.category}</p>
                <h3 style={{ fontSize: '0.95rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', margin: '0.4rem 0', fontWeight: 700 }}>{p.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #fef0f0', paddingTop: '0.6rem' }}>
                  <p style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                  <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', color: 'white', display: 'flex' }}>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isMobile && (
        <>
          <motion.button 
            whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }}
            className={`row-prev-${products?.[0]?.category || 'default'} collection-nav-btn`} 
            style={{ left: '1rem' }}
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }}
            className={`row-next-${products?.[0]?.category || 'default'} collection-nav-btn`} 
            style={{ right: '1rem' }}
          >
            <ChevronRight size={18} />
          </motion.button>
        </>
      )}

      <style>{`
        .collection-nav-btn {
          position: absolute; top: 45%; transform: translateY(-50%); z-index: 10;
          background: white; border: 1px solid #fef0f0; width: 42px; height: 42px;
          border-radius: 50%; color: var(--secondary); display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: 0.3s;
          box-shadow: 0 8px 20px rgba(233,163,163,0.15);
        }
        .collection-nav-btn:hover { box-shadow: 0 0 20px rgba(233,163,163,0.3); }
        .collection-nav-btn.swiper-button-disabled { opacity: 0; pointer-events: none; }
      `}</style>
    </div>
  );
};

const HandpickedCollection = ({ products, onProductClick }) => {
  if (!products || products.length === 0) return null;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section style={{ background: '#fffcfc', padding: 'clamp(4rem, 8vw, 6rem) 0', position: 'relative', overflow: 'hidden' }}>
      <div 
        style={{ 
          position: 'absolute', top: '5%', right: '-5%', fontSize: '15vw', 
          fontFamily: 'Playfair Display', fontWeight: 900, color: 'var(--primary)', 
          opacity: 0.03, pointerEvents: 'none', fontStyle: 'italic' 
        }}
      >
        Curated
      </div>

      <div className="container" style={{ marginBottom: '4rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
                  <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.72rem', fontFamily: 'Outfit' }}>The Signature Edit</span>
                  <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1, fontWeight: 700 }}>Our Handpicked <br/><span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 500 }}>Collection.</span></h2>
          </div>
      </div>

      <div style={{ position: 'relative', padding: '0 5vw' }}>
          <Swiper
              modules={[FreeMode, Navigation]}
              spaceBetween={isMobile ? 15 : 35}
              slidesPerView={'auto'}
              freeMode={true}
              navigation={{ nextEl: '.handpicked-next', prevEl: '.handpicked-prev' }}
              className="handpicked-swiper"
          >
              {products.map((p, idx) => (
                  <SwiperSlide key={p.id} style={{ width: 'auto' }}>
                      <motion.div
                          whileHover={{ y: -15 }}
                          onClick={() => onProductClick(p.id)}
                          style={{ 
                              width: isMobile ? '160px' : '300px', 
                              cursor: 'pointer',
                              position: 'relative'
                          }}
                      >
                          <div style={{ height: isMobile ? '220px' : '420px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(233,163,163,0.12)', border: '1px solid #fff0f0' }}>
                              <img src={resolveImageUrl(p.images?.[0] || p.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', padding: '0.3rem 0.7rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>0{idx+1}</span>
                              </div>
                          </div>
                          <div style={{ padding: '2rem 1rem 0', textAlign: 'center' }}>
                              <p style={{ color: 'var(--primary)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.6rem' }}>{p.category}</p>
                              <h3 style={{ fontSize: '1rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', fontWeight: 700, fontStyle: 'italic' }}>{p.name}</h3>
                              <div style={{ width: '30px', height: '2px', background: 'var(--primary)', margin: '1rem auto' }} />
                              <p style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '1.1rem' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                          </div>
                      </motion.div>
                  </SwiperSlide>
              ))}
          </Swiper>

          {!isMobile && (
              <>
                  <motion.button whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }} className="handpicked-prev swiper-premium-nav" style={{ left: '1.5rem' }}><ChevronLeft size={22} /></motion.button>
                  <motion.button whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }} className="handpicked-next swiper-premium-nav" style={{ right: '1.5rem' }}><ChevronRight size={22} /></motion.button>
              </>
          )}
      </div>

      <style>{`
        .swiper-premium-nav {
          position: absolute; top: 40%; transform: translateY(-50%); z-index: 100;
          background: white; border: 1px solid #fff0f0; width: 60px; height: 60px;
          border-radius: 50%; color: var(--secondary); display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: all 0.4s;
          box-shadow: 0 15px 35px rgba(233,163,163,0.1);
        }
        .swiper-premium-nav:hover { box-shadow: 0 0 30px rgba(233,163,163,0.3); border-color: var(--primary); }
        .swiper-premium-nav.swiper-button-disabled { opacity: 0; pointer-events: none; }
      `}</style>
    </section>
  );
};

const GroupedCollectionCarousels = ({ collectionsData, onProductClick, onCategoryClick }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const COLLECTIONS = Object.entries(collectionsData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '30px', padding: isMobile ? '8px 0 16px' : '16px 0 32px' }}>
      {COLLECTIONS.map(([COLLECTION_ID, DATA], idx) => {
        const { name: COLLECTION_NAME, products: COLLECTION_PRODUCTS } = DATA;
        if (!COLLECTION_PRODUCTS || COLLECTION_PRODUCTS.length === 0) return null;

        return (
          <section key={COLLECTION_ID} className="collection-section" style={{
            overflow: 'hidden', paddingTop: isMobile ? '12px' : '20px',
            background: idx % 2 === 0 ? 'white' : 'rgba(233,163,163,0.02)'
          }}>
            <div className="container" style={{ marginBottom: isMobile ? '15px' : '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1px' }}>
                  <div style={{ width: isMobile ? '40px' : '80px', height: '3px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                  <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Exquisite Selection</span>
                </div>
                <h2 style={{
                  fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Playfair Display',
                  color: 'var(--secondary)', lineHeight: 1.1, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.5px'
                }}>{COLLECTION_NAME}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, background: 'var(--primary)', color: 'white' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(COLLECTION_ID)}
                style={{
                  padding: isMobile ? '0.5rem 1rem' : '0.7rem 1.8rem', background: 'white',
                  border: '1.5px solid var(--primary)', borderRadius: '10px', color: 'var(--primary)',
                  fontWeight: 900, fontSize: isMobile ? '0.65rem' : '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.1rem', textTransform: 'uppercase',
                  letterSpacing: '1px', boxShadow: '0 8px 20px rgba(233,163,163,0.12)', transition: 'all 0.4s'
                }}
              >
                Discover Collection <ArrowRight size={isMobile ? 12 : 16} />
              </motion.button>
            </div>
            <CollectionRow products={COLLECTION_PRODUCTS} onProductClick={onProductClick} isMobile={isMobile} />
          </section>
        );
      })}
    </div>
  );
};

const LandingPage = () => {
  useSmoothScroll();
  const navigate = useNavigate();
  const { products, fetchIconProducts, fetchHandpickedProducts, handpickedProducts, fetchProducts, clearError, siteConfig, getHeaders, error } = useShop();
  const [IS_BOOKING_OPEN, SET_IS_BOOKING_OPEN] = useState(false);
  const [COLLECTIONS_DATA, SET_COLLECTIONS_DATA] = useState({});
  const [IS_INITIAL_LOADING, SET_IS_INITIAL_LOADING] = useState(true);

  useEffect(() => {
    const LOAD_DATA = async () => {
        try {
            await fetchIconProducts();
            await fetchHandpickedProducts();
            await fetchProducts({ limit: 20 });
            const COLLECTIONS = siteConfig.categories || [];
            const DATA_MAP = {};
            for (const CAT of COLLECTIONS) {
                const COLLECTION_ID = CAT.id;
                try {
                    const resp = await axios.get(`${API_BASE_URL}/products`, {
                        params: { category: COLLECTION_ID, limit: 12 },
                        headers: getHeaders()
                    });
                    DATA_MAP[COLLECTION_ID] = { name: CAT.name, products: resp.data.products };
                } catch (err) { console.error(`Error fetching collection ${COLLECTION_ID}:`, err); }
            }
            SET_COLLECTIONS_DATA(DATA_MAP);
        } catch (err) { console.error("Critical boot error:", err); }
        finally { SET_IS_INITIAL_LOADING(false); }
    };
    LOAD_DATA();
  }, [siteConfig.categories, fetchIconProducts, fetchProducts, getHeaders]);

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff9f9', padding: '2rem', textAlign: 'center' }}>
      <div>
        <h2 style={{ fontFamily: 'Playfair Display', color: 'var(--primary)', fontSize: '2rem' }}>Oops! The Collection is Shrouded.</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>We encountered a little magic interference. Please try refreshing.</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 800 }}>Retry Magic</button>
      </div>
    </div>
  );
  if (IS_INITIAL_LOADING) return <PookieLoader fullScreen={true} />;

  return (
    <div style={{ background: 'var(--white)', overflow: 'hidden' }}>
      {siteConfig.banners && siteConfig.banners.length > 0 ? (
        <BannerCarousel banners={siteConfig.banners} fullWidth={true} />
      ) : (
        <Hero onBook={() => SET_IS_BOOKING_OPEN(true)} />
      )}

      <Services services={siteConfig.services} />

      <HandpickedCollection products={handpickedProducts} onProductClick={(id) => navigate(`/product/${id}`)} />

      <section className="collection-wrapper" style={{ background: 'var(--accent)' }}>
        <GroupedCollectionCarousels
          collectionsData={COLLECTIONS_DATA}
          onProductClick={(id) => navigate(`/product/${id}`)}
          onCategoryClick={(id) => navigate(`/products?category=${id}`)}
        />
      </section>

      <CustomCarousel catalog={products} onProductClick={(id) => navigate(`/product/${id}`)} />

      <section style={{ textAlign: 'center', background: 'white', padding: '5rem 0' }}>
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

      <BookingModal isOpen={IS_BOOKING_OPEN} onClose={() => SET_IS_BOOKING_OPEN(false)} />
    </div>
  );
};

export default LandingPage;
