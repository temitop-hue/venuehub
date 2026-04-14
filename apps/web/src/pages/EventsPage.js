import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function EventsPage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
        status: "pending",
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
    const normalizeOptional = (value) => {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
    };
    const handleSubmit = (e) => {
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
        }
        else {
            createMutation.mutate(payload);
        }
    };
    const handleEdit = (event) => {
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
    return (_jsxs("div", { style: { minHeight: "100vh", background: "#f5f5f5" }, children: [_jsx("header", { style: { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "1rem" }, children: _jsxs("div", { style: { maxWidth: "80rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h1", { style: { fontSize: "1.875rem", fontWeight: "bold", color: "#2563eb" }, children: "VenueHub" }), _jsxs("nav", { style: { display: "flex", gap: "1.5rem", alignItems: "center" }, children: [_jsx("button", { onClick: () => navigate("/dashboard"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Dashboard" }), _jsx("button", { onClick: () => navigate("/venues"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Venues" }), _jsx("button", { onClick: () => navigate("/events"), style: {
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#2563eb",
                                        fontWeight: "500",
                                    }, children: "Events" }), _jsx("button", { onClick: () => navigate("/staff"), style: { background: "transparent", border: "none", cursor: "pointer", color: "#666", fontWeight: "500" }, children: "Staff" }), _jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }, children: [_jsxs("span", { style: { color: "#666" }, children: [user?.firstName, " ", user?.lastName] }), _jsx("button", { onClick: handleLogout, style: { background: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }, children: "Logout" })] })] })] }) }), _jsxs("main", { style: { maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }, children: [_jsx("h2", { style: { fontSize: "1.5rem", fontWeight: "bold" }, children: "Events & Bookings" }), _jsx("button", { onClick: () => {
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
                                }, style: {
                                    background: "#2563eb",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: showForm ? "Cancel" : "Add Event" })] }), showForm && (_jsx("div", { style: { background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem" }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Venue *" }), _jsxs("select", { value: formData.venueId, onChange: (e) => setFormData({ ...formData, venueId: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                    }, children: [_jsx("option", { value: "", children: "Select a venue" }), (venuesQuery.data || []).map((venue) => (_jsx("option", { value: venue.id, children: venue.name }, venue.id)))] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Event Title *" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true, style: {
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
                                            } })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Client Name *" }), _jsx("input", { type: "text", value: formData.clientName, onChange: (e) => setFormData({ ...formData, clientName: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Email *" }), _jsx("input", { type: "email", value: formData.clientEmail, onChange: (e) => setFormData({ ...formData, clientEmail: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Phone" }), _jsx("input", { type: "text", value: formData.clientPhone, onChange: (e) => setFormData({ ...formData, clientPhone: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Event Date *" }), _jsx("input", { type: "date", value: formData.eventDate, onChange: (e) => setFormData({ ...formData, eventDate: e.target.value }), required: true, style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Start Time" }), _jsx("input", { type: "time", value: formData.startTime, onChange: (e) => setFormData({ ...formData, startTime: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "End Time" }), _jsx("input", { type: "time", value: formData.endTime, onChange: (e) => setFormData({ ...formData, endTime: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Guest Count" }), _jsx("input", { type: "number", value: formData.guestCount, onChange: (e) => setFormData({ ...formData, guestCount: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                    }, children: [_jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "confirmed", children: "Confirmed" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "cancelled", children: "Cancelled" })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Total Amount" }), _jsx("input", { type: "number", step: "0.01", value: formData.totalAmount, onChange: (e) => setFormData({ ...formData, totalAmount: e.target.value }), style: {
                                                        width: "100%",
                                                        padding: "0.5rem",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "0.375rem",
                                                        boxSizing: "border-box",
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", marginBottom: "0.5rem", fontWeight: "500" }, children: "Advance Amount" }), _jsx("input", { type: "number", step: "0.01", value: formData.advanceAmount, onChange: (e) => setFormData({ ...formData, advanceAmount: e.target.value }), style: {
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
                                            }, children: editingId ? "Update Event" : "Create Event" }), _jsx("button", { type: "button", onClick: () => {
                                                setShowForm(false);
                                                setEditingId(null);
                                            }, style: {
                                                background: "#6b7280",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: "Cancel" })] })] }) })), eventsQuery.isLoading && _jsx("p", { children: "Loading events..." }), eventsQuery.error && _jsx("p", { style: { color: "#ef4444" }, children: "Error loading events" }), (eventsQuery.data || []).length === 0 && _jsx("p", { style: { color: "#999" }, children: "No events yet. Create one to get started!" }), (eventsQuery.data || []).length > 0 && (_jsx("div", { style: { display: "grid", gap: "1rem" }, children: eventsQuery.data?.map((event) => (_jsxs("div", { style: {
                                background: "white",
                                padding: "1.5rem",
                                borderRadius: "0.5rem",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                display: "grid",
                                gridTemplateColumns: "1fr auto",
                                gap: "1rem",
                                alignItems: "start",
                            }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem" }, children: event.title }), _jsxs("p", { style: { color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }, children: ["Client: ", event.clientName] }), _jsxs("p", { style: { color: "#666", fontSize: "0.875rem", marginBottom: "0.5rem" }, children: ["Date: ", new Date(event.eventDate).toLocaleDateString()] }), _jsxs("p", { style: { color: "#666", fontSize: "0.875rem" }, children: ["Amount: $", event.totalAmount, " (Advance: $", event.advanceAmount, ")"] })] }), _jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center" }, children: [_jsx("span", { style: {
                                                background: event.status === "confirmed" ? "#dcfce7" : event.status === "completed" ? "#dbeafe" : "#fef3c7",
                                                color: event.status === "confirmed" ? "#16a34a" : event.status === "completed" ? "#0284c7" : "#ca8a04",
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "9999px",
                                                fontSize: "0.875rem",
                                                fontWeight: "500",
                                            }, children: event.status }), _jsx("button", { onClick: () => handleEdit(event), style: { background: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }, children: "Edit" }), _jsx("button", { onClick: () => deleteMutation.mutate({ id: event.id }), style: {
                                                background: "#ef4444",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                            }, children: "Delete" })] })] }, event.id))) }))] })] }));
}
