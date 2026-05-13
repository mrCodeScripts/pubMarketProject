import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  Store,
  Star,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  mockCategories,
  mockFeaturedProducts,
  mockSellers,
} from "@/lib/mock/data";
import type { ProductCard, Seller } from "@/lib/types/database";

function PublicProductCard({ product }: { product: ProductCard }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.thumbnailUrl ?? "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-white text-[10px] px-1.5 border-0">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[11px] text-muted-foreground truncate">
            {product.seller.shopName}
          </p>
          <p className="text-sm font-medium line-clamp-2 mt-0.5 flex-1 leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
            <span className="text-xs text-muted-foreground">
              {product.averageRating} ({product.totalReviews})
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-bold text-primary">
              ₱{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₱{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {product.location.city}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SellerCard({ seller }: { seller: Seller }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={seller.shopLogoUrl ?? undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {seller.shopName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{seller.shopName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
            <span className="text-xs text-muted-foreground">
              {seller.stats.averageRating > 0
                ? seller.stats.averageRating
                : "New"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {seller.location.city}
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] border-pm-green-300 text-pm-green-700"
        >
          Verified
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const approvedSellers = mockSellers.filter((s) => s.status === "approved");
  return (
    <div className="flex flex-col">
      // HERO
      <section className="bg-gradient-to-b from-pm-green-50 to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <Badge className="bg-pm-green-100 text-pm-green-800 border-0 text-xs px-3 py-1">
            🌱 Supporting Local Businesses
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Your Local Market,
            <br />
            <span className="text-primary">Now Online</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Discover fresh produce, native delicacies, handcrafted goods, and
            more from trusted sellers in your community.
          </p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, sellers, or categories..."
                className="pl-9 h-11"
              />
            </div>
            <Link href="/products">
              <Button className="h-11 px-5">Search</Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Store className="w-4 h-4" /> Shop Now
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Become a Seller <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      // CATEGORIES
      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Browse Categories</h2>
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {mockCategories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-pm-green-200 transition-colors text-center"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] font-medium leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      // TRENDING PRODUCTS
      <section className="bg-muted/40 py-12">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Trending Products</h2>
            <Link href="/products">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-xs flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {mockFeaturedProducts.map((p) => (
              <PublicProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      // HOW IT WORKS
      <section className="max-w-4xl mx-auto px-4 py-14 w-full text-center">
        <h2 className="text-xl font-bold mb-2">How PubMarket Works</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Three simple steps to get fresh local goods delivered.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Search className="w-7 h-7" />,
              step: "1",
              title: "Browse",
              desc: "Search and filter products from local sellers near you.",
            },
            {
              icon: <ShieldCheck className="w-7 h-7" />,
              step: "2",
              title: "Order",
              desc: "Place your order securely with our mock payment system.",
            },
            {
              icon: <Truck className="w-7 h-7" />,
              step: "3",
              title: "Receive",
              desc: "Track your delivery in real-time as it arrives at your door.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-pm-green-100 text-pm-green-700 flex items-center justify-center relative">
                {item.icon}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      // FEATURED SELLERS
      <section className="bg-muted/40 py-12">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <h2 className="text-xl font-bold mb-1">Featured Local Sellers</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Verified sellers trusted by the community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {approvedSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </section>
      // SELL CTA BANNER
      <section className="max-w-4xl mx-auto px-4 py-14 w-full text-center">
        <div className="rounded-2xl bg-pm-green-600 text-white p-10 space-y-4">
          <h2 className="text-2xl font-bold">Start Selling Today</h2>
          <p className="text-pm-green-100 text-sm max-w-md mx-auto">
            Join hundreds of local sellers reaching customers in their community
            through PubMarket.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="mt-2">
              Create Seller Account
            </Button>
          </Link>
        </div>
      </section>
      // FLOATING AI BUBBLE
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="w-12 h-12 rounded-full shadow-lg">
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
