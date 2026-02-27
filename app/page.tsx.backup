"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Home() {
  const [cronExpression, setCronExpression] = useState("0 0 * * *");
  const [isValid, setIsValid] = useState(false);
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const scheduleOptions = {
    minute: { options: ["*", "0", "15", "30", "45"] as const, label: "Minute" },
    hour: { options: ["*", "0", "6", "12", "18"] as const, label: "Hour" },
    day: { options: ["*", "1", "15", "L"] as const, label: "Day of Month" },
    month: { options: ["*", "1", "6", "12"] as const, label: "Month" },
    weekday: { options: ["*", "1", "2", "3", "4", "5", "6", "7"] as const, label: "Day of Week" }
  };

  const [schedule, setSchedule] = useState({
    minute: "0",
    hour: "0",
    day: "*",
    month: "*",
    weekday: "*"
  });

  useEffect(() => {
    const expr = `${schedule.minute} ${schedule.hour} ${schedule.day} ${schedule.month} ${schedule.weekday}`;
    setCronExpression(expr);
  }, [schedule]);

  useEffect(() => {
    if (cronExpression) {
      validateCron();
      getRunTimes();
      getDescription();
    }
  }, [cronExpression]);

  const validateCron = async () => {
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "cron_validate",
            arguments: {
              expression: cronExpression
            }
          }
        }),
      });

      const data = await response.json();
      if (data.error) {
        setIsValid(false);
        setError(data.error.message);
      } else {
        setIsValid(true);
        setError("");
      }
    } catch (err) {
      setIsValid(false);
      setError("Validation failed");
    }
  };

  const getRunTimes = async () => {
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "cron_next_run",
            arguments: {
              expression: cronExpression,
              count: 5
            }
          }
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setNextRuns(data.result.nextRuns);
      }
    } catch (err) {
      setNextRuns([]);
    }
  };

  const getDescription = async () => {
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "cron_describe",
            arguments: {
              expression: cronExpression
            }
          }
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setDescription(data.result.description);
      }
    } catch (err) {
      setDescription("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const buildFromSchedule = async () => {
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "cron_schedule_builder",
            arguments: schedule
          }
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setCronExpression(data.result.cron);
        setDescription(data.result.description);
      }
    } catch (err) {
      setError("Schedule builder failed");
    }
  };

  const quickPresets = [
    { name: "Every minute", expr: "* * * * *" },
    { name: "Every hour", expr: "0 * * * *" },
    { name: "Every day at midnight", expr: "0 0 * * *" },
    { name: "Every day at noon", expr: "0 12 * * *" },
    { name: "Every Monday", expr: "0 0 * * 1" },
    { name: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
    { name: "Every 30 minutes", expr: "*/30 * * * *" },
    { name: "Every Sunday at 6 PM", expr: "0 18 * * 0" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Cron Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visual cron schedule builder and expression tester
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Schedule Builder */}
          <div className="space-y-6">
            {/* Schedule Fields */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Schedule Builder
              </h2>

              {Object.entries(scheduleOptions).map(([key, option]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {option.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.options.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSchedule(prev => ({ ...prev, [key]: value }))}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          schedule[key] === value
                            ? "bg-blue-500 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={buildFromSchedule}
                className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Build Expression
              </button>
            </div>

            {/* Quick Presets */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Quick Presets
              </h2>
              <div className="space-y-2">
                {quickPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setCronExpression(preset.expr)}
                    className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {preset.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {preset.expr}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Expression Info */}
          <div className="space-y-6">
            {/* Expression Output */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Cron Expression
                </h2>
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={() => copyToClipboard(cronExpression)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 rounded-lg font-mono text-lg dark:border-slate-600"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {isValid && description && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Next Runs */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Next 5 Runs
              </h2>

              {nextRuns.length > 0 ? (
                <div className="space-y-3">
                  {nextRuns.map((run, index) => {
                    const date = new Date(run);
                    const formatted = date.toLocaleString();
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          #{index + 1}
                        </span>
                        <span className="font-mono text-sm text-slate-900 dark:text-white">
                          {formatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Loading next run times...
                </p>
              )}
            </div>

            {/* Expression Format */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Expression Format
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Minute</div>
                  <div className="text-slate-600 dark:text-slate-400">0-59</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Hour</div>
                  <div className="text-slate-600 dark:text-slate-400">0-23</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Day</div>
                  <div className="text-slate-600 dark:text-slate-400">1-31</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Month</div>
                  <div className="text-slate-600 dark:text-slate-400">1-12</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-700 dark:text-slate-300">Weekday</div>
                  <div className="text-slate-600 dark:text-slate-400">0-7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
