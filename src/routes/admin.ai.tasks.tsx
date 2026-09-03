import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDown,
  ArrowUp,
  Columns3,
  List,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { generatePlan, type PlanOutput } from "@/lib/ai.functions";
import { uid, useStore } from "@/lib/store";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ai/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | ZanD AI Tools" },
      { name: "description", content: "Turn a wig business goal into a realistic, prioritised task plan with owners, durations, deadlines and dependencies." },
      { property: "og:title", content: "AI Task Planner | ZanD AI Tools" },
      { property: "og:description", content: "Business goals converted into prioritised, dated task plans." },
    ],
  }),
  component: TaskPlanner,
});

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const priorityTone: Record<TaskPriority, string> = {
  low: "bg-secondary text-muted-foreground",
  medium: "bg-accent text-accent-foreground",
  high: "bg-warning/15 text-warning",
  urgent: "bg-destructive/10 text-destructive",
};

function TaskPlanner() {
  const { tasks, setTasks, addAi } = useStore();
  const navigate = useNavigate();
  const run = useServerFn(generatePlan);
  const [form, setForm] = useState({
    goal: "",
    deadline: "",
    priority: "high",
    team: "Zandile, Nandi, Thabo",
    resources: "",
    budget: "",
    extra: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanOutput | null>(null);
  const [previous, setPrevious] = useState<PlanOutput | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");

  useEffect(() => {
    const seed = sessionStorage.getItem("zand-plan-seed");
    if (seed) {
      setForm((f) => ({ ...f, goal: seed }));
      sessionStorage.removeItem("zand-plan-seed");
      toast.success("Action items imported from your meeting summary");
    }
  }, []);

  const generate = async () => {
    if (form.goal.trim().length < 12) {
      setErrors({ goal: "Describe the goal in a sentence or more." });
      return;
    }
    setErrors({});
    if (plan) setPrevious(plan);
    setStatus("loading");
    try {
      setPlan(await run({ data: form }));
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const addPlanToBoard = () => {
    if (!plan) return;
    const created: Task[] = plan.tasks.map((t) => ({
      id: uid("task"),
      name: t.name,
      description: t.description,
      priority: t.priority,
      assignee: t.assignee,
      duration: t.duration,
      deadline: t.deadline,
      dependencies: t.dependencies,
      status: "todo",
      source: "ai",
      plan: form.goal.slice(0, 60),
    }));
    setTasks((list) => [...created, ...list]);
    toast.success(`${created.length} tasks added to your board`);
  };

  const update = (id: string, patch: Partial<Task>) =>
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const move = (id: string, dir: -1 | 1) =>
    setTasks((list) => {
      const i = list.findIndex((t) => t.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <AdminLayout title="AI Task Planner" description="Business goals converted into a realistic, prioritised plan">
      <AiDisclaimer />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-lg">Goal brief</h2>
          <Field label="Goal" required error={errors.goal}>
            <Textarea
              rows={4}
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              placeholder="Launch our new human-blend bob wig collection in four weeks."
            />
          </Field>
          <Field label="Deadline">
            <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </Field>
          <Field label="Priority">
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Available team members">
            <Input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="Zandile, Nandi, Thabo" />
          </Field>
          <Field label="Available resources">
            <Textarea rows={2} value={form.resources} onChange={(e) => setForm({ ...form, resources: e.target.value })} placeholder="Studio space, photographer on Fridays, existing supplier" />
          </Field>
          <Field label="Budget">
            <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="R 15 000" />
          </Field>
          <Field label="Additional context">
            <Textarea rows={2} value={form.extra} onChange={(e) => setForm({ ...form, extra: e.target.value })} />
          </Field>
          <Button className="w-full" onClick={generate} disabled={status === "loading"}>
            <Sparkles className="size-4" /> {status === "loading" ? "Planning…" : plan ? "Regenerate plan" : "Generate plan"}
          </Button>
          <PromptArchitecture
            items={[
              { label: "System context", value: "AI project planning assistant for a human-blend wig business." },
              { label: "Task", value: "Convert the business goal into a realistic, prioritised action plan." },
              {
                label: "Constraints",
                value:
                  "No impossible deadlines.\nLarge goals broken into practical tasks.\nDependencies identified.\nUrgent tasks prioritised.\nAssumptions stated explicitly.\nNo task is ever claimed complete.\nClarification requested when key detail is missing.",
              },
              {
                label: "Output per task",
                value: "Name · Description · Priority · Assignee · Estimated duration · Deadline · Dependencies · Status.",
              },
            ]}
          />
        </section>

        <section className="min-w-0 space-y-4">
          {status === "idle" && !plan && (
            <AiEmptyState
              title="Turn a goal into a plan"
              description="Describe what you want to achieve. The planner returns sequenced tasks with owners, durations, deadlines and dependencies you can push straight to your board."
              bullets={[
                'Try: "Launch our new human-blend bob collection in four weeks."',
                "Assumptions and missing information are called out, not guessed.",
                "Add the plan to the board, then work it in list or kanban view.",
              ]}
            />
          )}
          {status === "loading" && <AiLoadingState label="Building your action plan" />}
          {status === "error" && <AiErrorState message={error} onRetry={generate} />}

          {plan && status !== "loading" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge label="AI plan" />
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={generate}><RefreshCw className="size-3.5" /> Regenerate</Button>
                  <Button size="sm" variant="outline" onClick={() => { addAi({ id: uid("ai"), kind: "plan", title: form.goal.slice(0, 70), createdAt: new Date().toISOString(), inputs: form, output: plan }); toast.success("Plan saved to AI activity"); }}>
                    <Save className="size-3.5" /> Save
                  </Button>
                  <Button size="sm" onClick={addPlanToBoard}><Plus className="size-3.5" /> Add {plan.tasks.length} tasks to board</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setPlan(null); setStatus("idle"); }}><Trash2 className="size-3.5" /> Discard</Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="text-sm">{plan.overview}</p>
                {plan.assumptions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Assumptions</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {plan.assumptions.map((a) => <li key={a}>• {a}</li>)}
                    </ul>
                  </div>
                )}
                {plan.clarifications.length > 0 && (
                  <div className="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3">
                    <p className="text-[11px] font-semibold tracking-wider text-warning uppercase">Needs your input</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {plan.clarifications.map((c) => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                )}
                <ul className="mt-5 space-y-3">
                  {plan.tasks.map((t) => (
                    <li key={t.name} className="rounded-lg border border-border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{t.name}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", priorityTone[t.priority])}>{t.priority}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{t.assignee} · {t.duration} · due {t.deadline}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                      {t.dependencies && <p className="mt-1 text-xs text-muted-foreground">Depends on: {t.dependencies}</p>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ai/25 bg-ai-soft/50 p-4">
                <Mail className="size-4 text-ai" />
                <p className="text-sm">Announce this work to customers when it's ready.</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate({ to: "/admin/ai/email" })}>
                  Open Smart Email Generator
                </Button>
              </div>

              {previous && (
                <details className="rounded-xl border border-border bg-card p-4 text-sm">
                  <summary className="cursor-pointer font-medium">Previous version</summary>
                  <p className="mt-3 text-muted-foreground">{previous.overview}</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setPlan(previous)}>Restore this version</Button>
                </details>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl">Task board</h2>
          <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
              <List className="size-3.5" /> List
            </Button>
            <Button size="sm" variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}>
              <Columns3 className="size-3.5" /> Kanban
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setTasks((list) => [
                  {
                    id: uid("task"),
                    name: "New task",
                    description: "",
                    priority: "medium",
                    assignee: "Unassigned",
                    duration: "1 day",
                    deadline: new Date().toISOString().slice(0, 10),
                    dependencies: "",
                    status: "todo",
                    source: "manual",
                  },
                  ...list,
                ])
              }
            >
              <Plus className="size-3.5" /> Add task
            </Button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-xl">No tasks yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Generate a plan above or add a task manually.</p>
          </div>
        ) : view === "list" ? (
          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                  <th className="p-3 font-medium">Task</th>
                  <th className="p-3 font-medium">Assignee</th>
                  <th className="p-3 font-medium">Duration</th>
                  <th className="p-3 font-medium">Deadline</th>
                  <th className="p-3 font-medium">Priority</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0 align-top">
                    <td className="p-3">
                      <Input value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} className="font-medium" />
                      {t.description && <p className="mt-1 max-w-md text-xs text-muted-foreground">{t.description}</p>}
                      <div className="mt-1 flex flex-wrap gap-2">
                        {t.source === "ai" && <span className="text-[11px] text-ai">AI generated</span>}
                        {t.dependencies && <span className="text-[11px] text-muted-foreground">Depends on: {t.dependencies}</span>}
                      </div>
                    </td>
                    <td className="p-3"><Input value={t.assignee} onChange={(e) => update(t.id, { assignee: e.target.value })} className="w-28" /></td>
                    <td className="p-3"><Input value={t.duration} onChange={(e) => update(t.id, { duration: e.target.value })} className="w-24" /></td>
                    <td className="p-3"><Input type="date" value={t.deadline} onChange={(e) => update(t.id, { deadline: e.target.value })} className="w-36" /></td>
                    <td className="p-3">
                      <Select value={t.priority} onValueChange={(v) => update(t.id, { priority: v as TaskPriority })}>
                        <SelectTrigger className="w-28 capitalize"><SelectValue /></SelectTrigger>
                        <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Select value={t.status} onValueChange={(v) => update(t.id, { status: v as TaskStatus })}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Move up" onClick={() => move(t.id, -1)}><ArrowUp className="size-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Move down" onClick={() => move(t.id, 1)}><ArrowDown className="size-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Delete task" onClick={() => setTasks((l) => l.filter((x) => x.id !== t.id))}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {STATUSES.map((col) => (
              <div key={col.key} className="rounded-xl border border-border bg-secondary/40 p-3">
                <div className="flex items-center justify-between px-1 pb-3">
                  <p className="text-sm font-semibold">{col.label}</p>
                  <span className="text-xs text-muted-foreground">{tasks.filter((t) => t.status === col.key).length}</span>
                </div>
                <div className="space-y-3">
                  {tasks.filter((t) => t.status === col.key).map((t) => (
                    <article key={t.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{t.name}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", priorityTone[t.priority])}>{t.priority}</span>
                      </div>
                      {t.description && <p className="mt-2 text-xs text-muted-foreground">{t.description}</p>}
                      <p className="mt-3 text-xs text-muted-foreground">{t.assignee} · due {t.deadline}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {STATUSES.filter((s) => s.key !== col.key).map((s) => (
                          <Button key={s.key} size="sm" variant="outline" className="text-xs" onClick={() => update(t.id, { status: s.key })}>
                            → {s.label}
                          </Button>
                        ))}
                        <Button size="sm" variant="ghost" aria-label="Delete task" onClick={() => setTasks((l) => l.filter((x) => x.id !== t.id))}>
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    </article>
                  ))}
                  {tasks.filter((t) => t.status === col.key).length === 0 && (
                    <p className="px-1 pb-2 text-xs text-muted-foreground">Nothing here yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
