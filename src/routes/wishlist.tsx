import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist | ZanD Human-Blend Wigs" },
      { name: "description", content: "The human-blend wigs you have saved at ZanD, ready to revisit or add to your cart." },
      { property: "og:title", content: "Your Wishlist | ZanD" },
      { property: "og:description", content: "Saved human-blend wigs, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, products } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl">Your wishlist</h1>
        {saved.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-14 text-center">
            <Heart className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl">Nothing saved yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any wig to save it for later.</p>
            <Button asChild className="mt-6"><Link to="/shop">Shop wigs</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
