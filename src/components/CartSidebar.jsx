import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

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
            style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '500px', background: 'white', zIndex: 3001, display: 'flex', flexDirection: 'column', padding: '2rem', borderRadius: '40px 0 0 40px', boxShadow: '-20px 0 60px rgba(233,163,163,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShoppingBag color="var(--primary)" />
                <h2 style={{ fontSize: '1.6rem', fontFamily: 'Playfair Display' }}>Your Dream Bag ({cart.length})</h2>
              </div>
              <button onClick={onClose} style={{ color: 'var(--primary)', background: '#fff0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }} className="amara-scroll">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '8rem', color: 'var(--text-light)' }}>
                  <Heart size={60} fill="var(--soft-pink)" color="var(--primary)" style={{ opacity: 0.3, marginBottom: '2rem' }} />
                  <p>Your bag is feeling lonely... Let's add some magic! ✨</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.5rem', background: '#fffcfc', padding: '1rem', borderRadius: '25px' }}>
                      <div style={{ width: '100px', height: '130px', background: '#fef5f5', borderRadius: '20px', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)', fontWeight: 700 }}>{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--primary)', background: 'none' }}><Trash2 size={16} /></button>
                        </div>
                        <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.3rem' }}>{item.category}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'white', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #fff0f0' }}>
                            <button onClick={() => updateQuantity(item.id, -1)} style={{ color: 'var(--primary)', background: 'none' }}><Minus size={14} /></button>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={{ color: 'var(--primary)', background: 'none' }}><Plus size={14} /></button>
                          </div>
                          <p style={{ fontWeight: 800, color: 'var(--secondary)' }}>₹{(item.discountedPrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '2px dashed #fff0f0', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Grand Total</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '1.5rem', background: 'var(--secondary)', color: 'white', fontWeight: 700, borderRadius: '25px', boxShadow: '0 15px 30px rgba(74,55,55,0.2)', cursor: 'pointer', border: 'none' }}
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
