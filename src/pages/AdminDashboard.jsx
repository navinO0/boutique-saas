import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, ShoppingBag, TrendingUp, Users, Package, MapPin, 
  Settings, LogOut, ChevronRight, Edit2, Trash2, CheckCircle, 
  X, AlertCircle, Layout, PieChart, CreditCard, ExternalLink, HelpCircle,
  Mail, Phone, Image as ImageIcon, Globe, Cloud, Coffee, Filter, BarChart3, MessageSquare, Eye, EyeOff, Save, Upload, ArrowUpRight
} from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal';
import { useShop } from '../context/ShopContext';
import EditProductModal from '../components/EditProductModal';
import EditCatalogModal from '../components/EditCatalogModal';
import { resolveImageUrl } from '../utils/imageUtils';
import EmptyState from '../components/EmptyState';
import PookieLoader from '../components/PookieLoader';
import { uploadImage } from '../utils/cloudinary';

const AttentionRequiredView = ({ onEditProduct }) => {
  const { products, fetchInquiries, updateInquiryStatus, allOrders, getHeaders, fetchProducts, fetchAllOrders } = useShop();
  const [inquiries, setInquiries] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeInquiryId, setActiveInquiryId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Parallel fetch for dashboard stats
        await Promise.all([
          fetchInquiries().then(data => setInquiries(data)),
          fetchProducts({ limit: 1000 }),
          fetchAllOrders(),
          axios.get(`${API_BASE_URL}/products`, {
            params: { stockStatus: 'outOfStock', limit: 100 },
            headers: getHeaders ? getHeaders() : {}
          }).then(resp => setOutOfStock(resp.data.products || []))
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchInquiries, getHeaders, fetchProducts, fetchAllOrders]);

  const newInquiries = (inquiries || []).filter(i => i?.status === 'new');
  const readInquiries = (inquiries || []).filter(i => i?.status !== 'new');

  if (loading) return <PookieLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Quick Stats Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(0.8rem, 2vw, 1.5rem)', marginBottom: '3rem' }}>
        <StatCard title="Total Pieces" value={products?.length || '0'} icon={ShoppingBag} />
        <StatCard title="Confirmed Revenue" value={`₹${(allOrders || []).filter(o => o?.status === 'confirmed').reduce((s,o) => s + parseFloat(o?.total || 0), 0).toLocaleString()}`} icon={BarChart3} />
        <StatCard title="Pending Inquiries" value={newInquiries.length} icon={Mail} />
        <StatCard title="Out of Stock" value={outOfStock.length} icon={AlertCircle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
        {/* Contact Form Submissions */}
        <div style={{ background: 'white', padding: 'clamp(1.2rem, 4vw, 2rem)', borderRadius: '35px', boxShadow: '0 20px 40px rgba(233,163,163,0.08)', border: '1px solid #fff0f0' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'Roboto', fontSize: '1.5rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Mail size={22} color="var(--primary)" /> Customer Inquiries
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }} className="amara-scroll">
            {inquiries.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: '#999', fontStyle: 'italic' }}>No magic requests yet... ✨</p>
            ) : (
              inquiries.map((inv) => (
                <div key={inv.id} style={{ background: '#fefafa', padding: '1.5rem', borderRadius: '25px', border: '1px solid #fff0f0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, color: 'var(--secondary)' }}>{inv.name}</h4>
                      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {inv.email}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {inv.phone}</p>
                      </div>
                    </div>
                    {inv.status === 'new' && <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.6rem', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 700 }}>NEW</span>}
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '0.4rem' }}>{inv.subject}</p>
                  <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: 1.5, marginBottom: '1rem' }}>{inv.message}</p>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <a href={`mailto:${inv.email}`} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #eee', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={12} /> Reply Email
                    </a>
                    <a 
                      href={`https://wa.me/${inv.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inv.name}! This is Priyanka from Amara Boutique regarding your inquiry about "${inv.subject}".`)}`}
                      target="_blank" 
                      rel="noreferrer"
                      style={{ padding: '0.5rem 1rem', background: '#25D366', border: 'none', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <MessageSquare size={12} color="white" /> WhatsApp
                    </a>
                    {inv.status === 'new' && (
                      <button 
                        disabled={activeInquiryId === inv.id}
                        onClick={async () => {
                          setActiveInquiryId(inv.id);
                          await updateInquiryStatus(inv.id, 'read');
                          const updated = await fetchInquiries();
                          setInquiries(updated);
                          setActiveInquiryId(null);
                        }}
                        style={{ padding: '0.5rem 1rem', background: 'var(--secondary)', border: 'none', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, color: 'white', cursor: activeInquiryId === inv.id ? 'not-allowed' : 'pointer', opacity: activeInquiryId === inv.id ? 0.7 : 1 }}
                      >
                        {activeInquiryId === inv.id ? 'Processing...' : 'Mark as Read'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Out of Stock Items */}
        <div style={{ background: 'white', padding: 'clamp(1.2rem, 4vw, 2rem)', borderRadius: '35px', boxShadow: '0 20px 40px rgba(233,163,163,0.08)', border: '1px solid #fff0f0' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'Roboto', fontSize: '1.5rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <AlertCircle size={22} color="var(--primary)" /> Restock Required
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {outOfStock.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f0fdf4', borderRadius: '25px' }}>
                <CheckCircle size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: 800, color: '#10b981' }}>Inventory looks magical!</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>All items are currently in stock.</p>
              </div>
            ) : (
              outOfStock.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: '#fff9f9', padding: '1rem', borderRadius: '25px', flexWrap: 'wrap' }}>
                  <img src={resolveImageUrl(item.images?.[0] || item.image)} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '15px' }} alt="" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--secondary)' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#ff7676', fontWeight: 800 }}>SOLD OUT</p>
                  </div>
                  <button 
                    onClick={() => onEditProduct(item)}
                    style={{ padding: '0.6rem 1rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}
                  >
                    Edit Stock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '28px', boxShadow: '0 10px 20px rgba(233,163,163,0.08)', border: '1px solid #fff0f0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div style={{ background: '#fff0f0', padding: '0.6rem', borderRadius: '15px' }}>
        <Icon size={18} color="var(--primary)" />
      </div>
      {trend && (
        <span style={{ color: trend.startsWith('-') ? '#e9a3a3' : '#10b981', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '0.7rem' }}>
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
    <p style={{ color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.3rem' }}>{value}</h3>
  </div>
);



const AdminFilterModal = ({ isOpen, onClose, filters, setFilters, siteConfig, onApply, onReset }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(74, 55, 55, 0.35)', backdropFilter: 'blur(10px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative',
              background: 'white', borderRadius: '45px', padding: '3rem',
              width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto',
              boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
              zIndex: 6001
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Refine Magic</h3>
              <button onClick={onClose} style={{ background: '#fff9f9', color: 'var(--primary)', padding: '0.8rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* Category */}
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', display: 'block', marginBottom: '1.2rem' }}>Collections</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <button 
                    onClick={() => setFilters({ ...filters, category: 'all' })}
                    style={{ padding: '0.8rem 1.4rem', borderRadius: '18px', background: filters.category === 'all' ? 'var(--primary)' : '#fefafa', color: filters.category === 'all' ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >All</button>
                  {siteConfig.categories.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setFilters({ ...filters, category: c.id })}
                      style={{ padding: '0.8rem 1.4rem', borderRadius: '18px', background: filters.category === c.id ? 'var(--primary)' : '#fefafa', color: filters.category === c.id ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                    >{c.name}</button>
                  ))}
                </div>
              </div>

              {/* Visibility Status */}
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', display: 'block', marginBottom: '1.2rem' }}>Visibility State</label>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {[
                    { id: 'all', label: 'Everything' },
                    { id: 'true', label: 'Active Only' },
                    { id: 'false', label: 'Hidden Only' }
                  ].map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setFilters({ ...filters, isActive: s.id })}
                      style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '18px', background: filters.isActive === s.id ? 'var(--secondary)' : '#fefafa', color: filters.isActive === s.id ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >{s.label}</button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', display: 'block', marginBottom: '1.2rem' }}>Sort Manifest</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    style={{ width: '100%', padding: '1.2rem', background: '#fefafa', borderRadius: '20px', border: '1px solid #fff0f0', fontWeight: 800, color: 'var(--secondary)', outline: 'none', appearance: 'none', fontSize: '1rem', cursor: 'pointer' }}
                  >
                    <option value="newest">Recent Designs</option>
                    <option value="popularity">Fan Favorites</option>
                    <option value="price-low">Price: Light to Heavy</option>
                    <option value="price-high">Price: Heavy to Light</option>
                  </select>
                  <ChevronRight size={16} style={{ position: 'absolute', right: '1.4rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: 'var(--primary)' }} />
                </div>
              </div>

              {/* Price Cap */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Price Limit</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: '1rem' }}>₹</span>
                    <input 
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      style={{ width: '100px', padding: '0.6rem', borderRadius: '12px', border: '1px solid #eee', fontWeight: 800, fontSize: '1rem', textAlign: 'right', outline: 'none' }}
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  step="1000" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  style={{ width: '100%', height: '8px', appearance: 'none', background: '#fefafa', borderRadius: '10px', outline: 'none', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onApply}
                  style={{ flex: 2, padding: '1.4rem', background: 'var(--primary)', color: 'white', borderRadius: '25px', fontWeight: 700, border: 'none', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 15px 35px rgba(233,163,163,0.3)' }}
                >
                  Apply Magic
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onReset}
                  style={{ flex: 1, padding: '1.4rem', background: '#fefafa', color: 'var(--secondary)', borderRadius: '25px', fontWeight: 800, border: '1px solid #fff0f0', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProductManager = ({ onEditProduct }) => {
  const { adminProducts, adminPagination, addProduct, updateProduct, deleteProduct, fetchAdminProducts, siteConfig, isLoading } = useShop();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  
  // Independent Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    isActive: 'all',
    sortBy: 'newest',
    maxPrice: '100000',
    page: 1
  });

  const [searchInput, setSearchInput] = useState('');

  const fetchWithFilters = (overrides = {}) => {
    const f = { ...filters, ...overrides };
    fetchAdminProducts({
      search: f.search,
      category: f.category !== 'all' ? f.category : undefined,
      isActive: f.isActive,
      sortBy: f.sortBy,
      maxPrice: f.maxPrice !== '100000' ? f.maxPrice : undefined,
      page: f.page
    });
  };

  useEffect(() => {
    fetchWithFilters();
  }, []);

  const handleApplyFilters = () => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    fetchWithFilters({ search: searchInput, page: 1 });
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    const defaultFilters = { search: '', category: 'all', isActive: 'all', sortBy: 'newest', maxPrice: '100000', page: 1 };
    setFilters(defaultFilters);
    setSearchInput('');
    fetchAdminProducts({ page: 1 });
    setIsFilterModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    fetchWithFilters({ page: newPage });
  };

  const handleToggleActive = (p) => {
    updateProduct({ ...p, isActive: !p.isActive });
  };

  const handleEdit = (p) => {
    onEditProduct(p);
  };

  const handleAddNew = () => {
    onEditProduct(null);
  };

  if (isLoading && adminProducts.length === 0) return <PookieLoader />;

  return (
    <div style={{ background: 'white', padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Inventory Master  </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Manage your beautiful designs and stock levels</p>
        </div>
        <button onClick={handleAddNew} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer' }}>
          <Plus size={20} /> Add New Design
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.8rem', 
        alignItems: 'center', 
        marginBottom: '3rem',
        padding: '0.5rem',
        background: 'white',
        borderRadius: '40px',
        boxShadow: '0 15px 35px rgba(233,163,163,0.1)',
        border: '1px solid #fff5f5'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Search manifest..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            style={{
              width: '100%',
              padding: '0.9rem 1rem 0.9rem 3.2rem',
              border: 'none',
              background: '#fefafa',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.9rem',
              outline: 'none',
              color: 'var(--secondary)'
            }}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFilterModalOpen(true)}
          style={{
            padding: '0.9rem 1.6rem',
            background: 'var(--secondary)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <Filter size={16} /> Filters
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: adminProducts.length === 0 ? '1fr' : 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1rem, 3vw, 2rem)' }}>
        {adminProducts.length === 0 ? (
          <EmptyState 
            message="No designs found in the atelier!" 
            subtext="Your inventory manifest is currently showing no results for these filters. Try searching for something else or clearing your filters." 
          />
        ) : (
          adminProducts.map(p => (
            <motion.div 
              key={p.id} 
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(233,163,163,0.1)' }}
              style={{ 
                background: '#fffcfc', 
                borderRadius: '30px', 
                border: '1px solid #fff0f0', 
                overflow: 'hidden', 
                transition: 'all 0.3s ease',
                opacity: p.isActive ? 1 : 0.65,
                position: 'relative'
              }}
            >
              {!p.isActive && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#444', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.65rem', fontWeight: 700, zIndex: 10, letterSpacing: '1px' }}>
                  HIDDEN
                </div>
              )}
              <div style={{ height: '200px', overflow: 'hidden', background: '#fefafa' }}>
                <img 
                  src={resolveImageUrl(p.image || (p.images && p.images[0]))} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  alt="" 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594434292289-5def5ee02447?w=400'; }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{p.category}</p>
                  <div style={{ background: p.stock > 10 ? '#f0fdf4' : '#fef2f2', padding: '0.3rem 0.6rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800, color: p.stock > 10 ? '#10b981' : '#ef4444' }}>
                    Stock: {p.stock}
                  </div>
                </div>
                <h4 style={{ fontWeight: 800, margin: '0.5rem 0', fontSize: '1rem', color: 'var(--secondary)', minHeight: '2.5rem' }}>{p.name}</h4>
                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{parseFloat(p.discountedPrice).toLocaleString()}</p>
                
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                  <button onClick={() => handleToggleActive(p)} style={{ padding: '0.8rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '15px', color: p.isActive ? 'var(--primary)' : '#999', cursor: 'pointer' }}>
                    {p.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: '0.8rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '15px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Edit Details</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: '0.8rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '15px', color: '#ffb3b3', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Admin Pagination Controls */}
      {adminPagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
          <button 
            disabled={adminPagination.currentPage === 1}
            onClick={() => handlePageChange(adminPagination.currentPage - 1)}
            style={{ padding: '0.8rem 1.4rem', borderRadius: '20px', border: '1px solid #fef0f0', background: 'white', color: 'var(--primary)', fontWeight: 800, opacity: adminPagination.currentPage === 1 ? 0.5 : 1, cursor: 'pointer' }}
          >Previous</button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[...Array(adminPagination.totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  border: 'none', 
                  background: adminPagination.currentPage === i + 1 ? 'var(--primary)' : '#fefafa', 
                  color: adminPagination.currentPage === i + 1 ? 'white' : 'var(--primary)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >{i + 1}</button>
            ))}
          </div>

          <button 
            disabled={adminPagination.currentPage === adminPagination.totalPages}
            onClick={() => handlePageChange(adminPagination.currentPage + 1)}
            style={{ padding: '0.8rem 1.4rem', borderRadius: '20px', border: '1px solid #fef0f0', background: 'white', color: 'var(--primary)', fontWeight: 800, opacity: adminPagination.currentPage === adminPagination.totalPages ? 0.5 : 1, cursor: 'pointer' }}
          >Next</button>
        </div>
      )}

      {/* Modals */}
      <AdminFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        siteConfig={siteConfig}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};

const OrdersManager = () => {
  const { allOrders, fetchAllOrders, approveOrder, isLoading } = useShop();
  const [subTab, setSubTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const filteredOrders = allOrders.filter(order => {
    const matchesTab = subTab === 'pending' ? order.status === 'pending' : order.status === 'confirmed';
    if (!matchesTab) return false;
    
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const orderId = String(order.id).toLowerCase();
    const customerName = (order.User?.name || '').toLowerCase();
    
    return orderId.includes(searchLower) || customerName.includes(searchLower);
  });

  const pendingCount = allOrders.filter(o => o.status === 'pending').length;

  if (isLoading) return <PookieLoader />;

  return (
    <div style={{ background: 'white', padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>Order Master <CreditCard size={22} color="var(--primary)" /></h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Manifest verification and shipping confirmation</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-end', flex: 1, minWidth: '320px' }}>
          <div style={{ display: 'flex', background: '#fff9f9', padding: '0.4rem', borderRadius: '25px', gap: '0.4rem', width: 'fit-content' }}>
            <button 
              onClick={() => setSubTab('pending')}
              style={{ 
                padding: '0.8rem 1.4rem', 
                borderRadius: '20px', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: subTab === 'pending' ? 'var(--primary)' : 'transparent',
                color: subTab === 'pending' ? 'white' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.3s'
              }}
            >
              <AlertCircle size={16} /> Pending {pendingCount > 0 && <span style={{ background: 'white', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>{pendingCount}</span>}
            </button>
            <button 
              onClick={() => setSubTab('confirmed')}
              style={{ 
                padding: '0.8rem 1.4rem', 
                borderRadius: '20px', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: subTab === 'confirmed' ? 'var(--secondary)' : 'transparent',
                color: subTab === 'confirmed' ? 'white' : 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.3s'
              }}
            >
              <CheckCircle size={16} /> Confirmed
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
            <input
              type="text"
              placeholder="Search by ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 3.2rem',
                background: '#fefafa',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '0.9rem',
                outline: 'none',
                color: 'var(--secondary)',
                border: '1px solid #fff0f0'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={subTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
          >
            {filteredOrders.map(order => (
              <motion.div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                whileHover={{ scale: 1.005, background: '#fff9f9', borderColor: 'var(--primary)' }}
                style={{ 
                  border: '1px solid #fff0f0', borderRadius: '25px', padding: '1.2rem 1.5rem', 
                  background: '#fffcfc', cursor: 'pointer', transition: '0.3s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order #{String(order.id).padStart(5, '0')}</span>
                    <h4 style={{ fontWeight: 800, color: 'var(--secondary)', marginTop: '0.2rem', fontSize: '0.95rem' }}>{order.User?.name}</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>Value</span>
                    <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem' }}>₹{parseFloat(order.total).toLocaleString()}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</span>
                    <p style={{ fontWeight: 800, color: '#666', fontSize: '0.85rem' }}>{order.OrderItems?.length} Pieces</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>Manifested At</span>
                    <p style={{ fontWeight: 800, color: '#666', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                    background: order.status === 'confirmed' ? '#f0fdf4' : '#fff7ed', 
                    color: order.status === 'confirmed' ? '#10b981' : '#f97316' 
                  }}>
                    {order.status}
                  </span>
                  <ChevronRight size={20} color="#ddd" />
                </div>
              </motion.div>
            ))}
            {filteredOrders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#ccc' }}>
                <CheckCircle size={60} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                <h3 style={{ fontFamily: 'Roboto', fontSize: '1.5rem', color: '#ddd' }}>Quiet in the Atelier</h3>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>All manifests in this section have been addressed.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <OrderDetailModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
        isAdmin={true}
        isProcessing={processingOrderId === selectedOrder?.id}
        onApprove={async (id) => {
          setProcessingOrderId(id);
          await approveOrder(id);
          setProcessingOrderId(null);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

const CatalogManager = () => {
  const { catalog, addCatalogItem, updateCatalogItem, deleteCatalogItem, fetchCatalog, isLoading } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <PookieLoader />;

  return (
    <div style={{ background: 'white', padding: 'clamp(1.2rem, 5vw, 2.5rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>Atelier Portfolio <Package size={22} color="var(--primary)" /></h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Showcase your masterpieces in the gallery</p>
        </div>
        <button onClick={handleAddNew} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer' }}>
          <Plus size={20} /> New Portfolio Piece
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {catalog?.map(item => (
          <div key={item.id} style={{ background: '#fffcfc', borderRadius: '30px', border: '1px solid #fff0f0', overflow: 'hidden' }}>
            <img src={item.images?.[0]} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt="" />
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{item.category}</p>
              <h4 style={{ fontWeight: 800, margin: '0.3rem 0', color: 'var(--secondary)' }}>{item.name}</h4>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '0.8rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '15px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>Edit Details</button>
                <button onClick={() => deleteCatalogItem(item.id)} style={{ padding: '0.8rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '15px', color: '#ffb3b3' }}><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditCatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        onSave={(data) => editingItem ? updateCatalogItem(data) : addCatalogItem(data)}
      />
    </div>
  );
};

const CollectionsManager = () => {
  const { siteConfig, updateSiteConfig } = useShop();
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState(siteConfig.categories || []);

  const handleUpdate = (id, field, value) => {
    const updated = categories.map(c => c.id === id ? { ...c, [field]: value } : c);
    setCategories(updated);
  };

  const handleAdd = () => {
    const newId = `cat-${Date.now()}`;
    const newCat = { id: newId, name: 'New Passion', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800' };
    setCategories([...categories, newCat]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this collection from your boutique? 🪄")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await updateSiteConfig({ categories });
    setIsSaving(false);
  };

  return (
    <div style={{ background: 'white', padding: 'clamp(1.2rem, 5vw, 2.5rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>Global Collections <Globe size={22} color="var(--primary)" /></h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Categorize your magic (Clothing, Beauty, Essentials...)</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleAdd} style={{ padding: '1rem 2rem', background: '#fff0f0', color: 'var(--primary)', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Plus size={20} /> Add New Space
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSaveAll} 
            style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: isSaving ? 0.7 : 1 }}
          >
            <Save size={20} /> {isSaving ? 'Syncing...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ background: '#fff9f9', padding: '2rem', borderRadius: '35px', display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <img src={cat.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '25px' }} alt="" />
              <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'white', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 5px 10px rgba(0,0,0,0.05)' }}>
                <ImageIcon size={16} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Collection Name</label>
              <input
                type="text"
                value={cat.name}
                onChange={(e) => handleUpdate(cat.id, 'name', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontWeight: 800, color: 'var(--secondary)' }}
              />
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: '1rem' }}>Cover Image URL</label>
              <input
                type="text"
                value={cat.image}
                onChange={(e) => handleUpdate(cat.id, 'image', e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.75rem' }}
              />
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#e9a3a3', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BannerManager = () => {
  const { siteConfig, updateSiteConfig } = useShop();
  const [isSaving, setIsSaving] = useState(false);
  const [banners, setBanners] = useState(siteConfig.banners || []);

  const handleUpdate = (idx, field, value) => {
    const updated = [...banners];
    updated[idx] = { ...updated[idx], [field]: value };
    setBanners(updated);
  };

  const handleAdd = () => {
    const newBanner = { 
      desktopImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600', 
      tabletImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000',
      mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
      title: 'New Season Bloom', 
      subtitle: 'Limited Edition', 
      buttonText: 'Shop Now', 
      link: '/products' 
    };
    setBanners([...banners, newBanner]);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Remove this magical banner? 🪄")) {
      setBanners(banners.filter((_, i) => i !== idx));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await updateSiteConfig({ banners });
    setIsSaving(false);
  };

  return (
    <div style={{ background: 'white', padding: 'clamp(1.2rem, 5vw, 2.5rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>Storytelling Banners <ImageIcon size={22} color="var(--primary)" /></h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>High-impact responsive promotions for your landing page</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleAdd} style={{ padding: '1rem 2rem', background: '#fff0f0', color: 'var(--primary)', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Plus size={20} /> New Slide
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSaveAll} 
            style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: isSaving ? 0.7 : 1 }}
          >
            <Save size={20} /> {isSaving ? 'Syncing...' : 'Save Banners'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {banners.map((banner, idx) => (
          <div key={idx} style={{ background: '#fefafa', padding: '2rem', borderRadius: '35px', border: '1px solid #fff0f0', position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ position: 'relative', height: '240px', borderRadius: '25px', overflow: 'hidden', border: '1px solid #fff0f0' }}>
                  <img src={banner.desktopImage || banner.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '0.5rem', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.6rem', fontWeight: 800 }}>DESKTOP PREVIEW</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Headline</label>
                    <input type="text" value={banner.title} onChange={(e) => handleUpdate(idx, 'title', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontWeight: 800, color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Sub-headline</label>
                    <input type="text" value={banner.subtitle} onChange={(e) => handleUpdate(idx, 'subtitle', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.85rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Redirect Link (URL or /path)</label>
                  <input type="text" value={banner.link} onChange={(e) => handleUpdate(idx, 'link', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.85rem', color: '#666' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Desktop Image URL (Large Screens)</label>
                  <input type="text" value={banner.desktopImage || banner.image} onChange={(e) => handleUpdate(idx, 'desktopImage', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.75rem', color: '#666' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Tablet Image URL (Medium Screens)</label>
                  <input type="text" value={banner.tabletImage || banner.image} onChange={(e) => handleUpdate(idx, 'tabletImage', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.75rem', color: '#666' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Mobile Image URL (Small Screens)</label>
                  <input type="text" value={banner.mobileImage || banner.image} onChange={(e) => handleUpdate(idx, 'mobileImage', e.target.value)} style={{ width: '100%', padding: '0.8rem 1.2rem', border: 'none', background: 'white', borderRadius: '15px', outline: 'none', fontSize: '0.75rem', color: '#666' }} />
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(idx)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', color: '#e9a3a3', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfigForm = ({ siteConfig, onUpdate }) => {
  const [formData, setFormData] = useState(siteConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingQR, setIsUploadingQR] = useState(false);

  useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdate(formData);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        {/* Contact Details Section */}
        <div style={{ background: '#fff9f9', padding: '2.5rem', borderRadius: '35px' }}>
          <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontFamily: 'Roboto', fontSize: '1.4rem' }}>
            <Phone size={18} color="var(--primary)" /> Contact Details
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>Store Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: 'none', background: 'white', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>Customer Support Phone</label>
              <input type="text" value={formData.contact?.phone || ''} onChange={e => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: 'none', background: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>Official Email</label>
              <input type="email" value={formData.contact?.email || ''} onChange={e => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: 'none', background: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>Store Address</label>
              <textarea value={formData.contact?.address || ''} onChange={e => setFormData({...formData, contact: {...formData.contact, address: e.target.value}})} style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: 'none', background: 'white', resize: 'none' }} rows={3} />
            </div>
          </div>
        </div>

        <div style={{ background: '#fefafa', padding: '2.5rem', borderRadius: '35px' }}>
          <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontFamily: 'Roboto', fontSize: '1.4rem' }}><CreditCard size={18} color="var(--primary)" /> Payments (UPI)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>UPI ID</label>
              <input type="text" value={formData.upiId || ''} onChange={e => setFormData({...formData, upiId: e.target.value})} placeholder="yourname@upi" style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: 'none', background: 'white', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>UPI QR Code Manifest</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
                <div style={{ width: '100px', height: '100px', background: '#fefafa', borderRadius: '15px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {formData.upiQR ? (
                    <img src={formData.upiQR} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="UPI QR" />
                  ) : (
                    <CreditCard size={30} color="#eee" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'inline-flex', 
                    padding: '0.8rem 1.4rem', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    borderRadius: '15px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    cursor: 'pointer',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    {isUploadingQR ? <PookieLoader mini={true} /> : <Upload size={14} />} {isUploadingQR ? 'Uploading...' : (formData.upiQR ? 'Change QR Image' : 'Upload QR Image')}
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      disabled={isUploadingQR}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIsUploadingQR(true);
                          try {
                            const url = await uploadImage(file);
                            setFormData({ ...formData, upiQR: url });
                          } catch (error) {
                            alert(error.message);
                          } finally {
                            setIsUploadingQR(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        style={{ alignSelf: 'center', padding: '1.2rem 4rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 15px 35px rgba(233,163,163,0.3)', opacity: isSaving ? 0.8 : 1 }}
      >
        <Save size={20} /> {isSaving ? 'Deploying...' : 'Deploy Dream Changes'}
      </button>
    </form>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const navigate = useNavigate();
  const { 
    logoutUser, products, appointments, siteConfig, updateSiteConfig, 
    isAdminLoggedIn, allOrders, fetchAllOrders, addProduct, updateProduct 
  } = useShop();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    // Logic moved to sub-components
  }, []);

  if (!isAdminLoggedIn) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'Roboto', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Access Restricted</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Only the head of the atelier can view this magical space.</p>
          <button onClick={() => navigate('/')} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', border: 'none', fontWeight: 700 }}>Back to Storefront</button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Atelier Control Center</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 600 }}>Manifest your boutique's vision and manage every thread.</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '1rem 2rem', background: 'white', border: '1px solid #fff0f0', color: 'var(--primary)', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <LogOut size={20} /> Atelier Exit
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '1rem', justifyContent: 'flex-start' }} className="amara-scroll">
        {[
          { id: 'inventory', label: 'Attention Required', icon: AlertCircle },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'orders', label: 'Orders', icon: CreditCard },
          { id: 'catalog', label: 'Catalog', icon: Package },
          { id: 'banners', label: 'Banners', icon: ImageIcon },
          { id: 'collections', label: 'Collections', icon: Globe },
          { id: 'settings', label: 'Customize', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.8rem',
              borderRadius: '30px',
              background: activeTab === tab.id ? 'var(--primary-light, #e9a3a3)' : 'white',
              color: activeTab === tab.id ? 'white' : 'var(--secondary)',
              border: 'none',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 10px 25px rgba(233,163,163,0.3)' : '0 10px 20px rgba(233,163,163,0.05)',
              transition: 'all 0.3s'
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inventory' && (
          <AttentionRequiredView onEditProduct={handleEditProduct} />
        )}

        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ProductManager onEditProduct={handleEditProduct} />
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <OrdersManager />
          </motion.div>
        )}

        {activeTab === 'catalog' && (
          <motion.div key="catalog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CatalogManager />
          </motion.div>
        )}

        {activeTab === 'banners' && (
          <motion.div key="banners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <BannerManager />
          </motion.div>
        )}

        {activeTab === 'collections' && (
          <motion.div key="collections" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CollectionsManager />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ background: 'white', padding: 'clamp(1rem, 5vw, 4rem)', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
              <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2.2rem', fontFamily: 'Roboto', color: 'var(--secondary)', marginBottom: '0.8rem' }}>Manifest Your Boutique</h3>
                <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>Update your dreamy branding and contact details in real-time. Changes will be reflected across your magical storefront.</p>
              </div>
              <ConfigForm siteConfig={siteConfig} onUpdate={updateSiteConfig} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onSave={(data) => editingProduct ? updateProduct(data) : addProduct(data)}
      />
    </div>
  );
};

export default AdminDashboard;
