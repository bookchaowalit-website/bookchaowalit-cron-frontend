"use client";

import { useMemo, useState } from "react";

function fieldMatches(field: string, value: number, min: number, max: number): boolean {
  if (field === "*") return true;
  if (field.includes("/")) { const [base, stepText] = field.split("/"); const step = Number(stepText); const start = base === "*" ? min : Number(base); return Boolean(step) && value >= start && (value - start) % step === 0; }
  if (field.includes(",")) return field.split(",").some((part) => fieldMatches(part, value, min, max));
  if (field.includes("-")) { const [a, b] = field.split("-").map(Number); return value >= a && value <= b; }
  return Number(field) === value;
}

function describe(expr: string) {
  const [minute, hour, dom, month, dow] = expr.trim().split(/\s+/);
  if (!minute || !hour || !dom || !month || !dow) return "Five fields are required: minute, hour, day, month, weekday.";
  const time = minute === "*" && hour === "*" ? "every minute" : minute.startsWith("*/") ? `every ${minute.slice(2)} minutes` : hour === "*" ? `at minute ${minute} of every hour` : `at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  const dates = [dom !== "*" ? `day ${dom}` : "every day", month !== "*" ? `month ${month}` : "all months", dow !== "*" ? `weekday ${dow}` : "all weekdays"];
  return `${time}; ${dates.join(" · ")}`;
}

function nextRuns(expr: string, count = 5) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minute, hour, dom, month, dow] = parts;
  const cursor = new Date(); cursor.setSeconds(0, 0); cursor.setMinutes(cursor.getMinutes() + 1);
  const runs: string[] = [];
  for (let i = 0; i < 60 * 24 * 400 && runs.length < count; i += 1) {
    const weekday = cursor.getDay();
    if (fieldMatches(minute, cursor.getMinutes(), 0, 59) && fieldMatches(hour, cursor.getHours(), 0, 23) && fieldMatches(dom, cursor.getDate(), 1, 31) && fieldMatches(month, cursor.getMonth() + 1, 1, 12) && (dow === "*" || fieldMatches(dow.replaceAll("7", "0"), weekday, 0, 6))) runs.push(cursor.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return runs;
}

const presets = [
  ["Every minute", "* * * * *"], ["Hourly", "0 * * * *"], ["Weekdays · 09:00", "0 9 * * 1-5"], ["Monday · 09:00", "0 9 * * 1"], ["First of month", "0 0 1 * *"],
];
const fields = ["minute", "hour", "day", "month", "weekday"];

export default function Home() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);
  const parts = expr.trim().split(/\s+/);
  const valid = parts.length === 5;
  const runs = useMemo(() => nextRuns(expr), [expr]);
  const copy = async () => { try { await navigator.clipboard.writeText(expr); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };

  return (
    <main className="plate-shell">
      <header className="plate-header"><div className="registration" aria-hidden="true"><i /><i /><i /><i /></div><div><p className="plate-kicker">PLATE 05 / SCHEDULE NOTATION</p><h1>Make time<br /><span>legible.</span></h1><p className="plate-deck">A five-field cron expression, set out like a print plate: edit the marks, read the sentence, inspect the next impressions.</p></div><div className="plate-stamp">BOOK<br /><strong>DEV</strong><small>UTILITY SERIES</small></div></header>

      <section className="cron-plate" aria-labelledby="expression-title"><div className="plate-topline"><span id="expression-title">CRON EXPRESSION</span><span>{valid ? "5 / 5 fields" : `${parts.length} / 5 fields`}</span></div><div className="expression-row"><input aria-label="Cron expression" value={expr} onChange={(event) => setExpr(event.target.value)} spellCheck={false} /><button onClick={copy}>{copied ? "Copied" : "Copy mark"}</button></div><div className="field-legend">{fields.map((field, index) => <span key={field}><b>{parts[index] || "—"}</b>{field}</span>)}</div><p className={`validity ${valid ? "is-valid" : "is-invalid"}`}>{valid ? "●" : "×"} {valid ? "Five fields received · practical preview below" : "This mark needs exactly five fields"}</p></section>

      <section className="preset-strip" aria-label="Presets"><span className="strip-label">SET A PRESET</span>{presets.map(([label, value]) => <button key={value} onClick={() => setExpr(value)} className={expr === value ? "selected" : ""}>{label}<code>{value}</code></button>)}</section>

      <section className="plate-results"><article className="reading-panel"><p className="plate-kicker">PLAIN-ENGLISH IMPRESSION</p><h2>{describe(expr)}</h2><div className="rule-ornament" aria-hidden="true">×　·　×</div><p className="result-note">The sentence is generated in your browser. This utility supports standard five-field cron and treats the next-run list as an estimate.</p></article><article className="runs-panel"><div className="runs-heading"><p className="plate-kicker">NEXT IMPRESSIONS</p><span>LOCAL TIME</span></div>{runs.length ? <ol>{runs.map((run, index) => <li key={run}><span>{String(index + 1).padStart(2, "0")}</span><time>{run}</time></li>)}</ol> : <p className="no-runs">No matches in the scan window. Check the five marks above.</p>}</article></section>
      <footer className="plate-footer"><span>CRON EXPRESSION HELPER / 2026</span><span>Client-side · no server required · no data leaves this browser</span></footer>
    </main>
  );
}
