// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/orders/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockOrderSummaries } from "@/lib/mockup/pubMarket-data-mockup";
import type { OrderSummary, OrderStatus } from "@/lib/types/database";

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

function OrderCard({ order }: { order: OrderSummary }) {
  const config = statusConfig[order.status];
  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-sm font-semibold">{order.seller.shopName}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {order.id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                className={`text-[10px] px-2 py-0.5 border-0 ${config.color}`}
              >
                {config.label}
              </Badge>
              <span className="text-sm font-bold text-primary">
                ₱{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {order.items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0"
              >
                <img
                  src={item.productImage ?? "/placeholder.png"}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyOrders({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Package className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No {label} orders yet.</p>
    </div>
  );
}

export function OrdersPage() {
  const tabs = [
    { value: "all", label: "All", filter: () => true },
    {
      value: "active",
      label: "Active",
      filter: (o: OrderSummary) =>
        ["pending", "confirmed", "packed", "out_for_delivery"].includes(
          o.status,
        ),
    },
    {
      value: "delivered",
      label: "Delivered",
      filter: (o: OrderSummary) => o.status === "delivered",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      filter: (o: OrderSummary) => o.status === "cancelled",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" /> My Orders
      </h1>
      <Tabs defaultValue="all">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => {
          const filtered = mockOrderSummaries.filter(tab.filter);
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-3 mt-0"
            >
              {filtered.length === 0 ? (
                <EmptyOrders
                  label={
                    tab.label === "All" ? "recent" : tab.label.toLowerCase()
                  }
                />
              ) : (
                filtered.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
export { OrdersPage as default };
