import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#fff9f9', 
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '40px', 
            boxShadow: '0 20px 60px rgba(233,163,163,0.15)',
            maxWidth: '500px',
            border: '1px solid #fff0f0'
          }}>
            <div style={{ 
              background: '#fff0f0', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2rem' 
            }}>
              <AlertTriangle size={40} color="var(--primary)" />
            </div>
            
            <h1 style={{ 
              fontFamily: 'Playfair Display', 
              fontSize: '2rem', 
              color: 'var(--secondary)', 
              marginBottom: '1rem' 
            }}>
              Something went wrong
            </h1>
            
            <p style={{ color: '#777', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              We've encountered a small glitch in the magic. Our team has been notified, and we're working to restore the enchantment.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  padding: '0.8rem 1.5rem', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '24px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                <RefreshCw size={18} /> Refresh Page
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  padding: '0.8rem 1.5rem', 
                  background: 'white', 
                  color: 'var(--secondary)', 
                  border: '1px solid #eee', 
                  borderRadius: '24px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                <Home size={18} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
