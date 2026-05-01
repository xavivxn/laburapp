import type { LucideIcon } from "lucide-react";
import { Compass, Heart, MessageCircle, User } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { href: "/discover", label: "Descubrir", icon: Compass },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/messages", label: "Mensajes", icon: MessageCircle },
  { href: "/profile", label: "Perfil", icon: User },
];
