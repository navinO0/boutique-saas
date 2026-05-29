import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, Heart, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { loginAdmin } = useShop();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = loginAdmin(email, password);
        if (success) {
            navigate('/admin');
        } else {
            alert('Invalid credentials! (Demo: admin@amara.com / password123)');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'white', padding: 'clamp(2rem, 8vw, 4rem)', borderRadius: '50px', width: '100%', maxWidth: '500px', boxShadow: '0 30px 60px rgba(233,163,163,0.2)', position: 'relative', overflow: 'hidden' }}
            >
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                    <Sparkles size={120} color="var(--primary)" />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: '#fff0f0', width: '80px', height: '80px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Heart size={32} fill="var(--primary)" color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '0.8rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-light)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Login to your dream account <Sparkles size={16} color="var(--primary)" /></p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.6rem', display: 'block', marginLeft: '1rem' }}>Personal Email</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@amara.com"
                                style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: '#fff9f9', border: 'none', borderRadius: '25px', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.6rem', display: 'block', marginLeft: '1rem' }}>Magic Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '1.2rem 3.5rem 1.2rem 3.5rem', background: '#fff9f9', border: 'none', borderRadius: '25px', outline: 'none', fontSize: '1rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--primary)' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ background: '#fff0f0', padding: '1.2rem', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--secondary)', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: 800, marginBottom: '0.3rem', color: 'var(--primary)' }}>Admin Access Credentials:</p>
                        <p>User: admin@amara.com</p>
                        <p>Pass: password123</p>
                    </div>

                    <button
                        type="submit"
                        style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--primary)', color: 'white', fontWeight: 700, borderRadius: '30px', boxShadow: '0 15px 30px var(--glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', border: 'none', cursor: 'pointer' }}
                    >
                        Enter The Boutique <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Not an admin? <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Register as a customer</span>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
