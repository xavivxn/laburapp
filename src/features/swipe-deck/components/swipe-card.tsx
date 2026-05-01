"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { BadgeCheck, Mail, MapPin, MessageCircle, Star } from "lucide-react";
import { feedPhotoFrameByProfileId } from "@/config/site";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/cn";
import type { Profile, SwipeAction } from "../types";

const SWIPE_X_THRESHOLD = 120;
const SWIPE_Y_THRESHOLD = 100;

interface SwipeCardProps {
  profile: Profile;
  active: boolean;
  stackIndex: number;
  onCommit: (action: SwipeAction) => void;
}

function stopDragFromScrollPanel(e: React.PointerEvent) {
  e.stopPropagation();
}

export function SwipeCard({
  profile,
  active,
  stackIndex,
  onCommit,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const passOpacity = useTransform(x, [-160, -40, 0], [1, 0, 0]);
  const matchOpacity = useTransform(x, [0, 40, 160], [0, 0, 1]);
  const superOpacity = useTransform(y, [-160, -40, 0], [1, 0, 0]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;
    if (
      offset.y < -SWIPE_Y_THRESHOLD ||
      velocity.y < -840
    ) {
      onCommit("super");
      return;
    }
    if (
      offset.x > SWIPE_X_THRESHOLD ||
      velocity.x > 740
    ) {
      onCommit("match");
      return;
    }
    if (offset.x < -SWIPE_X_THRESHOLD || velocity.x < -740) {
      onCommit("pass");
      return;
    }
  };

  const formatRate = () => {
    if (!profile.hourlyRate) return null;
    if (profile.currency === "USD")
      return `USD ${profile.hourlyRate}/h`;
    return `$${profile.hourlyRate.toLocaleString("es-AR")}/h`;
  };

  const whatsappDigits =
    profile.contactWhatsappDigits?.replace(/\D/g, "").trim() ?? "";
  const waHref =
    whatsappDigits.length > 0 ? `https://wa.me/${whatsappDigits}` : null;

  const hasContact =
    Boolean(waHref) || Boolean(profile.contactEmail?.trim());

  const frameFromConfig = feedPhotoFrameByProfileId[profile.id];
  const photoPosition =
    profile.photoBackgroundPosition ??
    profile.photoFocus ??
    frameFromConfig?.backgroundPosition;
  const compactDetail = Boolean(profile.compactDetailPanel);
  const photoTy =
    typeof profile.photoFrameTranslateYPx === "number"
      ? profile.photoFrameTranslateYPx
      : frameFromConfig?.translateYPx;

  return (
    <motion.article
      drag={active}
      dragDirectionLock
      dragElastic={0.45}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, zIndex: 10 - stackIndex }}
      animate={{
        scale: active ? 1 : 1 - stackIndex * 0.04,
        y: active ? 0 : stackIndex * 8,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "absolute inset-0 rounded-3xl overflow-hidden isolate",
        "bg-surface-elevated shadow-lg select-none touch-none",
        active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
      aria-label={`Perfil de ${profile.name}`}
    >
      {/* Fondo: foto en todo el card (cover + punto focal estable en diferentes ratios) */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className={cn(
            "absolute inset-0 bg-cover",
            !photoPosition &&
              "bg-center sm:bg-[center_top] landscape:bg-center max-lg:landscape:bg-[center_20%]",
          )}
          style={{
            backgroundImage: `url(${profile.photoUrl})`,
            ...(photoPosition ? { backgroundPosition: photoPosition } : {}),
            ...(typeof photoTy === "number" && photoTy !== 0
              ? { transform: `translateY(${photoTy}px)` }
              : {}),
          }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t to-transparent",
            compactDetail
              ? "from-black/70 via-black/24 via-[28%]"
              : "from-black/92 via-black/38 via-[35%]",
          )}
        />
      </div>

      <SwipeOverlay opacity={passOpacity} label="PASO" tone="danger" position="left" />
      <SwipeOverlay opacity={matchOpacity} label="MATCH" tone="accent" position="right" />
      <SwipeOverlay opacity={superOpacity} label="SUPER" tone="primary" position="top" />

      {profile.online && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white z-[1]">
          <span className="h-2 w-2 rounded-full bg-success" />
          En línea
        </div>
      )}

      {/*
       * Panel inferior: altura adaptable (dvh / % / orientación).
       * Deja gran parte del card solo para la foto; el contenido pesado corre en scroll.
       */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[1] flex flex-col",
          "rounded-t-[1.75rem]",
          "bg-black/50 backdrop-blur-xl border-t border-white/12",
          "shadow-[0_-16px_40px_rgba(0,0,0,0.45)]",
          compactDetail ? "min-h-[6.5rem]" : "min-h-[7.5rem]",
          compactDetail
            ? [
                "max-h-[min(39dvh,44%,17.25rem)]",
                "max-lg:landscape:max-h-[min(34dvh,40%,13.75rem)]",
                "lg:max-h-[min(36dvh,40%,17rem)]",
              ]
            : [
                "max-h-[min(52dvh,54%,22rem)]",
                "max-lg:landscape:max-h-[min(44dvh,48%,17rem)]",
                "lg:max-h-[min(45dvh,48%,21rem)]",
              ],
        )}
      >
        <div
          aria-hidden
          className={cn(
            "mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-white/35",
            "lg:hidden shrink-0",
          )}
        />

        <div className="px-5 pt-2 pb-3 shrink-0 pointer-events-none">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {profile.name}
              {profile.age ? (
                <span className="font-normal text-white/90">, {profile.age}</span>
              ) : null}
            </h2>
            {profile.verified && (
              <BadgeCheck className="h-5 w-5 text-info shrink-0" aria-label="Verificado" />
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">{profile.headline}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/82">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden />
              {profile.location}
              {profile.distanceKm > 0 && (
                <span className="text-white/58"> · {profile.distanceKm} km</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-warning text-warning shrink-0"
                aria-hidden
              />
              <span className="font-semibold">{profile.rating.toFixed(1)}</span>
              <span className="text-white/58">({profile.reviews})</span>
            </span>
          </div>
        </div>

        <div
          role="region"
          aria-label="Detalle del perfil"
          className={cn(
            "flex-1 min-h-0 min-h-[5.5rem] overflow-y-auto overscroll-y-contain",
            "px-5 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))]",
            "[scrollbar-color:rgba(255,255,255,0.28)_transparent]",
            active && "pointer-events-auto touch-pan-y",
          )}
          style={{ touchAction: active ? "pan-y" : undefined }}
          onPointerDown={active ? stopDragFromScrollPanel : undefined}
        >
          <p className="text-sm text-white/88 leading-relaxed">{profile.bio}</p>

          {formatRate() && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/14 backdrop-blur-md px-3 py-1.5 text-sm font-semibold">
              {formatRate()}
            </div>
          )}

          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/58">
            Habilidades
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                tone="neutral"
                className="bg-white/12 text-white border border-white/10 backdrop-blur-sm max-w-[100%]"
              >
                <span className="break-words text-left">{skill}</span>
              </Badge>
            ))}
          </div>

          {hasContact && (
            <div className="mt-6 space-y-3 border-t border-white/15 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/58">
                Contacto directo
              </h3>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex w-full min-h-11 items-center justify-center gap-2 rounded-full px-4",
                    "bg-success font-semibold text-white shadow-sm",
                    "transition-opacity hover:opacity-95 active:scale-[0.98]",
                    "touch-manipulation outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/60",
                  )}
                >
                  <MessageCircle className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
                  Chateá por WhatsApp
                </a>
              )}
              {profile.contactEmail && (
                <a
                  href={`mailto:${encodeURIComponent(profile.contactEmail)}`}
                  className={cn(
                    "flex min-h-11 flex-wrap items-center gap-2 rounded-2xl border border-white/18 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/95 backdrop-blur-sm",
                    "transition-colors hover:bg-white/12 hover:border-white/25",
                    "touch-manipulation outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/50 break-all",
                  )}
                >
                  <Mail className="h-4 w-4 shrink-0 text-white/85" aria-hidden />
                  <span className="min-w-0">
                    <span className="mr-2 text-xs font-normal uppercase tracking-wide text-white/55">
                      Mail personal
                    </span>
                    {profile.contactEmail}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function SwipeOverlay({
  opacity,
  label,
  tone,
  position,
}: {
  opacity: MotionValue<number>;
  label: string;
  tone: "danger" | "accent" | "primary";
  position: "left" | "right" | "top";
}) {
  const toneClass =
    tone === "danger"
      ? "border-danger text-danger"
      : tone === "accent"
        ? "border-accent text-accent"
        : "border-primary text-primary";
  const positionClass =
    position === "left"
      ? "top-10 left-6 -rotate-12"
      : position === "right"
        ? "top-10 right-6 rotate-12"
        : "top-6 left-1/2 -translate-x-1/2";

  return (
    <motion.div
      style={{ opacity }}
      className={cn(
        "absolute pointer-events-none z-[2] rounded-2xl border-4 px-4 py-1.5 text-2xl font-extrabold tracking-widest backdrop-blur-sm bg-background/30",
        toneClass,
        positionClass,
      )}
      aria-hidden
    >
      {label}
    </motion.div>
  );
}
