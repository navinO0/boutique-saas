import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, placeOrder, currentUser } = useShop();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

  const handleCheckout = () => {
    if (!currentUser) {
      onClose();
      navigate('/auth');
      return;
    }
    const result = placeOrder();
    if (result.success) {
      onClose();
      navigate('/orders');
    } else {
      alert(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(233,163,163,0.3)', backdropFilter: 'blur(5px)', zIndex: 3000 }}
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '440px', background: 'white', zIndex: 3001, display: 'flex', flexDirection: 'column', padding: 'clamp(1.2rem, 4vw, 2.2rem)', borderRadius: '32px 0 0 32px', boxShadow: '-24px 0 64px rgba(233,163,163,0.12)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShoppingBag size={20} color="var(--primary)" />
                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Your Dream Bag ({cart.length})</h2>
              </div>
              <button onClick={onClose} style={{ color: 'var(--primary)', background: '#fff0f0', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }} className="amara-scroll">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '8rem', color: 'var(--text-light)' }}>
                  <Heart size={60} fill="var(--soft-pink)" color="var(--primary)" style={{ opacity: 0.3, marginBottom: '2rem' }} />
                  <p>Your bag is feeling lonely... Let's add some magic! ✨</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.2rem', background: '#fffcfc', padding: '0.8rem', borderRadius: '20px', border: '1px solid #fff0f0' }}>
                      <div style={{ width: '80px', height: '100px', background: '#fef5f5', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={resolveImageUrl(item.images?.[0] || item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '0.98rem', color: 'var(--secondary)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 10px' }}><Trash2 size={14} /></button>
                        </div>
                        <p style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.2rem' }}>{item.category}</p>
                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          {item.selectedSize && <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '8px', color: '#666' }}>S: {item.selectedSize}</span>}
                          {item.selectedColor && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <div style={{ width: '10px', height: '10px', background: item.selectedColor, borderRadius: '50%', border: '1px solid #eee' }} />
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>{item.selectedColor}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.3rem 0.8rem', borderRadius: '15px', border: '1px solid #ffefef' }}>
                            <button onClick={() => updateQuantity(item.id, -1, item.selectedSize, item.selectedColor)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Minus size={12} /></button>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1, item.selectedSize, item.selectedColor)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Plus size={12} /></button>
                          </div>
                          <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.95rem' }}>₹{(item.discountedPrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '2px dashed #fff0f0', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#666' }}>Grand Total</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '1rem', background: 'var(--secondary)', color: 'white', fontWeight: 700, borderRadius: '22px', boxShadow: '0 12px 28px rgba(74,55,55,0.18)', cursor: 'pointer', border: 'none', fontSize: '0.95rem' }}
                >
                  Confirm Orders ✨
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
