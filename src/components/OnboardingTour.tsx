"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiX, FiCheck } from "react-icons/fi";
import type { IconType } from "react-icons";

export interface TourStep {
  icon: IconType;
  title: string;
  description: string;
  color?: string; // tailwind text color class, defaults to text-neon-red
}

interface OnboardingTourProps {
  /** Unique key per page — used for localStorage so each tour shows only once */
  tourKey: string;
  /** Ordered list of steps to present */
  steps: TourStep[];
  /** Optional title shown above the step content */
  tourTitle?: string;
}

export default function OnboardingTour({
  tourKey,
  steps,
  tourTitle,
}: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const storageKey = `tiktrendtr_tour_${tourKey}`;

  useEffect(() => {
    // Show only once ever (localStorage persists across sessions)
    if (localStorage.getItem(storageKey)) return;
    // Small delay so page content renders first
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const dismiss = useCallback(() => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }, [storageKey]);

  const next = () => {
    if (current < steps.length - 1) {
      setCurrent((p) => p + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  if (!visible || steps.length === 0) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const color = step.color || "text-neon-red";
  const bgColor = color.replace("text-", "bg-") + "/10";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Tour card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="fixed z-[9001] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm"
          >
            <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {tourTitle || "Sayfa Rehberi"} &middot; {current + 1}/{steps.length}
                </span>
                <button
                  onClick={dismiss}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-light transition-colors"
                  aria-label="Kapat"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 py-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-3`}
                  >
                    <step.icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots + buttons */}
              <div className="px-5 pb-4 pt-1 flex items-center justify-between">
                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all ${
                        i === current
                          ? "w-5 h-1.5 bg-neon-red"
                          : "w-1.5 h-1.5 bg-text-muted/30 hover:bg-text-muted/60"
                      }`}
                      aria-label={`Adim ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {current > 0 && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-surface-light"
                    >
                      <FiArrowLeft className="w-3 h-3" />
                      Geri
                    </button>
                  )}
                  {current === 0 && (
                    <button
                      onClick={dismiss}
                      className="text-xs text-text-muted hover:text-text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-surface-light"
                    >
                      Gec
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1.5 text-xs font-medium bg-neon-red text-white px-3 py-1.5 rounded-lg hover:bg-neon-red-light transition-colors"
                  >
                    {isLast ? (
                      <>
                        <FiCheck className="w-3 h-3" />
                        Anladim
                      </>
                    ) : (
                      <>
                        Sonraki
                        <FiArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
