import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { BOUTIQUE_CONFIG } from '../data/config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
 const [products, setProducts] = useState([]);
 const [adminProducts, setAdminProducts] = useState([]);
 const [iconProducts, setIconProducts] = useState([]);
 const [catalog, setCatalog] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
 const [adminPagination, setAdminPagination] = useState({ currentPage: 1, totalPages: 1 });
 const [cart, setCart] = useState([]);
 const [wishlist, setWishlist] = useState([]);
 const [siteConfig, setSiteConfig] = useState(BOUTIQUE_CONFIG);
 const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
 const [token, setToken] = useState(localStorage.getItem('token') || '');
 const [toast, setToast] = useState(null);
 const [allOrders, setAllOrders] = useState([]);
 const [myOrders, setMyOrders] = useState([]);
 const [appointments, setAppointments] = useState([]);
 const [userAddresses, setUserAddresses] = useState(JSON.parse(localStorage.getItem('addresses')) || []);

 useEffect(() => {
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
   showToast('Boutique settings updated! ');
  } catch (error) {
   showToast('Failed to update boutique settings ');
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

 const fetchIconProducts = async () => {
  setIsLoading(true);
  setError(null);
  try {
   const response = await axios.get(`${API_BASE_URL}/products/icons`, {
    headers: getHeaders()
   });
   setIconProducts(response.data);
  } catch (error) {
   console.error('Error fetching icon products:', error);
   setError('Could not retrieve featured items. ');
  } finally {
   setIsLoading(false);
  }
 };

 const fetchProducts = async (params = {}) => {
  setIsLoading(true);
  setError(null);
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
   setError('The collection is currently resting. ');
  } finally {
   setIsLoading(false);
  }
 };

 const fetchAdminProducts = async (params = {}) => {
  setIsLoading(true);
  try {
   const response = await axios.get(`${API_BASE_URL}/products`, {
    params,
    headers: getHeaders()
   });
   setAdminProducts(response.data.products);
   setAdminPagination({
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages
   });
  } catch (error) {
   console.error('Error fetching admin products:', error);
   showToast('Inventory fetch failed ');
  } finally {
   setIsLoading(false);
  }
 };

 const addProduct = async (data) => {
  try {
   await axios.post(`${API_BASE_URL}/products`, data, { headers: getHeaders() });
   showToast('Product added successfully! ');
   fetchAdminProducts();
  } catch (error) {
   showToast('Failed to add product ');
  }
 };

 const updateProduct = async (data) => {
  try {
   await axios.put(`${API_BASE_URL}/products/${data.id}`, data, { headers: getHeaders() });
   showToast('Product updated! ');
   fetchAdminProducts();
  } catch (error) {
   showToast('Update failed ');
  }
 };

 const deleteProduct = async (id) => {
  if (!window.confirm('Delete this masterpiece? ')) return;
  try {
   await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getHeaders() });
   showToast('Product removed ');
   fetchAdminProducts();
  } catch (error) {
   showToast('Delete failed ');
  }
 };

 const fetchCatalog = async () => {
  setIsLoading(true);
  setError(null);
  try {
   const resp = await axios.get(`${API_BASE_URL}/catalog`, { headers: getHeaders() });
   setCatalog(resp.data);
  } catch (error) {
   console.error('Error fetching catalog:', error);
   setError('Atelier stories are temporarily paused. ');
  } finally {
   setIsLoading(false);
  }
 };

 const addCatalogItem = async (data) => {
  try {
   await axios.post(`${API_BASE_URL}/catalog`, data, { headers: getHeaders() });
   showToast('Gallery item added! ');
   fetchCatalog();
  } catch (error) {
   showToast('Failed to add gallery item ');
  }
 };

 const updateCatalogItem = async (data) => {
  try {
   await axios.put(`${API_BASE_URL}/catalog/${data.id}`, data, { headers: getHeaders() });
   showToast('Gallery item updated! ');
   fetchCatalog();
  } catch (error) {
   showToast('Update failed ');
  }
 };

 const deleteCatalogItem = async (id) => {
  if (!window.confirm('Remove from gallery? ')) return;
  try {
   await axios.delete(`${API_BASE_URL}/catalog/${id}`, { headers: getHeaders() });
   showToast('Gallery item removed ');
   fetchCatalog();
  } catch (error) {
   showToast('Delete failed ');
  }
 };

 const registerUser = async (userData) => {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${API_BASE_URL}/auth/register`, { 
        ...userData, 
        companyId: siteConfig.companyId || 1 
      });
      const { user, token } = resp.data;
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      showToast(`Welcome to the atelier, ${user.name}! `);
      return { success: true };
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed ');
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

 const loginUser = async (email, password) => {
  setIsLoading(true);
  try {
   const resp = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
   const { user, token } = resp.data;
   setCurrentUser(user);
   setToken(token);
   localStorage.setItem('user', JSON.stringify(user));
   localStorage.setItem('token', token);
   showToast(`Welcome back, ${user.name}! `);
   return { success: true };
  } catch (error) {
   showToast(error.response?.data?.message || 'Login failed ');
   return { success: false };
  } finally {
   setIsLoading(false);
  }
 };

  const fetchCart = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/cart`, { headers: getHeaders() });
      setCart(resp.data);
    } catch (error) {
      console.error('Error fetching cart');
    }
  };

  const syncCart = async (cartItems) => {
    if (!currentUser) return;
    try {
      await axios.post(`${API_BASE_URL}/cart/sync`, { items: cartItems }, { headers: getHeaders() });
    } catch (error) {
      console.error('Error syncing cart');
    }
  };

  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        syncCart(cart);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  const logoutUser = () => {
    setCurrentUser(null);
    setToken('');
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showToast('Magical exit... see you soon! ');
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
  showToast(`"${product.name}" added to bag! `);
 };

 const removeFromCart = (id, selectedSize, selectedColor) => {
  setCart(prev => prev.filter(item =>
   !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
  ));
  showToast('Item removed ');
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

 const placeOrder = async (orderDetails) => {
  if (!currentUser) return { success: false, message: 'Please login to checkout' };
  setIsLoading(true);
  try {
   const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
   const resp = await axios.post(`${API_BASE_URL}/orders`,
    { 
      items: cart, 
      total,
      address: orderDetails.address,
      transactionId: orderDetails.transactionId,
      paymentMethod: 'UPI_QR'
    },
    { headers: getHeaders() }
   );
   setCart([]);
   showToast('Payment submitted! Magic is being verified. ');
   return { success: true, orderId: resp.data.id };
  } catch (error) {
   showToast('Submission failed... ');
   return { success: false };
  } finally {
   setIsLoading(false);
  }
 };

 const fetchAllOrders = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/admin/orders`, { headers: getHeaders() });
      setAllOrders(resp.data);
    } catch (error) {
      console.error('Error fetching all orders');
    }
  };

  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${API_BASE_URL}/orders/my`, { headers: getHeaders() });
      setMyOrders(resp.data);
    } catch (error) {
      console.error('Error fetching my orders');
    } finally {
      setIsLoading(false);
    }
  };

  const approveOrder = async (orderId) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/orders/${orderId}/approve`, {}, { headers: getHeaders() });
      showToast('Order confirmed! ');
      fetchAllOrders();
    } catch (error) {
      showToast('Approval failed ');
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    showToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const addAddress = (address) => {
    const newAddresses = [...userAddresses, { ...address, id: Date.now() }];
    setUserAddresses(newAddresses);
    localStorage.setItem('addresses', JSON.stringify(newAddresses));
    showToast('Address added! ');
  };

 const [error, setError] = useState(null);

 const clearError = () => setError(null);

  // --- INQUIRIES ---
  const submitInquiry = async (inquiryData) => {
    try {
      await axios.post(`${API_BASE_URL}/inquiries`, inquiryData, { headers: getHeaders() });
      showToast('Magic Dust Sent! We\'ll be in touch soon. ');
      return { success: true };
    } catch (error) {
      showToast('Failed to send magic dust. Try again. ');
      return { success: false };
    }
  };

  const fetchInquiries = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/inquiries/admin`, { headers: getHeaders() });
      return resp.data;
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      return [];
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/inquiries/admin/${id}/status`, { status }, { headers: getHeaders() });
      showToast(`Inquiry marked as ${status} `);
    } catch (error) {
      showToast('Failed to update inquiry status ');
    }
  };

 return (
  <ShopContext.Provider value={{
   products, adminProducts, iconProducts, catalog, isLoading, error, clearError, 
   pagination, adminPagination, fetchProducts, fetchAdminProducts, fetchIconProducts, fetchCatalog,
   addProduct, updateProduct, deleteProduct,
   addCatalogItem, updateCatalogItem, deleteCatalogItem,
   cart, wishlist, toggleWishlist, addToCart, removeFromCart, updateQuantity, loginUser, logoutUser, registerUser, currentUser,
   placeOrder, siteConfig, updateSiteConfig, toast, showToast,
   allOrders, myOrders, appointments, fetchAllOrders, fetchMyOrders, approveOrder,
   userAddresses, addAddress,
   submitInquiry, fetchInquiries, updateInquiryStatus,
   isAdminLoggedIn: currentUser?.role === 'admin'
  }}>
   {children}
  </ShopContext.Provider>
 );
};
