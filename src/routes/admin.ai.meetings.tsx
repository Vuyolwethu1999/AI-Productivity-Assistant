import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Copy, Download, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";
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
import { summarizeMeeting, type SummaryOutput } from "@/lib/ai.functions";
import { uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/ai/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | ZanD AI Tools" },
      { name: "description", content: "Turn wig consultations, supplier and team meeting notes into structured summaries with decisions, action items and open questions." },
      { property: "og:title", content: "Meeting Notes Summarizer | ZanD AI Tools" },
      { property: "og:description", content: "Structured summaries for consultations and business meetings." },
    ],
  }),
  component: MeetingTool,
});

const TYPES = [
  "Customer wig consultation",
  "Supplier meeting",
  "Marketing meeting",
  "Team meeting",
  "Product planning",
];
const STYLES = ["Concise", "Detailed", "Action-focused"];

const SECTIONS: { key: keyof Omit<SummaryOutput, "executiveSummary">; label: string }[] = [
  { key: "keyPoints", label: "Key discussion points" },
  { key: "insights", label: "Customer / product insights" },
  { key: "decisions", label: "Decisions" },
  { key: "actionItems", label: "Action items" },
  { key: "followUps", label: "Follow-up items" },
  { key: "unresolved", label: "Unresolved questions" },
];

