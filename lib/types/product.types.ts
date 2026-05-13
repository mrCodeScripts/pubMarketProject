export type Product = {
  id: string;
  sellerId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  location: ProductLocation;
  thumbnailUrl: string | null;
  isActive: boolean;
  isDraft: boolean;
  isFeatured: boolean;
  aiGeneratedDescription: boolean;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductLocation = {
  province: string;
  city: string;
  barangay: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

// Full product for product detail page
export type ProductWithDetails = Product & {
  seller: Seller;
  category: Category | null;
  images: ProductImage[];
  reviews: Review[];
};

// Lightweight product for cards and grids
export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  thumbnailUrl: string | null;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  stock: number;
  unit: string;
  location: ProductLocation;
  isActive: boolean;
  seller: {
    id: string;
    shopName: string;
    shopLogoUrl: string | null;
    averageRating: number;
  };
  category: {
    name: string;
    slug: string;
    icon: string | null;
  } | null;
};
