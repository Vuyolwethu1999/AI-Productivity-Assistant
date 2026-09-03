import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  NotebookPen,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
] as const;

const aiNav = [
  { to: "/admin/ai/email", label: "Smart Email Generator", icon: Mail },
  { to: "/admin/ai/meetings", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/admin/ai/tasks", label: "AI Task Planner", icon: ClipboardList },
  { to: "/admin/ai/history", label: "AI Activity", icon: Sparkles },
] as const;

const bottomNav = [
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof Mail;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export function AdminLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === to + "/" : pathname.startsWith(to);

  const sidebarBody = (mobile: boolean) => (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-3">
      <div className={cn("flex items-center gap-2 px-2 pt-2", collapsed && !mobile && "justify-center px-0")}>
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary font-display text-base font-semibold text-sidebar-primary-foreground">
          Z
        </span>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none text-sidebar-foreground">ZanD</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">Human-blend wig studio</p>
          </div>
        )}
      </div>

      <nav className="space-y-1">
        {nav.map((n) => (
          <NavItem
            key={n.to}
            {...n}
            collapsed={collapsed && !mobile}
            active={isActive(n.to, "exact" in n ? n.exact : false)}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      <div className="space-y-1">
        {(!collapsed || mobile) && (
          <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/45 uppercase">
            AI Tools
          </p>
        )}
        {aiNav.map((n) => (
          <NavItem
            key={n.to}
            {...n}
            collapsed={collapsed && !mobile}
            active={isActive(n.to)}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </div>

      <div className="mt-auto space-y-1">
        {bottomNav.map((n) => (
          <NavItem
            key={n.to}
            {...n}
            collapsed={collapsed && !mobile}
            active={isActive(n.to)}
            onClick={() => setMobileOpen(false)}
          />
        ))}
        <NavItem
          to="/"
          label="View storefront"
          icon={Store}
          collapsed={collapsed && !mobile}
          active={false}
          onClick={() => setMobileOpen(false)}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-200 md:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div className="sticky top-0 h-screen">{sidebarBody(false)}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-sidebar shadow-elegant">
            <button
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            {sidebarBody(true)}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <button
              aria-label="Open navigation"
              className="rounded-md border border-border p-2 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </button>
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-md border border-border p-2 text-muted-foreground hover:text-foreground md:inline-flex"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl leading-tight sm:text-2xl">{title}</h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
