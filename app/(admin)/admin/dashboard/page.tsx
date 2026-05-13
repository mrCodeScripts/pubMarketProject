import Link from "next/link";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockPlatformStats,
  mockOrderSummaries,
  mockUsers,
  mockSellersWithOwner,
  mockSellerAnalytics,
} from "@/lib/mockup/pubMarket-data-mockup";
import { OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning-bg text-warning-fg",
  confirmed: "bg-pm-green-100 text-pm-green-800",
  packed: "bg-pm-green-100 text-pm-green-800",
  out_for_delivery: "bg-pm-gold-100 text-pm-gold-800",
  delivered: "bg-success-bg text-success-fg",
  cancelled: "bg-danger-bg text-danger-fg",
};
const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const stats = [
  {
    label: "Total Users",
    value: "1,284",
    icon: Users,
    trend: "+12%",
    href: "/admin/users",
  },
  {
    label: "Active Sellers",
    value: "87",
    icon: Store,
    trend: "+5%",
    href: "/admin/sellers",
  },
  {
    label: "Total Products",
    value: "643",
    icon: Package,
    trend: "+18%",
    href: "/admin/products",
  },
  {
    label: "Total Orders",
    value: "4,821",
    icon: ShoppingBag,
    trend: "+24%",
    href: "/admin/orders",
  },
  {
    label: "Mock Revenue",
    value: "₱2.84M",
    icon: TrendingUp,
    trend: "+31%",
    href: "/admin/orders",
  },
  {
    label: "Pending Sellers",
    value: "5",
    icon: AlertCircle,
    trend: "review",
    href: "/admin/sellers",
  },
];

export default function AdminDashboardPage() {
  const recentOrders = mockOrderSummaries.slice(0, 5);
  const recentUsers = mockUsers.slice(0, 5);
  const pendingSellers = mockSellersWithOwner.filter(
    (s) => s.status === "pending",
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-medium text-success-fg bg-success-bg px-1.5 py-0.5 rounded-full">
                      {s.trend}
                    </span>
                  </div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Pending seller approvals alert */}
      {pendingSellers.length > 0 && (
        <Card className="border-pm-gold-300 bg-pm-gold-50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-pm-gold-700 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-pm-gold-800">
                  {pendingSellers.length} seller application
                  {pendingSellers.length > 1 ? "s" : ""} pending review
                </p>
                <p className="text-xs text-pm-gold-700">
                  Review and approve sellers to let them list products.
                </p>
              </div>
            </div>
            <Link href="/admin/sellers">
              <Button
                size="sm"
                className="bg-pm-gold-600 hover:bg-pm-gold-700 text-white border-0 flex-shrink-0"
              >
                Review Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Recent Orders
            </CardTitle>
            <Link href="/admin/orders">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 px-2"
              >
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">
                        {order.id}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {order.seller.shopName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge
                        className={`text-[10px] px-1.5 py-0.5 border-0 ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        ₱{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Recent Signups
            </CardTitle>
            <Link href="/admin/users">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 px-2"
              >
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentUsers.map((user) => (
                <Link key={user.id} href={`/admin/users/${user.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-muted text-xs">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] capitalize flex-shrink-0"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics strip */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Revenue — Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-end gap-2 h-24">
            {mockSellerAnalytics.map((day) => {
              const max = Math.max(
                ...mockSellerAnalytics.map((d) => d.revenue),
              );
              const pct = (day.revenue / max) * 100;
              return (
                <div
                  key={day.id}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-primary/20 rounded-t-sm relative"
                    style={{ height: `${pct}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-PH", {
                      weekday: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>
              Total: ₱
              {mockSellerAnalytics
                .reduce((s, d) => s + d.revenue, 0)
                .toLocaleString()}
            </span>
            <span>
              {mockSellerAnalytics.reduce((s, d) => s + d.ordersCount, 0)}{" "}
              orders
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
