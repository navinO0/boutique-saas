import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Share2, Check, MessageSquare, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useShop } from '../context/ShopContext';
import { resolveImageUrl } from '../utils/imageUtils';

const ProductDetailModal = ({ isOpen, onClose, product: initialProduct, onAddToCart }) => {
  const [product, setProduct] = useState(initialProduct);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { wishlist, toggleWishlist } = useShop();

  useEffect(() => {
    if (isOpen && initialProduct?.id) {
      fetchProductDetails(initialProduct.id);
    }
  }, [isOpen, initialProduct]);

  const fetchProductDetails = async (id) => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${API_BASE_URL}/products/${id}`, {
        headers: { 'X-Company-ID': 1 }
      });
      setProduct(resp.data.product);
      setSimilarProducts(resp.data.similar);
      
      if (resp.data.product.sizes?.length) setSelectedSize(resp.data.product.sizes[0]);
      if (resp.data.product.colors?.length) setSelectedColor(resp.data.product.colors[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll images
  useEffect(() => {
    if (!product?.images?.length || product.images.length <= 1 || !isOpen || isFullScreen) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [product, isOpen, isFullScreen]);

  if (!product) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(255, 235, 235, 0.4)', backdropFilter: 'blur(15px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden" animate="visible" exit="exit"
            style={{ 
              background: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
            className="hide-scrollbar amara-modal modal-full-screen"
          >
            <button onClick={onClose} style={{ position: 'sticky', top: '1.2rem', float: 'right', marginRight: '1.2rem', zIndex: 30, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(233,163,163,0.4)', flexShrink: 0 }}>
              <X size={20} />
            </button>

            <div className="responsive-modal-grid">
              {/* Image Section */}
              <div style={{ padding: '0.5rem' }}>
                {/* Desktop Main Image */}
                <div className="desktop-only">
                  <motion.div 
                    layoutId={`product-image-${product.id}`}
                    className="modal-main-image"
                    style={{ width: '100%' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        src={resolveImageUrl(product.images?.[currentImageIndex] || product.image)} 
                        onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '24px', background: '#fef5f5', cursor: 'zoom-in' }} 
                      />
                    </AnimatePresence>
                    <div style={{ 
                      position: 'absolute', 
                      top: '1.5rem', 
                      left: '1.5rem', 
                      background: 'rgba(255,255,255,0.85)', 
                      backdropFilter: 'blur(10px)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      fontWeight: 800, 
                      fontSize: '0.72rem', 
                      color: 'var(--primary)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
                    }}>
                       <Sparkles size={12} /> Artisan Made
                    </div>
                  </motion.div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', overflowX: 'auto', padding: '0.3rem' }} className="hide-scrollbar">
                    {product.images?.map((img, idx) => (
                      <motion.img 
                        key={idx} 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        src={resolveImageUrl(img)} 
                        onClick={() => setCurrentImageIndex(idx)}
                        style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '14px', background: '#fef5f5', cursor: 'pointer', flexShrink: 0, border: idx === currentImageIndex ? '3px solid var(--primary)' : '3px solid transparent', transition: '0.3s' }} 
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile/Tablet Scrollable Gallery */}
                <div className="mobile-only" style={{ flexDirection: 'column' }}>
                  <div className="mobile-image-carousel" style={{ borderRadius: '24px', background: '#fef5f5' }}>
                    {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                      <div key={idx} className="carousel-item" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={resolveImageUrl(img)} 
                          alt="" 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          onClick={() => { setCurrentImageIndex(idx); setIsFullScreen(true); }}
                        />
                      </div>
                    ))}
                  </div>
                  {product.images?.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                      {product.images.map((_, idx) => (
                        <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentImageIndex === idx ? 'var(--primary)' : '#eee' }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div style={{ padding: '0.5rem clamp(0.8rem, 3vw, 2rem)' }}>
                <motion.span variants={itemVariants} style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '4px', display: 'block' }}>{product.category}</motion.span>
                <motion.h2 variants={itemVariants} style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', margin: '0.4rem 0', lineHeight: 1.1 }}>{product.name}</motion.h2>
                
                <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.8rem 0', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--primary)' }}>₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
                  {product.discount > 0 && <span style={{ padding: '0.3rem 0.8rem', background: '#fff0f0', color: 'var(--primary)', borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem' }}>{product.discount}% OFF</span>}
                </motion.div>

                <motion.p variants={itemVariants} style={{ color: '#777', lineHeight: 1.6, fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)', marginBottom: '1.2rem', letterSpacing: '0.01em' }}>{product.description}</motion.p>

                {/* Selections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                  {product.sizes?.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <p style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Find Your Fit:</p>
                      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {product.sizes.map(size => (
                          <motion.button 
                            key={size}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedSize(size)}
                            className="size-btn"
                            style={{ 
                              border: selectedSize === size ? '2px solid var(--primary)' : '1px solid #eee',
                              background: selectedSize === size ? 'var(--primary)' : 'white',
                              color: selectedSize === size ? 'white' : 'var(--secondary)'
                            }}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {product.colors?.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <p style={{ fontWeight: 800, marginBottom: '1.2rem', color: 'var(--secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Palette:</p>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {product.colors.map(color => (
                          <motion.button 
                            key={color}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setSelectedColor(color)}
                            style={{ 
                              width: '40px', height: '40px', borderRadius: '50%', background: color, border: '4px solid white',
                              boxShadow: selectedColor === color ? `0 0 0 3px var(--primary)` : '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer'
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.div variants={itemVariants} className="modal-action-row">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart({ ...product, selectedSize, selectedColor })} 
                    style={{ flex: 1, padding: 'clamp(0.85rem, 2vw, 1.1rem)', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 700, fontSize: 'clamp(0.78rem, 2vw, 0.92rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', letterSpacing: '0.3px' }}
                  >
                    <ShoppingBag size={17} /> Add to Magic Bag
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toggleWishlist(product.id)} 
                    style={{ padding: 'clamp(0.7rem, 2vw, 1.1rem) clamp(0.8rem, 2vw, 1.1rem)', background: '#fff0f0', border: 'none', borderRadius: '24px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Heart size={20} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} />
                  </motion.button>
                </motion.div>

                <motion.button 
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '910000000000';
                    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
                    const productUrl = `${baseUrl}/product/${product.id}`;
                    const imageUrl = resolveImageUrl(product.images?.[currentImageIndex] || product.image);
                    
                    const message = [
                      `*Inquiry for ${product.name}*`,
                      '',
                      `${imageUrl}`,
                      '',
                      `*Item Details:*`,
                      `- Category: ${product.category?.toUpperCase() || 'GENERAL'}`,
                      selectedSize ? `- Selection: Size ${selectedSize}${selectedColor ? `, Color ${selectedColor}` : ''}` : (selectedColor ? `- Selection: Color ${selectedColor}` : ''),
                      `- Price: ₹${parseFloat(product.discountedPrice).toLocaleString()}${product.discount > 0 ? ` (₹${parseFloat(product.price).toLocaleString()} - ${product.discount}% OFF)` : ''}`,
                      '',
                      `*Description:*`,
                      `${product.description}`,
                      '',
                      `*Product Link:* ${productUrl}`,
                      '',
                      `Hi! I'm interested in this handcrafted piece. Could you provide more details?`
                    ].filter(line => line !== '').join('\n');

                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  style={{ width: '100%', marginTop: '0.8rem', padding: 'clamp(0.8rem, 2vw, 1.1rem)', background: 'transparent', border: '1.5px solid #25D366', color: '#25D366', borderRadius: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: 'clamp(0.75rem, 2vw, 0.88rem)', letterSpacing: '0.3px' }}>
                  <MessageSquare size={17} /> Chat with Designer
                </motion.button>
              </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem)', background: '#fff9f9', borderRadius: '40px 40px 0 0' }}
              >
                <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontFamily: 'Playfair Display', marginBottom: 'clamp(1.5rem, 4vw, 3rem)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  More Magic <Sparkles size={24} color="var(--primary)" />
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
                  {similarProducts.map((p, i) => (
                    <motion.div 
                      key={p.id} 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10 }}
                      onClick={() => fetchProductDetails(p.id)}
                      style={{ cursor: 'pointer', background: 'white', padding: '0.8rem', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                    >
                      <img src={resolveImageUrl(p.images?.[0] || p.image)} style={{ width: '100%', height: 'clamp(140px, 25vw, 240px)', objectFit: 'contain', borderRadius: '18px', background: '#fef5f5' }} alt={p.name} />
                      <div style={{ padding: '0.8rem 0.3rem' }}>
                        <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>{p.name}</p>
                        <p style={{ color: 'var(--primary)', fontWeight: 900, marginTop: '0.4rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Full Screen Image Overlay */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullScreen(false)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.95)', 
              zIndex: 6000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'zoom-out',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.button 
               whileHover={{ scale: 1.1, rotate: 90 }}
               whileTap={{ scale: 0.9 }}
               style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 6010 }}
               onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}
            >
               <X size={24} color="#000" />
            </motion.button>

            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                overflowX: 'auto', 
                overflowY: 'hidden', 
                display: 'flex', 
                scrollSnapType: 'x mandatory',
                alignItems: 'center',
                scrollbarWidth: 'none',
              }}
              className="no-scrollbar full-screen-carousel"
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => {
                const index = Math.round(e.target.scrollLeft / window.innerWidth);
                if (index !== currentImageIndex) setCurrentImageIndex(index);
              }}
            >
              {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    minWidth: '100vw', 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    scrollSnapAlign: 'center',
                    padding: '1rem'
                  }}
                >
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={resolveImageUrl(img)} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '90vh', 
                      objectFit: 'contain', 
                      borderRadius: '12px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                    }} 
                  />
                </div>
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: '3rem', textAlign: 'center', color: 'white', zIndex: 6010, pointerEvents: 'none' }}>
               <p style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display', letterSpacing: '1px' }}>{product.name}</p>
               <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '4px', textTransform: 'uppercase' }}>{currentImageIndex + 1} / {product.images?.length || 1}</p>
               <p style={{ fontSize: '0.65rem', marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '2px' }}>DRAG TO BROWSE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
