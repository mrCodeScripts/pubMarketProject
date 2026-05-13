"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  MapPin,
  Package,
  Star,
  Store,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/custom/button/button-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ENV } from "@/lib/constants";
import { ProfileSkeletonV1 as ProfileSkeleton } from "@/components/custom/skeleton/profileSkeleton";
import { DbProfile } from "@/types/database"; // Adjust based on your types path

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // FETCHING OF DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/data/currentUser");
        const result = await res.json();
        if (result.success) setUser(result.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // LOGOUT HANDLER
  const logoutHandler = async () => {
    setLogoutLoading(true);
    const res = await fetch(ENV.API_AUTH_LOGOUT_ROUTE, { method: "POST" });
    const result = await res.json();
    if (result.success) {
      router.push(ENV.AUTH_LOGIN_PAGE);
    } else {
      setLogoutLoading(false);
    }
  };

  if (loading || !user) return <ProfileSkeleton />;

  const initials =
    user.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PM";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-in fade-in duration-500">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{user.full_name}</h1>
                {user.role === "admin" && (
                  <ShieldCheck
                    className="w-4 h-4 text-indigo-600"
                    title="Administrator"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              {(user.barangay || user.city) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {user.barangay}, {user.city}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-0.5">
                Member since{" "}
                {new Date(user.created_at).toLocaleDateString("en-PH", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link href="/settings/account">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Orders Completed</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Reviews Written</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- ADMIN SECTION --- */}
      {user.role === "admin" && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-indigo-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Management Portal
              </p>
              <p className="text-xs text-indigo-700 mt-0.5">
                Review applications and manage platform settings.
              </p>
            </div>
            <Link href="/admin/dashboard">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
              >
                Admin Dash
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* --- SELLER SECTION --- */}
      {/* If Approved: Show Dashboard Link */}
      {user.seller_status === "approved" ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-primary flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage your inventory and track your shop sales.
              </p>
            </div>
            <Link href="/seller/dashboard">
              <Button size="sm" variant="default">
                Go to Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* If NOT Approved: Show Application Status */
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-green-800 flex items-center gap-1.5">
                <Store className="w-4 h-4" /> Sell on PubMarket
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {user.seller_status === "pending"
                  ? "Your application is under review."
                  : user.seller_status === "rejected"
                    ? "Application rejected. Click to see why."
                    : "Apply to become a local seller."}
              </p>
            </div>
            <Link
              href={
                user.seller_status === "pending"
                  ? "/seller/pending"
                  : "/seller/apply"
              }
            >
              <Button
                size="sm"
                variant={
                  user.seller_status === "pending" ? "outline" : "default"
                }
              >
                {user.seller_status === "pending" ? "View Status" : "Apply Now"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Menu Links */}
      <Card>
        <CardContent className="p-0">
          {[
            {
              href: "/orders",
              icon: <Package className="w-4 h-4" />,
              label: "My Orders",
            },
            {
              href: "/wishlist",
              icon: <Star className="w-4 h-4" />,
              label: "Wishlist",
            },
            {
              href: "/settings/account",
              icon: <Settings className="w-4 h-4" />,
              label: "Account Settings",
            },
            {
              href: "/settings/addresses",
              icon: <MapPin className="w-4 h-4" />,
              label: "My Addresses",
            },
            {
              href: "/support",
              icon: <Store className="w-4 h-4" />,
              label: "Help & Support",
            },
          ].map((item, i, arr) => (
            <div key={item.href}>
              <Link href={item.href}>
                <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
              {i < arr.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        loading={logoutLoading}
        onClick={logoutHandler}
        className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
      >
        Log Out
      </Button>
    </div>
  );
}
