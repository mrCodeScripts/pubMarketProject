export type Review = {
  id: string;
  productId: string;
  sellerId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  isFlagged: boolean;
  flagReason: string | null;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
};
