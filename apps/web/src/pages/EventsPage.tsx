import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

export function EventsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    venueId: "",
    title: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    guestCount: "",
    status: "pending" as "pending" | "confirmed" | "completed" | "cancelled",
    totalAmount: "",
    advanceAmount: "",
  });

  const eventsQuery = trpc.events.list.useQuery();
  const venuesQuery = trpc.venues.list.useQuery();

  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      eventsQuery.refetch();
      setFormData({
        venueId: "",
        title: "",
        description: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        guestCount: "",
        status: "pending",
        totalAmount: "",
        advanceAmount: "",
      });
      setShowForm(false);
    },
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      eventsQuery.refetch();
      setEditingId(null);
      setFormData({
        venueId: "",
        title: "",
        description: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        guestCount: "",
        status: "pending",
        totalAmount: "",
        advanceAmount: "",
      });
      setShowForm(false);
    },
  });

  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      eventsQuery.refetch();
    },
  });

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      venueId: parseInt(formData.venueId) || 0,
      title: formData.title,
      description: normalizeOptional(formData.description),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: normalizeOptional(formData.clientPhone),
      eventDate: formData.eventDate,
      startTime: normalizeOptional(formData.startTime),
      endTime: normalizeOptional(formData.endTime),
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
      status: formData.status,
      totalAmount: normalizeOptional(formData.totalAmount),
      advanceAmount: normalizeOptional(formData.advanceAmount),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setFormData({
      venueId: event.venueId.toString(),
      title: event.title,
      description: event.description || "",
      clientName: event.clientName,
      clientEmail: event.clientEmail,
      clientPhone: event.clientPhone || "",
      eventDate: new Date(event.eventDate).toISOString().split("T")[0],
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      guestCount: event.guestCount?.toString() || "",
      status: event.status || "pending",
      totalAmount: event.totalAmount?.toString() || "",
      advanceAmount: event.advanceAmount?.toString() || "",
    });
    setShowForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }}>VenueHub</h1>
          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <button onClick={() => navigate("/dashboard")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }}>
              Dashboard
            </button>
            <button onClick={() => navigate("/venues")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }}>
              Venues
            </button>
            <button
              onClick={() => navigate("/events")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#2563eb",
                fontWeight: "500",
              }}
            >
              Events
            </button>
            <button onClick={() => navigate("/staff")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }}>
              Staff
            </button>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }}>
              <span style={{ color: "#666" }}>
                {user?.firstName} {user?.lastName}
              </span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Events & Bookings</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                venueId: "",
                title: "",
                description: "",
                clientName: "",
                clientEmail: "",
                clientPhone: "",
                eventDate: "",
                startTime: "",
                endTime: "",
                guestCount: "",
                status: "pending",
                totalAmount: "",
                advanceAmount: "",
              });
              setShowForm(!showForm);
            }}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showForm ? "Cancel" : "Add Event"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Venue *</label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                    }}
                  >
                    <option value="">Select a venue</option>
                    {(venuesQuery.data || []).map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "0.375rem",
                    boxSizing: "border-box",
                    minHeight: "100px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email *</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Phone</label>
                  <input
                    type="text"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guest Count</label>
                  <input
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Advance Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.advanceAmount}
                    onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.375rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {editingId ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        {eventsQuery.isLoading && <p>Loading events...</p>}
        {eventsQuery.error && <p style={{ color: "#ef4444" }}>Error loading events</p>}
        {(eventsQuery.data || []).length === 0 && <p style={{ color: "#999" }}>No events yet. Create one to get started!</p>}
        {(eventsQuery.data || []).length > 0 && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {eventsQuery.data?.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{event.title}</h3>
                  <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Client: {event.clientName}</p>
                  <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p style={{ color: "#666", fontSize: "0.875rem" }}>
                    Amount: ${event.totalAmount} (Advance: ${event.advanceAmount})
                  </p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span
                    style={{
                      background: event.status === "confirmed" ? "#dcfce7" : event.status === "completed" ? "#dbeafe" : "#fef3c7",
                      color: event.status === "confirmed" ? "#16a34a" : event.status === "completed" ? "#0284c7" : "#ca8a04",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {event.status}
                  </span>
                  <button onClick={() => handleEdit(event)} style={{ background: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate({ id: event.id })}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
