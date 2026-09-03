import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminLayout } from "@/components/AdminLayout";
import { currency, REVENUE_SERIES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | ZanD Workspace" },
      { name: "description", content: "Performance analytics for the ZanD human-blend wig business: revenue, order mix, texture demand and customer value." },
      { property: "og:title", content: "Analytics | ZanD Workspace" },
      { property: "og:description", content: "Revenue trends, product mix and customer value analysis." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  },
};

function AnalyticsPage() {
  const { products, customers, orders } = useStore();

  const byTexture = Object.values(
    products.reduce<Record<string, { texture: string; sold: number }>>((acc, p) => {
      acc[p.texture] = acc[p.texture] ?? { texture: p.texture, sold: 0 };
      acc[p.texture].sold += p.sold;
      return acc;
    }, {}),
  );

  const avgOrder = orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0;
  const repeatRate = Math.round((customers.filter((c) => c.orders > 1).length / customers.length) * 100);

  const stats = [
    { label: "Average order value", value: currency(Math.round(avgOrder)) },
    { label: "Repeat purchase rate", value: `${repeatRate}%` },
    { label: "Best month", value: "August — " + currency(91500) },
    { label: "Catalogue size", value: `${products.length} human-blend units` },
  ];

  return (
    <AdminLayout title="Analytics" description="Where revenue comes from, and what customers actually buy">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg">Revenue vs orders</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_SERIES} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="l" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="l" type="monotone" dataKey="revenue" name="Revenue (R)" stroke="var(--champagne)" strokeWidth={2} />
                <Line yAxisId="r" type="monotone" dataKey="orders" name="Orders" stroke="var(--chart-1)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg">Demand by texture</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTexture} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="texture" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="sold" name="Units sold" fill="var(--nude)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-display text-lg">Top customers by lifetime spend</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Tier</th>
                <th className="pb-2 font-medium">Orders</th>
                <th className="pb-2 text-right font-medium">Lifetime spend</th>
              </tr>
            </thead>
            <tbody>
              {[...customers].sort((a, b) => b.spent - a.spent).map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td className="py-3 capitalize text-muted-foreground">{c.tier}</td>
                  <td className="py-3">{c.orders}</td>
                  <td className="py-3 text-right">{currency(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
