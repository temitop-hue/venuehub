import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TourBookingBlockData } from "@venuehub/shared";
import { trpc } from "../../trpc";
import { section, container, eyebrow, heading, subheading, divider, pillButton } from "../primitives";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatTime12(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${pad(m)} ${period}`;
}

export function TourBookingBlock(props: TourBookingBlockData) {
  const { slug } = useParams<{ slug: string }>();
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    guestCount: "",
    message: "",
    honeypot: "",
  });

  const fromDate = toDateStr(monthAnchor);
  const toDate = toDateStr(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0));

  const slotsQuery = trpc.tours.getBookedSlots.useQuery(
    { slug: slug ?? "", fromDate, toDate },
    { enabled: Boolean(slug) },
  );

  const createMutation = trpc.tours.createBooking.useMutation();

  const bookedByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const b of slotsQuery.data?.booked ?? []) {
      if (!map.has(b.tourDate)) map.set(b.tourDate, new Set());
      map.get(b.tourDate)!.add(b.tourTime);
    }
    return map;
  }, [slotsQuery.data]);

  const blockedSet = useMemo(() => new Set(slotsQuery.data?.blockedDates ?? []), [slotsQuery.data]);

  const today = toDateStr(new Date());
  const availableDays = new Set(props.availableDays);

  const days = buildMonthGrid(monthAnchor);
  const canGoBack = (() => {
    const prev = new Date(monthAnchor);
    prev.setMonth(prev.getMonth() - 1);
    return prev >= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  })();

  const isDateAvailable = (d: Date): boolean => {
    const str = toDateStr(d);
    if (str < today) return false;
    if (blockedSet.has(str)) return false;
    const dayKey = DAY_KEYS[d.getDay()];
    if (!availableDays.has(dayKey)) return false;
    // All slots booked?
    const booked = bookedByDate.get(str);
    if (booked && booked.size >= props.slotTimes.length) return false;
    return true;
  };

  const slotsForDate = (dateStr: string): Array<{ time: string; taken: boolean }> => {
    const booked = bookedByDate.get(dateStr) ?? new Set();
    return props.slotTimes.map((time) => ({ time, taken: booked.has(time) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !selectedDate || !selectedTime) return;
    createMutation.mutate({
      slug,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      eventType: form.eventType.trim() || undefined,
      guestCount: form.guestCount ? parseInt(form.guestCount, 10) : undefined,
      tourDate: selectedDate,
      tourTime: selectedTime,
      message: form.message.trim() || undefined,
      honeypot: form.honeypot,
    });
  };

  return (
    <section id="book-a-tour" style={{ background: "var(--color-secondary)", ...section("lg") }}>
      <div style={{ ...container("wide") }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          {props.eyebrow && <div style={eyebrow}>{props.eyebrow}</div>}
          {props.heading && <h2 style={heading}>{props.heading}</h2>}
          {props.heading && <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />}
          {props.subheading && (
            <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{props.subheading}</p>
          )}
        </header>

        {createMutation.isSuccess ? (
          <div
            style={{
              maxWidth: "38rem",
              margin: "0 auto",
              padding: "3rem 2rem",
              textAlign: "center",
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ fontSize: "2rem", color: "var(--color-accent)", marginBottom: "0.75rem" }}>✦</div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "var(--color-primary)",
                marginBottom: "0.75rem",
              }}
            >
              Tour confirmed
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "var(--color-primary)",
                opacity: 0.7,
              }}
            >
              {selectedDate && selectedTime
                ? `${formatDisplayDate(new Date(selectedDate + "T00:00:00"))} at ${formatTime12(selectedTime)}. `
                : ""}
              {props.successMessage}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* CALENDAR */}
            <div
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "var(--radius)",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <button
                  onClick={() => {
                    const next = new Date(monthAnchor);
                    next.setMonth(next.getMonth() - 1);
                    setMonthAnchor(next);
                  }}
                  disabled={!canGoBack}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-primary)",
                    cursor: canGoBack ? "pointer" : "not-allowed",
                    opacity: canGoBack ? 1 : 0.3,
                    padding: "0.25rem",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    color: "var(--color-primary)",
                  }}
                >
                  {monthAnchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
                <button
                  onClick={() => {
                    const next = new Date(monthAnchor);
                    next.setMonth(next.getMonth() + 1);
                    setMonthAnchor(next);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      color: "var(--color-primary)",
                      opacity: 0.55,
                      padding: "0.5rem 0",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
                {days.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const str = toDateStr(d);
                  const available = isDateAvailable(d);
                  const isSelected = selectedDate === str;
                  return (
                    <button
                      key={i}
                      disabled={!available}
                      onClick={() => {
                        setSelectedDate(str);
                        setSelectedTime(null);
                      }}
                      style={{
                        aspectRatio: "1",
                        border: isSelected ? "1px solid var(--color-accent)" : "1px solid transparent",
                        background: isSelected ? "var(--color-accent)" : "transparent",
                        color: isSelected ? "var(--color-primary)" : available ? "var(--color-primary)" : "var(--color-primary)",
                        opacity: available ? (isSelected ? 1 : 0.9) : 0.25,
                        borderRadius: "var(--radius)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        fontWeight: isSelected ? 600 : 400,
                        cursor: available ? "pointer" : "not-allowed",
                        padding: 0,
                        textDecoration: !available ? "line-through" : "none",
                      }}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--color-primary)",
                      opacity: 0.6,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Available times · {formatDisplayDate(new Date(selectedDate + "T00:00:00"))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(6rem, 1fr))", gap: "0.5rem" }}>
                    {slotsForDate(selectedDate).map(({ time, taken }) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          disabled={taken}
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: "0.625rem 0.5rem",
                            border: isSelected ? "1px solid var(--color-accent)" : "1px solid rgba(0,0,0,0.15)",
                            background: isSelected ? "var(--color-accent)" : "white",
                            color: "var(--color-primary)",
                            opacity: taken ? 0.4 : 1,
                            textDecoration: taken ? "line-through" : "none",
                            borderRadius: "var(--radius)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.875rem",
                            fontWeight: isSelected ? 600 : 500,
                            cursor: taken ? "not-allowed" : "pointer",
                          }}
                        >
                          {formatTime12(time)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.875rem" }}>
              {props.introText && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    color: "var(--color-primary)",
                    opacity: 0.75,
                    margin: 0,
                  }}
                >
                  {props.introText}
                </p>
              )}

              <FormField label="Name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Email *">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                <FormField label="Event type">
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select…</option>
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Other</option>
                  </select>
                </FormField>
                <FormField label="Guests">
                  <input
                    type="number"
                    min={0}
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                    style={inputStyle}
                  />
                </FormField>
              </div>
              <FormField label="Message (optional)">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </FormField>

              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                aria-hidden="true"
              />

              {createMutation.isError && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(220,38,38,0.08)",
                    border: "1px solid rgba(220,38,38,0.25)",
                    borderRadius: "var(--radius)",
                    color: "#b91c1c",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                  }}
                >
                  {createMutation.error?.message ?? "Something went wrong. Please try again."}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || createMutation.isPending}
                style={{
                  ...pillButton("solid"),
                  marginTop: "0.5rem",
                  alignSelf: "flex-start",
                  opacity: !selectedDate || !selectedTime || createMutation.isPending ? 0.5 : 1,
                  cursor: !selectedDate || !selectedTime ? "not-allowed" : "pointer",
                }}
              >
                {createMutation.isPending
                  ? "Booking…"
                  : !selectedDate
                    ? "Pick a date"
                    : !selectedTime
                      ? "Pick a time"
                      : "Confirm Tour"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function buildMonthGrid(anchor: Date): (Date | null)[] {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const firstDay = new Date(y, m, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.9375rem",
  color: "var(--color-primary)",
  background: "white",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: "var(--radius)",
  boxSizing: "border-box",
  outline: "none",
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
          opacity: 0.6,
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
