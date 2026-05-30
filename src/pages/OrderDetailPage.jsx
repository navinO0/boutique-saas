import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  ArrowLeft, MapPin, CreditCard, ShoppingBag, 
  Package, Phone, ChevronRight, CheckCircle2, Clock, Truck
} from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUtils';
import PookieLoader from '../components/PookieLoader';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { currentUser, getHeaders } = useShop();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchOrder = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/orders/${orderId}`, { headers: getHeaders() });
        setOrder(resp.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser, navigate, getHeaders]);

  if (loading) return <PookieLoader fullScreen={true} />;
  if (!order) return <div className="container" style={{ padding: '10rem 2rem', textAlign: 'center' }}><h2>Order not found</h2><Link to="/account?tab=orders">Back to Orders</Link></div>;

  return (
    <div className="container" style={{ padding: 'clamp(4rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem) 10rem' }}>
      {/* Header */}
      <div style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
        <Link 
          to="/account?tab=orders" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#aaa', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.2rem' }}
        >
          <ArrowLeft size={14} /> Back to History
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Manifest #{order.id.toString().padStart(6, '0')}</h1>
            <p style={{ color: '#888', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
              Created on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ 
            background: order.status === 'delivered' ? '#f0fdf4' : order.status === 'confirmed' ? '#f0fdf4' : '#fff7ed',
            color: order.status === 'delivered' ? '#10b981' : order.status === 'confirmed' ? '#10b981' : '#f97316',
            padding: '0.6rem 1.5rem', borderRadius: '15px', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            Order {order.status}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr clamp(300px, 35vw, 450px)', gap: 'clamp(2rem, 5vw, 4rem)' }} className="order-detail-grid">
        {/* Left Side: Items and Tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Order Pieces */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '2rem' }}>
              <ShoppingBag size={20} />
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Curated Selections</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {order.OrderItems?.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '25px', border: '1px solid #fff0f0' }}
                >
                  <div style={{ width: '80px', height: '110px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, border: '1px solid #eee' }}>
                    <img src={resolveImageUrl(item.Product?.images?.[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fefafa' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.3rem' }}>{item.Product?.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>{item.size || 'Free Size'} • {item.color || 'Default'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#555' }}>₹{parseFloat(item.price).toLocaleString()} x {item.quantity}</p>
                      <p style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--primary)' }}>₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Value Summary (Mobile Only - usually shown on right for desktop) */}
          <div className="od-mobile-only" style={{ padding: '2rem', background: 'var(--accent)', borderRadius: '30px', textAlign: 'center' }}>
             <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#bb9999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Manifest Total</p>
             <p style={{ fontSize: '2.8rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-2px' }}>₹{parseFloat(order.total).toLocaleString()}</p>
          </div>
        </div>

        {/* Right Side: Shipping & Payment Metadata */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary Box */}
          <div className="od-desktop-only" style={{ padding: '2.5rem', background: 'var(--accent)', borderRadius: '40px', border: '1px solid #fff0f0', textAlign: 'center' }}>
             <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#bb9999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Manifest Total Value</p>
             <p style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--primary)', letterSpacing: '-2.5px' }}>₹{parseFloat(order.total).toLocaleString()}</p>
             <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '1rem', fontStyle: 'italic', fontFamily: 'Playfair Display' }}>Including all atelier charges</p>
          </div>

          {/* Shipping */}
          <div style={{ padding: '2rem', background: 'white', borderRadius: '30px', border: '1px solid #fff0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <MapPin size={18} />
              <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Destination</h4>
            </div>
            <p style={{ fontWeight: 850, fontSize: '1rem', color: 'var(--secondary)' }}>{order.address?.name}</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.6rem', lineHeight: 1.6 }}>{order.address?.addressText}, {order.address?.city} - {order.address?.pincode}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem', padding: '0.8rem 1.2rem', background: '#fefafa', borderRadius: '15px', color: 'var(--secondary)' }}>
               <Phone size={14} />
               <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>+91 {order.address?.phone}</span>
            </div>
          </div>

          {/* Payment */}
          <div style={{ padding: '2rem', background: 'white', borderRadius: '30px', border: '1px solid #fff0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <CreditCard size={18} />
              <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Payment Context</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>UTR / Transaction ID</span>
              <p style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--secondary)', wordBreak: 'break-all' }}>{order.transactionId || 'NOT_PROVIDED'}</p>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                 <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>Method: {order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* CSS for responsive grid */}
      <style>{`
        @media (max-width: 900px) {
          .order-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .od-desktop-only { display: none !important; }
          .od-mobile-only { display: block !important; }
        }
        @media (min-width: 901px) {
          .od-mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
