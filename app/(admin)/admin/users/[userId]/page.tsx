import Link from "next/link";
import { ChevronLeft, ShieldOff, Shield, Trash2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  mockUsers,
  mockOrderSummaries,
  mockSellers,
} from "@/lib/mockup/pubMarket-data-mockup";
import type { UserRole, OrderStatus } from "@/lib/types/database";

const roleColors: Record<UserRole, string> = {
  customer: "bg-muted text-muted-foreground",
  seller: "bg-pm-green-100 text-pm-green-800",
  admin: "bg-pm-gold-100 text-pm-gold-800",
};
const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning-bg text-warning-fg",
  confirmed: "bg-pm-green-100 text-pm-green-800",
  packed: "bg-pm-green-100 text-pm-green-800",
  out_for_delivery: "bg-pm-gold-100 text-pm-gold-800",
  delivered: "bg-success-bg text-success-fg",
  cancelled: "bg-danger-bg text-danger-fg",
};

export default function AdminUserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = mockUsers.find((u) => u.id === params.userId) ?? mockUsers[0];
  const userOrders = mockOrderSummaries.slice(0, 3);
  const userSeller = mockSellers.find((s) => s.userId === user.id);
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">User Detail</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-primary text-white text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge
                    className={`text-[10px] border-0 capitalize ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    className={`text-[10px] border-0 ${user.isSuspended ? "bg-danger-bg text-danger-fg" : "bg-success-bg text-success-fg"}`}
                  >
                    {user.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Province</p>
              <p className="font-medium">{user.location?.province ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">City</p>
              <p className="font-medium">{user.location?.city ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Barangay</p>
              <p className="font-medium">{user.location?.barangay ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Joined</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-PH")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              {user.isSuspended ? (
                <>
                  <Shield className="w-3.5 h-3.5" /> Unsuspend
                </>
              ) : (
                <>
                  <ShieldOff className="w-3.5 h-3.5" /> Suspend
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {userSeller && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" /> Seller Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shop</span>
              <span className="font-medium">{userSeller.shopName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                className={`text-[10px] border-0 ${userSeller.status === "approved" ? "bg-success-bg text-success-fg" : userSeller.status === "pending" ? "bg-warning-bg text-warning-fg" : "bg-danger-bg text-danger-fg"}`}
              >
                {userSeller.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="font-bold text-primary">
                ₱{userSeller.stats.totalSales.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span>{userSeller.stats.averageRating} ★</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {userOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">
                      {order.id}
                    </p>
                    <p className="text-sm font-medium">
                      {order.seller.shopName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`text-[10px] border-0 ${statusColors[order.status]}`}
                    >
                      {order.status.replace("_", " ")}
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
    </div>
  );
}
