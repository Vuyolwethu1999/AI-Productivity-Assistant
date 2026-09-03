import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, Star, Truck, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useAddToCart, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Human-Blend Wig Details | ZanD" },
      {
        name: "description",
        content:
          "Full specifications for this ZanD human-blend wig: composition, length, texture, colour, density, cap construction, care, shipping and returns.",
      },
      { property: "og:title", content: "Human-Blend Wig Details | ZanD" },
      { property: "og:description", content: "Composition, density, cap construction, care and returns for this human-blend wig." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, wishlist, toggleWishlist } = useStore();
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Wig not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This product may have been removed.</p>
          <Button asChild className="mt-6"><Link to="/shop" search={{ category: undefined }}>Back to shop</Link></Button>
        </div>
      </StoreLayout>
    );
  }

  const price = product.salePrice ?? product.price;
  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))).slice(0, 3);

  const specs = [
    ["Hair composition", product.composition],
    ["Length", `${product.length} inches`],
    ["Texture", product.texture],
    ["Colour", product.color],
    ["Density", product.density],
    ["Cap construction", product.cap],
    ["SKU", product.sku],
    ["Availability", product.quantity > 0 ? `${product.quantity} in stock` : "Sold out"],
  ];

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/shop" search={{ category: undefined }} className="hover:text-foreground">Shop</Link> / <span>{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border bg-secondary">
            <img
              src={product.image}
              alt={`${product.name} displayed on a stand`}
              width={1024}
              height={1024}
              className="size-full object-cover"
            />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
              Human-blend wig
            </span>
            <h1 className="mt-3 font-display text-4xl leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-0.5 text-champagne">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("size-3.5", i < Math.round(product.rating) && "fill-champagne")} />
                ))}
              </span>
              {product.rating} · {product.sold} sold
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl">{currency(price)}</span>
              {product.salePrice && (
                <span className="text-lg text-muted-foreground line-through">{currency(product.price)}</span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button className="p-2.5" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button className="p-2.5" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="size-3.5" />
                </button>
              </div>
              <Button
                size="lg"
                disabled={product.quantity === 0}
                onClick={() => {
                  addToCart(product.id, qty);
                  toast.success(`${product.name} added to cart`);
                }}
              >
                {product.quantity === 0 ? "Sold out" : "Add to cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
                }}
              >
                <Heart className={cn("size-4", wished && "fill-nude text-nude")} /> Wishlist
              </Button>
            </div>

            <dl className="mt-8 grid gap-x-6 gap-y-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{k}</dt>
                  <dd className="text-sm">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 space-y-4">
              {[
                { icon: ShieldCheck, title: "Care instructions", body: product.care },
                { icon: Truck, title: "Shipping", body: product.shipping },
                { icon: Undo2, title: "Returns", body: product.returns },
              ].map((s) => (
                <div key={s.title} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <s.icon className="mt-0.5 size-4 shrink-0 text-champagne" />
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl">You may also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
