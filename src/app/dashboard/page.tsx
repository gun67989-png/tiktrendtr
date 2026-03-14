"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Building2, User, ArrowLeftRight } from "lucide-react";
import EnterpriseDashboard from "@/components/dashboard/EnterpriseDashboard";
import IndividualDashboard from "@/components/dashboard/IndividualDashboard";

interface UserInfo {
  userId: string;
  username: string;
  email: string;
  role: "admin" | "user";
  subscriptionType: "free" | "lite" | "standard" | "enterprise";
  subscriptionNiche: string | null;
  subscriptionRole: "brand" | "individual" | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminView, setAdminView] = useState<"brand" | "individual" | null>(null);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-card rounded-2xl border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl border border-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-card rounded-xl border border-border" />
          <div className="h-80 bg-card rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  // Determine which dashboard to show
  let showBrand: boolean;
  if (isAdmin && adminView !== null) {
    showBrand = adminView === "brand";
  } else {
    showBrand = user?.subscriptionType === "enterprise" || user?.subscriptionRole === "brand";
  }

  return (
    <div>
      {/* Admin Dashboard Switcher */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 bg-gradient-to-r from-amber-500/5 via-card to-purple-500/5 rounded-xl border border-amber-500/20 px-4 py-3"
        >
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-400 mr-2">Admin</span>
          <div className="flex gap-1 bg-background/50 rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setAdminView("brand")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                showBrand
                  ? "bg-amber-500/15 text-amber-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Marka
            </button>
            <button
              onClick={() => setAdminView("individual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                !showBrand
                  ? "bg-teal/15 text-teal shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Bireysel
            </button>
          </div>
          <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">
            Dashboard görünümünü değiştir
          </span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={showBrand ? "enterprise" : "individual"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {showBrand ? (
            <EnterpriseDashboard user={user!} />
          ) : (
            <IndividualDashboard user={user} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
