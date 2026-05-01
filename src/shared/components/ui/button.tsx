"use client";

import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "accent" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-elevated active:scale-[0.98]",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-elevated active:scale-[0.98]",
  danger:
    "bg-danger text-white hover:opacity-90 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-full",
  md: "h-11 px-5 text-base rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
  icon: "h-11 w-11 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", fullWidth, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all",
        "disabled:opacity-50 disabled:pointer-events-none",
        "select-none touch-manipulation",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
