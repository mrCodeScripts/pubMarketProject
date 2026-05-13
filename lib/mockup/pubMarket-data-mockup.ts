// =============================================================================
// PUBMARKET — MOCKUP DATA
// lib/mock/data.ts
// =============================================================================
// All data typed against lib/types/database.ts
// Use this during UI development to feed components without hitting Supabase
// =============================================================================

import type {
  User,
  Seller,
  Category,
  ProductCard,
  ProductWithDetails,
  OrderSummary,
  OrderWithDetails,
  CartItem,
  WishlistItem,
  Review,
  Notification,
  Conversation,
  Message,
  SupportTicket,
  SupportMessage,
  InventoryProduct,
  SellerDashboardStats,
  PlatformStats,
  SellerAnalytics,
  SellerWithOwner,
} from "@/lib/types/database";

const PLACEHOLDER_IMG =
  "https://placehold.co/400x400/e2e8f0/64748b?text=Product";
const AVATAR_IMG = "https://placehold.co/100x100/e2e8f0/64748b?text=User";
const BANNER_IMG =
  "https://placehold.co/800x200/e2e8f0/64748b?text=Shop+Banner";

// =============================================================================
// USERS
// =============================================================================

export const mockUsers: User[] = [
  {
    id: "user-001",
    fullName: "Juan dela Cruz",
    email: "juan@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09171234567",
    role: "customer",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Poblacion",
      postalCode: "9200",
    },
    sellerStatus: null,
    isSuspended: false,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "user-002",
    fullName: "Maria Santos",
    email: "maria@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09281234567",
    role: "seller",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
      postalCode: "9200",
    },
    sellerStatus: "approved",
    isSuspended: false,
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "user-003",
    fullName: "Carlos Reyes",
    email: "carlos@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09391234567",
    role: "seller",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
      postalCode: "9000",
    },
    sellerStatus: "approved",
    isSuspended: false,
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: "user-004",
    fullName: "Ana Gonzales",
    email: "ana@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09451234567",
    role: "customer",
    location: {
      province: "Bukidnon",
      city: "Malaybalay",
      barangay: "Casisang",
      postalCode: "8700",
    },
    sellerStatus: null,
    isSuspended: false,
    createdAt: "2024-02-01T08:00:00Z",
  },
  {
    id: "user-005",
    fullName: "Roberto Lim",
    email: "roberto@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09561234567",
    role: "seller",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Tambacan",
      postalCode: "9200",
    },
    sellerStatus: "pending",
    isSuspended: false,
    createdAt: "2024-03-01T08:00:00Z",
  },
  {
    id: "user-admin",
    fullName: "Admin PubMarket",
    email: "admin@pubmarket.ph",
    avatarUrl: AVATAR_IMG,
    phone: "09001234567",
    role: "admin",
    location: null,
    sellerStatus: null,
    isSuspended: false,
    createdAt: "2024-01-01T08:00:00Z",
  },
];

export const mockCurrentUser: User = mockUsers[0]; // Juan — logged in customer
export const mockCurrentSeller: User = mockUsers[1]; // Maria — logged in seller
export const mockAdminUser: User = mockUsers[5]; // Admin

// =============================================================================
// SELLERS
// =============================================================================

export const mockSellers: Seller[] = [
  {
    id: "seller-001",
    userId: "user-002",
    shopName: "Maria's Fresh Market",
    shopDescription:
      "Fresh vegetables, fruits, and farm produce straight from our farm in Iligan. Harvested daily, delivered with care.",
    shopBannerUrl: BANNER_IMG,
    shopLogoUrl: AVATAR_IMG,
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
      fullAddress: "Purok 3, Hinaplanon, Iligan City",
    },
    coords: { latitude: 8.228, longitude: 124.2452 },
    birDocumentUrl: PLACEHOLDER_IMG,
    birTin: "123-456-789-000",
    status: "approved",
    rejectionReason: null,
    approvedAt: "2024-01-12T08:00:00Z",
    stats: {
      totalSales: 187450.0,
      totalOrders: 342,
      averageRating: 4.8,
      totalReviews: 215,
    },
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "seller-002",
    userId: "user-003",
    shopName: "Reyes Native Delicacies",
    shopDescription:
      "Authentic Mindanao native kakanin, pastries, and local sweets. Made fresh every morning using traditional recipes.",
    shopBannerUrl: BANNER_IMG,
    shopLogoUrl: AVATAR_IMG,
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
      fullAddress: "Lot 12 Block 4, Carmen, Cagayan de Oro",
    },
    coords: { latitude: 8.4542, longitude: 124.6319 },
    birDocumentUrl: PLACEHOLDER_IMG,
    birTin: "987-654-321-000",
    status: "approved",
    rejectionReason: null,
    approvedAt: "2024-01-14T08:00:00Z",
    stats: {
      totalSales: 94200.0,
      totalOrders: 198,
      averageRating: 4.6,
      totalReviews: 143,
    },
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: "seller-003",
    userId: "user-005",
    shopName: "Lim's Handicrafts",
    shopDescription:
      "Handmade Maranao-inspired home decor, woven items, and local crafts. Every piece tells a story.",
    shopBannerUrl: BANNER_IMG,
    shopLogoUrl: AVATAR_IMG,
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Tambacan",
      fullAddress: "Purok 5, Tambacan, Iligan City",
    },
    coords: { latitude: 8.235, longitude: 124.25 },
    birDocumentUrl: PLACEHOLDER_IMG,
    birTin: "456-123-789-000",
    status: "pending",
    rejectionReason: null,
    approvedAt: null,
    stats: {
      totalSales: 0,
      totalOrders: 0,
      averageRating: 0,
      totalReviews: 0,
    },
    createdAt: "2024-03-01T08:00:00Z",
  },
];

