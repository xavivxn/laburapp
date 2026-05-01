"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, RotateCcw, Star, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface SwipeActionsProps {
  onPass: () => void;
  onSuper: () => void;
  onMatch: () => void;
  onRewind?: () => void;
  disabled?: boolean;
  /** Layout reducido (ej. “isla” flotante en el feed móvil). */
  compact?: boolean;
}

type TapKind = "rewind" | "pass" | "super" | "match";

const SPRING_TOUCH = {
  type: "spring" as const,
  stiffness: 540,
  damping: 20,
  mass: 0.4,
};

function tapHaptic(kind: TapKind) {
  try {
    if (kind === "rewind") navigator.vibrate?.([5, 8, 5]);
    else if (kind === "pass") navigator.vibrate?.(13);
    else if (kind === "super") navigator.vibrate?.([8, 5, 10, 5, 12]);
    else navigator.vibrate?.([6, 4, 6, 4, 10]);
  } catch {
    /* noop */
  }
}

function tapMotion(kind: TapKind) {
  if (kind === "rewind") return { scale: 0.9, rotate: -11 };
  if (kind === "pass") return { scale: 0.84, rotate: 2 };
  if (kind === "super") return { scale: 0.9, rotate: 18 };
  return {
    scale: 1.06,
    boxShadow:
      "0 0 0 5px rgba(132, 204, 22, 0.2), 0 12px 32px -10px rgba(132, 204, 22, 0.4)",
  };
}

export function SwipeActions({
  onPass,
  onSuper,
  onMatch,
  onRewind,
  disabled,
  compact = false,
}: SwipeActionsProps) {
  const reduceMotion = useReducedMotion();
  const allowJuice = !disabled && !(reduceMotion ?? false);

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        compact ? "gap-1.5" : "gap-2 sm:gap-3",
      )}
    >
      {onRewind && (
        <ActionButton
          kind="rewind"
          label="Volver atrás"
          onClick={onRewind}
          disabled={disabled}
          allowJuice={allowJuice}
          compact={compact}
          className={cn(
            compact
              ? "h-10 w-10 bg-background/95 text-warning border-border/55 dark:bg-white/14 dark:border-transparent"
              : "h-11 w-11 bg-surface text-warning border border-border",
          )}
        >
          <RotateCcw
            className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")}
            aria-hidden
          />
        </ActionButton>
      )}
      <ActionButton
        kind="pass"
        label="Pasar"
        onClick={onPass}
        disabled={disabled}
        allowJuice={allowJuice}
        compact={compact}
        className={cn(
          compact
            ? "h-10 w-10 bg-background/95 text-danger border-border/55 dark:bg-white/12 dark:border-transparent"
            : "h-11 w-11 bg-surface text-danger border border-border",
        )}
      >
        <X
          className={cn(compact ? "h-[1.15rem] w-[1.15rem]" : "h-6 w-6")}
          aria-hidden
          strokeWidth={compact ? 2.55 : 2.75}
        />
      </ActionButton>
      <ActionButton
        kind="super"
        label="Super interesado"
        onClick={onSuper}
        disabled={disabled}
        allowJuice={allowJuice}
        compact={compact}
        className={cn(
          compact
            ? "h-10 w-10 bg-background/95 text-primary border-border/55 dark:bg-white/12 dark:border-transparent"
            : "h-11 w-11 bg-surface text-primary border border-border",
        )}
      >
        <Star
          className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")}
          aria-hidden
          strokeWidth={2.5}
        />
      </ActionButton>
      <ActionButton
        kind="match"
        label="Match"
        onClick={onMatch}
        disabled={disabled}
        allowJuice={allowJuice}
        compact={compact}
        className={cn(
          compact ? "h-10 w-10 shadow-sm" : "h-11 w-11",
          "bg-accent text-accent-foreground",
        )}
      >
        <Heart
          className={cn(
            compact ? "h-[1.15rem] w-[1.15rem]" : "h-6 w-6",
            "fill-current",
          )}
          aria-hidden
        />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  kind,
  label,
  onClick,
  disabled,
  compact,
  allowJuice,
  className,
  children,
}: {
  kind: TapKind;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
  allowJuice: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={allowJuice ? () => tapHaptic(kind) : undefined}
      disabled={disabled}
      initial={false}
      whileTap={allowJuice ? tapMotion(kind) : undefined}
      transition={SPRING_TOUCH}
      style={{
        transformOrigin:
          kind === "super"
            ? "50% 60%"
            : kind === "rewind"
              ? "52% 80%"
              : "50% 50%",
      }}
      className={cn(
        "relative isolate grid cursor-pointer place-items-center overflow-visible rounded-full",
        "touch-manipulation select-none outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background",
        compact
          ? "shadow-[0_1px_8px_-2px_rgba(0,0,0,0.14)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.42)]"
          : "shadow-sm",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
