import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/ai/AiShell";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currency } from "@/lib/data";
import { useCartTotals, useStore } from "@/lib/store";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | ZanD Human-Blend Wigs" },
      { name: "description", content: "Complete your ZanD human-blend wig order with delivery details." },
      { property: "og:title", content: "Checkout | ZanD" },
      { property: "og:description", content: "Complete your human-blend wig order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const { lines, subtotal, count } = useCartTotals();
  const { setOrders, setCart, orders } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shipping = subtotal > 2500 || subtotal === 0 ? 0 : 150;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address";
    if (!form.phone.trim()) next.phone = "Please enter a contact number";
    if (!form.address.trim()) next.address = "Please enter a delivery address";
    setErrors(next);
    if (Object.keys(next).length) return;

    const id = `ZD-${1048 + orders.filter((o) => o.id.startsWith("ZD-")).length}`;
    const order: Order = {
      id,
      customerId: "guest",
      customerName: form.name,
      email: form.email,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        qty: l.qty,
        price: l.product.salePrice ?? l.product.price,
      })),
      total: subtotal + shipping,
      address: form.address,
    };
    setOrders((o) => [order, ...o]);
    setCart(() => []);
    toast.success("Order placed");
    navigate({ to: "/order/$id", params: { id } });
  };

  if (count === 0) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Nothing to check out</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add a wig to your cart first.</p>
          <Button asChild className="mt-6"><Link to="/shop" search={{ category: undefined }}>Shop wigs</Link></Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl">Checkout</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Delivery details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nomsa Dlamini" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+27 82 000 0000" />
              </Field>
              <Field label="City" >
                <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Johannesburg" />
              </Field>
            </div>
            <Field label="Delivery address" required error={errors.address}>
              <Textarea rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, suburb, city, postal code" />
            </Field>
            <Button size="lg" className="w-full" onClick={submit}>Place order</Button>
            <p className="text-center text-xs text-muted-foreground">
              This demo storefront records the order in your workspace; no payment is taken.
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate">{product.name}</span>
                    <span className="text-xs text-muted-foreground">Qty {qty} · human-blend</span>
                  </span>
                  <span>{currency((product.salePrice ?? product.price) * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{currency(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{shipping === 0 ? "Free" : currency(shipping)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{currency(subtotal + shipping)}</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}
