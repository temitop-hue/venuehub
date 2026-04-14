import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function VenuesPage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
    const normalizeOptional = (value) => {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
    };
    const deleteMutation = trpc.venues.delete.useMutation({
        onSuccess: () => {
            venuesQuery.refetch();
        },
    });
    const handleSubmit = (e) => {
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
        }
        else {
            createMutation.mutate(payload);
        }
    };
    const handleEdit = (venue) => {
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
    return (_jsxs("div", { style: { minHeight: "100vh", background: "#f5f5f5" }, children: [_jsx("header", { style: { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }, children: _jsxs("div", { style: { maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h1", { style: { fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }, children: "VenueHub" }), _jsxs("nav", { style: { display: "flex", gap: "1.5rem", alignItems: "center" }, children: [_jsx("button", { onClick: () => navigate("/dashboard"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Dashboard" }), _jsx("button", { onClick: () => navigate("/venues"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#2563eb",
                                        fontWeight: "500",
                                    }, children: "Venues" }), _jsx("button", { onClick: () => navigate("/events"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Events" }), _jsx("button", { onClick: () => navigate("/staff"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Staff" }), _jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }, children: [_jsxs("span", { style: { color: "#666" }, children: [user?.firstName, " ", user?.lastName] }), _jsx("button", { onClick: handleLogout, style: { background: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }, children: "Logout" })] })] })] }) }), _jsxs("main", { style: { maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }, children: [_jsx("h2", { style: { fontSize: "1.5rem", fontWeight: "bold" }, children: "Venues" }), _jsx("button", { onClick: () => {
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
                                }, style: {
                                    background: "#2563eb",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: showForm ? "Cancel" : "Add Venue" })] }), showForm && (_jsx("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Name *" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Capacity *" }), _jsx("input", { type: "number", value: formData.capacity, onChange: (e) => setFormData({ ...formData, capacity: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), style: {
                                                width: "100%",
                                                padding: "0.5rem",
                                                border: "1px solid #ddd",
                                                borderRadius: "0.375rem",
                                                boxSizing: "border-box",
                                                minHeight: "100px",
                                            } })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Address" }), _jsx("input", { type: "text", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "City" }), _jsx("input", { type: "text", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "State" }), _jsx("input", { type: "text", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Zip Code" }), _jsx("input", { type: "text", value: formData.zipCode, onChange: (e) => setFormData({ ...formData, zipCode: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Rent Price" }), _jsx("input", { type: "number", value: formData.rentPrice, onChange: (e) => setFormData({ ...formData, rentPrice: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Phone" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), style: {
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
                                            }, children: editingId ? "Update Venue" : "Create Venue" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowForm(false);
                                                setEditingId(null);
                                            }, style: {
                                                background: "#6b7280",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: "Cancel" })] })] }) })), venuesQuery.isLoading && _jsx("p", { children: "Loading venues..." }), venuesQuery.error && _jsx("p", { style: { color: "#ef4444" }, children: "Error loading venues" }), (venuesQuery.data || []).length === 0 && _jsx("p", { style: { color: "#999" }, children: "No venues yet. Create one to get started!" }), (venuesQuery.data || []).length > 0 && (_jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }, children: venuesQuery.data?.map((venue) => (_jsxs("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }, children: venue.name }), _jsxs("p", { style: { color: "#666", marginBottom: "0.5rem", fontSize: "0.875rem" }, children: ["Capacity: ", venue.capacity, " guests"] }), venue.city && _jsxs("p", { style: { color: "#666", marginBottom: "0.5rem", fontSize: "0.875rem" }, children: [venue.city, ", ", venue.state] }), venue.rentPrice && _jsxs("p", { style: { color: "#16a34a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }, children: ["\u20B9", venue.rentPrice] }), _jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [_jsx("button", { onClick: () => handleEdit(venue), style: {
                                                background: "#3b82f6",
                                                color: "white",
                                                padding: "0.5rem 0.75rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.875rem",
                                            }, children: "Edit" }), _jsx("button", { onClick: () => deleteMutation.mutate({ id: venue.id }), style: {
                                                background: "#ef4444",
                                                color: "white",
                                                padding: "0.5rem 0.75rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.875rem",
                                            }, children: "Delete" })] })] }, venue.id))) }))] })] }));
}
