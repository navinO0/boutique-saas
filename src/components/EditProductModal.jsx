import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Image as ImageIcon, Plus, Sparkles, Heart } from 'lucide-react';
import { BOUTIQUE_CONFIG } from '../data/config';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '0',
    stock: '',
    category: 'sarees',
    image: '',
    images: [],
    description: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images || [product.image]
      });
    } else {
      setFormData({
        name: '',
        price: '',
        discount: '0',
        stock: '10',
        category: 'sarees',
        image: '',
        images: [],
        description: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
        alert("Please add at least one image of your beautiful work! ✨");
        return;
    }
    onSave({
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      discountedPrice: Number(formData.price) * (1 - (Number(formData.discount || 0) / 100)),
      stock: Number(formData.stock),
      image: formData.images[0]
    });
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(255, 245, 245, 0.4)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            style={{ 
                background: 'white', 
                padding: 'clamp(1.5rem, 5vw, 3rem)', 
                borderRadius: '45px', 
                maxWidth: '700px', 
                width: '100%', 
                position: 'relative', 
                maxHeight: '90vh', 
                overflowY: 'auto',
                boxShadow: '0 30px 60px rgba(233,163,163,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fff0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'var(--primary)', cursor: 'pointer' }}><X size={20} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{product ? 'Edit Your Masterpiece' : 'Upload New Work'}</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Add details and images of your beautiful designs</p>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Design Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none', appearance: 'none' }}>
                      {BOUTIQUE_CONFIG.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Sale (%)</label>
                  <input type="number" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>In Stock</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Work Portfolio (Images)</label>
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <input 
                    type="text" 
                    placeholder="Paste Image URL ✨" 
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
                  {formData.images.length === 0 && <div style={{ padding: '2rem', border: '2px dashed #ffe4e1', borderRadius: '25px', width: '100%', textAlign: 'center', color: '#ffccd2', fontSize: '0.85rem' }}>No images added yet. Click + to add work from URLs.</div>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Design Story (Description)</label>
                <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the soul of this design..." style={{ width: '100%', padding: '1.2rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none', resize: 'none' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '1.5rem', background: 'var(--secondary)', color: 'white', fontWeight: 800, borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(74,55,55,0.2)' }}>
                <Save size={20} /> {product ? 'Save Design Changes' : 'Publish My Work ✨'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;
