import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Calendar, Phone, Heart, Sparkles, X, Share2, Scissors, Quote, Plus, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import EditCatalogModal from '../components/EditCatalogModal';

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
                <img src={item.images[currentIdx]} style={{ width: '100%', height: 'clamp(300px, 60vh, 600px)', objectFit: 'cover' }} alt="" />
                {item.images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                    {item.images.map((_, i) => (
                      <div key={i} onClick={() => setCurrentIdx(i)} style={{ width: i === currentIdx ? '30px' : '10px', height: '10px', background: 'white', borderRadius: '5px', cursor: 'pointer' }} />
                    ))}
                  </div>
                )}
             </div>
             <div style={{ flex: 1, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '3px' }}>{item.category}</span>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', margin: '1rem 0' }}>{item.name}</h2>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginBottom: '2.5rem' }}>{item.description}</p>
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
                  style={{ padding: '1.5rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '35px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 10px 20px rgba(37, 211, 102, 0.2)' }}
                >
                  <MessageSquare size={20} /> Request Custom Recreation via WhatsApp
                </button>
             </div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', borderRadius: '50%', width: '40px', height: '40px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}><X /></button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CatalogPage = () => {
  useSmoothScroll();
  const { catalog, isAdminLoggedIn, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useShop();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    const catalogId = searchParams.get('catalogId');
    if (catalogId && catalog) {
      const item = catalog.find(i => i.id === catalogId);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [searchParams, catalog]);

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
           style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000, background: 'var(--secondary)', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '40px', border: 'none', fontWeight: 800, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
         >
           <Plus size={24} /> Add New Work
         </button>
       )}

       <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>The Atelier <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Catalog</span></h1>
          <p style={{ color: 'var(--text-light)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>A showcase of our finest handcrafted creations and past masterpieces. Each piece tells a story of elegance and intricate detail.</p>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
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
                <div style={{ height: '500px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(233,163,163,0.1)', position: 'relative' }}>
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
                    <img src={item.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                   <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{item.category}</p>
                   <h3 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{item.name}</h3>
                   <div style={{ width: '40px', height: '2px', background: '#ffe4e1', margin: '1.2rem auto' }}></div>
                   <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>Details Attached ✨</p>
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
       <section style={{ marginTop: '10rem', background: 'var(--accent)', padding: '6rem 2rem', borderRadius: '60px', textAlign: 'center' }}>
          <Quote size={40} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '2rem' }}>Every design is a conversation, <br/> every stitch is a promise.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-light)', lineHeight: 1.8 }}>Our catalog represents years of artisanal excellence. Whether you want a recreation of a past masterpiece or a completely new vision, our atelier is ready to bring your dream to life.</p>
          <button style={{ marginTop: '3rem', padding: '1.2rem 3rem', background: 'var(--secondary)', color: 'white', borderRadius: '35px', border: 'none', fontWeight: 800 }}>Explore Customizations</button>
       </section>
    </div>
  );
};

export default CatalogPage;
