import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, COLORS, TEXTURES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Human-Blend Wigs | ZanD" },
      {
        name: "description",
        content:
          "Browse ZanD human-blend wigs by length, texture, colour and price. Bobs, body wave, deep wave, curly, lace and glueless caps.",
      },
      { property: "og:title", content: "Shop Human-Blend Wigs | ZanD" },
      { property: "og:description", content: "Filter human-blend wigs by length, texture, colour and price." },
    ],
  }),
  component: Shop,
});

const LENGTHS = [
  { label: "Short (≤14\")", min: 0, max: 14 },
  { label: "Mid (16\"–20\")", min: 15, max: 20 },
  { label: "Long (22\"+)", min: 21, max: 40 },
];

function Shop() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [texture, setTexture] = useState("all");
  const [color, setColor] = useState("all");
  const [lengthBand, setLengthBand] = useState("all");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = products.filter((p) => p.status === "active");
    if (category) list = list.filter((p) => p.categories.includes(category));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.texture.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q),
      );
    }
    if (texture !== "all") list = list.filter((p) => p.texture === texture);
    if (color !== "all") list = list.filter((p) => p.color === color);
    if (lengthBand !== "all") {
      const band = LENGTHS.find((l) => l.label === lengthBand);
      if (band) list = list.filter((p) => p.length >= band.min && p.length <= band.max);
    }
    list = list.filter((p) => (p.salePrice ?? p.price) <= maxPrice);

    const priced = (p: (typeof list)[number]) => p.salePrice ?? p.price;
    if (sort === "price-asc") list = [...list].sort((a, b) => priced(a) - priced(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => priced(b) - priced(a));
    if (sort === "length") list = [...list].sort((a, b) => b.length - a.length);
    if (sort === "popular") list = [...list].sort((a, b) => b.sold - a.sold);
    return list;
  }, [products, category, query, texture, color, lengthBand, maxPrice, sort]);

  const reset = () => {
    setQuery("");
    setMaxPrice(5000);
    setTexture("all");
    setColor("all");
    setLengthBand("all");
    navigate({ search: { category: undefined } });
  };

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: { category: undefined } })}
            className={cn(
              "rounded-full border border-border px-3 py-1.5 text-xs",
              !category && "border-champagne bg-accent font-medium",
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate({ search: { category: c } })}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-accent",
                category === c && "border-champagne bg-accent font-medium",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Max price</p>
        <Slider
          className="mt-4"
          value={[maxPrice]}
          min={1000}
          max={5000}
          step={100}
          onValueChange={(v) => setMaxPrice(v[0])}
        />
        <p className="mt-2 text-xs text-muted-foreground">Up to R {maxPrice.toLocaleString("en-ZA")}</p>
      </div>

      <div className="grid gap-4">
        <div>
          <p className="mb-1.5 text-sm font-semibold">Length</p>
          <Select value={lengthBand} onValueChange={setLengthBand}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All lengths</SelectItem>
              {LENGTHS.map((l) => (
                <SelectItem key={l.label} value={l.label}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold">Texture</p>
          <Select value={texture} onValueChange={setTexture}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All textures</SelectItem>
              {TEXTURES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold">Colour</p>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All colours</SelectItem>
              {COLORS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={reset} className="w-full">
        <X className="size-3.5" /> Clear filters
      </Button>
    </div>
  );

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl">{category ?? "All human-blend wigs"}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every unit lists its blend ratio, density and cap construction. Human-blend means human hair blended
          with premium heat-friendly fibre — never described as 100% human hair.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">{filters}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search wigs, SKU, texture…"
                className="max-w-xs flex-1"
                aria-label="Search wigs"
              />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popular">Best selling</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="length">Longest first</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen((f) => !f)}>
                <SlidersHorizontal className="size-4" /> Filters
              </Button>
              <span className="ml-auto text-sm text-muted-foreground">{results.length} wigs</span>
            </div>

            {filtersOpen && (
              <div className="mt-4 rounded-xl border border-border bg-card p-5 lg:hidden">{filters}</div>
            )}

            {results.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
                <p className="font-display text-xl">No wigs match those filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening the price range or clearing a filter.
                </p>
                <Button className="mt-5" variant="outline" onClick={reset}>Clear filters</Button>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
