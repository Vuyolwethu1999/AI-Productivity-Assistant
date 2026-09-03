import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/ai/AiShell";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ZanD | Human-Blend Wig Studio" },
      { name: "description", content: "Ask about sizing, textures, colour matching or delivery — the ZanD human-blend wig studio replies within one business day." },
      { property: "og:title", content: "Contact ZanD" },
      { property: "og:description", content: "Questions about a human-blend wig? Reach the studio." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <StoreLayout>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl">Talk to the studio</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Not sure which length or cap suits you? Send us a note and we'll help you choose, or book a
            consultation and we'll match a human-blend unit to your routine.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3"><Mail className="size-4 text-champagne" /> hello@zandwigs.co.za</li>
            <li className="flex gap-3"><Phone className="size-4 text-champagne" /> +27 11 000 0000</li>
            <li className="flex gap-3"><MapPin className="size-4 text-champagne" /> Rosebank, Johannesburg</li>
          </ul>
        </div>
        <form
          className="space-y-5 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const next: Record<string, string> = {};
            if (!form.name.trim()) next.name = "Please enter your name";
            if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email";
            if (form.message.trim().length < 10) next.message = "Please add a little more detail";
            setErrors(next);
            if (Object.keys(next).length) return;
            toast.success("Message sent — we'll reply within one business day");
            setForm({ name: "", email: "", message: "" });
          }}
        >
          <Field label="Name" required error={errors.name}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="How can we help?" required error={errors.message}>
            <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </div>
    </StoreLayout>
  );
}
