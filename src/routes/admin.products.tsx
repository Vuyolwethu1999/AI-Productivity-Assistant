import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Field } from "@/components/ai/AiShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, COLORS, currency, TEXTURES } from "@/lib/data";
import { uid, useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import fallback from "@/assets/wig-body-wave.jpg";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products | ZanD Workspace" },
      { name: "description", content: "Manage the ZanD human-blend wig catalogue: composition, length, texture, colour, density, cap and stock." },
      { property: "og:title", content: "Products | ZanD Workspace" },
      { property: "og:description", content: "Manage the human-blend wig catalogue and stock levels." },
    ],
  }),
  component: ProductsPage,
});

const empty: Product = {
  id: "",
  name: "",
  sku: "",
  price: 0,
  image: fallback,
  categories: [],
  composition: "55% human hair / 45% premium fibre (human-blend)",
  length: 18,
  texture: "Straight",
  color: "Natural Black",
  density: "180%",
  cap: "13x4 lace frontal",
  quantity: 0,
  description: "",
  care: "Wash every 8-10 wears with a sulphate-free shampoo. Air dry on a wig stand.",
  shipping: "Dispatched within 1-2 business days.",
  returns: "14-day returns on unworn units with the lace uncut.",
  status: "draft",
  rating: 0,
  sold: 0,
};

function ProductsPage() {
  const { products, setProducts } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name");
  const [editing, setEditing] = useState<Product | null>(null);

  const rows = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (category !== "all") list = list.filter((p) => p.categories.includes(category));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "stock") list = [...list].sort((a, b) => a.quantity - b.quantity);
    return list;
  }, [products, query, category, sort]);

  const save = (p: Product) => {
    if (!p.name.trim() || !p.sku.trim() || p.price <= 0) {
      toast.error("Name, SKU and a price above zero are required");
      return;
    }
    setProducts((list) =>
      p.id ? list.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: uid("wig") }, ...list],
    );
    toast.success(p.id ? "Product updated" : "Product added");
    setEditing(null);
  };

  return (
    <AdminLayout
      title="Products"
      description={`${products.length} human-blend units in the catalogue`}
      actions={
        <Button size="sm" onClick={() => setEditing({ ...empty })}>
          <Plus className="size-3.5" /> Add product
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or SKU" className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort: name</SelectItem>
            <SelectItem value="price">Sort: price</SelectItem>
            <SelectItem value="stock">Sort: stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-14 text-center">
          <p className="font-display text-xl">No products match</p>
          <p className="mt-2 text-sm text-muted-foreground">Adjust the search or add a new human-blend unit.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Specs</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" loading="lazy" width={1024} height={1024} className="size-12 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.categories.slice(0, 3).join(" · ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.sku}</td>
                  <td className="p-4 text-xs text-muted-foreground">{p.length}" · {p.texture} · {p.color} · {p.density}</td>
                  <td className="p-4">
                    {currency(p.salePrice ?? p.price)}
                    {p.salePrice && <span className="ml-1 text-xs text-muted-foreground line-through">{currency(p.price)}</span>}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      p.quantity === 0 ? "bg-destructive/10 text-destructive" : p.quantity <= 5 ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                    )}>
                      {p.quantity} units
                    </span>
                  </td>
                  <td className="p-4 capitalize text-muted-foreground">{p.status}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit product" onClick={() => setEditing(p)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete product"
                        onClick={() => {
                          setProducts((list) => list.filter((x) => x.id !== p.id));
                          toast.success("Product deleted");
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing?.id ? "Edit product" : "Add human-blend wig"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name" required>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="SKU" required>
                <Input value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
              </Field>
              <Field label="Price (R)" required>
                <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </Field>
              <Field label="Sale price (R)" hint="Leave empty for no sale">
                <Input type="number" value={editing.salePrice ?? ""} onChange={(e) => setEditing({ ...editing, salePrice: e.target.value ? Number(e.target.value) : undefined })} />
              </Field>
              <Field label="Hair composition" hint="Human-blend ratio — never label as 100% human hair">
                <Input value={editing.composition} onChange={(e) => setEditing({ ...editing, composition: e.target.value })} />
              </Field>
              <Field label="Length (inches)">
                <Input type="number" value={editing.length} onChange={(e) => setEditing({ ...editing, length: Number(e.target.value) })} />
              </Field>
              <Field label="Texture">
                <Select value={editing.texture} onValueChange={(v) => setEditing({ ...editing, texture: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TEXTURES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Colour">
                <Select value={editing.color} onValueChange={(v) => setEditing({ ...editing, color: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Density">
                <Input value={editing.density} onChange={(e) => setEditing({ ...editing, density: e.target.value })} />
              </Field>
              <Field label="Cap construction">
                <Input value={editing.cap} onChange={(e) => setEditing({ ...editing, cap: e.target.value })} />
              </Field>
              <Field label="Quantity available">
                <Input type="number" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} />
              </Field>
              <Field label="Status">
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Product["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Categories" hint="Click to toggle">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const on = editing.categories.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              categories: on ? editing.categories.filter((x) => x !== c) : [...editing.categories, c],
                            })
                          }
                          className={cn("rounded-full border border-border px-3 py-1 text-xs", on && "border-champagne bg-accent font-medium")}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Care instructions">
                  <Textarea rows={2} value={editing.care} onChange={(e) => setEditing({ ...editing, care: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Shipping information">
                  <Textarea rows={2} value={editing.shipping} onChange={(e) => setEditing({ ...editing, shipping: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Return information">
                  <Textarea rows={2} value={editing.returns} onChange={(e) => setEditing({ ...editing, returns: e.target.value })} />
                </Field>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save(editing)}>Save product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
