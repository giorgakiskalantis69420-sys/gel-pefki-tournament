"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[100] flex max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-card"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      <p className="flex-1 text-sm font-medium text-school-navy">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Κλείσιμο"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
