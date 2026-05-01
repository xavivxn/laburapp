"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/nav";
import { cn } from "@/shared/lib/cn";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 lg:hidden",
        "bg-background/85 backdrop-blur-xl border-t border-border",
        "pb-safe",
      )}
    >
      <ul className="grid grid-cols-4">
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
                  "flex flex-col items-center justify-center gap-1 py-2.5",
                  "min-h-14 transition-colors",
                  active ? "text-primary" : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
