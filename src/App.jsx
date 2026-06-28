import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Instagram, Facebook, Phone, ShoppingCart, Heart, LogOut, ArrowRight, Sparkles, Cloud, Heart as HeartIcon, Info, MessageCircle, Search } from 'lucide-react';
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
const AccountPage = lazy(() => import('./pages/AccountPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));

const Navbar = ({ onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cart, currentUser, logoutUser, siteConfig, isAdminLoggedIn, products } = useShop();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const isAdminUser = isAdminLoggedIn;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Transparent when at top, solid white when scrolled, or when mobile menu is open
  const getNavBackground = () => {
    // Mobile menu is open → always fully opaque so dropdown is readable
    if (isOpen && !isDesktop) return 'rgba(255, 255, 255, 1)';
    // Scrolled down → solid/glassy white
    if (isScrolled) return 'rgba(255, 255, 255, 0.95)';
    // At top → transparent
    return 'rgba(255, 255, 255, 0.08)';
  };

  return (
    <>
      <nav
      className="main-navbar"
      style={{
        position: 'fixed',
        left: 0, right: 0, margin: '0 auto',
        width: '95%', maxWidth: '1400px', zIndex: 2500,
        padding: isScrolled ? '0.6rem 1.5rem' : '1rem 2rem',
        transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
        background: getNavBackground(),
        backdropFilter: isScrolled ? 'blur(28px)' : 'blur(8px)',
        borderRadius: isOpen && !isDesktop ? '20px' : '32px',
        boxShadow: (isScrolled || isOpen) ? '0 15px 45px rgba(233,163,163,0.12)' : 'none',
        border: isScrolled ? '1px solid rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.15)',
      }}
    >
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
        <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          {/* Global Search Trigger */}
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            style={{ 
              cursor: 'pointer', 
              padding: '0.65rem', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              transition: '0.4s',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Search size={18} />
          </motion.div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Collections</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/contact">Contact</Link>
            {currentUser && (
              isAdminUser ? <Link to="/admin">Admin</Link> : <Link to="/account">Account</Link>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--secondary)' }}>
            <div style={{ position: 'relative', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(5px)' }} onClick={onOpenCart}>
              <ShoppingCart size={18} color="var(--primary)" />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cart.length}
                </span>
              )}
            </div>
            {currentUser ? (
               <button onClick={handleLogout} style={{ background: 'none', color: 'var(--primary)', padding: '0.55rem', borderRadius: '50%', display: 'flex', border: '1px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer', backdropFilter: 'blur(5px)' }}><LogOut size={16} /></button>
            ) : (
              <Link to="/auth" style={{ 
                color: 'var(--primary)', 
                padding: '0.55rem 1.25rem', 
                borderRadius: '25px', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                textDecoration: 'none',
                backdropFilter: 'blur(5px)',
                border: '1px solid var(--primary)',
                boxShadow: '0 4px 15px rgba(183, 110, 110, 0.05)'
              }}>
                <User size={15} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navbar Items */}
        <div 
          style={{ 
            display: 'flex', 
            width: '100%', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '4px 8px', 
            gap: '0.2rem' 
          }} 
          className="mobile-only"
        >
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', borderRadius: '12px' }}>
            <motion.div whileTap={{ scale: 0.8 }}><ShoppingBag size={18} color="var(--primary)" /></motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>Home</span>
          </Link>

          <Link to="/about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', borderRadius: '12px' }}>
            <motion.div whileTap={{ scale: 0.8 }}><Info size={18} /></motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>About</span>
          </Link>

          {/* Search Trigger */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', cursor: 'pointer', borderRadius: '12px' }}
          >
            <motion.div whileTap={{ scale: 0.8 }}><Search size={18} /></motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>Search</span>
          </div>

          <Link to="/products" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', borderRadius: '12px' }}>
            <motion.div whileTap={{ scale: 0.8 }}><Sparkles size={18} /></motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>Shop</span>
          </Link>
          
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', cursor: 'pointer', borderRadius: '12px' }} onClick={onOpenCart}>
            <motion.div whileTap={{ scale: 0.8 }}>
              <ShoppingCart size={18} color="var(--primary)" />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '0', background: 'var(--primary)', color: 'white', fontSize: '0.4rem', width: '12px', height: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cart.length}
                </span>
              )}
            </motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>Bag</span>
          </div>

          <Link to={currentUser ? (isAdminUser ? "/admin" : "/account") : "/auth"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', color: 'var(--secondary)', padding: '0.4rem 0.5rem', borderRadius: '12px' }}>
            <motion.div whileTap={{ scale: 0.8 }}><User size={18} /></motion.div>
            <span style={{ fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase' }}>Me</span>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              overflow: 'hidden', 
              padding: '1.5rem 0 2rem',
              background: 'rgba(255, 255, 255, 1)',
              borderTop: '1px solid rgba(233, 163, 163, 0.15)',
              marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--secondary)' }}>
              <Link to="/" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Collections</Link>
              <Link to="/catalog" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Catalog</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>About</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Contact</Link>
              {currentUser && (
                isAdminUser ? <Link to="/admin" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Admin</Link> : <Link to="/account" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Account</Link>
              )}
              {!currentUser && <Link to="/auth" onClick={() => setIsOpen(false)} style={{ color: 'var(--secondary)' }}>Login</Link>}
              {currentUser && <button onClick={handleLogout} style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Logout</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Minimalistic Floating Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3500, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 'clamp(0.5rem, 5vw, 8vh)' }}>
            {/* Soft backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)' }}
            />
            
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              style={{ 
                position: 'relative', 
                width: '94%', 
                maxWidth: '650px',
                zIndex: 1
              }}
            >
              <div style={{ 
                background: 'white', 
                padding: '0.8rem 1.5rem', 
                borderRadius: '40px', 
                boxShadow: '0 20px 50px rgba(233,163,163,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid #fff0f0'
              }}>
                <Search size={22} color="var(--primary)" />
                <input
                  autoFocus
                  placeholder="What are you looking for?"
                  style={{ 
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1.1rem',
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    color: 'var(--secondary)',
                    padding: '0.8rem 0'
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: '#fff0f0', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--primary)', opacity: 0.8 }}>
                  Press Enter to reveal magic
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
    <AnimatePresence>
      {isSearchOpen && (
        <div style={{ position: 'fixed', top: 'clamp(0.5rem, 3vh, 3rem)', left: 0, right: 0, zIndex: 9999, display: 'flex', justifyContent: 'center' }}>
          {/* Enhanced Soft Backdrop - High Blur, Low Opacity to prevent "White Box" feel */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(25px)', zIndex: -1 }}
          />
          
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            style={{ 
              position: 'relative', 
              width: '94%', 
              maxWidth: '650px',
              zIndex: 1
            }}
          >
            <div style={{ 
              background: 'white', 
              padding: 'clamp(0.6rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)', 
              borderRadius: '40px', 
              boxShadow: '0 25px 60px rgba(233,163,163,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #fff0f0'
            }}>
              <Search size={22} color="var(--primary)" />
              <input
                autoFocus
                placeholder="Find excellence..."
                style={{ 
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                  padding: '0.6rem 0'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(false)}
                style={{ background: '#fff0f0', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
               <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--primary)', textShadow: '0 2px 5px rgba(255,255,255,1)' }}>
                  PRESS ENTER TO SEARCH
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
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
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'calc(0.4rem + 1vw)', opacity: 0.8, fontSize: '0.9rem' }}>
            <li><Link to="/">Home Gallery</Link></li>
            <li><Link to="/products">Shop All</Link></li>
            <li><Link to="/catalog">Atelier Stories</Link></li>
            <li><Link to="/tracking">Track Magic</Link></li>
            <li><Link to="/contact">Help Corner</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem' }}>Newsletter</h4>
          <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Get magical updates <Sparkles size={14} color="var(--primary)" /></p>
          <div style={{ display: 'flex', background: 'white', padding: '0.4rem', borderRadius: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <input type="email" placeholder="Email Address" style={{ background: 'none', border: 'none', paddingLeft: '1rem', flex: 1, outline: 'none', fontSize: '0.85rem', minWidth: 0 }} />
            <button style={{ background: 'var(--primary)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', flexShrink: 0 }}><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.4, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        MADE WITH LOVE BY {siteConfig.name.toUpperCase()} <Cloud size={14} />
      </div>
    </footer>
  );
};

const Toast = () => {
  const { toast } = useShop();
  return (
    <AnimatePresence>
      {toast && (
        <div style={{ 
          position: 'fixed', top: '2rem', left: 0, right: 0, 
          zIndex: 9999, display: 'flex', justifyContent: 'center', 
          padding: '0 1.5rem', pointerEvents: 'none' 
        }}>
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            style={{
              background: 'white', padding: '0.8rem 1.5rem',
              borderRadius: '25px', boxShadow: '0 15px 40px rgba(233,163,163,0.3)',
              display: 'flex', alignItems: 'center', gap: '0.8rem', 
              border: '1.5px solid #fff0f0', maxWidth: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
              <Sparkles size={14} color="white" />
            </div>
            <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.85rem', lineHeight: 1.4, wordBreak: 'break-word' }}>
              {toast}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <AppContent isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </Router>
  );
}

function AppContent({ isCartOpen, setIsCartOpen }) {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <Toast />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main style={{ minHeight: '80vh', paddingTop: location.pathname === '/' ? '0px' : '80px' }}>
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
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/order/:orderId" element={<OrderDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
