"use client";

import { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";

// Login popup promoting the admin guide. It stops showing automatically
// after this date (one week from launch).
const SHOW_UNTIL = new Date("2026-05-23T23:59:59").getTime();

export default function GuidePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Date.now() < SHOW_UNTIL) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-7 text-center">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-[#a4c8e0]/15 flex items-center justify-center">
          <BookOpen size={26} className="text-[#a4c8e0]" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1.5">Admin Panel Guide</h2>
        <p className="text-sm text-muted-foreground mb-6">
          A full step-by-step guide (in Arabic) to every section of this admin
          panel. We recommend giving it a read.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
          >
            Later
          </button>
          <a
            href="/admin-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#a4c8e0] text-[#0a2233] text-sm font-bold hover:bg-[#7aaec9] transition-colors"
          >
            Open the Guide
          </a>
        </div>
      </div>
    </div>
  );
}
