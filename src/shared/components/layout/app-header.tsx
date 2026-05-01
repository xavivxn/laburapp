"use client";

import { Briefcase } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/shared/lib/cn";
import { ThemeToggle } from "./theme-toggle";
import { RoleSwitcher } from "./role-switcher";

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBrand?: boolean;
  showRoleSwitcher?: boolean;
  showThemeToggle?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  showBrand = false,
  showRoleSwitcher = true,
  showThemeToggle = true,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 lg:hidden",
        "bg-background/85 backdrop-blur-xl border-b border-border",
        "pt-safe",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          {showBrand && (
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary text-primary-foreground shrink-0">
              <Briefcase className="h-5 w-5" aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            {title ? (
              <h1 className="text-lg font-bold tracking-tight truncate">
                {title}
              </h1>
            ) : (
              <h1 className="font-display text-lg font-bold tracking-tight truncate">
                {siteConfig.name}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-muted truncate">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showRoleSwitcher && <RoleSwitcher />}
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
