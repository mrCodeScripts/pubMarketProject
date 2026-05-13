"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { Slider } from "@/components/ui/slider";
import {
  mockProducts,
  mockCategories,
} from "@/lib/mockup/pubMarket-data-mockup";
import { ProductCard as ProdCard, ProductLocation, ProductFilters } from "@/lib/types";
// import type { ProductCard, ProductFilters } from "@/lib/types/database";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  categorySlug: null,
  province: null,
  city: null,
  barangay: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  sortBy: "newest",
  page: 1,
  pageSize: 20,
};

function ProductCard({ product }: { product: ProdCard }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.thumbnailUrl ?? "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-white text-[10px] px-1.5 border-0">
              -{discount}%
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[11px] text-muted-foreground truncate">
            {product.seller.shopName}
          </p>
          <p className="text-sm font-medium line-clamp-2 mt-0.5 flex-1 leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
            <span className="text-xs text-muted-foreground">
              {product.averageRating} ({product.totalReviews})
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {product.totalSold} sold
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-bold text-primary">
              ₱{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₱{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {product.location.city}
            </span>
            {product.category && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {product.category.icon} {product.category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterPanel({
  filters,
  setFilters,
}: {
  filters: ProductFilters;
  setFilters: (f: ProductFilters) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Category</Label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilters({ ...filters, categorySlug: null })}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${!filters.categorySlug ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary"}`}
          >
            All
          </button>
          {mockCategories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters({ ...filters, categorySlug: cat.slug })}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${filters.categorySlug === cat.slug ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary"}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Location</Label>
        <Input
          placeholder="Province"
          value={filters.province ?? ""}
          onChange={(e) =>
            setFilters({ ...filters, province: e.target.value || null })
          }
        />
        <Input
          placeholder="City"
          value={filters.city ?? ""}
          onChange={(e) =>
            setFilters({ ...filters, city: e.target.value || null })
          }
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Min Rating</Label>
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() =>
                setFilters({ ...filters, minRating: r === 0 ? null : r })
              }
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${filters.minRating === (r === 0 ? null : r) ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"}`}
            >
              {r === 0 ? (
                "All"
              ) : (
                <>
                  <Star className="w-2.5 h-2.5" />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setFilters(DEFAULT_FILTERS)}
      >
        <X className="w-3.5 h-3.5 mr-1.5" /> Clear Filters
      </Button>
    </div>
  );
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = mockProducts.filter((p) => p.isActive);
    if (filters.search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    if (filters.categorySlug)
      result = result.filter((p) => p.category?.slug === filters.categorySlug);
    if (filters.city)
      result = result.filter((p) =>
        p.location.city.toLowerCase().includes(filters.city!.toLowerCase()),
      );
    if (filters.minRating)
      result = result.filter((p) => p.averageRating >= filters.minRating!);
    if (filters.sortBy === "price_asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sortBy === "price_desc")
      result = [...result].sort((a, b) => b.price - a.price);
    if (filters.sortBy === "most_popular")
      result = [...result].sort((a, b) => b.totalSold - a.totalSold);
    return result;
  }, [filters]);

  const activeFilterCount = [
    filters.categorySlug,
    filters.city,
    filters.province,
    filters.minRating,
  ].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select
          value={filters.sortBy}
          onValueChange={(v) =>
            setFilters({ ...filters, sortBy: v as ProductFilters["sortBy"] })
          }
        >
          <SelectTrigger className="w-40 hidden sm:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low–High</SelectItem>
            <SelectItem value="price_desc">Price: High–Low</SelectItem>
            <SelectItem value="most_popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <div>
            <Button
              variant="outline"
              size="icon"
              className="relative md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-white border-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-primary text-white border-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </p>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        </aside>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-3">
            {filtered.length} products found
          </p>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                No products match your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="w-12 h-12 rounded-full shadow-lg">
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
