"use client";

import Link from "next/link";
import { FiTrendingUp } from "react-icons/fi";
import { useEffect, useState } from "react";

interface LogoLinkProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  subtitle?: string;
}

export default function LogoLink({ size = "md", showSubtitle, subtitle }: LogoLinkProps) {
  const [href, setHref] = useState("/");

  useEffect(() => {
    // Cookie check - if session cookie exists, user is logged in
    const hasSession = document.cookie.split(";").some((c) => c.trim().startsWith("session="));
    if (hasSession) {
      setHref("/dashboard");
    }
  }, []);

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconInner = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link href={href} className="flex items-center gap-2">
      <div className={`${iconSizes[size]} rounded-lg gradient-red flex items-center justify-center`}>
        <FiTrendingUp className={`${iconInner[size]} text-white`} />
      </div>
      <div>
        <span className={`${textSizes[size]} font-bold text-text-primary`}>
          TikTrend<span className="text-neon-red">TR</span>
        </span>
        {showSubtitle && subtitle && (
          <p className="text-[10px] text-text-muted uppercase tracking-wider">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}
