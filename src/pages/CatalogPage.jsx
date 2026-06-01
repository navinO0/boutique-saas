import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Calendar, Phone, Heart, Sparkles, X, Share2, Scissors, Quote, Plus, Edit2, Trash2, MessageSquare, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import EditCatalogModal from '../components/EditCatalogModal';
import { resolveImageUrl } from '../utils/imageUtils';

const CatalogItemModal = ({ isOpen, onClose, item }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const carouselRef = React.useRef(null);
  const fullScreenCarouselRef = React.useRef(null);

  useEffect(() => {
    if (isFullScreen && fullScreenCarouselRef.current) {
      fullScreenCarouselRef.current.scrollTo({ left: currentIdx * window.innerWidth, behavior: 'instant' });
    }
  }, [isFullScreen]);

  if (!item || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(255, 245, 245, 0.4)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          className="amara-modal modal-full-screen"
          style={{
            padding: '0',
            background: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              background: 'white',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              border: 'none',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }} className="hide-scrollbar">
            {/* Image Section */}
            <div style={{ position: 'relative', width: '100%', background: '#fffcfc', flexShrink: 0 }}>
              {/* Mobile/Tablet Scrollable Carousel */}
              <div
                ref={carouselRef}
                className="mobile-image-carousel"
                onScroll={(e) => {
                  const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
                  if (index !== currentIdx) setCurrentIdx(index);
                }}
              >
                {item.images.map((img, i) => (
                  <div key={i} className="carousel-item" style={{ width: '100vw', height: 'clamp(350px, 65vh, 600px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={resolveImageUrl(img)}
                      onClick={() => setIsFullScreen(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                      alt=""
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows for Desktop */}
              {item.images.length > 1 && (
                <div className="desktop-only">
                  <button 
                    onClick={() => {
                      if (carouselRef.current) {
                        carouselRef.current.scrollLeft -= carouselRef.current.clientWidth;
                      }
                    }}
                    style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10 }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => {
                      if (carouselRef.current) {
                        const container = carouselRef.current;
                        const maxScroll = container.scrollWidth - container.clientWidth;
                        if (container.scrollLeft >= maxScroll - 10) {
                          container.scrollLeft = 0; // Infinite loop
                        } else {
                          container.scrollLeft += container.clientWidth;
                        }
                      }
                    }}
                    style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10 }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}

              {item.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                  {item.images.map((_, i) => (
                    <div key={i} style={{ width: i === currentIdx ? '25px' : '8px', height: '8px', background: i === currentIdx ? 'var(--primary)' : 'rgba(0,0,0,0.1)', borderRadius: '4px', transition: '0.3s' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div style={{ padding: '2.5rem 1.5rem 5rem', background: 'white', flex: 1 }}>
              <div className="container" style={{ padding: 0, maxWidth: '800px' }}>
                <motion.span
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '4px', display: 'block', marginBottom: '1rem' }}
                >
                  {item.category}
                </motion.span>

                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '1.5rem', lineHeight: 1.15 }}>{item.name}</h2>

                <div style={{ width: '40px', height: '3px', background: 'var(--primary)', marginBottom: '2rem', borderRadius: '2px' }} />

                <p style={{ color: '#666', lineHeight: 2, marginBottom: '3rem', fontSize: '1.05rem', fontStyle: 'italic' }}>"{item.description}"</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '910000000000';
                      const currentImageUrl = item.images[currentIdx] || item.images[0];
                      const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
                      const catalogUrl = `${baseUrl}/catalog?catalogId=${item.id}`;

                      const message = [
                        `*Catalog Inquiry for ${item.name}*`,
                        '',
                        `${currentImageUrl}`,
                        '',
                        `*Item Link:* ${catalogUrl}`,
                        '',
                        `Hi Amara! I absolutely love this piece from your catalog. Could we discuss recreating this for me?`
                      ].join('\n');

                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    style={{ padding: '1.3rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '22px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', fontSize: '1rem', boxShadow: '0 15px 35px rgba(37, 211, 102, 0.25)' }}
                  >
                    <MessageSquare size={22} /> Bespoke Recreation
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Amara Catalog: ${item.name}`,
                          text: item.description,
                          url: `${window.location.origin}/catalog?catalogId=${item.id}`
                        });
                      }
                    }}
                    style={{ padding: '1.3rem', background: '#fdfdfd', color: 'var(--secondary)', border: '1px solid #eee', borderRadius: '22px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', fontSize: '0.95rem' }}
                  >
                    <Share2 size={20} /> Share Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Screen Zoom Overlay */}
        <AnimatePresence>
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setIsFullScreen(false)}
            >
              <button
                onClick={() => setIsFullScreen(false)}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={26} />
              </button>

              <div
                ref={fullScreenCarouselRef}
                className="no-scrollbar"
                style={{ width: '100%', height: '100%', overflowX: 'auto', display: 'flex', scrollSnapType: 'x mandatory' }}
                onScroll={(e) => {
                  const index = Math.round(e.target.scrollLeft / window.innerWidth);
                  if (index !== currentIdx) setCurrentIdx(index);
                }}
              >
                {item.images.map((img, i) => (
                  <div key={i} style={{ minWidth: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'center' }}>
                    <img src={resolveImageUrl(img)} style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} alt="" />
                  </div>
                ))}
              </div>

              {item.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fullScreenCarouselRef.current) {
                        const newIdx = (currentIdx - 1 + item.images.length) % item.images.length;
                        fullScreenCarouselRef.current.scrollTo({ left: newIdx * window.innerWidth, behavior: 'smooth' });
                      }
                    }}
                    style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 6010, backdropFilter: 'blur(10px)' }}
                  >
                    <ChevronLeft size={30} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fullScreenCarouselRef.current) {
                        const newIdx = (currentIdx + 1) % item.images.length;
                        fullScreenCarouselRef.current.scrollTo({ left: newIdx * window.innerWidth, behavior: 'smooth' });
                      }
                    }}
                    style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 6010, backdropFilter: 'blur(10px)' }}
                  >
                    <ChevronRight size={30} />
                  </button>
                </>
              )}

              <div style={{ position: 'absolute', bottom: '3rem', color: 'white', textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.6 }}>{currentIdx + 1} / {item.images.length}</p>
                <p style={{ fontSize: '0.6rem', marginTop: '1rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '2px' }}>Swipe to explore</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

import PookieLoader from '../components/PookieLoader';
import ErrorDisplay from '../components/ErrorDisplay';

const CatalogPage = () => {
  useSmoothScroll();
  const { catalog, isAdminLoggedIn, addCatalogItem, updateCatalogItem, deleteCatalogItem, fetchCatalog, isLoading, error, clearError } = useShop();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    fetchCatalog();
  }, []);

  React.useEffect(() => {
    const catalogId = searchParams.get('catalogId');
    if (catalogId && catalog) {
      const item = catalog.find(i => i.id === catalogId);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [searchParams, catalog]);

  if (error) return <ErrorDisplay message={error} onRetry={() => { clearError(); fetchCatalog(); }} />;
  if (isLoading) return <PookieLoader fullScreen={true} />;

  const handleAddNew = () => {
    setEditingItem(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this piece from your portfolio?  ")) {
      deleteCatalogItem(id);
    }
  };

  const handleSave = (data) => {
    if (editingItem) {
      updateCatalogItem(data);
    } else {
      addCatalogItem(data);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      {isAdminLoggedIn && (
        <button
          onClick={handleAddNew}
          className="add-new-work-fixed"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 2000,
            background: 'var(--secondary)',
            color: 'white',
            padding: '1.2rem 2.5rem',
            borderRadius: '40px',
            border: 'none',
            fontWeight: 800,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <Plus size={24} /> Add New Work
        </button>
      )}

      <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <Sparkles size={28} color="var(--primary)" style={{ marginBottom: '1.2rem' }} />
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontFamily: 'Roboto', color: 'var(--secondary)', lineHeight: 1.1 }}>The Atelier <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Catalog</span></h1>
        <p style={{ color: '#777', marginTop: '0.8rem', maxWidth: '520px', margin: '0.8rem auto', fontSize: '0.92rem', lineHeight: 1.8 }}>A curated showcase of our finest handcrafted legacy. From heritage bridal to modern evening wear, explored and redesigned just for you.</p>
      </div>

      <div className="responsive-catalog-grid">
        {catalog.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedItem(item)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="catalog-item-card-inner">
              {isAdminLoggedIn && (
                <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 10, display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={(e) => handleEdit(e, item)}
                    style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
              <img src={resolveImageUrl(item.images[0])} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '24px', background: '#fef9f9' }} alt="" />
            </div>
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.4rem' }}>{item.category}</p>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>{item.name}</h3>
              <div style={{ width: '30px', height: '1.5px', background: '#ffe4e1', margin: '1rem auto' }}></div>
              <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', letterSpacing: '0.5px' }}>Artisan Details</p>
            </div>
          </motion.div>
        ))}
      </div>

      <CatalogItemModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} />

      <EditCatalogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />

      {/* Portfolio Story Section */}
      <section style={{ marginTop: '7rem', background: 'var(--accent)', padding: 'clamp(3rem, 8vw, 5rem) 2rem', borderRadius: '48px', textAlign: 'center' }}>
        <Quote size={30} color="var(--primary)" style={{ opacity: 0.15, marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '1.5rem', lineHeight: 1.1 }}>Every design is a conversation, <br /> every stitch is a promise.</h2>
        <p style={{ maxWidth: '520px', margin: '0 auto', color: '#777', lineHeight: 1.8, fontSize: '0.92rem' }}>Our catalog represents years of artisanal excellence. Whether you want a recreation of a past masterpiece or a completely new vision, our atelier is ready to bring your dream to life.</p>
        <button style={{ marginTop: '2.5rem', padding: '1rem 2.5rem', background: 'var(--secondary)', color: 'white', borderRadius: '28px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 12px 24px rgba(74,55,55,0.15)' }}>Explore Customizations</button>
      </section>
    </div>
  );
};

export default CatalogPage;