export const mockSellersWithOwner: SellerWithOwner[] = [
  { ...mockSellers[0], owner: mockUsers[1] },
  { ...mockSellers[1], owner: mockUsers[2] },
  { ...mockSellers[2], owner: mockUsers[4] },
];

// =============================================================================
// CATEGORIES
// =============================================================================

export const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Fresh Produce",
    slug: "fresh-produce",
    description: "Fruits, vegetables, and farm-fresh goods",
    icon: "🥬",
  },
  {
    id: "cat-002",
    name: "Meat & Seafood",
    slug: "meat-seafood",
    description: "Fresh meat, poultry, and seafood",
    icon: "🥩",
  },
  {
    id: "cat-003",
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Milk, cheese, butter, eggs",
    icon: "🥚",
  },
  {
    id: "cat-004",
    name: "Baked Goods",
    slug: "baked-goods",
    description: "Bread, pastries, cakes, and local kakanin",
    icon: "🍞",
  },
  {
    id: "cat-005",
    name: "Beverages",
    slug: "beverages",
    description: "Juices, coffee, teas, and local drinks",
    icon: "🍵",
  },
  {
    id: "cat-006",
    name: "Dry Goods",
    slug: "dry-goods",
    description: "Rice, grains, beans, spices, and pantry staples",
    icon: "🌾",
  },
  {
    id: "cat-007",
    name: "Condiments",
    slug: "condiments",
    description: "Sauces, vinegars, bagoong, and local condiments",
    icon: "🫙",
  },
  {
    id: "cat-008",
    name: "Snacks",
    slug: "snacks",
    description: "Local chips, dried fruits, nuts, and sweets",
    icon: "🍿",
  },
  {
    id: "cat-009",
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Handmade crafts, decor, and artisan goods",
    icon: "🧺",
  },
  {
    id: "cat-010",
    name: "Clothing",
    slug: "clothing",
    description: "Local fashion, accessories, and textiles",
    icon: "👗",
  },
  {
    id: "cat-011",
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Herbal products, supplements, wellness items",
    icon: "🌿",
  },
  {
    id: "cat-012",
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, home decor, and household items",
    icon: "🏠",
  },
  {
    id: "cat-013",
    name: "Plants & Garden",
    slug: "plants-garden",
    description: "Indoor plants, seedlings, and garden supplies",
    icon: "🌱",
  },
  {
    id: "cat-014",
    name: "Street Food",
    slug: "street-food",
    description: "Ready-to-eat local street food and delicacies",
    icon: "🍢",
  },
  {
    id: "cat-015",
    name: "Other",
    slug: "other",
    description: "Everything else",
    icon: "📦",
  },
];

// =============================================================================
// PRODUCTS
// =============================================================================

