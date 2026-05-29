import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Image as ImageIcon, Plus, Sparkles, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const { siteConfig } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '0',
    stock: '',
    category: 'sarees',
    image: '',
    images: [],
    colors: [],
    sizes: [],
    description: '',
    isIcon: false
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images || [product.image],
        colors: product.colors || [],
        sizes: product.sizes || [],
        isIcon: product.isIcon || false
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
        colors: [],
        sizes: [],
        description: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Please add at least one image of your beautiful work!  ");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount || 0),
        discountedPrice: Number(formData.price) * (1 - (Number(formData.discount || 0) / 100)),
        stock: Number(formData.stock),
        image: formData.images[0]
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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

  const addColor = () => {
    if (colorInput.trim()) {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()]
      });
      setColorInput('');
    }
  };

  const removeColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim()]
      });
      setSizeInput('');
    }
  };

  const removeSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
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
            className="amara-modal"
            style={{
              padding: 'clamp(1.5rem, 5vw, 3rem)',
              maxWidth: '700px',
              width: '100%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fff0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'var(--primary)', cursor: 'pointer' }}><X size={20} /></button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Sparkles size={24} color="var(--primary)" style={{ marginBottom: '0.6rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>{product ? 'Edit Your Masterpiece' : 'Upload New Work'}</h2>
              <p style={{ color: '#999', fontSize: '0.78rem', marginTop: '0.3rem' }}>Fill in the details of your beautiful design</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Design Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', appearance: 'none', fontSize: '0.88rem' }}>
                    {siteConfig.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Sale (%)</label>
                  <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>In Stock</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Work Portfolio (Images)</label>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL  "
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    style={{ flex: 1, padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', fontSize: '0.85rem', minWidth: 0 }}
                  />
                  <button type="button" onClick={addImage} style={{ padding: '0 1.2rem', background: 'var(--primary)', color: 'white', borderRadius: '18px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                    <Plus size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {formData.images.map((img, idx) => (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={idx} style={{ position: 'relative', width: '70px', height: '85px', borderRadius: '14px', overflow: 'hidden' }}>
                      <img src={img} alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                  {formData.images.length === 0 && <div style={{ padding: '1rem', border: '2px dashed #ffe4e1', borderRadius: '18px', width: '100%', textAlign: 'center', color: '#ffccd2', fontSize: '0.78rem' }}>No images yet — paste a URL above</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Available Colors</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.7rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={colorInput.startsWith('#') ? colorInput : '#e9a3a3'}
                      onChange={(e) => setColorInput(e.target.value)}
                      style={{ width: '38px', height: '38px', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'white', padding: '0', overflow: 'hidden', flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      placeholder="Hex code"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      style={{ flex: 1, padding: '0.75rem 0.8rem', border: 'none', background: '#fff9f9', borderRadius: '14px', outline: 'none', fontSize: '0.82rem', minWidth: 0 }}
                    />
                    <button type="button" onClick={addColor} style={{ padding: '0 0.9rem', background: 'var(--primary)', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', height: '38px', flexShrink: 0 }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {formData.colors.map((color, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff9f9', padding: '0.3rem 0.7rem', borderRadius: '14px', border: '1px solid #ffe4e1' }}>
                        <div style={{ width: '12px', height: '12px', background: color, borderRadius: '50%', border: '1px solid #ddd', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--secondary)' }}>{color}</span>
                        <button type="button" onClick={() => removeColor(idx)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Available Sizes</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.7rem' }}>
                    <input
                      type="text"
                      placeholder="S, M, L, XL..."
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      style={{ flex: 1, padding: '0.75rem 0.8rem', border: 'none', background: '#fff9f9', borderRadius: '14px', outline: 'none', fontSize: '0.82rem', minWidth: 0 }}
                    />
                    <button type="button" onClick={addSize} style={{ padding: '0 0.9rem', background: 'var(--primary)', color: 'white', borderRadius: '14px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {formData.sizes.map((size, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff9f9', padding: '0.3rem 0.8rem', borderRadius: '14px', border: '1px solid #ffe4e1' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--secondary)' }}>{size}</span>
                        <button type="button" onClick={() => removeSize(idx)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Design Story (Description)</label>
                <textarea rows="3" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the soul of this design..." style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: '#fff9f9', borderRadius: '18px', outline: 'none', resize: 'none', fontSize: '0.88rem' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="isIcon"
                  checked={formData.isIcon}
                  onChange={(e) => setFormData({ ...formData, isIcon: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="isIcon" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', cursor: 'pointer' }}>
                  Show on Landing Page (Icons Section)
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '1rem', background: 'var(--secondary)', color: 'white', fontWeight: 700, borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '0.9rem', boxShadow: '0 8px 20px rgba(74,55,55,0.2)', opacity: isSubmitting ? 0.7 : 1 }}
              >
                <Save size={17} /> {isSubmitting ? 'Processing...' : (product ? 'Save Design Changes' : 'Publish My Work  ')}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;
