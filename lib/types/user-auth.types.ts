export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  role: UserRole;
  location: UserLocation | null;
  sellerStatus: SellerStatus | null;
  isSuspended: boolean;
  createdAt: string;
};

export type UserLocation = {
  province: string;
  city: string;
  barangay: string;
  postalCode: string | null;
};
