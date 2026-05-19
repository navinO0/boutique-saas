import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, BOUTIQUE_CONFIG } from '../data/config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [siteConfig, setSiteConfig] = useState(BOUTIQUE_CONFIG);
  const [appointments, setAppointments] = useState([
    { id: "APP001", customer: "Meera Nair", service: "Bridal Consultation", date: "2024-05-20", time: "10:30 AM", status: "Upcoming" },
    { id: "APP002", customer: "Saritha V", service: "Custom Stitching", date: "2024-05-21", time: "02:00 PM", status: "Upcoming" }
  ]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // User Authentication & Global Orders
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    { email: "admin@amara.com", password: "password123", name: "Boutique Admin" },
    { email: "user@example.com", password: "password123", name: "Guest User" }
  ]);
  const [allOrders, setAllOrders] = useState([
    { id: 'ORD5521', customer: 'Meera Nair', email: 'user@example.com', date: '2024-05-12', total: 12500, status: 'Delivered', items: [] },
    { id: 'ORD5689', customer: 'Guest User', email: 'user@example.com', date: '2024-05-18', total: 8900, status: 'In Progress', items: [] }
  ]);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const theme = siteConfig.themes[siteConfig.currentTheme || 'blush'];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--text', theme.text);
  }, [siteConfig]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const updateTheme = (themeId) => {
    updateSiteConfig({ currentTheme: themeId });
  };

  const addToCart = (product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`"${product.name}" added to your dream bag! ✨`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const bookAppointment = (details) => {
    const newAppt = {
      id: `APP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...details,
      status: "Upcoming",
      phone: details.phone || 'Not provided',
      productName: details.productName || 'General Consultation'
    };
    setAppointments(prev => [...prev, newAppt]);
    return { success: true, apptId: newAppt.id };
  };

  const updateSiteConfig = (newConfig) => {
    setSiteConfig(prev => ({ ...prev, ...newConfig }));
  };

  // User Auth Actions
  const registerUser = (data) => {
    if (registeredUsers.find(u => u.email === data.email)) return { success: false, message: 'Email already exists' };
    setRegisteredUsers(prev => [...prev, data]);
    setCurrentUser(data);
    return { success: true };
  };

  const loginUser = (email, password) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (email === siteConfig.admin.email) {
        setIsAdminLoggedIn(true);
      }
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
  };

  const placeOrder = () => {
    if (!currentUser) return { success: false, message: 'Please login to checkout' };
    if (cart.length === 0) return { success: false, message: 'Cart is empty' };

    const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const newOrder = {
      id: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
      customer: currentUser.name,
      email: currentUser.email,
      date: new Date().toISOString().split('T')[0],
      total: total,
      status: 'Pending',
      items: [...cart]
    };

    setAllOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return { success: true, orderId: newOrder.id };
  };

  // Admin Actions
  const updateProduct = (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addProduct = (newProd) => {
    const id = `${newProd.category}-${Date.now()}`;
    setProducts(prev => [...prev, { ...newProd, id }]);
  };

  const loginAdmin = (email, password) => {
    if (email === siteConfig.admin.email && password === siteConfig.admin.password) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminLoggedIn(false);

  const [catalog, setCatalog] = useState([
    { id: 'CAT001', name: 'Vintage Rose Bridal', category: 'Bridal', description: 'A masterpiece created for a spring wedding.', images: ['/src/assets/lehenga_bridal.png'], date: '2024-03-15' },
    { id: 'CAT002', name: 'Azure Silk Affair', category: 'Evening Wear', description: 'Custom hand-embroidery on pure silk.', images: ['/src/assets/saree_silk.png'], date: '2024-04-02' }
  ]);

  const addCatalogItem = (item) => {
    setCatalog(prev => [...prev, { ...item, id: `CAT-${Date.now()}` }]);
  };

  const updateCatalogItem = (updated) => {
    setCatalog(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCatalogItem = (id) => {
    setCatalog(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ShopContext.Provider value={{ 
      products,
      catalog,
      addCatalogItem,
      updateCatalogItem,
      deleteCatalogItem,
      cart, 
      wishlist,
      toggleWishlist,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      appointments, 
      bookAppointment,
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      updateProduct,
      deleteProduct,
      addProduct,
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      allOrders,
      placeOrder,
      siteConfig,
      updateSiteConfig,
      updateTheme,
      toast
    }}>
      {children}
    </ShopContext.Provider>
  );
};
