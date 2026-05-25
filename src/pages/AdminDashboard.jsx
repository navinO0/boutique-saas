import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShoppingBag, BarChart3, ArrowUpRight, TrendingUp, 
  Calendar, Clock, LogOut, Settings, Save, Phone, Mail, MapPin, Heart, 
  Sparkles, CheckCircle, Package, Plus, Trash2, Edit2, Search, Image as ImageIcon 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import EditProductModal from '../components/EditProductModal';
import EditCatalogModal from '../components/EditCatalogModal';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div style={{ background: 'white', padding: '2rem', borderRadius: '35px', boxShadow: '0 15px 30px rgba(233,163,163,0.1)', border: '1px solid #fff0f0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff0f0', padding: '0.8rem', borderRadius: '20px' }}>
            <Icon size={24} color="var(--primary)" />
        </div>
        <span style={{ color: trend.startsWith('-') ? '#e9a3a3' : '#10b981', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
            <ArrowUpRight size={14} /> {trend}
        </span>
    </div>
    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
    <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary)', marginTop: '0.5rem' }}>{value}</h3>
  </div>
);

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (p) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Inventory Master ✨</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Manage your beautiful designs and stock levels</p>
        </div>
        <button onClick={handleAddNew} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Plus size={20} /> Add New Design
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search designs or categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', border: 'none', background: '#fff9f9', borderRadius: '25px', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{ background: '#fffcfc', borderRadius: '30px', border: '1px solid #fff0f0', overflow: 'hidden', transition: 'all 0.3s ease' }}>
            <img src={p.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="" />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{p.category}</p>
                  <h4 style={{ fontWeight: 800, margin: '0.3rem 0', color: 'var(--secondary)' }}>{p.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(p)} style={{ padding: '0.5rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '12px', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: '0.5rem', background: 'white', border: '1px solid #fff0f0', borderRadius: '12px', color: '#e9a3a3' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <p style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{p.discountedPrice.toLocaleString()}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: p.stock === 0 ? '#ffb3b3' : 'var(--text-light)' }}>Stock: {p.stock}</p>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.colors?.map((c, i) => <div key={i} style={{ width: '12px', height: '12px', background: c, borderRadius: '50%', border: '1px solid #ddd' }} />)}
                {p.sizes?.map((s, i) => <span key={i} style={{ fontSize: '0.6rem', fontWeight: 800, background: '#fff0f0', padding: '0.2rem 0.4rem', borderRadius: '5px', color: 'var(--primary)' }}>{s}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct} 
        onSave={(updated) => editingProduct ? updateProduct(updated) : addProduct(updated)}
      />
    </div>
  );
};

const CatalogManager = () => {
  const { catalog, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Atelier Portfolio 🎀</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Showcase your masterpieces in the gallery</p>
        </div>
        <button onClick={handleAddNew} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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

  const handleSaveAll = () => {
    updateSiteConfig({ categories });
  };

  return (
    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '45px', boxShadow: '0 30px 60px rgba(233,163,163,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Global Collections 🌍</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Categorize your magic (Clothing, Beauty, Essentials...)</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAdd} style={{ padding: '1rem 2rem', background: '#fff0f0', color: 'var(--primary)', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Plus size={20} /> Add New Space
          </button>
          <button onClick={handleSaveAll} style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
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

const ConfigForm = ({ siteConfig, onUpdate }) => {
  const [formData, setFormData] = useState(siteConfig);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Boutique Magic Updated! ✨');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#fff9f9', padding: '2.5rem', borderRadius: '35px' }}>
          <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', fontSize: '1.4rem' }}><Sparkles size={18} color="var(--primary)" /> Branding</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Boutique Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: 'white', borderRadius: '20px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Brand Vision</label>
              <textarea value={formData.motto} onChange={(e) => setFormData({...formData, motto: e.target.value})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: 'white', borderRadius: '20px', height: '100px', outline: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ background: '#fff9f9', padding: '2.5rem', borderRadius: '35px' }}>
          <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', fontSize: '1.4rem' }}><Phone size={18} color="var(--primary)" /> Reach Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Magic Line (Phone)</label>
              <input type="text" value={formData.contact.phone} onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: 'white', borderRadius: '20px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Crystal Mail (Email)</label>
              <input type="email" value={formData.contact.email} onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: 'white', borderRadius: '20px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Atelier Location</label>
              <input type="text" value={formData.contact.address} onChange={(e) => setFormData({...formData, contact: {...formData.contact, address: e.target.value}})} style={{ width: '100%', padding: '1.2rem', border: 'none', background: 'white', borderRadius: '20px', outline: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div style={{ background: '#fff9f9', padding: '2.5rem', borderRadius: '35px' }}>
        <h4 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', fontSize: '1.4rem' }}><Sparkles size={18} color="var(--primary)" /> Visual Atmosphere (Themes)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(siteConfig.themes).map(([id, theme]) => (
            <div 
              key={id} 
              onClick={() => setFormData({...formData, currentTheme: id})}
              style={{ 
                padding: '1.5rem', 
                background: 'white', 
                borderRadius: '25px', 
                border: formData.currentTheme === id ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '20px', height: '20px', background: theme.primary, borderRadius: '50%' }} />
                <div style={{ width: '20px', height: '20px', background: theme.secondary, borderRadius: '50%' }} />
                <div style={{ width: '20px', height: '20px', background: theme.background, borderRadius: '50%', border: '1px solid #eee' }} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)' }}>{theme.name}</p>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" style={{ padding: '1.5rem 4rem', background: 'var(--primary)', color: 'white', fontWeight: 700, borderRadius: '30px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', alignSelf: 'center', boxShadow: '0 10px 30px var(--glow)' }}>
        <Save size={20} /> Update My Website ✨
      </button>
    </form>
  );
};

const AdminDashboard = () => {
  const { isAdminLoggedIn, logoutAdmin, appointments, allOrders, products, siteConfig, updateSiteConfig } = useShop();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) navigate('/login');
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  return (
    <div className="container" style={{ padding: '8rem 1rem 4rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '5rem' }}>
        <Heart size={40} fill="var(--primary)" color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Atelier Dashboard</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Control Center ✨</p>
        
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center', background: '#fff9f9', padding: '0.8rem', borderRadius: '40px' }}>
          <button onClick={() => setActiveTab('overview')} style={{ padding: '1rem 2rem', background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', color: activeTab === 'overview' ? 'white' : 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LayoutDashboard size={18} /> Stats
          </button>
          <button onClick={() => setActiveTab('products')} style={{ padding: '1rem 2rem', background: activeTab === 'products' ? 'var(--primary)' : 'transparent', color: activeTab === 'products' ? 'white' : 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={18} /> Products
          </button>
          <button onClick={() => setActiveTab('catalog')} style={{ padding: '1rem 2rem', background: activeTab === 'catalog' ? 'var(--primary)' : 'transparent', color: activeTab === 'catalog' ? 'white' : 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ImageIcon size={18} /> Catalog
          </button>
          <button onClick={() => setActiveTab('collections')} style={{ padding: '1rem 2rem', background: activeTab === 'collections' ? 'var(--primary)' : 'transparent', color: activeTab === 'collections' ? 'white' : 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={18} /> Collections
          </button>
          <button onClick={() => setActiveTab('settings')} style={{ padding: '1rem 2rem', background: activeTab === 'settings' ? 'var(--primary)' : 'transparent', color: activeTab === 'settings' ? 'white' : 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={18} /> Customize
          </button>
          <button onClick={logoutAdmin} style={{ padding: '1rem 2rem', background: '#fff0f0', color: 'var(--primary)', border: 'none', borderRadius: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              <StatCard title="Orders Placed" value={allOrders?.length || 0} icon={ShoppingBag} trend="12%" />
              <StatCard title="Dream Customers" value="1.2k" icon={Users} trend="8%" />
              <StatCard title="Total Growth" value={`₹${(allOrders?.reduce((sum, o) => sum + o.total, 0) / 1000 || 0).toFixed(1)}k`} icon={TrendingUp} trend="15%" />
              <StatCard title="Designs Catalog" value={products?.length || 0} icon={Package} trend="2%" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '40px', boxShadow: '0 20px 40px rgba(233,163,163,0.1)', border: '1px solid #fff0f0' }}>
                <h3 style={{ marginBottom: '2.5rem', fontFamily: 'Playfair Display', fontSize: '1.6rem', color: 'var(--secondary)' }}>Magic Sent ✨</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {allOrders?.slice(0, 5).map((order) => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px dashed #fff0f0' }}>
                       <div>
                          <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem' }}>#{order.id}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{order.customer}</p>
                       </div>
                       <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, background: '#fff9f9', color: 'var(--primary)' }}>{order.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '40px', boxShadow: '0 20px 40px rgba(233,163,163,0.1)', border: '1px solid #fff0f0' }}>
                <h3 style={{ marginBottom: '2.5rem', fontFamily: 'Playfair Display', fontSize: '1.6rem', color: 'var(--secondary)' }}>Needs Love ☁️</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {products?.filter(p => p.stock <= 5).slice(0, 4).map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <img src={item.image} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '20px' }} alt="" />
                      <div>
                        <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--secondary)' }}>{item.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Stock: {item.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ background: 'white', padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '40px', boxShadow: '0 20px 40px rgba(233,163,163,0.1)', border: '1px solid #fff0f0' }}>
               <h3 style={{ marginBottom: '2.5rem', fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--secondary)' }}>Upcoming Tea & Designs 🫖</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {appointments?.map((appt) => (
                    <div key={appt.id} style={{ background: '#fffcfc', padding: '1.8rem', borderRadius: '30px', border: '1px solid #fff0f0', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                          <div style={{ background: 'white', padding: '0.6rem', borderRadius: '15px', color: 'var(--primary)' }}>
                             <Calendar size={20} />
                          </div>
                          <a href={`tel:${appt.phone}`} style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                             <Phone size={16} /> Call
                          </a>
                       </div>
                       <h4 style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '1.1rem' }}>{appt.customer}</h4>
                       <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, margin: '0.4rem 0', textTransform: 'uppercase' }}>{appt.productName || appt.service}</p>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>{appt.date} • {appt.time}</p>
                       <div style={{ marginTop: '1.2rem', padding: '0.5rem 1rem', background: 'white', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 700, color: '#e9a3a3', border: '1px solid #fff0f0' }}>
                          Mob: {appt.phone}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ProductManager />
          </motion.div>
        )}

        {activeTab === 'catalog' && (
          <motion.div key="catalog" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CatalogManager />
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
                <h3 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '0.8rem' }}>Manifest Your Boutique</h3>
                <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>Update your dreamy branding and contact details in real-time. Changes will be reflected across your magical storefront.</p>
              </div>
              <ConfigForm siteConfig={siteConfig} onUpdate={updateSiteConfig} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
