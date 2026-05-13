export type Seller = {
  id: string;
  userId: string;
  shopName: string;
  shopDescription: string | null;
  shopBannerUrl: string | null;
  shopLogoUrl: string | null;
  location: SellerLocation;
  coords: Coords | null;
  birDocumentUrl: string | null;
  birTin: string | null;
  status: SellerStatus;
  rejectionReason: string | null;
  approvedAt: string | null;
  stats: SellerStats;
  createdAt: string;
};

export type SellerLocation = {
  province: string;
  city: string;
  barangay: string;
  fullAddress: string | null;
};

export type SellerStats = {
  totalSales: number;
  totalOrders: number;
  averageRating: number;
  totalReviews: number;
};

export type Coords = {
  latitude: number;
  longitude: number;
};

// Seller with owner profile attached (for admin views)
export type SellerWithOwner = Seller & {
  owner: User;
};
