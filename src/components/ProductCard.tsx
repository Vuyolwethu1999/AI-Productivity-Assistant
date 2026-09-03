import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/data";
import { useAddToCart, useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();
  const { wishlist, toggleWishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const price = product.salePrice ?? product.price;
  const out = product.quantity === 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elegant">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img
            src={product.image}
            alt={`${product.name} on a display stand`}
            loading="lazy"
            width={1024}
            height={1024}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.salePrice && (
            <span className="rounded-full bg-nude px-2.5 py-1 text-[11px] font-semibold text-nude-foreground">
              Sale
            </span>
          )}
          {product.categories.includes("New Arrivals") && (
            <span className="rounded-full bg-champagne px-2.5 py-1 text-[11px] font-semibold text-champagne-foreground">
              New
            </span>
          )}
          {out && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">
              Sold out
            </span>
          )}
        </div>
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => {
            toggleWishlist(product.id);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-background/90 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Heart className={cn("size-4", wished && "fill-nude text-nude")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] tracking-wider text-muted-foreground uppercase">
          {product.length}" · {product.texture} · {product.color}
        </p>
        <h3 className="font-display text-lg leading-snug">
          <Link to="/product/$id" params={{ id: product.id }} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">Human-blend · {product.density} density</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">{currency(price)}</span>
            {product.salePrice && (
              <span className="text-sm text-muted-foreground line-through">{currency(product.price)}</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={out}
            onClick={() => {
              addToCart(product.id);
              toast.success(`${product.name} added to cart`);
            }}
          >
            {out ? "Sold out" : "Add to cart"}
          </Button>
        </div>
      </div>
    </article>
  );
}