function MeetingTool() {
  const { addAi } = useStore();
  const navigate = useNavigate();
  const run = useServerFn(summarizeMeeting);
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    participants: "",
    type: TYPES[0],
    notes: "",
    extra: "",
    style: STYLES[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [output, setOutput] = useState<SummaryOutput | null>(null);
  const [previous, setPrevious] = useState<SummaryOutput | null>(null);

  const generate = async () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Give the meeting a title";
    if (form.notes.trim().length < 25) next.notes = "Paste the raw notes — at least a couple of lines";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (output) setPrevious(output);
    setStatus("loading");
    try {
      setOutput(await run({ data: form }));
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const asText = (o: SummaryOutput) =>
    [
      `${form.title} — ${form.date}`,
      `Participants: ${form.participants}`,
      "",
      "EXECUTIVE SUMMARY",
      o.executiveSummary,
      ...SECTIONS.flatMap((s) => ["", s.label.toUpperCase(), ...(o[s.key] as string[]).map((l) => `- ${l}`)]),
    ].join("\n");

  const updateLine = (key: keyof SummaryOutput, index: number, value: string) =>
    setOutput((o) =>
      o ? { ...o, [key]: (o[key] as string[]).map((l, i) => (i === index ? value : l)) } : o,
    );

  return (
    <AdminLayout
      title="Meeting Notes Summarizer"
      description="Consultations and business meetings turned into structured, editable summaries"
    >
      <AiDisclaimer />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg">Meeting details</h2>
          <Field label="Meeting title" required error={errors.title}>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Bridal consultation — Zanele K." />
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Participants" hint="Use first names only where possible to limit personal data.">
            <Input value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} placeholder="Zandile, Nandi, client" />
          </Field>
          <Field label="Meeting type">
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Summary style">
            <Select value={form.style} onValueChange={(v) => setForm({ ...form, style: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STYLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Raw notes" required error={errors.notes}>
            <Textarea
              rows={9}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Client wants 22 inch body wave, glueless, natural black. Budget around R3 000. Wedding 12 Oct. Asked about care between wears…"
            />
          </Field>
          <Field label="Additional context">
            <Textarea rows={3} value={form.extra} onChange={(e) => setForm({ ...form, extra: e.target.value })} placeholder="Repeat client, previously bought a 10 inch bob." />
          </Field>
          <Button className="w-full" onClick={generate} disabled={status === "loading"}>
            <Sparkles className="size-4" /> {status === "loading" ? "Summarising…" : output ? "Regenerate summary" : "Summarise notes"}
          </Button>
          <PromptArchitecture
            items={[
              { label: "System context", value: "Meeting-notes assistant for a human-blend wig business." },
              { label: "Task", value: "Transform raw meeting notes into a clear, structured summary." },
              {
                label: "Constraints",
                value:
                  "No invented information.\nNo inferred decisions.\nSuggestions are labelled separately from facts.\nCustomer preferences are preserved verbatim.\nMissing or unclear detail is flagged.",
              },
              {
                label: "Output",
                value:
                  "Executive summary · Key discussion points · Customer/product insights · Decisions · Action items · Follow-ups · Unresolved questions.",
              },
            ]}
          />
        </section>

        <section className="min-w-0">
          {status === "idle" && !output && (
            <AiEmptyState
              title="Summarise a consultation or meeting"
              description="Paste messy notes from a fitting, supplier call or team catch-up. You get an editable, structured summary — nothing invented."
              bullets={[
                "Customer preferences (length, texture, colour, budget) are preserved exactly.",
                "Decisions are only listed if they were actually stated.",
                "Anything unclear is flagged as an open question.",
              ]}
            />
          )}
          {status === "loading" && <AiLoadingState label="Structuring your meeting notes" />}
          {status === "error" && <AiErrorState message={error} onRetry={generate} />}

          {output && status !== "loading" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge label="AI summary" />
                <span className="text-xs text-muted-foreground">Every section is editable</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={generate}><RefreshCw className="size-3.5" /> Regenerate</Button>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(asText(output)); toast.success("Summary copied"); }}>
                    <Copy className="size-3.5" /> Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([asText(output)], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${form.title || "meeting"}-summary.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="size-3.5" /> Export
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      addAi({
                        id: uid("ai"),
                        kind: "summary",
                        title: form.title || "Meeting summary",
                        createdAt: new Date().toISOString(),
                        inputs: form,
                        output,
                      });
                      toast.success("Summary saved to AI activity");
                    }}
                  >
                    <Save className="size-3.5" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setOutput(null); setStatus("idle"); }}>
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <Field label="Executive summary">
                  <Textarea
                    rows={4}
                    value={output.executiveSummary}
                    onChange={(e) => setOutput({ ...output, executiveSummary: e.target.value })}
                  />
                </Field>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {SECTIONS.map((s) => (
                  <div key={s.key} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <h3 className="font-display text-lg">{s.label}</h3>
                    <div className="mt-3 space-y-2">
                      {(output[s.key] as string[]).length === 0 && (
                        <p className="text-sm text-muted-foreground">Nothing recorded for this section.</p>
                      )}
                      {(output[s.key] as string[]).map((line, i) => (
                        <div key={i} className="flex gap-2">
                          <Textarea
                            rows={2}
                            value={line}
                            onChange={(e) => updateLine(s.key, i, e.target.value)}
                            className="text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove line"
                            onClick={() =>
                              setOutput({ ...output, [s.key]: (output[s.key] as string[]).filter((_, x) => x !== i) })
                            }
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOutput({ ...output, [s.key]: [...(output[s.key] as string[]), ""] })}
                      >
                        Add line
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ai/25 bg-ai-soft/50 p-4">
                <Sparkles className="size-4 text-ai" />
                <p className="text-sm">Turn these action items into a dated, prioritised plan.</p>
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    sessionStorage.setItem(
                      "zand-plan-seed",
                      `Deliver on the action items from "${form.title}":\n${output.actionItems.map((a) => `- ${a}`).join("\n")}`,
                    );
                    navigate({ to: "/admin/ai/tasks" });
                  }}
                >
                  Send to AI Task Planner <ArrowRight className="size-3.5" />
                </Button>
              </div>

              {previous && (
                <details className="rounded-xl border border-border bg-card p-4 text-sm">
                  <summary className="cursor-pointer font-medium">Previous version</summary>
                  <p className="mt-3 whitespace-pre-line text-muted-foreground">{previous.executiveSummary}</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setOutput(previous)}>
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
