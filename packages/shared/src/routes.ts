export const API_ROUTES = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    GOOGLE: "/google",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    LOGOUT: "/logout",
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: "/:id",
    PUBLIC: "/products/public",
    PUBLIC_BY_ID: "/products/public/:id",
    MODEL: "/:id/model",
    TEXTURE_PREVIEW: "/:id/texture-preview",
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: "/:id",
  },
  UPLOADS: {
    BASE: "/uploads",
  },
};
