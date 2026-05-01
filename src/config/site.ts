/**
 * Avatar del usuario demo (`public/avatars/ivan-xavier.png`).
 * `?v=…` fuerza nueva descarga cuando reemplaces el archivo (evita caché del navegador).
 * Si seguís viendo la foto vieja: guardá tu PNG encima de esa ruta y subí este número en el query.
 */
export const demoUserPhotoUrl =
  "/avatars/ivan-xavier.png?v=20260201-caminito" as const;

/** Encuade de foto en Discover (SwipeCard, `bg-cover`). */
export type FeedPhotoFrameConfig = {
  /** CSS `background-position` (ej. `center top`, `center 18%`). */
  backgroundPosition: string;
  /** Negativo sube la capa; positivo la baja (px). */
  translateYPx: number;
};

/**
 * Encuade por **id de perfil** en el feed. Editá acá las posiciones sin tocar el mock.
 * Si un perfil no está en el mapa, SwipeCard usa el layout responsive por defecto.
 *
 * Precedencia al renderizar: campos en `Profile` (`photoBackgroundPosition` /
 * `photoFrameTranslateYPx`) pisan lo definido acá.
 */
export const feedPhotoFrameByProfileId: Partial<
  Record<string, FeedPhotoFrameConfig>
> = {
  "p-ivan": {
    backgroundPosition: "center top",
    translateYPx: -250,
  },
  "p-ciro": {
    backgroundPosition: "center center",
    translateYPx: -30,
  },
};

export const siteConfig = {
  name: "Laburapp",
  shortName: "Laburapp",
  description:
    "Encontrá tu próximo laburo o el profesional ideal. Match laboral en segundos.",
  url: "https://laburapp.vercel.app",
  themeColor: {
    light: "#ffffff",
    dark: "#0a0a0f",
  },
} as const;

export type SiteConfig = typeof siteConfig;
