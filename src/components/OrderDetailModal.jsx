import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, ShoppingBag, CheckCircle, Package, Phone, User } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUtils';

const OrderDetailModal = ({ isOpen, onClose, order, isAdmin, onApprove, isProcessing }) => {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence mode="wait">
      <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26, 17, 17, 0.45)', backdropFilter: 'blur(12px)' }}
        />
        
        {/* Modal Container - Mobile Sheet Style */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            width: '100%',
            maxWidth: '550px',
            maxHeight: '92vh',
            background: 'white',
            borderRadius: '40px 40px 0 0',
            position: 'relative',
            zIndex: 5001,
            overflowY: 'auto',
            boxShadow: '0 -20px 50px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}
          className="amara-scroll"
        >
          {/* Handle for sheet feel */}
          <div style={{ width: '40px', height: '4px', background: '#eee', borderRadius: '2px', margin: '1rem auto 0', flexShrink: 0 }} />

          {/* Sticky Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f8f8f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>#{order.id.toString().padStart(6, '0')}</h2>
              <p style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                Manifest Created {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Status Section */}
            <div style={{ textAlign: 'center', background: '#fefafa', padding: '1.2rem', borderRadius: '25px', border: '1px solid #fff0f0' }}>
              <span style={{ 
                padding: '0.5rem 1.2rem', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                background: order.status === 'delivered' ? '#f0fdf4' : order.status === 'confirmed' ? '#f0fdf4' : '#fff7ed',
                color: order.status === 'delivered' ? '#10b981' : order.status === 'confirmed' ? '#10b981' : '#f97316',
                display: 'inline-block', marginBottom: isAdmin && order.status === 'pending' ? '1.2rem' : '0'
              }}>
                {order.status}
              </span>
              {isAdmin && order.status === 'pending' && (
                <button 
                  disabled={isProcessing}
                  onClick={() => onApprove(order.id)}
                  style={{ 
                    width: '100%', padding: '1rem', background: 'var(--primary)', 
                    color: 'white', border: 'none', borderRadius: '18px', fontWeight: 800, 
                    fontSize: '0.85rem', boxShadow: '0 10px 25px rgba(233,163,163,0.3)', cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessing ? 'Verifying...' : 'Approve Order Manifest'}
                </button>
              )}
            </div>

            {/* Grid for Shipping & Payment - Stacks on mobile */}
            <div className="order-details-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {/* 2. Customer & shipping */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
                  <MapPin size={14} />
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Shipping Details</h4>
                </div>
                <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #fff0f0' }}>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--secondary)' }}>{order.address?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.4rem', lineHeight: 1.5 }}>{order.address?.addressText}, {order.address?.city} - {order.address?.pincode}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.6rem' }}>+91 {order.address?.phone}</p>
                </div>
              </div>

              {/* 3. Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
                  <CreditCard size={14} />
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Payment Context</h4>
                </div>
                <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #fff0f0' }}>
                  <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginBottom: '0.2rem' }}>UTR / ID</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--secondary)', wordBreak: 'break-all' }}>{order.transactionId || 'NOT_PROVIDED'}</p>
                  <p style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.4rem', fontStyle: 'italic' }}>Submitted via {order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* 4. Ordered Pieces */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
                <ShoppingBag size={14} />
                <h4 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Ordered Pieces</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {order.OrderItems?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#fafafa', padding: '1rem', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                    <div style={{ width: '60px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #eee' }}>
                      <img src={resolveImageUrl(item.Product?.images?.[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.2rem' }}>{item.Product?.name}</h5>
                      <p style={{ fontSize: '0.7rem', color: '#888' }}>{item.size || 'Free Size'} • {item.color || 'Default'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.6rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>₹{parseFloat(item.price).toLocaleString()} x {item.quantity}</p>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Manifest Total */}
            <div style={{ marginTop: '0.5rem', padding: '2rem 0', borderTop: '2px dashed #f5f5f5', textAlign: 'center' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem' }}>Manifest Total Value</p>
              <p style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-1.5px' }}>₹{parseFloat(order.total).toLocaleString()}</p>
              <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.4rem', fontFamily: 'Roboto' }}>Including all atelier charges</p>
            </div>

            
            <div style={{ height: '3rem', flexShrink: 0 }} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailModal;
