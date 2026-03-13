"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WelcomeOverlayProps {
  username?: string;
}

export default function WelcomeOverlay({ username }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = "valyze_welcome_shown";
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
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

            {/* Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mb-2"
            >
              Valyze <span className="text-teal">TR</span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="w-16 h-px bg-border mb-4"
            />

            {/* Welcome text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-sm text-muted-foreground text-center"
            >
              {username
                ? `Hoş geldin, ${username}!`
                : "Türkiye'nin TikTok Trend Analiz Platformu"}
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 w-32 h-[2px] bg-card-light rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/3 bg-primary/60 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
