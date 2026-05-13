"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  Package,
  User,
  Bell,
  Search,
  Store,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  mockCurrentUser,
  mockNotifications,
  mockCartItems,
} from "@/lib/mockup/pubMarket-data-mockup";
import { cn } from "@/lib/utils/cn";

const bottomNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/products", label: "Browse", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/profile", label: "Profile", icon: User },
];

const topNavItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/products", label: "Browse" },
  { href: "/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const unreadCount = mockNotifications.filter(
    (n) => !n.isRead && n.userId === mockCurrentUser.id,
  ).length;
  const cartCount = mockCartItems.filter(
    (c) => c.userId === mockCurrentUser.id,
  ).length;
  const initials = mockCurrentUser.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── TOP NAVBAR (desktop) ── */}
      <header className="sticky top-0 z-50 bg-background border-b border-border hidden md:flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
          <Store className="w-5 h-5" />
          PubMarket
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {topNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuContent>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={mockCurrentUser.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden lg:block">
                    {mockCurrentUser.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenuContent>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings/account"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/seller/apply" className="flex items-center gap-2">
                  <Store className="w-4 h-4" /> Become a Seller
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── MOBILE TOP BAR ── */}
      <header className="sticky top-0 z-50 bg-background border-b border-border flex md:hidden items-center justify-between px-4 h-14">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-bold text-base text-primary"
        >
          <Store className="w-4 h-4" />
          PubMarket
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-0">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* ── BOTTOM NAV (mobile only) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const isCart = item.href === "/cart";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
                {isCart && cartCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-white border-0">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  active ? "font-semibold" : "font-normal",
                )}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
