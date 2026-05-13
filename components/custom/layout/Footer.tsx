import Link from "next/link";
import { Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-base text-primary mb-2">
              <Store className="w-4 h-4" /> PubMarket
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A local marketplace connecting buyers and sellers in your
              community.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Explore</p>
            <div className="space-y-1.5">
              {[
                { href: "/products", label: "Browse Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Account</p>
            <div className="space-y-1.5">
              {[
                { href: "/login", label: "Log In" },
                { href: "/register", label: "Sign Up" },
                { href: "/seller/apply", label: "Become a Seller" },
                { href: "/support", label: "Help & Support" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PubMarket. All rights reserved. — School
          Project
        </div>
      </div>
    </footer>
  );
}