export const mockProducts: ProductCard[] = [
  // --- FRESH PRODUCE ---
  {
    id: "prod-001",
    name: "Organic Sayote (Chayote)",
    slug: "organic-sayote-chayote",
    price: 35.0,
    originalPrice: 45.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.9,
    totalReviews: 87,
    totalSold: 412,
    stock: 150,
    unit: "kg",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Fresh Produce", slug: "fresh-produce", icon: "🥬" },
  },
  {
    id: "prod-002",
    name: "Native Kamatis (Tomatoes) — 1kg",
    slug: "native-kamatis-tomatoes-1kg",
    price: 60.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.7,
    totalReviews: 63,
    totalSold: 289,
    stock: 80,
    unit: "kg",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Fresh Produce", slug: "fresh-produce", icon: "🥬" },
  },
  {
    id: "prod-003",
    name: "Bukidnon Sweet Corn — 6 pcs",
    slug: "bukidnon-sweet-corn-6pcs",
    price: 75.0,
    originalPrice: 90.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.8,
    totalReviews: 112,
    totalSold: 534,
    stock: 200,
    unit: "bundle",
    location: {
      province: "Bukidnon",
      city: "Malaybalay",
      barangay: "Casisang",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Fresh Produce", slug: "fresh-produce", icon: "🥬" },
  },
  {
    id: "prod-004",
    name: "Pechay Baguio — 500g",
    slug: "pechay-baguio-500g",
    price: 45.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.5,
    totalReviews: 44,
    totalSold: 198,
    stock: 3,
    unit: "pack",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Fresh Produce", slug: "fresh-produce", icon: "🥬" },
  },

  // --- BAKED GOODS ---
  {
    id: "prod-005",
    name: "Homemade Puto Cheese — 12 pcs",
    slug: "homemade-puto-cheese-12pcs",
    price: 120.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.9,
    totalReviews: 156,
    totalSold: 723,
    stock: 30,
    unit: "box",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Baked Goods", slug: "baked-goods", icon: "🍞" },
  },
  {
    id: "prod-006",
    name: "Bibingka Especial — 8 inch",
    slug: "bibingka-especial-8inch",
    price: 180.0,
    originalPrice: 220.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.7,
    totalReviews: 98,
    totalSold: 412,
    stock: 15,
    unit: "piece",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Baked Goods", slug: "baked-goods", icon: "🍞" },
  },
  {
    id: "prod-007",
    name: "Palitaw with Sesame — 10 pcs",
    slug: "palitaw-sesame-10pcs",
    price: 95.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.6,
    totalReviews: 71,
    totalSold: 304,
    stock: 25,
    unit: "pack",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Baked Goods", slug: "baked-goods", icon: "🍞" },
  },

  // --- MEAT & SEAFOOD ---
  {
    id: "prod-008",
    name: "Native Chicken — Dressed 1kg",
    slug: "native-chicken-dressed-1kg",
    price: 280.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.8,
    totalReviews: 132,
    totalSold: 567,
    stock: 20,
    unit: "kg",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Meat & Seafood", slug: "meat-seafood", icon: "🥩" },
  },
  {
    id: "prod-009",
    name: "Fresh Tilapia — 1kg",
    slug: "fresh-tilapia-1kg",
    price: 130.0,
    originalPrice: 150.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.5,
    totalReviews: 89,
    totalSold: 389,
    stock: 40,
    unit: "kg",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Meat & Seafood", slug: "meat-seafood", icon: "🥩" },
  },

  // --- BEVERAGES ---
  {
    id: "prod-010",
    name: "Barako Coffee — 250g Ground",
    slug: "barako-coffee-250g-ground",
    price: 195.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.9,
    totalReviews: 204,
    totalSold: 891,
    stock: 60,
    unit: "pack",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Beverages", slug: "beverages", icon: "🍵" },
  },
  {
    id: "prod-011",
    name: "Calamansi Juice Concentrate — 500ml",
    slug: "calamansi-juice-concentrate-500ml",
    price: 85.0,
    originalPrice: 100.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.6,
    totalReviews: 77,
    totalSold: 342,
    stock: 45,
    unit: "bottle",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Beverages", slug: "beverages", icon: "🍵" },
  },

  // --- DRY GOODS ---
  {
    id: "prod-012",
    name: "Dinorado Rice — 5kg",
    slug: "dinorado-rice-5kg",
    price: 320.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.7,
    totalReviews: 188,
    totalSold: 654,
    stock: 100,
    unit: "sack",
    location: {
      province: "Bukidnon",
      city: "Malaybalay",
      barangay: "Casisang",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Dry Goods", slug: "dry-goods", icon: "🌾" },
  },
  {
    id: "prod-013",
    name: "Muscovado Sugar — 500g",
    slug: "muscovado-sugar-500g",
    price: 75.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.8,
    totalReviews: 93,
    totalSold: 421,
    stock: 70,
    unit: "pack",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Dry Goods", slug: "dry-goods", icon: "🌾" },
  },

  // --- CONDIMENTS ---
  {
    id: "prod-014",
    name: "Homemade Bagoong Alamang — 250g",
    slug: "homemade-bagoong-alamang-250g",
    price: 65.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.7,
    totalReviews: 114,
    totalSold: 503,
    stock: 55,
    unit: "jar",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Condiments", slug: "condiments", icon: "🫙" },
  },
  {
    id: "prod-015",
    name: "Spiced Coconut Vinegar — 350ml",
    slug: "spiced-coconut-vinegar-350ml",
    price: 55.0,
    originalPrice: 70.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.5,
    totalReviews: 58,
    totalSold: 267,
    stock: 0,
    unit: "bottle",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: false,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Condiments", slug: "condiments", icon: "🫙" },
  },

  // --- SNACKS ---
  {
    id: "prod-016",
    name: "Dried Mango Strips — 200g",
    slug: "dried-mango-strips-200g",
    price: 110.0,
    originalPrice: 130.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.9,
    totalReviews: 231,
    totalSold: 1024,
    stock: 85,
    unit: "pack",
    location: {
      province: "Misamis Oriental",
      city: "Cagayan de Oro",
      barangay: "Carmen",
    },
    isActive: true,
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.6,
    },
    category: { name: "Snacks", slug: "snacks", icon: "🍿" },
  },
  {
    id: "prod-017",
    name: "Chicharon Bulaklak — 150g",
    slug: "chicharon-bulaklak-150g",
    price: 80.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.6,
    totalReviews: 74,
    totalSold: 318,
    stock: 40,
    unit: "pack",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: { name: "Snacks", slug: "snacks", icon: "🍿" },
  },

  // --- HANDICRAFTS ---
  {
    id: "prod-018",
    name: "Maranao Okir Wall Decor",
    slug: "maranao-okir-wall-decor",
    price: 850.0,
    originalPrice: 1000.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 5.0,
    totalReviews: 42,
    totalSold: 87,
    stock: 8,
    unit: "piece",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Tambacan",
    },
    isActive: true,
    seller: {
      id: "seller-003",
      shopName: "Lim's Handicrafts",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 0,
    },
    category: { name: "Handicrafts", slug: "handicrafts", icon: "🧺" },
  },
  {
    id: "prod-019",
    name: "Handwoven Banig Mat — Queen Size",
    slug: "handwoven-banig-mat-queen",
    price: 650.0,
    originalPrice: null,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.8,
    totalReviews: 35,
    totalSold: 64,
    stock: 12,
    unit: "piece",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Tambacan",
    },
    isActive: true,
    seller: {
      id: "seller-003",
      shopName: "Lim's Handicrafts",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 0,
    },
    category: { name: "Handicrafts", slug: "handicrafts", icon: "🧺" },
  },

  // --- HEALTH & WELLNESS ---
  {
    id: "prod-020",
    name: "Virgin Coconut Oil — 250ml",
    slug: "virgin-coconut-oil-250ml",
    price: 145.0,
    originalPrice: 165.0,
    thumbnailUrl: PLACEHOLDER_IMG,
    averageRating: 4.8,
    totalReviews: 167,
    totalSold: 712,
    stock: 55,
    unit: "bottle",
    location: {
      province: "Lanao del Norte",
      city: "Iligan City",
      barangay: "Hinaplanon",
    },
    isActive: true,
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
      averageRating: 4.8,
    },
    category: {
      name: "Health & Wellness",
      slug: "health-wellness",
      icon: "🌿",
    },
  },
];

