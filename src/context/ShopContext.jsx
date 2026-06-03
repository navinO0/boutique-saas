import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('guestCart')) || []);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);
  const [siteConfig, setSiteConfig] = useState(BOUTIQUE_CONFIG);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [toast, setToast] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userAddresses, setUserAddresses] = useState(JSON.parse(localStorage.getItem('addresses')) || []);
  const [error, setError] = useState(null);

  // --- PERFORMANCE: API CACHE ---
  const apiCache = useRef({});
  const CACHE_TTL = 5 * 60 * 1000; // 5 minute TTL

  const getCachedData = useCallback((key) => {
    const cached = apiCache.current[key];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key, data) => {
    apiCache.current[key] = { data, timestamp: Date.now() };
  }, []);

  const getHeaders = useCallback(() => {
    const headers = { 'X-Company-ID': siteConfig.companyId || 1 };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [siteConfig.companyId, token]);

  const showToast = useCallback((message) => {
    setToast(message);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchSiteConfig = useCallback(async () => {
    const cached = getCachedData('site_config');
    if (cached) {
      setSiteConfig(prev => ({ ...prev, ...cached }));
      return;
    }
    try {
      const resp = await axios.get(`${API_BASE_URL}/company/config`, { headers: getHeaders() });
      if (resp.data && Object.keys(resp.data).length > 0) {
        setSiteConfig(prev => ({ ...prev, ...resp.data }));
        setCachedData('site_config', resp.data);
      }
    } catch (err) {
      console.error('Error fetching site config:', err);
    }
  }, [getHeaders, getCachedData, setCachedData]);

  useEffect(() => {
    fetchSiteConfig();
  }, [fetchSiteConfig]);

  const updateSiteConfig = async (newConfig) => {
    try {
      const resp = await axios.patch(`${API_BASE_URL}/company/config`, newConfig, { headers: getHeaders() });
      setSiteConfig(prev => ({ ...prev, ...resp.data }));
      setCachedData('site_config', resp.data);
      showToast('Boutique settings updated! ');
    } catch (err) {
      showToast('Failed to update boutique settings ');
    }
  };

  const fetchIconProducts = useCallback(async () => {
    const cached = getCachedData('featured_icons');
    if (cached) {
      setIconProducts(cached);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/icons`, { headers: getHeaders() });
      setIconProducts(response.data);
      setCachedData('featured_icons', response.data);
    } catch (err) {
      console.error('Error fetching icon products:', err);
      setError('Could not retrieve featured items. ');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, getCachedData, setCachedData]);

  const fetchProducts = useCallback(async (params = {}) => {
    const cacheKey = `products_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      setProducts(cached.products);
      setPagination(cached.pagination);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params, headers: getHeaders() });
      setProducts(response.data.products);
      const paginationData = {
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      };
      setPagination(paginationData);
      setCachedData(cacheKey, { products: response.data.products, pagination: paginationData });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('The collection is currently resting. ');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, getCachedData, setCachedData]);

  const fetchAdminProducts = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { 
        params: { ...params, view: 'all' }, 
        headers: getHeaders() 
      });
      setAdminProducts(response.data.products);
      setAdminPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      console.error('Error fetching admin products:', err);
      showToast('Inventory fetch failed ');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, showToast]);

  const addProduct = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/products`, data, { headers: getHeaders() });
      showToast('Product added successfully! ');
      fetchAdminProducts();
    } catch (err) {
      showToast('Failed to add product ');
    }
  };

  const updateProduct = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/products/${data.id}`, data, { headers: getHeaders() });
      showToast('Product updated! ');
      fetchAdminProducts();
    } catch (err) {
      showToast('Update failed ');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this masterpiece? ')) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getHeaders() });
      showToast('Product removed ');
      fetchAdminProducts();
    } catch (err) {
      showToast('Delete failed ');
    }
  };

  const fetchCatalog = useCallback(async () => {
    const cached = getCachedData('catalog_all');
    if (cached) {
      setCatalog(cached);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resp = await axios.get(`${API_BASE_URL}/catalog`, { headers: getHeaders() });
      setCatalog(resp.data);
      setCachedData('catalog_all', resp.data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
      setError('Atelier stories are temporarily paused. ');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, getCachedData, setCachedData]);

  const addCatalogItem = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/catalog`, data, { headers: getHeaders() });
      showToast('Gallery item added! ');
      fetchCatalog();
    } catch (err) {
      showToast('Failed to add gallery item ');
    }
  };

  const updateCatalogItem = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/catalog/${data.id}`, data, { headers: getHeaders() });
      showToast('Gallery item updated! ');
      fetchCatalog();
    } catch (err) {
      showToast('Update failed ');
    }
  };

  const deleteCatalogItem = async (id) => {
    if (!window.confirm('Remove from gallery? ')) return;
    try {
      await axios.delete(`${API_BASE_URL}/catalog/${id}`, { headers: getHeaders() });
      showToast('Gallery item removed ');
      fetchCatalog();
    } catch (err) {
      showToast('Delete failed ');
    }
  };

  const registerUser = async (userData) => {
    setIsLoading(true);
    const guestCartSnapshot = [...cart];
    try {
      const resp = await axios.post(`${API_BASE_URL}/auth/register`, { 
        ...userData, 
        companyId: siteConfig.companyId || 1 
      });
      const { user, token: newToken } = resp.data;
      setCurrentUser(user);
      setToken(newToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', newToken);

      // Persist guest cart for new users
      if (guestCartSnapshot.length > 0) {
        const authHeaders = {
          'X-Company-ID': siteConfig.companyId || 1,
          Authorization: `Bearer ${newToken}`,
        };
        try {
          await axios.post(
            `${API_BASE_URL}/cart/sync`,
            { items: guestCartSnapshot },
            { headers: authHeaders }
          );
        } catch (_) {}
        localStorage.removeItem('guestCart');
      }

      showToast(`Welcome to the atelier, ${user.name}! `);
      return { success: true };
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed ');
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setIsLoading(true);
    // Snapshot the guest cart BEFORE we touch anything
    const guestCartSnapshot = [...cart];
    try {
      const resp = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, token: newToken } = resp.data;
      setCurrentUser(user);
      setToken(newToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', newToken);

      // Merge guest cart with DB cart
      const authHeaders = {
        'X-Company-ID': siteConfig.companyId || 1,
        Authorization: `Bearer ${newToken}`,
      };

      let dbCart = [];
      try {
        const cartResp = await axios.get(`${API_BASE_URL}/cart`, { headers: authHeaders });
        dbCart = cartResp.data || [];
      } catch (_) {
        // If fetch fails, start from DB-empty state
      }

      if (guestCartSnapshot.length > 0) {
        // Merge: DB items take priority; guest-only items are appended
        const mergedMap = new Map();
        dbCart.forEach(item => {
          const key = `${item.id}_${item.selectedSize}_${item.selectedColor}`;
          mergedMap.set(key, item);
        });
        guestCartSnapshot.forEach(item => {
          const key = `${item.id}_${item.selectedSize}_${item.selectedColor}`;
          if (!mergedMap.has(key)) {
            mergedMap.set(key, item);
          } else {
            // Combine quantities if item exists in both
            const existing = mergedMap.get(key);
            mergedMap.set(key, { ...existing, quantity: existing.quantity + item.quantity });
          }
        });
        const mergedCart = Array.from(mergedMap.values());
        setCart(mergedCart);

        // Persist the merged cart to the server
        try {
          await axios.post(
            `${API_BASE_URL}/cart/sync`,
            { items: mergedCart },
            { headers: authHeaders }
          );
        } catch (_) {}
      } else {
        setCart(dbCart);
      }

      // Clear guest cart from localStorage after merge
      localStorage.removeItem('guestCart');
      showToast(`Welcome back, ${user.name}! `);
      return { success: true };
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed ');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const resp = await axios.patch(`${API_BASE_URL}/auth/profile`, profileData, { headers: getHeaders() });
      const updatedUser = resp.data.user;
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully! ');
      return { success: true };
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed ');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/cart`, { headers: getHeaders() });
      setCart(resp.data);
    } catch (err) {
      console.error('Error fetching cart');
    }
  }, [getHeaders]);

  const syncCart = useCallback(async (cartItems) => {
    if (!currentUser) return;
    try {
      await axios.post(`${API_BASE_URL}/cart/sync`, { items: cartItems }, { headers: getHeaders() });
    } catch (err) {
      console.error('Error syncing cart');
    }
  }, [currentUser, getHeaders]);

  // Persist guest cart to localStorage so it survives page reloads
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // Debounced server sync — only for logged-in users, skip on first mount
  const isMounted = useRef(false);
  useEffect(() => {
    if (!currentUser) return;
    if (!isMounted.current) {
      isMounted.current = true;
      return; // skip the initial fire (login handler already synced)
    }
    const timer = setTimeout(() => {
      syncCart(cart);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cart, currentUser, syncCart]);

  // Reset mount flag when user logs out
  useEffect(() => {
    if (!currentUser) {
      isMounted.current = false;
    }
  }, [currentUser]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    setToken('');
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('guestCart');
    showToast('Magical exit... see you soon! ');
  }, [showToast]);

  const addToCart = useCallback((product) => {
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
  }, [showToast]);

  const removeFromCart = useCallback((id, selectedSize, selectedColor) => {
    setCart(prev => prev.filter(item =>
      !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
    showToast('Item removed ');
  }, [showToast]);

  const updateQuantity = useCallback((id, delta, selectedSize, selectedColor) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

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
    } catch (err) {
      showToast('Submission failed... ');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllOrders = useCallback(async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/admin/orders`, { headers: getHeaders() });
      setAllOrders(resp.data);
    } catch (err) {
      console.error('Error fetching all orders');
    }
  }, [getHeaders]);

  const fetchMyOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${API_BASE_URL}/orders/my`, { headers: getHeaders() });
      setMyOrders(resp.data);
    } catch (err) {
      console.error('Error fetching my orders');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const approveOrder = async (orderId) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/orders/${orderId}/approve`, {}, { headers: getHeaders() });
      showToast('Order confirmed! ');
      fetchAllOrders();
    } catch (err) {
      showToast('Approval failed ');
    }
  };

  const fetchWishlist = useCallback(async () => {
    if (!currentUser) return;
    try {
      const resp = await axios.get(`${API_BASE_URL}/wishlist`, { headers: getHeaders() });
      setWishlist(resp.data);
    } catch (err) {
      console.error('Error fetching wishlist');
    }
  }, [getHeaders, currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    }
  }, [currentUser, fetchWishlist]);

  // Persist to localStorage for guests and backup for users
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback(async (id) => {
    // Optimistic UI update
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    if (!currentUser) {
      showToast('Login to save your dreams forever ✨');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/wishlist/toggle`, { productId: id }, { headers: getHeaders() });
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      // Revert on failure
      setWishlist(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  }, [getHeaders, currentUser, showToast]);

  const addAddress = useCallback((address) => {
    const newAddresses = [...userAddresses, { ...address, id: Date.now() }];
    setUserAddresses(newAddresses);
    localStorage.setItem('addresses', JSON.stringify(newAddresses));
    showToast('Address added! ');
  }, [showToast, userAddresses]);

  const clearError = useCallback(() => setError(null), []);

  const submitInquiry = useCallback(async (inquiryData) => {
    try {
      await axios.post(`${API_BASE_URL}/inquiries`, inquiryData, { headers: getHeaders() });
      showToast('Magic Dust Sent! We\'ll be in touch soon. ');
      return { success: true };
    } catch (err) {
      showToast('Failed to send magic dust. Try again. ');
      return { success: false };
    }
  }, [getHeaders, showToast]);

  const fetchInquiries = useCallback(async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/inquiries/admin`, { headers: getHeaders() });
      return resp.data;
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      return [];
    }
  }, [getHeaders]);

  const updateInquiryStatus = useCallback(async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/inquiries/admin/${id}/status`, { status }, { headers: getHeaders() });
      showToast(`Inquiry marked as ${status} `);
    } catch (err) {
      showToast('Failed to update inquiry status ');
    }
  }, [getHeaders, showToast]);

  const value = useMemo(() => ({
    products, adminProducts, iconProducts, catalog, isLoading, error, clearError, 
    pagination, adminPagination, fetchProducts, fetchAdminProducts, fetchIconProducts, fetchCatalog,
    addProduct, updateProduct, deleteProduct,
    addCatalogItem, updateCatalogItem, deleteCatalogItem,
    cart, wishlist, toggleWishlist, addToCart, removeFromCart, updateQuantity, loginUser, logoutUser, registerUser, updateUserProfile, currentUser,
    placeOrder, siteConfig, updateSiteConfig, toast, showToast,
    allOrders, myOrders, appointments, fetchAllOrders, fetchMyOrders, approveOrder,
    userAddresses, addAddress,
    submitInquiry, fetchInquiries, updateInquiryStatus,
    getHeaders,
    isAdminLoggedIn: currentUser?.role === 'admin'
  }), [
    products, adminProducts, iconProducts, catalog, isLoading, error, clearError, pagination, adminPagination,
    fetchProducts, fetchAdminProducts, fetchIconProducts, fetchCatalog, addProduct, updateProduct, deleteProduct,
    addCatalogItem, updateCatalogItem, deleteCatalogItem, cart, wishlist, toggleWishlist, addToCart, 
    removeFromCart, updateQuantity, loginUser, logoutUser, registerUser, updateUserProfile, currentUser, placeOrder, 
    siteConfig, updateSiteConfig, toast, showToast, allOrders, myOrders, appointments, fetchAllOrders, 
    fetchMyOrders, approveOrder, userAddresses, addAddress, submitInquiry, fetchInquiries, updateInquiryStatus,
    getHeaders
  ]);

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
