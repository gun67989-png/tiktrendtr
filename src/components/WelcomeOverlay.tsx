"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

interface WelcomeOverlayProps {
  /** If provided, shows "Tekrar hoş geldin, {username}" */
  username?: string;
  /** sessionStorage key so overlay shows only once per session */
  storageKey?: string;
}

export default function WelcomeOverlay({
  username,
  storageKey = "tiktrendtr_welcome_shown",
}: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, [storageKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neon-red/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-56 h-56 bg-teal/6 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center shadow-lg shadow-neon-red/20">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-text-primary">
                TikTrend<span className="text-neon-red">TR</span>
              </span>
            </motion.div>

            {/* Welcome text */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-sm text-text-secondary text-center"
            >
              {username
                ? `Tekrar hos geldin, ${username}!`
                : "TikTok Trend Analiz Platformu"}
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="flex items-center gap-1.5 mt-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-neon-red/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
