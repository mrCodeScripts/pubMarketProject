// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/orders/[orderId]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
import Link from "next/link";
import { ChevronLeft, MapPin, Package, Map, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockOrderWithDetails } from "@/lib/mockup/pubMarket-data-mockup";
import type { OrderStatus } from "@/lib/types/database";

const steps: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "packed", label: "Packed" },
  { status: "out_for_delivery", label: "Out for Delivery" },
  { status: "delivered", label: "Delivered" },
];

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
];

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-warning-bg text-warning-fg" },
  confirmed: { label: "Confirmed", color: "bg-pm-green-100 text-pm-green-800" },
  packed: { label: "Packed", color: "bg-pm-green-100 text-pm-green-800" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-pm-gold-100 text-pm-gold-800",
  },
  delivered: { label: "Delivered", color: "bg-success-bg text-success-fg" },
  cancelled: { label: "Cancelled", color: "bg-danger-bg text-danger-fg" },
};

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = mockOrderWithDetails;
  const config = statusConfig[order.status];
  const currentStep = statusOrder.indexOf(order.status);
  const isDelivered = order.status === "delivered";
  const isOutForDelivery = order.status === "out_for_delivery";
  const isPending = order.status === "pending";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link href="/orders">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-bold flex items-center gap-2">
            Order Details
            <Badge
              className={`text-[10px] px-2 py-0.5 border-0 ${config.color}`}
            >
              {config.label}
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
        </div>
      </div>

      {/* Timeline */}
      {order.status !== "cancelled" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between relative">
              {/* progress bar */}
              <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-border mx-8" />
              <div
                className="absolute left-8 top-3.5 h-0.5 bg-primary transition-all"
                style={{ width: `${(currentStep / (steps.length - 1)) * 85}%` }}
              />
              {steps.map((step, i) => {
                const done = i <= currentStep;
                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center gap-1.5 z-10"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        done
                          ? "bg-primary border-primary text-white"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Package className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-border" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] text-center leading-tight max-w-12 ${done ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {isOutForDelivery && (
          <Link href={`/orders/${order.id}/track`} className="flex-1">
            <Button className="w-full flex items-center gap-2">
              <Map className="w-4 h-4" /> Track on Map
            </Button>
          </Link>
        )}
        {isDelivered && (
          <Button className="flex-1 flex items-center gap-2" variant="outline">
            <Star className="w-4 h-4" /> Leave Review
          </Button>
        )}
        {isPending && (
          <Button
            className="flex-1 flex items-center gap-2"
            variant="destructive"
          >
            <XCircle className="w-4 h-4" /> Cancel Order
          </Button>
        )}
      </div>

      {/* Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            {order.seller.shopName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex-shrink-0">
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
                  x{item.quantity} · ₱{item.unitPrice.toFixed(2)} each
                </p>
              </div>
              <span className="text-sm font-semibold flex-shrink-0">
                ₱{item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
          <Separator />
          <div className="space-y-1.5 text-sm">
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

      {/* Delivery Address */}
      <Card>
        <CardContent className="p-4 flex gap-3">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">
              {order.deliveryAddress.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.phone}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.street}, {order.deliveryAddress.barangay},{" "}
              {order.deliveryAddress.city}, {order.deliveryAddress.province}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardContent className="p-4 space-y-1.5 text-sm">
          <p className="font-medium mb-2">Payment Info</p>
          <div className="flex justify-between text-muted-foreground">
            <span>Method</span>
            <span className="capitalize">{order.paymentMethod ?? "Card"}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Reference</span>
            <span className="font-mono text-xs">{order.paymentReference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge className="bg-success-bg text-success-fg border-0 text-xs">
              Paid (Mock)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {order.customerNotes && (
        <Card>
          <CardContent className="p-4 text-sm">
            <p className="font-medium mb-1">Order Notes</p>
            <p className="text-muted-foreground">{order.customerNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
