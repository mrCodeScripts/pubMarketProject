const APP_PUBLIC_PATHS = {
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "http://localhost:3000",

  // ADMIN
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ORDERS_PAGE: "/admin/orders",
  ADMIN_PRODUCTS_PAGE: "/admin/products",
  ADMIN_REVVIEWS_PAGE: "/admin/reviews",
  ADMIN_SELLERS_PAGE: "/admin/sellers",
  ADMIN_SETTINGS_PAGE: "/admin/settings",
  ADMIN_USERS_PAGE: "/admin/users",

  // AUTH
  AUTH_FORGOTPASSWORD_PAGE: "/forgot-password",
  AUTH_LOGIN_PAGE: "/login",
  AUTH_REGISTER_PAGE: "/register",
  AUTH_RESETPASSWORD_PAGE: "/reset-password",
  AUTH_ONBOARDING_PAGE: "/onboarding",

  // CUSTOMER
  CUSTOMER_CART_PAGE: "/cart",
  CUSTOMER_CECKOUT_PAGE: "/checkout",
  CUSTOMER_CECKOUT_SUCCESS_PAGE: "/checkout/success",
  CUSTOMER_DASHBOARD_PAGE: "/dashboard",
  CUSTOMER_NOTIFICATIONS_PAGE: "/notifications",
  CUSTOMER_ORDERS_PAGE: "/orders",
  CUSTOMER_PROFILE_PAGE: "/profile",
  CUSTOMER_SETTINGS_PAGE: "/settings",
  CUSTOMER_SETTINGS_ACCOUNT_PAGE: "/settings/account",
  CUSTOMER_SETTINGS_ADDRESSES_PAGE: "/settings/addresses",
  CUSTOMER_SETTINGS_NOTIFICATIONS_PAGE: "/settings/notifications",
  CUSTOMER_SETTINGS_SECURITY_PAGE: "/settings/security",
  CUSTOMER_SUPPORT_PAGE: "/support",
  CUSTOMER_WISHTLIST_PAGE: "/wishlist",

  // PUBLIC
  PUBLIC_PAGE: "/",
  PUBLIC_ABOUT_PAGE: "/about",
  PUBLIC_CONTACT_PAGE: "/contact",
  PUBLIC_PRODUCTS_PAGE: "/products",

  // SELLER
  SELER_ANALYTICS_PAGE: "/seller/analytics",
  SELLER_APPLY_PAGE: "/seller/apply",
  SELLER_DASHBOARD_PAGE: "/seller/dashboard",
  SELLER_INVENOTRY_PAGE: "/seller/inventory",
  SELLER_ORDERS_PAGE: "/seller/orders",
  SELLER_PENDING_PAGE: "/seller/pending",
  SELLER_PRODUCTS_PAGE: "/seller/products",
  SELLER_PRODUCTS_NEW_PAGE: "/seller/products/new",
  SELLER_REVIEWS_PAGE: "/seller/reviews",
  SELLER_SHOP_PAGE: "/seller/shop",
};

const APP_DB_TABLES = {
  USER_PROFILES_TABLE: "pubMarket_user_profiles",
};

const APP_CONFIG = {
  CONFIG_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  CONFIG_SUPABASE_PURE_PROJECT_URL:
    process.env.NEXT_PUBLIC_SUPABASE_PURE_PROJECT_ID!,
  CONFIG_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  CONFIG_SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY, // Server-only
  CONFIG_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CONFIG_GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CONFIG_FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  CONFIG_FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
};

const API_ROUTES = {
  // AUTH RELATED
  API_AUTH_CALLBACK_ROUTE: "/api/auth/callback",
  API_AUTH_CALLBACK_CLEANUP_ROUTE: "/api/auth/callback-cleanup",
  API_AUTH_LOGIN_ROUTE: "/api/auth/login",
  API_AUTH_LOGOUT_ROUTE: "/api/auth/logout",
  API_AUTH_OAUTH_ROUTE: "/api/auth/oauth",
  API_AUTH_ONBOARDING_ROUTE: "/api/auth/onboarding",
  API_AUTH_REGISTER_ROUTE: "/api/auth/register",
  API_AUTH_RESETPASSWORD_ROUTE: "/api/auth/reset-password",

  // DATA RELATED
  API_DATA_CURRENTUSER: "/api/data/currentUser",

  // NOTIFICATIONS RELATED
  API_NOTIFICATIONS: "/api/data/currentUser",
};

const AUTH_SECRETS = {
  SECRET_OAUTH_POPUP_WINDOW_KEY: "popup-auth-provider-success",
};

export const ENV = {
  ...APP_PUBLIC_PATHS,
  ...APP_DB_TABLES,
  ...APP_CONFIG,
  ...AUTH_SECRETS,
  ...API_ROUTES,
};
