import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Share2, Star, Check, Calendar, Phone, Clock, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const BookingForm = ({ initialProduct, onSuccess }) => {
  const shop = useShop();
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    date: '',
    time: '',
    productName: initialProduct?.name || '',
    service: 'Custom Design Inquiry'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = shop.bookAppointment(formData);
    if (result.success) {
      alert(`Booking Confirmed! ✨\nReference: ${result.apptId}\nWe will call you on ${formData.phone} soon.`);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--secondary)' }}>Book This Design</h3>
        <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.5rem' }}>{initialProduct.name}</p>
      </div>
      
      <input 
        placeholder="Your Graceful Name" required
        value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}
        style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} 
      />
      
      <input 
        placeholder="Mobile Number (Required)" required type="tel"
        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
        style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input 
          type="date" required
          value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
          style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px' }} 
        />
        <input 
          type="time" required
          value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
          style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px' }} 
        />
      </div>

      <button type="submit" style={{ marginTop: '1rem', padding: '1.4rem', background: 'var(--primary)', color: 'white', fontWeight: 800, borderRadius: '35px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px var(--glow)' }}>
        Confirm Appointment ✨
      </button>
    </form>
  );
};

const ProductDetailModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const { wishlist, toggleWishlist, products } = useShop();

  useEffect(() => {
    if (!isOpen) {
      setCurrentImageIndex(0);
      setIsBookingMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isPaused && product?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % (product?.images?.length || 1));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isPaused, product?.images]);

  if (!product) return null;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/products/${product.category}?id=${product.id}`);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(255, 235, 235, 0.4)', backdropFilter: 'blur(15px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="amara-modal"
            style={{ 
              background: 'white', 
              borderRadius: '40px 40px 0 0', 
              maxWidth: '1100px', 
              width: '100%', 
              position: 'fixed', 
              bottom: 0,
              maxHeight: '95vh',
              overflowY: 'auto',
              boxShadow: '0 -20px 60px rgba(233,163,163,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '50px', height: '5px', background: '#ffe4e1', borderRadius: '10px', margin: '1.2rem auto' }} className="mobile-only"></div>
            
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30, background: '#fff0f0', color: 'var(--primary)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>

            {isBookingMode ? (
              <div style={{ padding: '3rem 1.5rem' }}>
                <button onClick={() => setIsBookingMode(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, marginBottom: '2rem', cursor: 'pointer' }}>← Back to Design</button>
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <BookingForm initialProduct={product} onSuccess={() => { setIsBookingMode(false); onClose(); }} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }} className="responsive-modal-content">
                {/* Image Section */}
                <div style={{ position: 'relative', background: '#fff9f9', padding: '1rem', flex: 1.2 }}>
                  <div style={{ height: 'clamp(300px, 60vh, 500px)', borderRadius: '30px', overflow: 'hidden', position: 'relative', background: 'white' }}>
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        src={product.images[currentImageIndex]} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </AnimatePresence>
                  </div>
                  
                  {/* Miniphotos Gallery */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '1.5rem', 
                    overflowX: 'auto', 
                    padding: '0.5rem 0',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }} className="hide-scrollbar">
                    {product.images.map((img, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setIsPaused(true);
                        }}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          flexShrink: 0,
                          borderRadius: '15px', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          border: idx === currentImageIndex ? '3px solid var(--primary)' : '3px solid transparent',
                          boxShadow: idx === currentImageIndex ? '0 8px 20px rgba(233,163,163,0.3)' : 'none',
                          transition: '0.3s'
                        }}
                      >
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`View ${idx + 1}`} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Details Section */}
                <div style={{ padding: 'clamp(1.5rem, 5vw, 4rem)', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '4px' }}>{product.category}</span>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <button onClick={handleShare} style={{ background: '#fff9f9', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Share2 size={20} /></button>
                       <button onClick={() => toggleWishlist(product.id)} style={{ background: '#fff9f9', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Heart size={20} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} color="var(--primary)" />
                       </button>
                    </div>
                  </div>

                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: '1.2', marginBottom: '1rem' }}>{product.name}</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>₹{product.discountedPrice.toLocaleString()}</p>
                    {product.discount > 0 && <p style={{ textDecoration: 'line-through', color: '#bbb', fontSize: '1.1rem' }}>₹{product.price.toLocaleString()}</p>}
                  </div>

                  <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '3rem' }}>{product.description}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => onAddToCart(product)} style={{ width: '100%', padding: '1.5rem', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '35px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1rem' }}>
                      <ShoppingBag size={20} /> Add to Dream Bag
                    </button>
                    <button onClick={() => setIsBookingMode(true)} style={{ width: '100%', padding: '1.5rem', background: 'transparent', color: 'var(--primary)', border: '2px dashed var(--primary)', borderRadius: '35px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1rem' }}>
                      <Calendar size={20} /> Book Appointment for This Design
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ background: '#fef5f5', padding: '0.6rem', borderRadius: '12px' }}><Check size={16} color="var(--primary)" /></div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>Custom Tailored</p>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ background: '#fef5f5', padding: '0.6rem', borderRadius: '12px' }}><Check size={16} color="var(--primary)" /></div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>Pure Magic</p>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
