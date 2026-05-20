import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowRight, Scissors, Sparkles, Briefcase, Phone, Mail, MapPin, Quote, Sparkle, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import ProductDetailModal from '../components/ProductDetailModal';

const BookingModal = ({ isOpen, onClose }) => {
  const shop = useShop();
  const [formData, setFormData] = useState({ customer: '', phone: '', service: 'Custom Stitching', date: '', time: '' });
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = shop.bookAppointment(formData);
    if (result.success) {
      alert(`Booking Confirmed! ✨\nReference: ${result.apptId}\nWe will contact you shortly.`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.2)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 50, opacity: 0 }}
          className="amara-modal"
          style={{ padding: '3rem 2.5rem', maxWidth: '500px', width: '90%' }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--secondary)', background: 'none', border: 'none' }}><X size={24} /></button>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Reserve Your Slot</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Choose a time for your custom consultation</p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input className="appointment-input" placeholder="Full Name" type="text" required value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} />
            <input className="appointment-input" placeholder="Mobile Number" type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            
            <div className="appointment-grid">
              <input className="appointment-input" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              <input className="appointment-input" type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
            
            <button type="submit" style={{ marginTop: '1rem', padding: '1.4rem', background: 'var(--secondary)', color: 'white', fontWeight: 700, borderRadius: '20px', border: 'none', cursor: 'pointer' }}>
              Confirm Appointment
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Hero = ({ onBook }) => (
  <section style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'var(--background)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, var(--accent) 0%, transparent 50%)', opacity: 0.5 }}></div>
    <div className="container hero-container" style={{ zIndex: 10 }}>
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "circOut" }}>
        <div style={{ padding: '0.6rem 1.2rem', background: 'var(--accent)', borderRadius: '15px', color: 'var(--primary)', width: 'fit-content', fontWeight: 900, letterSpacing: '4px', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '2.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
           High Couture • 2026 Collection
        </div>
        <h1 style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', color: 'var(--secondary)', lineHeight: '0.9', marginBottom: '2.5rem', fontFamily: 'Playfair Display', letterSpacing: '-2px' }}>
          Unfold Your <br/>
          <span style={{ color: 'var(--primary)', paddingLeft: '2rem' }}>Essence.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text)', maxWidth: '550px', marginBottom: '4rem', lineHeight: '1.8', opacity: 0.8 }}>
          Bridging the gap between timeless heritage and futuristic silhouettes. Experience the art of measurement.
        </p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBook} 
            style={{ padding: '1.8rem 3.5rem', background: 'var(--secondary)', color: 'var(--background)', borderRadius: '25px', fontWeight: 800, border: 'none', fontSize: '1rem', cursor: 'grab' }}
          >
            Start Your Journey
          </motion.button>
          <Link to="/products" style={{ fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
            The Collections <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} style={{ position: 'relative' }}>
          <div className="hero-main-image">
            <img src="https://res.cloudinary.com/dzapdxkgc/image/upload/v1779217783/hero_mzqd33.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Couture" />
         </div>
          <div className="hero-badge">
            <h4 style={{ fontSize: '2rem', fontFamily: 'Playfair Display' }}>100+</h4>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Custom Fits</p>
         </div>
      </motion.div>
    </div>
  </section>
);

