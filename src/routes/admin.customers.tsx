import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currency } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers | ZanD Workspace" },
      { name: "description", content: "Customer records, tiers, spend and consultation preferences for the ZanD human-blend wig studio." },
      { property: "og:title", content: "Customers | ZanD Workspace" },
      { property: "og:description", content: "Customer tiers, spend and wig preferences in one place." },
    ],
  }),
  component: CustomersPage,
});

const tierTone: Record<string, string> = {
  vip: "bg-champagne/30 text-champagne-foreground",
  existing: "bg-accent text-accent-foreground",
  new: "bg-success/10 text-success",
};

function mask(value: string, reveal: boolean) {
  if (reveal) return value;
  const [name, domain] = value.split("@");
  if (domain) return `${name.slice(0, 2)}•••@${domain}`;
  return value.slice(0, 6) + "•••";
}

function CustomersPage() {
  const { customers, orders } = useStore();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [reveal, setReveal] = useState(false);

  const rows = useMemo(() => {
    let list = customers;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    }
    if (tier !== "all") list = list.filter((c) => c.tier === tier);
    return list;
  }, [customers, query, tier]);

  return (
    <AdminLayout
      title="Customers"
      description={`${customers.length} customer records`}
      actions={
        <Button size="sm" variant="outline" onClick={() => setReveal((r) => !r)}>
          {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {reveal ? "Hide contact details" : "Reveal contact details"}
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
        Contact details are masked by default and are never included in AI prompts unless you paste them into a
        context field yourself.
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or city" className="pl-9" />
        </div>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="existing">Existing</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) => {
          const recent = orders.filter((o) => o.customerId === c.id).slice(0, 2);
          return (
            <article key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg">{c.name}</h2>
                  <p className="text-xs text-muted-foreground">{c.city} · joined {c.joined}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase", tierTone[c.tier])}>
                  {c.tier}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-muted-foreground">Orders</dt><dd>{c.orders}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Lifetime spend</dt><dd>{currency(c.spent)}</dd></div>
                <div className="col-span-2"><dt className="text-xs text-muted-foreground">Email</dt><dd className="truncate">{mask(c.email, reveal)}</dd></div>
                <div className="col-span-2"><dt className="text-xs text-muted-foreground">Phone</dt><dd>{mask(c.phone, reveal)}</dd></div>
              </dl>
              <p className="mt-4 rounded-lg bg-secondary/70 p-3 text-xs text-muted-foreground">{c.notes}</p>
              {recent.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Recent: {recent.map((o) => o.id).join(", ")}
                </p>
              )}
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link to="/admin/ai/email">Draft a follow-up email</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </AdminLayout>
  );
}
