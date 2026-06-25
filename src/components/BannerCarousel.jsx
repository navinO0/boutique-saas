import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

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
        navigation={{
            nextEl: '.banner-next',
            prevEl: '.banner-prev',
        }}
        className="banner-swiper"
        style={{ 
            width: '100%',
            height: typeof window !== 'undefined' && window.innerWidth < 768 ? '75vh' : 'auto',
            aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : '21 / 9',
            borderRadius: fullWidth ? '0' : '24px', 
            background: '#000'
        }}
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i} onClick={() => banner.link && (banner.link.startsWith('http') ? window.open(banner.link, '_blank') : navigate(banner.link))}>
            {/* Same slide content */}
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: banner.link ? 'pointer' : 'default' }}>
              <picture>
                <source media="(max-width: 767px)" srcSet={resolveImageUrl(banner.mobileImage || banner.image)} />
                <source media="(max-width: 1024px)" srcSet={resolveImageUrl(banner.tabletImage || banner.image)} />
                <img
                  src={resolveImageUrl(banner.desktopImage || banner.image)}
                  alt={banner.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </picture>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%), linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 20%)', 
                pointerEvents: 'none' 
              }} />
              
              <div className="banner-content" style={{ 
                position: 'absolute', 
                bottom: '15%', 
                left: '6.5%', 
                color: 'white', 
                zIndex: 5,
                display: 'flex',
                gap: '2rem',
                padding: '0',
                background: 'transparent',
                backdropFilter: 'none',
                border: 'none'
              }}>
                <div style={{ width: '2px', background: 'var(--primary)', height: '120px', alignSelf: 'center', opacity: 0.8 }} className="desktop-only" />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    style={{ 
                      color: 'var(--primary)', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px', 
                      fontSize: '0.62rem', 
                      fontFamily: 'Outfit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Sparkles size={14} /> {banner.subtitle || 'Haute Couture'}
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    style={{ 
                      fontSize: 'clamp(1.8rem, 5vw, 4rem)', 
                      fontFamily: 'Playfair Display', 
                      marginBottom: '1rem', 
                      lineHeight: 0.95, 
                      color: 'white', 
                      letterSpacing: '-1.5px',
                      textShadow: '0 10px 20px rgba(0,0,0,0.5)',
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
                        padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.8rem 1.8rem' : '1.1rem 2.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.75rem' : '0.85rem',
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

      {/* Custom Premium Arrows */}
      {banners.length > 1 && (
        <div className="desktop-only">
          <motion.button 
            whileHover={{ scale: 1.1, background: 'var(--primary)' }}
            whileTap={{ scale: 0.9 }}
            className="banner-prev banner-nav-btn" 
            style={{ left: '2rem' }}
          >
            <ChevronLeft size={28} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, background: 'var(--primary)' }}
            whileTap={{ scale: 0.9 }}
            className="banner-next banner-nav-btn" 
            style={{ right: '2rem' }}
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>
      )}

      <style>{`
        .banner-bullet {
            width: 7px;
            height: 7px;
            background: rgba(255,255,255,0.35);
            border-radius: 50%;
            display: inline-block;
            margin: 0 4px !important;
            cursor: pointer;
            transition: 0.4s;
        }
        .banner-bullet-active {
            width: 20px;
            border-radius: 4px;
            background: var(--primary) !important;
        }
        .banner-swiper .swiper-pagination {
            bottom: 1.5rem !important;
            right: 2.5rem !important;
            width: auto !important;
            left: auto !important;
            display: flex;
            align-items: center;
        }
        .banner-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            width: 65px;
            height: 65px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .banner-nav-btn:hover {
            border-color: var(--primary);
            box-shadow: 0 0 30px rgba(233,163,163,0.4);
        }
        @media (max-width: 768px) {
            .banner-swiper .swiper-pagination { right: 50% !important; transform: translateX(50%); bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default BannerCarousel;

