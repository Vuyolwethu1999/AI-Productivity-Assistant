import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Mail, Megaphone, Sparkles, Target } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { AiDisclaimer } from "@/components/ai/AiShell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing | ZanD Workspace" },
      { name: "description", content: "Plan wig campaigns, launches and customer re-engagement, then draft the messaging with AI assistance." },
      { property: "og:title", content: "Marketing | ZanD Workspace" },
      { property: "og:description", content: "Campaign planning for the human-blend wig studio." },
    ],
  }),
  component: MarketingPage,
});

const campaigns = [
  {
    name: "Glueless bob launch",
    status: "In flight",
    window: "1 – 21 Sep 2026",
    audience: "Existing + new customers",
    channel: "Email · Instagram",
    goal: "Sell 40 units of the new glueless bob range",
    progress: 62,
  },
  {
    name: "Spring colour edit",
    status: "Planning",
    window: "15 Sep – 10 Oct 2026",
    audience: "VIP customers",
    channel: "Email · WhatsApp broadcast",
    goal: "Introduce chestnut and honey blonde units to repeat buyers",
    progress: 18,
  },
  {
    name: "Winback: no order in 90 days",
    status: "Draft",
    window: "October 2026",
    audience: "Lapsed customers",
    channel: "Email",
    goal: "Re-engage 120 lapsed customers with a care-first message",
    progress: 5,
  },
];

const tone: Record<string, string> = {
  "In flight": "bg-success/10 text-success",
  Planning: "bg-accent text-accent-foreground",
  Draft: "bg-secondary text-muted-foreground",
};

function MarketingPage() {
  const { ai } = useStore();
  const emails = ai.filter((a) => a.kind === "email").length;

  return (
    <AdminLayout title="Marketing" description="Campaigns, launches and the AI workflow behind them">
      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((c) => (
          <article key={c.name} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg">{c.name}</h2>
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", tone[c.status])}>{c.status}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CalendarDays className="size-4 shrink-0" /> {c.window}</li>
              <li className="flex gap-2"><Target className="size-4 shrink-0" /> {c.goal}</li>
              <li className="flex gap-2"><Megaphone className="size-4 shrink-0" /> {c.channel} · {c.audience}</li>
            </ul>
            <div className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-champagne" style={{ width: `${c.progress}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{c.progress}% of planned tasks complete</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to="/admin/ai/tasks">Plan tasks</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/admin/ai/email">Draft email</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-xl">Campaign workflow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each stage hands its output to the next tool, so a new wig becomes a plan and a plan becomes a review-ready email.
        </p>
        <ol className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: Sparkles, label: "New wig added", copy: "Catalogue entry with confirmed specs." },
            { icon: Target, label: "AI task plan", copy: "Shoot, copy, pricing and launch tasks." },
            { icon: Mail, label: "Smart email draft", copy: "Announcement written from your facts only." },
            { icon: Megaphone, label: "You review & send", copy: "Nothing leaves the studio unapproved." },
          ].map((s, i) => (
            <li key={s.label} className="rounded-lg border border-border p-4">
              <span className="grid size-8 place-items-center rounded-md bg-ai-soft text-ai"><s.icon className="size-4" /></span>
              <p className="mt-3 flex items-center gap-1 text-sm font-medium">
                {i + 1}. {s.label} {i < 3 && <ArrowRight className="size-3.5 text-muted-foreground" />}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.copy}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">{emails} AI email draft{emails === 1 ? "" : "s"} saved so far.</p>
      </section>

      <AiDisclaimer className="mt-6" />
    </AdminLayout>
  );
}
