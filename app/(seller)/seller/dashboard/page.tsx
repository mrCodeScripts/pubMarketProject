"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Star,
  Plus,
  Eye,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SellerLayout from "@/components/custom/layout/sellerLayout";

const STATS = [
  {
    label: "Total Sales",
    value: "₱187,450",
    sub: "+12% vs last month",
    icon: TrendingUp,
    color: "text-pm-green-600",
    bg: "bg-pm-green-50",
    positive: true,
  },
  {
    label: "Orders Today",
    value: "12",
    sub: "3 pending action",
    icon: ShoppingBag,
    color: "text-pm-gold-600",
    bg: "bg-pm-gold-50",
    positive: true,
  },
  {
    label: "Active Listings",
    value: "34",
    sub: "2 out of stock",
    icon: Package,
    color: "text-pm-stone-600",
    bg: "bg-pm-stone-100",
    positive: false,
  },
  {
    label: "Avg Rating",
    value: "4.8",
    sub: "215 reviews",
    icon: Star,
    color: "text-pm-gold-500",
    bg: "bg-pm-gold-50",
    positive: true,
  },
];

const RECENT_ORDERS = [
  {
    id: "ORD-0891",
    customer: "Juan dela Cruz",
    items: "Kangkong x2, Sitaw x1",
    total: "₱145.00",
    status: "pending",
    date: "May 10, 2026",
  },
  {
    id: "ORD-0890",
    customer: "Ana Reyes",
    items: "Tomatoes 1kg, Malunggay x1",
    total: "₱210.00",
    status: "active",
    date: "May 10, 2026",
  },
  {
    id: "ORD-0889",
    customer: "Ben Santos",
    items: "Sweet Potato 2kg",
    total: "₱180.00",
    status: "completed",
    date: "May 9, 2026",
  },
  {
    id: "ORD-0888",
    customer: "Liza Gomez",
    items: "Pechay x3, Ampalaya x1",
    total: "₱320.00",
    status: "completed",
    date: "May 9, 2026",
  },
  {
    id: "ORD-0887",
    customer: "Rod Tan",
    items: "Camote Tops x5",
    total: "₱95.00",
    status: "cancelled",
    date: "May 8, 2026",
  },
];

const LOW_STOCK = [
  { name: "Kangkong", stock: 4, unit: "bundles" },
  { name: "Okra", stock: 2, unit: "kg" },
  { name: "Sweet Potato", stock: 0, unit: "kg" },
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

export default function SellerDashboardPage() {
  return (
    <SellerLayout title="Dashboard">
      <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Welcome back, Maria! 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here's what's happening with your shop today.
            </p>
          </div>
          <Link href="/seller/products/new">
            <Button className="bg-pm-green-600 hover:bg-pm-green-700 text-white gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <Card key={label} className="border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-medium text-muted-foreground leading-snug">
                    {label}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-border shadow-none">
            <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Recent Orders
              </CardTitle>
              <Link href="/seller/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-pm-green-600 hover:text-pm-green-700 gap-1 h-7 px-2"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        Order
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                        Customer
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                        Items
                      </th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        Total
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {RECENT_ORDERS.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/seller/orders/${o.id}`}
                            className="font-medium text-pm-green-700 hover:underline text-xs"
                          >
                            {o.id}
                          </Link>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {o.customer}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs font-medium text-foreground">
                            {o.customer}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground truncate max-w-[160px] block">
                            {o.items}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs font-semibold text-foreground">
                            {o.total}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            className={`text-xs border ${STATUS_MAP[o.status].cls}`}
                          >
                            {STATUS_MAP[o.status].label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Low Stock */}
            <Card className="border-border shadow-none">
              <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0 border-b border-border">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-pm-gold-600" />
                  <CardTitle className="text-sm font-semibold">
                    Low Stock Alerts
                  </CardTitle>
                </div>
                <Link href="/seller/inventory">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-pm-green-600 gap-1 h-7 px-2"
                  >
                    Manage <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {LOW_STOCK.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <Badge
                      className={`text-xs border ${
                        item.stock === 0
                          ? "bg-pm-red-100 text-pm-red-800 border-pm-red-200"
                          : "bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200"
                      }`}
                    >
                      {item.stock === 0
                        ? "Out of stock"
                        : `${item.stock} ${item.unit}`}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border shadow-none">
              <CardHeader className="px-4 py-4 border-b border-border">
                <CardTitle className="text-sm font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {[
                  {
                    label: "Add New Product",
                    href: "/seller/products/new",
                    icon: Plus,
                    variant: "default" as const,
                  },
                  {
                    label: "View All Orders",
                    href: "/seller/orders",
                    icon: ShoppingBag,
                    variant: "outline" as const,
                  },
                  {
                    label: "See Reviews",
                    href: "/seller/reviews",
                    icon: Star,
                    variant: "outline" as const,
                  },
                  {
                    label: "View My Shop",
                    href: "/seller/shop",
                    icon: Eye,
                    variant: "outline" as const,
                  },
                ].map(({ label, href, icon: Icon, variant }) => (
                  <Link key={href} href={href} className="block">
                    <Button
                      variant={variant}
                      size="sm"
                      className={`w-full justify-start gap-2 text-sm font-medium ${variant === "default" ? "bg-pm-green-600 hover:bg-pm-green-700 text-white" : ""}`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
