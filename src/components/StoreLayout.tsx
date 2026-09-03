import { Link } from "@tanstack/react-router";
import { Heart, LayoutDashboard, Menu, ShoppingBag, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCartTotals, useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop wigs" },
  { to: "/track", label: "Track order" },
  { to: "/contact", label: "Contact" },
];

export function StoreLayout({ children }: { children: ReactNode }) {
  const { count } = useCartTotals();
  const { wishlist } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            className="rounded-md border border-border p-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-primary font-display text-base font-semibold text-primary-foreground">
              Z
            </span>
            <span className="font-display text-xl tracking-tight">ZanD</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm text-foreground font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link
              to="/wishlist"
              className="relative rounded-md p-2 text-muted-foreground hover:text-foreground"
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-nude text-[10px] font-semibold text-nude-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label="Cart">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-champagne text-[10px] font-semibold text-champagne-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              className="ml-1 hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-secondary sm:inline-flex"
            >
              <LayoutDashboard className="size-3.5" /> Business workspace
            </Link>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-border px-4 py-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-secondary">
              Business workspace
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div>
            <p className="font-display text-xl">ZanD</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Premium human-blend wigs — a considered blend of human hair and high-grade fibre. Not sold as
              100% human hair.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" search={{ category: undefined }} className="hover:text-foreground">All wigs</Link></li>
              <li><Link to="/shop" search={{ category: "Best Sellers" }} className="hover:text-foreground">Best sellers</Link></li>
              <li><Link to="/shop" search={{ category: "New Arrivals" }} className="hover:text-foreground">New arrivals</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/track" className="hover:text-foreground">Track an order</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Studio</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Mon–Fri 09:00–17:00<br />
              hello@zandwigs.co.za<br />
              Johannesburg, South Africa
            </p>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ZanD Human-Blend Wigs. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
