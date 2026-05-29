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

const ProductList = () => {
  const { categoryId } = useParams();
  const {
    products, isLoading, error, clearError, pagination, fetchProducts,
    addToCart, wishlist, toggleWishlist,
    isAdminLoggedIn, updateProduct, deleteProduct, siteConfig
  } = useShop();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get('category') || categoryId || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const maxPrice = searchParams.get('maxPrice') || '50000';
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const hasFilters = filter !== 'all' || search !== '' || sortBy !== 'newest' || page !== 1 || maxPrice !== '50000';

  // Local state for the search input to allow smooth typing before debounced URL update
  const [searchInput, setSearchInput] = useState(search);

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
  };

  useEffect(() => {
    fetchProducts({
      category: filter !== 'all' ? filter : undefined,
      search: search,
      sortBy: sortBy,
      page: page,
      maxPrice: maxPrice !== '50000' ? maxPrice : undefined
    });
  }, [filter, sortBy, search, page, maxPrice]);

  // Debounced search that updates URL params
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync partial search input if URL changes (e.g. back button)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          {filter === 'all' ? 'The Dream Collection' : siteConfig.categories.find(c => c.id === filter)?.name} <Sparkles size={28} color="var(--primary)" />
        </h2>
        
        {isAdminLoggedIn && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '30px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem auto' }}
          >
            <Plus size={20} /> Add New Product (Admin)
          </motion.button>
        )}

        {/* Search and Filters */}
        <div className="horizontal-filters">
          {/* Search Bar Row */}
          <div className="search-row-mobile" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            <input
              type="text"
              placeholder="Search your collection..."
              value={searchInput}
              className="filter-input-compact"
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                border: '2px solid #fff0f0',
                background: 'white',
                fontWeight: 600,
                outline: 'none',
                color: 'var(--secondary)',
                boxShadow: '0 5px 15px rgba(233,163,163,0.05)'
              }}
            />
          </div>

          <div className="filter-row-mobile">
            {/* Category Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={filter}
                className="filter-select-compact"
                onChange={(e) => updateParams({ category: e.target.value })}
                style={{ width: '100%', border: '2px solid #fff0f0', background: 'white', appearance: 'none', fontWeight: 600, outline: 'none', color: 'var(--secondary)', cursor: 'pointer' }}
              >
                <option value="all">Styles</option>
                {siteConfig.categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Filter size={12} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            </div>

            {/* Sort Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                className="filter-select-compact"
                onChange={(e) => updateParams({ sortBy: e.target.value })}
                style={{ width: '100%', border: '2px solid #fff0f0', background: 'white', appearance: 'none', fontWeight: 600, outline: 'none', color: 'var(--secondary)', cursor: 'pointer' }}
              >
                <option value="newest">Sort</option>
                <option value="popularity">Popular</option>
                <option value="price-low">Low</option>
                <option value="price-high">High</option>
              </select>
              <ChevronRight size={13} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: 'var(--primary)' }} />
            </div>

            {/* Price Draggable Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '180px', padding: '0 0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Price Range</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--secondary)' }}>Up to ₹{parseInt(maxPrice).toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="500" 
                value={maxPrice}
                onChange={(e) => updateParams({ maxPrice: e.target.value })}
                style={{ 
                  width: '100%', 
                  height: '4px', 
                  borderRadius: '10px', 
                  appearance: 'none', 
                  background: '#fff0f0', 
                  outline: 'none', 
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="filter-btn-compact"
                style={{
                  borderRadius: '50%',
                  background: '#fff0f0',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Clear Filters"
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorDisplay message={error} onRetry={() => { clearError(); fetchProducts({ category: filter, search: search, sortBy: sortBy, page: page }); }} />}

      {isLoading ? (
        <PookieLoader fullScreen={true} />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gap: 'clamp(1rem, 2.5vw, 2.5rem)',
          }} className="amara-product-grid">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
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
                  transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
              >
                <div style={{ position: 'relative', height: 'clamp(140px, 32vw, 300px)', overflow: 'hidden', borderRadius: '16px', background: '#fefafa' }}>
                  <img
                    src={resolveImageUrl(product.images?.[0] || product.image)}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', transition: '0.6s' }}
                    className="product-card-image"
                  />

                  {/* Actions Overlay */}
                  <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Heart size={14} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} color={wishlist.includes(product.id) ? 'var(--primary)' : '#ffccd2'} />
                    </button>
                    {isAdminLoggedIn && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsEditModalOpen(true); }}
                          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', border: 'none', width: '30px', height: '30px', borderRadius: '50%', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e9a3a3' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {product.stock === 0 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                      <span style={{ background: 'white', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Sold Out</span>
                    </div>
                  )}

                  {/* Add to Bag on Hover (Desktop) / Visible Icon (Mobile) */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    disabled={product.stock === 0}
                    style={{
                      position: 'absolute',
                      bottom: '0.6rem',
                      right: '0.6rem',
                      background: 'var(--primary)',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 5px 15px rgba(233,163,163,0.3)',
                      zIndex: 10,
                      opacity: product.stock === 0 ? 0.5 : 1
                    }}
                  >
                    <ShoppingBag size={14} />
                  </motion.button>
                </div>

                <div style={{ padding: '0.8rem 0.35rem 0.45rem', textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.4rem' }}>
                    <p style={{ color: 'var(--primary)', fontSize: '0.48rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem', opacity: 0.8 }}>{product.category}</p>
                    <h3 style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: 1.3, minHeight: '2.1rem', display: 'flex', alignItems: 'center' }}>{product.name}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f9f0f0' }}>
                    <p style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1rem' }}>₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "var(--primary)" : "none"} color={i < 4 ? "var(--primary)" : "#eee"} />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
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
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    fontWeight: 700,
                    background: pagination.currentPage === i + 1 ? 'var(--primary)' : 'white',
                    color: pagination.currentPage === i + 1 ? 'white' : 'var(--secondary)',
                    cursor: 'pointer',
                    boxShadow: pagination.currentPage === i + 1 ? '0 5px 15px rgba(233,163,163,0.3)' : 'none'
                  }}
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
