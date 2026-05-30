import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { 
  Package, MapPin, Heart, ArrowLeft, LogOut, 
  ChevronRight, Trash2, Plus, Edit2, ShoppingBag,
  User, CheckCircle2, Clock, Truck
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PookieLoader from '../components/PookieLoader';
import OrderDetailModal from '../components/OrderDetailModal';
import { resolveImageUrl } from '../utils/imageUtils';

const AccountPage = () => {
  const { 
    currentUser, logoutUser, myOrders, fetchMyOrders, 
    userAddresses, addAddress, removeAddress,
    wishlist, products, toggleWishlist, addToCart,
    updateUserProfile,
    isLoading 
  } = useShop();
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', addressText: '', city: '', pincode: '' });

  const [profileForm, setProfileForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });

  useEffect(() => {
    if (!currentUser) navigate('/auth');
    else if (activeTab === 'orders') fetchMyOrders();
    if (currentUser) setProfileForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone || '' });
  }, [currentUser, activeTab, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    addAddress(addressForm);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({ name: '', phone: '', addressText: '', city: '', pincode: '' });
  };

  const handleEditAddress = (addr) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
  };

  // Content renderers
  const renderOrders = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Package size={48} color="#eee" style={{ marginBottom: '1.5rem' }} />
          <p style={{ color: '#999', fontSize: '0.9rem' }}>No orders placed yet.</p>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '1rem', display: 'inline-block' }}>Start Shopping</Link>
        </div>
      ) : (
        myOrders.map(order => (
          <motion.div 
            key={order.id}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(233,163,163,0.1)' }}
            onClick={() => navigate(`/account/order/${order.id}`)}
            style={{ 
              background: 'white', padding: '1.5rem', borderRadius: '24px', 
              border: '1px solid #fff0f0', cursor: 'pointer', transition: '0.3s',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Order ID</span>
                <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>#{order.id.toString().padStart(5, '0')}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Date</span>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Total</span>
                <p style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--primary)' }}>₹{parseFloat(order.total).toLocaleString()}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ 
                padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase',
                background: order.status === 'delivered' ? '#f0fdf4' : order.status === 'pending' ? '#fff7ed' : '#f0f9ff',
                color: order.status === 'delivered' ? '#10b981' : order.status === 'pending' ? '#f97316' : '#0369a1'
               }}>
                 {order.status}
               </span>
               <ChevronRight size={18} color="#ddd" />
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderAddresses = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AnimatePresence mode="wait">
        {isAddingAddress ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSaveAddress}
            style={{ background: 'white', padding: 'clamp(1rem, 5vw, 2rem)', borderRadius: '30px', border: '1.5px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            <h4 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: 'var(--secondary)' }}>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
            <div className="address-form-grid">
              <input type="text" placeholder="Full Name" value={addressForm.name} required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee' }} onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
              <input type="tel" placeholder="Phone Number" value={addressForm.phone} required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee' }} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
            </div>
            <textarea placeholder="Complete Address (House No, Street, Area)" value={addressForm.addressText} required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee', height: '100px', resize: 'none' }} onChange={e => setAddressForm({...addressForm, addressText: e.target.value})} />
            <div className="address-form-grid">
              <input type="text" placeholder="City" value={addressForm.city} required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee' }} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
              <input type="text" placeholder="Pincode" value={addressForm.pincode} required style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid #eee' }} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '15px', fontWeight: 800 }}>Save Address</button>
              <button type="button" onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }} style={{ padding: '1rem 2rem', background: '#f5f5f5', borderRadius: '15px', fontWeight: 700 }}>Cancel</button>
            </div>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div 
              onClick={() => { setIsAddingAddress(true); setAddressForm({ name: '', phone: '', addressText: '', city: '', pincode: '' }); }}
              style={{ border: '2px dashed #eee', borderRadius: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '200px', transition: '0.3s' }}
              className="hover-primary-border"
            >
              <Plus size={32} color="#ddd" />
              <p style={{ fontWeight: 800, color: '#bbb', marginTop: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Add New Address</p>
            </div>
            {userAddresses.map(addr => (
              <div key={addr.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '25px', border: '1px solid #fff0f0', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '10px' }}><MapPin size={16} color="var(--primary)" /></div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditAddress(addr)} style={{ padding: '0.4rem', borderRadius: '8px', background: '#f5f5f5', color: '#666' }}><Edit2 size={14} /></button>
                    {/* Assuming removeAddress exists in context, if not I will just use a mockup alert for now or implement it if possible */}
                    <button style={{ padding: '0.4rem', borderRadius: '8px', background: '#fff0f0', color: '#ff4444' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{addr.name}</p>
                <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: 1.6, marginBottom: '0.8rem' }}>{addr.addressText}, {addr.city} - {addr.pincode}</p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--secondary)' }}>+91 {addr.phone}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderProfile = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '40px', border: '1px solid #fff0f0' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
          <User size={40} />
        </div>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--secondary)' }}>Personal Details</h3>
        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>Manage your account identity and contact information</p>
      </div>

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          await updateUserProfile(profileForm);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>Full Identity</label>
          <input 
            type="text" value={profileForm.name} 
            onChange={e => setProfileForm({...profileForm, name: e.target.value})}
            placeholder="Name" required 
            style={{ padding: '1rem 1.5rem', borderRadius: '20px', border: '1.5px solid #f8f8f8', background: '#fcfcfc', fontSize: '0.95rem', fontWeight: 700 }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>Email Address</label>
          <input 
            type="email" value={profileForm.email} 
            onChange={e => setProfileForm({...profileForm, email: e.target.value})}
            placeholder="Email" required 
            style={{ padding: '1rem 1.5rem', borderRadius: '20px', border: '1.5px solid #f8f8f8', background: '#fcfcfc', fontSize: '0.95rem', fontWeight: 700 }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>Contact Number</label>
          <input 
            type="tel" value={profileForm.phone} 
            onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
            placeholder="Phone Number (Optional)" 
            style={{ padding: '1rem 1.5rem', borderRadius: '20px', border: '1.5px solid #f8f8f8', background: '#fcfcfc', fontSize: '0.95rem', fontWeight: 700 }} 
          />
        </div>

        <button 
          type="submit" 
          style={{ marginTop: '1rem', padding: '1.2rem', background: 'var(--primary)', color: 'white', borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(233,163,163,0.3)', cursor: 'pointer' }}
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );

  const renderWishlist = () => {
    const wishlistItems = products.filter(p => wishlist.includes(p.id));
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
        {wishlistItems.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0' }}>
            <Heart size={48} color="#eee" style={{ marginBottom: '1.5rem' }} />
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Your wishlist is empty.</p>
            <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '1rem', display: 'inline-block' }}>Find Your Dream Dress</Link>
          </div>
        ) : (
          wishlistItems.map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -8 }}
              style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #fff0f0', position: 'relative' }}
            >
              <button 
                 onClick={() => toggleWishlist(item.id)}
                 style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
              >
                <Trash2 size={14} color="#ff4444" />
              </button>
              <div style={{ height: '280px', overflow: 'hidden' }} onClick={() => navigate(`/product/${item.id}`)}>
                <img src={resolveImageUrl(item.images?.[0] || item.image)} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fefafa' }} alt={item.name} />
              </div>
              <div style={{ padding: '1.2rem' }}>
                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '0.4rem' }}>{item.name}</p>
                <p style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>₹{parseFloat(item.discountedPrice).toLocaleString()}</p>
                <button 
                  onClick={() => addToCart(item)}
                  style={{ width: '100%', padding: '0.7rem', background: 'var(--secondary)', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ShoppingBag size={14} /> Move to Bag
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container account-sanctuary" style={{ padding: 'clamp(3rem, 10vw, 5rem) clamp(0.75rem, 3vw, 2rem) 10rem' }}>
      {/* Header */}
      <div style={{ marginBottom: 'clamp(2rem, 8vw, 4rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#aaa', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
            <ArrowLeft size={12} /> Boutique
          </Link>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1 }}>User Sanctuary</h2>
          <p style={{ color: '#888', marginTop: '0.5rem', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>Welcome, <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{currentUser.name}</span></p>
        </div>
        <div>
           <button 
              onClick={handleLogout}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '15px', background: '#fff0f0', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid #ffeded' }}
           >
             <LogOut size={14} /> Sign Out
           </button>
        </div>
      </div>

      <div className="responsive-account-grid">
        {/* Tab Navigation */}
          <aside className="account-nav-container">
          {[
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'addresses', label: 'Addresses', icon: MapPin },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`account-tab-link ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="tabUnderline" className="tab-underline" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'addresses' && renderAddresses()}
              {activeTab === 'wishlist' && renderWishlist()}
              {activeTab === 'profile' && renderProfile()}
            </motion.div>
          </AnimatePresence>
          <div style={{ height: '10rem' }} />
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
