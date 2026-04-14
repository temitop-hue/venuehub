import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { ThemeProvider } from "./ThemeProvider";
import { BlockRenderer } from "./BlockRenderer";

export function SiteRoute() {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const effectiveSlug = slug ?? "";
  const effectivePage = pageSlug ?? "home";

  const { data, isLoading, error } = trpc.publicSite.getBySlug.useQuery(
    { slug: effectiveSlug, pageSlug: effectivePage },
    { enabled: Boolean(effectiveSlug) },
  );

  useEffect(() => {
    if (data?.page?.metaTitle) document.title = data.page.metaTitle;
    else if (data?.tenant?.name) document.title = data.tenant.name;
  }, [data]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#f7f3ea",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
        }}
      >
        Loading
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#f7f3ea",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", margin: 0 }}>
          Site not found
        </h1>
        <p style={{ opacity: 0.7, marginTop: "1rem" }}>
          No venue has claimed{" "}
          <code style={{ background: "rgba(255,255,255,0.08)", padding: "0.125rem 0.5rem", borderRadius: "2px" }}>
            /v/{effectiveSlug}
          </code>{" "}
          yet.
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider theme={data.theme}>
      <main>
        {data.blocks.map((block) => (
          <BlockRenderer key={block.id} type={block.blockType} data={block.blockData} />
        ))}
      </main>
    </ThemeProvider>
  );
}
