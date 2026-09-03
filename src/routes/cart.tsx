import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useCartTotals, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | ZanD Human-Blend Wigs" },
      { name: "description", content: "Review the human-blend wigs in your ZanD cart before checkout." },
      { property: "og:title", content: "Your Cart | ZanD" },
      { property: "og:description", content: "Review your selected human-blend wigs before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { setCart } = useStore();
  const { lines, subtotal, count } = useCartTotals();
  const shipping = subtotal > 2500 || subtotal === 0 ? 0 : 150;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl">Your cart</h1>

        {count === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-14 text-center">
            <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">Browse the collection and add a unit to get started.</p>
            <Button asChild className="mt-6"><Link to="/shop" search={{ category: undefined }}>Shop wigs</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="size-24 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link to="/product/$id" params={{ id: product.id }} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.length}" · {product.texture} · {product.color} · human-blend
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          aria-label="Decrease quantity"
                          className="p-2"
                          onClick={() =>
                            setCart((c) =>
                              c
                                .map((l) => (l.productId === product.id ? { ...l, qty: l.qty - 1 } : l))
                                .filter((l) => l.qty > 0),
                            )
                          }
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="p-2"
                          onClick={() =>
                            setCart((c) => c.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + 1 } : l)))
                          }
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setCart((c) => c.filter((l) => l.productId !== product.id))}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-medium">{currency((product.salePrice ?? product.price) * qty)}</p>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-xl border border-border bg-card p-5">
              <h2 className="font-display text-xl">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{currency(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{shipping === 0 ? "Free" : currency(shipping)}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt><dd>{currency(subtotal + shipping)}</dd>
                </div>
              </dl>
              <Button asChild className="mt-5 w-full" size="lg"><Link to="/checkout">Checkout</Link></Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Free delivery on orders over R 2 500</p>
            </aside>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
