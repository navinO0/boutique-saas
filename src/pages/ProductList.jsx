import React, { useState, useEffect, useMemo, useCallback } from 'react';

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

const ProductCard = React.memo(({ product, wishlist, toggleWishlist, addToCart, onClick }) => {
  const isMobile = window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(product.id)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        background: 'white',
        borderRadius: '8px',
        padding: '0.4rem',
        border: '1px solid #fff0f0',
        boxShadow: '0 8px 25px rgba(233,163,163,0.05)',
        transition: 'all 0.4s',
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 'clamp(350px, 85vw, 450px)' : 'auto'
      }}
    >
      <div style={{ 
        position: 'relative', 
        height: isMobile ? '80%' : 'clamp(220px, 45vw, 420px)', 
        overflow: 'hidden', 
        borderRadius: '6px', 
        background: '#fefafa',
        flexShrink: 0
      }}>
        <img
          src={resolveImageUrl(product.images?.[0] || product.image)}
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: product.stock === 0 ? 0.6 : 1 }}
        />
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)' }}>
            <span style={{ background: 'var(--secondary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Sold Out</span>
          </div>
        )}
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
          style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ShoppingBag size={14} />
        </motion.button>
      </div>

      <div style={{ 
        padding: '0.4rem 0.4rem', 
        textAlign: 'left', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        height: isMobile ? '20%' : 'auto'
      }}>
        <p style={{ color: 'var(--primary)', fontSize: 'clamp(0.45rem, 2vw, 0.55rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.1rem' }}>{product.category}</p>
        <h3 style={{ fontSize: 'clamp(0.72rem, 2.5vw, 0.95rem)', color: 'var(--secondary)', fontFamily: 'Roboto', fontWeight: 700, minHeight: isMobile ? 'auto' : '2.2rem', marginBottom: '0.2rem' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid #f9f0f0' }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 'clamp(0.82rem, 2.5vw, 1.1rem)' }}>₹{parseFloat(product.discountedPrice).toLocaleString()}</p>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "var(--primary)" : "none"} color={i < 4 ? "var(--primary)" : "#eee"} />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
});


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
  const search = searchParams.get('search') || '';
  const sizes = searchParams.get('sizes') || '';

  const hasFilters = filter !== 'all' || search !== '' || sortBy !== 'newest' || maxPrice !== '100000' || sizes !== '';

  // Local states for inputs (Applied only on "Apply" button click)
  const [searchInput, setSearchInput] = useState(search);
  const [priceInput, setPriceInput] = useState(maxPrice);
  const [categoryInput, setCategoryInput] = useState(filter);
  const [sortByInput, setSortByInput] = useState(sortBy);
  const [sizesInput, setSizesInput] = useState(sizes ? sizes.split(',') : []);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || value === '' || (key === 'page' && value === 1)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) newParams.delete(key);
        else newParams.set(key, value.join(','));
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
    setPriceInput('100000');
    setCategoryInput('all');
    setSortByInput('newest');
    setSizesInput([]);
    setIsFilterDrawerOpen(false);
  };

  const handleApplyFilters = () => {
    updateParams({
      category: categoryInput,
      sortBy: sortByInput,
      maxPrice: priceInput,
      search: searchInput,
      sizes: sizesInput
    });
    setIsFilterDrawerOpen(false);
  };

  useEffect(() => {
    fetchProducts({
      category: filter !== 'all' ? filter : undefined,
      search: search,
      sortBy: sortBy,
      page: 1,
      maxPrice: maxPrice !== '100000' ? maxPrice : undefined,
      sizes: sizes || undefined
    });
  }, [filter, sortBy, search, maxPrice, sizes]);

  const { isFetchingMore } = useShop();

  // Infinite Scroll Logic
  const observer = React.useRef();
  const lastProductElementRef = useCallback(node => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.currentPage < pagination.totalPages) {
        fetchProducts({
          category: filter !== 'all' ? filter : undefined,
          search: search,
          sortBy: sortBy,
          page: pagination.currentPage + 1,
          maxPrice: maxPrice !== '100000' ? maxPrice : undefined,
          sizes: sizes || undefined
        }, true);
      }
    }, {
      rootMargin: '100px'
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, pagination.currentPage, pagination.totalPages, filter, search, sortBy, maxPrice, sizes, fetchProducts]);

  // Sync local inputs if URL changes
  useEffect(() => {
    setSearchInput(search);
    setPriceInput(maxPrice);
    setCategoryInput(filter);
    setSortByInput(sortBy);
    setSizesInput(sizes ? sizes.split(',') : []);
  }, [search, maxPrice, filter, sortBy, sizes]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const FilterContent = ({ isSidebar = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {!isSidebar && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontFamily: 'Roboto', color: 'var(--secondary)' }}>Refine Collection</h3>
          <button onClick={() => setIsFilterDrawerOpen(false)} style={{ background: '#fff9f9', color: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <label style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', display: 'block', marginBottom: '0.8rem' }}>Category</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button 
            onClick={() => setCategoryInput('all')}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: categoryInput === 'all' ? 'var(--primary)' : '#fefafa', color: categoryInput === 'all' ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
          >All</button>
          {siteConfig.categories.map(c => (
            <button 
              key={c.id}
              onClick={() => setCategoryInput(c.id)}
              style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: categoryInput === c.id ? 'var(--primary)' : '#fefafa', color: categoryInput === c.id ? 'white' : 'var(--secondary)', border: '1px solid #fff0f0', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >{c.name}</button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', display: 'block', marginBottom: '0.8rem' }}>Size</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {(siteConfig.sizes || ["S", "M", "L", "XL", "Free Size"]).map(s => {
            const isSelected = sizesInput.includes(s);
            return (
              <button 
                key={s}
                onClick={() => {
                  if (isSelected) setSizesInput(prev => prev.filter(x => x !== s));
                  else setSizesInput(prev => [...prev, s]);
                }}
                style={{ 
                  padding: '0.5rem 0.8rem', 
                  minWidth: '40px',
                  borderRadius: '6px', 
                  background: isSelected ? 'var(--primary)' : '#fefafa', 
                  color: isSelected ? 'white' : 'var(--secondary)', 
                  border: '1px solid #fff0f0', 
                  fontWeight: 800, 
                  fontSize: '0.72rem', 
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >{s}</button>
            );
          })}
        </div>
      </div>

      {/* Sorting & Price */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
        <div>
          <label style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', display: 'block', marginBottom: '0.8rem' }}>Sort By</label>
          <select
            value={sortByInput}
            onChange={(e) => setSortByInput(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', background: '#fefafa', borderRadius: '8px', border: '1px solid #fff0f0', fontWeight: 800, color: 'var(--secondary)', outline: 'none', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            <option value="newest">Recent</option>
            <option value="popularity">Popular</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', display: 'block', marginBottom: '0.8rem' }}>Price Limit</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fefafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fff0f0' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.8rem' }}>₹</span>
            <input 
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', fontWeight: 800, fontSize: '0.82rem', outline: 'none', color: 'var(--secondary)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyFilters}
          style={{ flex: 2, padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 800, border: 'none', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer' }}
        >
          Apply
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          style={{ flex: 1, padding: '1rem', background: '#fefafa', color: 'var(--secondary)', borderRadius: '8px', fontWeight: 800, border: '1px solid #fff0f0', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Reset
        </motion.button>
      </div>
    </div>
  );

  const isDesktop = window.innerWidth >= 1024;

  return (
    <div style={{ padding: '4rem 0 8rem', width: '95%', maxWidth: '1800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.2rem', fontWeight: 700, fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h2 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.8rem)', fontFamily: 'Roboto', color: 'var(--secondary)', lineHeight: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {filter === 'all' ? 'Signature Designs' : siteConfig.categories.find(c => c.id === filter)?.name} <Sparkles size={24} color="var(--primary)" />
        </h2>
        
        {isAdminLoggedIn && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin')}
            style={{ marginTop: '1.5rem', padding: '0.7rem 1.8rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem auto' }}
          >
            <Plus size={18} /> New Product
          </motion.button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Desktop Sidebar Filters */}
        {isDesktop && (
          <div style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #fff0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <FilterContent isSidebar={true} />
          </div>
        )}

        {/* Global Action Bar (Search + Mobile Filter Trigger) */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.8rem', 
            alignItems: 'center', 
            marginBottom: '3rem',
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '40px',
            boxShadow: '0 15px 35px rgba(233,163,163,0.1)',
            border: '1px solid rgba(255, 245, 245, 0.5)'
          }}>
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

            {!isDesktop && (
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
                <Filter size={16} /> Filters
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isFilterDrawerOpen && !isDesktop && (
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
                    borderRadius: '12px', padding: '1.8rem 2rem 2.22rem',
                    zIndex: 6001, width: '92%', maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)'
                  }}
                >
                  <FilterContent />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {error && <ErrorDisplay message={error} onRetry={() => { clearError(); fetchProducts({ category: filter, search: search, sortBy: sortBy, page: 1 }); }} />}

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
                  {products.map((product, index) => {
                    if (products.length === index + 1) {
                      return (
                        <div ref={lastProductElementRef} key={product.id}>
                          <ProductCard
                            product={product}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            addToCart={addToCart}
                            onClick={handleProductClick}
                          />
                        </div>
                      );
                    }
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        addToCart={addToCart}
                        onClick={handleProductClick}
                      />
                    );
                  })}
                </div>
              )}

              {isFetchingMore && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <div className="infinite-scroll-loader">
                    <Sparkles className="spinning-sparkle" size={32} color="var(--primary)" />
                    <p style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Curating more magic...</p>
                  </div>
                </div>
              )}

              {!isFetchingMore && pagination.currentPage === pagination.totalPages && products.length > 0 && (
                 <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--secondary)' }}>You've explored the entire collection</p>
                   <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '1rem auto' }}></div>
                 </div>
              )}

              <style>{`
                .spinning-sparkle {
                  animation: sparkle-spin 3s linear infinite;
                }
                @keyframes sparkle-spin {
                  from { transform: rotate(0deg) scale(1); }
                  50% { transform: rotate(180deg) scale(1.2); }
                  to { transform: rotate(360deg) scale(1); }
                }
              `}</style>
            </>
          )}
        </div>
      </div>

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
