import type { Metadata } from "next";
import { AgentsPageContent } from "@/components/realty-site";

export const metadata: Metadata = {
  title: "For Agents",
  description:
    "Explore agent opportunities with Around the Block Realty, an independent local brokerage in Colorado Springs.",
};

export default function AgentsPage() {
  return <AgentsPageContent />;
}
