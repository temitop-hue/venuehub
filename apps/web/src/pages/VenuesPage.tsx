import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

export function VenuesPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    rentPrice: "",
  });

  const venuesQuery = trpc.venues.list.useQuery();
  const createMutation = trpc.venues.create.useMutation({
    onSuccess: () => {
      venuesQuery.refetch();
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        rentPrice: "",
      });
      setShowForm(false);
    },
  });

  const updateMutation = trpc.venues.update.useMutation({
    onSuccess: () => {
      venuesQuery.refetch();
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        capacity: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        rentPrice: "",
      });
      setShowForm(false);
    },
  });

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  const deleteMutation = trpc.venues.delete.useMutation({
    onSuccess: () => {
      venuesQuery.refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: normalizeOptional(formData.description),
      capacity: parseInt(formData.capacity),
      address: normalizeOptional(formData.address),
      city: normalizeOptional(formData.city),
      state: normalizeOptional(formData.state),
      zipCode: normalizeOptional(formData.zipCode),
      phone: normalizeOptional(formData.phone),
      email: normalizeOptional(formData.email),
      rentPrice: normalizeOptional(formData.rentPrice),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (venue: any) => {
    setEditingId(venue.id);
    setFormData({
      name: venue.name,
      description: venue.description || "",
      capacity: venue.capacity.toString(),
      address: venue.address || "",
      city: venue.city || "",
      state: venue.state || "",
      zipCode: venue.zipCode || "",
      phone: venue.phone || "",
      email: venue.email || "",
      rentPrice: venue.rentPrice?.toString() || "",
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
            <button
              onClick={() => navigate("/venues")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#2563eb",
                fontWeight: "500",
              }}
            >
              Venues
            </button>
            <button onClick={() => navigate("/events")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }}>
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

      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Venues</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                capacity: "",
                address: "",
                city: "",
                state: "",
                zipCode: "",
                phone: "",
                email: "",
                rentPrice: "",
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
            {showForm ? "Cancel" : "Add Venue"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Capacity *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Zip Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Rent Price</label>
                  <input
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  {editingId ? "Update Venue" : "Create Venue"}
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

        {venuesQuery.isLoading && <p>Loading venues...</p>}
        {venuesQuery.error && <p style={{ color: "#ef4444" }}>Error loading venues</p>}
        {(venuesQuery.data || []).length === 0 && <p style={{ color: "#999" }}>No venues yet. Create one to get started!</p>}
        {(venuesQuery.data || []).length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {venuesQuery.data?.map((venue) => (
              <div key={venue.id} style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>{venue.name}</h3>
                <p style={{ color: "#666", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Capacity: {venue.capacity} guests</p>
                {venue.city && <p style={{ color: "#666", marginBottom: "0.5rem", fontSize: "0.875rem" }}>{venue.city}, {venue.state}</p>}
                {venue.rentPrice && <p style={{ color: "#16a34a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>₹{venue.rentPrice}</p>}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(venue)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate({ id: venue.id })}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
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
