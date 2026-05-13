"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADING UI
// ─────────────────────────────────────────────────────────────────────────────
export function ProfileSkeletonV1() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Card>
        <div className="p-2 space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function AccountSettingsSkeletonV1() {
  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Location Section */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}
