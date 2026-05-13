export type SellerAnalytics = {
  id: string;
  sellerId: string;
  date: string;
  revenue: number;
  ordersCount: number;
  unitsSold: number;
  newReviews: number;
};

// For admin dashboard platform-wide stats
export type PlatformStats = {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSellerApprovals: number;
  openSupportTickets: number;
};

// For seller dashboard stats cards
export type SellerDashboardStats = {
  totalSales: number;
  totalOrders: number;
  activeListings: number;
  averageRating: number;
  lowStockCount: number;
  ordersToday: number;
};
