import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currency } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders | ZanD Workspace" },
      { name: "description", content: "Track and update every human-blend wig order from pending through to delivered." },
      { property: "og:title", content: "Orders | ZanD Workspace" },
      { property: "og:description", content: "Track and update wig orders across their lifecycle." },
    ],
  }),
  component: OrdersPage,
});

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-warning/15 text-warning",
  processing: "bg-ai-soft text-ai",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

function OrdersPage() {
  const { orders, setOrders } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    let list = orders;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
    }
    if (status !== "all") list = list.filter((o) => o.status === status);
    return list;
  }, [orders, query, status]);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <AdminLayout title="Orders" description={`${orders.length} orders · ${currency(revenue)} booked`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order number or customer" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-14 text-center">
          <p className="font-display text-xl">No orders match</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different search term or status.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4 font-medium">
                    <Link to="/order/$id" params={{ id: o.id }} className="hover:underline">{o.id}</Link>
                  </td>
                  <td className="p-4">
                    {o.customerName}
                    <span className="block text-xs text-muted-foreground">{o.email}</span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </td>
                  <td className="p-4 text-muted-foreground">{o.date}</td>
                  <td className="p-4">{currency(o.total)}</td>
                  <td className="p-4">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusTone[o.status])}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Select
                        value={o.status}
                        onValueChange={(v) => {
                          setOrders((list) => list.map((x) => (x.id === o.id ? { ...x, status: v as OrderStatus } : x)));
                          toast.success(`${o.id} marked ${v}`);
                        }}
                      >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Need to write to a customer about one of these orders?{" "}
        <Link to="/admin/ai/email" className="underline">Draft it in the Smart Email Generator</Link> — nothing sends
        without your review.
      </p>
    </AdminLayout>
  );
}
