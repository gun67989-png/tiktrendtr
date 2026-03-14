"use client";

import { motion } from "framer-motion";
import type { ViralScoreBreakdown as BreakdownType } from "@/lib/data";

interface Props {
  score: number;
  breakdown: BreakdownType;
  tier?: string | null;
}

const FACTOR_LABELS: Record<keyof BreakdownType, { label: string; weight: string; color: string }> = {
  engagement_rate: { label: "Etkileşim Oranı", weight: "35%", color: "bg-primary" },
  view_growth_rate: { label: "Görüntülenme Büyümesi", weight: "25%", color: "bg-teal" },
  share_rate: { label: "Paylaşım Oranı", weight: "15%", color: "bg-purple-400" },
  comment_activity: { label: "Yorum Aktivitesi", weight: "15%", color: "bg-amber-400" },
  recency_score: { label: "Güncellik", weight: "10%", color: "bg-blue-400" },
};

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  mega_viral: { label: "Mega Viral", color: "text-primary bg-primary/10" },
  viral: { label: "Viral", color: "text-rose-400 bg-rose-400/10" },
  trend: { label: "Trend", color: "text-amber-400 bg-amber-400/10" },
  rising: { label: "Yükselen", color: "text-teal bg-teal/10" },
};

export default function ViralScoreBreakdown({ score, breakdown, tier }: Props) {
  const tierInfo = tier ? TIER_LABELS[tier] : null;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {/* Score header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-foreground">{score.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">/ 10</div>
          {tierInfo && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierInfo.color}`}>
              {tierInfo.label}
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Viral Skor</div>
      </div>

      {/* Factor bars */}
      <div className="space-y-2.5">
        {(Object.entries(breakdown) as [keyof BreakdownType, number][]).map(([key, value]) => {
          const factor = FACTOR_LABELS[key];
          if (!factor) return null;
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{factor.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-mono">{(value * 100).toFixed(0)}%</span>
                  <span className="text-muted-foreground/50 text-[10px]">x{factor.weight}</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(value * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${factor.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula */}
      <div className="pt-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Viral Skor = (Etkileşim × 0.35) + (Büyüme × 0.25) + (Paylaşım × 0.15) + (Yorum × 0.15) + (Güncellik × 0.10)
        </p>
      </div>
    </div>
  );
}
