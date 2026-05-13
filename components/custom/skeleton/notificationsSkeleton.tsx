"use client"

import { NotificationBarsSkeletonV1 } from "./notificationBarSkeleton";

// Full Section Skeleton
export function RecentNotificationsSkeletonV1()  {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-muted rounded w-32 animate-pulse" />{" "}
        {/* Header Title */}
        <div className="h-7 bg-muted rounded w-16 animate-pulse" />{" "}
        {/* Button Placeholder */}
      </div>

      <div className="space-y-2">
        {/* Rendering 3 items to match your API's .slice(0, 3) */}
        {[...Array(3)].map((_, i) => (
          <NotificationBarsSkeletonV1 key={i} />
        ))}
      </div>
    </section>
  );
};
