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
    CREATE_WITH_3D: "/create-with-3d",
    REGENERATE_3D: "/:id/regenerate-3d",
    STATUS_3D: "/:id/3d-status",
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: "/:id",
  },
  UPLOADS: {
    BASE: "/uploads",
  },
  AR: {
    BASE: "/admin/products",
  },
  ORDERS: {
    BASE: "/orders",
    MY: "/my",
    BY_ID: "/:id",
    PAYMENT: "/:id/payment",
    WEBHOOK: "/payment/webhook",
    STATUS: "/:id/status",
  },
};
