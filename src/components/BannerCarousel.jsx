import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerCarousel = ({ banners = [], fullWidth = false }) => {
  const navigate = useNavigate();

  if (!banners || banners.length === 0) return null;

  return (
    <div className="main-banner-wrapper" style={{ 
      width: '100%', 
      marginBottom: fullWidth ? '0' : '4rem',
      position: 'relative'
    }}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        loop={banners.length > 1}
        speed={1200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
            clickable: true,
            bulletActiveClass: 'banner-bullet-active',
            bulletClass: 'banner-bullet'
        }}
        navigation={banners.length > 1}
        className="banner-swiper"
        style={{ 
            width: '100%',
            aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '4 / 5' : '16 / 7',
            minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? '520px' : 'auto',
            borderRadius: fullWidth ? '0' : '24px', 
            background: 'var(--secondary)'
        }}
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i} onClick={() => banner.link && (banner.link.startsWith('http') ? window.open(banner.link, '_blank') : navigate(banner.link))}>
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: banner.link ? 'pointer' : 'default' }}>
              <picture>
                <source media="(max-width: 767px)" srcSet={banner.mobileImage || banner.image} />
                <source media="(max-width: 1024px)" srcSet={banner.tabletImage || banner.image} />
                <img
                  src={banner.desktopImage || banner.image}
                  alt={banner.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </picture>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)', pointerEvents: 'none' }}></div>
              
              <div className="banner-content" style={{ 
                position: 'absolute', 
                bottom: '18%', 
                left: '6.5%', 
                color: 'white', 
                zIndex: 5,
                display: 'flex',
                gap: '2.5rem'
              }}>
                <div style={{ width: '1.5px', background: 'var(--primary)', height: '150px', alignSelf: 'center', opacity: 1 }} className="desktop-only" />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    style={{ 
                      color: 'var(--primary)', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '5px', 
                      fontSize: '0.7rem', 
                      fontFamily: 'Outfit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <Sparkles size={16} /> {banner.subtitle || 'Haute Couture'}
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    style={{ 
                      fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', 
                      fontFamily: 'Playfair Display', 
                      marginBottom: '1rem', 
                      lineHeight: 0.95, 
                      color: 'white', 
                      letterSpacing: '-2px',
                      textShadow: '0 15px 35px rgba(0,0,0,0.4)',
                      fontWeight: 500,
                      fontStyle: 'italic'
                    }}
                  >
                    {banner.title}
                  </motion.h2>

                  {banner.buttonText && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="banner-cta"
                      style={{
                        padding: '1.2rem 3rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50px',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        width: 'fit-content',
                        boxShadow: '0 20px 40px rgba(233,163,163,0.3)',
                        fontFamily: 'Outfit'
                      }}
                    >
                      {banner.buttonText}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .banner-bullet {
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.4);
            border-radius: 50%;
            display: inline-block;
            margin: 0 6px !important;
            cursor: pointer;
            transition: 0.4s;
        }
        .banner-bullet-active {
            width: 35px;
            border-radius: 6px;
            background: var(--primary) !important;
        }
        .banner-swiper .swiper-pagination {
            bottom: 3rem !important;
            right: 4rem !important;
            width: auto !important;
            left: auto !important;
        }
        .banner-swiper .swiper-button-next, .banner-swiper .swiper-button-prev {
            color: white;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(15px);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            transition: 0.3s;
        }
        .banner-swiper .swiper-button-next::after, .banner-swiper .swiper-button-prev::after {
            font-size: 24px;
        }
        @media (max-width: 768px) {
            .banner-swiper .swiper-button-next, .banner-swiper .swiper-button-prev { display: none; }
            .banner-swiper .swiper-pagination { right: 50% !important; transform: translateX(50%); bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;

