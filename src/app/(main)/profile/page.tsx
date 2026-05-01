import type { Metadata } from "next";
import { ProfileScreen } from "@/features/profiles";

export const metadata: Metadata = {
  title: "Perfil",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
