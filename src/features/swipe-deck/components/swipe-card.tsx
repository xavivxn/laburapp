"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/cn";
import type { Profile, SwipeAction } from "../types";

const SWIPE_X_THRESHOLD = 110;
const SWIPE_Y_THRESHOLD = 90;

interface SwipeCardProps {
  profile: Profile;
  active: boolean;
  stackIndex: number;
  onCommit: (action: SwipeAction) => void;
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
    if (offset.y < -SWIPE_Y_THRESHOLD || velocity.y < -700) {
      onCommit("super");
      return;
    }
    if (offset.x > SWIPE_X_THRESHOLD || velocity.x > 700) {
      onCommit("match");
      return;
    }
    if (offset.x < -SWIPE_X_THRESHOLD || velocity.x < -700) {
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

  return (
    <motion.article
      drag={active ? true : false}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, zIndex: 10 - stackIndex }}
      animate={{
        scale: active ? 1 : 1 - stackIndex * 0.04,
        y: active ? 0 : stackIndex * 8,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "absolute inset-0 rounded-3xl overflow-hidden",
        "bg-surface-elevated shadow-lg select-none touch-none",
        active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
      aria-label={`Perfil de ${profile.name}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.photoUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <SwipeOverlay opacity={passOpacity} label="PASO" tone="danger" position="left" />
      <SwipeOverlay opacity={matchOpacity} label="MATCH" tone="accent" position="right" />
      <SwipeOverlay opacity={superOpacity} label="SUPER" tone="primary" position="top" />

      {profile.online && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white">
          <span className="h-2 w-2 rounded-full bg-success" />
          En línea
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {profile.name}
            {profile.age ? <span className="font-normal">, {profile.age}</span> : null}
          </h2>
          {profile.verified && (
            <BadgeCheck className="h-5 w-5 text-info" aria-label="Verificado" />
          )}
        </div>
        <p className="text-base font-medium text-white/90">{profile.headline}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" aria-hidden />
            {profile.location}
            {profile.distanceKm > 0 && (
              <span className="text-white/60"> · {profile.distanceKm} km</span>
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" aria-hidden />
            <span className="font-semibold">{profile.rating.toFixed(1)}</span>
            <span className="text-white/60">({profile.reviews})</span>
          </span>
        </div>

        <p className="mt-3 text-sm text-white/85 line-clamp-2">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              tone="neutral"
              className="bg-white/15 text-white border border-white/10 backdrop-blur-sm"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {formatRate() && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-sm font-semibold">
            {formatRate()}
          </div>
        )}
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
        "absolute pointer-events-none rounded-2xl border-4 px-4 py-1.5 text-2xl font-extrabold tracking-widest backdrop-blur-sm bg-background/30",
        toneClass,
        positionClass,
      )}
      aria-hidden
    >
      {label}
    </motion.div>
  );
}
