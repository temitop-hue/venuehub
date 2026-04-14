import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { trpc } from "../trpc";
import { useAuthStore } from "../store/auth";
export function CalendarPage() {
    const { user, logout } = useAuthStore();
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        eventName: "",
        venue: "",
        guestCount: "",
        totalAmount: "",
        advanceAmount: "",
        eventDate: "",
    });
    // Get all events and venues
    const { data: allEvents = [] } = trpc.events.list.useQuery();
    const { data: venues = [] } = trpc.venues.list.useQuery();
    const createEventMutation = trpc.events.create.useMutation();
    // Get calendar days
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }
    // Get events for a specific date
    const getEventsForDate = (day) => {
        if (!day)
            return [];
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return allEvents
            .filter((e) => {
            const eventDate = e.eventDate ? new Date(e.eventDate).toISOString().split("T")[0] : "";
            return eventDate === dateStr;
        })
            .map((e) => ({
            id: e.id,
            eventName: e.eventName,
            status: e.status,
            venue: venues.find((v) => v.id === e.venueId)?.venueName || "Unknown",
        }));
    };
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        setSelectedDate(null);
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        setSelectedDate(null);
    };
    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setFormData({
            ...formData,
            eventDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        });
    };
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!formData.eventName || !formData.venue || !selectedDate)
            return;
        try {
            await createEventMutation.mutateAsync({
                eventName: formData.eventName,
                venueId: parseInt(formData.venue),
                guestCount: parseInt(formData.guestCount) || 0,
                eventDate: formData.eventDate,
                totalAmount: (parseFloat(formData.totalAmount) || 0).toString(),
                advanceAmount: (parseFloat(formData.advanceAmount) || 0).toString(),
                status: "pending",
            });
            setShowEventForm(false);
            setFormData({
                eventName: "",
                venue: "",
                guestCount: "",
                totalAmount: "",
                advanceAmount: "",
                eventDate: "",
            });
        }
        catch (err) {
            console.error("Failed to create event:", err);
        }
    };
    const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    return (_jsxs("div", { style: { margin: 0, padding: 0, minHeight: "100vh", backgroundColor: "#f5f5f5" }, children: [_jsx("div", { style: { backgroundColor: "#1f2937", color: "white", padding: "16px 24px" }, children: _jsxs("div", { style: { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h1", { style: { margin: 0, fontSize: "24px", fontWeight: "bold" }, children: "VenueHub" }), _jsxs("div", { style: { display: "flex", gap: "24px", alignItems: "center" }, children: [_jsx("a", { href: "/dashboard", style: { color: "white", textDecoration: "none" }, children: "Dashboard" }), _jsx("a", { href: "/venues", style: { color: "white", textDecoration: "none" }, children: "Venues" }), _jsx("a", { href: "/events", style: { color: "white", textDecoration: "none" }, children: "Events" }), _jsx("a", { href: "/analytics", style: { color: "white", textDecoration: "none" }, children: "Analytics" }), _jsx("a", { href: "/calendar", style: { color: "white", textDecoration: "none", fontWeight: "bold", borderBottom: "2px solid white", paddingBottom: "4px" }, children: "Calendar" }), _jsx("a", { href: "/staff", style: { color: "white", textDecoration: "none" }, children: "Staff" }), _jsx("span", { style: { color: "#d1d5db" }, children: "|" }), _jsx("span", { style: { fontSize: "14px" }, children: user?.email }), _jsx("button", { onClick: logout, style: {
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }, children: "Logout" })] })] }) }), _jsx("div", { style: { maxWidth: "1200px", margin: "24px auto", padding: "0 24px" }, children: _jsxs("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }, children: [_jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, children: [_jsx("h2", { style: { margin: 0, fontSize: "20px", fontWeight: "bold" }, children: monthName }), _jsxs("div", { style: { display: "flex", gap: "8px" }, children: [_jsx("button", { onClick: handlePrevMonth, style: {
                                                        padding: "8px 12px",
                                                        border: "1px solid #d1d5db",
                                                        backgroundColor: "#f9fafb",
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                    }, children: "\u2190 Prev" }), _jsx("button", { onClick: handleNextMonth, style: {
                                                        padding: "8px 12px",
                                                        border: "1px solid #d1d5db",
                                                        backgroundColor: "#f9fafb",
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                    }, children: "Next \u2192" })] })] }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "8px" }, children: dayNames.map((day) => (_jsx("div", { style: { textAlign: "center", fontWeight: "bold", padding: "8px", color: "#6b7280" }, children: day }, day))) }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }, children: calendarDays.map((day, idx) => {
                                        const events = day ? getEventsForDate(day) : [];
                                        const isSelected = selectedDate && day === selectedDate.getDate();
                                        const isToday = day &&
                                            new Date().getFullYear() === currentDate.getFullYear() &&
                                            new Date().getMonth() === currentDate.getMonth() &&
                                            new Date().getDate() === day;
                                        return (_jsx("div", { onClick: () => day && handleDateClick(day), style: {
                                                minHeight: "80px",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "4px",
                                                padding: "8px",
                                                backgroundColor: isSelected ? "#dbeafe" : isToday ? "#fef3c7" : "#f9fafb",
                                                cursor: day ? "pointer" : "default",
                                                display: "flex",
                                                flexDirection: "column",
                                            }, children: day && (_jsxs(_Fragment, { children: [_jsx("div", { style: { fontWeight: "bold", marginBottom: "4px", color: isToday ? "#b45309" : "#1f2937" }, children: day }), _jsxs("div", { style: { fontSize: "11px", overflow: "hidden" }, children: [events.slice(0, 2).map((event) => (_jsx("div", { style: {
                                                                    backgroundColor: "#e0e7ff",
                                                                    color: "#3730a3",
                                                                    padding: "2px 4px",
                                                                    borderRadius: "2px",
                                                                    marginBottom: "2px",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                }, title: event.eventName, children: event.eventName }, event.id))), events.length > 2 && (_jsxs("div", { style: { color: "#6b7280", fontSize: "10px" }, children: ["+", events.length - 2, " more"] }))] })] })) }, idx));
                                    }) })] }), _jsxs("div", { children: [selectedDate && (_jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, children: [_jsx("h3", { style: { margin: "0 0 16px 0", fontSize: "18px", fontWeight: "bold" }, children: selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }) }), _jsxs("div", { style: { marginBottom: "24px" }, children: [_jsx("h4", { style: { margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold", color: "#6b7280" }, children: "Events" }), getEventsForDate(selectedDate.getDate()).length > 0 ? (getEventsForDate(selectedDate.getDate()).map((event) => (_jsxs("div", { style: {
                                                        backgroundColor: "#f9fafb",
                                                        padding: "12px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                        borderLeft: "4px solid #3b82f6",
                                                    }, children: [_jsx("p", { style: { margin: "0 0 4px 0", fontWeight: "bold", fontSize: "14px" }, children: event.eventName }), _jsx("p", { style: { margin: "0 0 4px 0", fontSize: "13px", color: "#6b7280" }, children: event.venue }), _jsx("span", { className: `badge ${getStatusColor(event.status)}`, style: { display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }, children: event.status.charAt(0).toUpperCase() + event.status.slice(1) })] }, event.id)))) : (_jsx("p", { style: { color: "#9ca3af", fontSize: "14px", margin: 0 }, children: "No events scheduled" }))] }), !showEventForm ? (_jsx("button", { onClick: () => setShowEventForm(true), style: {
                                                width: "100%",
                                                padding: "12px",
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                            }, children: "+ Create Event" })) : (_jsxs("form", { onSubmit: handleCreateEvent, style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }, children: "Event Name" }), _jsx("input", { type: "text", value: formData.eventName, onChange: (e) => setFormData({ ...formData, eventName: e.target.value }), placeholder: "Event name", style: {
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                boxSizing: "border-box",
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }, children: "Venue" }), _jsxs("select", { value: formData.venue, onChange: (e) => setFormData({ ...formData, venue: e.target.value }), style: {
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                boxSizing: "border-box",
                                                            }, children: [_jsx("option", { value: "", children: "Select venue" }), venues.map((v) => (_jsx("option", { value: v.id, children: v.venueName }, v.id)))] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }, children: "Guest Count" }), _jsx("input", { type: "number", value: formData.guestCount, onChange: (e) => setFormData({ ...formData, guestCount: e.target.value }), placeholder: "0", style: {
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                boxSizing: "border-box",
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }, children: "Total Amount (\u20B9)" }), _jsx("input", { type: "number", value: formData.totalAmount, onChange: (e) => setFormData({ ...formData, totalAmount: e.target.value }), placeholder: "0", step: "0.01", style: {
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                boxSizing: "border-box",
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }, children: "Advance Amount (\u20B9)" }), _jsx("input", { type: "number", value: formData.advanceAmount, onChange: (e) => setFormData({ ...formData, advanceAmount: e.target.value }), placeholder: "0", step: "0.01", style: {
                                                                width: "100%",
                                                                padding: "8px",
                                                                border: "1px solid #d1d5db",
                                                                borderRadius: "4px",
                                                                fontSize: "14px",
                                                                boxSizing: "border-box",
                                                            } })] }), _jsxs("div", { style: { display: "flex", gap: "8px" }, children: [_jsx("button", { type: "submit", style: {
                                                                flex: 1,
                                                                padding: "8px",
                                                                backgroundColor: "#10b981",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                fontWeight: "bold",
                                                            }, children: "Create" }), _jsx("button", { type: "button", onClick: () => setShowEventForm(false), style: {
                                                                flex: 1,
                                                                padding: "8px",
                                                                backgroundColor: "#ef4444",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                fontWeight: "bold",
                                                            }, children: "Cancel" })] })] }))] })), !selectedDate && (_jsx("div", { style: { backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }, children: _jsx("p", { style: { color: "#9ca3af", margin: 0 }, children: "Select a date to view or create events" }) }))] })] }) })] }));
}
