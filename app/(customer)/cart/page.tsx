"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockCartItems } from "@/lib/mockup/pubMarket-data-mockup";
import type { CartItem } from "@/lib/types/database";

const DELIVERY_FEE = 49;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + delta, item.product.stock),
              ),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse products and add items to get started.
          </p>
        </div>
        <Link href="/products">
          <Button className="mt-2">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">
        My Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── CART ITEMS ── */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const itemTotal = item.product.price * item.quantity;
            const isLowStock = item.product.stock <= 5;
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3 flex gap-3">
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 rounded-md bg-muted overflow-hidden">
                      <img
                        src={item.product.thumbnailUrl ?? "/placeholder.png"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          {item.product.seller.shopName}
                        </p>
                        <Link href={`/products/${item.product.slug}`}>
                          <p className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                            {item.product.name}
                          </p>
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.product.location.city}
                    </div>

                    {isLowStock && (
                      <p className="text-xs text-warning-fg">
                        Only {item.product.stock} left!
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(item.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        ₱{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Link href="/products">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-sm text-muted-foreground"
            >
              + Continue Shopping
            </Button>
          </Link>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-4 space-y-4">
              <h2 className="font-semibold text-base">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({items.length} items)
                  </span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₱{DELIVERY_FEE.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">₱{total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full flex items-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center">
                Mock payment — no real charges will be made.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
