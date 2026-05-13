"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  User,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered";

const STATUS_FLOW: {
  key: OrderStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200",
  confirmed: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
  packed: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
  out_for_delivery: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
  delivered: "bg-pm-stone-100 text-pm-stone-700 border-pm-stone-200",
};

const ORDER = {
  id: "ORD-0891",
  customer: { name: "Juan dela Cruz", phone: "+63 912 345 6789", avatar: "JD" },
  address: "Purok 4, Tambacan, Iligan City, Lanao del Norte",
  items: [
    { name: "Kangkong (Swamp Cabbage)", qty: 2, price: 25, image: "🥬" },
    { name: "Sitaw (String Beans)", qty: 1, price: 35, image: "🫘" },
  ],
  subtotal: 85,
  deliveryFee: 60,
  total: 145,
  date: "May 10, 2026 at 9:42 AM",
  notes: "Please pack separately",
};

const TIMELINE_EVENTS = [
  {
    status: "pending",
    time: "May 10, 2026 9:42 AM",
    note: "Order placed by customer",
  },
  {
    status: "confirmed",
    time: "May 10, 2026 10:05 AM",
    note: "Order confirmed by seller",
  },
];

interface PageProps {
  params: { orderId: string };
}

export default function SellerOrderDetailPage({ params }: PageProps) {
  const [status, setStatus] = useState<OrderStatus>("confirmed");
  const [selected, setSelected] = useState<OrderStatus>("confirmed");
  const [updating, setUpdating] = useState(false);
  const [notified, setNotified] = useState(false);
  const [orderIdState, setOrderIdState] = useState<string>("");

  const currentIdx = STATUS_FLOW.findIndex((s) => s.key === status);

  const handleUpdate = async () => {
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setStatus(selected);
    setNotified(true);
    setUpdating(false);
    setTimeout(() => setNotified(false), 3000);
  };

  useEffect(() => {
    const getOrderId = async () => {
      const { orderId } = await params;
      setOrderIdState(orderId);
    };
  }, [params]);

  return (
    <SellerLayout title={`Order ${orderIdState}`}>
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/seller/orders">
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {orderIdState}
                </h2>
                <Badge className={cn("text-xs border", STATUS_STYLE[status])}>
                  {STATUS_LABELS[status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Placed {ORDER.date}
              </p>
            </div>
          </div>
        </div>

        {/* Notification toast */}
        {notified && (
          <div className="bg-pm-green-50 border border-pm-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Bell className="w-4 h-4 text-pm-green-600 flex-shrink-0" />
            <p className="text-sm text-pm-green-800 font-medium">
              Status updated! Customer has been notified.
            </p>
          </div>
        )}

        {/* Timeline */}
        <Card className="border-border shadow-none">
          <CardHeader className="px-4 py-4 border-b border-border">
            <CardTitle className="text-sm font-semibold">
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between relative">
              {/* Progress bar */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0">
                <div
                  className="h-full bg-pm-green-500 transition-all duration-500"
                  style={{
                    width: `${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%`,
                  }}
                />
              </div>
              {STATUS_FLOW.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <div
                    key={s.key}
                    className="relative z-10 flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                        done
                          ? "bg-pm-green-600 border-pm-green-600 text-white"
                          : "bg-background border-border text-muted-foreground",
                      )}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium text-center hidden sm:block leading-tight",
                        done ? "text-pm-green-700" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile status label */}
            <p className="sm:hidden text-center text-sm font-semibold text-pm-green-700 mt-4">
              {STATUS_LABELS[status]}
            </p>

            {/* Update Status */}
            <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-border">
              <Select
                value={selected}
                onValueChange={(v) => setSelected(v as OrderStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FLOW.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdate}
                disabled={updating || selected === status}
                className="bg-pm-green-600 hover:bg-pm-green-700 text-white gap-2 sm:w-auto"
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" /> Update Status
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Info */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Customer</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-pm-green-100 text-pm-green-800 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {ORDER.customer.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {ORDER.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ORDER.customer.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground leading-relaxed">
                  {ORDER.address}
                </p>
              </div>
              {ORDER.notes && (
                <div className="mt-2 bg-pm-gold-50 border border-pm-gold-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-pm-gold-800">
                    <span className="font-semibold">Note:</span> {ORDER.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {ORDER.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      x{item.qty} @ ₱{item.price}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ₱{item.qty * item.price}
                  </p>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₱{ORDER.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground">₱{ORDER.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                  <span>Total</span>
                  <span className="text-pm-green-700">₱{ORDER.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card className="border-border shadow-none">
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {TIMELINE_EVENTS.map((evt, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-pm-green-500 mt-1 flex-shrink-0" />
                    {i < TIMELINE_EVENTS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {STATUS_LABELS[evt.status as OrderStatus] ?? evt.status}
                    </p>
                    <p className="text-xs text-muted-foreground">{evt.note}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {evt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}
