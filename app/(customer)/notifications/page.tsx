// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/notifications/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Package,
  Store,
  Star,
  Tag,
  Info,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockNotifications,
  mockCurrentUser,
} from "@/lib/mockup/pubMarket-data-mockup";
import type { Notification, NotificationType } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

const notifIcon: Record<string, React.ReactNode> = {
  order_placed: <Package className="w-4 h-4" />,
  order_confirmed: <Package className="w-4 h-4" />,
  order_packed: <Package className="w-4 h-4" />,
  order_out_for_delivery: <Package className="w-4 h-4" />,
  order_delivered: <Package className="w-4 h-4" />,
  order_cancelled: <Package className="w-4 h-4" />,
  seller_approved: <Store className="w-4 h-4" />,
  seller_rejected: <Store className="w-4 h-4" />,
  new_review: <Star className="w-4 h-4" />,
  low_stock: <Tag className="w-4 h-4" />,
  new_message: <Bell className="w-4 h-4" />,
  promo: <Tag className="w-4 h-4" />,
  system: <Info className="w-4 h-4" />,
};

function NotificationRow({ notif }: { notif: Notification }) {
  const href =
    notif.entityType === "order"
      ? `/orders/${notif.entityId}`
      : notif.entityType === "product"
        ? `/products/${notif.entityId}`
        : "#";

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex gap-3 p-4 rounded-lg border transition-colors hover:bg-muted/50",
          !notif.isRead
            ? "bg-accent/40 border-pm-green-200"
            : "bg-card border-border",
        )}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
            !notif.isRead
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {notifIcon[notif.type] ?? <Bell className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm",
                !notif.isRead ? "font-semibold" : "font-medium",
              )}
            >
              {notif.title}
            </p>
            {!notif.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {new Date(notif.createdAt).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(
    mockNotifications.filter((n) => n.userId === mockCurrentUser.id),
  );
  const unreadCount = notifs.filter((n) => !n.isRead).length;
  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white border-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </h1>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary flex items-center gap-1"
            onClick={markAllRead}
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Bell className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <NotificationRow key={n.id} notif={n} />
          ))}
        </div>
      )}
    </div>
  );
}
export { NotificationsPage as default };
