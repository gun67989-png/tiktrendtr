"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiX, FiTrendingUp } from "react-icons/fi";

interface LogoutOverlayProps {
  username?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/* Deterministic orbiting particles — reverse direction from welcome */
function makeParticles(n: number) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: i,
      radius: 90 + (i % 3) * 30,
      size: 3 + (i % 4),
      speed: 6 + (i % 4) * 2,
      delay: (i * 0.15) % 1,
      color:
        i % 3 === 0
          ? "rgba(255,77,106,0.5)"
          : i % 3 === 1
            ? "rgba(0,230,184,0.4)"
            : "rgba(167,139,250,0.4)",
    });
  }
  return out;
}

/* Floating wireframe shapes */
function makeShapes(n: number) {
  const colors = [
    "border-neon-red/15",
    "border-teal/15",
    "border-purple/15",
    "border-amber/15",
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: i,
      x: ((i * 137.5) % 80) + 10,
      y: ((i * 91.7) % 80) + 10,
      size: 16 + (i % 3) * 12,
      rotDuration: 4 + (i % 4) * 2,
      floatDuration: 3 + (i % 3) * 1.5,
      delay: i * 0.2,
      color: colors[i % colors.length],
      shape: i % 3,
    });
  }
  return out;
}

export default function LogoutOverlay({
  username,
  open,
  onCancel,
  onConfirm,
}: LogoutOverlayProps) {
  const [phase, setPhase] = useState<"confirm" | "animating">("confirm");
  const particles = useMemo(() => makeParticles(8), []);
  const shapes = useMemo(() => makeShapes(5), []);

  const brandName = "TikTrend";
  const brandAccent = "TR";
  const allLetters = [...brandName.split(""), ...brandAccent.split("")];

  const handleConfirm = useCallback(() => {
    setPhase("animating");
    // Animasyon bittikten sonra gerçek logout
    setTimeout(() => {
      onConfirm();
    }, 3000);
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setPhase("confirm");
    onCancel();
  }, [onCancel]);

  return (
    <AnimatePresence
      onExitComplete={() => setPhase("confirm")}
    >
      {open && (
        <>
          {/* ── Onay Modalı ── */}
          {phase === "confirm" && (
            <motion.div
              key="confirm-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCancel}
              />

              {/* Modal card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 15, y: 40 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -10, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="relative z-10 w-full max-w-sm mx-4 bg-surface border border-border rounded-2xl p-6 shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 3D Icon */}
                <motion.div
                  initial={{ rotateY: -90, scale: 0.5 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 14,
                    delay: 0.1,
                  }}
                  className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <FiLogOut className="w-6 h-6 text-neon-red" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg font-bold text-text-primary text-center mb-2"
                >
                  Çıkış Yap
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-text-secondary text-center mb-6"
                >
                  {username
                    ? `${username}, çıkış yapmak istediğine emin misin?`
                    : "Çıkış yapmak istediğine emin misin?"}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-light transition-all"
                  >
                    <FiX className="w-4 h-4" />
                    Vazgeç
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-red text-white text-sm font-medium hover:bg-neon-red/90 transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Çıkış Animasyonu (Giriş animasyonunun tersi) ── */}
          {phase === "animating" && (
            <motion.div
              key="logout-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              {/* ── Gradient orbs — shrink and fade (reverse of welcome) ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none"
              >
                <motion.div
                  animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 30, -20, 0],
                    scale: [1, 0.7, 1.1, 0.5],
                    opacity: [1, 0.8, 0.5, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute top-[20%] left-[25%] w-96 h-96 bg-neon-red/10 rounded-full blur-[120px]"
                />
                <motion.div
                  animate={{
                    x: [0, 35, -25, 0],
                    y: [0, -25, 20, 0],
                    scale: [1, 0.8, 0.6, 0.3],
                    opacity: [1, 0.7, 0.4, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-[20%] right-[25%] w-80 h-80 bg-teal/8 rounded-full blur-[120px]"
                />
                <motion.div
                  animate={{
                    scale: [1, 0.85, 0.5, 0],
                    opacity: [0.6, 0.4, 0.2, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple/6 rounded-full blur-[140px]"
                />
              </motion.div>

              {/* ── Floating shapes — spiral out ── */}
              {shapes.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    rotate: 180,
                    x: (s.x > 50 ? 1 : -1) * 200,
                    y: (s.y > 50 ? 1 : -1) * 200,
                  }}
                  transition={{
                    delay: 1.5 + s.delay,
                    duration: 1,
                    ease: "easeIn",
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    perspective: "400px",
                  }}
                >
                  <motion.div
                    animate={{
                      rotateX: [0, -360],
                      rotateY: [0, -360],
                      y: [0, 15, 0],
                    }}
                    transition={{
                      rotateX: {
                        duration: s.rotDuration,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      rotateY: {
                        duration: s.rotDuration * 1.3,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      y: {
                        duration: s.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    style={{
                      width: s.size,
                      height: s.size,
                      transformStyle: "preserve-3d",
                    }}
                    className={`border ${s.color} ${
                      s.shape === 0
                        ? "rounded-sm"
                        : s.shape === 1
                          ? "rounded-full"
                          : "rounded-none"
                    }`}
                  />
                </motion.div>
              ))}

              {/* ── Center 3-D scene — reverse entrance ── */}
              <motion.div
                initial={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
                animate={{ rotateX: -25, rotateY: 15, scale: 0.7, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative z-10 flex flex-col items-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ── Logo with 3-D orbiting rings (reverse rotation) ── */}
                <div
                  className="relative mb-8"
                  style={{ perspective: "600px", transformStyle: "preserve-3d" }}
                >
                  {/* Ring 1 — reverse direction */}
                  <motion.div
                    animate={{ rotateY: -360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-neon-red/25"
                    style={{
                      transformStyle: "preserve-3d",
                      rotateX: "70deg",
                    }}
                  />

                  {/* Ring 2 — reverse */}
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-teal/20"
                    style={{
                      transformStyle: "preserve-3d",
                      rotateX: "55deg",
                      rotateZ: "30deg",
                    }}
                  />

                  {/* Ring 3 — reverse */}
                  <motion.div
                    animate={{ rotateY: -360 }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-purple/15"
                    style={{
                      transformStyle: "preserve-3d",
                      rotateX: "60deg",
                      rotateZ: "-40deg",
                    }}
                  />

                  {/* Contracting pulse rings (reverse of expanding) */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`pulse-${i}`}
                      initial={{ opacity: 0, scale: 2.5 }}
                      animate={{ opacity: [0, 0.4, 0], scale: [2.5, 0.7, 0.3] }}
                      transition={{
                        duration: 2,
                        delay: 0.3 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeIn",
                      }}
                      className="absolute inset-0 rounded-2xl border border-neon-red/20"
                    />
                  ))}

                  {/* Orbiting particles — reverse spin */}
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: [0.8, 0.4, 0] }}
                      transition={{
                        delay: 1.5 + p.delay,
                        duration: 1,
                      }}
                      className="absolute top-1/2 left-1/2"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: p.speed,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          width: 0,
                          height: 0,
                          transformOrigin: "center center",
                        }}
                      >
                        <div
                          className="rounded-full"
                          style={{
                            width: p.size,
                            height: p.size,
                            background: p.color,
                            transform: `translateX(${p.radius}px) translateY(-50%)`,
                            boxShadow: `0 0 6px ${p.color}`,
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}

                  {/* Main logo — 3-D exit (reverse of entrance) */}
                  <motion.div
                    initial={{ scale: 1, rotateY: 0, rotateX: 0 }}
                    animate={{
                      scale: [1, 1.1, 0],
                      rotateY: [0, 0, 180],
                      rotateX: [0, 0, -45],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 1.6,
                      ease: [0.36, 0, 0.66, -0.56],
                      times: [0, 0.3, 1],
                    }}
                    className="relative w-[72px] h-[72px] rounded-2xl gradient-red flex items-center justify-center"
                    style={{
                      transformStyle: "preserve-3d",
                      boxShadow:
                        "0 0 30px rgba(255,77,106,0.3), 0 20px 40px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                    <motion.div
                      animate={{ rotateY: [0, -360] }}
                      transition={{
                        duration: 2,
                        delay: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <FiTrendingUp className="w-9 h-9 text-white relative z-10" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* ── Brand name — 3-D letter-by-letter EXIT (reverse direction) ── */}
                <div
                  className="flex items-center mb-2"
                  style={{ perspective: "800px" }}
                >
                  {allLetters.map((char, i) => {
                    const isAccent = i >= brandName.length;
                    const reverseIndex = allLetters.length - 1 - i;
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0 }}
                        animate={{
                          opacity: 0,
                          rotateY: isAccent ? -90 : 90,
                          rotateX: isAccent ? 30 : -30,
                          y: 20,
                          z: -80,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: 1.2 + reverseIndex * 0.05,
                          ease: [0.36, 0, 0.66, -0.56],
                        }}
                        className={`text-3xl sm:text-4xl font-bold inline-block ${
                          isAccent ? "text-neon-red" : "text-text-primary"
                        }`}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "bottom center",
                          textShadow: isAccent
                            ? "0 0 20px rgba(255,77,106,0.4)"
                            : "0 2px 10px rgba(0,0,0,0.3)",
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </div>

                {/* ── Divider — shrink out (reverse of grow in) ── */}
                <div style={{ perspective: "400px" }} className="mb-4">
                  <motion.div
                    initial={{ scaleX: 1, rotateX: 0 }}
                    animate={{ scaleX: 0, rotateX: -90 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.0,
                      ease: [0.36, 0, 0.66, -0.56],
                    }}
                    className="w-24 h-[2px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,77,106,0.6), rgba(0,230,184,0.4), transparent)",
                      boxShadow:
                        "0 0 8px rgba(255,77,106,0.3), 0 0 8px rgba(0,230,184,0.2)",
                    }}
                  />
                </div>

                {/* ── Goodbye text — 3-D blur exit ── */}
                <div style={{ perspective: "600px" }}>
                  <motion.p
                    initial={{ opacity: 1, rotateX: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      rotateX: 40,
                      y: -15,
                      filter: "blur(12px)",
                    }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-sm sm:text-base text-text-secondary text-center tracking-wide"
                    style={{
                      transformOrigin: "bottom center",
                      textShadow: "0 1px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {username
                      ? `Görüşmek üzere, ${username}!`
                      : "Görüşmek üzere!"}
                  </motion.p>
                </div>

                {/* ── Progress bar — fills up then disappears ── */}
                <div style={{ perspective: "300px" }} className="mt-7">
                  <motion.div
                    initial={{ opacity: 1, rotateX: 0 }}
                    animate={{ opacity: [1, 1, 0], rotateX: [0, 0, -60] }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.8, 1],
                    }}
                    className="w-40 h-[3px] bg-surface-light/50 rounded-full overflow-hidden"
                    style={{
                      transformOrigin: "top center",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 2.2,
                        ease: "easeInOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,77,106,0.8), rgba(0,230,184,0.6), rgba(167,139,250,0.5))",
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
