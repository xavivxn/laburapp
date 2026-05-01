import type { Metadata } from "next";
import { MessagesScreen } from "@/features/messaging";

export const metadata: Metadata = {
  title: "Mensajes",
};

export default function MessagesPage() {
  return <MessagesScreen />;
}
