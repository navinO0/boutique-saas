import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, products, toggleWishlist, addToCart, currentUser } = useShop();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) navigate('/auth');
  }, [currentUser, navigate]);

  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
        <h2 style={{ fontSize: '3rem' }}>Your Wishlist</h2>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Heart size={64} style={{ color: '#eee', marginBottom: '2rem' }} />
          <h3 style={{ color: '#999' }}>Your wishlist is empty</h3>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '2rem', display: 'inline-block' }}>Discover our collection</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
          {wishlistItems.map(item => (
            <motion.div 
              key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}
            >
              <button 
                onClick={() => toggleWishlist(item.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'white', padding: '0.6rem', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              >
                <Trash2 size={16} color="#dc2626" />
              </button>
              
              <div style={{ height: '350px' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>₹{item.discountedPrice.toLocaleString()}</p>
                <button 
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                  style={{ 
                    width: '100%', padding: '1rem', 
                    background: item.stock === 0 ? '#eee' : 'var(--secondary)', 
                    color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <ShoppingBag size={18} /> {item.stock === 0 ? 'Sold Out' : 'Move to Bag'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