const Services = ({ services }) => {
  return (
    <section style={{ padding: '12rem 0', background: 'var(--background)' }}>
       <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
             <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1 }}>Pure <br/> Craftsmanship</h2>
             <p style={{ maxWidth: '400px', color: 'var(--text)', opacity: 0.7, fontSize: '1.1rem' }}>We don't just stitch; we sculpt dreams into reality using the finest silks and heritage techniques passed down through generations.</p>
          </div>
          <div className="services-grid">
             {services.map((service, idx) => (
               <motion.div 
                 key={service.id} 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="service-card-responsive"
               >
                  <img src={service.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s transform cubic-bezier(0.16, 1, 0.3, 1)' }} className="service-img" alt="" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)' }}></div>
                  <div className="service-card-content">
                     <span style={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.65rem', display: 'block', marginBottom: '1rem' }}>0{idx + 1} — Art</span>
                     <h3 className="service-card-title">{service.title}</h3>
                     <p className="service-card-desc">{service.description}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};

const FeaturedCollections = ({ products, onProductClick }) => (
  <section style={{ padding: '12rem 0', background: 'var(--accent)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: 'var(--secondary)', fontFamily: 'Playfair Display', marginBottom: '2rem' }}>Icons Only</h2>
        <div style={{ width: '100px', height: '4px', background: 'var(--primary)', margin: '0 auto' }}></div>
      </div>
      <div className="featured-grid">
        {products.slice(0, 3).map((product, idx) => (
          <motion.div 
            key={product.id} 
            whileHover={{ y: -20 }} 
            onClick={() => onProductClick(product)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="featured-image-container">
                <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            </div>
            <div className="featured-card-info">
               <h3 className="featured-card-title">{product.name}</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="featured-card-price">₹{product.price.toLocaleString()}</p>
                  <ArrowRight size={18} color="var(--primary)" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CustomCarousel = ({ products, onProductClick }) => {
  const controls = useAnimation();
  const trackRef = React.useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const resumeTimeoutRef = React.useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth);
    }
  }, [products]);

  const startAnimation = () => {
    controls.start({
      x: [0, -trackWidth / 3],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    });
  };

  useEffect(() => {
    if (trackWidth > 0) {
      startAnimation();
    }
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [trackWidth]);

  const handleDragStart = () => {
    controls.stop();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleDragEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      startAnimation();
    }, 5000);
  };

  return (
    <section style={{ padding: '15rem 0', background: 'var(--secondary)', color: 'var(--background)', overflow: 'hidden', position: 'relative' }}>
       {/* Background Text */}
       <h2 style={{ 
         position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
         fontSize: '25vw', opacity: 0.03, whiteSpace: 'nowrap', pointerEvents: 'none',
         fontFamily: 'Playfair Display', fontWeight: 900, color: 'var(--primary)'
       }}>
         DREAMS DREAMS DREAMS
       </h2>
       
       <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '10rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <span style={{ color: 'var(--primary)', fontWeight: 900, letterSpacing: '6px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Gallery 01</span>
                <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontFamily: 'Playfair Display', marginTop: '1.5rem', color: 'var(--background)' }}>The Digital Atelier</h2>
             </div>
             <p style={{ maxWidth: '350px', opacity: 0.6, fontSize: '1.1rem', textAlign: 'right' }}>An infinite rotation of our most celebrated works. Click any piece to explore its narrative.</p>
          </div>
       </div>

       <div style={{ width: '100%', overflow: 'hidden' }}>
          <motion.div 
            ref={trackRef}
            className="infinite-scroll-track" 
            animate={controls}
            drag="x"
            dragConstraints={{ left: -trackWidth * (2/3), right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ gap: '4rem' }}
          >
             {[...products, ...products, ...products].map((p, idx) => (
               <motion.div 
                 key={`${p.id}-${idx}`} 
                 initial="initial"
                 whileHover="hover"
                 onClick={() => onProductClick(p)}
                 className="carousel-card"
               >
                  <motion.div 
                    variants={{
                      initial: { rotate: 0, scale: 1 },
                      hover: { rotate: 2, scale: 1.02 }
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="carousel-card-inner"
                  >
                     <motion.img 
                       src={p.image} 
                       variants={{
                         initial: { scale: 1 },
                         hover: { scale: 1.1 }
                       }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                       alt="" 
                     />
                     
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
                     
                     <motion.div 
                       variants={{
                         initial: { y: 20, opacity: 0.9 },
                         hover: { y: 0, opacity: 1 }
                       }}
                       className="premium-card-blur"
                       style={{ 
                         position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', 
                         padding: '2.5rem', borderRadius: '30px', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                       }}
                     >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '0.5rem' }}>{p.category}</p>
                            <h4 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'white', lineHeight: 1.2 }}>{p.name}</h4>
                          </div>
                          <motion.div
                            variants={{
                              initial: { scale: 0.8, opacity: 0 },
                              hover: { scale: 1, opacity: 1 }
                            }}
                            style={{ background: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', color: 'white' }}
                          >
                            <ArrowRight size={20} />
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          variants={{
                            initial: { height: 0, opacity: 0 },
                            hover: { height: 'auto', opacity: 1 }
                          }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            View Piece Narrative <Sparkles size={14} style={{ marginLeft: '5px', display: 'inline' }} />
                          </p>
                        </motion.div>
                     </motion.div>
                  </motion.div>
               </motion.div>
             ))}
          </motion.div>
       </div>
    </section>
  );
};

const LandingPage = () => {
  useSmoothScroll();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, addToCart, siteConfig } = useShop();

  if (!products) return null;

  return (
    <div style={{ background: 'var(--white)' }}>
      <Hero onBook={() => setIsBookingOpen(true)} />
      <Services services={siteConfig.services} />
      <FeaturedCollections products={products} onProductClick={setSelectedProduct} />
      <CustomCarousel products={products} onProductClick={setSelectedProduct} />
      
      <section style={{ padding: '10rem 0', textAlign: 'center', background: 'var(--accent)' }}>
         <div className="container">
            <h2 style={{ fontSize: '2.8rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '3rem' }}>The Amara Experience</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '5rem 3rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
               <Quote size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '2rem' }} />
               <p style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                 "Absolute perfection. The attention to detail in the embroidery and the precision of the fit surpassed all my expectations. Amara Boutique has truly mastered the art of bespoke fashion."
               </p>
               <div style={{ width: '50px', height: '2px', background: 'var(--primary)', margin: '2rem auto' }}></div>
               <p style={{ fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '3px' }}>Anjali Varma</p>
            </div>
         </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ProductDetailModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
        onAddToCart={addToCart} 
      />
    </div>
  );
};

export default LandingPage;
