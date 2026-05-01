export type SwipeAction = "pass" | "match" | "super";

export type Profile = {
  id: string;
  name: string;
  age?: number;
  headline: string;
  bio: string;
  location: string;
  distanceKm: number;
  hourlyRate?: number;
  currency?: "ARS" | "USD";
  rating: number;
  reviews: number;
  jobsCompleted?: number;
  skills: string[];
  categories: string[];
  photoUrl: string;
  /**
   * `background-position` con `bg-cover`. Si no va, ver `feedPhotoFrameByProfileId` en `config/site.ts`.
   * Si está definido, pisa el encuade global para este `id`.
   */
  photoBackgroundPosition?: string;
  /** @deprecated Usá `photoBackgroundPosition`. */
  photoFocus?: string;
  /** Corre la capa foto en px; si no va, usa el mapa global por `id` en `site.ts`. */
  photoFrameTranslateYPx?: number;
  /** Panel inferior más chico / gradiente más suave para no tapar la cara en fotos muy verticales. */
  compactDetailPanel?: boolean;
  /** WhatsApp solo dígitos, con código país (ej. Argentina `549XXXXXXXXXX`). Se usa para `wa.me`. */
  contactWhatsappDigits?: string;
  /** Correo personal mostrado bajo WhatsApp como `mailto:`. */
  contactEmail?: string;
  verified?: boolean;
  online?: boolean;
};
