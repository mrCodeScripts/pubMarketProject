export type ProductFilters = {
  search: string;
  categorySlug: string | null;
  province: string | null;
  city: string | null;
  barangay: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  sortBy: "newest" | "price_asc" | "price_desc" | "most_popular";
  page: number;
  pageSize: number;
};
