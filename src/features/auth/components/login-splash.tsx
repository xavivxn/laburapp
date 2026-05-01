"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ClipboardList,
  Coffee,
  Cpu,
  HardHat,
  Hammer,
  Laptop,
  Monitor,
  PencilRuler,
  Printer,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { siteConfig } from "@/config/site";

const KNOB_W = 56;
/** Parte derecha del carril que cuenta como mini “match”. */
const MATCH_FRAC = 0.82;

/** Iconos mini que vuelan desde el logo al tocarlo (oficina + obra + digital). */
const TOOL_ICONS: LucideIcon[] = [
  Laptop,
  Monitor,
  Cpu,
  Smartphone,
  Printer,
  Wrench,
  Hammer,
  HardHat,
  PencilRuler,
  ClipboardList,
  Coffee,
];

type LogoBurst =
  | { id: number; rotation: number; distance: number; kind: "spark" }
  | {
      id: number;
      rotation: number;
      distance: number;
      kind: "tool";
      Icon: LucideIcon;
    };

export function LoginSplashOverlay({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const completeRef = useRef(false);

  const pulse = useCallback(() => {
    try {
      navigator.vibrate?.(12);
    } catch {
      /* noop */
    }
  }, []);

  const finishOnce = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    onComplete();
  }, [onComplete]);

  /** Micro “carga antes del corte” solo en la franja del swipe (post-match). */
  const swipeStripControls = useAnimationControls();
  const [stripInteractionLocked, setStripInteractionLocked] = useState(false);

  const playSwipeStripPulse = useCallback(async () => {
    if (reduce) {
      finishOnce();
      return;
    }
    try {
      await swipeStripControls.start({
        scale: [1, 1.026, 0.986, 1.019, 0.991, 1],
        x: [0, -3.2, 2.6, -1.9, 1.4, -0.6, 0],
        rotate: [0, -1.55, 1.45, -0.75, 0],
        transition: {
          duration: 0.36,
          ease: [0.24, 0.93, 0.34, 1],
        },
      });
    } finally {
      finishOnce();
    }
  }, [finishOnce, reduce, swipeStripControls]);

  const [bursts, setBursts] = useState<LogoBurst[]>([]);

  const trackRef = useRef<HTMLDivElement>(null);
  const trackW = useRef(260);
  const knobX = useMotionValue(0);
  const matchProgress = useTransform(knobX, (px) => {
    const max = Math.max(1, trackW.current - KNOB_W - 10);
    return Math.min(1, Math.max(0, px / max));
  });
  const trackGlowLeft = useTransform(
    matchProgress,
    [0, MATCH_FRAC, 1],
    ["rgba(79,70,229,0.16)", "rgba(132,204,22,0.34)", "rgba(132,204,22,0.52)"],
  );
  const trackBg =
    useMotionTemplate`linear-gradient(to right, ${trackGlowLeft}, transparent)`;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      trackW.current = el.clientWidth || 260;
    });
    ro.observe(el);
    trackW.current = el.clientWidth || 260;
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) finishOnce();
  }, [reduce, finishOnce]);

  const onLogoTap = () => {
    pulse();
    const batch: LogoBurst[] = [];
    const n = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i += 1) {
      const rotation = Math.random() * 360;
      const id = Date.now() + Math.random() + i * 0.001;
      const isSpark = Math.random() < 0.32;
      if (isSpark) {
        batch.push({
          id,
          rotation,
          distance: 64 + Math.random() * 28,
          kind: "spark",
        });
      } else {
        batch.push({
          id,
          rotation,
          distance: 70 + Math.random() * 36,
          kind: "tool",
          Icon: TOOL_ICONS[Math.floor(Math.random() * TOOL_ICONS.length)]!,
        });
      }
    }
    setBursts((prev) => [...prev.slice(-26), ...batch]);
  };

  const onKnobDragEnd = () => {
    if (stripInteractionLocked) return;
    const maxTravel = Math.max(0, trackW.current - KNOB_W - 8);
    const at = knobX.get();
    const matched = maxTravel > 8 && at / maxTravel >= MATCH_FRAC;
    if (matched) {
      setStripInteractionLocked(true);
      try {
        navigator.vibrate?.([6, 16, 5, 16, 4, 12, 3]);
      } catch {
        /* noop */
      }
      void playSwipeStripPulse();
      return;
    }
    knobX.set(0);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={`${titleId}-hint ${titleId}-gesto`}
      className={cn(
        "fixed inset-0 z-[200] overflow-hidden px-5 pb-safe pt-safe",
        "flex flex-col items-center justify-center text-center",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        className={cn(
          "fixed left-4 z-[310] max-w-[18rem] outline-none transition-transform",
          "top-[max(calc(env(safe-area-inset-top)+0.5rem),1rem)]",
          "-translate-y-[200vh] rounded-xl border border-border bg-background px-3 py-2 text-left text-sm font-semibold shadow-xl",
          "focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        )}
        onClick={finishOnce}
      >
        Omitir bienvenida (si no podés usar el gesto)
      </button>

      <div
        aria-hidden
        className={cn(
          "pointer-events-auto absolute inset-0 z-0",
          "bg-background/78 backdrop-blur-2xl",
        )}
      />

      {/* Bruma índigo → lima que se mueve muy despacio (no compite con el contenido). */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute inset-[-12%] bg-gradient-to-br from-primary/[0.26] via-background/12 to-accent/[0.3]"
          initial={false}
          animate={
            reduce
              ? { opacity: 0.72, x: 0, y: 0, scale: 1 }
              : {
                  opacity: [0.54, 0.82, 0.62, 0.78, 0.54],
                  x: [0, 12, -8, 6, 0],
                  y: [0, -10, 6, -4, 0],
                  scale: [1, 1.035, 0.99, 1.02, 1],
                }
          }
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tl from-transparent via-accent/[0.18] to-transparent"
          initial={false}
          animate={
            reduce
              ? { opacity: 0.48, rotate: 0 }
              : {
                  opacity: [0.4, 0.62, 0.46, 0.58, 0.4],
                  rotate: [0, 3, -2, 1, 0],
                }
          }
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute -left-1/4 top-1/4 h-[min(70vw,22rem)] w-[min(70vw,22rem)] rounded-full bg-primary/42 blur-3xl"
          animate={
            reduce
              ? { x: 0, y: 0, scale: 1, opacity: 0.38 }
              : {
                  x: [0, 18, -10, 0],
                  y: [0, -12, 8, 0],
                  scale: [1, 1.06, 0.97, 1],
                  opacity: [0.34, 0.48, 0.38, 0.44, 0.34],
                }
          }
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-1/4 h-[min(65vw,20rem)] w-[min(65vw,20rem)] rounded-full bg-accent/38 blur-3xl"
          animate={
            reduce
              ? { x: 0, y: 0, scale: 1, opacity: 0.34 }
              : {
                  x: [0, -16, 12, 0],
                  y: [0, 14, -6, 0],
                  scale: [1, 1.05, 1.04, 1],
                  opacity: [0.28, 0.44, 0.34, 0.42, 0.28],
                }
          }
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div
        className="relative z-10 flex max-w-sm flex-col items-center gap-6 pointer-events-none"
      >
        <motion.div
          className="pointer-events-auto flex flex-col items-center gap-2"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 22 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/12 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            Hecho para Paraguay
          </span>
          <h2
            id={titleId}
            className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {siteConfig.name}
          </h2>
          <p
            id={`${titleId}-hint`}
            className="max-w-[32ch] text-balance text-sm leading-relaxed text-muted sm:text-base"
          >
            Laburapp es el match laboral en swipe: ofertas o personas, sin mil formularios.
            Cuando pinta, charlás y seguís. Pensado para vos en Paraguay.
          </p>
          <p id={`${titleId}-gesto`} className="sr-only">
            Para el ingreso, arrastrá el control verde a la derecha hasta el final. El
            maletín es solo decoración.
          </p>
          <p
            className="max-w-[32ch] text-balance text-xs leading-relaxed text-muted sm:text-sm"
            aria-hidden
          >
            Abajo, deslizá el verde como en Discover. El logo es puro juego visual.
          </p>
        </motion.div>

        <div className="relative pointer-events-auto">
          <motion.button
            type="button"
            className={cn(
              "relative grid h-24 w-24 place-items-center rounded-3xl",
              "bg-primary text-primary-foreground shadow-[0_18px_48px_-10px_rgba(79,70,229,0.62)]",
              "ring-2 ring-accent/45 ring-offset-4 ring-offset-background/70",
              "touch-manipulation active:scale-[0.96]",
            )}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            onClick={onLogoTap}
            aria-label="Tocá para chispitas e iconitos de trabajo"
          >
            <Briefcase className="h-11 w-11" aria-hidden />
          </motion.button>

          <AnimatePresence>
            {bursts.map((b) => {
              const rad = (b.rotation * Math.PI) / 180;
              const tx = Math.cos(rad) * b.distance;
              const ty = Math.sin(rad) * b.distance;

              if (b.kind === "spark") {
                return (
                  <motion.span
                    key={b.id}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_rgba(132,204,22,1),0_0_28px_rgba(132,204,22,0.45)]"
                    initial={{ scale: 0.2, opacity: 1, x: 0, y: 0 }}
                    animate={{
                      scale: [0.2, 1, 0.55],
                      opacity: [1, 1, 0],
                      x: tx,
                      y: ty,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              }

              const ToolIcon = b.Icon;
              return (
                <motion.div
                  key={b.id}
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "grid h-8 w-8 place-items-center rounded-lg",
                    "border border-primary/35 bg-background/92 text-primary shadow-[0_8px_24px_-8px_rgba(79,70,229,0.35)] backdrop-blur-md",
                  )}
                  initial={{ scale: 0.25, opacity: 1, x: 0, y: 0, rotate: -18 }}
                  animate={{
                    scale: [0.25, 1, 0.85],
                    opacity: [1, 1, 0],
                    x: tx,
                    y: ty,
                    rotate: [0, 14, -10, 22],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ToolIcon
                    className="h-4 w-4"
                    strokeWidth={2.2}
                    aria-hidden
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          className="w-full max-w-[17.5rem] pointer-events-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
        >
          <motion.div
            className="space-y-2 will-change-transform"
            animate={swipeStripControls}
            initial={false}
            style={{ transformOrigin: "50% 88%" }}
          >
            <p className="text-xs font-semibold text-foreground">
              Hasta el final para ingresar →
            </p>
            <div
              ref={trackRef}
              className="relative z-[1] h-14 w-full rounded-full border border-primary/25 bg-surface-elevated/95 p-1 shadow-inner shadow-primary/10 backdrop-blur-sm"
            >
            <motion.div
              className="pointer-events-none absolute inset-y-1 left-1 right-1 rounded-full"
              style={{ backgroundImage: trackBg }}
            />

            <motion.div
              drag={stripInteractionLocked ? false : "x"}
              dragConstraints={trackRef}
              dragElastic={0.06}
              dragMomentum={false}
              style={{ x: knobX, width: KNOB_W }}
              onDragEnd={onKnobDragEnd}
              className={cn(
                "absolute left-1 top-1 z-[1] flex h-12 cursor-grab items-center justify-center rounded-full touch-manipulation",
                "bg-accent text-accent-foreground shadow-[0_6px_22px_-4px_rgba(132,204,22,0.55)] active:cursor-grabbing",
              )}
              whileDrag={{ scale: 1.06 }}
              aria-describedby={`${titleId}-gesto`}
              aria-label="Arrastrá a la derecha para abrir el ingreso con email o redes"
            >
              <span className="select-none text-lg leading-none" aria-hidden>
                →
              </span>
            </motion.div>
          </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
