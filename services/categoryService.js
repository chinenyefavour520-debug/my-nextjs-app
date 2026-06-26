// boutique-frontend/services/categoryService.js
// Category API calls

import apiClient from '@/lib/api';
import API from '@/lib/endpoints';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(API.CATEGORY.ALL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get categories with product counts
export const getCategoriesWithProducts = async () => {
  try {
    const response = await apiClient.get(API.CATEGORY.WITH_PRODUCTS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get subcategories for a category
export const getSubcategories = async (categoryId) => {
  try {
    const response = await apiClient.get(`${API.CATEGORY.SUBCATEGORIES}?category_id=${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
