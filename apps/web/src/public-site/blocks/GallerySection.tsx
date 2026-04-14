import React from "react";
import type { GallerySectionData } from "@venuehub/shared";
import { section, container, eyebrow, heading, subheading, divider } from "../primitives";

const GAP: Record<GallerySectionData["gap"], string> = {
  tight: "0.5rem",
  normal: "1rem",
  airy: "1.75rem",
};

const ASPECT: Record<GallerySectionData["aspectRatio"], string> = {
  square: "1 / 1",
  portrait: "3 / 4",
  landscape: "4 / 3",
  auto: "auto",
};

export function GallerySection(props: GallerySectionData) {
  const { heading: h, subheading: sh, eyebrow: ey, layout, columns, gap, aspectRatio, images } = props;

  return (
    <section style={{ background: "var(--color-secondary)", ...section("lg") }}>
      <div style={container("wide")}>
        {(ey || h || sh) && (
          <header style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            {ey && <div style={eyebrow}>{ey}</div>}
            {h && <h2 style={heading}>{h}</h2>}
            {h && <div style={divider} />}
            {sh && <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{sh}</p>}
          </header>
        )}

        {layout === "masonry" ? (
          <div
            style={{
              columnCount: columns,
              columnGap: GAP[gap],
            }}
          >
            {images.map((img, i) => (
              <figure
                key={i}
                style={{
                  breakInside: "avoid",
                  marginBottom: GAP[gap],
                  margin: 0,
                  marginBlockEnd: GAP[gap],
                  overflow: "hidden",
                  borderRadius: "var(--radius)",
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {img.caption && (
                  <figcaption
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8125rem",
                      color: "var(--color-primary)",
                      opacity: 0.65,
                      marginTop: "0.5rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: GAP[gap],
            }}
          >
            {images.map((img, i) => (
              <figure key={i} style={{ margin: 0, overflow: "hidden", borderRadius: "var(--radius)" }}>
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: ASPECT[aspectRatio],
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
