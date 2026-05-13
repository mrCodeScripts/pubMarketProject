"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  stock: number;
  unit: string;
  price: number;
  status: "ok" | "low" | "out";
}

function getStockStatus(stock: number): "ok" | "low" | "out" {
  if (stock === 0) return "out";
  if (stock < 10) return "low";
  return "ok";
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p001",
    name: "Kangkong (Swamp Cabbage)",
    category: "Vegetables",
    image: "🥬",
    stock: 4,
    unit: "bundles",
    price: 25,
    status: "low",
  },
  {
    id: "p002",
    name: "Sitaw (String Beans)",
    category: "Vegetables",
    image: "🫘",
    stock: 18,
    unit: "bundles",
    price: 35,
    status: "ok",
  },
  {
    id: "p003",
    name: "Tomatoes - 1kg Pack",
    category: "Vegetables",
    image: "🍅",
    stock: 22,
    unit: "packs",
    price: 80,
    status: "ok",
  },
  {
    id: "p004",
    name: "Sweet Potato (Camote)",
    category: "Root Crops",
    image: "🍠",
    stock: 0,
    unit: "kg",
    price: 60,
    status: "out",
  },
  {
    id: "p005",
    name: "Malunggay Leaves",
    category: "Herbs",
    image: "🌿",
    stock: 30,
    unit: "bundles",
    price: 15,
    status: "ok",
  },
  {
    id: "p006",
    name: "Ampalaya (Bitter Gourd)",
    category: "Vegetables",
    image: "🥒",
    stock: 9,
    unit: "pcs",
    price: 40,
    status: "low",
  },
  {
    id: "p007",
    name: "Pechay (Bok Choy)",
    category: "Vegetables",
    image: "🥬",
    stock: 2,
    unit: "bundles",
    price: 20,
    status: "low",
  },
  {
    id: "p008",
    name: "Okra Bundle",
    category: "Vegetables",
    image: "🌱",
    stock: 0,
    unit: "bundles",
    price: 30,
    status: "out",
  },
  {
    id: "p009",
    name: "Camote Tops Bundle",
    category: "Herbs",
    image: "🌿",
    stock: 25,
    unit: "bundles",
    price: 18,
    status: "ok",
  },
];

const STOCK_STYLES: Record<
  string,
  { badge: string; row: string; dot: string }
> = {
  ok: {
    badge: "bg-pm-green-100 text-pm-green-800 border-pm-green-200",
    row: "",
    dot: "bg-pm-green-500",
  },
  low: {
    badge: "bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200",
    row: "bg-pm-gold-50/40",
    dot: "bg-pm-gold-500",
  },
  out: {
    badge: "bg-pm-red-100 text-pm-red-800 border-pm-red-200",
    row: "bg-pm-red-50/40",
    dot: "bg-pm-red-500",
  },
};

export default function SellerInventoryPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const lowCount = products.filter(
    (p) => p.status === "low" || p.status === "out",
  ).length;
  const outCount = products.filter((p) => p.status === "out").length;

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditValue(String(p.stock));
  };

  const saveEdit = (id: string) => {
    const val = parseInt(editValue);
    if (!isNaN(val) && val >= 0) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: val, status: getStockStatus(val) } : p,
        ),
      );
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <SellerLayout title="Inventory">
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Inventory</h2>
            <p className="text-sm text-muted-foreground">
              {products.length} products · {outCount} out of stock
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-pm-gold-100 text-pm-gold-800 border-pm-gold-200 border text-xs">
              {products.filter((p) => p.status === "low").length} Low
            </Badge>
            <Badge className="bg-pm-red-100 text-pm-red-800 border-pm-red-200 border text-xs">
              {outCount} Out
            </Badge>
          </div>
        </div>

        {/* Low stock alert banner */}
        {lowCount > 0 && (
          <div className="flex items-start gap-3 bg-pm-gold-50 border border-pm-gold-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-pm-gold-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-pm-gold-900">
                Stock Alert
              </p>
              <p className="text-xs text-pm-gold-800 mt-0.5">
                {lowCount} product{lowCount > 1 ? "s are" : " is"} running low
                or out of stock. Update stock levels to avoid missing orders.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {[
            { key: "ok", label: "In Stock (≥10)" },
            { key: "low", label: "Low Stock (<10)" },
            { key: "out", label: "Out of Stock" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className={cn("w-2 h-2 rounded-full", STOCK_STYLES[key].dot)}
              />
              <span>{label}</span>
            </div>
          ))}
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
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Stock
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className={cn(
                      "transition-colors hover:bg-muted/10",
                      STOCK_STYLES[p.status].row,
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">
                          {p.image}
                        </div>
                        <span className="font-medium text-foreground text-sm">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.category}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === p.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-7 text-center text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(p.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="p-1 rounded text-pm-green-600 hover:bg-pm-green-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded text-pm-red-500 hover:bg-pm-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="group flex items-center justify-center gap-1 mx-auto"
                        >
                          <span className="font-semibold text-foreground">
                            {p.stock} {p.unit}
                          </span>
                          <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={cn(
                          "text-xs border capitalize",
                          STOCK_STYLES[p.status].badge,
                        )}
                      >
                        {p.status === "out"
                          ? "Out of Stock"
                          : p.status === "low"
                            ? "Low Stock"
                            : "In Stock"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      ₱{p.price}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/seller/products/${p.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-pm-green-600 hover:bg-pm-green-50 hover:text-pm-green-700"
                        >
                          Edit Product
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2">
          {products.map((p) => (
            <Card
              key={p.id}
              className={cn(
                "border-border shadow-none",
                p.status !== "ok" && "border-l-4",
                p.status === "low" && "border-l-pm-gold-400",
                p.status === "out" && "border-l-pm-red-400",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                      {p.image}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.category}
                      </p>
                      <Badge
                        className={cn(
                          "text-xs border mt-1",
                          STOCK_STYLES[p.status].badge,
                        )}
                      >
                        {p.status === "out"
                          ? "Out of Stock"
                          : p.status === "low"
                            ? "Low Stock"
                            : "In Stock"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 h-7 text-center text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="p-1 rounded text-pm-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 rounded text-pm-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(p)}
                        className="flex items-center gap-1 text-right"
                      >
                        <div>
                          <p className="font-bold text-foreground text-sm">
                            {p.stock}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.unit}
                          </p>
                        </div>
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
}