// Derived: featured products (highest sold)
export const mockFeaturedProducts: ProductCard[] = mockProducts
  .filter((p) => p.isActive)
  .sort((a, b) => b.totalSold - a.totalSold)
  .slice(0, 6);

// Derived: low stock products (for seller inventory page)
export const mockLowStockProducts = mockProducts.filter((p) => p.stock <= 5);

// =============================================================================
// PRODUCT WITH DETAILS (for product detail page)
// =============================================================================

export const mockProductWithDetails: ProductWithDetails = {
  id: "prod-001",
  sellerId: "seller-001",
  categoryId: "cat-001",
  name: "Organic Sayote (Chayote)",
  slug: "organic-sayote-chayote",
  description:
    "Freshly harvested organic sayote from our farm in Hinaplanon, Iligan City. Grown without pesticides using natural composting methods. Perfect for tinola, stir-fry, or salads. Harvested every morning and delivered within 24 hours of harvest.",
  price: 35.0,
  originalPrice: 45.0,
  stock: 150,
  lowStockThreshold: 10,
  unit: "kg",
  location: {
    province: "Lanao del Norte",
    city: "Iligan City",
    barangay: "Hinaplanon",
  },
  thumbnailUrl: PLACEHOLDER_IMG,
  isActive: true,
  isDraft: false,
  isFeatured: true,
  aiGeneratedDescription: false,
  averageRating: 4.9,
  totalReviews: 87,
  totalSold: 412,
  createdAt: "2024-01-20T08:00:00Z",
  updatedAt: "2024-03-01T08:00:00Z",
  seller: mockSellers[0],
  category: mockCategories[0],
  images: [
    {
      id: "img-001",
      productId: "prod-001",
      url: PLACEHOLDER_IMG,
      altText: "Organic Sayote front",
      sortOrder: 0,
    },
    {
      id: "img-002",
      productId: "prod-001",
      url: PLACEHOLDER_IMG,
      altText: "Organic Sayote bundle",
      sortOrder: 1,
    },
    {
      id: "img-003",
      productId: "prod-001",
      url: PLACEHOLDER_IMG,
      altText: "Organic Sayote farm",
      sortOrder: 2,
    },
  ],
  reviews: [
    {
      id: "rev-001",
      productId: "prod-001",
      sellerId: "seller-001",
      orderId: "order-001",
      rating: 5,
      comment:
        "Super fresh talaga! Dumating pa rin within 24 hours. Maayos ang packaging. Definitely buying again!",
      isFlagged: false,
      flagReason: null,
      createdAt: "2024-02-14T10:00:00Z",
      customer: {
        id: "user-001",
        fullName: "Juan dela Cruz",
        avatarUrl: AVATAR_IMG,
      },
    },
    {
      id: "rev-002",
      productId: "prod-001",
      sellerId: "seller-001",
      orderId: "order-002",
      rating: 5,
      comment:
        "Ganda ng quality! Mas masarap pa sa supermarket. Sulit na sulit.",
      isFlagged: false,
      flagReason: null,
      createdAt: "2024-02-18T14:00:00Z",
      customer: {
        id: "user-004",
        fullName: "Ana Gonzales",
        avatarUrl: AVATAR_IMG,
      },
    },
    {
      id: "rev-003",
      productId: "prod-001",
      sellerId: "seller-001",
      orderId: "order-003",
      rating: 4,
      comment:
        "Fresh and organic as described. Slight bruising on 2 pieces but overall great value.",
      isFlagged: false,
      flagReason: null,
      createdAt: "2024-03-01T09:00:00Z",
      customer: {
        id: "user-004",
        fullName: "Ana Gonzales",
        avatarUrl: AVATAR_IMG,
      },
    },
  ],
};

