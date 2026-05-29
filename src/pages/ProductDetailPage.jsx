import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, MessageSquare, Sparkles, ArrowLeft, Star, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useShop } from '../context/ShopContext';
import PookieLoader from '../components/PookieLoader';
import { resolveImageUrl } from '../utils/imageUtils';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart, showToast, siteConfig } = useShop();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentImageIndex * scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [currentImageIndex]);

  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);

  const fetchProductDetails = async (productId) => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${API_BASE_URL}/products/${productId}`, {
        headers: { 'X-Company-ID': siteConfig.companyId || 1 }
      });
      setProduct(resp.data.product);
      setSimilarProducts(resp.data.similar);
      if (resp.data.product.sizes?.length) setSelectedSize(resp.data.product.sizes[0]);
      if (resp.data.product.colors?.length) setSelectedColor(resp.data.product.colors[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
      showToast('Product not found 🪄');
      navigate('/products');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll images
  useEffect(() => {
    if (!product?.images?.length || product.images.length <= 1 || isFullScreen) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [product, isFullScreen]);

  if (isLoading || !product) return <PookieLoader />;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', padding: 'clamp(5rem, 12vw, 8rem) 0 3rem' }}>
      <div className="container">
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 800, cursor: 'pointer', marginBottom: 'clamp(1.5rem, 4vw, 3rem)', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}
        >
          <ArrowLeft size={18} /> Back to Collection
        </button>

        <div className="responsive-full-grid">
          {/* Left Column: Images */}
          <div>
            {/* Desktop View */}
            <div className="desktop-only" style={{ flexDirection: 'column' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="product-main-image-container"
                style={{ borderRadius: '50px', overflow: 'hidden', position: 'relative', boxShadow: '0 40px 100px rgba(233,163,163,0.2)', width: '100%' }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={resolveImageUrl(product.images?.[currentImageIndex] || product.image)}
                    onClick={() => setIsFullScreen(true)}
                    style={{ width: '100%', height: '500px', objectFit: 'contain', borderRadius: '24px', cursor: 'zoom-in' }}
                  />
                </AnimatePresence>

                {/* Desktop Navigation Arrows moved to overlay as per user request */}
                

                {/* Desktop Dots Overlay */}
                {product.images?.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.6rem', zIndex: 10, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                    {product.images.map((_, idx) => (
                      <div 
                        key={idx} 
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        style={{ width: currentImageIndex === idx ? '20px' : '8px', height: '8px', borderRadius: '4px', background: currentImageIndex === idx ? 'var(--primary)' : 'rgba(0,0,0,0.2)', transition: '0.3s', cursor: 'pointer' }} 
                      />
                    ))}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  background: 'white',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  fontSize: '0.8rem'
                }}>
                  <Sparkles size={15} /> Exclusive Masterpiece
                </div>
              </motion.div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', overflowX: 'auto', padding: '0.5rem 0.2rem' }} className="hide-scrollbar">
                {product.images?.map((img, idx) => (
                  <motion.img
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    src={resolveImageUrl(img)}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{ width: '85px', height: '85px', borderRadius: '18px', objectFit: 'contain', background: '#fef5f5', cursor: 'pointer', flexShrink: 0, border: idx === currentImageIndex ? '2px solid var(--primary)' : '2px solid #eee', transition: '0.3s', boxShadow: idx === currentImageIndex ? '0 5px 15px rgba(233,163,163,0.2)' : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Mobile/Tablet View */}
            <div className="mobile-only" style={{ flexDirection: 'column' }}>
              <div 
                ref={scrollRef}
                className="mobile-image-carousel no-scrollbar" 
                style={{ borderRadius: '40px', background: '#fef5f5', overflowX: 'auto', display: 'flex', scrollSnapType: 'x mandatory' }}
                onScroll={(e) => {
                  const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
                  if (index !== currentImageIndex) setCurrentImageIndex(index);
                }}
              >
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                  <div key={idx} className="carousel-item" style={{ minWidth: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'center' }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
                  {product.images.map((_, idx) => (
                    <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentImageIndex === idx ? 'var(--primary)' : '#ddd', transition: '0.3s' }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={{ padding: '0 0.5rem' }}>
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
              <motion.span variants={itemVariants} style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '5px', display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem' }}>{product.category}</motion.span>
              <motion.h1 variants={itemVariants} className="product-title" style={{ marginBottom: '0.8rem' }}>{product.name}</motion.h1>

              <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <p className="product-price">₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
                {product.discount > 0 && (
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ textDecoration: 'line-through', color: '#bbb', fontSize: '1rem' }}>₹{parseFloat(product.price).toLocaleString()}</p>
                    <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem' }}>Save {product.discount}% Today</p>
                  </div>
                )}
              </motion.div>

              <motion.p variants={itemVariants} style={{ fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)', color: '#777', lineHeight: 1.7, marginBottom: '1.5rem', letterSpacing: '0.01em' }}>{product.description}</motion.p>

              {/* Selection Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginBottom: '2.5rem' }}>
                {product.sizes?.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <p style={{ fontWeight: 900, color: 'var(--secondary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Tailoring Size:</p>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className="size-btn"
                          style={{ background: selectedSize === size ? 'var(--primary)' : 'white', color: selectedSize === size ? 'white' : 'var(--secondary)' }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {product.colors?.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <p style={{ fontWeight: 900, color: 'var(--secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Color Palette:</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          style={{ width: '45px', height: '45px', background: color, borderRadius: '50%', border: '4px solid white', boxShadow: selectedColor === color ? `0 0 0 3px var(--primary)` : '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)', transition: '0.3s' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => addToCart({ ...product, selectedSize, selectedColor })}
                  style={{ flex: 1, minWidth: '160px', padding: 'clamp(0.9rem, 2vw, 1.2rem) clamp(1rem, 2vw, 1.5rem)', background: 'var(--primary)', color: 'white', borderRadius: '32px', border: 'none', fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 0.92rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', boxShadow: '0 12px 32px rgba(233,163,163,0.4)', cursor: 'pointer', letterSpacing: '0.3px' }}
                >
                  <ShoppingBag size={18} /> Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{ padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(0.9rem, 2vw, 1.3rem)', background: '#fff0f0', borderRadius: '32px', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Heart size={22} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} />
                </button>
              </motion.div>

              <motion.button
                variants={itemVariants}
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
                style={{ width: '100%', marginTop: '1rem', padding: 'clamp(0.8rem, 2vw, 1.1rem)', background: 'transparent', border: '1.5px solid #25D366', color: '#25D366', borderRadius: '32px', fontWeight: 700, fontSize: 'clamp(0.78rem, 2vw, 0.9rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', cursor: 'pointer', letterSpacing: '0.3px' }}
              >
                <MessageSquare size={18} /> Inquire with Designer
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Similar Dreams */}
        {similarProducts.length > 0 && (
          <div className="similar-dreams-section">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 5rem)' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Similar Dreams  </h2>
              <p style={{ color: '#888', marginTop: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)' }}>Discover More Magic</p>
            </div>
            <div className="similar-dreams-grid">
              {similarProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ height: 'clamp(200px, 40vw, 400px)', borderRadius: 'clamp(20px, 4vw, 36px)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <img src={resolveImageUrl(p.images?.[0] || p.image)} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fef5f5' }} alt={p.name} />
                  </div>
                  <div style={{ padding: 'clamp(1rem, 3vw, 2rem) 0.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{p.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', marginTop: '0.5rem' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

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
              zIndex: 5000,
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
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 5010 }}
              onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}
            >
              <X size={24} color="#000" />
            </motion.button>

            {/* Overlay Navigation Arrows */}
            {product.images?.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length); }}
                  style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 5010 }}
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % product.images.length); }}
                  style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 5010 }}
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

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

            <div style={{ position: 'absolute', bottom: '3rem', textAlign: 'center', color: 'white', zIndex: 5010, pointerEvents: 'none' }}>
              <p style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display', letterSpacing: '1px' }}>{product.name}</p>
              <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '4px', textTransform: 'uppercase' }}>{currentImageIndex + 1} / {product.images?.length || 1}</p>
              <p style={{ fontSize: '0.65rem', marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '2px' }}>DRAG TO BROWSE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
