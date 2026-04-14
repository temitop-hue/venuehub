import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { VenuesPage } from "./pages/VenuesPage";
import { EventsPage } from "./pages/EventsPage";
import { StaffPage } from "./pages/StaffPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { useAuthStore } from "./store/auth";
import { trpc } from "./trpc";
import "./App.css";
function PrivateRoute({ children }) {
    const { token } = useAuthStore();
    return token ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/" });
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
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: token ? _jsx(Navigate, { to: "/dashboard" }) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/venues", element: _jsx(PrivateRoute, { children: _jsx(VenuesPage, {}) }) }), _jsx(Route, { path: "/events", element: _jsx(PrivateRoute, { children: _jsx(EventsPage, {}) }) }), _jsx(Route, { path: "/staff", element: _jsx(PrivateRoute, { children: _jsx(StaffPage, {}) }) }), _jsx(Route, { path: "/analytics", element: _jsx(PrivateRoute, { children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/calendar", element: _jsx(PrivateRoute, { children: _jsx(CalendarPage, {}) }) })] }) }));
}
export default App;