// =============================================================================
// REVIEWS (standalone list for review pages)
// =============================================================================

export const mockReviews: Review[] = mockProductWithDetails.reviews;

// =============================================================================
// ORDERS
// =============================================================================

export const mockOrderSummaries: OrderSummary[] = [
  {
    id: "order-001",
    status: "delivered",
    paymentStatus: "paid",
    totalAmount: 384.0,
    createdAt: "2024-02-10T09:00:00Z",
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
    },
    items: [
      {
        productName: "Organic Sayote (Chayote)",
        productImage: PLACEHOLDER_IMG,
        quantity: 3,
      },
      {
        productName: "Native Kamatis (Tomatoes)",
        productImage: PLACEHOLDER_IMG,
        quantity: 2,
      },
    ],
  },
  {
    id: "order-002",
    status: "out_for_delivery",
    paymentStatus: "paid",
    totalAmount: 519.0,
    createdAt: "2024-03-05T11:00:00Z",
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
    },
    items: [
      {
        productName: "Homemade Puto Cheese — 12 pcs",
        productImage: PLACEHOLDER_IMG,
        quantity: 2,
      },
      {
        productName: "Barako Coffee — 250g Ground",
        productImage: PLACEHOLDER_IMG,
        quantity: 1,
      },
    ],
  },
  {
    id: "order-003",
    status: "pending",
    paymentStatus: "paid",
    totalAmount: 214.0,
    createdAt: "2024-03-10T14:00:00Z",
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
    },
    items: [
      {
        productName: "Fresh Tilapia — 1kg",
        productImage: PLACEHOLDER_IMG,
        quantity: 1,
      },
      {
        productName: "Pechay Baguio — 500g",
        productImage: PLACEHOLDER_IMG,
        quantity: 2,
      },
    ],
  },
  {
    id: "order-004",
    status: "cancelled",
    paymentStatus: "refunded",
    totalAmount: 145.0,
    createdAt: "2024-02-28T10:00:00Z",
    seller: {
      id: "seller-002",
      shopName: "Reyes Native Delicacies",
      shopLogoUrl: AVATAR_IMG,
    },
    items: [
      {
        productName: "Dried Mango Strips — 200g",
        productImage: PLACEHOLDER_IMG,
        quantity: 1,
      },
    ],
  },
  {
    id: "order-005",
    status: "confirmed",
    paymentStatus: "paid",
    totalAmount: 369.0,
    createdAt: "2024-03-11T08:00:00Z",
    seller: {
      id: "seller-001",
      shopName: "Maria's Fresh Market",
      shopLogoUrl: AVATAR_IMG,
    },
    items: [
      {
        productName: "Dinorado Rice — 5kg",
        productImage: PLACEHOLDER_IMG,
        quantity: 1,
      },
    ],
  },
];

