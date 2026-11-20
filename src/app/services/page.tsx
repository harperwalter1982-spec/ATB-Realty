import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/realty-site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore home buying, property sales, property management, and agent opportunities with Around the Block Realty in Colorado Springs.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
