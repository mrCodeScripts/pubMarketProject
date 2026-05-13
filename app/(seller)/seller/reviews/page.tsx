"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  reviewer: string;
  reviewerInitials: string;
  product: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    id: "r001",
    reviewer: "Juan dela Cruz",
    reviewerInitials: "JD",
    product: "Kangkong (Swamp Cabbage)",
    productId: "p001",
    rating: 5,
    comment:
      "Super fresh! Grabe talaga, parang galing sa taniman ngayon. Masustansya at malinis. Highly recommend!",
    date: "May 9, 2026",
  },
  {
    id: "r002",
    reviewer: "Ana Reyes",
    reviewerInitials: "AR",
    product: "Tomatoes - 1kg Pack",
    productId: "p003",
    rating: 4,
    comment:
      "Good quality tomatoes, very ripe and juicy. Delivery was fast. Will order again.",
    date: "May 8, 2026",
  },
  {
    id: "r003",
    reviewer: "Ben Santos",
    reviewerInitials: "BS",
    product: "Sweet Potato (Camote)",
    productId: "p004",
    rating: 5,
    comment:
      "Sarap ng kamote! Nilaga namin with pork ribs, perfect. Malaki pa ang laman.",
    date: "May 7, 2026",
  },
  {
    id: "r004",
    reviewer: "Liza Gomez",
    reviewerInitials: "LG",
    product: "Malunggay Leaves",
    productId: "p005",
    rating: 5,
    comment:
      "The malunggay is always so fresh. I buy every week from this shop. Best seller!",
    date: "May 7, 2026",
  },
  {
    id: "r005",
    reviewer: "Rod Tan",
    reviewerInitials: "RT",
    product: "Ampalaya (Bitter Gourd)",
    productId: "p006",
    rating: 3,
    comment:
      "The ampalaya was okay but some pieces were a bit small. Overall decent.",
    date: "May 6, 2026",
  },
  {
    id: "r006",
    reviewer: "Fe Macaraeg",
    reviewerInitials: "FM",
    product: "Kangkong (Swamp Cabbage)",
    productId: "p001",
    rating: 5,
    comment:
      "Sobrang sariwa! Lagi akong umaasa sa shop na ito para sa gulay. Sulit na sulit.",
    date: "May 5, 2026",
  },
  {
    id: "r007",
    reviewer: "Raul Aquino",
    reviewerInitials: "RA",
    product: "Sitaw (String Beans)",
    productId: "p002",
    rating: 4,
    comment:
      "Fresh at malusog yung sitaw. Good value for money. Fast delivery too!",
    date: "May 4, 2026",
  },
];

function StarDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            s,
            i <= rating
              ? "text-pm-gold-500 fill-pm-gold-500"
              : "text-pm-stone-300 fill-pm-stone-100",
          )}
        />
      ))}
    </div>
  );
}

export default function SellerReviewsPage() {
  const [productFilter, setProductFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const products = [...new Set(REVIEWS.map((r) => r.product))];
  const avg = (
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length
  ).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: REVIEWS.filter((rev) => rev.rating === r).length,
    pct:
      (REVIEWS.filter((rev) => rev.rating === r).length / REVIEWS.length) * 100,
  }));

  const filtered = REVIEWS.filter((r) => {
    const matchProd = productFilter === "all" || r.product === productFilter;
    const matchRating =
      ratingFilter === "all" || r.rating === parseInt(ratingFilter);
    return matchProd && matchRating;
  });

  return (
    <SellerLayout title="Reviews">
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {REVIEWS.length} total reviews
          </p>
        </div>

        {/* Rating Summary */}
        <Card className="border-border shadow-none">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center flex-shrink-0">
                <p className="text-5xl font-bold text-foreground">{avg}</p>
                <StarDisplay rating={Math.round(parseFloat(avg))} size="lg" />
                <p className="text-xs text-muted-foreground mt-1">
                  {REVIEWS.length} reviews
                </p>
              </div>
              <div className="flex-1 w-full space-y-1.5">
                {ratingDist.map(({ rating, count, pct }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4 text-right flex-shrink-0">
                      {rating}
                    </span>
                    <Star className="w-3 h-3 text-pm-gold-500 fill-pm-gold-500 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-pm-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pm-gold-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r} star{r > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              No reviews found for the selected filters.
            </p>
          )}
          {filtered.map((review) => (
            <Card key={review.id} className="border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-pm-green-100 text-pm-green-800 text-xs font-bold">
                      {review.reviewerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {review.reviewer}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarDisplay rating={review.rating} />
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <Link href={`/products/${review.productId}`}>
                        <Badge
                          variant="outline"
                          className="text-xs text-pm-green-700 border-pm-green-200 hover:bg-pm-green-50 gap-1 cursor-pointer flex-shrink-0"
                        >
                          {review.product.length > 20
                            ? review.product.substring(0, 20) + "…"
                            : review.product}
                          <ExternalLink className="w-3 h-3" />
                        </Badge>
                      </Link>
                    </div>
                    <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
}
