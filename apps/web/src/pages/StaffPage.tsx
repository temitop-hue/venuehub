import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";

export function StaffPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  });

  const staffQuery = trpc.staff.list.useQuery();

  const createMutation = trpc.staff.create.useMutation({
    onSuccess: () => {
      staffQuery.refetch();
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
      });
      setShowForm(false);
    },
  });

  const updateMutation = trpc.staff.update.useMutation({
    onSuccess: () => {
      staffQuery.refetch();
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
      });
      setShowForm(false);
    },
  });

  const deleteMutation = trpc.staff.delete.useMutation({
    onSuccess: () => {
      staffQuery.refetch();
    },
  });

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: normalizeOptional(formData.phone),
      position: normalizeOptional(formData.position),
      department: normalizeOptional(formData.department),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (staffMember: any) => {
    setEditingId(staffMember.id);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || "",
      position: staffMember.position || "",
      department: staffMember.department || "",
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
            <button onClick={() => navigate("/events")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }}>
              Events
            </button>
            <button
              onClick={() => navigate("/staff")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#2563eb",
                fontWeight: "500",
              }}
            >
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Staff Management</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                email: "",
                phone: "",
                position: "",
                department: "",
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
            {showForm ? "Cancel" : "Add Staff Member"}
          </button>
        </div>

        {/* Form */}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Phone</label>
                  <input
                    type="text"
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  {editingId ? "Update Staff" : "Add Staff"}
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

        {/* Staff Table */}
        {staffQuery.isLoading && <p>Loading staff...</p>}
        {staffQuery.error && <p style={{ color: "#ef4444" }}>Error loading staff</p>}
        {(staffQuery.data || []).length === 0 && <p style={{ color: "#999" }}>No staff members yet. Add one to get started!</p>}
        {(staffQuery.data || []).length > 0 && (
          <div style={{ background: "white", borderRadius: "0.5rem", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Phone</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Position</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Department</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffQuery.data?.map((member) => (
                  <tr key={member.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem" }}>{member.name}</td>
                    <td style={{ padding: "1rem" }}>{member.email}</td>
                    <td style={{ padding: "1rem" }}>{member.phone || "-"}</td>
                    <td style={{ padding: "1rem" }}>{member.position || "-"}</td>
                    <td style={{ padding: "1rem" }}>{member.department || "-"}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(member)}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate({ id: member.id })}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
