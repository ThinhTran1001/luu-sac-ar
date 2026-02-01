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
  },
  PRODUCTS: '/products',
  CATEGORIES: {
    BASE: '/categories',
    VASES: '/categories/vases',
    TABLEWARE: '/categories/tableware',
  },
  PROFILE: '/profile',
  CONTACT: '/contact',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};
