"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase } from "lucide-react";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/shared/lib/cn";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-surface",
        "h-dvh sticky top-0 pt-safe",
      )}
    >
      <div className="px-6 py-5 flex items-center gap-2">
        <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary text-primary-foreground">
          <Briefcase className="h-5 w-5" aria-hidden />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          {siteConfig.name}
        </span>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 px-3">
        <ul className="space-y-1">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    "text-sm font-medium",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-surface-elevated hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted px-3">Tema</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
