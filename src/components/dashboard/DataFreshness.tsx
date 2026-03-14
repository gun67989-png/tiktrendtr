"use client";

import { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";

interface DataFreshnessProps {
  source: "live" | "no_data" | "loading" | string;
  onRefresh?: () => void;
}

export default function DataFreshness({ source, onRefresh }: DataFreshnessProps) {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }));
  }, [source]);

  const sourceLabel = source === "live" ? "Canlı Veri" : source === "no_data" ? "Veri Bekleniyor" : source === "loading" ? "Yükleniyor..." : source;
  const sourceColor = source === "live" ? "text-teal" : source === "no_data" ? "text-amber-400" : "text-muted-foreground";
  const dotColor = source === "live" ? "bg-teal" : source === "no_data" ? "bg-amber-400" : "bg-muted-foreground";

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
        <span className={sourceColor}>{sourceLabel}</span>
      </div>
      {lastUpdated && (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{lastUpdated}</span>
        </div>
      )}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-1 rounded hover:bg-muted/50 transition-colors"
          title="Yenile"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
