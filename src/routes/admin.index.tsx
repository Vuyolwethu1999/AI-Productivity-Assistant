import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Mail,
  NotebookPen,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { currency, REVENUE_SERIES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Business Dashboard | ZanD Workspace" },
      { name: "description", content: "Revenue, orders, customers, inventory health and AI activity for the ZanD human-blend wig business." },
      { property: "og:title", content: "Business Dashboard | ZanD Workspace" },
      { property: "og:description", content: "One view of revenue, orders, stock and AI-assisted work." },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  delta: number;
  icon: typeof Users;
  tone?: "default" | "warn";
}) {
  const up = delta >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={cn("grid size-8 place-items-center rounded-md bg-secondary text-muted-foreground", tone === "warn" && "bg-warning/15 text-warning")}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl">{value}</p>
      <p className={cn("mt-1 flex items-center gap-1 text-xs", up ? "text-success" : "text-destructive")}>
        {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
        {Math.abs(delta)}% vs previous period
      </p>
    </div>
  );
}

const chartTooltip = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 12,
  },
};

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4">
        <h2 className="font-display text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const { orders, customers, products, ai } = useStore();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
  const outStock = products.filter((p) => p.quantity === 0).length;
  const pending = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p) => ({
    name: p.name.split(" ")[0],
    sold: p.sold,
  }));

  const inventoryStatus = [
    { name: "Healthy", value: products.filter((p) => p.quantity > 5).length, fill: "var(--success)" },
    { name: "Low stock", value: lowStock, fill: "var(--warning)" },
    { name: "Out of stock", value: outStock, fill: "var(--destructive)" },
  ];

  return (
    <AdminLayout
      title="Business dashboard"
      description="Everything happening across the ZanD human-blend wig studio today"
      actions={
        <Button asChild size="sm">
          <Link to="/admin/ai/tasks"><Sparkles className="size-3.5" /> Plan with AI</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi label="Total revenue" value={currency(revenue + 91500)} delta={23.4} icon={TrendingUp} />
        <Kpi label="Orders" value={String(orders.length)} delta={12.1} icon={ShoppingBag} />
        <Kpi label="Customers" value={String(customers.length + 98)} delta={8.6} icon={Users} />
        <Kpi label="Products" value={String(products.length)} delta={4.2} icon={Package} />
        <Kpi label="Low stock items" value={String(lowStock + outStock)} delta={-15.3} icon={Boxes} tone="warn" />
        <Kpi label="Pending orders" value={String(pending)} delta={-6.8} icon={ClipboardList} tone="warn" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Revenue over time" subtitle="Last six months, in rand">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--champagne)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--champagne)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...chartTooltip} formatter={(v: number) => currency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="var(--champagne)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Orders over time" subtitle="Monthly order volume">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_SERIES} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="orders" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Best-selling wigs" subtitle="Units sold to date">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellers} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="sold" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Inventory status" subtitle="Across the active catalogue">
          <div className="flex h-64 items-center gap-4">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={inventoryStatus} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>
                  {inventoryStatus.map((e) => (
                    <Cell key={e.name} fill={e.fill} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-3 text-sm">
              {inventoryStatus.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: s.fill }} />
                  {s.name} <span className="text-muted-foreground">({s.value})</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Customer growth" subtitle="Cumulative customers">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="cust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--nude)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--nude)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="customers" stroke="var(--nude)" strokeWidth={2} fill="url(#cust)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Connected AI workflow" subtitle="How the AI tools hand work to each other">
          <ol className="space-y-3 text-sm">
            {[
              { icon: NotebookPen, label: "Customer consultation", to: "/admin/ai/meetings", copy: "Summarise the consultation into decisions and action items." },
              { icon: ClipboardList, label: "Action items → task plan", to: "/admin/ai/tasks", copy: "Turn the summary into a prioritised, dated plan." },
              { icon: Mail, label: "Task → customer follow-up", to: "/admin/ai/email", copy: "Draft the follow-up email from that plan, ready for review." },
            ].map((s, i) => (
              <li key={s.label} className="flex gap-3 rounded-lg border border-border p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-ai-soft text-ai">
                  <s.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <Link to={s.to} className="flex items-center gap-1 font-medium hover:underline">
                    {i + 1}. {s.label} <ArrowRight className="size-3.5" />
                  </Link>
                  <p className="text-xs text-muted-foreground">{s.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            {ai.length} saved AI output{ai.length === 1 ? "" : "s"} ·{" "}
            <Link to="/admin/ai/history" className="underline">open AI activity</Link>
          </p>
        </Panel>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Recent orders</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/admin/orders">View all</Link></Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium">{o.id}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3 text-muted-foreground">{o.date}</td>
                  <td className="py-3 capitalize">{o.status}</td>
                  <td className="py-3 text-right">{currency(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
