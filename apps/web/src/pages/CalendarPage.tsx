import React, { useState } from "react";
import { trpc } from "../trpc";

interface DayEvent {
  id: number;
  eventName: string;
  status: string;
  venue: string;
  time?: string;
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    venue: "",
    clientName: "",
    clientEmail: "",
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
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Get events for a specific date
  const getEventsForDate = (day: number): DayEvent[] => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allEvents
      .filter((e) => {
        const eventDate = e.eventDate ? new Date(e.eventDate).toISOString().split("T")[0] : "";
        return eventDate === dateStr;
      })
      .map((e) => ({
        id: e.id,
        eventName: e.title,
        status: e.status,
        venue: venues.find((v) => v.id === e.venueId)?.name || "Unknown",
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

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setFormData({
      ...formData,
      eventDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventName || !formData.venue || !formData.clientName || !formData.clientEmail || !selectedDate) return;

    try {
      await createEventMutation.mutateAsync({
        title: formData.eventName,
        venueId: parseInt(formData.venue),
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
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
        clientName: "",
        clientEmail: "",
        guestCount: "",
        totalAmount: "",
        advanceAmount: "",
        eventDate: "",
      });
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
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

  return (
    <div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Calendar */}
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{monthName}</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handlePrevMonth}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  ← Prev
                </button>
                <button
                  onClick={handleNextMonth}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "8px" }}>
              {dayNames.map((day) => (
                <div key={day} style={{ textAlign: "center", fontWeight: "bold", padding: "8px", color: "#6b7280" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
              {calendarDays.map((day, idx) => {
                const events = day ? getEventsForDate(day) : [];
                const isSelected = selectedDate && day === selectedDate.getDate();
                const isToday =
                  day &&
                  new Date().getFullYear() === currentDate.getFullYear() &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getDate() === day;

                return (
                  <div
                    key={idx}
                    onClick={() => day && handleDateClick(day)}
                    style={{
                      minHeight: "80px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: isSelected ? "#dbeafe" : isToday ? "#fef3c7" : "#f9fafb",
                      cursor: day ? "pointer" : "default",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {day && (
                      <>
                        <div style={{ fontWeight: "bold", marginBottom: "4px", color: isToday ? "#b45309" : "#1f2937" }}>
                          {day}
                        </div>
                        <div style={{ fontSize: "11px", overflow: "hidden" }}>
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              style={{
                                backgroundColor: "#e0e7ff",
                                color: "#3730a3",
                                padding: "2px 4px",
                                borderRadius: "2px",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={event.eventName}
                            >
                              {event.eventName}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div style={{ color: "#6b7280", fontSize: "10px" }}>+{events.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Selected date details and event form */}
          <div>
            {selectedDate && (
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "bold" }}>
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                </h3>

                {/* Events for selected date */}
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold", color: "#6b7280" }}>Events</h4>
                  {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                    getEventsForDate(selectedDate.getDate()).map((event) => (
                      <div
                        key={event.id}
                        style={{
                          backgroundColor: "#f9fafb",
                          padding: "12px",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          borderLeft: "4px solid #3b82f6",
                        }}
                      >
                        <p style={{ margin: "0 0 4px 0", fontWeight: "bold", fontSize: "14px" }}>{event.eventName}</p>
                        <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#6b7280" }}>{event.venue}</p>
                        <span className={`badge ${getStatusColor(event.status)}`} style={{ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>No events scheduled</p>
                  )}
                </div>

                {/* Create event form */}
                {!showEventForm ? (
                  <button
                    onClick={() => setShowEventForm(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    + Create Event
                  </button>
                ) : (
                  <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Event Name
                      </label>
                      <input
                        type="text"
                        value={formData.eventName}
                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                        placeholder="Event name"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Venue
                      </label>
                      <select
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="">Select venue</option>
                        {venues.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Client name"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        placeholder="client@example.com"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Guest Count
                      </label>
                      <input
                        type="number"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        placeholder="0"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Total Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        placeholder="0"
                        step="0.01"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#374151" }}>
                        Advance Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.advanceAmount}
                        onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                        placeholder="0"
                        step="0.01"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!selectedDate && (
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <p style={{ color: "#9ca3af", margin: 0 }}>Select a date to view or create events</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
