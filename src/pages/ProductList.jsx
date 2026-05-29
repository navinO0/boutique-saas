import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Filter, Heart, Search, ChevronLeft, ChevronRight, Sparkles, Edit2, Trash2, X, Star, Plus } from 'lucide-react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BOUTIQUE_CONFIG } from '../data/config';
import ProductDetailModal from '../components/ProductDetailModal';
import EditProductModal from '../components/EditProductModal';
import PookieLoader from '../components/PookieLoader';
import { resolveImageUrl } from '../utils/imageUtils';

import ErrorDisplay from '../components/ErrorDisplay';
import EmptyState from '../components/EmptyState';

const ProductList = () => {
  const { categoryId } = useParams();
  const {
    products, isLoading, error, clearError, pagination, fetchProducts,
    addToCart, wishlist, toggleWishlist,
    isAdminLoggedIn, updateProduct, deleteProduct, siteConfig
  } = useShop();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get('category') || categoryId || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const maxPrice = searchParams.get('maxPrice') || '100000';
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const hasFilters = filter !== 'all' || search !== '' || sortBy !== 'newest' || page !== 1 || maxPrice !== '100000';

  // Local states for inputs (Applied only on "Apply" button click)
  const [searchInput, setSearchInput] = useState(search);
  const [priceInput, setPriceInput] = useState(maxPrice);
  const [categoryInput, setCategoryInput] = useState(filter);
  const [sortByInput, setSortByInput] = useState(sortBy);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '' || (key === 'page' && value === 1)) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset page to 1 on filter/search change unless page is explicitly included
    if (!updates.page && page !== 1) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
    setPriceInput('100000');
    setCategoryInput('all');
    setSortByInput('newest');
    setIsFilterDrawerOpen(false);
  };

  const handleApplyFilters = () => {
    updateParams({
      category: categoryInput,
      sortBy: sortByInput,
      maxPrice: priceInput,
      search: searchInput,
      page: 1
    });
    setIsFilterDrawerOpen(false);
  };

  useEffect(() => {
    fetchProducts({
      category: filter !== 'all' ? filter : undefined,
      search: search,
      sortBy: sortBy,
      page: page,
      maxPrice: maxPrice !== '100000' ? maxPrice : undefined
    });
  }, [filter, sortBy, search, page, maxPrice]);

  // Sync local inputs if URL changes (e.g. initial load or back button)
  useEffect(() => {
    setSearchInput(search);
    setPriceInput(maxPrice);
    setCategoryInput(filter);
    setSortByInput(sortBy);
  }, [search, maxPrice, filter, sortBy]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem 8rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.2rem', fontWeight: 700, fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {filter === 'all' ? 'Signature Designs' : siteConfig.categories.find(c => c.id === filter)?.name} <Sparkles size={24} color="var(--primary)" />
        </h2>
        
        {isAdminLoggedIn && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            style={{ marginTop: '1.5rem', padding: '0.7rem 1.8rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem auto' }}
          >
            <Plus size={18} /> New Product
          </motion.button>
        )}

        {/* COMPACT ACTION BAR (Mobile & Desktop) */}
        <div style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          alignItems: 'center', 
          margin: '2rem auto 3rem',
          maxWidth: '800px',
          padding: '0.5rem',
          background: 'white',
          borderRadius: '40px',
          boxShadow: '0 15px 35px rgba(233,163,163,0.1)',
          border: '1px solid #fff5f5'
        }}>
          {/* Compact Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
            <input
              type="text"
              placeholder="Search designs..."
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

          {/* Filter Trigger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterDrawerOpen(true)}
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
            <Filter size={16} /> <span className="desktop-only">Filters</span>
          </motion.button>
        </div>
      </div>

      {/* RESPONSIVE FILTER MODAL */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(74, 55, 55, 0.35)', backdropFilter: 'blur(10px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'relative', background: 'white',
                borderRadius: '45px', padding: '2.5rem 2.5rem 3.5rem',
                zIndex: 6001, width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 40px 100px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>Refine Collection</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} style={{ background: '#fff9f9', color: 'var(--primary)', padding: '0.6rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Categories */}
                <div>
                  <label style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', display: 'block', marginBottom: '1.2rem' }}>Category</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    <button 
                      onClick={() => setCategoryInput('all')}
                      style={{ padding: '0.75rem 1.25rem', borderRadius: '15px', background: categoryInput === 'all' ? 'var(--primary)' : '#fefafa', color: categoryInput === 'all' ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >All</button>
                    {siteConfig.categories.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setCategoryInput(c.id)}
                        style={{ padding: '0.75rem 1.25rem', borderRadius: '15px', background: categoryInput === c.id ? 'var(--primary)' : '#fefafa', color: categoryInput === c.id ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                      >{c.name}</button>
                    ))}
                  </div>
                </div>

                {/* Sorting */}
                <div>
                  <label style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', display: 'block', marginBottom: '1.2rem' }}>Sort Collection</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={sortByInput}
                      onChange={(e) => setSortByInput(e.target.value)}
                      style={{ width: '100%', padding: '1.1rem', background: '#fefafa', borderRadius: '18px', border: '1px solid #fff0f0', fontWeight: 800, color: 'var(--secondary)', outline: 'none', appearance: 'none', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      <option value="newest">Relevant</option>
                      <option value="popularity">Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronRight size={14} style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: 'var(--primary)' }} />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Couture Cap</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 950, color: 'var(--secondary)', fontSize: '0.9rem' }}>₹</span>
                      <input 
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        style={{ width: '85px', padding: '0.4rem', borderRadius: '10px', border: '1px solid #eee', fontWeight: 800, fontSize: '0.9rem', textAlign: 'right', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="500" 
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    style={{ width: '100%', height: '6px', appearance: 'none', background: '#f0f0f0', borderRadius: '10px', outline: 'none', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyFilters}
                    style={{ flex: 2, padding: '1.2rem', background: 'var(--primary)', color: 'white', borderRadius: '22px', fontWeight: 900, border: 'none', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 15px 35px rgba(233,163,163,0.3)' }}
                  >
                    Apply Filters
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    style={{ flex: 1, padding: '1.2rem', background: '#fefafa', color: 'var(--secondary)', borderRadius: '22px', fontWeight: 800, border: '1px solid #fff0f0', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Reset
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && <ErrorDisplay message={error} onRetry={() => { clearError(); fetchProducts({ category: filter, search: search, sortBy: sortBy, page: page }); }} />}

      {isLoading ? (
        <PookieLoader fullScreen={true} />
      ) : (
        <>
          {products.length === 0 ? (
            <div style={{ width: '100%', gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
              <EmptyState 
                message="Your perfect piece is playing hide and seek!" 
                subtext="This specific collection is currently empty, but there's plenty of other magic to explore. Try looking in 'Everything' or adjusting your search." 
              />
            </div>
          ) : (
            <div className="amara-product-grid">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleProductClick(product.id)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    background: 'white',
                    borderRadius: '20px',
                    padding: '0.4rem',
                    border: '1px solid #fff0f0',
                    boxShadow: '0 8px 25px rgba(233,163,163,0.05)',
                    transition: 'all 0.4s'
                  }}
                >
                  <div style={{ position: 'relative', height: 'clamp(140px, 32vw, 300px)', overflow: 'hidden', borderRadius: '16px', background: '#fefafa' }}>
                    <img
                      src={resolveImageUrl(product.images?.[0] || product.image)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        style={{ background: 'rgba(255,255,255,0.9)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Heart size={14} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} color={wishlist.includes(product.id) ? 'var(--primary)' : '#ffccd2'} />
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      disabled={product.stock === 0}
                      style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ShoppingBag size={14} />
                    </motion.button>
                  </div>

                  <div style={{ padding: '0.8rem 0.4rem', textAlign: 'left' }}>
                    <p style={{ color: 'var(--primary)', fontSize: '0.5rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>{product.category}</p>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', fontWeight: 700, minHeight: '2.2rem' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #f9f0f0' }}>
                      <p style={{ fontWeight: 950, color: 'var(--primary)', fontSize: '0.95rem' }}>₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "var(--primary)" : "none"} color={i < 4 ? "var(--primary)" : "#eee"} />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '5rem' }}>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                style={{ background: 'white', border: '1px solid #fff0f0', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', fontWeight: 800, background: pagination.currentPage === i + 1 ? 'var(--primary)' : 'white', color: pagination.currentPage === i + 1 ? 'white' : 'var(--secondary)', cursor: 'pointer' }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                style={{ background: 'white', border: '1px solid #fff0f0', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary)', cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {isEditModalOpen && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingProduct(null); }}
          product={editingProduct}
          onSave={(data) => { updateProduct(data); setIsEditModalOpen(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
};

export default ProductList;
