"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppHeader } from "@/shared/components/layout/app-header";
import { Button } from "@/shared/components/ui/button";
import { useRoleStore } from "@/shared/stores/role-store";
import { useSwipeDeck } from "../hooks/use-swipe-deck";
import { mockProfiles } from "../lib/mock";
import { FilterBar } from "./filter-bar";
import { FilterSheet } from "./filter-sheet";
import { SwipeCard } from "./swipe-card";
import { SwipeActions } from "./swipe-actions";

export function DiscoverScreen() {
  const role = useRoleStore((s) => s.role);
  const [filters, setFilters] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filters.length === 0) return mockProfiles;
    return mockProfiles.filter((p) =>
      p.categories.some((c) => filters.includes(c)),
    );
  }, [filters]);

  const { stack, history, commit, rewind, reset, isEmpty } =
    useSwipeDeck(filtered);

  const headerSubtitle =
    role === "employer" ? "Buscando profesionales" : "Explorando oportunidades";

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full mx-auto">
      <AppHeader showBrand subtitle={headerSubtitle} />

      <FilterBar
        selected={filters}
        onOpenSheet={() => setSheetOpen(true)}
        onRemove={(slug) => setFilters((f) => f.filter((s) => s !== slug))}
      />

      <div className="flex flex-col flex-1 min-h-0 px-4 sm:px-6 pt-4 w-full max-w-xl mx-auto">
        <div className="relative w-full flex-1 min-h-0">
          <AnimatePresence>
            {stack.slice(0, 3).map((profile, idx) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                active={idx === 0}
                stackIndex={idx}
                onCommit={commit}
              />
            ))}
          </AnimatePresence>

          {isEmpty && (
            <EmptyDeck
              filtered={filters.length > 0}
              onReset={reset}
              onClearFilters={() => setFilters([])}
            />
          )}
        </div>

        <div
          className={[
            "shrink-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 mt-3 pt-3 pb-safe lg:mx-0 lg:px-0",
            "bg-gradient-to-t from-background via-background/95 to-transparent",
            "lg:bg-transparent lg:from-transparent lg:via-transparent",
            "sticky bottom-0 lg:static",
          ].join(" ")}
          style={{
            bottom: "max(env(safe-area-inset-bottom), 0px)",
          }}
        >
          <SwipeActions
            disabled={isEmpty}
            onRewind={history.length > 0 ? rewind : undefined}
            onPass={() => commit("pass")}
            onSuper={() => commit("super")}
            onMatch={() => commit("match")}
          />
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        selected={filters}
        onApply={setFilters}
      />
    </div>
  );
}

function EmptyDeck({
  filtered,
  onReset,
  onClearFilters,
}: {
  filtered: boolean;
  onReset: () => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="grid place-items-center h-16 w-16 rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-8 w-8" aria-hidden />
      </div>
      <div>
        <h3 className="text-lg font-bold">
          {filtered ? "No hay perfiles con esos filtros" : "No hay más perfiles cerca"}
        </h3>
        <p className="text-sm text-muted mt-1 max-w-[28ch]">
          {filtered
            ? "Probá quitar algún filtro o ampliar las categorías."
            : "Probá ajustar tus filtros o esperá un poco — sumamos perfiles todo el tiempo."}
        </p>
      </div>
      {filtered ? (
        <Button onClick={onClearFilters} variant="primary" size="md">
          Limpiar filtros
        </Button>
      ) : (
        <Button onClick={onReset} variant="primary" size="md">
          Recargar mock
        </Button>
      )}
    </div>
  );
}
