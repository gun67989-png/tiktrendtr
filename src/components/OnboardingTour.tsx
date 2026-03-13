"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X, Check, type LucideIcon } from "lucide-react";

export interface TourStep {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

interface OnboardingTourProps {
  tourKey: string;
  steps: TourStep[];
  tourTitle?: string;
}

export default function OnboardingTour({
  tourKey,
  steps,
  tourTitle,
}: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const storageKey = `valyze_tour_${tourKey}`;

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return;
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const dismiss = useCallback(() => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }, [storageKey]);

  const next = () => {
    if (current < steps.length - 1) setCurrent((p) => p + 1);
    else dismiss();
  };

  const prev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  if (!visible || steps.length === 0) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const color = step.color || "text-primary";
  const bgColor = color.replace("text-", "bg-") + "/10";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="fixed z-[200] bottom-4 right-4 w-72 sm:w-80"
        >
          <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                {tourTitle || "Rehber"} &middot; {current + 1}/{steps.length}
              </span>
              <button
                onClick={dismiss}
                className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Kapat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="px-3.5 py-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <step.icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-foreground mb-0.5">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="px-3.5 pb-2.5 pt-0.5 flex items-center justify-between">
              {/* Dots */}
              <div className="flex items-center gap-1">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all ${
                      i === current
                        ? "w-4 h-1 bg-primary"
                        : "w-1 h-1 bg-text-muted/30 hover:bg-text-muted/50"
                    }`}
                    aria-label={`${i + 1}. adim`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-1.5">
                {current > 0 ? (
                  <button
                    onClick={prev}
                    className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded"
                  >
                    <ArrowLeft className="w-2.5 h-2.5" />
                    Geri
                  </button>
                ) : (
                  <button
                    onClick={dismiss}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded"
                  >
                    Gec
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 text-[10px] font-medium bg-primary/90 text-white px-2.5 py-1 rounded-md hover:bg-primary transition-colors"
                >
                  {isLast ? (
                    <>
                      <Check className="w-2.5 h-2.5" /> Tamam
                    </>
                  ) : (
                    <>
                      Sonraki <ArrowRight className="w-2.5 h-2.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
