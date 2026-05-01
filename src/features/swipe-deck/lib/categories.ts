export type Category = {
  slug: string;
  label: string;
};

export type CategoryGroup = {
  label: string;
  items: Category[];
};

export const categoryGroups: CategoryGroup[] = [
  {
    label: "Oficios",
    items: [
      { slug: "plomeria", label: "Plomería" },
      { slug: "gasista", label: "Gasista" },
      { slug: "electricidad", label: "Electricidad" },
      { slug: "mecanica-auto", label: "Mecánico auto" },
      { slug: "mecanica-moto", label: "Mecánico moto" },
      { slug: "cerrajeria", label: "Cerrajería" },
      { slug: "pintura", label: "Pintura" },
      { slug: "carpinteria", label: "Carpintería" },
      { slug: "albaniileria", label: "Albañilería" },
    ],
  },
  {
    label: "Hogar y mascotas",
    items: [
      { slug: "limpieza", label: "Limpieza" },
      { slug: "ninera", label: "Niñera/o" },
      { slug: "paseo-perros", label: "Paseo de perros" },
      { slug: "veterinaria", label: "Veterinaria a domicilio" },
      { slug: "jardineria", label: "Jardinería" },
      { slug: "mudanzas", label: "Mudanzas / fletes" },
    ],
  },
  {
    label: "Profesional",
    items: [
      { slug: "ventas", label: "Asesor de ventas" },
      { slug: "marketing", label: "Marketing" },
      { slug: "diseno", label: "Diseño" },
      { slug: "dev", label: "Desarrollo de software" },
      { slug: "contabilidad", label: "Contabilidad" },
      { slug: "legal", label: "Legal" },
      { slug: "fotografia", label: "Fotografía" },
    ],
  },
  {
    label: "Educación",
    items: [
      { slug: "clases-particulares", label: "Clases particulares" },
      { slug: "ingles", label: "Inglés" },
      { slug: "musica", label: "Música" },
    ],
  },
];

export const allCategories: Category[] = categoryGroups.flatMap((g) => g.items);

const categoryMap = new Map(allCategories.map((c) => [c.slug, c]));

export function getCategoryLabel(slug: string): string {
  return categoryMap.get(slug)?.label ?? slug;
}
