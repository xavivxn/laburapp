import type { Metadata } from "next";
import { LoginScreen } from "@/features/auth";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return <LoginScreen />;
}
