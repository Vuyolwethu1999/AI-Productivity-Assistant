import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

const BRAND_CONTEXT = `The business is "ZanD", a premium human-blend wig business.
IMPORTANT PRODUCT ACCURACY RULE: products are HUMAN-BLEND wigs (a blend of human hair and high-grade synthetic fibre).
Never describe them as "100% human hair", "virgin hair", or "raw hair". If quality is mentioned, describe it as premium human-blend.`;

async function callGateway(system: string, user: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this workspace.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429)
      throw new Error("The AI assistant is busy right now. Please wait a moment and try again.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Add credits to your workspace to continue.");
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content ?? "";
  if (!content.trim()) throw new Error("The AI returned an empty response. Please regenerate.");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  try {
    return JSON.parse(slice) as T;
  } catch {
    throw new Error("The AI response could not be read. Please regenerate.");
  }
}

/* ------------------------------- EMAIL ---------------------------------- */

const EmailInput = z.object({
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  context: z.string().min(1),
  length: z.string().min(1),
});

export interface EmailOutput {
  subject: string;
  preview: string;
  body: string;
  cta: string;
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }): Promise<EmailOutput> => {
    const system = `SYSTEM CONTEXT
You are an AI business communication assistant for a professional human-blend wig business.
${BRAND_CONTEXT}

TASK
Generate a professional customer-facing email based on the provided purpose, audience, tone, context and desired length.

CONSTRAINTS
- Do not invent product specifications.
- Do not invent prices, discounts, dates or shipping timelines.
- Do not make unsupported claims about wig quality or results.
- Clearly distinguish human-blend wigs from 100% human hair.
- Maintain a professional and trustworthy tone.
- Use only information supplied by the user; if key detail is missing, write a neutral placeholder in [square brackets].
- Include a suitable call to action when appropriate.

OUTPUT
Return ONLY minified JSON: {"subject":string,"preview":string,"body":string,"cta":string}
"body" is plain text with paragraphs separated by blank lines. No markdown fences.`;

    const user = `Purpose: ${data.purpose}
Audience: ${data.audience}
Tone: ${data.tone}
Desired length: ${data.length}
Context supplied by the business owner:
${data.context}`;

    return parseJson<EmailOutput>(await callGateway(system, user));
  });

/* ------------------------------ SUMMARY --------------------------------- */

const SummaryInput = z.object({
  title: z.string().min(1),
  date: z.string(),
  participants: z.string(),
  type: z.string(),
  notes: z.string().min(1),
  extra: z.string(),
  style: z.string(),
});

export interface SummaryOutput {
  executiveSummary: string;
  keyPoints: string[];
  insights: string[];
  decisions: string[];
  actionItems: string[];
  followUps: string[];
  unresolved: string[];
}

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummaryInput.parse(d))
  .handler(async ({ data }): Promise<SummaryOutput> => {
    const system = `SYSTEM CONTEXT
You are a meeting-notes assistant for a human-blend wig business.
${BRAND_CONTEXT}

TASK
Transform raw meeting notes into a clear, structured summary.

CONSTRAINTS
- Do not invent information.
- Do not infer decisions that were not stated.
- Clearly distinguish facts from suggestions (prefix suggestions with "Suggestion:").
- Preserve important customer preferences (length, texture, colour, cap, budget) exactly as stated.
- Flag unclear or missing information in "unresolved".

OUTPUT
Return ONLY minified JSON:
{"executiveSummary":string,"keyPoints":string[],"insights":string[],"decisions":string[],"actionItems":string[],"followUps":string[],"unresolved":string[]}
No markdown fences.`;

    const user = `Meeting title: ${data.title}
Date: ${data.date}
Participants: ${data.participants}
Meeting type: ${data.type}
Desired summary style: ${data.style}
Additional context: ${data.extra || "none"}

RAW NOTES:
${data.notes}`;

    return parseJson<SummaryOutput>(await callGateway(system, user));
  });

/* -------------------------------- PLAN ---------------------------------- */

const PlanInput = z.object({
  goal: z.string().min(1),
  deadline: z.string(),
  priority: z.string(),
  team: z.string(),
  resources: z.string(),
  budget: z.string(),
  extra: z.string(),
});

export interface PlanTask {
  name: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  duration: string;
  deadline: string;
  dependencies: string;
  status: "todo";
}

export interface PlanOutput {
  overview: string;
  assumptions: string[];
  clarifications: string[];
  tasks: PlanTask[];
}

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }): Promise<PlanOutput> => {
    const system = `SYSTEM CONTEXT
You are an AI project planning assistant for a human-blend wig business.
${BRAND_CONTEXT}

TASK
Convert the user's business goal into a realistic, prioritized action plan.

CONSTRAINTS
- Do not create impossible deadlines; respect the stated deadline and spread work sensibly.
- Break large goals into practical tasks (6-12 tasks).
- Identify dependencies between tasks by task name.
- Prioritize urgent tasks first.
- Clearly identify assumptions in "assumptions".
- Do not claim tasks have been completed; every task status is "todo".
- Ask for clarification in "clarifications" when essential information is missing.
- Only assign work to team members the user listed; otherwise use "Unassigned".

OUTPUT
Return ONLY minified JSON:
{"overview":string,"assumptions":string[],"clarifications":string[],"tasks":[{"name":string,"description":string,"priority":"low"|"medium"|"high"|"urgent","assignee":string,"duration":string,"deadline":string,"dependencies":string,"status":"todo"}]}
Deadlines are ISO dates (YYYY-MM-DD). No markdown fences.`;

    const user = `Goal: ${data.goal}
Deadline: ${data.deadline || "not specified"}
Priority: ${data.priority}
Available team members: ${data.team || "not specified"}
Available resources: ${data.resources || "not specified"}
Budget: ${data.budget || "not specified"}
Additional context: ${data.extra || "none"}
Today's date: ${new Date().toISOString().slice(0, 10)}`;

    return parseJson<PlanOutput>(await callGateway(system, user));
  });
