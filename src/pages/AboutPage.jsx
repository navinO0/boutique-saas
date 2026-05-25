import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Award, Users, Star, Scissors, Gem, Feather } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] } })
};

const AboutPage = () => {
  const { siteConfig } = useShop();

  const values = [
    { icon: Scissors, title: 'Artisan Craft', desc: 'Every stitch is placed with intention. We believe clothing is a form of poetry, and we write it with thread and fabric.' },
    { icon: Gem, title: 'Heirloom Quality', desc: 'We source only the finest fabrics — silks from Kanchipuram, brocades from Varanasi — so your garment tells a rich story.' },
    { icon: Feather, title: 'Mindful Creation', desc: 'From zero-waste pattern cutting to ethically sourced materials, sustainability is woven into every piece we create.' },
    { icon: Heart, title: 'Worn with Love', desc: 'We design for real moments — weddings, anniversaries, everyday magic. Each piece is made to be cherished, not just worn.' },
  ];

  const milestones = [
    { year: '2018', event: 'Founded in a small studio in Chennai with a single sewing machine and infinite dreams.' },
    { year: '2020', event: 'Launched our first bridal collection, dressing 50+ brides across South India.' },
    { year: '2022', event: 'Opened our flagship atelier in the heart of the city, welcoming clients from across India.' },
    { year: '2024', event: 'Featured in Vogue India and ELLE for our signature "Heritage Meets Future" aesthetic.' },
    { year: '2026', event: 'Launched our digital storefront, bringing bespoke couture to dreamers everywhere.' },
  ];

  const stats = [
    { number: '2000+', label: 'Pieces Crafted' },
    { number: '500+', label: 'Happy Brides' },
    { number: '8', label: 'Years of Artistry' },
    { number: '100%', label: 'Made with Love' },
  ];

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: 'var(--secondary)', minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: 'clamp(6rem, 12vw, 10rem) 0 clamp(4rem, 8vw, 7rem)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, fontSize: '22vw', fontWeight: 900, color: 'white', fontFamily: 'Playfair Display', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          STORY
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '1.5rem' }}>
              Our Story
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontFamily: 'Playfair Display', color: 'white', lineHeight: 0.92, marginBottom: 'clamp(1.5rem, 4vw, 3rem)', letterSpacing: '-2px' }}>
              Dressed in <br />
              <span style={{ color: 'var(--primary)' }}>Heritage.</span>
            </h1>
            <p style={{ fontSize: 'clamp(0.88rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.65)', maxWidth: '540px', lineHeight: 1.9, marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
              {siteConfig.name} was born from a single belief — that every woman deserves to feel like the protagonist of her own story. We don't just make clothes. We craft moments.
            </p>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'var(--primary)', color: 'white', padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1.5rem, 3vw, 2.5rem)', borderRadius: '28px', fontWeight: 700, fontSize: 'clamp(0.8rem, 1.8vw, 0.92rem)', textDecoration: 'none', letterSpacing: '0.5px' }}>
              Explore the Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--accent)', padding: 'clamp(2.5rem, 6vw, 5rem) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
                <p style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--primary)', fontFamily: 'Playfair Display', lineHeight: 1 }}>{s.number}</p>
                <p style={{ fontSize: 'clamp(0.68rem, 1.5vw, 0.8rem)', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '3px', marginTop: '0.5rem', opacity: 0.7 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section style={{ padding: 'clamp(4rem, 10vw, 9rem) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(3rem, 6vw, 7rem)', alignItems: 'center' }}>
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ position: 'relative' }}>
              <div style={{ height: 'clamp(340px, 55vw, 580px)', borderRadius: 'clamp(24px, 4vw, 48px)', overflow: 'hidden', background: 'var(--accent)' }}>
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                  alt="Founder at the atelier"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'absolute', bottom: '-1.5rem', right: '-1.5rem', background: 'var(--primary)', color: 'white', padding: '1.2rem 1.8rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(233,163,163,0.4)', backdropFilter: 'blur(10px)' }}>
                <p style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 900, lineHeight: 1.2 }}>Est. 2018</p>
                <p style={{ fontSize: '0.68rem', opacity: 0.85, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '0.3rem' }}>Chennai, India</p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '5px', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', marginBottom: '1.2rem' }}>The Founder</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                A Passion Stitched <br /> into Every Thread
              </h2>
              <p style={{ color: '#777', lineHeight: 1.95, fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)', marginBottom: '1.2rem' }}>
                I grew up watching my grandmother drape a saree like it was a love letter to the world. Every pleat, every fold, a word. That image never left me. At 24, I quit my corporate job and came back to that memory — with scissors, silk, and a studio the size of a broom closet.
              </p>
              <p style={{ color: '#777', lineHeight: 1.95, fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)', marginBottom: '2rem' }}>
                Today, {siteConfig.name} is the culmination of that dream — a space where ancient craftsmanship meets modern silhouettes, and where every garment is a collaboration between our hands and your soul.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Playfair Display', fontWeight: 900, color: 'var(--secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>Priya {siteConfig.name.split(' ')[0]}</p>
                  <p style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Founder & Creative Director</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--secondary)', padding: 'clamp(4rem, 10vw, 9rem) 0' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 6rem)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', marginBottom: '1rem' }}>What We Stand For</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Playfair Display', color: 'white', lineHeight: 1.05 }}>Our Core Values</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'clamp(1rem, 2.5vw, 2rem)' }}>
            {values.map((v, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'clamp(18px, 3vw, 28px)', padding: 'clamp(1.5rem, 3vw, 2.5rem)', backdropFilter: 'blur(10px)' }}
              >
                <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <v.icon size={22} color="white" />
                </div>
                <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontFamily: 'Playfair Display', color: 'white', marginBottom: '0.8rem' }}>{v.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: 'clamp(0.78rem, 1.6vw, 0.88rem)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: 'clamp(4rem, 10vw, 9rem) 0', background: 'white' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 6rem)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', marginBottom: '1rem' }}>Our Journey</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', lineHeight: 1.05 }}>Chapter by Chapter</h2>
          </motion.div>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 3rem)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 'clamp(32px, 5vw, 44px)', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--primary), transparent)', opacity: 0.2 }} />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)', alignItems: 'flex-start', position: 'relative' }}
              >
                <div style={{ flexShrink: 0, width: 'clamp(64px, 10vw, 88px)', height: 'clamp(64px, 10vw, 88px)', background: i === milestones.length - 1 ? 'var(--primary)' : 'var(--accent)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px solid ${i === milestones.length - 1 ? 'var(--primary)' : '#ffe4e1'}` }}>
                  <span style={{ fontSize: 'clamp(0.68rem, 1.5vw, 0.8rem)', fontWeight: 900, color: i === milestones.length - 1 ? 'white' : 'var(--primary)', lineHeight: 1 }}>{m.year}</span>
                </div>
                <div style={{ paddingTop: 'clamp(0.8rem, 2vw, 1.4rem)', flex: 1 }}>
                  <p style={{ color: '#555', lineHeight: 1.8, fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)' }}>{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: 'clamp(4rem, 10vw, 8rem) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Playfair Display', color: 'var(--secondary)', marginBottom: '1rem', lineHeight: 1.1 }}>
              Begin Your Story
            </h2>
            <p style={{ color: '#888', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.9, fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)' }}>
              Every great story starts with a single stitch. Let us craft yours — bespoke, breathtaking, and utterly you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/products" style={{ padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1.5rem, 3vw, 2.5rem)', background: 'var(--secondary)', color: 'white', borderRadius: '28px', fontWeight: 700, fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                Shop Collection <ArrowRight size={16} />
              </Link>
              <Link to="/contact" style={{ padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1.5rem, 3vw, 2.5rem)', background: 'transparent', color: 'var(--secondary)', border: '1.5px solid var(--secondary)', borderRadius: '28px', fontWeight: 700, fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
