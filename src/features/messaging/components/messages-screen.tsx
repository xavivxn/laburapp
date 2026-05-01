"use client";

import { MessageCircle } from "lucide-react";
import { AppHeader } from "@/shared/components/layout/app-header";

export function MessagesScreen() {
  return (
    <>
      <AppHeader title="Mensajes" showRoleSwitcher={false} />
      <div className="px-4 sm:px-6 py-20 text-center mx-auto max-w-md">
        <div className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-primary/10 text-primary">
          <MessageCircle className="h-8 w-8" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-bold">Sin mensajes</h2>
        <p className="mt-1 text-sm text-muted">
          Cuando alguien te haga match, vas a poder chatear acá.
        </p>
      </div>
    </>
  );
}
