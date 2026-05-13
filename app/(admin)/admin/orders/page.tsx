"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOrderSummaries } from "@/lib/mockup/pubMarket-data-mockup";
import type { OrderSummary, OrderStatus } from "@/lib/types/database";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning-bg text-warning-fg",
  confirmed: "bg-pm-green-100 text-pm-green-800",
  packed: "bg-pm-green-100 text-pm-green-800",
  out_for_delivery: "bg-pm-gold-100 text-pm-gold-800",
  delivered: "bg-success-bg text-success-fg",
  cancelled: "bg-danger-bg text-danger-fg",
};

export function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = mockOrderSummaries.filter(
    (o) => statusFilter === "all" || o.status === statusFilter,
  );

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {mockOrderSummaries.length} total orders
        </p>
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {[
            "pending",
            "confirmed",
            "packed",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ].map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                  Seller
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">
                    {order.seller.shopName}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">
                    ₱{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] border-0 capitalize ${statusColors[order.status]}`}
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-PH")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export { AdminOrdersPage as default };
