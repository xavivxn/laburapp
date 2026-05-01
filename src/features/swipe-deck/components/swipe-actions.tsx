"use client";

import { Heart, RotateCcw, Star, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface SwipeActionsProps {
  onPass: () => void;
  onSuper: () => void;
  onMatch: () => void;
  onRewind?: () => void;
  disabled?: boolean;
}

export function SwipeActions({
  onPass,
  onSuper,
  onMatch,
  onRewind,
  disabled,
}: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {onRewind && (
        <ActionButton
          label="Volver atrás"
          onClick={onRewind}
          disabled={disabled}
          className="h-12 w-12 bg-surface text-warning border border-border"
        >
          <RotateCcw className="h-5 w-5" aria-hidden />
        </ActionButton>
      )}
      <ActionButton
        label="Pasar"
        onClick={onPass}
        disabled={disabled}
        className="h-14 w-14 bg-surface text-danger border border-border"
      >
        <X className="h-7 w-7" aria-hidden strokeWidth={3} />
      </ActionButton>
      <ActionButton
        label="Super interesado"
        onClick={onSuper}
        disabled={disabled}
        className="h-12 w-12 bg-surface text-primary border border-border"
      >
        <Star className="h-5 w-5" aria-hidden strokeWidth={2.5} />
      </ActionButton>
      <ActionButton
        label="Match"
        onClick={onMatch}
        disabled={disabled}
        className="h-14 w-14 bg-accent text-accent-foreground"
      >
        <Heart className="h-7 w-7 fill-current" aria-hidden />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full grid place-items-center shadow-sm transition-all",
        "active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        "touch-manipulation",
        className,
      )}
    >
      {children}
    </button>
  );
}
