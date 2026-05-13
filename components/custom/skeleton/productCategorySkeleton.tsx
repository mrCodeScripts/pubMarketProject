"use client";

export function ProductCategorySkeletonV1() {
  return (
    <section className="animate-pulse">
      {/* Heading Skeleton */}
      <div className="h-5 w-32 bg-muted rounded mb-4" />

      {/* Horizontal Scroll Container */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card w-20"
          >
            {/* Icon Skeleton (The text-2xl emoji replacement) */}
            <div className="w-8 h-8 bg-muted rounded-full" />

            {/* Label Skeleton (The text-[10px] text replacement) */}
            <div className="w-full space-y-1">
              <div className="h-2 bg-muted rounded mx-auto w-10" />
              <div className="h-2 bg-muted rounded mx-auto w-6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
