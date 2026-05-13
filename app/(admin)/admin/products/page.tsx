"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Trash2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  mockProducts,
  mockCategories,
} from "@/lib/mockup/pubMarket-data-mockup";
import type { ProductCard } from "@/lib/types/database";

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [products, setProducts] = useState<ProductCard[]>(mockProducts);
  const [removeTarget, setRemoveTarget] = useState<ProductCard | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.shopName.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category?.slug === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} total products
        </p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products or sellers..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {mockCategories.slice(0, 8).map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.icon} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                  Seller
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={p.thumbnailUrl ?? "/placeholder.png"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium text-sm line-clamp-1 max-w-32">
                        {p.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                    {p.seller.shopName}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary">
                    ₱{p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">
                    <span
                      className={
                        p.stock === 0
                          ? "text-danger-fg"
                          : p.stock <= 5
                            ? "text-warning-fg"
                            : "text-success-fg"
                      }
                    >
                      {p.stock} {p.unit}s
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] border-0 ${p.isActive ? "bg-success-bg text-success-fg" : "bg-muted text-muted-foreground"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/products/${p.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setRemoveTarget(p)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <strong>{removeTarget?.name}</strong> from the platform?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProducts((prev) =>
                  prev.filter((p) => p.id !== removeTarget?.id),
                );
                setRemoveTarget(null);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AdminProductsPage;
