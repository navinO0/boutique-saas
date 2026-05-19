import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, Instagram, Facebook, Phone, ShoppingCart, Heart, LogOut, Settings, ArrowRight, Sparkles } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import AuthPage from './pages/AuthPage';
import WishlistPage from './pages/WishlistPage';
import UserOrdersPage from './pages/UserOrdersPage';
import CartSidebar from './components/CartSidebar';
import { useShop } from './context/ShopContext';

import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, currentUser, logoutUser, wishlist, logoutAdmin, siteConfig } = useShop();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminUser = currentUser?.email === 'admin@amara.com';

  const handleLogout = () => {
    logoutUser();
    if (isAdminUser) logoutAdmin();
  };

  return (
    <nav style={{ 
      position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', 
      width: '95%', maxWidth: '1400px', zIndex: 1000, 
      padding: isScrolled ? '0.8rem 2rem' : '1.2rem 2.5rem', 
      transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      borderRadius: '40px',
      boxShadow: isScrolled ? '0 10px 30px rgba(233,163,163,0.15)' : 'none',
      border: '1px solid rgba(255,255,255,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Playfair Display', color: 'var(--secondary)', letterSpacing: '1px' }}>
          {siteConfig.name} <span style={{ color: 'var(--primary)' }}>✨</span>
        </Link>
        
        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-only">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Link to="/">Home</Link>
            <Link to="/products">Collections</Link>
            <Link to="/catalog">Catalog</Link>
            {currentUser && (
              isAdminUser ? <Link to="/admin">Admin</Link> : <Link to="/orders">Orders</Link>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--secondary)' }}>
            <div style={{ position: 'relative', cursor: 'pointer', background: '#fff0f0', padding: '0.6rem', borderRadius: '50%' }} onClick={onOpenCart}>
              <ShoppingCart size={18} color="var(--primary)" />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  {cart.length}
                </span>
              )}
            </div>
            {currentUser ? (
              <button onClick={handleLogout} style={{ background: '#fff0f0', color: 'var(--primary)', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}><LogOut size={18} /></button>
            ) : (
              <Link to="/auth" style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '25px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Icons */}
        <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="mobile-only">
          <div style={{ position: 'relative', background: '#fff0f0', padding: '0.6rem', borderRadius: '50%' }} onClick={onOpenCart}>
            <ShoppingCart size={18} color="var(--primary)" />
          </div>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', color: 'var(--secondary)' }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', padding: '2rem 0' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)}>Collections</Link>
              <Link to="/catalog" onClick={() => setIsOpen(false)}>Catalog</Link>
              {currentUser && (
                isAdminUser ? <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link> : <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
              )}
              {!currentUser && <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>}
              {currentUser && <button onClick={handleLogout} style={{ color: 'var(--primary)', background: 'none' }}>Logout</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { siteConfig } = useShop();
  return (
    <footer style={{ background: 'var(--accent)', color: 'var(--secondary)', padding: '8rem 0 4rem', borderRadius: '60px 60px 0 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '4rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display' }}>{siteConfig.name} <Heart size={20} fill="var(--primary)" color="var(--primary)" style={{ display: 'inline' }} /></h3>
          <p style={{ opacity: 0.7, maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.8' }}>{siteConfig.motto}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <div style={{ background: 'white', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><Instagram size={18} /></div>
            <div style={{ background: 'white', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><Facebook size={18} /></div>
            <div style={{ background: 'white', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><Phone size={18} /></div>
          </div>
        </div>
        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '2rem' }}>Dreamy Links</h4>
           <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop Collections</Link></li>
              <li><Link to="/catalog">Atelier Catalog</Link></li>
             <li><Link to="/wishlist">Wishlist</Link></li>
           </ul>
        </div>
        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '2rem' }}>Help Corner</h4>
           <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
             <li><Link to="/tracking">Track Magic</Link></li>
             <li><Link to="/auth">My Account</Link></li>
           </ul>
        </div>
        <div>
           <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '2rem' }}>Newsletter</h4>
           <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Get magical updates ✨</p>
           <div style={{ display: 'flex', background: 'white', padding: '0.5rem', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
             <input type="email" placeholder="Email Address" style={{ background: 'none', border: 'none', paddingLeft: '1rem', flex: 1, outline: 'none' }} />
             <button style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight size={18} /></button>
           </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '6rem', opacity: 0.4, fontSize: '0.75rem', fontWeight: 700 }}>
        MADE WITH LOVE BY {siteConfig.name.toUpperCase()} ☁️
      </div>
    </footer>
  );
};

const Toast = () => {
  const { toast } = useShop();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          style={{ 
            position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', 
            zIndex: 5000, background: 'white', padding: '1rem 2rem', 
            borderRadius: '30px', boxShadow: '0 15px 35px rgba(233,163,163,0.3)',
            display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid #fff0f0'
          }}
        >
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem' }}>{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <Toast />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:categoryId" element={<ProductList />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
