import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Sparkles, Send } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ContactPage = () => {
  const { submitInquiry, siteConfig } = useShop();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="container" style={{ padding: 'clamp(5rem, 10vw, 8rem) 1rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 5rem)' }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '0.8rem' }}>
          Connect with <span style={{ color: 'var(--primary)' }}>Amara</span>
        </h1>
        <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', color: '#777', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          Every dream outfit begins with a conversation. Let's create something magical together.
        </p>
      </div>

      <div className="responsive-contact-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {[
            { icon: Phone, label: 'Call Us', value: siteConfig.contact.phone },
            { icon: Mail, label: 'Email Us', value: siteConfig.contact.email },
            { icon: MapPin, label: 'Visit Us', value: siteConfig.contact.address }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 12px 32px rgba(233,163,163,0.08)', border: '1px solid #fff0f0' }}
            >
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary)', width: '48px', height: '48px', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333', marginTop: '0.2rem' }}>{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form Column */}
        <div style={{ background: 'white', padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '32px', boxShadow: '0 24px 56px rgba(233,163,163,0.12)', position: 'relative', overflow: 'hidden' }}>
          <Sparkles size={100} style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.04, color: 'var(--primary)' }} />

          <form 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} 
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              const formData = new FormData(e.target);
              const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
              };
              const result = await submitInquiry(data);
              if (result.success) e.target.reset();
              setIsSubmitting(false);
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Name</label>
                <input name="name" type="text" placeholder="Dreamer Name" required style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', outline: 'none', fontSize: '0.82rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Email</label>
                <input name="email" type="email" placeholder="fairy@dust.com" required style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', outline: 'none', fontSize: '0.82rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Mobile Number</label>
                <input name="phone" type="tel" placeholder="+91 00000 00000" required style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', outline: 'none', fontSize: '0.82rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Subject</label>
              <select name="subject" required style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', outline: 'none', fontSize: '0.82rem', appearance: 'none' }}>
                <option value="Custom Bridal Inquiry">Custom Bridal Inquiry</option>
                <option value="Catalog Order">Catalog Order</option>
                <option value="Measurement Appointment">Measurement Appointment</option>
                <option value="Other Magic">Other Magic</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</label>
              <textarea name="message" placeholder="Tell us about your dream outfit..." required rows={4} style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', outline: 'none', resize: 'none', fontSize: '0.82rem' }} />
            </div>

            <button 
              disabled={isSubmitting}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '22px', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.7rem', 
                fontSize: '0.9rem', 
                boxShadow: '0 12px 28px rgba(233,163,163,0.3)', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                marginTop: '0.5rem',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <Send size={18} /> {isSubmitting ? 'Sending Magic...' : 'Send Magic Dust'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
