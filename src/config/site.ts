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
