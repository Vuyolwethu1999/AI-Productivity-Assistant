import { AlertTriangle, Loader2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-ai/25 bg-ai-soft/60 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ai" />
      <p>
        <span className="font-semibold">Responsible AI:</span> AI-generated content may contain errors,
        omissions, or inaccurate information. Review and verify all AI outputs before sending, publishing, or
        making business decisions based on them.
      </p>
    </div>
  );
}

export function AiBadge({ label = "AI generated" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-2.5 py-1 text-[11px] font-semibold text-ai">
      <Sparkles className="size-3" /> {label}
    </span>
  );
}

export function AiEmptyState({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-full bg-ai-soft text-ai">
        <Sparkles className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <ul className="mx-auto mt-5 grid max-w-md gap-2 text-left text-sm text-muted-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-champagne" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AiLoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-ai/20 bg-card p-8 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-full bg-ai-soft text-ai">
        <Loader2 className="size-5 animate-spin" />
      </span>
      <p className="mt-4 font-medium">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Structuring your inputs into a constrained prompt and drafting the result…
      </p>
      <div className="mx-auto mt-6 grid max-w-sm gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${100 - i * 18}%` }} />
        ))}
      </div>
    </div>
  );
}

export function AiErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="min-w-0">
          <p className="font-medium text-foreground">Generation failed</p>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            <RefreshCw className="size-3.5" /> Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PromptArchitecture({ items }: { items: { label: string; value: string }[] }) {
  return (
    <details className="rounded-lg border border-border bg-card px-3 py-2 text-xs">
      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
        How this prompt is constructed
      </summary>
      <dl className="mt-2 space-y-2">
        {items.map((i) => (
          <div key={i.label}>
            <dt className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {i.label}
            </dt>
            <dd className="mt-0.5 line-clamp-2 whitespace-pre-line text-muted-foreground">{i.value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
