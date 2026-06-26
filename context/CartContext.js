// boutique-frontend/context/CartContext.js
// Manages shopping cart state

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import API from '@/lib/endpoints';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setItemCount(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API.CART.VIEW);

      if (response.data.success) {
        setCart(response.data.data);
        setItemCount(response.data.data.item_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, variantId = null, quantity = 1) => {
    try {
      const response = await apiClient.post(API.CART.ADD, {
        product_id: productId,
        variant_id: variantId,
        quantity: quantity,
      });

      if (response.data.success) {
        setCart(response.data.data);
        setItemCount(response.data.data.item_count || 0);
        toast.success('Item added to cart');
        return { success: true };
      }

      // Backend returned success:false — show the actual message
      toast.error(response.data.message || 'Could not add item to cart');
      return { success: false, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to add item';
      console.error('addToCart error:', error.response?.status, error.response?.data || error.message);
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await apiClient.post(API.CART.UPDATE, {
        cart_item_id: cartItemId,
        quantity: quantity,
      });

      if (response.data.success) {
        setCart(response.data.data);
        setItemCount(response.data.data.item_count || 0);
        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update cart');
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const response = await apiClient.post(API.CART.REMOVE, {
        cart_item_id: cartItemId,
      });

      if (response.data.success) {
        setCart(response.data.data);
        setItemCount(response.data.data.item_count || 0);
        toast.success('Item removed');
        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to remove item');
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const response = await apiClient.post(API.CART.CLEAR);

      if (response.data.success) {
        setCart(null);
        setItemCount(0);
        toast.success('Cart cleared');
        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to clear cart');
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Get cart total
  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.subtotal || 0;
  };

  const value = {
    cart,
    loading,
    itemCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
