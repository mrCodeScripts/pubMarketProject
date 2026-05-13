export type Address = {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  postalCode: string | null;
  coords: Coords | null;
  isDefault: boolean;
};

export type DeliveryAddressSnapshot = {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  postalCode: string | null;
  coords: Coords | null;
};
