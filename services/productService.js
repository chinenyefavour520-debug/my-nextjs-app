// boutique-frontend/services/productService.js
// Product API calls

import apiClient from '@/lib/api';
import API from '@/lib/endpoints';

// Get products list with filters
export const getProducts = async (filters = {}, page = 1, limit = 20) => {
  try {
    // Remove undefined/null/empty values so they don't get serialized as "undefined"
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    const params = new URLSearchParams({ page, limit, ...cleanFilters });
    const response = await apiClient.get(`${API.PRODUCT.LIST}?${params}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`${API.PRODUCT.DETAILS}?slug=${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get products by category slug
export const getProductsByCategory = async (slug, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`${API.PRODUCT.BY_CATEGORY}?slug=${slug}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search products
export const searchProducts = async (query, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`${API.PRODUCT.SEARCH}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await apiClient.get(`${API.PRODUCT.LIST}?featured=true&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
