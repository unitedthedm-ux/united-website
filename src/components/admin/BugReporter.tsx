"use client";

import { useState } from "react";
import { Bug, Send, CheckCircle2 } from "lucide-react";

const INPUT =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function BugReporter() {
  const [reporter, setReporter] = useState("");
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!message.trim()) {
      setError("Please describe the problem.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporter, page, message }),
      });
      if (res.ok) {
        setSent(true);
        setMessage("");
        setReporter("");
        setPage("");
        setTimeout(() => setSent(false), 6000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not send the report. Please try again.");
      }
    } catch {
      setError("Could not send the report. Please check your connection.");
    }
    setSending(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#a4c8e0]/15">
          <Bug size={18} className="text-[#a4c8e0]" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Report a Bug</h2>
          <p className="text-xs text-muted-foreground">
            Found something wrong on the site? Send it to the developer.
          </p>
        </div>
      </div>

      {sent ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 size={16} />
          Report sent — thank you!
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder="Your name (optional)"
              className={INPUT}
            />
            <input
              value={page}
              onChange={(e) => setPage(e.target.value)}
              placeholder="Which page? (optional)"
              className={INPUT}
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe the problem in detail…"
            className={`${INPUT} resize-y`}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            onClick={submit}
            disabled={sending}
            className="flex items-center gap-2 rounded-xl bg-[#a4c8e0] px-5 py-2.5 text-sm font-bold text-[#0a2233] hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {sending ? "Sending…" : "Send Report"}
          </button>
        </div>
      )}
    </div>
  );
}
