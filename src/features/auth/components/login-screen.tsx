"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Mail, Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { siteConfig } from "@/config/site";

export function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO(supabase): replace with real signInWithPassword.
    setLoading(true);
    setTimeout(() => router.push("/discover"), 400);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background pt-safe pb-safe">
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Briefcase className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {siteConfig.name}
            </h1>
            <p className="text-sm text-muted max-w-[28ch]">
              Encontrá tu próximo match laboral. Trabajos y profesionales cerca tuyo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none"
                  aria-hidden
                />
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="tu@email.com"
                  className="pl-11"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Contraseña</span>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none"
                  aria-hidden
                />
                <Input
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Contraseña"
                  className="pl-11"
                />
              </div>
            </label>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted">o continuá con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" size="lg">
                Google
              </Button>
              <Button type="button" variant="outline" size="lg">
                Apple
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => router.push("/discover")}
              >
                Registrate
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
