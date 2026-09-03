import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import {
  AiBadge,
  AiDisclaimer,
  AiEmptyState,
  AiErrorState,
  AiLoadingState,
  Field,
  PromptArchitecture,
} from "@/components/ai/AiShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail, type EmailOutput } from "@/lib/ai.functions";
import { uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/ai/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | ZanD AI Tools" },
      { name: "description", content: "Draft customer emails for a human-blend wig business from structured inputs — purpose, audience, tone, context and length. Always reviewed before sending." },
      { property: "og:title", content: "Smart Email Generator | ZanD AI Tools" },
      { property: "og:description", content: "Structured AI email drafting for wig customer communication." },
    ],
  }),
  component: EmailTool,
});

const PURPOSES = [
  "New Product Announcement",
  "Wig Promotion",
  "Restock Announcement",
  "Order Confirmation",
  "Shipping Update",
  "Customer Follow-Up",
  "Abandoned Cart",
  "Customer Service",
  "Thank You",
  "Re-engagement",
  "Custom",
];
const AUDIENCES = ["New Customer", "Existing Customer", "VIP Customer", "Potential Customer"];
const TONES = ["Professional", "Friendly", "Luxury", "Warm", "Promotional", "Casual"];
const LENGTHS = ["Short", "Medium", "Long"];

function EmailTool() {
  const { addAi } = useStore();
  const run = useServerFn(generateEmail);
  const [form, setForm] = useState({
    purpose: PURPOSES[0],
    audience: AUDIENCES[1],
    tone: TONES[0],
    length: LENGTHS[1],
    context: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [output, setOutput] = useState<EmailOutput | null>(null);
  const [previousVersion, setPreviousVersion] = useState<EmailOutput | null>(null);

  const generate = async () => {
    if (form.context.trim().length < 15) {
      setErrors({ context: "Add the facts the email should use — at least a sentence." });
      return;
    }
    setErrors({});
    if (output) setPreviousVersion(output);
    setStatus("loading");
    try {
      const result = await run({ data: form });
      setOutput(result);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(
      `Subject: ${output.subject}\nPreview: ${output.preview}\n\n${output.body}\n\n${output.cta}`,
    );
    toast.success("Draft copied — review it before sending");
  };

  return (
    <AdminLayout
      title="Smart Email Generator"
      description="Structured drafting for customer emails — you review and send, never the AI"
    >
      <AiDisclaimer />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg">Email brief</h2>
          <Field label="Email purpose" required>
            <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Audience" required>
            <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AUDIENCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Tone" required>
            <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TONES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Length" required>
            <Select value={form.length} onValueChange={(v) => setForm({ ...form, length: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LENGTHS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field
            label="Context"
            required
            error={errors.context}
            hint="Product name, price, discount, promotion window, customer detail, dates, desired call to action. The AI uses only what you supply."
          >
            <Textarea
              rows={7}
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
              placeholder={`Product: Zola Sleek Bob Human-Blend Wig (10", glueless 4x4 closure)\nPrice: R2 150\nPromotion: 10% off until 15 September\nCall to action: book a fitting at the Rosebank studio`}
            />
          </Field>
          <Button className="w-full" onClick={generate} disabled={status === "loading"}>
            <Sparkles className="size-4" /> {status === "loading" ? "Generating…" : output ? "Regenerate draft" : "Generate draft"}
          </Button>
          <PromptArchitecture
            items={[
              { label: "System context", value: "AI business communication assistant for a professional human-blend wig business." },
              { label: "Task", value: "Generate a customer-facing email from the supplied purpose, audience, tone, context and length." },
              {
                label: "Constraints",
                value:
                  "No invented specifications, prices or discounts.\nNo unsupported quality claims.\nHuman-blend is never described as 100% human hair.\nOnly user-supplied information is used.\nInclude a call to action when appropriate.",
              },
              { label: "Output", value: "Subject line · Preview text · Email body · Call to action." },
            ]}
          />
        </section>

        <section className="min-w-0">
          {status === "idle" && !output && (
            <AiEmptyState
              title="Draft a customer email in seconds"
              description="Fill in the brief on the left. The tool converts it into a constrained prompt so the draft stays factual and on-brand."
              bullets={[
                "Choose a purpose, audience, tone and length.",
                "Paste the real facts — product, price, dates, promotion.",
                "Review, edit and copy. Nothing is sent automatically.",
              ]}
            />
          )}
          {status === "loading" && <AiLoadingState label="Drafting your email" />}
          {status === "error" && <AiErrorState message={error} onRetry={generate} />}

          {output && status !== "loading" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge />
                <span className="text-xs text-muted-foreground">Editable draft — review before sending</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={generate}><RefreshCw className="size-3.5" /> Regenerate</Button>
                  <Button size="sm" variant="outline" onClick={copy}><Copy className="size-3.5" /> Copy</Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      addAi({
                        id: uid("ai"),
                        kind: "email",
                        title: `${form.purpose} — ${form.audience}`,
                        createdAt: new Date().toISOString(),
                        inputs: form,
                        output,
                      });
                      toast.success("Draft saved to AI activity");
                    }}
                  >
                    <Save className="size-3.5" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setOutput(null); setStatus("idle"); }}>
                    <Trash2 className="size-3.5" /> Discard
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-card">
                <Field label="Subject line">
                  <Input value={output.subject} onChange={(e) => setOutput({ ...output, subject: e.target.value })} />
                </Field>
                <Field label="Preview text">
                  <Input value={output.preview} onChange={(e) => setOutput({ ...output, preview: e.target.value })} />
                </Field>
                <Field label="Email body">
                  <Textarea rows={14} value={output.body} onChange={(e) => setOutput({ ...output, body: e.target.value })} />
                </Field>
                <Field label="Call to action">
                  <Input value={output.cta} onChange={(e) => setOutput({ ...output, cta: e.target.value })} />
                </Field>
              </div>

              {previousVersion && (
                <details className="rounded-xl border border-border bg-card p-4 text-sm">
                  <summary className="cursor-pointer font-medium">Previous version</summary>
                  <p className="mt-3 font-medium">{previousVersion.subject}</p>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">{previousVersion.body}</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setOutput(previousVersion)}>
                    Restore this version
                  </Button>
                </details>
              )}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
