import Link from "next/link";
import { ChevronLeft, Check, X, Star, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockSellersWithOwner,
  mockOrderSummaries,
} from "@/lib/mockup/pubMarket-data-mockup";

export default function AdminSellerDetailPage({
  params,
}: {
  params: { sellerId: string };
}) {
  const seller =
    mockSellersWithOwner.find((s) => s.id === params.sellerId) ??
    mockSellersWithOwner[0];
  const isPending = seller.status === "pending";
  const isApproved = seller.status === "approved";

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/sellers">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Seller Detail</h1>
        <Badge
          className={`text-[10px] border-0 ml-auto capitalize ${
            seller.status === "approved"
              ? "bg-success-bg text-success-fg"
              : seller.status === "pending"
                ? "bg-warning-bg text-warning-fg"
                : "bg-danger-bg text-danger-fg"
          }`}
        >
          {seller.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary text-white text-lg">
                {seller.shopName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">{seller.shopName}</h2>
              <p className="text-sm text-muted-foreground">
                {seller.shopDescription}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {seller.location.fullAddress ?? seller.location.city}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-medium">{seller.owner.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{seller.owner.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">BIR TIN</p>
              <p className="font-mono font-medium">{seller.birTin}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Applied</p>
              <p className="font-medium">
                {new Date(seller.createdAt).toLocaleDateString("en-PH")}
              </p>
            </div>
          </div>

          {seller.birDocumentUrl && (
            <div>
              <p className="text-xs font-semibold mb-2">BIR Document</p>
              <div className="rounded-lg border border-border overflow-hidden h-40 bg-muted flex items-center justify-center">
                <img
                  src={seller.birDocumentUrl}
                  alt="BIR"
                  className="h-full object-contain"
                />
              </div>
            </div>
          )}

          {isPending && (
            <div className="flex gap-2 pt-1">
              <Button className="flex-1 bg-success-fg hover:bg-pm-green-700 text-white flex items-center gap-2">
                <Check className="w-4 h-4" /> Approve Seller
              </Button>
              <Button
                variant="destructive"
                className="flex-1 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isApproved && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Seller Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Sales",
                value: `₱${seller.stats.totalSales.toLocaleString()}`,
              },
              { label: "Total Orders", value: seller.stats.totalOrders },
              { label: "Avg Rating", value: `${seller.stats.averageRating} ★` },
              { label: "Reviews", value: seller.stats.totalReviews },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-muted p-3 text-center"
              >
                <p className="text-lg font-bold text-primary">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
