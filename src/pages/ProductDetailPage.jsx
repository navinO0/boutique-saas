import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, MessageSquare, Sparkles, ArrowLeft, Star, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useShop } from '../context/ShopContext';
import PookieLoader from '../components/PookieLoader';
import { resolveImageUrl } from '../utils/imageUtils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Zoom, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart, showToast, siteConfig } = useShop();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [fullscreenSwiperInstance, setFullscreenSwiperInstance] = useState(null);

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
      setTimeout(() => {
        if (swiperInstance && isOpen) {
            swiperInstance.slideTo(0, 0);
            setCurrentImageIndex(0);
        }
      }, 150);
    }
  };

  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    if (isFullScreen && fullscreenSwiperInstance) fullscreenSwiperInstance.slideNext();
    else if (swiperInstance) swiperInstance.slideNext();
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    if (isFullScreen && fullscreenSwiperInstance) fullscreenSwiperInstance.slidePrev();
    else if (swiperInstance) swiperInstance.slidePrev();
  };



  if (isLoading || !product) return <PookieLoader fullScreen={true} />;


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', padding: 'clamp(5rem, 12vw, 8rem) 0 3rem' }}>
      <div style={{ width: window.innerWidth < 768 ? '100%' : '80%', maxWidth: window.innerWidth < 768 ? '100%' : '80%', margin: '0 auto', padding: window.innerWidth < 768 ? '0 10px' : '0' }}>
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
            {/* Image Gallery (Swiper) */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '15px', overflow: 'hidden', background: '#fefafa', boxShadow: '0 40px 100px rgba(233,163,163,0.15)' }}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, Keyboard]}
                onSwiper={setSwiperInstance}
                onSlideChange={(s) => setCurrentImageIndex(s.realIndex)}
                loop={product?.images?.length > 1}
                autoplay={!autoScrollPaused ? { delay: 5000, disableOnInteraction: false } : false}
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                className="pdp-gallery-swiper"
                style={{ width: '100%', height: '100%' }}
              >
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={resolveImageUrl(img)}
                        alt=""
                        onClick={() => setIsFullScreen(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div style={{
                  position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'white', padding: '0.6rem 1.2rem',
                  borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700,
                  color: 'var(--primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '0.7rem',
                  letterSpacing: '1px', zIndex: 10
                }}>
                  <Sparkles size={14} /> EXCLUSIVE PIECE
                </div>
            </div>

            {/* Desktop Thumbnails */}
            <div className="desktop-only hide-scrollbar" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', overflowX: 'auto', padding: '0.2rem' }}>
              {product.images?.map((img, idx) => (
                <motion.img
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  src={resolveImageUrl(img)}
                  onClick={() => swiperInstance?.slideToLoop(idx)}
                  style={{ 
                    width: '75px', height: '75px', borderRadius: '15px', objectFit: 'cover', 
                    background: '#fef5f5', cursor: 'pointer', flexShrink: 0, 
                    border: idx === currentImageIndex ? '2.5px solid var(--primary)' : '2.5px solid transparent', 
                    transition: '0.3s' 
                  }}
                />
              ))}
            </div>

          </div>

          {/* Right Column: Details */}
          <div style={{ padding: '0 0.5rem' }}>
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
              <motion.span variants={itemVariants} style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '5px', display: 'block', marginBottom: '0.5rem', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>{product.category}</motion.span>
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

              <motion.p variants={itemVariants} style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1rem)', color: '#777', lineHeight: 1.7, marginBottom: '1.5rem', letterSpacing: '0.01em' }}>{product.description}</motion.p>

              {/* Selection Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginBottom: '2.5rem' }}>
                {product.sizes?.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }}>Tailoring Size:</p>
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
                    <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }}>Color Palette:</p>
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
                  disabled={product.stock === 0}
                  style={{ 
                    flex: 1, 
                    minWidth: '160px', 
                    padding: 'clamp(0.9rem, 2vw, 1.2rem) clamp(1rem, 2vw, 1.5rem)', 
                    background: product.stock === 0 ? '#ccc' : 'var(--primary)', 
                    color: 'white', 
                    borderRadius: '10px', 
                    border: 'none', 
                    fontWeight: 700, 
                    fontSize: 'clamp(0.8rem, 2vw, 0.92rem)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.7rem', 
                    boxShadow: product.stock === 0 ? 'none' : '0 12px 32px rgba(233,163,163,0.4)', 
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer', 
                    letterSpacing: '0.3px' 
                  }}
                >
                  <ShoppingBag size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
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
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Similar Dreams  </h2>
              <p style={{ color: '#888', marginTop: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: 'clamp(0.55rem, 2vw, 0.85rem)' }}>Discover More Magic</p>
            </div>
            <div className="similar-dreams-grid" style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: window.innerWidth < 768 ? '10px' : '15px' }}>
              {similarProducts.map((p, i) => {
                const isDreamMobile = window.innerWidth < 768;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/product/${p.id}`)}
                    style={{ 
                      cursor: 'pointer',
                      background: 'white',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #fff0f0'
                    }}
                  >
                    <div style={{ height: isDreamMobile ? 'clamp(200px, 50vw, 280px)' : 'clamp(280px, 30vw, 380px)', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#fef5f5' }}>
                      <img src={resolveImageUrl(p.images?.[0] || p.image)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={p.name} />
                    </div>
                    <div style={{ padding: '0.8rem 0.5rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', fontFamily: 'Roboto', color: 'var(--secondary)', fontWeight: 700 }}>{p.name}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', marginTop: '0.4rem' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Image Overlay */}
      <AnimatePresence>
        {isFullScreen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <button
                onClick={() => setIsFullScreen(false)}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', border: 'none', color: 'black', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', zIndex: 6020, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={24} />
              </button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, Zoom]}
                onSwiper={setFullscreenSwiperInstance}
                initialSlide={currentImageIndex}
                onSlideChange={(s) => setCurrentImageIndex(s.realIndex)}
                keyboard={{ enabled: true }}
                navigation={{ nextEl: '.fs-next', prevEl: '.fs-prev' }}
                zoom={true}
                loop={product?.images?.length > 1}
                style={{ width: '100%', height: '100%' }}
              >
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, idx) => (
                  <SwiperSlide key={idx} style={{ overflow: 'hidden' }}>
                    <div className="swiper-zoom-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <img 
                        src={resolveImageUrl(img)} 
                        alt="" 
                        style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="desktop-only">
                <button className="fs-prev swiper-fs-nav" style={{ left: '2rem' }}><ChevronLeft size={35} color="white" /></button>
                <button className="fs-next swiper-fs-nav" style={{ right: '2rem' }}><ChevronRight size={35} color="white" /></button>
              </div>

              <div style={{ position: 'absolute', bottom: '3rem', textAlign: 'center', color: 'white', zIndex: 6020, pointerEvents: 'none', width: '100%' }}>
                <p style={{ opacity: 0.6, fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>{currentImageIndex + 1} / {(product.images?.length > 0 ? product.images : [product.image]).length}</p>
                <p style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display', marginTop: '0.5rem' }}>{product.name}</p>
              </div>

              <style>{`
                .swiper-fs-nav {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  background: rgba(255,255,255,0.1);
                  backdrop-filter: blur(10px);
                  border: none;
                  width: 65px;
                  height: 65px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 6030;
                }
              `}</style>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
