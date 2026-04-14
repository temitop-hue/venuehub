import React from "react";
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

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }}>VenueHub</h1>
          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#2563eb",
                fontWeight: "500",
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/venues")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontWeight: "500",
              }}
            >
              Venues
            </button>
            <button
              onClick={() => navigate("/events")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontWeight: "500",
              }}
            >
              Events
            </button>
            <button
              onClick={() => navigate("/staff")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontWeight: "500",
              }}
            >
              Staff
            </button>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }}>
              <span style={{ color: "#666" }}>
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "#ef4444",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}>Welcome, {user?.firstName}! 👋</h2>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Total Venues</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb", marginTop: "0.5rem" }}>{venuesCount}</p>
            <button
              onClick={() => navigate("/venues")}
              style={{
                marginTop: "1rem",
                color: "#2563eb",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              View Venues →
            </button>
          </div>

          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Total Events</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a", marginTop: "0.5rem" }}>{eventsCount}</p>
            <button
              onClick={() => navigate("/events")}
              style={{
                marginTop: "1rem",
                color: "#16a34a",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              View Events →
            </button>
          </div>

          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Total Staff</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#9333ea", marginTop: "0.5rem" }}>{staffCount}</p>
            <button
              onClick={() => navigate("/staff")}
              style={{
                marginTop: "1rem",
                color: "#9333ea",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              View Staff →
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }}>Upcoming Events</h3>
          {eventsQuery.isLoading && <p>Loading...</p>}
          {eventsQuery.error && <p style={{ color: "#ef4444" }}>Error loading events</p>}
          {upcomingEvents.length === 0 && <p style={{ color: "#999" }}>No upcoming events</p>}
          {upcomingEvents.length > 0 && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {upcomingEvents.map((event) => (
                <div key={event.id} style={{ padding: "1rem", background: "#f9fafb", borderRadius: "0.375rem", borderLeft: "4px solid #2563eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <h4 style={{ fontWeight: "bold" }}>{event.title}</h4>
                      <p style={{ color: "#666", fontSize: "0.875rem" }}>
                        Client: {event.clientName} ({event.clientEmail})
                      </p>
                      <p style={{ color: "#666", fontSize: "0.875rem" }}>
                        Date: {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      style={{
                        background: event.status === "confirmed" ? "#dcfce7" : "#fef3c7",
                        color: event.status === "confirmed" ? "#16a34a" : "#ca8a04",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
