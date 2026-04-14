import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("emits header and rows", () => {
    const csv = toCsv([{ id: 1, name: "Alice" }], [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
    ]);
    expect(csv).toBe("ID,Name\n1,Alice");
  });

  it("escapes commas, quotes, and newlines", () => {
    const csv = toCsv(
      [{ note: 'has "quotes", a comma, and\na newline' }],
      [{ key: "note", label: "Note" }],
    );
    expect(csv).toBe('Note\n"has ""quotes"", a comma, and\na newline"');
  });

  it("renders null and undefined as empty cells", () => {
    const csv = toCsv(
      [{ a: null, b: undefined, c: "x" }],
      [
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ],
    );
    expect(csv).toBe("A,B,C\n,,x");
  });

  it("serializes Date values as ISO strings", () => {
    const csv = toCsv(
      [{ at: new Date("2026-04-14T12:00:00Z") }],
      [{ key: "at", label: "At" }],
    );
    expect(csv).toBe("At\n2026-04-14T12:00:00.000Z");
  });

  it("produces header-only output for an empty row list", () => {
    const csv = toCsv([] as { id: number }[], [{ key: "id", label: "ID" }]);
    expect(csv).toBe("ID\n");
  });
});
