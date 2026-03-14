"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        {/* Skeleton Hero */}
        <div className="h-40 bg-card rounded-2xl border border-border" />
        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl border border-border" />
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-card rounded-xl border border-border" />
          <div className="h-80 bg-card rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  // Show brand/enterprise dashboard for: enterprise plan OR brand role users
  const isBrandDashboard =
    user?.subscriptionType === "enterprise" || user?.subscriptionRole === "brand";

  return (
    <motion.div
      key={isBrandDashboard ? "enterprise" : "individual"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isBrandDashboard ? (
        <EnterpriseDashboard user={user!} />
      ) : (
        <IndividualDashboard user={user} />
      )}
    </motion.div>
  );
}
