import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Instagram, Facebook, Phone, ShoppingCart, Heart, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from './context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartSidebar from './components/CartSidebar';
import PookieLoader from './components/PookieLoader';
import ScrollToTop from './components/ScrollToTop';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProductList = lazy(() => import('./pages/ProductList'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const UserOrdersPage = lazy(() => import('./pages/UserOrdersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const Navbar = ({ onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { cart, currentUser, logoutUser, siteConfig, isAdminLoggedIn } = useShop();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminUser = isAdminLoggedIn;

  return (
    <nav style={{ 
      position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', 
      width: '95%', maxWidth: '1400px', zIndex: 1000, 
      padding: isScrolled ? '0.6rem 1.5rem' : '1rem 2rem', 
      transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(22px)',
      borderRadius: '32px',
      boxShadow: isScrolled ? '0 12px 35px rgba(233,163,163,0.12)' : 'none',
      border: '1px solid rgba(255,255,255,0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', minWidth: 0 }}>
           {siteConfig.logo ? (
             <img src={siteConfig.logo} alt="Logo" style={{ height: '40px', width: '40px', flexShrink: 0, objectFit: 'contain', borderRadius: '50%', background: 'white', padding: '4px', boxShadow: '0 5px 15px rgba(233,163,163,0.1)' }} />
           ) : (
             <div style={{ padding: '0.7rem', flexShrink: 0, background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex' }}><Sparkles size={16} /></div>
           )}
           <span style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 800, fontFamily: 'Playfair Display', color: 'var(--secondary)', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'clamp(120px, 30vw, 300px)' }}>
              {siteConfig.name}
           </span>
        </Link>
        
        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-only">
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            <Link to="/">Home</Link>
            <Link to="/products">Collections</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
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
              <button onClick={handleLogout} style={{ background: '#fff0f0', color: 'var(--primary)', padding: '0.55rem', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer' }}><LogOut size={16} /></button>
            ) : (
              <Link to="/auth" style={{ background: 'var(--primary)', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '22px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <User size={15} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Icons */}
        <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="mobile-only">
          <div style={{ position: 'relative', background: '#fff0f0', padding: '0.6rem', borderRadius: '50%' }} onClick={onOpenCart}>
            <ShoppingCart size={18} color="var(--primary)" />
          </div>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'var(--secondary)' }}>
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
              <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
              {currentUser && (
                isAdminUser ? <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link> : <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
              )}
              {!currentUser && <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>}
              {currentUser && <button onClick={handleLogout} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 700, textTransform: 'uppercase' }}>Logout</button>}
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
    <footer style={{ background: 'var(--accent)', color: 'var(--secondary)', padding: 'clamp(3rem, 8vw, 6rem) 0 3rem', borderRadius: '40px 40px 0 0' }}>
       <div className="container responsive-footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
             {siteConfig.logo && <img src={siteConfig.logo} style={{ height: '36px' }} alt="" />}
             <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontFamily: 'Playfair Display' }}>{siteConfig.name}</h3>
          </div>
          <p style={{ opacity: 0.7, maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.8' }}>{siteConfig.motto}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ background: 'white', padding: '0.7rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex' }}><Instagram size={16} /></div>
            <div style={{ background: 'white', padding: '0.7rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex' }}><Facebook size={16} /></div>
            <div style={{ background: 'white', padding: '0.7rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex' }}><Phone size={16} /></div>
          </div>
        </div>
        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem' }}>The Collection</h4>
           <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.8, fontSize: '0.9rem' }}>
              <li><Link to="/">Home Gallery</Link></li>
              <li><Link to="/products">Shop All</Link></li>
              <li><Link to="/catalog">Atelier Stories</Link></li>
              <li><Link to="/tracking">Track Magic</Link></li>
              <li><Link to="/contact">Help Corner</Link></li>
           </ul>
        </div>
        <div>
           <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem' }}>Newsletter</h4>
           <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Get magical updates ✨</p>
           <div style={{ display: 'flex', background: 'white', padding: '0.4rem', borderRadius: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
             <input type="email" placeholder="Email Address" style={{ background: 'none', border: 'none', paddingLeft: '1rem', flex: 1, outline: 'none', fontSize: '0.85rem', minWidth: 0 }} />
             <button style={{ background: 'var(--primary)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', flexShrink: 0 }}><ArrowRight size={16} /></button>
           </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.4, fontSize: '0.75rem', fontWeight: 700 }}>
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
            zIndex: 5000, background: 'white', padding: '0.6rem 1.2rem', 
            borderRadius: '20px', boxShadow: '0 12px 32px rgba(233,163,163,0.25)',
            display: 'flex', alignItems: 'center', gap: '0.7rem', border: '1px solid #fff0f0',
            maxWidth: 'calc(100vw - 3rem)', width: 'max-content'
          }}
        >
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <Toast />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>
        <Suspense fallback={<PookieLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:categoryId" element={<ProductList />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<UserOrdersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
