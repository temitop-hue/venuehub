import React from "react";
import type { FeatureListData } from "@venuehub/shared";
import { section, container, eyebrow, heading, subheading, divider } from "../primitives";

export function FeatureList(props: FeatureListData) {
  const { layout, columns, features, eyebrow: ey, heading: h, subheading: sh } = props;

  return (
    <section style={{ background: "var(--color-secondary)", ...section("lg") }}>
      <div style={container("wide")}>
        {(ey || h || sh) && (
          <header style={{ textAlign: "center", marginBottom: "4rem" }}>
            {ey && <div style={eyebrow}>{ey}</div>}
            {h && <h2 style={heading}>{h}</h2>}
            {h && <div style={divider} />}
            {sh && <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{sh}</p>}
          </header>
        )}

        {layout === "alternating" ? (
          <div style={{ display: "grid", gap: "5rem" }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: f.imageUrl ? "1fr 1fr" : "1fr",
                  gap: "3rem",
                  alignItems: "center",
                  direction: i % 2 === 1 ? "rtl" : "ltr",
                }}
              >
                {f.imageUrl && (
                  <div style={{ direction: "ltr", overflow: "hidden", borderRadius: "var(--radius)", aspectRatio: "4/3" }}>
                    <img
                      src={f.imageUrl}
                      alt=""
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}
                <div style={{ direction: "ltr" }}>
                  {f.icon && <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>}
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 400,
                      margin: 0,
                      color: "var(--color-primary)",
                    }}
                  >
                    {f.title}
                  </h3>
                  {f.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        lineHeight: 1.75,
                        marginTop: "1rem",
                        color: "var(--color-primary)",
                        opacity: 0.75,
                      }}
                    >
                      {f.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${columns >= 4 ? "16rem" : "18rem"}, 1fr))`,
              gap: "2.5rem",
            }}
          >
            {features.map((f, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                {f.icon && (
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1.25rem",
                      color: "var(--color-accent)",
                    }}
                  >
                    {f.icon}
                  </div>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.375rem",
                    fontWeight: 500,
                    margin: 0,
                    color: "var(--color-primary)",
                  }}
                >
                  {f.title}
                </h3>
                {f.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                      marginTop: "0.75rem",
                      color: "var(--color-primary)",
                      opacity: 0.7,
                    }}
                  >
                    {f.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