export const mockOrderWithDetails: OrderWithDetails = {
  id: "order-002",
  customerId: "user-001",
  sellerId: "seller-002",
  deliveryAddress: {
    fullName: "Juan dela Cruz",
    phone: "09171234567",
    province: "Lanao del Norte",
    city: "Iligan City",
    barangay: "Poblacion",
    street: "123 Rizal St.",
    postalCode: "9200",
    coords: { latitude: 8.228, longitude: 124.2452 },
  },
  status: "out_for_delivery",
  paymentStatus: "paid",
  paymentMethod: "card",
  paymentReference: "MOCK-REF-20240305-002",
  subtotal: 470.0,
  deliveryFee: 49.0,
  totalAmount: 519.0,
  sellerCoords: { latitude: 8.4542, longitude: 124.6319 },
  buyerCoords: { latitude: 8.228, longitude: 124.2452 },
  timeline: {
    confirmedAt: "2024-03-05T12:00:00Z",
    packedAt: "2024-03-05T14:00:00Z",
    outForDeliveryAt: "2024-03-05T16:00:00Z",
    deliveredAt: null,
    cancelledAt: null,
  },
  cancellationReason: null,
  customerNotes: "Please pack the puto carefully, it breaks easily.",
  createdAt: "2024-03-05T11:00:00Z",
  updatedAt: "2024-03-05T16:00:00Z",
  customer: mockUsers[0],
  seller: mockSellers[1],
  items: [
    {
      id: "item-001",
      orderId: "order-002",
      productId: "prod-005",
      productName: "Homemade Puto Cheese — 12 pcs",
      productImage: PLACEHOLDER_IMG,
      unitPrice: 120.0,
      quantity: 2,
      subtotal: 240.0,
      reviewId: null,
    },
    {
      id: "item-002",
      orderId: "order-002",
      productId: "prod-010",
      productName: "Barako Coffee — 250g Ground",
      productImage: PLACEHOLDER_IMG,
      unitPrice: 195.0,
      quantity: 1,
      subtotal: 195.0,
      reviewId: null,
    },
  ],
};

// =============================================================================
// CART
// =============================================================================

export const mockCartItems: CartItem[] = [
  {
    id: "cart-001",
    userId: "user-001",
    quantity: 2,
    product: mockProducts[0],
  },
  {
    id: "cart-002",
    userId: "user-001",
    quantity: 1,
    product: mockProducts[4],
  },
  {
    id: "cart-003",
    userId: "user-001",
    quantity: 3,
    product: mockProducts[11],
  },
];

// =============================================================================
// WISHLIST
// =============================================================================

export const mockWishlistItems: WishlistItem[] = [
  {
    id: "wish-001",
    userId: "user-001",
    createdAt: "2024-02-20T10:00:00Z",
    product: mockProducts[9],
  },
  {
    id: "wish-002",
    userId: "user-001",
    createdAt: "2024-02-22T10:00:00Z",
    product: mockProducts[17],
  },
  {
    id: "wish-003",
    userId: "user-001",
    createdAt: "2024-03-01T10:00:00Z",
    product: mockProducts[19],
  },
];

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    userId: "user-001",
    type: "order_out_for_delivery",
    title: "Your order is on the way!",
    body: "Order #order-002 from Reyes Native Delicacies is now out for delivery.",
    isRead: false,
    entityType: "order",
    entityId: "order-002",
    createdAt: "2024-03-05T16:00:00Z",
  },
  {
    id: "notif-002",
    userId: "user-001",
    type: "order_confirmed",
    title: "Order Confirmed",
    body: "Order #order-005 from Maria's Fresh Market has been confirmed.",
    isRead: false,
    entityType: "order",
    entityId: "order-005",
    createdAt: "2024-03-11T09:00:00Z",
  },
  {
    id: "notif-003",
    userId: "user-001",
    type: "promo",
    title: "Weekend Sale at Maria's Fresh Market!",
    body: "Get up to 20% off on all fresh produce this weekend only.",
    isRead: true,
    entityType: "seller",
    entityId: "seller-001",
    createdAt: "2024-03-08T08:00:00Z",
  },
  {
    id: "notif-004",
    userId: "user-002",
    type: "order_placed",
    title: "New Order Received!",
    body: "You have a new order from Juan dela Cruz. Order #order-003.",
    isRead: false,
    entityType: "order",
    entityId: "order-003",
    createdAt: "2024-03-10T14:00:00Z",
  },
  {
    id: "notif-005",
    userId: "user-002",
    type: "low_stock",
    title: "Low Stock Alert",
    body: "Pechay Baguio — 500g only has 3 units left in stock.",
    isRead: false,
    entityType: "product",
    entityId: "prod-004",
    createdAt: "2024-03-09T10:00:00Z",
  },
  {
    id: "notif-006",
    userId: "user-005",
    type: "seller_approved",
    title: "Seller Application Approved!",
    body: "Congratulations! Your seller application has been approved. You can now list products.",
    isRead: false,
    entityType: null,
    entityId: null,
    createdAt: "2024-03-12T10:00:00Z",
  },
];

