"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoLinkProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  subtitle?: string;
}

export default function LogoLink({ size = "md", showSubtitle, subtitle }: LogoLinkProps) {
  const [href, setHref] = useState("/");

  useEffect(() => {
    const hasSession = document.cookie.split(";").some((c) => c.trim().startsWith("session="));
    if (hasSession) {
      setHref("/dashboard");
    }
  }, []);

  const iconSizes = {
    sm: 28,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link href={href} className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Valyze TR"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className="rounded-lg"
        unoptimized
      />
      <div>
        <span className={`${textSizes[size]} font-bold text-text-primary`}>
          Valyze <span className="text-neon-red">TR</span>
        </span>
        {showSubtitle && subtitle && (
          <p className="text-[10px] text-text-muted uppercase tracking-wider">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}
