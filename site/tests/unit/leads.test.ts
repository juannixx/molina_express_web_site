import { describe, it, expect, vi } from "vitest";
import { noopProvider } from "../../src/lib/leads";

describe("noopProvider", () => {
  it("resolves ok and logs the payload", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await noopProvider.submitLead({ kind: "quote", fields: { name: "Ana" } });
    expect(result.ok).toBe(true);
    expect(spy).toHaveBeenCalledWith("[lead]", "quote", { name: "Ana" });
    spy.mockRestore();
  });
});
