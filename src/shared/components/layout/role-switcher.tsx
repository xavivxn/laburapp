"use client";

import { useRoleStore } from "@/shared/stores/role-store";
import { cn } from "@/shared/lib/cn";

const options = [
  { value: "employee", label: "Buscar laburo" },
  { value: "employer", label: "Contratar" },
] as const;

export function RoleSwitcher({ className }: { className?: string }) {
  const role = useRoleStore((s) => s.role);
  const setRole = useRoleStore((s) => s.setRole);

  return (
    <div
      role="radiogroup"
      aria-label="Rol activo"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-xs font-semibold",
        className,
      )}
    >
      {options.map((opt) => {
        const active = role === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            type="button"
            onClick={() => setRole(opt.value)}
            className={cn(
              "px-3 h-8 rounded-full transition-colors whitespace-nowrap",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
