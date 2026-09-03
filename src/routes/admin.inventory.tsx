import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currency } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory | ZanD Workspace" },
      { name: "description", content: "Monitor stock levels for every human-blend wig, spot low stock early and adjust quantities." },
      { property: "og:title", content: "Inventory | ZanD Workspace" },
      { property: "og:description", content: "Stock levels and restock alerts for the wig catalogue." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { products, setProducts } = useStore();
  const low = products.filter((p) => p.quantity <= 5);
  const stockValue = products.reduce((s, p) => s + p.quantity * (p.salePrice ?? p.price), 0);

  const adjust = (id: string, delta: number) =>
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)));

  return (
    <AdminLayout title="Inventory" description={`Stock on hand valued at ${currency(stockValue)}`}>
      {low.length > 0 && (
        <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-medium">{low.length} unit{low.length === 1 ? "" : "s"} need attention</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {low.map((p) => p.name).join(", ")} — restock before the next campaign.{" "}
              <Link to="/admin/ai/tasks" className="underline">Build a restock plan with AI</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">On hand</th>
              <th className="p-4 font-medium">Stock value</th>
              <th className="p-4 font-medium">Health</th>
              <th className="p-4 text-right font-medium">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" loading="lazy" width={1024} height={1024} className="size-10 rounded-md object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.sku}</td>
                <td className="p-4">
                  <Input
                    type="number"
                    value={p.quantity}
                    onChange={(e) =>
                      setProducts((list) =>
                        list.map((x) => (x.id === p.id ? { ...x, quantity: Math.max(0, Number(e.target.value)) } : x)),
                      )
                    }
                    className="w-20"
                    aria-label={`Stock for ${p.name}`}
                  />
                </td>
                <td className="p-4">{currency(p.quantity * (p.salePrice ?? p.price))}</td>
                <td className="p-4">
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    p.quantity === 0 ? "bg-destructive/10 text-destructive" : p.quantity <= 5 ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                  )}>
                    {p.quantity === 0 ? "Out of stock" : p.quantity <= 5 ? "Low stock" : "Healthy"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="icon" aria-label="Decrease stock" onClick={() => adjust(p.id, -1)}>
                      <Minus className="size-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Increase stock" onClick={() => { adjust(p.id, 5); toast.success("Added 5 units"); }}>
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
