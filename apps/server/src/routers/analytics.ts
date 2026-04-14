import { protectedProcedure, router } from "../trpc";
import { db, events, venues } from "@venuehub/db";
import { eq, and, gte } from "drizzle-orm";

export const analyticsRouter = router({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await db.query.events.findMany({
      where: (events, { eq }) => eq(events.tenantId, ctx.tenantId),
    });

    const allVenues = await db.query.venues.findMany({
      where: (venues, { eq }) => eq(venues.tenantId, ctx.tenantId),
    });

    const totalRevenue = allEvents.reduce((sum, event) => {
      return sum + (parseFloat(event.totalAmount?.toString() || "0"));
    }, 0);

    const advanceCollected = allEvents.reduce((sum, event) => {
      return sum + (parseFloat(event.advanceAmount?.toString() || "0"));
    }, 0);

    const confirmedEvents = allEvents.filter((e) => e.status === "confirmed").length;
    const pendingEvents = allEvents.filter((e) => e.status === "pending").length;
    const completedEvents = allEvents.filter((e) => e.status === "completed").length;

    const totalGuestCount = allEvents.reduce((sum, event) => {
      return sum + (event.guestCount || 0);
    }, 0);

    return {
      totalEvents: allEvents.length,
      totalVenues: allVenues.length,
      totalRevenue,
      advanceCollected,
      balancePending: totalRevenue - advanceCollected,
      confirmedEvents,
      pendingEvents,
      completedEvents,
      totalGuestCount,
    };
  }),

  revenueByVenue: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await db.query.events.findMany({
      where: (events, { eq }) => eq(events.tenantId, ctx.tenantId),
    });

    const allVenues = await db.query.venues.findMany({
      where: (venues, { eq }) => eq(venues.tenantId, ctx.tenantId),
    });

    const revenueMap = new Map<number, { venueName: string; revenue: number; count: number }>();

    allVenues.forEach((venue) => {
      revenueMap.set(venue.id, { venueName: venue.name, revenue: 0, count: 0 });
    });

    allEvents.forEach((event) => {
      const existing = revenueMap.get(event.venueId) || { venueName: "Unknown", revenue: 0, count: 0 };
      existing.revenue += parseFloat(event.totalAmount?.toString() || "0");
      existing.count += 1;
      revenueMap.set(event.venueId, existing);
    });

    return Array.from(revenueMap.values());
  }),

  eventTrends: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await db.query.events.findMany({
      where: (events, { eq }) => eq(events.tenantId, ctx.tenantId),
    });

    // Group by month
    const trendMap = new Map<string, { month: string; count: number; revenue: number }>();

    allEvents.forEach((event) => {
      const date = new Date(event.eventDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = trendMap.get(monthKey) || { month: monthKey, count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += parseFloat(event.totalAmount?.toString() || "0");
      trendMap.set(monthKey, existing);
    });

    return Array.from(trendMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }),

  statusBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const allEvents = await db.query.events.findMany({
      where: (events, { eq }) => eq(events.tenantId, ctx.tenantId),
    });

    const statusMap = new Map<string, number>();
    allEvents.forEach((event) => {
      statusMap.set(event.status, (statusMap.get(event.status) || 0) + 1);
    });

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));
  }),
});
