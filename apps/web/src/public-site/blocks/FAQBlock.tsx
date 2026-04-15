import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQBlockData } from "@venuehub/shared";
import { section, container, eyebrow, heading, subheading, divider } from "../primitives";

export function FAQBlock(props: FAQBlockData) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = new Set<string | null>();
  for (const f of props.faqs) categories.add(f.category?.trim() || null);
  const byCategory = new Map<string | null, typeof props.faqs>();
  for (const f of props.faqs) {
    const key = f.category?.trim() || null;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(f);
  }

  return (
    <section style={{ background: "var(--color-secondary)", ...section("lg") }}>
      <div style={{ ...container("narrow") }}>
        {(props.eyebrow || props.heading || props.subheading) && (
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            {props.eyebrow && <div style={eyebrow}>{props.eyebrow}</div>}
            {props.heading && <h2 style={heading}>{props.heading}</h2>}
            {props.heading && <div style={{ ...divider, marginLeft: "auto", marginRight: "auto" }} />}
            {props.subheading && (
              <p style={{ ...subheading, marginLeft: "auto", marginRight: "auto" }}>{props.subheading}</p>
            )}
          </header>
        )}

        {Array.from(byCategory.entries()).map(([cat, items], catIdx) => (
          <div key={cat ?? "uncategorized"} style={{ marginBottom: cat ? "2rem" : 0 }}>
            {cat && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginBottom: "1rem",
                  marginTop: catIdx === 0 ? 0 : "1rem",
                }}
              >
                {cat}
              </div>
            )}
            {items.map((faq, i) => {
              const globalIdx = props.faqs.indexOf(faq);
              const isOpen = globalIdx === openIndex;
              return (
                <div
                  key={globalIdx}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "1.25rem 0.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.75}
                      style={{
                        transition: "transform 0.25s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        flexShrink: 0,
                        color: "var(--color-accent)",
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 0.25rem 1.5rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        color: "var(--color-primary)",
                        opacity: 0.8,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
