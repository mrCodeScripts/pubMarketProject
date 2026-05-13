"use client";

export function BecomeASellerCTASkeletonV1() {
  return (
    <div className="animate-pulse">
      <div className="border border-pm-green-200 bg-pm-green-50 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-4">
          {/* Text Content Area */}
          <div className="flex-1 space-y-2">
            {/* Title Placeholder (font-semibold) */}
            <div className="h-4 w-3/4 bg-pm-green-200/50 rounded" />

            {/* Subtitle Placeholder (text-xs) */}
            <div className="h-3 w-5/6 bg-pm-green-200/30 rounded" />
          </div>

          {/* Button Placeholder (flex-shrink-0) */}
          <div className="flex-shrink-0 h-9 w-24 bg-pm-green-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}
