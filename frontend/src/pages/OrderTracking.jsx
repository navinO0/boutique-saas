import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Clock, Scissors, Package } from 'lucide-react';
import { MOCK_ORDERS } from '../data/config';

const OrderTracking = () => {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_ORDERS.find(o => o.id.toLowerCase() === searchId.toLowerCase());
      setOrder(found || "not-found");
      setLoading(false);
    }, 800);
  };

  const statusSteps = ["Cutting", "In Progress", "Quality Check", "Completed", "Delivered"];

  return (
    <div className="container" style={{ padding: '4rem 2rem', minHeight: '70vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Track Your Order</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '3rem' }}>
          Enter your Order ID (e.g., ORD001) to see the live status of your custom stitching.
        </p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '4rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
            <input 
              type="text" 
              placeholder="Enter Order ID" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ background: 'var(--secondary)', color: 'white', padding: '0 2rem', borderRadius: '4px', fontWeight: 600 }}
          >
            Track
          </button>
        </form>

        {loading && <Loader2 className="animate-spin" style={{ margin: '0 auto', color: 'var(--primary)' }} />}

        {order === "not-found" && (
          <div style={{ padding: '2rem', background: '#fff5f5', color: '#c53030', borderRadius: '8px' }}>
            Order ID not found. Please check and try again.
          </div>
        )}

        {order && order !== "not-found" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'left', background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase' }}>Order ID</span>
                <h3 style={{ fontSize: '1.5rem' }}>#{order.id}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase' }}>Customer</span>
                <h3 style={{ fontSize: '1.2rem' }}>{order.customer}</h3>
              </div>
            </div>

            <h4 style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Item: <span style={{ color: 'var(--primary)' }}>{order.item}</span></h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '4rem' }}>
              {/* Progress Line */}
              <div style={{ position: 'absolute', top: '15px', left: '0', width: '100%', height: '2px', background: '#eee', zIndex: 0 }}></div>
              
              {statusSteps.map((step, idx) => {
                const isActive = statusSteps.indexOf(order.status) >= idx;
                const isCurrent = order.status === step;
                
                return (
                  <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: isActive ? 'var(--primary)' : 'white', 
                      border: `2px solid ${isActive ? 'var(--primary)' : '#eee'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? 'white' : '#eee',
                      marginBottom: '1rem'
                    }}>
                      {isActive ? <CheckCircle2 size={16} /> : <div style={{width: 8, height: 8, background: '#eee', borderRadius: '50%'}}></div>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text)' : '#999' }}>{step}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
