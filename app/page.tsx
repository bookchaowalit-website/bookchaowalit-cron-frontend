"use client";

import { useState, useMemo, type ReactNode } from "react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Client-side utility · no server required
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          Data stays in your browser. Part of the Bookchaowalit developer tools portfolio.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";
const areaClass = `${inputClass} min-h-[160px] resize-y`;

function fieldMatches(field: string, value: number, min: number, max: number): boolean {
  if (field === "*") return true;
  if (field === "L" && value === max) return true;
  if (field.includes("/")) {
    const [base, stepStr] = field.split("/");
    const step = Number(stepStr);
    if (!step) return false;
    const start = base === "*" ? min : Number(base);
    return value >= start && (value - start) % step === 0;
  }
  if (field.includes(",")) return field.split(",").some((p) => fieldMatches(p, value, min, max));
  if (field.includes("-")) {
    const [a, b] = field.split("-").map(Number);
    return value >= a && value <= b;
  }
  return Number(field) === value;
}

function describe(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Expected 5 fields: minute hour day-of-month month day-of-week";
  const [m, h, dom, mon, dow] = parts;
  const bits: string[] = [];
  if (m === "*" && h === "*") bits.push("every minute");
  else if (m.startsWith("*/")) bits.push(`every ${m.slice(2)} minutes`);
  else if (h === "*" && m !== "*") bits.push(`at minute ${m} of every hour`);
  else bits.push(`at ${h.padStart(2, "0")}:${m.padStart(2, "0")}`);
  if (dom !== "*") bits.push(`on day-of-month ${dom}`);
  if (mon !== "*") bits.push(`in month ${mon}`);
  if (dow !== "*") bits.push(`on weekday ${dow} (0/7=Sun)`);
  if (dom === "*" && mon === "*" && dow === "*") bits.push("every day");
  return bits.join(", ");
}

function nextRuns(expr: string, count = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [m, h, dom, mon, dow] = parts;
  const out: string[] = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  // Scan up to ~2 years of minutes max bound
  for (let i = 0; i < 60 * 24 * 400 && out.length < count; i++) {
    const minute = cursor.getMinutes();
    const hour = cursor.getHours();
    const day = cursor.getDate();
    const month = cursor.getMonth() + 1;
    const weekday = cursor.getDay(); // 0 Sun
    const dowOk =
      fieldMatches(dow, weekday, 0, 6) ||
      (dow.includes("7") && weekday === 0 && fieldMatches(dow.replace(/7/g, "0"), 0, 0, 6));
    if (
      fieldMatches(m, minute, 0, 59) &&
      fieldMatches(h, hour, 0, 23) &&
      fieldMatches(dom, day, 1, 31) &&
      fieldMatches(mon, month, 1, 12) &&
      (dow === "*" || dowOk)
    ) {
      out.push(cursor.toLocaleString());
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return out;
}

const PRESETS: { label: string; value: string }[] = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Weekdays 9am", value: "0 9 * * 1-5" },
  { label: "Weekly Mon", value: "0 9 * * 1" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
];

export default function Home() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);
  const description = useMemo(() => describe(expr), [expr]);
  const runs = useMemo(() => nextRuns(expr, 5), [expr]);
  const valid = expr.trim().split(/\s+/).length === 5;

  return (
    <Shell title="Cron Expression Helper" subtitle="Build a 5-field cron string, read it in plain English, and preview upcoming fires.">
      <Field label="Cron expression" hint="minute hour day-of-month month day-of-week">
        <input className={inputClass} value={expr} onChange={(e) => setExpr(e.target.value)} spellCheck={false} />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p.value} variant="secondary" onClick={() => setExpr(p.value)}>
            {p.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          onClick={async () => {
            if (await copyText(expr)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          }}
        >
          {copied ? "Copied" : "Copy expr"}
        </Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium">Description</h2>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{description}</p>
          <p className={`mt-3 text-xs ${valid ? "text-emerald-600" : "text-red-600"}`}>
            {valid ? "Valid field count" : "Invalid — need exactly 5 fields"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium">Next runs (estimate)</h2>
          <ul className="mt-2 space-y-1 font-mono text-sm">
            {runs.length ? runs.map((r) => <li key={r}>{r}</li>) : <li className="text-zinc-500">No matches in scan window</li>}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
