import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Clock, Scissors, Package, ArrowRight, Sparkles } from 'lucide-react';
import PookieLoader from '../components/PookieLoader';
import { useShop } from '../context/ShopContext';

const OrderTracking = () => {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useShop();

  // Mocking the search for now as backend requires authentication for order lookups
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      // Small simulation of finding an order
      if (searchId.toUpperCase().includes('ORD')) {
        setOrder({
          id: searchId.toUpperCase(),
          customer: "Grace Hopper",
          item: "Heritage Silk Saree",
          status: "In Progress",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          steps: ["Placed", "Cutting", "In Progress", "Quality Check", "Completed"]
        });
      } else {
        setOrder("not-found");
      }
      setLoading(false);
    }, 1500);
  };

  const statusSteps = ["Placed", "Cutting", "In Progress", "Quality Check", "Completed"];

  return (
    <div className="container" style={{ padding: 'clamp(5rem, 12vw, 10rem) 1.5rem', minHeight: '85vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
          <div style={{ display: 'inline-flex', padding: '0.6rem 1.2rem', background: '#fff0f0', borderRadius: '20px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.2rem', boxShadow: '0 5px 15px rgba(233,163,163,0.1)' }}>
            Live Atelier Status
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1 }}>Track Your <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Magic</span></h2>
          <p style={{ color: '#777', marginTop: '1.2rem', maxWidth: '520px', margin: '1.2rem auto', fontSize: '0.92rem', lineHeight: 1.9 }}>
            Enter your unique Order Reference to peek into our atelier and see the progress of your handcrafted masterpiece.
          </p>
        </div>
        
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          marginBottom: '5rem',
          background: 'white',
          padding: '0.6rem',
          borderRadius: '40px',
          boxShadow: '0 25px 60px rgba(233,163,163,0.15)',
          border: '1px solid #fff5f5'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} size={20} />
            <input 
              type="text" 
              placeholder="Your Order ID (e.g. ORD702)" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: '100%', padding: '1.1rem 1.5rem 1.1rem 3.8rem', borderRadius: '32px', border: 'none', background: '#fefafa', fontSize: '1rem', fontWeight: 700, outline: 'none', color: 'var(--secondary)' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: 'var(--secondary)', 
              color: 'white', 
              padding: '0 2.5rem', 
              borderRadius: '32px', 
              fontWeight: 800, 
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              transition: '0.3s'
            }}
          >
            {loading ? 'Locating...' : 'Track'} <ArrowRight size={18} />
          </button>
        </form>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '4rem 0' }}
            >
              <PookieLoader />
              <p style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontStyle: 'italic', fontFamily: 'Playfair Display' }}>Consulting with our master tailors...</p>
            </motion.div>
          ) : order === "not-found" ? (
            <motion.div 
              key="not-found"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '4rem 2rem', background: '#fff9f9', color: 'var(--primary)', borderRadius: '45px', textAlign: 'center', border: '1.5px solid #fff0f0' }}
            >
              <Package size={40} style={{ marginBottom: '1.2rem', opacity: 0.5 }} />
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: 'var(--secondary)' }}>Order Not Found</h3>
              <p style={{ marginTop: '0.5rem', opacity: 0.7, maxWidth: '400px', margin: '0.5rem auto' }}>The wings of our messenger haven't found this ID yet. Please double check your confirmation email or contact support.</p>
            </motion.div>
          ) : order ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'left', background: 'white', padding: 'clamp(1.5rem, 5vw, 4rem)', borderRadius: '45px', boxShadow: '0 40px 100px rgba(233,163,163,0.12)', border: '1px solid #fff5f5' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px solid #fef0f0', paddingBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '2px' }}>Reference</span>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1 }}>{order.id}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '2px' }}>Est. Completion</span>
                  <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: 'var(--secondary)', fontWeight: 800 }}>{order.date}</h3>
                </div>
              </div>

              <div style={{ marginBottom: '4.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem', background: '#fefafa', padding: '1.5rem 2rem', borderRadius: '28px', border: '1px solid #fff0f0' }}>
                <div style={{ background: 'white', padding: '0.8rem', borderRadius: '15px', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                  <Scissors size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Masterpiece</p>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', marginTop: '0.2rem' }}>{order.item}</h4>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '5rem', flexWrap: 'wrap', rowGap: '3.5rem' }}>
                {/* Progress Line */}
                <div style={{ position: 'absolute', top: '24px', left: '8%', width: '84%', height: '2.5px', background: '#fef0f0', zIndex: 0 }} className="desktop-only"></div>
                
                {statusSteps.map((step, idx) => {
                  const isActive = statusSteps.indexOf(order.status) >= idx;
                  const isCurrent = order.status === step;
                  
                  return (
                    <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '110px' }}>
                      <motion.div 
                        initial={false}
                        animate={{ 
                          scale: isCurrent ? 1.15 : 1,
                          backgroundColor: isActive ? 'var(--primary)' : '#fff',
                        }}
                        style={{ 
                          width: '52px', 
                          height: '52px', 
                          borderRadius: '50%', 
                          border: `2px solid ${isActive ? 'var(--primary)' : '#fef0f0'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'white' : '#ddd',
                          marginBottom: '1.2rem',
                          boxShadow: isCurrent ? '0 12px 30px rgba(233,163,163,0.4)' : 'none',
                          background: 'white',
                          position: 'relative'
                        }}
                      >
                        {isActive ? <CheckCircle2 size={24} /> : <div style={{width: 10, height: 10, background: '#fef0f0', borderRadius: '50%'}}></div>}
                        {isCurrent && (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{ position: 'absolute', inset: '-6px', border: '2px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
                          />
                        )}
                      </motion.div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: isActive ? 'var(--secondary)' : '#ccc', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center' }}>{step}</span>
                      {isCurrent && <motion.div layoutId="sparkle-track" style={{ position: 'absolute', top: '-1.8rem' }}><Sparkles size={18} color="var(--primary)" /></motion.div>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTracking;
