"use client";

import { Heart } from "lucide-react";
import { AppHeader } from "@/shared/components/layout/app-header";
import { Avatar } from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { mockProfiles } from "@/features/swipe-deck/lib/mock";

export function MatchesScreen() {
  const matches = mockProfiles.slice(0, 3);

  return (
    <>
      <AppHeader title="Matches" showRoleSwitcher={false} />

      <div className="px-4 sm:px-6 py-4 mx-auto w-full max-w-2xl">
        {matches.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {matches.map((m) => (
              <li key={m.id}>
                <Card className="flex items-center gap-3 p-3 cursor-pointer hover:bg-surface-elevated transition-colors">
                  <Avatar src={m.photoUrl} alt={m.name} size={56} fallback={m.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <p className="text-sm text-muted truncate">{m.headline}</p>
                  </div>
                  <Heart className="h-5 w-5 text-accent fill-accent" aria-hidden />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-accent/15 text-accent">
        <Heart className="h-8 w-8" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-bold">Todavía no tenés matches</h2>
      <p className="mt-1 text-sm text-muted">
        Seguí descubriendo perfiles para hacer tu primer match.
      </p>
    </div>
  );
}
