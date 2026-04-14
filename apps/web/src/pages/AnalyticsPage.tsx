import React from "react";
import { trpc } from "../trpc";

export function AnalyticsPage() {
  const summaryQuery = trpc.analytics.summary.useQuery();
  const revenueByVenueQuery = trpc.analytics.revenueByVenue.useQuery();
  const eventTrendsQuery = trpc.analytics.eventTrends.useQuery();
  const statusBreakdownQuery = trpc.analytics.statusBreakdown.useQuery();

  const summary = summaryQuery.data;

  return (
    <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem" }}>Analytics & Reports</h2>

        {summaryQuery.isLoading ? (
          <p>Loading analytics...</p>
        ) : (
          <>
            {/* Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Total Revenue</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a", marginTop: "0.5rem" }}>₹{summary?.totalRevenue.toFixed(2) || 0}</p>
              </div>

              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Advance Collected</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0284c7", marginTop: "0.5rem" }}>₹{summary?.advanceCollected.toFixed(2) || 0}</p>
              </div>

              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Balance Pending</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ca8a04", marginTop: "0.5rem" }}>₹{summary?.balancePending.toFixed(2) || 0}</p>
              </div>

              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#666", fontSize: "0.875rem", fontWeight: "500" }}>Total Guests</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#7c3aed", marginTop: "0.5rem" }}>{summary?.totalGuestCount || 0}</p>
              </div>
            </div>

            {/* Event Status Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }}>Event Status</h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Confirmed</span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: "bold" }}>{summary?.confirmedEvents || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Pending</span>
                    <span style={{ background: "#fef3c7", color: "#ca8a04", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: "bold" }}>{summary?.pendingEvents || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Completed</span>
                    <span style={{ background: "#dbeafe", color: "#0284c7", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: "bold" }}>{summary?.completedEvents || 0}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }}>Overview</h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Events</span>
                    <span style={{ fontWeight: "bold" }}>{summary?.totalEvents || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Venues</span>
                    <span style={{ fontWeight: "bold" }}>{summary?.totalVenues || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue by Venue */}
            {revenueByVenueQuery.data && revenueByVenueQuery.data.length > 0 && (
              <div style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }}>Revenue by Venue</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                    <tr>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Venue Name</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Events</th>
                      <th style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600" }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueByVenueQuery.data.map((venue, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem" }}>{venue.venueName}</td>
                        <td style={{ padding: "0.75rem" }}>{venue.count}</td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#16a34a", fontWeight: "bold" }}>₹{venue.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
    </div>
  );
}
