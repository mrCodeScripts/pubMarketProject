"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  MapPin,
  ShoppingCart,
  Zap,
  Store,
  Package,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  mockProductWithDetails,
  mockProducts,
} from "@/lib/mockup/pubMarket-data-mockup";
import type { Review } from "@/lib/types/database";

function StarRow({ rating, total }: { rating: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-pm-gold-500 text-pm-gold-500" : "text-muted-foreground"}`}
        />
      ))}
      <span className="text-sm font-semibold">{rating}</span>
      <span className="text-xs text-muted-foreground">({total} reviews)</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Avatar className="w-7 h-7">
          <AvatarImage src={review.customer.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xs bg-muted">
            {review.customer.fullName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-medium">{review.customer.fullName}</p>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= review.rating ? "fill-pm-gold-500 text-pm-gold-500" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {new Date(review.createdAt).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground pl-9">{review.comment}</p>
      )}
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = mockProductWithDetails;
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const related = mockProducts
    .filter(
      (p) => p.category?.slug === product.category?.slug && p.id !== product.id,
    )
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <Link href="/products">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground h-8 px-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="aspect-square rounded-xl bg-muted overflow-hidden border border-border">
            <img
              src={
                product.images[selectedImg]?.url ??
                product.thumbnailUrl ??
                "/placeholder.png"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImg ? "border-primary" : "border-border"}`}
                >
                  <img
                    src={img.url}
                    alt={img.altText ?? ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category.icon} {product.category.name}
            </Badge>
          )}
          <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
          <StarRow
            rating={product.averageRating}
            total={product.totalReviews}
          />
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              ₱{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  ₱{product.originalPrice.toFixed(2)}
                </span>
                <Badge className="bg-destructive text-white border-0">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span
              className={
                product.stock === 0
                  ? "text-destructive"
                  : product.stock <= 5
                    ? "text-warning-fg"
                    : "text-success-fg"
              }
            >
              {product.stock === 0
                ? "Out of Stock"
                : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : `${product.stock} ${product.unit}s available`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {product.location.barangay}, {product.location.city},{" "}
            {product.location.province}
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  −
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {qty}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Link href="/login" className="flex-1">
              <Button
                className="w-full flex items-center gap-2"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={product.stock === 0}
              >
                <Zap className="w-4 h-4" /> Buy Now
              </Button>
            </Link>
          </div>
          {product.aiGeneratedDescription && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              ✨ Description generated with AI
            </p>
          )}
          <Card className="mt-2">
            <CardContent className="p-3 flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={product.seller.shopLogoUrl ?? undefined} />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {product.seller.shopName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {product.seller.shopName}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
                  <span className="text-xs text-muted-foreground">
                    {product.seller.stats.averageRating} ·{" "}
                    {product.seller.stats.totalReviews} reviews
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                <Store className="w-3.5 h-3.5" /> Shop
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {product.description && (
        <section>
          <h2 className="text-base font-semibold mb-2">Product Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </section>
      )}
      <Separator />
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">
            Reviews ({product.totalReviews})
          </h2>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-pm-gold-500 text-pm-gold-500" />
            <span className="text-sm font-bold">{product.averageRating}</span>
          </div>
        </div>
        <div className="space-y-4">
          {product.reviews.map((r, i) => (
            <div key={r.id}>
              <ReviewCard review={r} />
              {i < product.reviews.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <Link href="/login">
          <Button variant="outline" className="mt-4 w-full sm:w-auto">
            Log in to write a review
          </Button>
        </Link>
      </section>
      {related.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-3">
            More from {product.category?.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={p.thumbnailUrl ?? "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2">{p.name}</p>
                    <p className="text-xs font-bold text-primary mt-1">
                      ₱{p.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