// =============================================================================
// CONVERSATIONS & MESSAGES (Chat)
// =============================================================================

export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    customerId: "user-001",
    sellerId: "seller-001",
    productId: "prod-001",
    lastMessage: "Pwede bang mag-order ng 5kg?",
    lastMessageAt: "2024-03-10T15:30:00Z",
    unreadCount: 2,
    createdAt: "2024-03-10T15:00:00Z",
    participant: {
      id: "user-002",
      fullName: "Maria Santos",
      avatarUrl: AVATAR_IMG,
      shopName: "Maria's Fresh Market",
    },
    product: {
      id: "prod-001",
      name: "Organic Sayote (Chayote)",
      thumbnailUrl: PLACEHOLDER_IMG,
    },
  },
  {
    id: "conv-002",
    customerId: "user-001",
    sellerId: "seller-002",
    productId: "prod-005",
    lastMessage: "Thank you for your order!",
    lastMessageAt: "2024-03-05T17:00:00Z",
    unreadCount: 0,
    createdAt: "2024-03-05T11:00:00Z",
    participant: {
      id: "user-003",
      fullName: "Carlos Reyes",
      avatarUrl: AVATAR_IMG,
      shopName: "Reyes Native Delicacies",
    },
    product: {
      id: "prod-005",
      name: "Homemade Puto Cheese — 12 pcs",
      thumbnailUrl: PLACEHOLDER_IMG,
    },
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    senderId: "user-001",
    body: "Hi! Meron pa ba kayong Sayote?",
    isRead: true,
    createdAt: "2024-03-10T15:00:00Z",
    sender: {
      id: "user-001",
      fullName: "Juan dela Cruz",
      avatarUrl: AVATAR_IMG,
    },
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    senderId: "user-002",
    body: "Meron pa po! Available pa around 150kg. Gusto niyo po magpa-order?",
    isRead: true,
    createdAt: "2024-03-10T15:10:00Z",
    sender: { id: "user-002", fullName: "Maria Santos", avatarUrl: AVATAR_IMG },
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    senderId: "user-001",
    body: "Pwede bang mag-order ng 5kg?",
    isRead: false,
    createdAt: "2024-03-10T15:30:00Z",
    sender: {
      id: "user-001",
      fullName: "Juan dela Cruz",
      avatarUrl: AVATAR_IMG,
    },
  },
  {
    id: "msg-004",
    conversationId: "conv-002",
    senderId: "user-001",
    body: "May order na ako. Kailan po maari i-deliver?",
    isRead: true,
    createdAt: "2024-03-05T11:30:00Z",
    sender: {
      id: "user-001",
      fullName: "Juan dela Cruz",
      avatarUrl: AVATAR_IMG,
    },
  },
  {
    id: "msg-005",
    conversationId: "conv-002",
    senderId: "user-003",
    body: "Thank you for your order! We'll have it ready by this afternoon.",
    isRead: true,
    createdAt: "2024-03-05T17:00:00Z",
    sender: { id: "user-003", fullName: "Carlos Reyes", avatarUrl: AVATAR_IMG },
  },
];

// =============================================================================
// SUPPORT TICKETS
// =============================================================================

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-001",
    userId: "user-001",
    subject: "Order not yet delivered after 3 days",
    category: "order_issue",
    status: "in_progress",
    orderId: "order-003",
    productId: null,
    resolvedAt: null,
    createdAt: "2024-03-13T10:00:00Z",
    updatedAt: "2024-03-13T14:00:00Z",
  },
  {
    id: "ticket-002",
    userId: "user-001",
    subject: "Wrong item was delivered",
    category: "product_issue",
    status: "resolved",
    orderId: "order-001",
    productId: "prod-001",
    resolvedAt: "2024-02-16T10:00:00Z",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-16T10:00:00Z",
  },
];

