import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order Confirmation | ZanD" },
      { name: "description", content: "Your ZanD human-blend wig order confirmation and delivery status." },
      { property: "og:title", content: "Order Confirmation | ZanD" },
      { property: "og:description", content: "Track the status of your human-blend wig order." },
    ],
  }),
  component: OrderPage,
});

const steps = [
  { key: "pending", label: "Order received", icon: CheckCircle2 },
  { key: "processing", label: "Preparing your unit", icon: Package },
  { key: "shipped", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

function OrderPage() {
  const { id } = Route.useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());

  if (!order) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">Check the order number and try again.</p>
          <Button asChild className="mt-6"><Link to="/track">Track another order</Link></Button>
        </div>
      </StoreLayout>
    );
  }

  const activeIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <CheckCircle2 className="size-3.5" /> Order {order.status === "cancelled" ? "cancelled" : "confirmed"}
        </span>
        <h1 className="mt-4 font-display text-4xl">Order {order.id}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Placed on {order.date} · A confirmation was sent to {order.email}
        </p>

        {order.status !== "cancelled" && (
          <ol className="mt-8 grid gap-4 sm:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.key} className="flex items-center gap-3 sm:flex-col sm:items-start">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full border",
                    i <= activeIndex
                      ? "border-champagne bg-champagne text-champagne-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  <s.icon className="size-4" />
                </span>
                <span className={cn("text-sm", i <= activeIndex ? "font-medium" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Items</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-3 text-sm">
                <span>
                  {it.name}
                  <span className="block text-xs text-muted-foreground">Qty {it.qty} · human-blend wig</span>
                </span>
                <span>{currency(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total</span>
            <span>{currency(order.total)}</span>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Delivering to</p>
            <p>{order.customerName}</p>
            <p>{order.address}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild><Link to="/shop" search={{}}>Continue shopping</Link></Button>
          <Button asChild variant="outline"><Link to="/track">Track another order</Link></Button>
        </div>
      </div>
    </StoreLayout>
  );
}
