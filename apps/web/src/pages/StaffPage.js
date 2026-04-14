import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function StaffPage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
    const normalizeOptional = (value) => {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
    };
    const handleSubmit = (e) => {
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
        }
        else {
            createMutation.mutate(payload);
        }
    };
    const handleEdit = (staffMember) => {
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
    return (_jsxs("div", { style: { minHeight: "100vh", background: "#f5f5f5" }, children: [_jsx("header", { style: { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }, children: _jsxs("div", { style: { maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h1", { style: { fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }, children: "VenueHub" }), _jsxs("nav", { style: { display: "flex", gap: "1.5rem", alignItems: "center" }, children: [_jsx("button", { onClick: () => navigate("/dashboard"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Dashboard" }), _jsx("button", { onClick: () => navigate("/venues"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Venues" }), _jsx("button", { onClick: () => navigate("/events"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Events" }), _jsx("button", { onClick: () => navigate("/staff"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#2563eb",
                                        fontWeight: "500",
                                    }, children: "Staff" }), _jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }, children: [_jsxs("span", { style: { color: "#666" }, children: [user?.firstName, " ", user?.lastName] }), _jsx("button", { onClick: handleLogout, style: { background: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }, children: "Logout" })] })] })] }) }), _jsxs("main", { style: { maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }, children: [_jsx("h2", { style: { fontSize: "1.5rem", fontWeight: "bold" }, children: "Staff Management" }), _jsx("button", { onClick: () => {
                                    setEditingId(null);
                                    setFormData({
                                        name: "",
                                        email: "",
                                        phone: "",
                                        position: "",
                                        department: "",
                                    });
                                    setShowForm(!showForm);
                                }, style: {
                                    background: "#2563eb",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: showForm ? "Cancel" : "Add Staff Member" })] }), showForm && (_jsx("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Name *" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Email *" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Phone" }), _jsx("input", { type: "text", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Position" }), _jsx("input", { type: "text", value: formData.position, onChange: (e) => setFormData({ ...formData, position: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Department" }), _jsx("input", { type: "text", value: formData.department, onChange: (e) => setFormData({ ...formData, department: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [_jsx("button", { type: "submit", style: {
                                                background: "#2563eb",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: editingId ? "Update Staff" : "Add Staff" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowForm(false);
                                                setEditingId(null);
                                            }, style: {
                                                background: "#6b7280",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: "Cancel" })] })] }) })), staffQuery.isLoading && _jsx("p", { children: "Loading staff..." }), staffQuery.error && _jsx("p", { style: { color: "#ef4444" }, children: "Error loading staff" }), (staffQuery.data || []).length === 0 && _jsx("p", { style: { color: "#999" }, children: "No staff members yet. Add one to get started!" }), (staffQuery.data || []).length > 0 && (_jsx("div", { style: { background: "white", borderRadius: "0.5rem", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: _jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [_jsx("thead", { style: { background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }, children: _jsxs("tr", { children: [_jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Name" }), _jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Email" }), _jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Phone" }), _jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Position" }), _jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Department" }), _jsx("th", { style: { padding: "1rem", textAlign: "left", fontWeight: "600" }, children: "Actions" })] }) }), _jsx("tbody", { children: staffQuery.data?.map((member) => (_jsxs("tr", { style: { borderBottom: "1px solid #e5e7eb" }, children: [_jsx("td", { style: { padding: "1rem" }, children: member.name }), _jsx("td", { style: { padding: "1rem" }, children: member.email }), _jsx("td", { style: { padding: "1rem" }, children: member.phone || "-" }), _jsx("td", { style: { padding: "1rem" }, children: member.position || "-" }), _jsx("td", { style: { padding: "1rem" }, children: member.department || "-" }), _jsx("td", { style: { padding: "1rem" }, children: _jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [_jsx("button", { onClick: () => handleEdit(member), style: {
                                                                background: "#3b82f6",
                                                                color: "white",
                                                                padding: "0.25rem 0.75rem",
                                                                borderRadius: "0.375rem",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                fontSize: "0.875rem",
                                                            }, children: "Edit" }), _jsx("button", { onClick: () => deleteMutation.mutate({ id: member.id }), style: {
                                                                background: "#ef4444",
                                                                color: "white",
                                                                padding: "0.25rem 0.75rem",
                                                                borderRadius: "0.375rem",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                fontSize: "0.875rem",
                                                            }, children: "Delete" })] }) })] }, member.id))) })] }) }))] })] }));
}
