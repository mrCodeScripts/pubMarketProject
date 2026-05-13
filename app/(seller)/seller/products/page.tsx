"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  image: string;
  sold: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p001",
    name: "Kangkong (Swamp Cabbage)",
    category: "Vegetables",
    price: 25,
    stock: 4,
    status: "active",
    image: "🥬",
    sold: 120,
  },
  {
    id: "p002",
    name: "Sitaw (String Beans)",
    category: "Vegetables",
    price: 35,
    stock: 18,
    status: "active",
    image: "🫘",
    sold: 85,
  },
  {
    id: "p003",
    name: "Tomatoes - 1kg Pack",
    category: "Vegetables",
    price: 80,
    stock: 22,
    status: "active",
    image: "🍅",
    sold: 210,
  },
  {
    id: "p004",
    name: "Sweet Potato (Camote)",
    category: "Root Crops",
    price: 60,
    stock: 0,
    status: "active",
    image: "🍠",
    sold: 145,
  },
  {
    id: "p005",
    name: "Malunggay Leaves",
    category: "Herbs",
    price: 15,
    stock: 30,
    status: "active",
    image: "🌿",
    sold: 300,
  },
  {
    id: "p006",
    name: "Ampalaya (Bitter Gourd)",
    category: "Vegetables",
    price: 40,
    stock: 9,
    status: "active",
    image: "🥒",
    sold: 67,
  },
  {
    id: "p007",
    name: "Pechay (Bok Choy)",
    category: "Vegetables",
    price: 20,
    stock: 15,
    status: "inactive",
    image: "🥬",
    sold: 90,
  },
  {
    id: "p008",
    name: "Okra Bundle",
    category: "Vegetables",
    price: 30,
    stock: 2,
    status: "active",
    image: "🌱",
    sold: 44,
  },
  {
    id: "p009",
    name: "Camote Tops Bundle",
    category: "Herbs",
    price: 18,
    stock: 25,
    status: "draft",
    image: "🌿",
    sold: 0,
  },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
  inactive: "bg-pm-stone-100 text-pm-stone-600 border-pm-stone-200",
  draft: "bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200",
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  };

  const handleDelete = () => {
    if (deleteId) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  const stockBadge = (stock: number) => {
    if (stock === 0)
      return (
        <Badge className="text-xs border bg-pm-red-100 text-pm-red-700 border-pm-red-200">
          Out
        </Badge>
      );
    if (stock < 10)
      return (
        <Badge className="text-xs border bg-pm-gold-100 text-pm-gold-700 border-pm-gold-200">
          {stock}
        </Badge>
      );
    return <span className="text-sm font-medium text-foreground">{stock}</span>;
  };

  return (
    <SellerLayout title="My Products">
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">My Products</h2>
            <p className="text-sm text-muted-foreground">
              {products.length} total products
            </p>
          </div>
          <Link href="/seller/products/new">
            <Button className="bg-pm-green-600 hover:bg-pm-green-700 text-white gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <Card className="border-border shadow-none hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Stock
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Sold
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-muted-foreground text-sm"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
                          {p.image}
                        </div>
                        <span className="font-medium text-foreground text-sm">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {p.category}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      ₱{p.price}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {stockBadge(p.stock)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={cn(
                          "text-xs border capitalize",
                          STATUS_STYLES[p.status],
                        )}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                      {p.sold}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/seller/products/${p.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 hover:bg-pm-green-50 hover:text-pm-green-700"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "w-7 h-7",
                            p.status === "active"
                              ? "hover:bg-pm-stone-100"
                              : "hover:bg-pm-green-50 hover:text-pm-green-700",
                          )}
                          onClick={() => toggleStatus(p.id)}
                          title={
                            p.status === "active" ? "Deactivate" : "Activate"
                          }
                        >
                          {p.status === "active" ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:bg-pm-red-50 hover:text-pm-red-600"
                          onClick={() => setDeleteId(p.id)}
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
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No products found.
            </p>
          )}
          {filtered.map((p) => (
            <Card key={p.id} className="border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {p.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-pm-green-700">
                        ₱{p.price}
                      </span>
                      {stockBadge(p.stock)}
                      <Badge
                        className={cn(
                          "text-xs border capitalize",
                          STATUS_STYLES[p.status],
                        )}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link href={`/seller/products/${p.id}/edit`}>
                      <Button variant="outline" size="icon" className="w-8 h-8">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 text-pm-red-500 border-pm-red-200"
                      onClick={() => setDeleteId(p.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>{products.find((p) => p.id === deleteId)?.name}</strong>?
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-pm-red-600 hover:bg-pm-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SellerLayout>
  );
}
