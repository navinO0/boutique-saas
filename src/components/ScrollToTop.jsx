import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Standard scroll reset
    window.scrollTo(0, 0);
    
    // Lenis smooth scroll reset
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
