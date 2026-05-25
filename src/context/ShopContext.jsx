import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { BOUTIQUE_CONFIG } from '../data/config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [siteConfig, setSiteConfig] = useState(BOUTIQUE_CONFIG);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [toast, setToast] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCatalog();
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/config`, { headers: getHeaders() });
      if (resp.data && Object.keys(resp.data).length > 0) {
        setSiteConfig(prev => ({ ...prev, ...resp.data }));
      }
    } catch (error) {
      console.error('Error fetching site config:', error);
    }
  };

  const updateSiteConfig = async (newConfig) => {
    try {
      const resp = await axios.patch(`${API_BASE_URL}/company/config`, newConfig, { headers: getHeaders() });
      setSiteConfig(prev => ({ ...prev, ...resp.data }));
      showToast('Boutique settings updated! ✨');
    } catch (error) {
      showToast('Failed to update boutique settings 🪄');
    }
  };

  const getHeaders = () => {
    const headers = { 'X-Company-ID': siteConfig.companyId || 1 };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { 
        params,
        headers: getHeaders()
      });
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/products`, data, { headers: getHeaders() });
      showToast('Product added successfully! ✨');
      fetchProducts();
    } catch (error) {
      showToast('Failed to add product 🪄');
    }
  };

  const updateProduct = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/products/${data.id}`, data, { headers: getHeaders() });
      showToast('Product updated! ✨');
      fetchProducts();
    } catch (error) {
      showToast('Update failed 🪄');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this masterpiece? 🎀')) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getHeaders() });
      showToast('Product removed 🪄');
      fetchProducts();
    } catch (error) {
      showToast('Delete failed 🪄');
    }
  };

  const fetchCatalog = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/catalog`, { headers: getHeaders() });
      setCatalog(resp.data);
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  };

  const addCatalogItem = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/catalog`, data, { headers: getHeaders() });
      showToast('Gallery item added! ✨');
      fetchCatalog();
    } catch (error) {
      showToast('Failed to add gallery item 🪄');
    }
  };

  const updateCatalogItem = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/catalog/${data.id}`, data, { headers: getHeaders() });
      showToast('Gallery item updated! ✨');
      fetchCatalog();
    } catch (error) {
      showToast('Update failed 🪄');
    }
  };

  const deleteCatalogItem = async (id) => {
    if (!window.confirm('Remove from gallery? 🎀')) return;
    try {
      await axios.delete(`${API_BASE_URL}/catalog/${id}`, { headers: getHeaders() });
      showToast('Gallery item removed 🪄');
      fetchCatalog();
    } catch (error) {
      showToast('Delete failed 🪄');
    }
  };

  const loginUser = async (email, password) => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, token } = resp.data;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      showToast(`Welcome back, ${user.name}! ✨`);
      return { success: true };
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed 🪄');
      return { success: false };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showToast('Magical exit... see you soon! ☁️');
  };

  const addToCart = (product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && 
           item.selectedSize === product.selectedSize && 
           item.selectedColor === product.selectedColor) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`"${product.name}" added to bag! ✨`);
  };

  const removeFromCart = (id, selectedSize, selectedColor) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
    showToast('Item removed 🪄');
  };

  const updateQuantity = (id, delta, selectedSize, selectedColor) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const placeOrder = async () => {
    if (!currentUser) return { success: false, message: 'Please login to checkout' };
    try {
      const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
      await axios.post(`${API_BASE_URL}/orders`, 
        { items: cart, total },
        { headers: getHeaders() }
      );
      setCart([]);
      showToast('Order placed! Magic is on its way. 🪄');
      return { success: true };
    } catch (error) {
      showToast('Order failed... 🪄');
      return { success: false };
    }
  };

  return (
    <ShopContext.Provider value={{ 
      products, catalog, isLoading, pagination, fetchProducts,
      addProduct, updateProduct, deleteProduct,
      addCatalogItem, updateCatalogItem, deleteCatalogItem,
      cart, wishlist, addToCart, removeFromCart, updateQuantity, loginUser, logoutUser, currentUser,
      placeOrder, siteConfig, updateSiteConfig, toast, showToast, 
      allOrders, appointments,
      isAdminLoggedIn: currentUser?.role === 'admin'
    }}>
      {children}
    </ShopContext.Provider>
  );
};
