import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import PookieLoader from '../components/PookieLoader';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser, registerUser, isLoading } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const result = await loginUser(formData.email, formData.password);
      if (result.success) navigate('/');
      else setError('Invalid email or password');
    } else {
      const result = await registerUser(formData);
      if (result.success) navigate('/');
      else setError(result.message);
    }
  };

  return (
    <>
      {isLoading && <PookieLoader fullScreen={true} />}
      <div className="container" style={{ padding: '6rem 2rem', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', padding: '3.5rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '450px', width: '100%' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Join Amara'}</h2>
          <p style={{ color: '#999' }}>{isLogin ? 'Login to your account' : 'Create your boutique account'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}><User size={18} /></span>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', border: '1px solid #eee', borderRadius: '8px' }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}><Mail size={18} /></span>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', border: '1px solid #eee', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}><Lock size={18} /></span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                style={{ width: '100%', padding: '0.8rem 3rem 0.8rem 3rem', border: '1px solid #eee', borderRadius: '8px' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isLogin && (
              <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center' }}>
                Admin credentials work here too. Use: admin@amara.com / password123
              </p>
            )}
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--secondary)', 
              color: 'white', 
              fontWeight: 600, 
              borderRadius: '8px', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Verifying...' : (isLogin ? 'Login' : 'Create Account')} {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default AuthPage;
