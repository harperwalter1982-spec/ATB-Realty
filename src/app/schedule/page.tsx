import type { Metadata } from "next";
import { SchedulePageContent } from "@/components/realty-site";

export const metadata: Metadata = {
  title: "Schedule a Meeting",
  description:
    "Request a 30-minute conversation with Mike Morris about buying, selling, property management, or joining the team.",
};

export default function SchedulePage() {
  return <SchedulePageContent />;
}
