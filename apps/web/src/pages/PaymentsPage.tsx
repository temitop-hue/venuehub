import React from "react";
import { CreditCard } from "lucide-react";
import { ComingSoonPage } from "./ComingSoonPage";

export function PaymentsPage() {
  return (
    <ComingSoonPage
      title="Payments"
      description="Connect Stripe to track deposits, milestone payments, and payouts. This view will show payment status for every booking, refund history, and your platform fees at a glance."
      Icon={CreditCard}
    />
  );
}
