import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Copy, Mail, NotebookPen, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { AiBadge, AiDisclaimer } from "@/components/ai/AiShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { AiKind } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ai/history")({
  head: () => ({
    meta: [
      { title: "AI Activity | ZanD AI Tools" },
      { name: "description", content: "Every saved AI email draft, meeting summary and task plan for the ZanD wig business, ready to revisit and edit." },
      { property: "og:title", content: "AI Activity | ZanD AI Tools" },
      { property: "og:description", content: "Saved AI drafts, summaries and plans in one place." },
    ],
  }),
  component: HistoryPage,
});

const meta: Record<AiKind, { label: string; icon: typeof Mail }> = {
  email: { label: "Email draft", icon: Mail },
  summary: { label: "Meeting summary", icon: NotebookPen },
  plan: { label: "Task plan", icon: ClipboardList },
};

function HistoryPage() {
  const { ai, removeAi } = useStore();
  const [filter, setFilter] = useState<"all" | AiKind>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = filter === "all" ? ai : ai.filter((a) => a.kind === filter);

  return (
    <AdminLayout title="AI Activity" description="Everything the AI tools have produced and you chose to keep">
      <AiDisclaimer />

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "email", "summary", "plan"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border border-border px-3.5 py-1.5 text-sm capitalize transition-colors hover:bg-accent",
              filter === f && "border-champagne bg-accent font-medium",
            )}
          >
            {f === "all" ? "All outputs" : meta[f].label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-14 text-center">
          <Sparkles className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 font-display text-xl">No saved AI outputs yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Save a draft, summary or plan and it will appear here for you to revisit and edit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline"><Link to="/admin/ai/email">Smart Email Generator</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/ai/meetings">Meeting Notes Summarizer</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/ai/tasks">AI Task Planner</Link></Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((r) => {
            const Icon = meta[r.kind].icon;
            const text = JSON.stringify(r.output, null, 2);
            return (
              <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-ai-soft text-ai"><Icon className="size-4" /></span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {meta[r.kind].label} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <AiBadge />
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                      {openId === r.id ? "Hide" : "Open & edit"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
                      <Copy className="size-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => { removeAi(r.id); toast.success("Deleted"); }}>
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                {openId === r.id && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Saved output — edit freely, then copy it into your mail client or notes. Nothing here is sent automatically.
                    </p>
                    <Textarea rows={14} defaultValue={text} className="font-mono text-xs" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
