// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/settings/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Lock, MapPin, Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const settingsTabs = [
  {
    href: "/settings/account",
    icon: <User className="w-4 h-4" />,
    label: "Account",
  },
  {
    href: "/settings/security",
    icon: <Lock className="w-4 h-4" />,
    label: "Security",
  },
  {
    href: "/settings/addresses",
    icon: <MapPin className="w-4 h-4" />,
    label: "Addresses",
  },
  {
    href: "/settings/notifications",
    icon: <Bell className="w-4 h-4" />,
    label: "Notifications",
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Settings</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / horizontal tabs */}
        <aside className="md:w-48 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            {settingsTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  pathname === tab.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {tab.icon} {tab.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
export { SettingsLayout as default };
