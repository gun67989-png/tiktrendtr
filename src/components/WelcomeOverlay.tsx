"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WelcomeOverlayProps {
  username?: string;
}

/* Deterministic orbiting particles */
function makeParticles(n: number) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: i,
      angle: (360 / n) * i,
      radius: 90 + (i % 3) * 30,
      size: 3 + (i % 4),
      speed: 6 + (i % 4) * 2,
      delay: (i * 0.2) % 1.2,
      color:
        i % 3 === 0
          ? "rgba(255,77,106,0.6)"
          : i % 3 === 1
            ? "rgba(0,230,184,0.5)"
            : "rgba(167,139,250,0.5)",
    });
  }
  return out;
}

/* Floating 3-D geometric shapes */
function makeShapes(n: number) {
  const colors = [
    "border-neon-red/20",
    "border-teal/20",
    "border-purple/20",
    "border-amber/20",
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
      delay: i * 0.3,
      color: colors[i % colors.length],
      shape: i % 3, // 0 = cube wireframe, 1 = diamond, 2 = triangle
    });
  }
  return out;
}

export default function WelcomeOverlay({
  username,
}: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);
  const particles = useMemo(() => makeParticles(10), []);
  const shapes = useMemo(() => makeShapes(6), []);

  // Show on every login (no sessionStorage gating)
  useEffect(() => {
    setVisible(true);
  }, []);

  // Auto-dismiss after 3.5s
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, [visible]);

  const brandName = "Val";
  const brandAccent = "yze";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
          style={{ perspective: "1200px" }}
        >
          {/* ── Animated gradient background orbs ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{
                x: [0, 40, -30, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.3, 0.85, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-[20%] left-[25%] w-96 h-96 bg-neon-red/10 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                x: [0, -35, 25, 0],
                y: [0, 25, -20, 0],
                scale: [1, 0.85, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[20%] right-[25%] w-80 h-80 bg-teal/8 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 0.9, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple/6 rounded-full blur-[140px]"
            />
          </motion.div>

          {/* ── 3-D floating wireframe shapes ── */}
          {shapes.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + s.delay, duration: 0.6 }}
              className="absolute pointer-events-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                perspective: "400px",
              }}
            >
              <motion.div
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                  y: [0, -15, 0],
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

          {/* ── Center 3-D scene ── */}
          <motion.div
            initial={{ rotateX: 25, rotateY: -15, scale: 0.7, opacity: 0 }}
            animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="relative z-10 flex flex-col items-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ── Logo with 3-D orbiting rings ── */}
            <div
              className="relative mb-8"
              style={{ perspective: "600px", transformStyle: "preserve-3d" }}
            >
              {/* Orbiting ring 1 — horizontal */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-neon-red/25"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: "70deg",
                }}
              />

              {/* Orbiting ring 2 — tilted */}
              <motion.div
                animate={{ rotateY: -360 }}
                transition={{
                  duration: 5,
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

              {/* Orbiting ring 3 — opposite tilt */}
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 6,
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

              {/* Orbiting particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.8, 0] }}
                  transition={{
                    delay: 0.5 + p.delay,
                    duration: 0.6,
                    times: [0, 0.2, 0.8, 1],
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
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

              {/* Expanding pulse rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  initial={{ opacity: 0.4, scale: 0.7 }}
                  animate={{ opacity: 0, scale: 2.5 }}
                  transition={{
                    duration: 2.5,
                    delay: 0.5 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-2xl border border-neon-red/20"
                />
              ))}

              {/* Main logo — 3-D entrance */}
              <motion.div
                initial={{
                  scale: 0,
                  rotateY: -180,
                  rotateX: 45,
                }}
                animate={{
                  scale: 1,
                  rotateY: 0,
                  rotateX: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 14,
                  delay: 0.15,
                }}
                className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 0 30px rgba(255,77,106,0.3), 0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Valyze TR"
                  width={72}
                  height={72}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* ── Brand name — 3-D letter-by-letter ── */}
            <div
              className="flex items-center mb-2"
              style={{ perspective: "800px" }}
            >
              {brandName.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{
                    opacity: 0,
                    rotateY: -90,
                    rotateX: 30,
                    z: -80,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    rotateX: 0,
                    z: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-3xl sm:text-4xl font-bold text-text-primary inline-block"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "bottom center",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {brandAccent.split("").map((char, i) => (
                <motion.span
                  key={`a-${i}`}
                  initial={{
                    opacity: 0,
                    rotateY: 90,
                    rotateX: -30,
                    z: -80,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    rotateX: 0,
                    z: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + (brandName.length + i) * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-3xl sm:text-4xl font-bold text-neon-red inline-block"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "bottom center",
                    textShadow: "0 0 20px rgba(255,77,106,0.4)",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* ── Animated 3-D divider line ── */}
            <div style={{ perspective: "400px" }} className="mb-4">
              <motion.div
                initial={{ scaleX: 0, rotateX: 90 }}
                animate={{ scaleX: 1, rotateX: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1.05,
                  ease: [0.22, 1, 0.36, 1],
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

            {/* ── Welcome text — 3-D blur reveal ── */}
            <div style={{ perspective: "600px" }}>
              <motion.p
                initial={{
                  opacity: 0,
                  rotateX: -40,
                  y: 15,
                  filter: "blur(12px)",
                }}
                animate={{
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-sm sm:text-base text-text-secondary text-center tracking-wide"
                style={{
                  transformOrigin: "top center",
                  textShadow: "0 1px 8px rgba(0,0,0,0.2)",
                }}
              >
                {username
                  ? `Tekrar hos geldin, ${username}!`
                  : "TikTok Trend Analiz Platformu"}
              </motion.p>
            </div>

            {/* ── 3-D shimmer loading bar ── */}
            <div style={{ perspective: "300px" }} className="mt-7">
              <motion.div
                initial={{ opacity: 0, rotateX: 60 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="w-40 h-[3px] bg-surface-light/50 rounded-full overflow-hidden"
                style={{
                  transformOrigin: "bottom center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{
                    duration: 1.2,
                    delay: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/4 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,77,106,0.8), rgba(0,230,184,0.6), rgba(167,139,250,0.5), transparent)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