export const mockSupportMessages: SupportMessage[] = [
  {
    id: "smsg-001",
    ticketId: "ticket-001",
    body: "Hello, my order #order-003 has not been delivered yet. It's been 3 days.",
    isStaff: false,
    createdAt: "2024-03-13T10:00:00Z",
    sender: {
      id: "user-001",
      fullName: "Juan dela Cruz",
      avatarUrl: AVATAR_IMG,
    },
  },
  {
    id: "smsg-002",
    ticketId: "ticket-001",
    body: "Hi Juan! We're sorry for the inconvenience. We're currently checking with the seller. We'll update you within 24 hours.",
    isStaff: true,
    createdAt: "2024-03-13T14:00:00Z",
    sender: {
      id: "user-admin",
      fullName: "PubMarket Support",
      avatarUrl: AVATAR_IMG,
    },
  },
];

// =============================================================================
// INVENTORY (for seller inventory page)
// =============================================================================

export const mockInventoryProducts: InventoryProduct[] = mockProducts
  .filter((p) => p.seller.id === "seller-001")
  .map((p) => ({
    id: p.id,
    name: p.name,
    thumbnailUrl: p.thumbnailUrl,
    stock: p.stock,
    lowStockThreshold: 5,
    unit: p.unit,
    isActive: p.isActive,
    stockStatus: p.stock === 0 ? "out" : p.stock <= 5 ? "low" : "ok",
  }));

// =============================================================================
// SELLER DASHBOARD STATS
// =============================================================================

export const mockSellerDashboardStats: SellerDashboardStats = {
  totalSales: 187450.0,
  totalOrders: 342,
  activeListings: 14,
  averageRating: 4.8,
  lowStockCount: 2,
  ordersToday: 7,
};

// =============================================================================
// SELLER ANALYTICS (for chart — last 7 days)
// =============================================================================

export const mockSellerAnalytics: SellerAnalytics[] = [
  {
    id: "a-001",
    sellerId: "seller-001",
    date: "2024-03-06",
    revenue: 4200.0,
    ordersCount: 12,
    unitsSold: 38,
    newReviews: 3,
    createdAt: "2024-03-06T23:59:00Z",
  },
  {
    id: "a-002",
    sellerId: "seller-001",
    date: "2024-03-07",
    revenue: 5800.0,
    ordersCount: 18,
    unitsSold: 54,
    newReviews: 5,
    createdAt: "2024-03-07T23:59:00Z",
  },
  {
    id: "a-003",
    sellerId: "seller-001",
    date: "2024-03-08",
    revenue: 3100.0,
    ordersCount: 9,
    unitsSold: 27,
    newReviews: 2,
    createdAt: "2024-03-08T23:59:00Z",
  },
  {
    id: "a-004",
    sellerId: "seller-001",
    date: "2024-03-09",
    revenue: 6700.0,
    ordersCount: 21,
    unitsSold: 63,
    newReviews: 7,
    createdAt: "2024-03-09T23:59:00Z",
  },
  {
    id: "a-005",
    sellerId: "seller-001",
    date: "2024-03-10",
    revenue: 4900.0,
    ordersCount: 15,
    unitsSold: 45,
    newReviews: 4,
    createdAt: "2024-03-10T23:59:00Z",
  },
  {
    id: "a-006",
    sellerId: "seller-001",
    date: "2024-03-11",
    revenue: 7200.0,
    ordersCount: 23,
    unitsSold: 69,
    newReviews: 6,
    createdAt: "2024-03-11T23:59:00Z",
  },
  {
    id: "a-007",
    sellerId: "seller-001",
    date: "2024-03-12",
    revenue: 5400.0,
    ordersCount: 17,
    unitsSold: 51,
    newReviews: 4,
    createdAt: "2024-03-12T23:59:00Z",
  },
];

// =============================================================================
// ADMIN / PLATFORM STATS
// =============================================================================

export const mockPlatformStats: PlatformStats = {
  totalUsers: 1284,
  totalSellers: 87,
  totalProducts: 643,
  totalOrders: 4821,
  totalRevenue: 2847500.0,
  pendingSellerApprovals: 5,
  openSupportTickets: 12,
};

// =============================================================================
// END OF MOCK DATA
// =============================================================================
