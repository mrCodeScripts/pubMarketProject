"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  X,
  MapPin,
  Loader2,
  Search,
  ExternalLink,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminSellersPage() {
  const [realSellers, setRealSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // 1. FETCH REAL DATA ON MOUNT
  useEffect(() => {
    async function getSellers() {
      try {
        const res = await fetch("/api/admin/sellers");
        const result = await res.json();

        if (result.success) {
          setRealSellers(result.data);
        } else {
          toast.error(result.error || "Failed to load sellers");
        }
      } catch (err) {
        toast.error("Network error fetching sellers");
      } finally {
        setLoading(false);
      }
    }
    getSellers();
  }, []);

  // Filter REAL data for all tabs
  const pending = realSellers.filter((s) => s.status === "pending");
  const approved = realSellers.filter((s) => s.status === "approved");
  const rejected = realSellers.filter((s) => s.status === "rejected");

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    let reason = "";
    if (status === "rejected") {
      const input = window.prompt("Reason for rejection:");
      if (!input) return;
      reason = input;
    }

    setActionId(id);

    try {
      const res = await fetch(`/api/admin/sellers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`Seller ${status} successfully`);
        // Update local state: move the seller to the new status
        setRealSellers((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status, rejection_reason: reason } : s,
          ),
        );
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <AdminSellersSkeleton />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Seller Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Reviewing live applications and managing registered merchants.
          </p>
        </div>
        <Badge variant="outline" className="bg-white">
          {realSellers.length} Total in DB
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-muted/50 p-1 border">
          <TabsTrigger value="pending" className="px-6 relative">
            Pending{" "}
            {pending.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-pm-gold-500 text-white rounded-full">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="px-6">
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="px-6">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        {/* --- PENDING TAB --- */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <EmptyState message="No pending applications found." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pending.map((s) => (
                <SellerCard
                  key={s.id}
                  seller={s}
                  onApprove={() => handleStatusUpdate(s.id, "approved")}
                  onReject={() => handleStatusUpdate(s.id, "rejected")}
                  isProcessing={actionId === s.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- APPROVED TAB --- */}
        <TabsContent value="approved" className="mt-6">
          {approved.length === 0 ? (
            <EmptyState message="No approved sellers yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approved.map((s) => (
                <SellerCard key={s.id} seller={s} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- REJECTED TAB --- */}
        <TabsContent value="rejected" className="mt-6">
          {rejected.length === 0 ? (
            <EmptyState message="No rejected sellers." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rejected.map((s) => (
                <SellerCard key={s.id} seller={s} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SellerCard({ seller, onApprove, onReject, isProcessing }: any) {
  const shopName = seller.shop_name || "Unknown Shop";
  const ownerName = seller.owner?.full_name || "Unknown Owner";
  const docUrl = seller.bir_document_url;
  const tin = seller.bir_tin;

  const imageUrl = docUrl?.startsWith("http")
    ? docUrl
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pubmarket-documents/${docUrl}`;

  return (
    <Card className="border-pm-gold-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-0">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-pm-gold-100 shadow-sm">
                <AvatarFallback className="bg-pm-gold-500 text-white font-bold">
                  {shopName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-base leading-none mb-1">
                  {shopName}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {ownerName}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] uppercase px-2 py-0 ${
                seller.status === "approved"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : seller.status === "rejected"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {seller.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] bg-muted/40 p-3 rounded-lg border border-muted">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> {seller.city || "N/A"}
            </div>
            <div className="text-right font-mono">TIN: {tin || "N/A"}</div>
          </div>

          {docUrl && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden border bg-black/5 group">
              <Image
                src={imageUrl}
                alt="Document"
                fill
                className="object-contain p-2"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  href={imageUrl}
                  target="_blank"
                  className="text-white text-xs font-medium underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> View Full Image
                </Link>
              </div>
            </div>
          )}

          {seller.status === "rejected" && seller.rejection_reason && (
            <div className="p-2 rounded bg-red-50 border border-red-100">
              <p className="text-[10px] font-bold text-red-800 uppercase">
                Rejection Reason:
              </p>
              <p className="text-[11px] text-red-700">
                {seller.rejection_reason}
              </p>
            </div>
          )}
        </div>

        {seller.status === "pending" && (
          <div className="grid grid-cols-2 border-t divide-x">
            <button
              disabled={isProcessing}
              onClick={onReject}
              className="py-4 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <X className="w-4 h-4" /> REJECT
            </button>
            <button
              disabled={isProcessing}
              onClick={onApprove}
              className="py-4 text-xs font-bold text-pm-green-700 hover:bg-pm-green-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              APPROVE APPLICATION
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
      <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function AdminSellersSkeleton() {
  return (
    <div className="p-8 space-y-4 max-w-6xl mx-auto">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}
