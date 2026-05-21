import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Filter, Heart, Edit2, Trash2, Plus, Eye, Sparkles } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BOUTIQUE_CONFIG } from '../data/config';
import EditProductModal from '../components/EditProductModal';
import ProductDetailModal from '../components/ProductDetailModal';

const ProductList = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { products, addToCart, wishlist, toggleWishlist, isAdminLoggedIn, deleteProduct, updateProduct, addProduct } = useShop();
  const [filter, setFilter] = useState(categoryId || 'all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  React.useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId && products) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setViewingProduct(product);
        setIsDetailModalOpen(true);
      }
    }
  }, [searchParams, products]);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const handleEdit = (e, p) => {
    e.stopPropagation();
    setEditingProduct(p);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteProduct(id);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleProductClick = (p) => {
    setViewingProduct(p);
    setIsDetailModalOpen(true);
  };

  const handleSave = (prodData) => {
    if (editingProduct) {
      updateProduct(prodData);
    } else {
      addProduct(prodData);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)' }}>
          {filter === 'all' ? 'The Dream Collection' : BOUTIQUE_CONFIG.categories.find(c => c.id === filter)?.name} ✨
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {isAdminLoggedIn && (
            <button onClick={handleAddNew} style={{ padding: '0.8rem 1.5rem', background: 'var(--secondary)', color: 'white', borderRadius: '25px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> New Design
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '0.8rem 3rem 0.8rem 1.5rem', borderRadius: '30px', border: '2px solid #fff0f0', background: 'white', appearance: 'none', fontWeight: 600, outline: 'none', color: 'var(--secondary)' }}
            >
              <option value="all">All Styles</option>
              {BOUTIQUE_CONFIG.categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Filter size={14} style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 'clamp(1rem, 3vw, 4rem)',
      }} className="amara-product-grid">
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            onClick={() => handleProductClick(product)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {/* Wishlist Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 10, background: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', boxShadow: '0 8px 20px rgba(233,163,163,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart size={20} fill={wishlist.includes(product.id) ? 'var(--primary)' : 'none'} color={wishlist.includes(product.id) ? 'var(--primary)' : '#ffccd2'} />
            </button>

            {/* Admin Controls */}
            {isAdminLoggedIn && (
              <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                <button onClick={(e) => handleEdit(e, product)} style={{ background: 'white', padding: '0.7rem', borderRadius: '50%', border: 'none', boxShadow: '0 8px 15px rgba(0,0,0,0.05)' }}><Edit2 size={16} color="#4a3737" /></button>
                <button onClick={(e) => handleDelete(e, product.id)} style={{ background: 'white', padding: '0.7rem', borderRadius: '50%', border: 'none', boxShadow: '0 8px 15px rgba(0,0,0,0.05)' }}><Trash2 size={16} color="var(--primary)" /></button>
              </div>
            )}

            <div style={{ height: 'clamp(250px, 50vh, 450px)', overflow: 'hidden', borderRadius: '35px', marginBottom: '1.5rem', background: '#fef5f5', position: 'relative' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: product.stock === 0 ? 0.6 : 1 }}
              />
              {product.discount > 0 && (
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                  -{product.discount}% OFF ✨
                </div>
              )}
              {product.stock === 0 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}>
                  <span style={{ color: 'var(--secondary)', fontWeight: 800, letterSpacing: '2px', fontSize: '0.7rem', textTransform: 'uppercase' }}>Sold Out ☁️</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', padding: '0 1rem' }}>
              <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{product.category}</p>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem', fontFamily: 'Playfair Display' }}>{product.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                 <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{product.discountedPrice.toLocaleString()}</p>
                 {product.discount > 0 && (
                    <p style={{ color: '#bbb', textDecoration: 'line-through', fontSize: '0.8rem' }}>₹{product.price.toLocaleString()}</p>
                 )}
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              disabled={product.stock === 0}
              style={{ 
                width: '100%', 
                marginTop: '1.5rem', 
                padding: '1.3rem', 
                background: product.stock === 0 ? '#f0f0f0' : 'var(--primary)', 
                color: 'white', 
                fontWeight: 700,
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                boxShadow: product.stock === 0 ? 'none' : '0 10px 20px var(--glow)',
                border: 'none',
                opacity: product.stock === 0 ? 0.7 : 1
              }}
            >
              <ShoppingBag size={18} /> {product.stock === 0 ? 'Currently Unavailable' : 'Add to Bag'}
            </button>
          </motion.div>
        ))}
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={editingProduct} 
        onSave={handleSave} 
      />

      <ProductDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        product={viewingProduct} 
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default ProductList;
