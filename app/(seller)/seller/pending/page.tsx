"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Mail,
  CheckCircle2,
  FileText,
  MapPin,
  Store,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function PendingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<any>(null);

  // 1. Initial State from URL (Instant UX)
  const [displayData, setDisplayData] = useState({
    shopName: searchParams.get("shopName") || "Your Shop",
    location: searchParams.get("location") || "Location not provided",
    birTin: searchParams.get("tin") || "000-000-000-000",
    date: searchParams.get("date") || new Date().toISOString(),
  });

  useEffect(() => {
    async function fetchLatestProfile() {
      try {
        const res = await fetch("/api/seller/status");
        const result = await res.json();
        if (result.success) {
          setDbData(result.data);
          // Update display with actual DB data if it exists
          setDisplayData({
            shopName: result.data.shop_name,
            location: `${result.data.barangay}, ${result.data.city}, ${result.data.province}`,
            birTin: result.data.bir_tin,
            date: result.data.created_at,
          });
        }
      } catch (err) {
        console.error("Failed to sync with DB", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestProfile();
  }, []);

  const submittedAt = format(
    new Date(displayData.date),
    "MMMM d, yyyy 'at' h:mm a",
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Illustration */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="w-24 h-24 rounded-full bg-pm-gold-100 flex items-center justify-center mx-auto">
            {loading ? (
              <Loader2 className="w-10 h-10 text-pm-gold-600 animate-spin" />
            ) : (
              <Clock className="w-10 h-10 text-pm-gold-600" />
            )}
          </div>
          {!loading && (
            <span className="absolute -top-1 -right-1 w-8 h-8 bg-pm-green-600 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </span>
          )}
        </div>

        <Badge className="bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200 text-xs font-semibold mb-4 px-3 py-1">
          {loading ? "Syncing..." : "Under Review"}
        </Badge>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Application Submitted!
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Your seller application is currently under review by our team. We'll
          notify you within 1–3 business days.
        </p>

        {/* Details Card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6 text-left shadow-sm">
          <div className="bg-pm-stone-50 px-4 py-3 border-b border-border flex justify-between items-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Submitted Details
            </p>
            {loading && (
              <div className="h-2 w-2 rounded-full bg-pm-gold-400 animate-pulse" />
            )}
          </div>
          <div className="divide-y divide-border">
            <DetailItem
              icon={<Store className="w-4 h-4 text-pm-green-600" />}
              label="Shop Name"
              value={displayData.shopName}
              loading={loading}
            />
            <DetailItem
              icon={<MapPin className="w-4 h-4 text-pm-green-600" />}
              label="Location"
              value={displayData.location}
              loading={loading}
            />
            <DetailItem
              icon={<FileText className="w-4 h-4 text-pm-green-600" />}
              label="BIR TIN"
              value={displayData.birTin}
              loading={loading}
            />
            <DetailItem
              icon={<Clock className="w-4 h-4 text-pm-green-600" />}
              label="Submitted At"
              value={submittedAt}
              loading={loading}
            />
          </div>
        </div>

        {/* Notification note */}
        <div className="flex items-start gap-3 bg-pm-green-50 border border-pm-green-200 rounded-xl p-4 text-left mb-8">
          <Mail className="w-4 h-4 text-pm-green-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-pm-green-800">
            We'll send a notification to your account once your application has
            been reviewed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Back to Shopping
            </Button>
          </Link>
          <Link href="/seller/apply" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground text-sm"
            >
              Edit Application
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Reusable Detail Item with Skeleton support
function DetailItem({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-4 w-3/4 mt-1" />
        ) : (
          <p className="text-sm font-semibold text-foreground truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SellerPendingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background px-4 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pm-green-600 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-pm-green-700 text-lg">PubMarket</span>
        </Link>
      </header>

      <Suspense fallback={<PendingSkeleton />}>
        <PendingContent />
      </Suspense>
    </div>
  );
}

function PendingSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-full mx-auto" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}
