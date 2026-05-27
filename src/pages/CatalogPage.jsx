import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Calendar, Phone, Heart, Sparkles, X, Share2, Scissors, Quote, Plus, Edit2, Trash2, MessageSquare, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import EditCatalogModal from '../components/EditCatalogModal';
import { resolveImageUrl } from '../utils/imageUtils';

const CatalogItemModal = ({ isOpen, onClose, item }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!item || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(255, 245, 245, 0.6)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }}
          className="amara-modal"
          style={{ padding: '0', maxWidth: '1000px', width: '95%' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex' }} className="responsive-modal-content">
             <div style={{ flex: 1.2, background: '#fef9f9', height: '100%', position: 'relative' }}>
                <img src={resolveImageUrl(item.images[currentIdx])} style={{ width: '100%', height: 'clamp(300px, 60vh, 600px)', objectFit: 'contain', borderRadius: '24px', background: '#fef9f9' }} alt="" />
                {item.images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                    {item.images.map((_, i) => (
                      <div key={i} onClick={() => setCurrentIdx(i)} style={{ width: i === currentIdx ? '30px' : '10px', height: '10px', background: 'white', borderRadius: '5px', cursor: 'pointer' }} />
                    ))}
                  </div>
                )}
             </div>
             <div style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '3px' }}>{item.category}</span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', margin: '0.8rem 0', lineHeight: 1.1 }}>{item.name}</h2>
                <p style={{ color: '#777', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.92rem', letterSpacing: '0.01em' }}>{item.description}</p>
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
                      `*Details:*`,
                      `- Category: ${item.category?.toUpperCase() || 'GENERAL'}`,
                      `- Description: ${item.description}`,
                      '',
                      `Hi! I'm interested in having this piece from your catalog recreated/customized. Could we discuss this further?`
                    ].join('\n');

                    const encodedText = encodeURIComponent(message);
                    window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
                    onClose();
                  }}
                  style={{ padding: '1rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '28px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', fontSize: '0.9rem', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.2)' }}
                >
                  <MessageSquare size={18} /> Request Custom Recreation
                </button>
             </div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', borderRadius: '50%', width: '40px', height: '40px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}><X /></button>
        </motion.div>
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
    if (window.confirm("Are you sure you want to remove this piece from your portfolio? ✨")) {
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
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1 }}>The Atelier <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Catalog</span></h1>
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
                   <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{item.name}</h3>
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
          <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '1.5rem', lineHeight: 1.1 }}>Every design is a conversation, <br/> every stitch is a promise.</h2>
          <p style={{ maxWidth: '520px', margin: '0 auto', color: '#777', lineHeight: 1.8, fontSize: '0.92rem' }}>Our catalog represents years of artisanal excellence. Whether you want a recreation of a past masterpiece or a completely new vision, our atelier is ready to bring your dream to life.</p>
          <button style={{ marginTop: '2.5rem', padding: '1rem 2.5rem', background: 'var(--secondary)', color: 'white', borderRadius: '28px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 12px 24px rgba(74,55,55,0.15)' }}>Explore Customizations</button>
       </section>
    </div>
  );
};

export default CatalogPage;
