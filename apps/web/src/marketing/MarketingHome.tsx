import React, { useEffect } from "react";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { TrustBar } from "./sections/TrustBar";
import { ProblemSolution } from "./sections/ProblemSolution";
import { ProductDemo } from "./sections/ProductDemo";
import { Features } from "./sections/Features";
import { Templates } from "./sections/Templates";
import { HowItWorks } from "./sections/HowItWorks";
import { Pricing } from "./sections/Pricing";
import { Testimonials } from "./sections/Testimonials";
import { FinalCTA } from "./sections/FinalCTA";
import { Footer } from "./sections/Footer";
import { colors } from "./styles";

export function MarketingHome() {
  useEffect(() => {
    document.title = "VenueHub — Luxury Venue Site + Booking + CRM";
  }, []);

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      <Nav />
      <Hero />
      <TrustBar />
      <ProblemSolution />
      <ProductDemo />
      <Features />
      <Templates />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
