"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

const SELLER = {
  shopName: "Maria's Fresh Market",
  description:
    "Fresh vegetables, fruits, and farm produce straight from our farm in Iligan. Harvested daily, delivered with care.",
  location: "Hinaplanon, Iligan City, Lanao del Norte",
  rating: 4.8,
  totalReviews: 215,
  totalOrders: 342,
  memberSince: "January 2024",
};

const PRODUCTS = [
  {
    id: "p001",
    name: "Kangkong",
    category: "Vegetables",
    price: 25,
    stock: 4,
    image: "🥬",
    sold: 120,
  },
  {
    id: "p002",
    name: "Sitaw (String Beans)",
    category: "Vegetables",
    price: 35,
    stock: 18,
    image: "🫘",
    sold: 85,
  },
  {
    id: "p003",
    name: "Tomatoes - 1kg Pack",
    category: "Vegetables",
    price: 80,
    stock: 22,
    image: "🍅",
    sold: 210,
  },
  {
    id: "p005",
    name: "Malunggay Leaves",
    category: "Herbs",
    price: 15,
    stock: 30,
    image: "🌿",
    sold: 300,
  },
  {
    id: "p006",
    name: "Ampalaya (Bitter Gourd)",
    category: "Vegetables",
    price: 40,
    stock: 9,
    image: "🥒",
    sold: 67,
  },
  {
    id: "p009",
    name: "Camote Tops Bundle",
    category: "Herbs",
    price: 18,
    stock: 25,
    image: "🌱",
    sold: 0,
  },
];

const REVIEWS = [
  {
    reviewer: "Juan dela Cruz",
    initials: "JD",
    rating: 5,
    comment:
      "Super fresh! Grabe talaga, parang galing sa taniman ngayon. Highly recommend!",
    date: "May 9, 2026",
    product: "Kangkong",
  },
  {
    reviewer: "Ana Reyes",
    initials: "AR",
    rating: 4,
    comment:
      "Good quality tomatoes, very ripe and juicy. Delivery was fast. Will order again.",
    date: "May 8, 2026",
    product: "Tomatoes",
  },
  {
    reviewer: "Liza Gomez",
    initials: "LG",
    rating: 5,
    comment:
      "The malunggay is always so fresh. I buy every week from this shop. Best seller!",
    date: "May 7, 2026",
    product: "Malunggay",
  },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= rating
              ? "text-pm-gold-500 fill-pm-gold-500"
              : "text-pm-stone-300",
          )}
        />
      ))}
    </div>
  );
}

export default function SellerShopPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SellerLayout title="My Shop" preview>
      <div className="max-w-4xl mx-auto">
        {/* Banner */}
        <div className="relative h-32 sm:h-48 bg-gradient-to-br from-pm-green-600 via-pm-green-700 to-pm-green-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Link href="/seller/products/new">
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Shop Info */}
        <div className="px-4 lg:px-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-4 border-background shadow-lg flex items-center justify-center text-3xl flex-shrink-0 z-10">
              🛒
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                {SELLER.shopName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-pm-gold-500 fill-pm-gold-500" />
                  <span className="text-sm font-bold text-foreground">
                    {SELLER.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({SELLER.totalReviews})
                  </span>
                </div>
                <span className="text-pm-stone-300">·</span>
                <span className="text-xs text-muted-foreground">
                  {SELLER.totalOrders} orders
                </span>
                <span className="text-pm-stone-300 hidden sm:inline">·</span>
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {SELLER.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 sm:hidden">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{SELLER.location}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
            {SELLER.description}
          </p>

          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products" className="text-sm gap-2">
                <Package className="w-3.5 h-3.5" /> Products
                <Badge className="bg-pm-green-100 text-pm-green-800 border-0 text-xs h-5 px-1.5">
                  {PRODUCTS.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm gap-2">
                <Star className="w-3.5 h-3.5" /> Reviews
                <Badge className="bg-pm-stone-100 text-pm-stone-700 border-0 text-xs h-5 px-1.5">
                  {REVIEWS.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">
                  No products found.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-8">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="border-border shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
                  >
                    <div className="h-28 bg-muted flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                      {product.image}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-semibold text-foreground leading-tight mb-1 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-base font-bold text-pm-green-700">
                          ₱{product.price}
                        </span>
                        {product.stock === 0 ? (
                          <Badge className="text-xs bg-pm-red-100 text-pm-red-700 border-pm-red-200 border px-1.5">
                            Out
                          </Badge>
                        ) : product.stock < 10 ? (
                          <Badge className="text-xs bg-pm-gold-100 text-pm-gold-700 border-pm-gold-200 border px-1.5">
                            {product.stock} left
                          </Badge>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-3 pb-8">
                {REVIEWS.map((r, i) => (
                  <Card key={i} className="border-border shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-pm-green-100 text-pm-green-800 text-xs font-bold">
                            {r.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">
                              {r.reviewer}
                            </p>
                            <StarDisplay rating={r.rating} />
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 h-5"
                            >
                              {r.product}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                            {r.date}
                          </p>
                          <p className="text-sm text-foreground/80">
                            {r.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SellerLayout>
  );
}
