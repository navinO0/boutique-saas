import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Package, ArrowLeft, Clock, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserOrdersPage = () => {
  const { allOrders, currentUser } = useShop();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) navigate('/auth');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Filter orders for the current user
  const userOrders = allOrders.filter(order => order.email === currentUser.email);

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h2 style={{ fontSize: '3rem' }}>Account History</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600 }}>{currentUser.name}</p>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>{currentUser.email}</p>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Package size={64} style={{ color: '#eee', marginBottom: '2rem' }} />
          <h3 style={{ color: '#999' }}>You haven't placed any orders yet</h3>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '2rem', display: 'inline-block' }}>Explore active collections</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {userOrders.map(order => (
            <motion.div 
              key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
            >
              {/* Order Header */}
              <div style={{ padding: '2rem', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '3rem' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>Order Placed</p>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.date}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>Total Amount</p>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{order.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>Status</p>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                      background: order.status === 'Delivered' ? '#ecfdf5' : order.status === 'Pending' ? '#fff7ed' : '#eff6ff',
                      color: order.status === 'Delivered' ? '#059669' : order.status === 'Pending' ? '#ea580c' : '#2563eb'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>Order ID: <span style={{ color: '#333', fontWeight: 600 }}>#{order.id}</span></p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '2rem' }}>
                {Array.isArray(order.items) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{item.name}</h4>
                          <p style={{ color: '#999', fontSize: '0.85rem' }}>{item.category.toUpperCase()} • Qty: {item.quantity || 1}</p>
                          <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}>Buy it again</button>
                            <span style={{ color: '#eee' }}>|</span>
                            <button style={{ fontSize: '0.8rem', color: '#666', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}>View item</button>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{(item.discountedPrice * (item.quantity || 1)).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#999', fontStyle: 'italic' }}>
                    Multiple items listed in summary (#ORD{order.id})
                  </div>
                )}
                
                <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
                  <Link to="/tracking" style={{ color: '#333', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Track Package <ChevronRight size={16} />
                  </Link>
                  <button style={{ color: '#fff', background: 'var(--secondary)', padding: '0.6rem 1.5rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    Write Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
