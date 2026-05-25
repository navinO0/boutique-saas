import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Filter, Heart, Search, ChevronLeft, ChevronRight, Sparkles, Edit2, Trash2, X } from 'lucide-react';
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
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  
  const hasFilters = filter !== 'all' || search !== '' || sortBy !== 'newest' || page !== 1;
  
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
      category: filter,
      search: search,
      sortBy: sortBy,
      page: page
    });
  }, [filter, sortBy, search, page]);

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
        <h2 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1 }}>
          {filter === 'all' ? 'The Dream Collection' : siteConfig.categories.find(c => c.id === filter)?.name} ✨
        </h2>
        
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
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 'clamp(1rem, 2.5vw, 2.5rem)',
          }} className="amara-product-grid">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                onClick={() => handleProductClick(product.id)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                  {isAdminLoggedIn && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsEditModalOpen(true); }}
                        style={{ background: 'white', border: 'none', width: '38px', height: '38px', borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        style={{ background: 'white', border: 'none', width: '38px', height: '38px', borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    style={{ background: 'white', border: 'none', width: '38px', height: '38px', borderRadius: '50%', boxShadow: '0 6px 16px rgba(233,163,163,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Heart size={17} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} color={wishlist.includes(product.id) ? 'var(--primary)' : '#ffccd2'} />
                  </button>
                </div>

                <div style={{ height: 'clamp(220px, 45vw, 400px)', overflow: 'hidden', borderRadius: '30px', marginBottom: '1.2rem', background: '#fef5f5' }}>
                  <img src={resolveImageUrl(product.images?.[0] || product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '24px' }} />
                </div>

                <div style={{ textAlign: 'center', padding: '0 0.8rem' }}>
                  <p style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '0.4rem' }}>{product.category}</p>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.4rem', fontFamily: 'Playfair Display' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
                    <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  disabled={product.stock === 0}
                  className="add-to-bag-btn"
                  style={{ 
                    width: '100%', 
                    marginTop: '1.2rem', 
                    padding: '0.85rem', 
                    background: product.stock === 0 ? '#f0f0f0' : 'var(--primary)', 
                    color: 'white', 
                    fontWeight: 700,
                    borderRadius: '20px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    fontSize: '0.88rem',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ShoppingBag size={17} /> {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
                </button>
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
