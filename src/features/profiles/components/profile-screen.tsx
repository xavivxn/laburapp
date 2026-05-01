"use client";

import { LogOut, Briefcase, ChevronRight } from "lucide-react";
import { AppHeader } from "@/shared/components/layout/app-header";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Rating } from "@/shared/components/ui/rating";
import { useRoleStore } from "@/shared/stores/role-store";
import { useTheme } from "@/shared/hooks/use-theme";

export function ProfileScreen() {
  const role = useRoleStore((s) => s.role);
  const { resolvedTheme } = useTheme();

  return (
    <>
      <AppHeader title="Perfil" showRoleSwitcher={false} />

      <div className="px-4 sm:px-6 py-4 mx-auto w-full max-w-2xl space-y-4">
        <Card className="p-5 flex items-center gap-4">
          <Avatar
            size={72}
            fallback="Iván Xavier"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold truncate">Iván Xavier</h2>
            <p className="text-sm text-muted truncate">ivanxavi4@gmail.com</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Rating value={4.9} count={42} />
              <Badge tone="primary">
                <Briefcase className="h-3 w-3" />
                {role === "employer" ? "Empleador" : "Profesional"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="divide-y divide-border">
          <Row label="Editar perfil" />
          <Row label="Mis trabajos" />
          <Row label="Reseñas recibidas" />
          <Row label="Métodos de pago" />
        </Card>

        <Card className="divide-y divide-border">
          <Row label="Notificaciones" />
          <Row label="Privacidad" />
          <Row label={`Tema: ${resolvedTheme === "dark" ? "Oscuro" : "Claro"}`} />
          <Row label="Idioma" trailing={<span className="text-sm text-muted">Español</span>} />
        </Card>

        <Card className="divide-y divide-border">
          <Row label="Centro de ayuda" />
          <Row label="Términos y privacidad" />
        </Card>

        <Button
          variant="outline"
          fullWidth
          size="lg"
          className="text-danger border-danger/50 hover:bg-danger/10"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>

        <p className="text-center text-xs text-muted pt-2">Laburapp · v0.1.0 (dummy)</p>
      </div>
    </>
  );
}

function Row({
  label,
  trailing,
}: {
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-surface-elevated transition-colors min-h-12"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="flex items-center gap-2 text-muted">
        {trailing}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </span>
    </button>
  );
}
