// Individual Item Skeleton
export function NotificationBarsSkeletonV1() {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border bg-card animate-pulse">
      {/* The Unread Dot Placeholder */}
      <div className="w-2 h-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Title Placeholder */}
        <div className="h-4 bg-muted rounded w-3/4" />
        {/* Body Placeholder */}
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

