import { describe, it, expect } from "vitest";
import { scanText } from "../../scripts/placeholders.mjs";

describe("scanText", () => {
  it("finds TODO_ markers with line numbers", () => {
    const text = 'a: "ok"\nb: "TODO_deliveries_per_month"\nc: "TODO_on_time_rate"';
    expect(scanText(text)).toEqual([
      { line: 2, match: "TODO_deliveries_per_month" },
      { line: 3, match: "TODO_on_time_rate" },
    ]);
  });

  it("returns empty array when clean", () => {
    expect(scanText('a: "all real data"')).toEqual([]);
  });

  it("does not match the word TODO without underscore", () => {
    expect(scanText("// TODO fix later")).toEqual([]);
  });
});
