export function ProductCardSkeletonV1(prop: {i: number}) {
  return (
    <div
      key={prop.i}
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      {/* aspect-square matches your <img> wrapper */}
      <div className="aspect-square bg-muted relative">
        {/* discount badge: top-2 left-2 */}
        {prop.i % 3 === 0 && (
          <div className="absolute top-2 left-2 w-[38px] h-5 bg-muted-foreground/30 rounded-full" />
        )}
        {/* low stock badge: top-2 right-2 */}
        {prop.i === 2 && (
          <div className="absolute top-2 right-2 w-[52px] h-5 bg-muted-foreground/20 rounded-full" />
        )}
      </div>

      {/* p-3 matches your footer padding */}
      <div className="p-3">
        {/* text-xs seller name */}
        <div className="h-3 w-3/4 bg-muted rounded" />

        {/* text-sm line-clamp-2 mt-0.5 leading-snug → 2 lines */}
        <div className="h-[14px] w-full bg-muted rounded mt-0.5" />
        <div className="h-[14px] w-3/5 bg-muted rounded mt-[3px]" />

        {/* Star w-3 h-3 + text-xs rating · mt-1 */}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-3 h-3 bg-muted rounded-sm shrink-0" />
          <div className="h-[11px] w-14 bg-muted rounded" />
        </div>

        {/* Price + optional strikethrough · mt-1.5 */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="h-[14px] w-16 bg-muted rounded" />
          {prop.i % 3 === 0 && (
            <div className="h-[11px] w-10 bg-muted rounded-full" />
          )}
        </div>

        {/* MapPin w-3 h-3 + text-[10px] city · mt-1 */}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-3 h-3 bg-muted rounded-full shrink-0" />
          <div className="h-[10px] w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
