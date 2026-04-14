import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f6f6f2",
        color: "#17171a",
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>{children}</main>
      </div>
    </div>
  );
}
