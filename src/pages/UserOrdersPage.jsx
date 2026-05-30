import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Package, ArrowLeft, Clock, MapPin, ExternalLink, ChevronRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

import OrderDetailModal from '../components/OrderDetailModal';
import PookieLoader from '../components/PookieLoader';

const UserOrdersPage = () => {
  const { myOrders, fetchMyOrders, currentUser, logoutUser, isLoading } = useShop();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  React.useEffect(() => {
    if (!currentUser) navigate('/auth');
    else fetchMyOrders();
  }, [currentUser]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: 'clamp(4rem, 10vw, 6rem) clamp(1rem, 5vw, 2rem)' }}>
      {/* ... header remains same ... */}
      <div style={{ marginBottom: 'clamp(2rem, 8vw, 4rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', marginBottom: '0.8rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Order History</h2>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <div>
            <p style={{ fontWeight: 850, color: 'var(--secondary)', fontSize: '0.9rem' }}>{currentUser.name}</p>
            <p style={{ color: '#aaa', fontSize: '0.75rem' }}>{currentUser.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff9f9', color: 'var(--primary)', 
              padding: '0.5rem 1rem', borderRadius: '15px', border: '1px solid #ffeded', 
              fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {isLoading ? <PookieLoader /> : myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
          <Package size={48} style={{ color: '#f5f5f5', marginBottom: '1.5rem' }} />
          <h3 style={{ color: '#999', fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>No orders yet</h3>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '1rem', display: 'inline-block', textDecoration: 'none', fontSize: '0.9rem' }}>Explore active collections</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myOrders.map(order => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/account/order/${order.id}`)}
              style={{ 
                background: 'white', borderRadius: '25px', border: '1px solid #fff3f3', padding: '1.2rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                transition: '0.3s', boxShadow: '0 5px 15px rgba(233,163,163,0.02)'
              }}
              whileHover={{ scale: 1.01, boxShadow: '0 10px 30px rgba(233,163,163,0.08)', borderColor: 'var(--primary)' }}
            >
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.2rem' }}>Order</span>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--secondary)' }}>#{order.id.toString().padStart(5, '0')}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.2rem' }}>Date</span>
                  <p style={{ fontWeight: 800, fontSize: '0.8rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.2rem' }}>Amount</span>
                  <p style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.85rem' }}>₹{parseFloat(order.total).toLocaleString()}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.2rem' }}>Items</span>
                  <p style={{ fontWeight: 800, color: '#666', fontSize: '0.8rem' }}>{order.OrderItems?.reduce((acc, item) => acc + item.quantity, 0)} Pcs</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase',
                  background: order.status === 'delivered' ? '#f0fdf4' : order.status === 'pending' ? '#fff7ed' : '#f0f9ff',
                  color: order.status === 'delivered' ? '#10b981' : order.status === 'pending' ? '#f97316' : '#0369a1'
                }}>
                  {order.status}
                </span>
                <ChevronRight size={18} color="#eee" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
