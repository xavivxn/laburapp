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
        /* overflow-visible: no recortar sombras del panel ni velos sobre la foto; el recorte lo hace la capa foto. */
        "absolute inset-0 isolate overflow-visible rounded-[1.875rem]",
        "max-lg:rounded-[clamp(1.25rem,4.2vw,1.95rem)]",
        "shadow-[0_22px_55px_-14px_rgba(0,0,0,0.42)] dark:shadow-[0_22px_55px_-14px_rgba(0,0,0,0.5)]",
        "ring-1 ring-border bg-background/95 dark:bg-black/55 dark:ring-white/10",
        "select-none touch-none",
        active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
      aria-label={`Perfil de ${profile.name}`}
    >
      {/* Foto: `<img>` + object-cover se adapta mejor entre ratios · iPhone/Android largos */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
        <div
          className="absolute inset-0 rounded-[inherit] [overflow-anchor:auto]"
          style={{
            transform:
              typeof photoTy === "number" && photoTy !== 0
                ? `translate3d(0, ${photoTy}px, 0)`
                : undefined,
            willChange: typeof photoTy === "number" && photoTy !== 0 ? "transform" : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- URL dinámica mock / storage; mismo patrón que Avatar */}
          <img
            src={profile.photoUrl}
            alt=""
            decoding={active ? "sync" : "async"}
            fetchPriority={active ? "high" : "low"}
            draggable={false}
            sizes="(max-width: 1024px) 92vw, 28rem"
            className={cn(
              "pointer-events-none h-full min-h-[100.5%] w-full object-cover [-webkit-touch-callout:none]",
              !photoPosition &&
                "object-[center_38%]",
              !photoPosition &&
                "max-[390px]:object-[center_36%]",
              !photoPosition &&
                "max-lg:object-[center_38%]",
              !photoPosition &&
                "min-[412px]:max-lg:object-[center_40%]",
              !photoPosition &&
                "max-lg:landscape:object-[center_30%]",
            )}
            style={photoPosition ? { objectPosition: photoPosition } : undefined}
          />
        </div>
        {/* Degradado en la mitad inferior: evita corte abrupto donde empieza el panel (viejo inset-0 + overflow del card lo recortaba). */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-[92%]",
            "bg-gradient-to-t to-transparent rounded-none",
            compactDetail
              ? [
                  "from-background/[0.93] via-background/25 via-[28%]",
                  "dark:from-black/[0.76] dark:via-black/[0.26] dark:via-[26%]",
                ]
              : [
                  "from-background/[0.94] via-background/28 via-[32%]",
                  "dark:from-black/[0.92] dark:via-black/[0.36] dark:via-[33%]",
                ],
          )}
        />
      </div>

      <SwipeOverlay opacity={passOpacity} label="PASO" tone="danger" position="left" />
      <SwipeOverlay opacity={matchOpacity} label="MATCH" tone="accent" position="right" />
      <SwipeOverlay opacity={superOpacity} label="SUPER" tone="primary" position="top" />

      {profile.online && (
        <div
          className={cn(
            "absolute top-4 right-4 z-[1] flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md",
            "border border-border bg-background/92 text-foreground shadow-sm",
            "dark:border-transparent dark:bg-black/45 dark:text-white",
          )}
        >
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
          "absolute inset-x-0 bottom-0 z-[1] flex flex-col overflow-visible",
          "rounded-t-[1.75rem]",
          "border-t border-border bg-background/97 backdrop-blur-xl",
          /* Sombra suave hacia adentro + ring; evita box-shadow negativa que el padre con overflow recortaba. */
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-black/[0.04]",
          "dark:border-white/12 dark:bg-black/50 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:ring-white/[0.07]",
          compactDetail ? "min-h-[6.5rem]" : "min-h-[7.5rem]",
          compactDetail
            ? [
                "max-h-[min(43svh,46%,17.85rem)]",
                "max-lg:landscape:max-h-[min(38svh,42%,14.25rem)]",
                "lg:max-h-[min(39svh,42%,17.75rem)]",
              ]
            : [
                "max-h-[min(54svh,56%,23.5rem)]",
                "max-lg:landscape:max-h-[min(46svh,50%,18rem)]",
                "lg:max-h-[min(47svh,50%,21.75rem)]",
              ],
        )}
      >
        <div
          aria-hidden
          className={cn(
            "mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-border dark:bg-white/35",
            "lg:hidden shrink-0",
          )}
        />

        <div className="px-5 pt-2 pb-3 shrink-0 pointer-events-none">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground drop-shadow-sm dark:text-white dark:drop-shadow-md">
              {profile.name}
              {profile.age ? (
                <span className="font-normal text-muted dark:text-white/90">, {profile.age}</span>
              ) : null}
            </h2>
            {profile.verified && (
              <BadgeCheck className="h-5 w-5 text-info shrink-0" aria-label="Verificado" />
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground/90 line-clamp-2 dark:text-white/90">
            {profile.headline}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted dark:text-white/82">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden />
              {profile.location}
              {profile.distanceKm > 0 && (
                <span className="text-muted/80 dark:text-white/58"> · {profile.distanceKm} km</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-warning text-warning shrink-0"
                aria-hidden
              />
              <span className="font-semibold text-foreground dark:text-white">
                {profile.rating.toFixed(1)}
              </span>
              <span className="text-muted/80 dark:text-white/58">({profile.reviews})</span>
            </span>
          </div>
        </div>

        <div
          role="region"
          aria-label="Detalle del perfil"
          className={cn(
            "flex-1 min-h-0 min-h-[5.5rem] overflow-y-auto overscroll-y-contain",
            "px-5 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))]",
            "[scrollbar-color:var(--border)_transparent]",
            "dark:[scrollbar-color:rgba(255,255,255,0.28)_transparent]",
            active && "pointer-events-auto touch-pan-x touch-pan-y",
          )}
          style={{ touchAction: active ? "pan-x pan-y" : undefined }}
          onPointerDown={active ? stopDragFromScrollPanel : undefined}
        >
          <p className="text-sm leading-relaxed text-foreground/90 dark:text-white/88">
            {profile.bio}
          </p>

          {formatRate() && (
            <div
              className={cn(
                "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold backdrop-blur-md",
                "border border-primary/20 bg-primary/10 text-primary",
                "dark:border-transparent dark:bg-white/14 dark:text-white",
              )}
            >
              {formatRate()}
            </div>
          )}

          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted dark:text-white/58">
            Habilidades
          </h3>
          <ul
            aria-label="Habilidades, deslizá horizontalmente para ver todas"
            className={cn(
              "mt-2 -mx-5 flex snap-x snap-proximity list-none gap-2 overflow-x-auto overflow-y-visible pl-5 pr-5",
              "overscroll-x-contain [-webkit-overflow-scrolling:touch]",
              "pb-1 [scrollbar-color:var(--border)_transparent]",
              "dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent]",
            )}
          >
            {profile.skills.map((skill) => (
              <li key={skill} className="shrink-0 snap-start py-px">
                <Badge
                  tone="neutral"
                  className={cn(
                    "min-h-[2.75rem] min-w-max max-w-[min(19rem,calc(100vw-8rem))] items-center justify-center",
                    "border border-border bg-surface text-foreground backdrop-blur-sm shadow-sm",
                    "dark:border-white/10 dark:bg-white/12 dark:text-white",
                    "px-3 py-2 text-left whitespace-normal align-middle leading-snug",
                  )}
                >
                  {skill}
                </Badge>
              </li>
            ))}
          </ul>

          {hasContact && (
            <div className="mt-6 space-y-3 border-t border-border pt-5 dark:border-white/15">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-white/58">
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
                    "touch-manipulation outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary",
                    "dark:ring-offset-transparent dark:focus-visible:ring-white/60",
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
                    "flex min-h-11 flex-wrap items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium backdrop-blur-sm",
                    "border-border bg-surface text-foreground",
                    "transition-colors hover:bg-surface-elevated",
                    "dark:border-white/18 dark:bg-white/8 dark:text-white/95 dark:hover:bg-white/12 dark:hover:border-white/25",
                    "touch-manipulation outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary break-all",
                    "dark:ring-offset-transparent dark:focus-visible:ring-white/50",
                  )}
                >
                  <Mail className="h-4 w-4 shrink-0 text-muted dark:text-white/85" aria-hidden />
                  <span className="min-w-0">
                    <span className="mr-2 text-xs font-normal uppercase tracking-wide text-muted dark:text-white/55">
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
        "absolute pointer-events-none z-[2] rounded-2xl border-4 px-4 py-1.5 text-2xl font-extrabold tracking-widest backdrop-blur-sm",
        "bg-background/75 dark:bg-background/30",
        toneClass,
        positionClass,
      )}
      aria-hidden
    >
      {label}
    </motion.div>
  );
}
