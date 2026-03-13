"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import Image from "next/image";

interface LogoutOverlayProps {
  username?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutOverlay({
  username,
  open,
  onCancel,
  onConfirm,
}: LogoutOverlayProps) {
  const [phase, setPhase] = useState<"confirm" | "animating">("confirm");

  const handleConfirm = useCallback(() => {
    setPhase("animating");
    setTimeout(() => {
      onConfirm();
    }, 2000);
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setPhase("confirm");
    onCancel();
  }, [onCancel]);

  return (
    <AnimatePresence onExitComplete={() => setPhase("confirm")}>
      {open && (
        <>
          {phase === "confirm" && (
            <motion.div
              key="confirm-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCancel}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full max-w-sm mx-4 bg-card border border-border rounded-xl p-6"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                  Çıkış Yap
                </h3>

                <p className="text-sm text-muted-foreground text-center mb-6">
                  {username
                    ? `${username}, çıkış yapmak istediğine emin misin?`
                    : "Çıkış yapmak istediğine emin misin?"}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-card-light transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Vazgeç
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {phase === "animating" && (
            <motion.div
              key="logout-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="w-16 h-16 rounded-2xl overflow-hidden mb-6"
                >
                  <Image
                    src="/logo.png"
                    alt="Valyze TR"
                    width={64}
                    height={64}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-sm text-muted-foreground"
                >
                  {username
                    ? `Görüşmek üzere, ${username}!`
                    : "Görüşmek üzere!"}
                </motion.p>

                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 w-32 h-[2px] bg-card-light rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-primary/60 rounded-full"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
