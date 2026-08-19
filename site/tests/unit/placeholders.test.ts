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

  it("catches a bare TODO_ marker with nothing after it", () => {
    expect(scanText('a: "TODO_"')).toEqual([{ line: 1, match: "TODO_" }]);
  });

  it("catches MOCK comment markers", () => {
    const text = 'value: "9,500+", // MOCK: substituir por dado real\nreal: "ok"';
    expect(scanText(text)).toEqual([{ line: 1, match: "// MOCK" }]);
  });

  it("does not match the word mock outside a comment marker", () => {
    expect(scanText('alt: "a mockup of the tracking screen"')).toEqual([]);
  });
});
