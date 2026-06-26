// boutique-frontend/lib/endpoints.js
// All API endpoint paths in one place

const API = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login.php',
    REGISTER: '/api/auth/register.php',
    LOGOUT: '/api/auth/logout.php',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/users/profile.php',
    UPDATE: '/api/users/update.php',
    ORDERS: '/api/users/orders.php',
  },
  
  // Product endpoints
  PRODUCT: {
    LIST: '/api/products/list.php',
    DETAILS: '/api/products/details.php',
    BY_CATEGORY: '/api/products/by-category.php',
    SEARCH: '/api/products/search.php',
  },
  
  // Category endpoints
  CATEGORY: {
    ALL: '/api/categories/all.php',
    SUBCATEGORIES: '/api/categories/subcategories.php',
    WITH_PRODUCTS: '/api/categories/with-products.php',
  },
  
  // Cart endpoints
  CART: {
    VIEW: '/api/cart/view.php',
    ADD: '/api/cart/add.php',
    UPDATE: '/api/cart/update.php',
    REMOVE: '/api/cart/remove.php',
    CLEAR: '/api/cart/clear.php',
  },
  
  // Order endpoints
  ORDER: {
    CREATE: '/api/orders/create.php',
    MY_ORDERS: '/api/orders/my-orders.php',
    DETAILS: '/api/orders/details.php',
    CANCEL: '/api/orders/cancel.php',
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: {
      STATS: '/api/admin/dashboard/overview.php',
      RECENT_ORDERS: '/api/admin/dashboard/latest-orders.php',
    },
    USERS: {
      LIST: '/api/admin/users/list.php',
      SUSPEND: '/api/admin/users/suspend.php',
      UNSUSPEND: '/api/admin/users/unsuspend.php',
      DELETE: '/api/admin/users/delete.php',
    },
    ORDERS: {
      LIST: '/api/admin/orders/list.php',
      APPROVE: '/api/admin/orders/approve.php',
      REJECT: '/api/admin/orders/reject.php',
      MARK_SHIPPED: '/api/admin/orders/mark-shipped.php',
      MARK_DELIVERED: '/api/admin/orders/mark-delivered.php',
    },
    PRODUCTS: {
      ADD: '/api/admin/products/add.php',
      EDIT: '/api/admin/products/edit.php',
      DELETE: '/api/admin/products/delete.php',
      STOCK: '/api/admin/products/stock.php',
      VARIANTS: '/api/admin/products/variants.php',
      IMAGES: '/api/admin/products/images.php',
    },
    CATEGORIES: {
      ADD: '/api/admin/categories/add-category.php',
      EDIT: '/api/admin/categories/edit-category.php',
      DELETE: '/api/admin/categories/delete-category.php',
      ADD_SUB: '/api/admin/categories/add-subcategory.php',
      EDIT_SUB: '/api/admin/categories/edit-subcategory.php',
      DELETE_SUB: '/api/admin/categories/delete-subcategory.php',
    },
  },
  
  // Chat endpoints
  CHAT: {
    SEND: '/api/admin/chat/send.php',
    CONVERSATIONS: '/api/admin/chat/conversations.php',
    MESSAGES: '/api/admin/chat/messages.php',
  },
};

export default API;