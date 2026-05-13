"use client";

export function ActiveOrdersSkeletonV1() {
  return (
    <section className="animate-pulse">
      {/* Header: Title + Link Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Icon + Title Placeholder */}
          <div className="w-4 h-4 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        {/* "View all" Button Placeholder */}
        <div className="h-7 w-16 bg-muted rounded-md" />
      </div>

      {/* Orders List Container */}
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border border-border rounded-xl bg-card"
          >
            <div className="flex items-center gap-3">
              {/* Mock Order Icon/Status Circle */}
              <div className="w-10 h-10 bg-muted rounded-lg" />

              <div className="space-y-1.5">
                {/* Order Title/ID */}
                <div className="h-3 w-24 bg-muted rounded" />
                {/* Order Status/Subtitle */}
                <div className="h-2 w-16 bg-muted rounded" />
              </div>
            </div>

            {/* Right side Action/Price Placeholder */}
            <div className="h-3 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
