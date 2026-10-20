import { describe, expect, it } from "vitest";
import { formatReference, parseReference } from "@/lib/reference";

describe("formatReference", () => {
  it("pads the sequence to six digits", () => {
    expect(formatReference(new Date("2026-10-19T12:00:00Z"), 123)).toBe("UPR-2026-000123");
  });
  it("uses the Saskatchewan year, not UTC (just after UTC midnight on Jan 1 is still Dec 31 in Regina)", () => {
    expect(formatReference(new Date("2026-01-01T05:30:00Z"), 7)).toBe("UPR-2025-000007");
  });
});

describe("parseReference", () => {
  it("parses a valid reference, ignoring case and surrounding spaces", () => {
    expect(parseReference("  upr-2026-000123 ")).toEqual({ year: 2026, seq: 123 });
  });
  it.each(["", "UPR-2026-123", "UPR-26-000123", "ABC-2026-000123", "UPR-2026-000000", "UPR-2026-000123; DROP TABLE"])(
    "rejects %j",
    (bad) => expect(parseReference(bad)).toBeNull(),
  );
});

