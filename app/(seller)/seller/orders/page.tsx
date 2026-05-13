"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customer: string;
  items: string;
  itemCount: number;
  total: number;
  status: "pending" | "active" | "completed" | "cancelled";
  date: string;
  address: string;
}

const ORDERS: Order[] = [
  {
    id: "ORD-0891",
    customer: "Juan dela Cruz",
    items: "Kangkong x2, Sitaw x1",
    itemCount: 3,
    total: 145,
    status: "pending",
    date: "May 10, 2026",
    address: "Purok 4, Tambacan, Iligan City",
  },
  {
    id: "ORD-0890",
    customer: "Ana Reyes",
    items: "Tomatoes 1kg, Malunggay x1",
    itemCount: 2,
    total: 210,
    status: "active",
    date: "May 10, 2026",
    address: "Brgy Carmen, Cagayan de Oro",
  },
  {
    id: "ORD-0889",
    customer: "Ben Santos",
    items: "Sweet Potato 2kg",
    itemCount: 1,
    total: 180,
    status: "completed",
    date: "May 9, 2026",
    address: "Purok 2, Hinaplanon, Iligan City",
  },
  {
    id: "ORD-0888",
    customer: "Liza Gomez",
    items: "Pechay x3, Ampalaya x1",
    itemCount: 4,
    total: 320,
    status: "completed",
    date: "May 9, 2026",
    address: "Purok 1, Palao, Iligan City",
  },
  {
    id: "ORD-0887",
    customer: "Rod Tan",
    items: "Camote Tops x5",
    itemCount: 5,
    total: 95,
    status: "cancelled",
    date: "May 8, 2026",
    address: "Ditucalan, Iligan City",
  },
  {
    id: "ORD-0886",
    customer: "Fe Macaraeg",
    items: "Kangkong x3",
    itemCount: 3,
    total: 75,
    status: "pending",
    date: "May 8, 2026",
    address: "Tibanga, Iligan City",
  },
  {
    id: "ORD-0885",
    customer: "Raul Aquino",
    items: "Okra x2, Sitaw x2",
    itemCount: 4,
    total: 130,
    status: "active",
    date: "May 7, 2026",
    address: "Bonbonon, Iligan City",
  },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200",
  },
  active: {
    label: "Active",
    cls: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
  },
  completed: {
    label: "Completed",
    cls: "bg-pm-stone-100 text-pm-stone-700 border-pm-stone-200",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-pm-red-100 text-pm-red-700 border-pm-red-200",
  },
};

const TABS = ["all", "pending", "active", "completed", "cancelled"] as const;

export default function SellerOrdersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("all");

  const filtered = ORDERS.filter((o) => {
    const matchTab = tab === "all" || o.status === tab;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const countByStatus = (s: string) =>
    s === "all" ? ORDERS.length : ORDERS.filter((o) => o.status === s).length;

  return (
    <SellerLayout title="Manage Orders">
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manage Orders</h2>
          <p className="text-sm text-muted-foreground">
            {ORDERS.length} total orders
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full sm:w-auto h-auto flex flex-wrap sm:flex-nowrap gap-1 bg-muted p-1 rounded-xl overflow-x-auto">
            {TABS.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={cn(
                  "capitalize text-xs sm:text-sm rounded-lg px-3 py-1.5 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm",
                  t === "pending" &&
                    tab === t &&
                    "data-[state=active]:text-pm-gold-700",
                  t === "active" &&
                    tab === t &&
                    "data-[state=active]:text-pm-green-700",
                )}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full w-5 h-5 text-xs font-bold",
                    tab === t
                      ? "bg-pm-green-100 text-pm-green-800"
                      : "bg-pm-stone-200 text-pm-stone-600",
                  )}
                >
                  {countByStatus(t)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((t) => (
            <TabsContent key={t} value={t} className="mt-3">
              {/* Desktop Table */}
              <Card className="border-border shadow-none hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {[
                          "Order ID",
                          "Customer",
                          "Items",
                          "Total",
                          "Status",
                          "Date",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-12 text-center text-muted-foreground text-sm"
                          >
                            No orders found.
                          </td>
                        </tr>
                      )}
                      {filtered.map((o) => (
                        <tr
                          key={o.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-pm-green-700 text-xs">
                            {o.id}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground text-sm">
                              {o.customer}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                              {o.address}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-foreground truncate max-w-[160px]">
                              {o.items}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.itemCount} item{o.itemCount > 1 ? "s" : ""}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-bold text-foreground">
                            ₱{o.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={cn(
                                "text-xs border",
                                STATUS_MAP[o.status].cls,
                              )}
                            >
                              {STATUS_MAP[o.status].label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {o.date}
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/seller/orders/${o.id}`}>
                              <button className="flex items-center gap-1 text-xs text-pm-green-600 hover:text-pm-green-800 font-medium">
                                View <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    No orders found.
                  </p>
                )}
                {filtered.map((o) => (
                  <Link key={o.id} href={`/seller/orders/${o.id}`}>
                    <Card className="border-border shadow-none hover:bg-muted/20 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-pm-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Package className="w-4 h-4 text-pm-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-bold text-pm-green-700">
                                  {o.id}
                                </span>
                                <Badge
                                  className={cn(
                                    "text-xs border",
                                    STATUS_MAP[o.status].cls,
                                  )}
                                >
                                  {STATUS_MAP[o.status].label}
                                </Badge>
                              </div>
                              <p className="text-sm font-semibold text-foreground">
                                {o.customer}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {o.items}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-foreground">
                              ₱{o.total.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SellerLayout>
  );
}
