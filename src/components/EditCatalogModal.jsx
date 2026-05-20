import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Image as ImageIcon, Plus, Sparkles } from 'lucide-react';
import { BOUTIQUE_CONFIG } from '../data/config';

const EditCatalogModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bridal',
    images: [],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        category: 'Bridal',
        images: [],
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
        alert("Please add at least one image of your work portfolio! ✨");
        return;
    }
    onSave(formData);
    onClose();
  };

  const addImage = () => {
    if (imageUrlInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrlInput.trim()]
      });
      setImageUrlInput('');
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(255, 245, 245, 0.4)', backdropFilter: 'blur(10px)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="amara-modal"
            style={{ 
                padding: 'clamp(1.5rem, 5vw, 3rem)', 
                maxWidth: '700px', 
                width: '100%', 
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fff0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'var(--primary)', cursor: 'pointer' }}><X size={20} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{item ? 'Update Catalog Work' : 'Add New Portfolio Piece'}</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Showcase your latest artisanal creations</p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Design Title</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Label/Style</label>
                    <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Bridal, Evening..." style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                  </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Portfolio Gallery (Images)</label>
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <input 
                    type="text" 
                    placeholder="Image URL ✨" 
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    style={{ flex: 1, padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }}
                  />
                  <button type="button" onClick={addImage} style={{ padding: '0 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '25px', border: 'none', cursor: 'pointer' }}>
                    <Plus size={24} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {formData.images.map((img, idx) => (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={idx} style={{ position: 'relative', width: '90px', height: '110px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 50px 20px rgba(0,0,0,0.02)' }}>
                      <img src={img} alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                  {formData.images.length === 0 && <div style={{ padding: '2rem', border: '2px dashed #ffe4e1', borderRadius: '25px', width: '100%', textAlign: 'center', color: '#ffccd2', fontSize: '0.85rem' }}>No images added yet. Click + to add work.</div>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>The Design Story</label>
                <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the craftsmanship..." style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none', resize: 'none' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '1.5rem', background: 'var(--secondary)', color: 'white', fontWeight: 800, borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(74,55,55,0.2)' }}>
                <Save size={20} /> {item ? 'Save Catalog Updates' : 'Publish to Portfolio ✨'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCatalogModal;
