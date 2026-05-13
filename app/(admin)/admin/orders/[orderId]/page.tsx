import Link from "next/link";
import { ChevronLeft, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockOrderWithDetails } from "@/lib/mockup/pubMarket-data-mockup";
import type { OrderStatus } from "@/lib/types/database";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning-bg text-warning-fg",
  confirmed: "bg-pm-green-100 text-pm-green-800",
  packed: "bg-pm-green-100 text-pm-green-800",
  out_for_delivery: "bg-pm-gold-100 text-pm-gold-800",
  delivered: "bg-success-bg text-success-fg",
  cancelled: "bg-danger-bg text-danger-fg",
};

export function AdminOrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = mockOrderWithDetails;
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Order Detail</h1>
        <Badge
          className={`ml-auto text-[10px] border-0 capitalize ${statusColors[order.status]}`}
        >
          {order.status.replace("_", " ")}
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Customer</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-1">
            <p className="font-medium">{order.customer.fullName}</p>
            <p className="text-muted-foreground">{order.customer.email}</p>
            <p className="text-muted-foreground">{order.customer.phone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Seller</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-1">
            <p className="font-medium">{order.seller.shopName}</p>
            <p className="text-muted-foreground">
              {order.seller.location.city}
            </p>
            <Link href={`/admin/sellers/${order.seller.id}`}>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-primary"
              >
                View Seller →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={item.productImage ?? "/placeholder.png"}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  x{item.quantity} · ₱{item.unitPrice.toFixed(2)}
                </p>
              </div>
              <span className="text-sm font-bold flex-shrink-0">
                ₱{item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₱{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₱{order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">
                ₱{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex gap-3 text-sm">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{order.deliveryAddress.fullName}</p>
            <p className="text-muted-foreground">
              {order.deliveryAddress.street}, {order.deliveryAddress.barangay},{" "}
              {order.deliveryAddress.city}
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="text-muted-foreground">Payment:</span>
              <span className="capitalize">{order.paymentMethod}</span>
              <Badge className="bg-success-bg text-success-fg border-0 text-[10px]">
                Paid (Mock)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export { AdminOrderDetailPage as default };
