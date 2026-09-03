import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { AiDisclaimer, Field } from "@/components/ai/AiShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings | ZanD Workspace" },
      { name: "description", content: "Business profile, product-claim guardrails and responsible AI settings for the ZanD wig workspace." },
      { property: "og:title", content: "Settings | ZanD Workspace" },
      { property: "og:description", content: "Business profile and responsible AI guardrails." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { ai } = useStore();
  const [profile, setProfile] = useState({
    name: "ZanD Human-Blend Wigs",
    email: "hello@zandwigs.co.za",
    phone: "+27 11 000 0000",
    address: "Rosebank, Johannesburg",
    signature: "Warmly,\nZandile\nZanD Human-Blend Wigs",
  });
  const [guards, setGuards] = useState({
    approval: true,
    labelAi: true,
    blockClaims: true,
    maskCustomers: true,
    autoSend: false,
  });

  return (
    <AdminLayout title="Settings" description="Business profile and responsible AI guardrails">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl">Business profile</h2>
          <Field label="Business name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
          <Field label="Contact email"><Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></Field>
          <Field label="Studio address"><Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></Field>
          <Field label="Default email signature" hint="Appended when you copy an AI draft into your mail client">
            <Textarea rows={4} value={profile.signature} onChange={(e) => setProfile({ ...profile, signature: e.target.value })} />
          </Field>
          <Button onClick={() => toast.success("Business profile saved")}>Save profile</Button>
        </section>

        <section className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl">Responsible AI</h2>
          <AiDisclaimer />
          {[
            { key: "approval", label: "Require human approval before external communication", locked: true },
            { key: "labelAi", label: "Label AI-generated content in the workspace", locked: true },
            { key: "blockClaims", label: "Block unsupported quality claims and 100% human hair wording", locked: true },
            { key: "maskCustomers", label: "Mask customer contact details by default" },
            { key: "autoSend", label: "Automatically send AI-generated emails", locked: true, danger: true },
          ].map((g) => (
            <div key={g.key} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium">{g.label}</p>
                {g.locked && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.danger
                      ? "Permanently disabled — AI drafts always need your review before sending."
                      : "Always on — this safeguard cannot be turned off."}
                  </p>
                )}
              </div>
              <Switch
                checked={guards[g.key as keyof typeof guards]}
                disabled={g.locked}
                onCheckedChange={(v) => setGuards({ ...guards, [g.key]: v })}
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">{ai.length} AI output{ai.length === 1 ? "" : "s"} stored in this workspace.</p>
        </section>
      </div>
    </AdminLayout>
  );
}
