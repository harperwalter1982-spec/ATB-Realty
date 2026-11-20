import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/realty-site";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Around the Block Realty | Colorado Springs",
    template: "%s | Around the Block Realty",
  },
  description:
    "Local real estate guidance for buying, selling, and property management in Colorado Springs. Around the Block Realty is independent, veteran-owned, and family-operated.",
};

export const viewport: Viewport = {
  themeColor: "#1a3d36",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
