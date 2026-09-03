import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { ProductCard } from "@/components/ProductCard";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZanD Human-Blend Wigs | Premium Blend Units" },
      {
        name: "description",
        content:
          "Shop ZanD human-blend wigs — bobs, body wave, curly and coloured units with lace and glueless caps. Honest human-blend construction, 14-day returns.",
      },
      { property: "og:title", content: "ZanD Human-Blend Wigs" },
      {
        property: "og:description",
        content: "Premium human-blend wigs: bobs, body wave, curly and coloured units with honest specs.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useStore();
  const featured = products.filter((p) => p.status === "active").slice(0, 4);

  return (
    <StoreLayout>
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="ZanD boutique display of styled human-blend wigs"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-champagne/50 bg-background/70 px-3 py-1 text-xs font-medium tracking-wide">
              <Sparkles className="size-3.5 text-champagne" /> Human-blend, honestly labelled
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-6xl">
              Wigs that move like hair, priced like sense.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Every ZanD unit is a human-blend: human hair blended with premium heat-friendly fibre. We tell
              you the exact composition, density and cap on every product — never sold as 100% human hair.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop" search={{ category: undefined }}>
                  Shop the collection <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/admin">Explore the business workspace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { icon: ShieldCheck, title: "Transparent composition", copy: "Blend ratio, density and cap listed on every unit." },
            { icon: Truck, title: "Fast nationwide delivery", copy: "Dispatched in 1–2 days, tracking on every order." },
            { icon: Sparkles, title: "Styling consultations", copy: "Book a fitting and we'll match length and texture." },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <f.icon className="mt-0.5 size-5 shrink-0 text-champagne" />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">Featured wigs</h2>
            <p className="mt-1 text-sm text-muted-foreground">Our most requested human-blend units this month.</p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/shop" search={{ category: undefined }}>
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl">Shop by style</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-champagne hover:bg-accent"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
