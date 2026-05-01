import type { Metadata } from "next";
import { DiscoverScreen } from "@/features/swipe-deck";

export const metadata: Metadata = {
  title: "Descubrir",
};

export default function DiscoverPage() {
  return <DiscoverScreen />;
}
