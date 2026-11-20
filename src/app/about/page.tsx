import type { Metadata } from "next";
import { AboutPageContent } from "@/components/realty-site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Mike Morris and learn about Around the Block Realty, an independent, veteran-owned, family-operated Colorado Springs brokerage.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
