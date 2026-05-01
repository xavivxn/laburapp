"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { getCategoryLabel } from "../lib/categories";

export interface FilterBarProps {
  selected: string[];
  onOpenSheet: () => void;
  onRemove: (slug: string) => void;
}

export function FilterBar({ selected, onOpenSheet, onRemove }: FilterBarProps) {
  const count = selected.length;

  return (
    <div className="px-4 sm:px-6 pt-3">
      <div
        className={cn(
          "flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scroll-pl-1 touch-pan-x",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <button
          type="button"
          onClick={onOpenSheet}
          aria-haspopup="dialog"
          className={cn(
            "shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-semibold transition-colors touch-manipulation min-h-11",
            count > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-surface text-foreground border-border hover:border-primary/50",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtrar
          {count > 0 && (
            <span
              aria-label={`${count} filtros activos`}
              className="grid place-items-center h-5 min-w-5 px-1.5 rounded-full bg-primary-foreground text-primary text-xs font-bold"
            >
              {count}
            </span>
          )}
        </button>

        {selected.map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => onRemove(slug)}
            aria-label={`Quitar filtro ${getCategoryLabel(slug)}`}
            className="shrink-0 inline-flex items-center gap-1.5 h-10 pl-3 pr-2 rounded-full bg-accent/15 text-accent-foreground dark:text-accent border border-accent/30 text-sm font-medium hover:bg-accent/25 transition-colors min-h-11"
          >
            {getCategoryLabel(slug)}
            <X className="h-4 w-4" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
