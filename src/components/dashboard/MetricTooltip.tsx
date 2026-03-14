"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface MetricTooltipProps {
  text: string;
  children?: React.ReactNode;
}

export default function MetricTooltip({ text, children }: MetricTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center gap-1">
      {children}
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label="Bilgi"
      >
        <Info className="w-3 h-3" />
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg text-[11px] text-muted-foreground whitespace-normal w-56 leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-card border-r border-b border-border rotate-45" />
        </span>
      )}
    </span>
  );
}
