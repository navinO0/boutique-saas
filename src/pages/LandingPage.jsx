import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowRight, Scissors, Sparkles, Briefcase, Phone, Mail, MapPin, Quote, Sparkle, X, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ProductDetailModal from '../components/ProductDetailModal';
import PookieLoader from '../components/PookieLoader';
import { resolveImageUrl } from '../utils/imageUtils';

const BookingModal = ({ isOpen, onClose }) => {
  const shop = useShop();
  const [formData, setFormData] = useState({ customer: '', phone: '', service: 'Custom Stitching', date: '', time: '' });
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    shop.showToast(`Booking request received! ✨ We'll call you shortly.`);
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
            borderRadius: '40px 40px 0 0',
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
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '0.8rem' }}>Reserve Magic</h2>
            <p style={{ color: '#999', fontSize: 'clamp(0.75rem, 3vw, 1rem)', letterSpacing: '1px' }}>DREAM • MEASURE • CREATE</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Your Name</label>
              <input placeholder="Queen Name" type="text" required style={{ padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Phone Number</label>
              <input placeholder="+91" type="tel" required style={{ padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            <div className="booking-form-grid">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Date</label>
                <input type="date" required style={{ padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontFamily: 'inherit', width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>Time</label>
                <input type="time" required style={{ padding: '1rem 1.2rem', borderRadius: '18px', border: '1px solid #eee', background: '#fdfdfd', outline: 'none', fontFamily: 'inherit', width: '100%' }} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '1rem', padding: '1.3rem', background: 'var(--primary)', color: 'white', fontWeight: 800, borderRadius: '22px', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 15px 30px rgba(233,163,163,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
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
    borderRadius: 'clamp(30px, 5vw, 60px)',
    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.3)',
    padding: 'clamp(2.5rem, 6vw, 5rem)',
    maxWidth: '800px',
    position: 'relative',
    marginLeft: '-2rem' // Nudge it further left
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
          <div style={{ padding: '0.4rem 1rem', background: 'var(--primary)', borderRadius: '10px', color: 'white', width: 'fit-content', fontWeight: 800, letterSpacing: '3px', fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', textTransform: 'uppercase', marginBottom: 'clamp(1rem, 3vw, 2rem)', boxShadow: '0 10px 20px rgba(233,163,163,0.3)' }}>
             Couture House • Est 2026
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 8vw, 6.5rem)', color: 'white', lineHeight: '0.9', marginBottom: 'clamp(1.2rem, 3vw, 2.5rem)', fontFamily: 'Playfair Display', letterSpacing: 'clamp(-1px, -0.4vw, -3px)', textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            Unfold Your <br/>
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ color: 'var(--primary)', paddingLeft: 'clamp(0.8rem, 2.5vw, 2.5rem)', display: 'inline-block' }}>Aura.</motion.span>
          </h1>
          <p style={{ fontSize: 'clamp(0.82rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.95)', maxWidth: '560px', marginBottom: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: '1.9', letterSpacing: '0.01em', fontWeight: 500 }}>
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
            style={{ position: 'absolute', bottom: '-20px', right: '40px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', padding: '1.5rem 2.5rem', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          >
             <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'Playfair Display', color: 'var(--primary)', lineHeight: 1 }}>500+</h4>
             <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.3rem' }}>Masterpieces</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = ({ services }) => (
  <section style={{ background: 'var(--background)' }}>
     <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem, 6vw, 6rem)', gap: '1.5rem' }}>
           <div>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', fontSize: 'clamp(0.6rem, 1.5vw, 0.72rem)' }}>Craftsmanship</span>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.05, marginTop: '0.6rem' }}>Pure <br/> Artistry</h2>
           </div>
           <p style={{ maxWidth: '380px', color: '#777', fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', lineHeight: 1.9 }}>Every thread tells a story. From hand-woven silks to intricate embroidery, we bring heritage to the modern world.</p>
        </div>
        
        <div className="services-grid">
           {services.map((service, idx) => (
             <motion.div 
               key={service.id} 
               whileHover={{ y: -20 }}
               className="service-card-responsive"
             >
                <img src={service.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', background: '#fef5f5' }} alt={service.title} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 70%)' }}></div>
                <div className="service-card-content" style={{ color: 'white' }}>
                   <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px' }}>0{idx + 1}</span>
                   <h3 className="service-card-title">{service.title}</h3>
                   <p className="service-card-desc">{service.description}</p>
                </div>
             </motion.div>
           ))}
        </div>
     </div>
  </section>
);

const CustomCarousel = ({ catalog, onProductClick }) => {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!catalog || catalog.length === 0) return null;

  // Triple the catalog for a seamless loop in both directions
  const displayItems = [...catalog, ...catalog, ...catalog];

  useEffect(() => {
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
            fontSize: '25vw', fontWeight: 900, color: 'var(--primary)', opacity: 0.03, 
            whiteSpace: 'nowrap', zIndex: 0, fontFamily: 'Playfair Display', pointerEvents: 'none',
            userSelect: 'none'
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
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: 'Playfair Display', marginTop: '1rem', lineHeight: 1.05 }}
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
                     objectFit: 'contain', borderRadius: '24px', background: '#fef5f5',
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
                          <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.5rem' }}>{p.category}</p>
                          <h3 style={{ color: 'white', fontSize: '2.2rem', fontFamily: 'Playfair Display', lineHeight: 1.1 }}>{p.name}</h3>
                       </div>
                       <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '50%', color: 'white', display: 'flex' }}><ArrowRight size={20} /></div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
       </div>
    </section>
  );
};

const LandingPage = () => {
  useSmoothScroll();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { products, iconProducts, catalog, isLoading, addToCart, siteConfig } = useShop();

  if (isLoading) return <PookieLoader />;

  return (
    <div style={{ background: 'var(--white)' }}>
      <Hero onBook={() => setIsBookingOpen(true)} />
      
      <Services services={siteConfig.services} />

      {/* Featured Grid with Premium Cards */}
      <section style={{ background: 'var(--accent)' }}>
         <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 5rem)' }}>
               <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>Curation</span>
               <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginTop: '0.8rem' }}>Icons Only</h2>
            </div>
            
            <div className="featured-grid">
               {iconProducts.map((p, idx) => (
                 <motion.div 
                    key={p.id} 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -15 }}
                    onClick={() => navigate(`/product/${p.id}`)} 
                    style={{ cursor: 'pointer', background: 'white', borderRadius: 'clamp(24px, 4vw, 50px)', padding: '1.2rem', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}
                 >
                    <div style={{ height: 'clamp(220px, 40vw, 500px)', borderRadius: 'clamp(18px, 3vw, 40px)', overflow: 'hidden', position: 'relative' }}>
                       <img src={resolveImageUrl(p.images?.[0] || p.image)} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '24px', background: '#fef5f5' }} alt={p.name} />
                       <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '15px', fontWeight: 900, fontSize: '0.75rem' }}>0{idx + 1}</div>
                    </div>
                    <div style={{ padding: 'clamp(1rem, 3vw, 2rem) 0.8rem 0.5rem' }}>
                       <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{p.name}</h3>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                          <motion.div whileHover={{ x: 10 }} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                             View Details <ArrowRight size={14} />
                          </motion.div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
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
            <p style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.6rem)', color: 'var(--secondary)', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7, fontFamily: 'Playfair Display', padding: '0 1rem' }}>
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
