import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function DashboardPage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const venuesQuery = trpc.venues.list.useQuery();
    const eventsQuery = trpc.events.list.useQuery();
    const staffQuery = trpc.staff.list.useQuery();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const venuesCount = venuesQuery.data?.length || 0;
    const eventsCount = eventsQuery.data?.length || 0;
    const staffCount = staffQuery.data?.length || 0;
    const upcomingEvents = (eventsQuery.data || [])
        .filter((event) => event.status === "confirmed" || event.status === "pending")
        .slice(0, 5);
    return (_jsxs("div", { style: { minHeight: "100vh", background: "#f5f5f5" }, children: [_jsx("header", { style: { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }, children: _jsxs("div", { style: { maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h1", { style: { fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }, children: "VenueHub" }), _jsxs("nav", { style: { display: "flex", gap: "1.5rem", alignItems: "center" }, children: [_jsx("button", { onClick: () => navigate("/dashboard"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#2563eb",
                                        fontWeight: "500",
                                    }, children: "Dashboard" }), _jsx("button", { onClick: () => navigate("/venues"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#666",
                                        fontWeight: "500",
                                    }, children: "Venues" }), _jsx("button", { onClick: () => navigate("/events"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#666",
                                        fontWeight: "500",
                                    }, children: "Events" }), _jsx("button", { onClick: () => navigate("/staff"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#666",
                                        fontWeight: "500",
                                    }, children: "Staff" }), _jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }, children: [_jsxs("span", { style: { color: "#666" }, children: [user?.firstName, " ", user?.lastName] }), _jsx("button", { onClick: handleLogout, style: {
                                                background: "#ef4444",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: "Logout" })] })] })] }) }), _jsxs("main", { style: { maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }, children: [_jsxs("h2", { style: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }, children: ["Welcome, ", user?.firstName, "! \uD83D\uDC4B"] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }, children: [_jsxs("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { color: "#666", fontSize: "0.875rem", fontWeight: "500" }, children: "Total Venues" }), _jsx("p", { style: { fontSize: "2rem", fontWeight: "bold", color: "#2563eb", marginTop: "0.5rem" }, children: venuesCount }), _jsx("button", { onClick: () => navigate("/venues"), style: {
                                            marginTop: "1rem",
                                            color: "#2563eb",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }, children: "View Venues \u2192" })] }), _jsxs("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { color: "#666", fontSize: "0.875rem", fontWeight: "500" }, children: "Total Events" }), _jsx("p", { style: { fontSize: "2rem", fontWeight: "bold", color: "#16a34a", marginTop: "0.5rem" }, children: eventsCount }), _jsx("button", { onClick: () => navigate("/events"), style: {
                                            marginTop: "1rem",
                                            color: "#16a34a",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }, children: "View Events \u2192" })] }), _jsxs("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { color: "#666", fontSize: "0.875rem", fontWeight: "500" }, children: "Total Staff" }), _jsx("p", { style: { fontSize: "2rem", fontWeight: "bold", color: "#9333ea", marginTop: "0.5rem" }, children: staffCount }), _jsx("button", { onClick: () => navigate("/staff"), style: {
                                            marginTop: "1rem",
                                            color: "#9333ea",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }, children: "View Staff \u2192" })] })] }), _jsxs("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }, children: "Upcoming Events" }), eventsQuery.isLoading && _jsx("p", { children: "Loading..." }), eventsQuery.error && _jsx("p", { style: { color: "#ef4444" }, children: "Error loading events" }), upcomingEvents.length === 0 && _jsx("p", { style: { color: "#999" }, children: "No upcoming events" }), upcomingEvents.length > 0 && (_jsx("div", { style: { display: "grid", gap: "1rem" }, children: upcomingEvents.map((event) => (_jsx("div", { style: { padding: "1rem", background: "#f9fafb", borderRadius: "0.375rem", borderLeft: "4px solid #2563eb" }, children: _jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start" }, children: [_jsxs("div", { children: [_jsx("h4", { style: { fontWeight: "bold" }, children: event.title }), _jsxs("p", { style: { color: "#666", fontSize: "0.875rem" }, children: ["Client: ", event.clientName, " (", event.clientEmail, ")"] }), _jsxs("p", { style: { color: "#666", fontSize: "0.875rem" }, children: ["Date: ", new Date(event.eventDate).toLocaleDateString()] })] }), _jsx("span", { style: {
                                                    background: event.status === "confirmed" ? "#dcfce7" : "#fef3c7",
                                                    color: event.status === "confirmed" ? "#16a34a" : "#ca8a04",
                                                    padding: "0.25rem 0.75rem",
                                                    borderRadius: "9999px",
                                                    fontSize: "0.875rem",
                                                    fontWeight: "500",
                                                }, children: event.status })] }) }, event.id))) }))] })] })] }));
}
