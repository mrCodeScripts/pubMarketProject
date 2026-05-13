"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SellerLayout from "@/components/custom/layout/sellerLayout";

// Seeded mock data
const REVENUE_7D = [
  { date: "May 4", revenue: 1240, orders: 8 },
  { date: "May 5", revenue: 890, orders: 6 },
  { date: "May 6", revenue: 1580, orders: 11 },
  { date: "May 7", revenue: 2100, orders: 14 },
  { date: "May 8", revenue: 970, orders: 7 },
  { date: "May 9", revenue: 1760, orders: 12 },
  { date: "May 10", revenue: 1450, orders: 10 },
];

const REVENUE_30D = Array.from({ length: 30 }, (_, i) => ({
  date: `Apr ${i + 10}`,
  revenue: Math.floor(800 + Math.random() * 1800),
  orders: Math.floor(5 + Math.random() * 15),
}));

const TOP_PRODUCTS = [
  { name: "Malunggay Leaves", sold: 300, revenue: 4500, image: "🌿" },
  { name: "Tomatoes - 1kg Pack", sold: 210, revenue: 16800, image: "🍅" },
  { name: "Kangkong (Swamp Cabbage)", sold: 120, revenue: 3000, image: "🥬" },
  { name: "Sweet Potato (Camote)", sold: 145, revenue: 8700, image: "🍠" },
  { name: "Sitaw (String Beans)", sold: 85, revenue: 2975, image: "🫘" },
];

const CUSTOMER_LOCATIONS = [
  { city: "Iligan City", count: 142, pct: 55 },
  { city: "Cagayan de Oro", count: 78, pct: 30 },
  { city: "Marawi City", count: 22, pct: 9 },
  { city: "Others", count: 16, pct: 6 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === "revenue"
            ? `₱${p.value.toLocaleString()}`
            : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const data = period === "7d" ? REVENUE_7D : REVENUE_30D;

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);

  return (
    <SellerLayout title="Analytics">
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Track your shop's performance
            </p>
          </div>
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as "7d" | "30d")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="7d" className="text-xs px-3">
                Last 7 days
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-3">
                Last 30 days
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Revenue",
              value: `₱${totalRevenue.toLocaleString()}`,
              color: "text-pm-green-700",
            },
            {
              label: "Total Orders",
              value: totalOrders,
              color: "text-foreground",
            },
            {
              label: "Avg per Order",
              value: `₱${Math.round(totalRevenue / totalOrders).toLocaleString()}`,
              color: "text-pm-gold-600",
            },
          ].map(({ label, value, color }) => (
            <Card key={label} className="border-border shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="border-border shadow-none">
          <CardHeader className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pm-green-600" /> Revenue
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {period === "7d" ? "Past 7 days" : "Past 30 days"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-2">
            <div className="h-52 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.55 0.155 150)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.55 0.155 150)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.005 75)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.012 75)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={period === "30d" ? 4 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.012 75)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      `₱${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.55 0.155 150)"
                    strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "oklch(0.55 0.155 150)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="border-border shadow-none">
          <CardHeader className="px-4 py-4 border-b border-border">
            <CardTitle className="text-sm font-semibold">
              Orders Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pb-2">
            <div className="h-44 sm:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  barSize={period === "7d" ? 28 : 10}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.005 75)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.012 75)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={period === "30d" ? 4 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "oklch(0.55 0.012 75)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="oklch(0.74 0.17 72)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Top Products */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-4 border-b border-border flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">
                Top Selling Products
              </CardTitle>
              <Link href="/seller/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-pm-green-600 gap-1 h-7 px-2"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">
                    #{i + 1}
                  </span>
                  <span className="text-xl">{p.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.sold} sold
                    </p>
                  </div>
                  <span className="text-sm font-bold text-pm-green-700 flex-shrink-0">
                    ₱{p.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Locations */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-4 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Customer Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {CUSTOMER_LOCATIONS.map((loc) => (
                <div key={loc.city}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {loc.city}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {loc.count} ({loc.pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-pm-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pm-green-500 rounded-full transition-all"
                      style={{ width: `${loc.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
                * Location data based on delivery addresses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
}
