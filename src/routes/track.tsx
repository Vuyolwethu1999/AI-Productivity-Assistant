import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order | ZanD" },
      { name: "description", content: "Enter your ZanD order number to see the current status of your human-blend wig delivery." },
      { property: "og:title", content: "Track Your Order | ZanD" },
      { property: "og:description", content: "Check the delivery status of your human-blend wig order." },
    ],
  }),
  component: Track,
});

function Track() {
  const [value, setValue] = useState("");
  const { orders } = useStore();
  const navigate = useNavigate();

  return (
    <StoreLayout>
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <h1 className="font-display text-4xl">Track your order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the order number from your confirmation email, for example ZD-1045.
        </p>
        <form
          className="mt-6 flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const found = orders.find((o) => o.id.toLowerCase() === value.trim().toLowerCase());
            if (!found) {
              toast.error("We couldn't find that order number");
              return;
            }
            navigate({ to: "/order/$id", params: { id: found.id } });
          }}
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ZD-1045"
            aria-label="Order number"
            className="flex-1"
          />
          <Button type="submit">Track order</Button>
        </form>
      </div>
    </StoreLayout>
  );
}
