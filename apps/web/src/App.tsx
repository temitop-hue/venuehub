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
import { PaymentsPage } from "./pages/PaymentsPage";
import { GuestsPage } from "./pages/GuestsPage";
import { SiteBuilderPage } from "./pages/SiteBuilderPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SiteRoute } from "./public-site/SiteRoute";
import { MarketingHome } from "./marketing/MarketingHome";
import { BasicsStep } from "./onboarding/BasicsStep";
import { StyleStep } from "./onboarding/StyleStep";
import { BuildingStep } from "./onboarding/BuildingStep";
import { PreviewStep } from "./onboarding/PreviewStep";
import { AppLayout } from "./app-layout/AppLayout";
import { useAuthStore } from "./store/auth";
import { trpc } from "./trpc";
import "./App.css";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (user && user.tenant && !user.tenant.onboardingComplete) {
    return <Navigate to="/onboarding/basics" />;
  }
  return <AppLayout>{children}</AppLayout>;
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

        <Route path="/dashboard" element={<AppRoute><DashboardPage /></AppRoute>} />
        <Route path="/leads" element={<AppRoute><LeadsPage /></AppRoute>} />
        <Route path="/events" element={<AppRoute><EventsPage /></AppRoute>} />
        <Route path="/calendar" element={<AppRoute><CalendarPage /></AppRoute>} />
        <Route path="/payments" element={<AppRoute><PaymentsPage /></AppRoute>} />
        <Route path="/guests" element={<AppRoute><GuestsPage /></AppRoute>} />
        <Route path="/site" element={<AppRoute><SiteBuilderPage /></AppRoute>} />
        <Route path="/venues" element={<AppRoute><VenuesPage /></AppRoute>} />
        <Route path="/staff" element={<AppRoute><StaffPage /></AppRoute>} />
        <Route path="/analytics" element={<AppRoute><AnalyticsPage /></AppRoute>} />
        <Route path="/settings" element={<AppRoute><SettingsPage /></AppRoute>} />

        <Route path="/onboarding" element={<Navigate to="/onboarding/basics" />} />
        <Route path="/onboarding/basics" element={<PrivateRoute><BasicsStep /></PrivateRoute>} />
        <Route path="/onboarding/style" element={<PrivateRoute><StyleStep /></PrivateRoute>} />
        <Route path="/onboarding/building" element={<PrivateRoute><BuildingStep /></PrivateRoute>} />
        <Route path="/onboarding/preview" element={<PrivateRoute><PreviewStep /></PrivateRoute>} />

        <Route path="/v/:slug" element={<SiteRoute />} />
        <Route path="/v/:slug/:pageSlug" element={<SiteRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
