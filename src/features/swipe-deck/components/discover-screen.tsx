"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppHeader } from "@/shared/components/layout/app-header";
import { Button } from "@/shared/components/ui/button";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
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
  const feedIslandLayout = useMediaQuery("(max-width: 1023px)");

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
    <div
      className={[
        "flex flex-col flex-1 min-h-0 min-w-0 w-full mx-auto",
        /* En móvil: no dejar que el contenido empuje el scroll de página por encima del nav;
         así los dedos buscando los CTA no pelean con el drag del swipe deck. */
        "max-lg:max-h-[min(100svh,100%)] max-lg:overflow-hidden",
      ].join(" ")}
    >
      <AppHeader showBrand subtitle={headerSubtitle} />

      <FilterBar
        selected={filters}
        onOpenSheet={() => setSheetOpen(true)}
        onRemove={(slug) => setFilters((f) => f.filter((s) => s !== slug))}
      />

      <div
        className={[
          "flex flex-col flex-1 min-h-0 min-w-0 w-full mx-auto lg:max-w-xl lg:w-full",
          "pt-3 sm:pt-4 px-2.5 sm:px-4 lg:px-6",
          /* Air debajo solo en desktop donde los CTA están en flujo normal */
          "pb-2 lg:pb-2",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex-1 min-h-0 min-w-full w-full overflow-visible",
            /* Ocupa sólo lo que queda tras header/filters: el alto lo da flex, sin min-h gigante */
            "min-h-[10rem]",
            /* Hueco bajo el deck: isla flotante de CTAs en móvil (menos alto que la banda ancha). */
            "max-lg:pb-[4.5rem]",
            "lg:min-h-[min(36rem,calc(100svh-14rem))]",
          ].join(" ")}
        >
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

        {/*
          Móvil: isla flotante tipo “Dynamic Island” (blur, sin barra ancha) sobre el deck.
          Desktop: banda con gradiente como antes.
        */}
        <div
          className={[
            "-mx-2.5 sm:-mx-4 lg:mx-0 lg:max-w-xl lg:w-full lg:self-center",
            "lg:relative lg:z-10 lg:mt-3 lg:flex lg:shrink-0 lg:justify-center",
            "lg:bg-gradient-to-t lg:from-background lg:via-background/[0.97] lg:to-transparent",
            "lg:pt-4 lg:pb-safe lg:pointer-events-auto",
            /* Móvil: posición fija, ancho al contenido, sin strip full-bleed */
            "max-lg:pointer-events-none max-lg:fixed max-lg:left-1/2 max-lg:z-[38] max-lg:w-max max-lg:-translate-x-1/2",
            "max-lg:max-w-[min(100vw-1rem,26rem)]",
            "max-lg:bottom-[calc(env(safe-area-inset-bottom)+4.5rem)]",
          ].join(" ")}
        >
          <div
            className={[
              "lg:contents max-lg:pointer-events-auto",
              /* Capsula estilo isla sobre el contenido del feed */
              "max-lg:flex max-lg:items-center max-lg:justify-center",
              "max-lg:rounded-[2.25rem] max-lg:border max-lg:border-border/50 max-lg:px-2 max-lg:py-1",
              "max-lg:bg-background/52 max-lg:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.28)]",
              "max-lg:backdrop-blur-2xl max-lg:backdrop-saturate-150",
              "max-lg:ring-1 max-lg:ring-black/[0.05]",
              "dark:max-lg:bg-background/38 dark:max-lg:border-border/35 dark:max-lg:ring-white/[0.08]",
              "dark:max-lg:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.55)]",
            ].join(" ")}
          >
            <SwipeActions
              compact={feedIslandLayout}
              disabled={isEmpty}
              onRewind={history.length > 0 ? rewind : undefined}
              onPass={() => commit("pass")}
              onSuper={() => commit("super")}
              onMatch={() => commit("match")}
            />
          </div>
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
