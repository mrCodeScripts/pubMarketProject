// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/wishlist/page.tsx ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockWishlistItems } from "@/lib/mockup/pubMarket-data-mockup";
import type { WishlistItem } from "@/lib/types/database";

export function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlistItems);
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Heart className="w-9 h-9 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Save products you love to buy later.
          </p>
        </div>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-destructive" />
        My Wishlist ({items.length})
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const p = item.product;
          const discount = p.originalPrice
            ? Math.round((1 - p.price / p.originalPrice) * 100)
            : null;
          return (
            <div
              key={item.id}
              className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-7 w-7 bg-white/80 hover:bg-white text-destructive rounded-full"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Link href={`/products/${p.slug}`}>
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img
                    src={p.thumbnailUrl ?? "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {discount && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-white text-[10px] px-1.5 py-0.5 border-0">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <p className="text-xs text-muted-foreground truncate">
                  {p.seller.shopName}
                </p>
                <Link href={`/products/${p.slug}`}>
                  <p className="text-sm font-medium line-clamp-2 mt-0.5 hover:text-primary">
                    {p.name}
                  </p>
                </Link>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
                  <span className="text-xs text-muted-foreground">
                    {p.averageRating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-bold text-primary">
                    ₱{p.price.toFixed(2)}
                  </span>
                  {p.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₱{p.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5 mb-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {p.location.city}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full h-7 text-xs flex items-center gap-1"
                  disabled={p.stock === 0}
                >
                  <ShoppingCart className="w-3 h-3" />
                  {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { WishlistPage as default };
