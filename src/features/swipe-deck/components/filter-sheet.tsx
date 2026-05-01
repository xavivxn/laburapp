"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { categoryGroups } from "../lib/categories";

export interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  selected: string[];
  onApply: (selected: string[]) => void;
}

export function FilterSheet({ open, onClose, selected, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState<string[]>(selected);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => setDraft(selected));
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggle = (slug: string) => {
    setDraft((d) =>
      d.includes(slug) ? d.filter((s) => s !== slug) : [...d, slug],
    );
  };

  const clear = () => setDraft([]);
  const apply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar filtros"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtrar por profesión"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className={cn(
                "pointer-events-auto w-full lg:max-w-lg",
                "bg-background rounded-t-3xl lg:rounded-3xl lg:mb-8",
                "shadow-xl border-t border-border lg:border",
                "flex flex-col max-h-[85dvh] pb-safe",
              )}
            >
              <div className="pt-3 pb-1 grid place-items-center lg:hidden">
                <div className="h-1 w-10 rounded-full bg-border" aria-hidden />
              </div>

              <div className="px-5 pt-3 pb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    Filtrar por profesión
                  </h2>
                  <p className="text-xs text-muted">
                    Mostramos perfiles que coincidan con al menos uno de los rubros que elijas.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={onClose}
                  className="h-10 w-10 grid place-items-center rounded-full text-muted hover:bg-surface-elevated transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">
                {categoryGroups.map((group) => (
                  <section key={group.label}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                      {group.label}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => {
                        const active = draft.includes(item.slug);
                        return (
                          <button
                            key={item.slug}
                            type="button"
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => toggle(item.slug)}
                            className={cn(
                              "min-h-11 px-4 rounded-full border text-sm font-medium transition-colors touch-manipulation",
                              active
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-surface text-foreground border-border hover:border-primary/50",
                            )}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-border flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={clear}
                  disabled={draft.length === 0}
                >
                  Limpiar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={apply}
                >
                  {draft.length > 0
                    ? `Aplicar (${draft.length})`
                    : "Aplicar"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
