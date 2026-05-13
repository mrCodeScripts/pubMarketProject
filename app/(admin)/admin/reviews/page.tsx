"use client";
import { useState } from "react";
import Link from "next/link";
import { Flag, Trash2, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockReviews } from "@/lib/mockup/pubMarket-data-mockup";
import type { Review } from "@/lib/types/database";

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = reviews.filter(
    (r) => ratingFilter === "all" || r.rating === parseInt(ratingFilter),
  );
  const flag = (id: string) =>
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFlagged: !r.isFlagged } : r)),
    );
  const remove = (id: string) =>
    setReviews((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length} total reviews
        </p>
      </div>
      <Select value={ratingFilter} onValueChange={setRatingFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          {[5, 4, 3, 2, 1].map((r) => (
            <SelectItem key={r} value={String(r)}>
              {r} ★
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-3">
        {filtered.map((review) => (
          <div
            key={review.id}
            className={`rounded-lg border p-4 space-y-2 ${review.isFlagged ? "border-danger-bg bg-danger-bg/20" : "border-border bg-card"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs bg-muted">
                    {review.customer.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {review.customer.fullName}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i <= review.rating ? "fill-pm-gold-500 text-pm-gold-500" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {review.isFlagged && (
                  <Badge className="bg-danger-bg text-danger-fg border-0 text-[10px]">
                    Flagged
                  </Badge>
                )}
                <Link href={`/products/${review.productId}`} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-warning-fg"
                  onClick={() => flag(review.id)}
                >
                  <Flag className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(review.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground pl-9">
                {review.comment}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground pl-9">
              {new Date(review.createdAt).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export { AdminReviewsPage as default };
