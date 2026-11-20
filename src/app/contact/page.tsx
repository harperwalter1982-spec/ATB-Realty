import type { Metadata } from "next";
import { ContactPageContent } from "@/components/realty-site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mike Morris at Around the Block Realty in Colorado Springs by phone or email.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
