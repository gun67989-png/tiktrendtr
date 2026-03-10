"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiZap,
  FiUser,
  FiMail,
  FiUserPlus,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi girin");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Kayıt başarısız");
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-red/10 rounded-full blur-[100px] bg-animate" />
        <div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-teal/10 rounded-full blur-[120px] bg-animate"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-72 h-72 bg-neon-red/5 rounded-full blur-[80px] bg-animate"
          style={{ animationDelay: "10s" }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                Tik<span className="text-neon-red">Trend</span>TR
              </h1>
            </div>
            <p className="text-text-secondary text-sm">Yeni Hesap Oluştur</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                E-posta
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Şifre
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-12 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neon-red/10 border border-neon-red/20 rounded-lg p-3 text-neon-red text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              type="submit"
              disabled={
                loading || !username || !email || !password || !confirmPassword
              }
              className="w-full gradient-red text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiUserPlus className="w-4 h-4" />
                  Kayıt Ol
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-text-secondary text-sm">
              Zaten hesabınız var mı?{" "}
              <Link
                href="/login"
                className="text-neon-red hover:text-neon-red/80 font-medium transition-colors"
              >
                Giriş Yap
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
