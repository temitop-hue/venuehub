import React from "react";
import { Contact2 } from "lucide-react";
import { ComingSoonPage } from "./ComingSoonPage";

export function GuestsPage() {
  return (
    <ComingSoonPage
      title="Guests & RSVP"
      description="Shareable RSVP pages, guest lists per event, and QR code check-in. Track acceptances, meal preferences, and seating — all tied to a specific booking."
      Icon={Contact2}
    />
  );
}
