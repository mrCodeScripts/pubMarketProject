import Link from "next/link";
import { ChevronLeft, Trash2, ExternalLink, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockProductWithDetails } from "@/lib/mockup/pubMarket-data-mockup";

export function AdminProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = mockProductWithDetails;
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Product Detail</h1>
        <div className="ml-auto flex gap-2">
          <Link href={`/products/${product.slug}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1.5 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={product.thumbnailUrl ?? "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold">{product.name}</h2>
              {product.category && (
                <Badge variant="secondary" className="text-[10px] mt-1">
                  {product.category.icon} {product.category.name}
                </Badge>
              )}
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3.5 h-3.5 fill-pm-gold-500 text-pm-gold-500" />
                <span className="text-sm">
                  {product.averageRating} ({product.totalReviews} reviews)
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {product.location.city}, {product.location.province}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-bold text-primary">
                ₱{product.price.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="font-medium">
                {product.stock} {product.unit}s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Sold</p>
              <p className="font-medium">{product.totalSold}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                className={`text-[10px] border-0 ${product.isActive ? "bg-success-bg text-success-fg" : "bg-muted text-muted-foreground"}`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          {product.description && (
            <div>
              <p className="text-xs font-semibold mb-1">Description</p>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
          <Separator />
          <div>
            <p className="text-xs font-semibold mb-2">Seller</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {product.seller.shopName[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{product.seller.shopName}</p>
                <p className="text-xs text-muted-foreground">
                  {product.seller.location.city}
                </p>
              </div>
              <Link
                href={`/admin/sellers/${product.seller.id}`}
                className="ml-auto"
              >
                <Button variant="outline" size="sm" className="text-xs h-7">
                  View Seller
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export { AdminProductDetailPage as default };
