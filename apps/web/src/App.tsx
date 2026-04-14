import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { VenuesPage } from "./pages/VenuesPage";
import { EventsPage } from "./pages/EventsPage";
import { StaffPage } from "./pages/StaffPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { LeadsPage } from "./pages/LeadsPage";
import { SiteRoute } from "./public-site/SiteRoute";
import { MarketingHome } from "./marketing/MarketingHome";
import { BasicsStep } from "./onboarding/BasicsStep";
import { StyleStep } from "./onboarding/StyleStep";
import { BuildingStep } from "./onboarding/BuildingStep";
import { PreviewStep } from "./onboarding/PreviewStep";
import { useAuthStore } from "./store/auth";
import { trpc } from "./trpc";
import "./App.css";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (user && user.tenant && !user.tenant.onboardingComplete) {
    return <Navigate to="/onboarding/basics" />;
  }
  return <>{children}</>;
}

function App() {
  const { token, setUser, logout } = useAuthStore();

  trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      logout();
    },
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <OnboardingGate>
              <DashboardPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/venues"
          element={
            <OnboardingGate>
              <VenuesPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/events"
          element={
            <OnboardingGate>
              <EventsPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/staff"
          element={
            <OnboardingGate>
              <StaffPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/analytics"
          element={
            <OnboardingGate>
              <AnalyticsPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/calendar"
          element={
            <OnboardingGate>
              <CalendarPage />
            </OnboardingGate>
          }
        />
        <Route
          path="/leads"
          element={
            <OnboardingGate>
              <LeadsPage />
            </OnboardingGate>
          }
        />
        <Route path="/onboarding" element={<Navigate to="/onboarding/basics" />} />
        <Route
          path="/onboarding/basics"
          element={
            <PrivateRoute>
              <BasicsStep />
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding/style"
          element={
            <PrivateRoute>
              <StyleStep />
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding/building"
          element={
            <PrivateRoute>
              <BuildingStep />
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding/preview"
          element={
            <PrivateRoute>
              <PreviewStep />
            </PrivateRoute>
          }
        />
        <Route path="/v/:slug" element={<SiteRoute />} />
        <Route path="/v/:slug/:pageSlug" element={<SiteRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
