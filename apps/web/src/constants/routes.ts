export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    BASE: '/admin',
    PRODUCTS: {
      BASE: '/admin/products',
      CREATE: '/admin/products/create',
    },
    CATEGORIES: {
      BASE: '/admin/categories',
      CREATE: '/admin/categories/create',
    },
    ORDERS: {
      BASE: '/admin/orders',
    },
  },
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    VASES: '/categories/vases',
    TABLEWARE: '/categories/tableware',
  },
  CART: '/cart',
  CHECKOUT: {
    BASE: '/checkout',
    SUCCESS: '/checkout/success',
    CANCEL: '/checkout/cancel',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
  },
  PROFILE: '/profile',
  CONTACT: '/contact',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};
