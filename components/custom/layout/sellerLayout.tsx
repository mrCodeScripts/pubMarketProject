"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Star,
  BarChart2,
  Store,
  Menu,
  X,
  ChevronRight,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "My Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag, badge: 3 },
  { href: "/seller/inventory", label: "Inventory", icon: Warehouse },
  { href: "/seller/reviews", label: "Reviews", icon: Star },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/seller/shop", label: "My Shop", icon: Store },
];

interface SellerLayoutProps {
  children: React.ReactNode;
  title?: string;
  preview?: boolean;
}

export default function SellerLayout({
  children,
  title,
  preview,
}: SellerLayoutProps) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/seller/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching seller profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-pm-green-600 flex items-center justify-center shadow-sm">
          <Store className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">
            Seller Hub
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">PubMarket</p>
        </div>
      </div>

      {/* Seller info - DYNAMIC */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 ring-2 ring-pm-green-200">
            <AvatarImage src={profile?.logo_url || ""} />
            <AvatarFallback className="bg-pm-green-100 text-pm-green-800 text-xs font-semibold">
              {profile?.shop_name?.substring(0, 2).toUpperCase() || "..."}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {loading ? "Loading..." : profile?.shop_name || "Merchant"}
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pm-green-500 inline-block" />
              <p className="text-xs text-pm-green-600 font-medium">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    active && "text-pm-green-600",
                  )}
                />
                <span className="flex-1">{label}</span>
                {badge && (
                  <Badge className="bg-pm-red-100 text-pm-red-700 text-xs h-5 px-1.5 font-semibold border-0">
                    {badge}
                  </Badge>
                )}
                {active && (
                  <ChevronRight className="w-3 h-3 text-pm-green-600" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        <Link href="/seller/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-all">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-pm-red-600 hover:bg-pm-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Logic remains the same... */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="text-base font-semibold text-foreground truncate">
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pm-red-500" />
            </button>
            <Avatar className="w-8 h-8 ring-1 ring-pm-green-200">
              <AvatarImage src={profile?.logo_url || ""} />
              <AvatarFallback className="bg-pm-green-100 text-pm-green-800 text-xs font-bold">
                {profile?.shop_name?.charAt(0) || "M"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {preview && (
          <div className="bg-pm-gold-100 border-b border-pm-gold-200 px-4 py-2 text-center text-sm font-medium text-pm-gold-800 flex items-center justify-center gap-2">
            <Store className="w-4 h-4" />
            <span>
              Previewing as Customer —{" "}
              <Link
                href="/seller/products/new"
                className="underline underline-offset-2"
              >
                Edit Shop
              </Link>
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
